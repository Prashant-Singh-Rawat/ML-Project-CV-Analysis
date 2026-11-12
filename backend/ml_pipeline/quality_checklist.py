"""
Resume Quality Checklist Engine (Issue #71)
Evaluates exhaustive resume quality benchmarks across structure, content, formatting, and ATS compliance.
"""

import re
from typing import Dict, Any, List


def evaluate_quality_checklist(cv_text: str) -> Dict[str, Any]:
    text_lower = cv_text.lower()
    lines = [l.strip() for l in cv_text.splitlines() if l.strip()]
    words = re.findall(r"\b[A-Za-z0-9+#.-]+\b", cv_text)
    word_count = len(words)

    categories: List[Dict[str, Any]] = []
    all_checks: List[Dict[str, Any]] = []

    # 1. Contact Details Checks
    has_email = bool(re.search(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b", cv_text))
    has_phone = bool(re.search(r"(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}", cv_text))
    has_links = bool(re.search(r"(linkedin\.com|github\.com|portfolio)", text_lower))
    
    contact_checks = [
        {"item": "Professional Email Address", "passed": has_email, "tip": "Use a clean firstname.lastname@ domain"},
        {"item": "Phone Number", "passed": has_phone, "tip": "Include country/area code"},
        {"item": "LinkedIn or GitHub Profile", "passed": has_links, "tip": "Provide clickable profile links"},
    ]
    categories.append({
        "category": "Contact Information",
        "passed_count": sum(1 for c in contact_checks if c["passed"]),
        "total_count": len(contact_checks),
        "score_pct": int((sum(1 for c in contact_checks if c["passed"]) / len(contact_checks)) * 100),
        "checks": contact_checks,
    })

    # 2. Content & Impact Checks
    has_numbers = bool(re.search(r"(\d+%\s*|\$\d+|\b\d+\b)", cv_text))
    has_action_verbs = any(v in text_lower for v in [
        "developed", "designed", "implemented", "managed", "created", "led", "engineered",
        "architected", "optimized", "reduced", "increased", "launched", "delivered"
    ])
    has_summary = any(s in text_lower for s in ["summary", "profile", "about me", "objective"])

    content_checks = [
        {"item": "Professional Summary Included", "passed": has_summary, "tip": "A 2-3 sentence summary clarifies your positioning"},
        {"item": "Quantified Impact & Metrics", "passed": has_numbers, "tip": "Include numbers, percentages, or dollar values"},
        {"item": "Strong Action Verbs", "passed": has_action_verbs, "tip": "Start bullet points with verbs (e.g. Architected, Accelerated)"},
    ]
    categories.append({
        "category": "Content & Achievements",
        "passed_count": sum(1 for c in content_checks if c["passed"]),
        "total_count": len(content_checks),
        "score_pct": int((sum(1 for c in content_checks if c["passed"]) / len(content_checks)) * 100),
        "checks": content_checks,
    })

    # 3. Structure & Completeness
    has_exp = any(e in text_lower for e in ["experience", "employment", "work history"])
    has_edu = any(e in text_lower for e in ["education", "university", "college", "degree"])
    has_skills = any(s in text_lower for s in ["skills", "technologies", "competencies"])
    has_projects = any(p in text_lower for p in ["projects", "key projects", "open source"])

    structure_checks = [
        {"item": "Work Experience Section", "passed": has_exp, "tip": "Clearly separate company, title, dates, and bullets"},
        {"item": "Education Section", "passed": has_edu, "tip": "Include degree, major, and institution"},
        {"item": "Skills Section", "passed": has_skills, "tip": "Group skills logically into categories"},
        {"item": "Projects or Portfolio", "passed": has_projects, "tip": "Include personal, academic, or open-source projects"},
    ]
    categories.append({
        "category": "Sections & Structure",
        "passed_count": sum(1 for c in structure_checks if c["passed"]),
        "total_count": len(structure_checks),
        "score_pct": int((sum(1 for c in structure_checks if c["passed"]) / len(structure_checks)) * 100),
        "checks": structure_checks,
    })

    # 4. ATS & Formatting Hygiene
    ideal_length = 300 <= word_count <= 850
    has_bullets = any(l.startswith(("-", "•", "*", "–")) for l in lines)
    no_tables_risk = "table" not in text_lower

    formatting_checks = [
        {"item": "Ideal Word Count (350-800 words)", "passed": ideal_length, "tip": f"Current: {word_count} words"},
        {"item": "Bullet Point Formatting", "passed": has_bullets, "tip": "Use standard bullets for easy parsing"},
        {"item": "ATS-Clean Text Structure", "passed": no_tables_risk, "tip": "Avoid multi-column tables or complex graphical layouts"},
    ]
    categories.append({
        "category": "ATS & Formatting Hygiene",
        "passed_count": sum(1 for c in formatting_checks if c["passed"]),
        "total_count": len(formatting_checks),
        "score_pct": int((sum(1 for c in formatting_checks if c["passed"]) / len(formatting_checks)) * 100),
        "checks": formatting_checks,
    })

    total_passed = sum(cat["passed_count"] for cat in categories)
    total_total = sum(cat["total_count"] for cat in categories)
    overall_score = int((total_passed / total_total) * 100)

    # Flatten failed checks into immediate action items
    action_items = []
    for cat in categories:
        for check in cat["checks"]:
            if not check["passed"]:
                action_items.append({
                    "category": cat["category"],
                    "action": check["item"],
                    "tip": check["tip"],
                })

    return {
        "overall_quality_score": overall_score,
        "total_passed": total_passed,
        "total_checks": total_total,
        "categories": categories,
        "action_items": action_items[:6],
    }

