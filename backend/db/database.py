from datetime import datetime
from typing import List, Dict, Any

class StateDatabase:
    def __init__(self):
        self.booked_visits: List[Dict[str, Any]] = [
            {
                "id": "VST-1001",
                "customer_name": "Vikram Sharma",
                "phone": "+91 98765 43210",
                "email": "vikram.s@example.com",
                "date": "2026-09-26",
                "time_slot": "11:00 AM",
                "unit_interest": "3 BHK Premium",
                "chauffeur_pickup": True,
                "status": "Confirmed",
                "created_at": "2026-09-20 14:30"
            },
            {
                "id": "VST-1002",
                "customer_name": "Sarah Jenkins",
                "phone": "+1 (555) 234-5678",
                "email": "sarah.j@example.com",
                "date": "2026-09-27",
                "time_slot": "03:00 PM",
                "unit_interest": "4 BHK Royal Penthouse",
                "chauffeur_pickup": True,
                "status": "Confirmed",
                "created_at": "2026-09-21 09:15"
            }
        ]
        
        self.active_lead = {
            "lead_id": "LEAD-2026-089",
            "name": "Prospective Buyer",
            "status": "Active Inquiry",
            "bant_score": 75,
            "qualification_level": "Warm",
            "budget": "$200,000 - $300,000",
            "authority": "Self & Spouse",
            "need": "3 BHK with Pool View & EV Charging",
            "timeline": "Within 3 Months",
            "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        self.transcripts: List[Dict[str, Any]] = []

    def add_booking(self, name: str, phone: str, email: str, date: str, time_slot: str, unit_interest: str = "3 BHK") -> Dict[str, Any]:
        visit_id = f"VST-{1000 + len(self.booked_visits) + 1}"
        booking = {
            "id": visit_id,
            "customer_name": name,
            "phone": phone,
            "email": email if email else "N/A",
            "date": date,
            "time_slot": time_slot,
            "unit_interest": unit_interest,
            "chauffeur_pickup": True,
            "status": "Confirmed",
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M")
        }
        self.booked_visits.insert(0, booking)
        return booking

    def get_bookings(self) -> List[Dict[str, Any]]:
        return self.booked_visits

    def update_lead_bant(self, budget: str = None, authority: str = None, need: str = None, timeline: str = None) -> Dict[str, Any]:
        if budget:
            self.active_lead["budget"] = budget
        if authority:
            self.active_lead["authority"] = authority
        if need:
            self.active_lead["need"] = need
        if timeline:
            self.active_lead["timeline"] = timeline

        # Recalculate score
        score = 25  # Base score
        if self.active_lead["budget"] and self.active_lead["budget"] != "Unspecified":
            score += 25
        if self.active_lead["need"] and self.active_lead["need"] != "Unspecified":
            score += 25
        if self.active_lead["timeline"] and self.active_lead["timeline"] != "Unspecified":
            score += 25

        self.active_lead["bant_score"] = score
        if score >= 75:
            self.active_lead["qualification_level"] = "Hot Lead 🔥"
        elif score >= 50:
            self.active_lead["qualification_level"] = "Warm Lead ⚡"
        else:
            self.active_lead["qualification_level"] = "Cold Inquiry ❄️"

        self.active_lead["last_updated"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return self.active_lead

    def add_transcript_turn(self, speaker: str, text: str, latency_ms: int = 420, tool_called: str = None):
        turn = {
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "speaker": speaker,
            "text": text,
            "latency_ms": latency_ms,
            "tool_called": tool_called
        }
        self.transcripts.append(turn)
        return turn

# Global instance
db = StateDatabase()
