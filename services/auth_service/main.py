from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
import os
import redis
import json
import uuid

# Initialize FastAPI app
app = FastAPI(
    title="CarReport Authentication Service",
    description="Handles user authentication, registration, and profile management",
    version="1.0.0"
)

# Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Redis connection
redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = os.getenv("REDIS_PORT", 6379)
redis_client = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Models
class User(BaseModel):
    id: str
    username: str
    email: str
    full_name: Optional[str] = None
    disabled: Optional[bool] = None
    
class UserInDB(User):
    hashed_password: str
    
class Token(BaseModel):
    access_token: str
    token_type: str
    
class TokenData(BaseModel):
    username: Optional[str] = None
    
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: Optional[str] = None

class Subscription(BaseModel):
    id: str
    user_id: str
    plan: str
    status: str
    start_date: datetime
    end_date: datetime
    
# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(username: str):
    # In a real implementation, this would query the database
    # For demo purposes, we're using Redis
    user_data = redis_client.get(f"user:{username}")
    if user_data:
        user_dict = json.loads(user_data)
        return UserInDB(**user_dict)
    return None

def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except jwt.PyJWTError:
        raise credentials_exception
    user = get_user(token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# Routes
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=User)
async def create_user(user: UserCreate):
    db_user = get_user(user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user.password)
    user_data = {
        "id": user_id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "disabled": False,
        "hashed_password": hashed_password
    }
    
    # Store in Redis (in production, use PostgreSQL)
    redis_client.set(f"user:{user.username}", json.dumps(user_data))
    
    # Publish user created event
    event = {
        "event_type": "user_created",
        "user_id": user_id,
        "timestamp": datetime.utcnow().isoformat()
    }
    redis_client.publish("user_events", json.dumps(event))
    
    return User(
        id=user_id,
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        disabled=False
    )

@app.get("/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@app.get("/users/me/subscriptions/", response_model=List[Subscription])
async def read_user_subscriptions(current_user: User = Depends(get_current_active_user)):
    # In a real implementation, this would query the database
    # For demo purposes, we're returning mock data
    return [
        Subscription(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            plan="basic",
            status="active",
            start_date=datetime.utcnow() - timedelta(days=30),
            end_date=datetime.utcnow() + timedelta(days=30)
        )
    ]

@app.post("/users/me/subscriptions/", response_model=Subscription)
async def create_subscription(
    plan: str,
    current_user: User = Depends(get_current_active_user)
):
    # In a real implementation, this would create a subscription in the database
    # and handle payment processing
    subscription_id = str(uuid.uuid4())
    subscription = Subscription(
        id=subscription_id,
        user_id=current_user.id,
        plan=plan,
        status="active",
        start_date=datetime.utcnow(),
        end_date=datetime.utcnow() + timedelta(days=30)
    )
    
    # Publish subscription created event
    event = {
        "event_type": "subscription_created",
        "user_id": current_user.id,
        "subscription_id": subscription_id,
        "plan": plan,
        "timestamp": datetime.utcnow().isoformat()
    }
    redis_client.publish("subscription_events", json.dumps(event))
    
    return subscription

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

