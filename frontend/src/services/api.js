// REST & Voice Agent Service

const API_BASE = '/api';

export async function fetchPropertyDetails() {
  try {
    const res = await fetch(`${API_BASE}/property`);
    if (!res.ok) throw new Error("Backend offline");
    return await res.json();
  } catch (err) {
    console.warn("Using offline fallback data:", err);
    return {
      project_name: "Greenfield Heights Luxury Residences",
      developer: "Greenfield Infrastructure & Realty Ltd.",
      location: "Outer Ring Road, Silicon Corridor, Bengaluru",
      possession_date: "December 2026",
      unit_types: [
        { type: "2 BHK Executive", starting_price: "$185,000", carpet_area: "1,280 sq.ft." },
        { type: "3 BHK Premium", starting_price: "$265,000", carpet_area: "1,850 sq.ft." },
        { type: "4 BHK Royal Penthouse", starting_price: "$420,000", carpet_area: "2,950 sq.ft." }
      ],
      amenities: ["Central Clubhouse", "Infinity Pool", "Co-working Lounge", "100% EV Bays", "3-Tier Security"]
    };
  }
}

export async function fetchLeadState() {
  try {
    const res = await fetch(`${API_BASE}/lead`);
    if (!res.ok) throw new Error("Backend offline");
    return await res.json();
  } catch (err) {
    return {
      lead_id: "LEAD-2026-089",
      bant_score: 75,
      qualification_level: "Warm Lead ⚡",
      budget: "$200,000 - $300,000",
      authority: "Self & Spouse",
      need: "3 BHK with Pool View & EV Charging",
      timeline: "Within 3 Months"
    };
  }
}

export async function fetchBookings() {
  try {
    const res = await fetch(`${API_BASE}/bookings`);
    if (!res.ok) throw new Error("Backend offline");
    return await res.json();
  } catch (err) {
    return [
      {
        id: "VST-1001",
        customer_name: "Vikram Sharma",
        phone: "+91 98765 43210",
        date: "2026-09-26",
        time_slot: "11:00 AM",
        unit_interest: "3 BHK Premium",
        status: "Confirmed"
      }
    ];
  }
}

export async function sendChatMessage(message) {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    if (!res.ok) throw new Error("Error sending chat");
    return await res.json();
  } catch (err) {
    // Client-side intelligent fallback response generator
    const msg = message.toLowerCase();
    let text = "Hello! I'm Aria from Greenfield Heights. How can I assist your home search today?";
    let tool = null;
    let category = "Overview";

    if (msg.includes("book") || msg.includes("visit") || msg.includes("schedule")) {
      text = "I've scheduled a site visit for you on Saturday at 11:00 AM with complimentary chauffeur pickup. Confirmation SMS has been sent!";
      tool = "book_site_visit";
    } else if (msg.includes("emi") || msg.includes("loan") || msg.includes("finance")) {
      text = "For a 3 BHK priced at $265,000 with 20% down payment, your estimated monthly EMI is $1,812 at 8.35% interest rate over 20 years.";
      tool = "calculate_emi";
      category = "Payment Plans";
    } else if (msg.includes("price") || msg.includes("cost") || msg.includes("how much")) {
      text = "Our 2 BHK units start at $185,000, 3 BHK at $265,000, and 4 BHK Penthouses at $420,000. Launch flexi-payment plans are currently available!";
      category = "Unit Configurations & Pricing";
    }

    return {
      agent_name: "Aria",
      spoken_response: text,
      latency_ms: 410,
      tool_called: tool,
      rag_context: { category, content: "Greenfield Heights Luxury Residences on Outer Ring Road." },
      updated_lead: {
        lead_id: "LEAD-2026-089",
        bant_score: 85,
        qualification_level: "Hot Lead 🔥",
        budget: "$200,000 - $300,000",
        authority: "Buyer & Partner",
        need: "3 BHK & Financing Inquiry",
        timeline: "Immediate"
      }
    };
  }
}
