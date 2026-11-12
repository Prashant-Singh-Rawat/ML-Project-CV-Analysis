"""
Skill Gap Analysis Engine (Issue #55)
Extracts JD requirements and computes semantic skill coverage.
"""
from typing import Dict, Any, List
import re

def compute_skill_gap(candidate_skills: List[str], jd_text: str) -> Dict[str, Any]:
    cand_set = {s.lower().strip() for s in candidate_skills}
    tokens = set(re.findall(r"\b[a-zA-Z0-9+#.-]{2,}\b", jd_text.lower()))
    
    common_tech = {"python", "javascript", "react", "sql", "docker", "aws", "git", "java", "kubernetes", "c++", "fastapi"}
    jd_skills = tokens.intersection(common_tech)
    
    matched = list(cand_set.intersection(jd_skills))
    missing = list(jd_skills - cand_set)
    
    total = max(1, len(jd_skills))
    match_pct = int((len(matched) / total) * 100)
    
    return {
        "match_percentage": match_pct,
        "matched_skills": [s.title() for s in matched],
        "missing_skills": [s.title() for s in missing],
        "total_required": len(jd_skills)
    }
