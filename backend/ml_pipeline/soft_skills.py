"""
Soft Skills Identification Module (Issue #68)
Detects, categorizes, and scores soft skills from resume text with context snippets and recommendations.
"""

import re
from typing import Dict, Any, List


SOFT_SKILLS_TAXONOMY: Dict[str, Dict[str, Any]] = {
    "Leadership & Mentorship": {
        "skills": [
            "leadership", "led", "lead", "mentoring", "mentored", "mentor", "mentorship", "coaching", "initiative",
            "delegation", "strategic thinking", "decision making", "supervising",
            "team building", "conflict resolution", "vision"
        ],
        "icon": "👑",
    },
    "Communication": {
        "skills": [
            "communication", "communicated", "written communication", "verbal communication",
            "presentation", "presented", "public speaking", "storytelling", "active listening",
            "negotiation", "technical writing", "stakeholder management"
        ],
        "icon": "💬",
    },
    "Teamwork & Collaboration": {
        "skills": [
            "collaboration", "collaborated", "team player", "cross-functional", "interpersonal",
            "peer review", "pair programming", "agile mindset", "relationship building",
            "cooperation", "empathy"
        ],
        "icon": "🤝",
    },
    "Problem Solving & Analytical Thinking": {
        "skills": [
            "problem solving", "solved", "analytical skills", "critical thinking", "troubleshooting",
            "debugging", "root cause analysis", "data-driven", "innovative thinking",
            "creativity", "optimization", "optimized"
        ],
        "icon": "💡",
    },
    "Adaptability & Growth": {
        "skills": [
            "adaptability", "flexibility", "resilience", "fast learner", "growth mindset",
            "continuous learning", "multitasking", "work under pressure", "curiosity"
        ],
        "icon": "🌱",
    },
    "Work Ethic & Ownership": {
        "skills": [
            "ownership", "accountability", "time management", "prioritization",
            "attention to detail", "self-starter", "reliable", "dependable",
            "deadline-oriented", "organization"
        ],
        "icon": "⏱️",
    },
}


def extract_soft_skills(cv_text: str) -> Dict[str, Any]:
    text_lower = cv_text.lower()
    sentences = re.split(r"(?<=[.!?])\s+|\n+", cv_text)

    detected_skills_by_category: Dict[str, List[Dict[str, Any]]] = {}
    total_detected = 0
    all_detected_names = set()

    for category, cat_data in SOFT_SKILLS_TAXONOMY.items():
        detected_in_cat = []
        for skill in cat_data["skills"]:
            pattern = rf"\b{re.escape(skill)}\b"
            match = re.search(pattern, text_lower)
            if match:
                # Find matching context sentence
                context_sentence = ""
                for s in sentences:
                    if re.search(pattern, s.lower()):
                        context_sentence = s.strip()[:140]
                        break

                # Confidence based on context or explicit mention
                confidence = "High" if len(context_sentence) > 30 else "Medium"

                detected_in_cat.append({
                    "skill": skill.title(),
                    "confidence": confidence,
                    "context": context_sentence or "Explicitly mentioned in CV",
                })
                all_detected_names.add(skill.lower())

        if detected_in_cat:
            detected_skills_by_category[category] = detected_in_cat
            total_detected += len(detected_in_cat)

    # Missing core recommendations
    recommended_to_add: List[str] = []
    must_haves = ["problem solving", "collaboration", "communication", "leadership", "time management", "adaptability"]
    for mh in must_haves:
        if mh not in all_detected_names:
            recommended_to_add.append(mh.title())

    # Soft skills score (0-100)
    # Having 4-8 soft skills across multiple categories is ideal
    category_coverage = len(detected_skills_by_category)
    soft_skills_score = min(98, max(30, (category_coverage * 12) + (min(total_detected, 8) * 6)))

    recommendations: List[str] = []
    if category_coverage < 3:
        recommendations.append("Your resume concentrates heavily on technical competencies. Add behavioral and collaborative achievements.")
    if recommended_to_add:
        recommendations.append(f"Consider illustrating core soft skills: {', '.join(recommended_to_add[:3])} through measurable actions.")
    if not recommendations:
        recommendations.append("Well-balanced soft skill profile across multiple categories.")

    return {
        "total_detected": total_detected,
        "soft_skills_score": soft_skills_score,
        "categories_covered": category_coverage,
        "total_categories": len(SOFT_SKILLS_TAXONOMY),
        "detected_by_category": detected_skills_by_category,
        "missing_soft_skills": recommended_to_add[:5],
        "recommendations": recommendations,
    }
