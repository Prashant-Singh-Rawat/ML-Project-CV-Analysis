"""
ATS Parser Simulator (Issue #54)
Simulates parsing behaviors of Taleo, Workday, and Greenhouse ATS systems.
"""

from typing import Dict, Any, List

def simulate_ats_parsers(cv_text: str, skills: List[str] = None) -> Dict[str, Any]:
    text_lower = cv_text.lower()
    skills = skills or []
    
    # Taleo: Heavy keyword and header matching
    taleo_score = min(95, max(40, len(skills) * 4 + (20 if "experience" in text_lower else 0)))
    
    # Workday: Clean structured data extraction
    workday_score = min(98, max(45, (30 if "@" in cv_text else 0) + (30 if "education" in text_lower else 0) + len(skills) * 3))
    
    # Greenhouse: Skills & projects focus
    greenhouse_score = min(92, max(50, (25 if "projects" in text_lower else 0) + len(skills) * 3 + 20))
    
    overall_ats = int((taleo_score + workday_score + greenhouse_score) / 3)
    
    breakdown = {
        "keyword_match": min(95, len(skills) * 5),
        "formatting_compatibility": 90 if "\t" not in cv_text else 70,
        "section_headers": 85 if all(h in text_lower for h in ["experience", "education", "skills"]) else 60,
        "font_parsing": 95
    }
    
    return {
        "overall_ats_score": overall_ats,
        "simulated_systems": {
            "Workday": workday_score,
            "Taleo": taleo_score,
            "Greenhouse": greenhouse_score
        },
        "breakdown_scores": breakdown,
        "critical_fixes": [
            "Ensure standard headers ('Experience', 'Education', 'Skills') are used.",
            "List core technical proficiencies in context within bullet descriptions."
        ]
    }
