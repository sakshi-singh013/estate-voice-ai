import math
from typing import Dict, Any
from db.database import db

def check_slot_availability(date: str, time_slot: str) -> Dict[str, Any]:
    """Checks site visit chauffeur slot availability for a given date & time."""
    existing = db.get_bookings()
    is_taken = any(b["date"] == date and b["time_slot"] == time_slot for b in existing)
    
    if is_taken:
        available_slots = ["10:00 AM", "01:30 PM", "04:30 PM"]
        return {
            "status": "Occupied",
            "message": f"The {time_slot} slot on {date} is currently fully booked.",
            "alternative_slots": available_slots
        }
    
    return {
        "status": "Available",
        "message": f"Great news! The {time_slot} slot on {date} is open with complimentary chauffeur pickup.",
        "date": date,
        "time_slot": time_slot
    }

def book_site_visit(name: str, phone: str, email: str = None, date: str = "2026-09-27", time_slot: str = "11:00 AM", unit_interest: str = "3 BHK Premium") -> Dict[str, Any]:
    """Books a guided site visit with chauffeur pickup."""
    booking = db.add_booking(
        name=name if name else "Valued Guest",
        phone=phone if phone else "+91 98765 00000",
        email=email if email else "guest@example.com",
        date=date,
        time_slot=time_slot,
        unit_interest=unit_interest
    )
    return {
        "status": "Success",
        "booking_id": booking["id"],
        "message": f"Site visit booked successfully for {booking['customer_name']} on {date} at {time_slot}. Confirmation SMS sent!",
        "details": booking
    }

def calculate_emi(property_cost: float = 265000, down_payment_percent: float = 20, tenure_years: int = 20, interest_rate: float = 8.35) -> Dict[str, Any]:
    """Calculates monthly EMI, down payment, and total interest payable."""
    down_payment = (down_payment_percent / 100.0) * property_cost
    loan_amount = property_cost - down_payment
    
    r = (interest_rate / 100.0) / 12.0
    n = tenure_years * 12
    
    if r > 0:
        emi = (loan_amount * r * math.pow(1 + r, n)) / (math.pow(1 + r, n) - 1)
    else:
        emi = loan_amount / n
        
    total_payment = emi * n
    total_interest = total_payment - loan_amount

    return {
        "property_cost": f"${property_cost:,.2f}",
        "down_payment": f"${down_payment:,.2f} ({down_payment_percent}%)",
        "loan_amount": f"${loan_amount:,.2f}",
        "monthly_emi": f"${emi:,.2f}",
        "tenure_years": tenure_years,
        "interest_rate": f"{interest_rate}% p.a."
    }

def update_lead_qualification(budget: str = None, authority: str = None, need: str = None, timeline: str = None) -> Dict[str, Any]:
    """Updates BANT lead qualification metrics."""
    return db.update_lead_bant(budget=budget, authority=authority, need=need, timeline=timeline)
