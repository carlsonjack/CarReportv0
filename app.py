from typing import Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
import numpy as np

# Security dependencies
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Dummy user database (replace with a real database in production)
users = {
    "testuser": {"password": "testpassword", "scopes": ["read"]},
    "adminuser": {"password": "adminpassword", "scopes": ["read", "write"]},
}

# FastAPI app instance
app = FastAPI()

# Models
class Token(BaseModel):
    access_token: str
    token_type: str

class Message(BaseModel):
    message: str

class CarReport(BaseModel):
    make: str
    model: str
    year: int
    description: str

# Authentication functions
def authenticate_user(username, password):
    user = users.get(username)
    if user and user["password"] == password:
        return user
    return None

def create_access_token(data: dict):
    # In a real application, you would use a JWT library to create a secure token
    # For simplicity, we'll just return a dummy token
    return "dummy_access_token"

# Dependency to get the current user
async def get_current_user(token: str = Depends(oauth2_scheme)):
    # In a real application, you would verify the token and retrieve the user from the database
    # For simplicity, we'll just return a dummy user based on the token
    if token == "dummy_access_token":
        return {"username": "testuser", "scopes": ["read"]}
    raise HTTPException(status_code=401, detail="Invalid token")

# Dependency to check for required scopes
def required_scopes(required_scopes: list):
    async def check_scopes(current_user: dict = Depends(get_current_user)):
        if not all(scope in current_user.get("scopes", []) for scope in required_scopes):
            raise HTTPException(status_code=403, detail="Not enough permissions")
        return current_user
    return check_scopes

# Endpoints
@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/items/", response_model=Message)
async def read_items(current_user: dict = Depends(get_current_user)):
    return {"message": "Hello World"}

@app.post("/car_report/", response_model=Message)
async def create_car_report(car_report: CarReport, current_user: dict = Depends(required_scopes(["write"]))):
    return {"message": f"Car report created for {car_report.make} {car_report.model}"}

from causal_impact import DealerImpactAnalyzer
import pandas as pd
from datetime import datetime, timedelta

class DealerImpactRequest(BaseModel):
    dealer_id: int
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    intervention_date: Optional[str] = None
    average_order_value: Optional[float] = 45000.0
    average_margin: Optional[float] = 3000.0

class DealerImpactResponse(BaseModel):
    summary: dict
    chart_data: dict
    report_text: str

@app.post("/dealers/{dealer_id}/impact", response_model=DealerImpactResponse)
async def analyze_dealer_impact(
    dealer_id: int,
    request: DealerImpactRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Analyze the causal impact of CarReport on dealer sales
    """
    # Set default dates if not provided
    end_date = request.end_date or datetime.utcnow().strftime('%Y-%m-%d')
    
    # Default start date is 90 days before end date
    if not request.start_date:
        end_date_obj = datetime.strptime(end_date, '%Y-%m-%d')
        start_date_obj = end_date_obj - timedelta(days=90)
        start_date = start_date_obj.strftime('%Y-%m-%d')
    else:
        start_date = request.start_date
    
    # Default intervention date is 30 days after start date
    if not request.intervention_date:
        start_date_obj = datetime.strptime(start_date, '%Y-%m-%d')
        intervention_date_obj = start_date_obj + timedelta(days=30)
        intervention_date = intervention_date_obj.strftime('%Y-%m-%d')
    else:
        intervention_date = request.intervention_date
    
    # In a real application, we would fetch this data from the database
    # For this example, we'll generate mock data
    
    # Generate dates
    date_range = pd.date_range(start=start_date, end=end_date)
    dates = date_range.strftime('%Y-%m-%d').tolist()
    
    # Generate mock data
    np.random.seed(42)  # For reproducibility
    
    # Baseline sales (what would happen without CarReport)
    baseline_sales = [10 + i * 0.1 + np.random.normal(0, 2) for i in range(len(dates))]
    
    # Actual sales (with CarReport effect after intervention)
    sales = []
    intervention_idx = dates.index(intervention_date)
    
    for i in range(len(dates)):
        if i < intervention_idx:
            # Before intervention, sales follow baseline
            sales.append(baseline_sales[i])
        else:
            # After intervention, sales increase by 30% on average
            effect = baseline_sales[i] * 0.3 * (1 - np.exp(-(i - intervention_idx) / 10))
            sales.append(baseline_sales[i] + effect + np.random.normal(0, 2))
    
    # Generate leads data (approximately 3x sales)
    leads = [s * 3 + np.random.normal(0, 5) for s in sales]
    
    # Create dealer data dictionary
    dealer_data = {
        "dates": dates,
        "leads": leads,
        "sales": sales,
        "baseline_sales": baseline_sales
    }
    
    # Run causal impact analysis
    analyzer = DealerImpactAnalyzer()
    result = analyzer.analyze_dealer_impact(
        dealer_data,
        start_date,
        end_date,
        intervention_date,
        request.average_order_value,
        request.average_margin
    )
    
    return result

