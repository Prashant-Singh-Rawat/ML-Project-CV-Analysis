"""
Recruiter-Friendly Resume Summary Generator (Issue #70)
Produces high-impact, 30-second recruiter executive summaries with copy-to-clipboard formatting.
"""

import re
from typing import Dict, Any, List


def generate_recruiter_summary(cv_text: str, candidate_name: str = "", target_role: str = "") -> Dict[str, Any]:
    lines = [l.strip() for l in cv_text.splitlines() if l.strip()]
    text_lower = cv_text.lower()

    # Extract name if not provided
    name = candidate_name.strip()
    if not name and lines:
        first_line = lines[0]
        if len(first_line.split()) <= 4 and not any(char.isdigit() for char in first_line):
            name = first_line
    if not name:
        name = "Candidate"

    # Identify role
    role = target_role.strip()
    if not role:
        common_roles = [
            "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
            "Data Scientist", "Machine Learning Engineer", "DevOps Engineer", "Product Manager",
            "Data Analyst", "Cloud Architect"
        ]
        for r in common_roles:
            if r.lower() in text_lower:
                role = r
                break
    if not role:
        role = "Software & Technology Professional"

    # Extract technical skills
    skill_bank = [
        "Python", "JavaScript", "TypeScript", "React", "Node.js", "Java", "C++", "Go",
        "SQL", "PostgreSQL", "MongoDB", "AWS", "Azure", "Docker", "Kubernetes",
        "FastAPI", "Django", "Machine Learning", "Git", "REST APIs", "GraphQL"
    ]
    detected_skills = [s for s in skill_bank if re.search(rf"\b{re.escape(s)}\b", cv_text, re.IGNORECASE)]

    # Extract achievements with metrics
    metric_sentences = []
    sentences = re.split(r"(?<=[.!?])\s+|\n+", cv_text)
    for s in sentences:
        s_clean = s.strip()
        # Look for numbers/percentages
        if re.search(r"(\d+%\s*|\$\d+|\b\d+\s*(users|clients|ms|latency|requests|projects)\b)", s_clean, re.IGNORECASE):
            if len(s_clean.split()) >= 6:
                metric_sentences.append(s_clean)
                if len(metric_sentences) >= 3:
                    break

    # Build components
    headline = f"{role} specializing in {', '.join(detected_skills[:3]) if detected_skills else 'Modern System Development'}"
    
    top_strengths = []
    if detected_skills:
        top_strengths.append(f"Technical Proficiency: {', '.join(detected_skills[:5])}")
    if metric_sentences:
        top_strengths.append(f"Quantifiable Delivery: {metric_sentences[0][:120]}")
    else:
        top_strengths.append("Proven execution across full development lifecycles and modern engineering standards.")
    top_strengths.append("Strong cross-functional collaboration, technical communication, and agile delivery.")

    elevator_pitch = (
        f"{name} is a results-driven {role} with demonstrated expertise in "
        f"{', '.join(detected_skills[:4]) if detected_skills else 'software engineering'}. "
        f"Recognized for building robust, scalable solutions and driving measurable business impact."
    )

    formatted_copy_text = f"""RECRUITER EXECUTIVE SUMMARY
Candidate: {name}
Target Role: {role}
Headline: {headline}

Key Highlights:
• {chr(10).join('• ' + s for s in top_strengths)}

Elevator Pitch:
{elevator_pitch}
"""

    return {
        "candidate_name": name,
        "role": role,
        "headline": headline,
        "top_strengths": top_strengths,
        "key_metrics_highlight": metric_sentences[:2],
        "elevator_pitch": elevator_pitch,
        "formatted_copy_text": formatted_copy_text.strip(),
    }

