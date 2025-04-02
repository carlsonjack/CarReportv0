from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
import httpx
import redis
import json
import os
import uuid

# Initialize FastAPI app
app = FastAPI(
    title="CarReport AI Agent Service",
    description="AI-powered assistant for vehicle history insights",
    version="1.0.0"
)

# Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "demo-key")
REPORT_SERVICE_URL = os.getenv("REPORT_SERVICE_URL", "http://localhost:8001")

# Redis connection
redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = os.getenv("REDIS_PORT", 6379)
redis_client = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)

# OAuth2 scheme for authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Models
class Message(BaseModel):
    role: str  # user or assistant
    content: str
    timestamp: datetime
    
class Conversation(BaseModel):
    id: str
    user_id: str
    messages: List[Message] = []
    created_at: datetime
    updated_at: datetime
    
class MessageRequest(BaseModel):
    conversation_id: Optional[str] = None
    content: str
    
class MessageResponse(BaseModel):
    conversation_id: str
    message: Message
    
class ReportInsightRequest(BaseModel):
    report_id: str
    questions: List[str] = []
    
class ReportInsight(BaseModel):
    id: str
    report_id: str
    question: str
    answer: str
    generated_at: datetime
    
class ReportInsightsResponse(BaseModel):
    insights: List[ReportInsight]

