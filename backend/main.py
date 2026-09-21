import os
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any

from rag.document_store import rag_store
from agent.voice_agent import agent_instance
from db.database import db
from agent.tools import book_site_visit, calculate_emi, check_slot_availability

app = FastAPI(
    title="EstateVoice AI - Real Estate Voice Sales Agent API",
    version="1.0.0",
    description="Backend API powering low-latency Voice Sales Agent for Greenfield Heights Luxury Residences"
)

# Enable CORS for local & production frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "session-001"

class BookingRequest(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    date: str
    time_slot: str
    unit_interest: Optional[str] = "3 BHK Premium"

class EMIRequest(BaseModel):
    property_cost: float
    down_payment_percent: float = 20.0
    tenure_years: int = 20
    interest_rate: float = 8.35

@app.get("/")
def read_root():
    return {
        "status": "Online",
        "service": "EstateVoice AI Engine",
        "agent": "Aria (Greenfield Heights Voice Sales Advisor)",
        "endpoints": [
            "/api/property",
            "/api/lead",
            "/api/bookings",
            "/api/chat",
            "/api/book",
            "/api/calculate-emi",
            "/ws/voice"
        ]
    }

@app.get("/api/property")
def get_property_details():
    return rag_store.raw_data

@app.get("/api/lead")
def get_lead_state():
    return db.active_lead

@app.get("/api/bookings")
def get_bookings():
    return db.get_bookings()

@app.post("/api/chat")
def process_chat(req: ChatRequest):
    if not req.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    return agent_instance.process_turn(req.message)

@app.post("/api/book")
def create_booking(req: BookingRequest):
    return book_site_visit(
        name=req.name,
        phone=req.phone,
        email=req.email,
        date=req.date,
        time_slot=req.time_slot,
        unit_interest=req.unit_interest
    )

@app.post("/api/calculate-emi")
def compute_emi(req: EMIRequest):
    return calculate_emi(
        property_cost=req.property_cost,
        down_payment_percent=req.down_payment_percent,
        tenure_years=req.tenure_years,
        interest_rate=req.interest_rate
    )

@app.websocket("/ws/voice")
async def websocket_voice_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            user_msg = payload.get("message", "")
            
            if user_msg:
                result = agent_instance.process_turn(user_msg)
                await websocket.send_text(json.dumps(result))
    except WebSocketDisconnect:
        print("WebSocket client disconnected")
