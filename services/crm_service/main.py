from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
import httpx
import redis
import json
import os
import uuid
import asyncio

# Initialize FastAPI app
app = FastAPI(
    title="CarReport CRM Integration Service",
    description="Integrates with external CRM systems like HubSpot, Salesforce, and DealerSocket",
    version="1.0.0"
)

# Configuration
HUBSPOT_API_KEY = os.getenv("HUBSPOT_API_KEY", "demo-key")
SALESFORCE_API_KEY = os.getenv("SALESFORCE_API_KEY", "demo-key")
DEALERSOCKET_API_KEY = os.getenv("DEALERSOCKET_API_KEY", "demo-key")

# Redis connection
redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = os.getenv("REDIS_PORT", 6379)
redis_client = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)

# OAuth2 scheme for authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Models
class CRMProvider(BaseModel):
    id: str
    name: str
    api_key: str
    webhook_url: Optional[str] = None
    is_active: bool
    
class CRMProviderCreate(BaseModel):
    name: str
    api_key: str
    webhook_url: Optional[str] = None
    
class CRMProviderUpdate(BaseModel):
    api_key: Optional[str] = None
    webhook_url: Optional[str] = None
    is_active: Optional[bool] = None
    
class CRMContact(BaseModel):
    id: str
    crm_provider_id: str
    external_id: str
    email: str
    name: str
    phone: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
class CRMDeal(BaseModel):
    id: str
    crm_provider_id: str
    external_id: str
    contact_id: str
    dealer_id: str
    lead_id: str
    vehicle_of_interest: Optional[str] = None
    vin: Optional[str] = None
    status: str
    amount: Optional[float] = None
    created_at: datetime
    updated_at: datetime
    
class CRMSyncLog(BaseModel):
    id: str
    crm_provider_id: str
    entity_type: str  # contact, deal
    entity_id: str
    action: str  # create, update
    status: str  # success, failed
    error_message: Optional[str] = None
    created_at: datetime
    
class CRMSyncStatus(BaseModel):
    provider: str
    last_sync: datetime
    status: str
    total_contacts: int
    total_deals: int
    
class CRMWebhookPayload(BaseModel):
    provider: str
    event_type: str
    entity_type: str
    entity_id: str
    data: Dict[str, Any]

# Helper functions
async def sync_contact_to_hubspot(contact: Dict[str, Any]) -> str:
    """Sync contact to HubSpot"""
    # In a real implementation, this would call the HubSpot API
    # For demo purposes, we're returning a mock external ID
    await asyncio.sleep(0.5)  # Simulate API call
    return f"hubspot-contact-{uuid.uuid4()}"

async def sync_contact_to_salesforce(contact: Dict[str, Any]) -> str:
    """Sync contact to Salesforce"""
    # In a real implementation, this would call the Salesforce API
    # For demo purposes, we're returning a mock external ID
    await asyncio.sleep(0.5)  # Simulate API call
    return f"salesforce-contact-{uuid.uuid4()}"

async def sync_contact_to_dealersocket(contact: Dict[str, Any]) -> str:
    """Sync contact to DealerSocket"""
    # In a real implementation, this would call the DealerSocket API
    # For demo purposes, we're returning a mock external ID
    await asyncio.sleep(0.5)  # Simulate API call
    return f"dealersocket-contact-{uuid.uuid4()}"

async def sync_deal_to_hubspot(deal: Dict[str, Any]) -> str:
    """Sync deal to HubSpot"""
    # In a real implementation, this would call the HubSpot API
    # For demo purposes, we're returning a mock external ID
    await asyncio.sleep(0.5)  # Simulate API call
    return f"hubspot-deal-{uuid.uuid4()}"

async def sync_deal_to_salesforce(deal: Dict[str, Any]) -> str:
    """Sync deal to Salesforce"""
    # In a real implementation, this would call the Salesforce API
    # For demo purposes, we're returning a mock external ID
    await asyncio.sleep(0.5)  # Simulate API call
    return f"salesforce-deal-{uuid.uuid4()}"

async def sync_deal_to_dealersocket(deal: Dict[str, Any]) -> str:
    """Sync deal to DealerSocket"""
    # In a real implementation, this would call the DealerSocket API
    # For demo purposes, we're returning a mock external ID
    await asyncio.sleep(0.5)  # Simulate API call
    return f"dealersocket-deal-{uuid.uuid4()}"

