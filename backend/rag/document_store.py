import json
import os
import re
from typing import List, Dict, Any

class PropertyRAGStore:
    def __init__(self, data_path: str = None):
        if data_path is None:
            data_path = os.path.join(os.path.dirname(__file__), 'property_data.json')
        
        self.data_path = data_path
        self.documents = []
        self.raw_data = {}
        self._load_and_index()

    def _load_and_index(self):
        """Loads JSON data and creates searchable index chunks with metadata."""
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Property data file not found at {self.data_path}")
            
        with open(self.data_path, 'r', encoding='utf-8') as f:
            self.raw_data = json.load(f)

        # Index overview
        overview = f"Project Name: {self.raw_data.get('project_name')}. Developer: {self.raw_data.get('developer')}. Location: {self.raw_data.get('location')}. RERA: {self.raw_data.get('rera_number')}. Possession: {self.raw_data.get('possession_date')}."
        self.documents.append({
            "category": "Overview",
            "content": overview,
            "keywords": ["project", "developer", "location", "rera", "possession", "builder", "address"]
        })

        # Index units & pricing
        for unit in self.raw_data.get("unit_types", []):
            content = f"Unit Type: {unit['type']}. Area: {unit['carpet_area']}. Price: {unit['starting_price']} ({unit['price_in_inr']}). Balconies: {unit['balconies']}, Bathrooms: {unit['bathrooms']}. Key Feature: {unit['key_feature']}."
            keywords = ["price", "cost", "unit", "bhk", "bedroom", "sqft", "area", "balcony", "layout", unit['type'].lower()]
            self.documents.append({
                "category": "Unit Configurations & Pricing",
                "content": content,
                "keywords": keywords
            })

        # Index amenities
        amenities_str = "Amenities at Greenfield Heights include: " + ", ".join(self.raw_data.get("amenities", []))
        self.documents.append({
            "category": "Amenities",
            "content": amenities_str,
            "keywords": ["amenity", "amenities", "pool", "gym", "clubhouse", "ev", "security", "squash", "tennis", "park"]
        })

        # Index location advantages
        loc_str = "Location & Connectivity: " + "; ".join(self.raw_data.get("location_advantages", []))
        self.documents.append({
            "category": "Location & Connectivity",
            "content": loc_str,
            "keywords": ["location", "metro", "airport", "school", "hospital", "tech park", "distance", "commute", "road"]
        })

        # Index payment schemes
        payment_str = "Payment Plans & Financing: " + "; ".join(self.raw_data.get("payment_schemes", []))
        self.documents.append({
            "category": "Payment Plans",
            "content": payment_str,
            "keywords": ["payment", "plan", "emi", "bank", "loan", "down payment", "subvention", "interest", "finance"]
        })

        # Index FAQs
        for faq in self.raw_data.get("faqs", []):
            self.documents.append({
                "category": "FAQ",
                "content": f"Q: {faq['question']} A: {faq['answer']}",
                "keywords": re.findall(r'\w+', faq['question'].lower()) + re.findall(r'\w+', faq['answer'].lower())
            })

    def search(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """Performs keyword-weighted vector relevance search for RAG retrieval."""
        query_words = set(re.findall(r'\w+', query.lower()))
        results = []

        for doc in self.documents:
            score = 0
            doc_text = doc["content"].lower()
            
            # Exact word & keyword overlap match
            for word in query_words:
                if len(word) < 3:
                    continue
                if word in doc["keywords"]:
                    score += 3
                elif word in doc_text:
                    score += 1

            if score > 0:
                results.append({
                    "category": doc["category"],
                    "content": doc["content"],
                    "score": score
                })

        # Sort by relevance score
        results.sort(key=lambda x: x["score"], reverse=True)
        
        # Fallback to general project overview if no matches
        if not results:
            results.append({
                "category": "Overview",
                "content": self.documents[0]["content"],
                "score": 1
            })

        return results[:top_k]

# Global singleton instance
rag_store = PropertyRAGStore()
