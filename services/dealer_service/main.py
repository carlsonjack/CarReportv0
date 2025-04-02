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
    title="CarReport Dealer Dashboard Service",
    description="Manages dealer subscriptions, leads, and CRM integration",
    version="1.0.0"
)

# Configuration
REPORT_SERVICE_URL = os.getenv("REPORT_SERVICE_URL", "http://localhost:8001")

# Redis connection
redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = os.getenv("REDIS_PORT", 6379)
redis_client = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)

# OAuth2 scheme for authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Models
class Dealer(BaseModel):
    id: str
    name: str
    address: str
    city: str
    state: str
    zip_code: str
    phone: str
    email: str
    website: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
class DealerSubscription(BaseModel):
    id: str
    dealer_id: str
    plan: str
    status: str
    start_date: datetime
    end_date: datetime
    
class Lead(BaseModel):
    id: str
    dealer_id: str
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    vehicle_of_interest: Optional[str] = None
    vin: Optional[str] = None
    report_id: Optional[str] = None
    status: str  # new, contacted, qualified, sold, lost
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
class LeadCreate(BaseModel):
    dealer_id: str
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    vehicle_of_interest: Optional[str] = None
    vin: Optional[str] = None
    report_id: Optional[str] = None
    notes: Optional[str] = None
    
class LeadUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    
class DealerStats(BaseModel):
    total_leads: int
    new_leads: int
    qualified_leads: int
    conversion_rate: float
    reports_generated: int
    
class DealerDashboard(BaseModel):
    dealer: Dealer
    subscription: DealerSubscription
    stats: DealerStats
    recent_leads: List[Lead]

# Helper functions
def get_dealer(dealer_id: str) -> Optional[Dealer]:
    """Get dealer information"""
    # In a real implementation, this would query the database
    # For demo purposes, we're returning mock data
    if dealer_id == "demo-dealer":
        return Dealer(
            id=dealer_id,
            name="Demo Dealership",
            address="123 Main St",
            city="Los Angeles",
            state="CA",
            zip_code="90001",
            phone="555-123-4567",
            email="info@demodealership.com",
            website="https://demodealership.com",
            created_at=datetime.utcnow() - timedelta(days=365),
            updated_at=datetime.utcnow()
        )
    return None

def get_dealer_subscription(dealer_id: str) -> Optional[DealerSubscription]:
    """Get dealer subscription information"""
    # In a real implementation, this would query the database
    # For demo purposes, we're returning mock data
    if dealer_id == "demo-dealer":
        return DealerSubscription(
            id=str(uuid.uuid4()),
            dealer_id=dealer_id,
            plan="premium",
            status="active",
            start_date=datetime.utcnow() - timedelta(days=30),
            end_date=datetime.utcnow() + timedelta(days=335)
        )
    return None

def get_dealer_leads(dealer_id: str, limit: int = 10) -> List[Lead]:
    """Get dealer leads"""
    # In a real implementation, this would query the database
    # For demo purposes, we're returning mock data
    if dealer_id == "demo-dealer":
        return [
            Lead(
                id=str(uuid.uuid4()),
                dealer_id=dealer_id,
                customer_name="John Smith",
                customer_email="john.smith@example.com",
                customer_phone="555-987-6543",
                vehicle_of_interest="2018 Toyota Camry SE",
                vin="1HGCM82633A123456",
                report_id="report-123",
                status="new",
                notes="Interested in financing options",
                created_at=datetime.utcnow() - timedelta(days=2),
                updated_at=datetime.utcnow() - timedelta(days=2)
            ),
            Lead(
                id=str(uuid.uuid4()),
                dealer_id=dealer_id,
                customer_name="Jane Doe",
                customer_email="jane.doe@example.com",
                customer_phone="555-456-7890",
                vehicle_of_interest="2019 Honda Accord",
                vin="1HGCV1F34KA123456",
                report_id="report-456",
                status="contacted",
                notes="Scheduled test drive for Saturday",
                created_at=datetime.utcnow() - timedelta(days=5),
                updated_at=datetime.utcnow() - timedelta(days=3)
            )
        ]
    return []

def get_dealer_stats(dealer_id: str) -> DealerStats:
    """Get dealer statistics"""
    # In a real implementation, this would query the database
    # For demo purposes, we're returning mock data
    if dealer_id == "demo-dealer":
        return DealerStats(
            total_leads=25,
            new_leads=8,
            qualified_leads=12,
            conversion_rate=0.48,  # 48%
            reports_generated=42
        )
    return DealerStats(
        total_leads=0,
        new_leads=0,
        qualified_leads=0,
        conversion_rate=0.0,
        reports_generated=0
    )