async def sync_contact(provider: str, contact: Dict[str, Any]) -> str:
    """Sync contact to the specified CRM provider"""
    if provider.lower() == "hubspot":
        return await sync_contact_to_hubspot(contact)
    elif provider.lower() == "salesforce":
        return await sync_contact_to_salesforce(contact)
    elif provider.lower() == "dealersocket":
        return await sync_contact_to_dealersocket(contact)
    else:
        raise ValueError(f"Unsupported CRM provider: {provider}")

async def sync_deal(provider: str, deal: Dict[str, Any]) -> str:
    """Sync deal to the specified CRM provider"""
    if provider.lower() == "hubspot":
        return await sync_deal_to_hubspot(deal)
    elif provider.lower() == "salesforce":
        return await sync_deal_to_salesforce(deal)
    elif provider.lower() == "dealersocket":
        return await sync_deal_to_dealersocket(deal)
    else:
        raise ValueError(f"Unsupported CRM provider: {provider}")

def log_sync(
    crm_provider_id: str,
    entity_type: str,
    entity_id: str,
    action: str,
    status: str,
    error_message: Optional[str] = None
):
    """Log CRM sync activity"""
    log = CRMSyncLog(
        id=str(uuid.uuid4()),
        crm_provider_id=crm_provider_id,
        entity_type=entity_type,
        entity_id=entity_id,
        action=action,
        status=status,
        error_message=error_message,
        created_at=datetime.utcnow()
    )
    
    # In a real implementation, you would save the log to the database
    
    # Publish sync event for analytics
    event = {
        "event_type": "crm_sync",
        "crm_provider_id": crm_provider_id,
        "entity_type": entity_type,
        "entity_id": entity_id,
        "action": action,
        "status": status,
        "timestamp": datetime.utcnow().isoformat()
    }
    redis_client.publish("analytics_events", json.dumps(event))

