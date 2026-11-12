"""
Resume Section Completeness Analyzer (Issue #56)
Evaluates structure, presence, and depth of key resume sections.
"""

import re
from typing import Dict, Any, List


SECTION_PATTERNS = {
    "contact": {
        "title": "Contact Information",
        "patterns": [
            r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b",  # email
            r"(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}",  # phone
            r"(linkedin\.com/in/|github\.com/)",  # social links
        ],
        "weight": 15,
        "required": True,
    },
    "summary": {
        "title": "Professional Summary",
        "headers": ["summary", "professional summary", "about me", "profile", "objective"],
        "min_words": 20,
        "weight": 15,
        "required": False,
    },
    "experience": {
        "title": "Work Experience",
        "headers": ["experience", "work experience", "employment", "work history", "professional experience"],
        "min_words": 40,
        "weight": 25,
        "required": True,
    },
    "education": {
        "title": "Education",
        "headers": ["education", "academic background", "qualification", "university", "degrees"],
        "min_words": 15,
        "weight": 15,
        "required": True,
    },
    "skills": {
        "title": "Skills & Competencies",
        "headers": ["skills", "technical skills", "core competencies", "technologies", "tools"],
        "min_words": 10,
        "weight": 15,
        "required": True,
    },
    "projects": {
        "title": "Key Projects",
        "headers": ["projects", "personal projects", "academic projects", "key projects"],
        "min_words": 25,
        "weight": 10,
        "required": False,
    },
    "certifications": {
        "title": "Certifications & Achievements",
        "headers": ["certifications", "licenses", "awards", "honors", "certificates"],
        "min_words": 8,
        "weight": 5,
        "required": False,
    },
}


def analyze_section_completeness(cv_text: str) -> Dict[str, Any]:
    text_lower = cv_text.lower()
    total_score = 0
    max_score = sum(s["weight"] for s in SECTION_PATTERNS.values())
    sections_report: List[Dict[str, Any]] = []
    missing_critical: List[str] = []
    recommendations: List[str] = []

    # 1. Contact check
    contact_conf = SECTION_PATTERNS["contact"]
    has_email = bool(re.search(contact_conf["patterns"][0], cv_text))
    has_phone = bool(re.search(contact_conf["patterns"][1], cv_text))
    has_social = bool(re.search(contact_conf["patterns"][2], cv_text, re.IGNORECASE))
    contact_items = []
    if has_email:
        contact_items.append("Email Address")
    if has_phone:
        contact_items.append("Phone Number")
    if has_social:
        contact_items.append("LinkedIn/GitHub Profile")

    if has_email and (has_phone or has_social):
        contact_status = "complete"
        contact_score = contact_conf["weight"]
    elif has_email or has_phone:
        contact_status = "partial"
        contact_score = int(contact_conf["weight"] * 0.6)
        recommendations.append("Add a LinkedIn or GitHub link to your contact details.")
    else:
        contact_status = "missing"
        contact_score = 0
        missing_critical.append("Contact Information")
        recommendations.append("Ensure your email and contact phone number are clearly displayed at the top.")

    total_score += contact_score
    sections_report.append({
        "section_key": "contact",
        "name": contact_conf["title"],
        "status": contact_status,
        "score": contact_score,
        "max_score": contact_conf["weight"],
        "details": f"Found: {', '.join(contact_items) if contact_items else 'None'}",
        "is_critical": True
    })

    # 2. General section headers
    for key, conf in SECTION_PATTERNS.items():
        if key == "contact":
            continue

        headers = conf.get("headers", [])
        matched_header = next((h for h in headers if re.search(rf"\b{re.escape(h)}\b", text_lower)), None)
        
        # Word count in context approximation
        if matched_header:
            # Estimate section length by text after header
            pos = text_lower.find(matched_header)
            section_chunk = cv_text[pos:pos+1200]
            word_count = len(section_chunk.split())
            min_w = conf.get("min_words", 20)

            if word_count >= min_w:
                status = "complete"
                score = conf["weight"]
            else:
                status = "partial"
                score = int(conf["weight"] * 0.5)
                recommendations.append(f"Expand the '{conf['title']}' section with more details or measurable outcomes.")
        else:
            status = "missing"
            score = 0
            if conf.get("required"):
                missing_critical.append(conf["title"])
                recommendations.append(f"Add a dedicated '{conf['title']}' section — recruiters look for this standard section.")
            else:
                recommendations.append(f"Consider adding a '{conf['title']}' section to stand out.")

        total_score += score
        sections_report.append({
            "section_key": key,
            "name": conf["title"],
            "status": status,
            "score": score,
            "max_score": conf["weight"],
            "details": f"Header: '{matched_header}' detected" if matched_header else "No standard header found",
            "is_critical": conf.get("required", False)
        })

    completeness_pct = round((total_score / max_score) * 100)

    return {
        "completeness_score": completeness_pct,
        "sections": sections_report,
        "missing_critical_sections": missing_critical,
        "completed_count": sum(1 for s in sections_report if s["status"] == "complete"),
        "total_sections_checked": len(sections_report),
        "recommendations": recommendations[:6],
    }