def publish_lead_event(lead: Lead, event_type: str):
    """Publish lead event to Redis for CRM integration"""
    event = {
        "event_type": event_type,
        "lead_id": lead.id,
        "dealer_id": lead.dealer_id,
        "customer_email": lead.customer_email,
        "status": lead.status,
        "timestamp": datetime.utcnow().isoformat()
    }
    redis_client.publish("crm_events", json.dumps(event))

# Routes
@app.get("/dealers/{dealer_id}", response_model=Dealer)
async def get_dealer_info(dealer_id: str, token: str = Depends(oauth2_scheme)):
    dealer = get_dealer(dealer_id)
    if not dealer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dealer not found"
        )
    return dealer

@app.get("/dealers/{dealer_id}/dashboard", response_model=DealerDashboard)
async def get_dealer_dashboard(dealer_id: str, token: str = Depends(oauth2_scheme)):
    dealer = get_dealer(dealer_id)
    if not dealer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dealer not found"
        )
    
    subscription = get_dealer_subscription(dealer_id)
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found"
        )
    
    stats = get_dealer_stats(dealer_id)
    recent_leads = get_dealer_leads(dealer_id, limit=5)
    
    return DealerDashboard(
        dealer=dealer,
        subscription=subscription,
        stats=stats,
        recent_leads=recent_leads
    )

@app.get("/dealers/{dealer_id}/leads", response_model=List[Lead])
async def get_dealer_leads_endpoint(
    dealer_id: str,
    limit: int = 10,
    offset: int = 0,
    status: Optional[str] = None,
    token: str = Depends(oauth2_scheme)
):
    dealer = get_dealer(dealer_id)
    if not dealer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dealer not found"
        )
    
    leads = get_dealer_leads(dealer_id)
    
    # Filter by status if provided
    if status:
        leads = [lead for lead in leads if lead.status == status]
    
    # Apply pagination
    leads = leads[offset:offset + limit]
    
    return leads

@app.post("/dealers/{dealer_id}/leads", response_model=Lead)
async def create_lead(
    dealer_id: str,
    lead_data: LeadCreate,
    token: str = Depends(oauth2_scheme)
):
    dealer = get_dealer(dealer_id)
    if not dealer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dealer not found"
        )
    
    # Create new lead
    lead_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    lead = Lead(
        id=lead_id,
        dealer_id=dealer_id,
        customer_name=lead_data.customer_name,
        customer_email=lead_data.customer_email,
        customer_phone=lead_data.customer_phone,
        vehicle_of_interest=lead_data.vehicle_of_interest,
        vin=lead_data.vin,
        report_id=lead_data.report_id,
        status="new",
        notes=lead_data.notes,
        created_at=now,
        updated_at=now
    )
    
    # In a real implementation, you would save the lead to the database
    
    # Publish lead created event for CRM integration
    publish_lead_event(lead, "lead_created")
    
    return lead

@app.put("/dealers/{dealer_id}/leads/{lead_id}", response_model=Lead)
async def update_lead(
    dealer_id: str,
    lead_id: str,
    lead_data: LeadUpdate,
    token: str = Depends(oauth2_scheme)
):
    dealer = get_dealer(dealer_id)
    if not dealer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dealer not found"
        )
    
    # In a real implementation, you would fetch the lead from the database
    # For demo purposes, we're creating a mock lead
    lead = Lead(
        id=lead_id,
        dealer_id=dealer_id,
        customer_name="John Smith",
        customer_email="john.smith@example.com",
        customer_phone="555-987-6543",
        vehicle_of_interest="2018 Toyota Camry SE",
        vin="1HGCM82633A123456",
        report_id="report-123",
        status="new",
        notes="Interested in financing options",
        created_at=datetime.utcnow() - timedelta(days=2),
        updated_at=datetime.utcnow() - timedelta(days=2)
    )
    
    # Update lead
    if lead_data.status:
        lead.status = lead_data.status
    
    if lead_data.notes:
        lead.notes = lead_data.notes
    
    lead.updated_at = datetime.utcnow()
    
    # In a real implementation, you would save the updated lead to the database
    
    # Publish lead updated event for CRM integration
    publish_lead_event(lead, "lead_updated")
    
    return lead

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)