async def process_lead_event(event_data: Dict[str, Any], background_tasks: BackgroundTasks):
    """Process lead event from Redis pub/sub"""
    event_type = event_data.get("event_type")
    lead_id = event_data.get("lead_id")
    dealer_id = event_data.get("dealer_id")
    customer_email = event_data.get("customer_email")
    status = event_data.get("status")
    
    if not all([event_type, lead_id, dealer_id, customer_email]):
        return
    
    # Get active CRM providers for the dealer
    # In a real implementation, you would fetch this from the database
    # For demo purposes, we're using a hardcoded list
    crm_providers = [
        {
            "id": "hubspot-provider",
            "name": "hubspot",
            "api_key": HUBSPOT_API_KEY,
            "is_active": True
        }
    ]
    
    for provider in crm_providers:
        if not provider["is_active"]:
            continue
        
        try:
            # Sync contact
            contact_data = {
                "email": customer_email,
                "lead_id": lead_id,
                "dealer_id": dealer_id
            }
            
            external_contact_id = await sync_contact(provider["name"], contact_data)
            
            # Create CRM contact record
            contact = CRMContact(
                id=str(uuid.uuid4()),
                crm_provider_id=provider["id"],
                external_id=external_contact_id,
                email=customer_email,
                name="Unknown",  # In a real implementation, you would have the full contact data
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            # In a real implementation, you would save the contact to the database
            
            # Log successful contact sync
            background_tasks.add_task(
                log_sync,
                provider["id"],
                "contact",
                contact.id,
                "create",
                "success"
            )
            
            # If this is a lead creation or update, sync the deal
            if event_type in ["lead_created", "lead_updated"]:
                deal_data = {
                    "contact_id": contact.id,
                    "lead_id": lead_id,
                    "dealer_id": dealer_id,
                    "status": status
                }
                
                external_deal_id = await sync_deal(provider["name"], deal_data)
                
                # Create CRM deal record
                deal = CRMDeal(
                    id=str(uuid.uuid4()),
                    crm_provider_id=provider["id"],
                    external_id=external_deal_id,
                    contact_id=contact.id,
                    dealer_id=dealer_id,
                    lead_id=lead_id,
                    status=status,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                
                # In a real implementation, you would save the deal to the database
                
                # Log successful deal sync
                background_tasks.add_task(
                    log_sync,
                    provider["id"],
                    "deal",
                    deal.id,
                    "create" if event_type == "lead_created" else "update",
                    "success"
                )
        
        except Exception as e:
            # Log failed sync
            background_tasks.add_task(
                log_sync,
                provider["id"],
                "contact",
                lead_id,
                "create",
                "failed",
                str(e)
            )

# Routes
@app.get("/crm/providers", response_model=List[CRMProvider])
async def get_crm_providers(token: str = Depends(oauth2_scheme)):
    # In a real implementation, you would fetch providers from the database
    # For demo purposes, we're returning mock data
    return [
        CRMProvider(
            id="hubspot-provider",
            name="HubSpot",
            api_key="*****",
            webhook_url="https://api.hubspot.com/webhook",
            is_active=True
        ),
        CRMProvider(
            id="salesforce-provider",
            name="Salesforce",
            api_key="*****",
            webhook_url="https://api.salesforce.com/webhook",
            is_active=True
        ),
        CRMProvider(
            id="dealersocket-provider",
            name="DealerSocket",
            api_key="*****",
            webhook_url=None,
            is_active=False
        )
    ]

@app.post("/crm/providers", response_model=CRMProvider)
async def create_crm_provider(
    provider_data: CRMProviderCreate,
    token: str = Depends(oauth2_scheme)
):
    provider_id = str(uuid.uuid4())
    
    provider = CRMProvider(
        id=provider_id,
        name=provider_data.name,
        api_key=provider_data.api_key,
        webhook_url=provider_data.webhook_url,
        is_active=True
    )
    
    # In a real implementation, you would save the provider to the database
    
    return provider

@app.put("/crm/providers/{provider_id}", response_model=CRMProvider)
async def update_crm_provider(
    provider_id: str,
    provider_data: CRMProviderUpdate,
    token: str = Depends(oauth2_scheme)
):
    # In a real implementation, you would fetch and update the provider in the database
    # For demo purposes, we're returning a mock provider
    provider = CRMProvider(
        id=provider_id,
        name="HubSpot",
        api_key=provider_data.api_key or "*****",
        webhook_url=provider_data.webhook_url or "https://api.hubspot.com/webhook",
        is_active=provider_data.is_active if provider_data.is_active is not None else True
    )
    
    return provider

@app.get("/crm/sync/status", response_model=List[CRMSyncStatus])
async def get_crm_sync_status(token: str = Depends(oauth2_scheme)):
    # In a real implementation, you would fetch this from the database
    # For demo purposes, we're returning mock data
    return [
        CRMSyncStatus(
            provider="HubSpot",
            last_sync=datetime.utcnow() - timedelta(minutes=15),
            status="success",
            total_contacts=120,
            total_deals=45
        ),
        CRMSyncStatus(
            provider="Salesforce",
            last_sync=datetime.utcnow() - timedelta(hours=1),
            status="success",
            total_contacts=98,
            total_deals=32
        ),
        CRMSyncStatus(
            provider="DealerSocket",
            last_sync=datetime.utcnow() - timedelta(days=1),
            status="failed",
            total_contacts=0,
            total_deals=0
        )
    ]

@app.post("/crm/webhook", status_code=status.HTTP_202_ACCEPTED)
async def receive_crm_webhook(
    payload: CRMWebhookPayload,
    background_tasks: BackgroundTasks
):
    # Process webhook from CRM provider
    # In a real implementation, you would validate the webhook signature
    
    # Log webhook received
    event = {
        "event_type": "crm_webhook",
        "provider": payload.provider,
        "entity_type": payload.entity_type,
        "entity_id": payload.entity_id,
        "timestamp": datetime.utcnow().isoformat()
    }
    redis_client.publish("analytics_events", json.dumps(event))
    
    # Process webhook asynchronously
    # In a real implementation, you would handle different webhook events
    
    return {"status": "accepted"}

@app.post("/crm/sync/manual", status_code=status.HTTP_202_ACCEPTED)
async def trigger_manual_sync(
    provider_id: str,
    token: str = Depends(oauth2_scheme)
):
    # In a real implementation, you would trigger a manual sync job
    # For demo purposes, we're just returning a success response
    
    # Log manual sync triggered
    event = {
        "event_type": "manual_sync",
        "provider_id": provider_id,
        "triggered_by": "user",  # In a real implementation, you would get the user ID from the token
        "timestamp": datetime.utcnow().isoformat()
    }
    redis_client.publish("analytics_events", json.dumps(event))
    
    return {"status": "sync_started"}

# Background task to listen for Redis pub/sub messages
@app.on_event("startup")
async def startup_event():
    # In a real implementation, you would set up a background task to listen for Redis pub/sub messages
    # For demo purposes, we're not implementing this
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)

