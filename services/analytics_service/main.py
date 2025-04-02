from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import redis
import json
import os
import uuid

# Initialize FastAPI app
app = FastAPI(
    title="CarReport Analytics & Monitoring Service",
    description="Tracks usage metrics and provides monitoring for the CarReport platform",
    version="1.0.0"
)

# Configuration
REDIS_EXPIRY = 60 * 60 * 24 * 7  # 7 days

# Redis connection
redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = os.getenv("REDIS_PORT", 6379)
redis_client = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)

# OAuth2 scheme for authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Models
class TimeRange(BaseModel):
    start_date: datetime
    end_date: datetime

class ReportMetrics(BaseModel):
    total_reports: int
    unique_vins: int
    reports_by_day: Dict[str, int]
    
class APIMetrics(BaseModel):
    total_requests: int
    average_response_time: float  # in milliseconds
    error_rate: float  # percentage
    requests_by_endpoint: Dict[str, int]
    
class UserMetrics(BaseModel):
    total_users: int
    active_users: int
    new_users: int
    
class SearchMetrics(BaseModel):
    total_searches: int
    top_makes: List[Dict[str, Any]]
    top_models: List[Dict[str, Any]]
    top_locations: List[Dict[str, Any]]
    
class DealerMetrics(BaseModel):
    total_dealers: int
    active_dealers: int
    total_leads: int
    conversion_rate: float
    
class SystemMetrics(BaseModel):
    cpu_usage: float
    memory_usage: float
    disk_usage: float
    api_health: Dict[str, str]

# Helper functions
def get_date_range(days: int) -> TimeRange:
    """Get date range for the last N days"""
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    return TimeRange(start_date=start_date, end_date=end_date)

def get_report_metrics(time_range: TimeRange) -> ReportMetrics:
    """Get report generation metrics"""
    # In a real implementation, you would query Redis or a time-series database
    # For demo purposes, we're returning mock data
    
    # Generate mock data for reports by day
    reports_by_day = {}
    current_date = time_range.start_date
    while current_date <= time_range.end_date:
        date_str = current_date.strftime("%Y-%m-%d")
        # Generate a random number between 50 and 200
        reports_by_day[date_str] = 50 + (hash(date_str) % 150)
        current_date += timedelta(days=1)
    
    total_reports = sum(reports_by_day.values())
    unique_vins = int(total_reports * 0.8)  # Assume 80% unique VINs
    
    return ReportMetrics(
        total_reports=total_reports,
        unique_vins=unique_vins,
        reports_by_day=reports_by_day
    )

def get_api_metrics(time_range: TimeRange) -> APIMetrics:
    """Get API performance metrics"""
    # Mock data
    return APIMetrics(
        total_requests=15000,
        average_response_time=120.5,
        error_rate=1.2,
        requests_by_endpoint={
            "/reports/": 8000,
            "/ai/conversations/": 4000,
            "/dealers/": 2000,
            "/auth/": 1000
        }
    )

def get_user_metrics(time_range: TimeRange) -> UserMetrics:
    """Get user metrics"""
    # Mock data
    return UserMetrics(
        total_users=5000,
        active_users=2000,
        new_users=500
    )

def get_search_metrics(time_range: TimeRange) -> SearchMetrics:
    """Get search metrics"""
    # Mock data
    return SearchMetrics(
        total_searches=12000,
        top_makes=[
            {"name": "Toyota", "count": 3000},
            {"name": "Honda", "count": 2500},
            {"name": "Ford", "count": 2000},
            {"name": "Chevrolet", "count": 1500},
            {"name": "BMW", "count": 1000}
        ],
        top_models=[
            {"name": "Camry", "count": 1500},
            {"name": "Accord", "count": 1200},
            {"name": "F-150", "count": 1000},
            {"name": "Civic", "count": 800},
            {"name": "Silverado", "count": 700}
        ],
        top_locations=[
            {"name": "Los Angeles, CA", "count": 2000},
            {"name": "New York, NY", "count": 1800},
            {"name": "Chicago, IL", "count": 1200},
            {"name": "Houston, TX", "count": 1000},
            {"name": "Phoenix, AZ", "count": 800}
        ]
    )

def get_dealer_metrics(time_range: TimeRange) -> DealerMetrics:
    """Get dealer metrics"""
    # Mock data
    return DealerMetrics(
        total_dealers=500,
        active_dealers=350,
        total_leads=3000,
        conversion_rate=0.12
    )

def get_system_metrics() -> SystemMetrics:
    """Get system health metrics"""
    # Mock data
    return SystemMetrics(
        cpu_usage=45.2,
        memory_usage=62.8,
        disk_usage=38.5,
        api_health={
            "auth_service": "healthy",
            "report_service": "healthy",
            "ai_agent_service": "healthy",
            "dealer_service": "healthy",
            "crm_service": "healthy"
        }
    )

def log_event(event_type: str, data: Dict[str, Any]):
    """Log event to Redis for analytics"""
    now = datetime.utcnow()
    date_key = now.strftime("%Y-%m-%d")
    hour_key = now.strftime("%H")
    
    # Increment daily counter
    redis_client.hincrby(f"analytics:daily:{date_key}", event_type, 1)
    
    # Increment hourly counter
    redis_client.hincrby(f"analytics:hourly:{date_key}:{hour_key}", event_type, 1)
    
    # Store event details if needed
    event_id = str(uuid.uuid4())
    event_data = {
        "id": event_id,
        "type": event_type,
        "timestamp": now.isoformat(),
        "data": json.dumps(data)
    }
    redis_client.hmset(f"analytics:event:{event_id}", event_data)
    redis_client.expire(f"analytics:event:{event_id}", REDIS_EXPIRY)

# Routes
@app.get("/analytics/reports", response_model=ReportMetrics)
async def get_report_analytics(
    days: int = 30,
    token: str = Depends(oauth2_scheme)
):
    time_range = get_date_range(days)
    return get_report_metrics(time_range)

@app.get("/analytics/api", response_model=APIMetrics)
async def get_api_analytics(
    days: int = 7,
    token: str = Depends(oauth2_scheme)
):
    time_range = get_date_range(days)
    return get_api_metrics(time_range)

@app.get("/analytics/users", response_model=UserMetrics)
async def get_user_analytics(
    days: int = 30,
    token: str = Depends(oauth2_scheme)
):
    time_range = get_date_range(days)
    return get_user_metrics(time_range)

@app.get("/analytics/searches", response_model=SearchMetrics)
async def get_search_analytics(
    days: int = 30,
    token: str = Depends(oauth2_scheme)
):
    time_range = get_date_range(days)
    return get_search_metrics(time_range)

@app.get("/analytics/dealers", response_model=DealerMetrics)
async def get_dealer_analytics(
    days: int = 30,
    token: str = Depends(oauth2_scheme)
):
    time_range = get_date_range(days)
    return get_dealer_metrics(time_range)

@app.get("/monitoring/system", response_model=SystemMetrics)
async def get_system_health(token: str = Depends(oauth2_scheme)):
    return get_system_metrics()

@app.post("/analytics/events", status_code=status.HTTP_202_ACCEPTED)
async def log_analytics_event(
    event_type: str,
    data: Dict[str, Any],
    token: str = Depends(oauth2_scheme)
):
    log_event(event_type, data)
    return {"status": "accepted"}

# Background task to listen for Redis pub/sub messages
@app.on_event("startup")
async def startup_event():
    # In a real implementation, you would set up a background task to listen for Redis pub/sub messages
    # For demo purposes, we're not implementing this
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)

