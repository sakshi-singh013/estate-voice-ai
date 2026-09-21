import time
import re
from typing import Dict, Any, List
from rag.document_store import rag_store
from agent.prompt_templates import ARIA_SYSTEM_PROMPT
from agent.tools import check_slot_availability, book_site_visit, calculate_emi, update_lead_qualification
from db.database import db

class VoiceAgent:
    def __init__(self):
        self.agent_name = "Aria"
        self.role = "Senior Sales Advisor"
        self.project_name = "Greenfield Heights"

    def process_turn(self, user_text: str) -> Dict[str, Any]:
        """Processes a single conversational turn from user text/audio transcript."""
        start_time = time.time()
        user_clean = user_text.lower().strip()
        
        tool_called = None
        tool_result = None
        
        # 1. RAG Retrieval
        rag_matches = rag_store.search(user_text, top_k=2)
        primary_rag = rag_matches[0] if rag_matches else {"category": "Overview", "content": "Greenfield Heights luxury residences."}

        # 2. Tool Routing & Intent Detection
        
        # Site Visit Booking / Scheduling Intent
        if any(w in user_clean for w in ["book", "schedule", "visit", "tour", "appointment", "come over", "see the site"]):
            tool_called = "book_site_visit"
            date_match = re.search(r'\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|this weekend|next week|\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec))\b', user_clean)
            date_str = date_match.group(0).title() if date_match else "This Saturday (11:00 AM)"
            
            tool_result = book_site_visit(
                name="Valued Prospective Buyer",
                phone="+91 98765 43210",
                email="buyer@example.com",
                date="2026-09-27",
                time_slot="11:00 AM",
                unit_interest="3 BHK Premium"
            )
            spoken_response = f"I've reserved a guided site visit for you on Saturday, September 27th at 11:00 AM with our complimentary chauffeur pickup! A confirmation SMS has been sent to your mobile. Is there a specific unit configuration you'd like to inspect first?"

        # EMI / Financing Intent
        elif any(w in user_clean for w in ["emi", "loan", "down payment", "mortgage", "monthly", "interest", "finance"]):
            tool_called = "calculate_emi"
            # Default for 3 BHK ($265k)
            cost = 265000
            if "2 bhk" in user_clean or "185" in user_clean:
                cost = 185000
            elif "4 bhk" in user_clean or "penthouse" in user_clean or "420" in user_clean:
                cost = 420000
                
            tool_result = calculate_emi(property_cost=cost, down_payment_percent=20, tenure_years=20, interest_rate=8.35)
            spoken_response = f"For a unit priced at {tool_result['property_cost']}, with a 20% down payment ({tool_result['down_payment']}), your estimated monthly EMI would be approximately {tool_result['monthly_emi']} at an 8.35% interest rate over 20 years. We also offer a 0% pre-EMI subvention plan until possession in Dec 2026!"

        # Pricing Intent
        elif any(w in user_clean for w in ["price", "cost", "how much", "rate", "budget", "pricing"]):
            spoken_response = "Our 2 BHK Executive units start at $185,000 (₹1.45 Cr), 3 BHK Premium units start at $265,000 (₹2.10 Cr), and 4 BHK Royal Penthouses are priced at $420,000 (₹3.35 Cr). We currently have special launch flexi-payment plans available."
            update_lead_qualification(budget="$200,000 - $300,000", need="Pricing Inquiry")

        # Amenities / Features Intent
        elif any(w in user_clean for w in ["pool", "gym", "clubhouse", "amenity", "amenities", "squash", "ev"]):
            spoken_response = "Greenfield Heights features a 25,000 sq.ft. Central Clubhouse, a temperature-controlled Olympic infinity pool, co-working lounges, 100% EV charging bays, and floodlit tennis & squash courts!"
            update_lead_qualification(need="Clubhouse & Amenities focused")

        # Location / Distance Intent
        elif any(w in user_clean for w in ["location", "metro", "airport", "distance", "where", "tech park"]):
            spoken_response = "We are located along the Silicon Corridor on Outer Ring Road! Just 2 minutes from the Purple Line Metro station, 5 minutes from Embassy Tech Village, and 35 minutes direct expressway drive to the Airport."

        # Greeting / General
        elif any(w in user_clean for w in ["hi", "hello", "hey", "who are you", "tell me about"]):
            spoken_response = "Hello! I am Aria, Senior Sales Advisor for Greenfield Heights. We offer eco-luxury 2, 3, and 4 BHK residences with 80% open green space on Outer Ring Road. How can I assist your home search today?"

        else:
            # RAG General Fallback
            spoken_response = f"According to our project specifications: {primary_rag['content'][:250]} Would you like me to schedule a site visit so you can experience the sample flat in person?"

        # Simulate voice processing latency (e.g. 380ms - 450ms)
        elapsed_ms = int((time.time() - start_time) * 1000) + 380

        # Update database transcript
        db.add_transcript_turn(speaker="User", text=user_text)
        db.add_transcript_turn(speaker="Aria (Voice Agent)", text=spoken_response, latency_ms=elapsed_ms, tool_called=tool_called)

        return {
            "agent_name": self.agent_name,
            "spoken_response": spoken_response,
            "latency_ms": elapsed_ms,
            "tool_called": tool_called,
            "tool_result": tool_result,
            "rag_context": {
                "category": primary_rag["category"],
                "content": primary_rag["content"]
            },
            "updated_lead": db.active_lead,
            "updated_bookings": db.get_bookings()
        }

agent_instance = VoiceAgent()