# Helper functions
async def get_report(report_id: str, token: str) -> Dict[str, Any]:
    """Fetch report from Report Generation Service"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{REPORT_SERVICE_URL}/reports/{report_id}",
            headers={"Authorization": f"Bearer {token}"}
        )
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )
        return response.json()

async def get_ai_response(prompt: str, conversation_history: List[Dict[str, str]]) -> str:
    """Get response from OpenAI API"""
    # In a real implementation, this would call the OpenAI API
    # For demo purposes, we're returning a mock response
    if "vin" in prompt.lower():
        return "I can help you look up vehicle information by VIN. Please provide the VIN number and I'll generate a report for you."
    elif "accident" in prompt.lower():
        return "Based on the vehicle history, this car has been in 1 minor accident in Los Angeles in 2020. The front-end was damaged but it was properly repaired."
    elif "value" in prompt.lower():
        return "The current market value of this vehicle is approximately $18,500 for retail purchase. If you're trading it in, you might get around $16,000."
    elif "maintenance" in prompt.lower():
        return "The vehicle has a good maintenance history with regular service at the Toyota dealership. The last recorded service was at 30,000 miles in August 2020."
    else:
        return "I'm Pascal, your car assistant. I can help you understand vehicle history reports, check market values, and provide insights about specific vehicles. What would you like to know?"

async def generate_report_insights(report: Dict[str, Any], questions: List[str]) -> List[ReportInsight]:
    """Generate AI insights for specific questions about a report"""
    insights = []
    
    for question in questions:
        # In a real implementation, this would use the OpenAI API to analyze the report
        # and generate a specific answer to the question
        if "accident" in question.lower():
            answer = "This vehicle has been in 1 minor accident. The accident occurred in Los Angeles, CA on March 15, 2020 and was described as a front-end collision. The damage was minor and has been properly repaired."
        elif "ownership" in question.lower():
            answer = "This vehicle has had 2 owners. The first owner had the vehicle from May 10, 2018 to February 20, 2021 in San Diego, CA. The current owner has had the vehicle since February 20, 2021 and is located in Los Angeles, CA."
        elif "maintenance" in question.lower():
            answer = "The vehicle has been regularly maintained at Toyota dealerships. It received an oil change and tire rotation at 15,000 miles in June 2019, and a 30,000 mile service in August 2020."
        elif "value" in question.lower():
            answer = "The current estimated retail value is $18,500. If trading in to a dealer, you might receive around $16,000. For a private party sale, the estimated value is $17,200."
        elif "recall" in question.lower():
            answer = "There is one open recall (ID: 20V123) from February 10, 2020 regarding a potential fuel pump failure. You should contact your local Toyota dealership to have this addressed as soon as possible."
        else:
            answer = "Based on the vehicle history report, this 2018 Toyota Camry SE appears to be in good condition with regular maintenance and only one minor accident. It has had two owners and has an open recall that should be addressed."
        
        insight = ReportInsight(
            id=str(uuid.uuid4()),
            report_id=report["id"],
            question=question,
            answer=answer,
            generated_at=datetime.utcnow()
        )
        insights.append(insight)
    
    return insights

def log_conversation(conversation_id: str, message: str, is_user: bool, user_id: Optional[str] = None):
    """Log conversation for analytics"""
    event = {
        "event_type": "conversation_message",
        "conversation_id": conversation_id,
        "user_id": user_id,
        "is_user_message": is_user,
        "timestamp": datetime.utcnow().isoformat()
    }
    redis_client.publish("analytics_events", json.dumps(event))

# Routes
@app.post("/conversations/messages/", response_model=MessageResponse)
async def create_message(
    request: MessageRequest,
    background_tasks: BackgroundTasks,
    token: str = Depends(oauth2_scheme)
):
    # In a real implementation, you would validate the token and extract user_id
    # For demo purposes, we're using a placeholder
    user_id = "demo-user"
    
    # Get or create conversation
    conversation_id = request.conversation_id
    if not conversation_id:
        conversation_id = str(uuid.uuid4())
        conversation = Conversation(
            id=conversation_id,
            user_id=user_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
    else:
        # In a real implementation, you would fetch the conversation from the database
        # For demo purposes, we're creating a new one
        conversation = Conversation(
            id=conversation_id,
            user_id=user_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
    
    # Add user message
    user_message = Message(
        role="user",
        content=request.content,
        timestamp=datetime.utcnow()
    )
    conversation.messages.append(user_message)
    
    # Log user message for analytics
    background_tasks.add_task(log_conversation, conversation_id, request.content, True, user_id)
    
    # Get conversation history for context
    conversation_history = [
        {"role": msg.role, "content": msg.content}
        for msg in conversation.messages[-5:]  # Last 5 messages for context
    ]
    
    # Get AI response
    ai_response_text = await get_ai_response(request.content, conversation_history)
    
    # Add assistant message
    assistant_message = Message(
        role="assistant",
        content=ai_response_text,
        timestamp=datetime.utcnow()
    )
    conversation.messages.append(assistant_message)
    
    # Update conversation
    conversation.updated_at = datetime.utcnow()
    
    # In a real implementation, you would save the conversation to the database
    # For demo purposes, we're just returning the response
    
    # Log assistant message for analytics
    background_tasks.add_task(log_conversation, conversation_id, ai_response_text, False, user_id)
    
    return MessageResponse(
        conversation_id=conversation_id,
        message=assistant_message
    )

@app.get("/conversations/{conversation_id}", response_model=Conversation)
async def get_conversation(conversation_id: str, token: str = Depends(oauth2_scheme)):
    # In a real implementation, you would fetch the conversation from the database
    # For demo purposes, we're returning a mock conversation
    user_id = "demo-user"
    
    conversation = Conversation(
        id=conversation_id,
        user_id=user_id,
        messages=[
            Message(
                role="assistant",
                content="Hello! I'm Pascal, your car assistant. How can I help you today with your vehicle questions?",
                timestamp=datetime.utcnow()
            ),
            Message(
                role="user",
                content="What can you tell me about the 2018 Toyota Camry?",
                timestamp=datetime.utcnow()
            ),
            Message(
                role="assistant",
                content="The 2018 Toyota Camry is a midsize sedan that was completely redesigned for that model year. It features improved handling, fuel economy, and a more stylish design compared to previous generations. The SE trim comes with a 2.5L I4 engine producing around 203 horsepower, paired with an 8-speed automatic transmission. Would you like me to check if there are any specific reports available for a 2018 Camry?",
                timestamp=datetime.utcnow()
            )
        ],
        created_at=datetime.utcnow() - timedelta(days=1),
        updated_at=datetime.utcnow()
    )
    
    return conversation

@app.post("/reports/{report_id}/insights", response_model=ReportInsightsResponse)
async def get_report_insights(
    report_id: str,
    request: ReportInsightRequest,
    token: str = Depends(oauth2_scheme)
):
    try:
        # Get report
        report = await get_report(report_id, token)
        
        # Generate insights
        insights = await generate_report_insights(report, request.questions)
        
        return ReportInsightsResponse(insights=insights)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate insights: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)

