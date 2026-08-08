import logging
import difflib
from typing import Dict, Any

logger = logging.getLogger(__name__)

class AcademicEntityResolver:
    """
    ML Pipeline for Entity Resolution of Academic Institutions.
    Normalizes university names/acronyms against a global academic database 
    and applies a ranking algorithm to contextualize the educational tier.
    """
    
    def __init__(self):
        # A mock global academic database mapping normalized names to tiers.
        # Tier 1 = Ivy League / Top Global, Tier 2 = Prestigious State/National, Tier 3 = Standard
        self.academic_db = {
            "Massachusetts Institute of Technology": {"tier": 1, "aliases": ["MIT", "Mass Tech"]},
            "Stanford University": {"tier": 1, "aliases": ["Stanford", "Stanford Univ"]},
            "Harvard University": {"tier": 1, "aliases": ["Harvard", "Harvard College"]},
            "University of California, Berkeley": {"tier": 1, "aliases": ["UC Berkeley", "Cal", "UCB"]},
            "Indian Institute of Technology Bombay": {"tier": 1, "aliases": ["IIT Bombay", "IIT B"]},
            "University of Oxford": {"tier": 1, "aliases": ["Oxford", "Oxford Univ"]},
            "University of Cambridge": {"tier": 1, "aliases": ["Cambridge", "Cambridge Univ"]},
            "New York University": {"tier": 2, "aliases": ["NYU", "New York Univ"]},
            "University of Michigan": {"tier": 2, "aliases": ["UMich", "Michigan"]},
            "State University": {"tier": 3, "aliases": ["State Univ", "State College"]},
        }
        
        # Build a flat lookup for the resolver
        self.alias_lookup = {}
        for normalized_name, data in self.academic_db.items():
            self.alias_lookup[normalized_name.lower()] = normalized_name
            for alias in data["aliases"]:
                self.alias_lookup[alias.lower()] = normalized_name

    def resolve_institution(self, raw_name: str) -> Dict[str, Any]:
        """
        Normalizes the raw institution name using fuzzy matching and resolves its academic tier.
        """
        if not raw_name or not raw_name.strip():
            return {"normalized_name": "Unknown", "tier": "Unranked", "confidence": 0.0}
            
        query = raw_name.lower().strip()
        
        # 1. Exact Match
        if query in self.alias_lookup:
            normalized = self.alias_lookup[query]
            return {
                "normalized_name": normalized,
                "tier": self.academic_db[normalized]["tier"],
                "confidence": 100.0
            }
            
        # 2. Fuzzy Match (Simulating an ML Entity Resolution clustering model)
        matches = difflib.get_close_matches(query, self.alias_lookup.keys(), n=1, cutoff=0.7)
        if matches:
            best_match = matches[0]
            normalized = self.alias_lookup[best_match]
            # Calculate a confidence score
            similarity = difflib.SequenceMatcher(None, query, best_match).ratio() * 100
            
            return {
                "normalized_name": normalized,
                "tier": self.academic_db[normalized]["tier"],
                "confidence": round(similarity, 1)
            }
            
        # Unresolved
        return {
            "normalized_name": raw_name.title(),
            "tier": "Unranked (Standard)",
            "confidence": 40.0
        }

# Singleton instance
_entity_resolver = None

def get_entity_resolver():
    global _entity_resolver
    if _entity_resolver is None:
        _entity_resolver = AcademicEntityResolver()
    return _entity_resolver
