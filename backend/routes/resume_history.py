from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional
import re

from auth import resume_history_db

router = APIRouter(prefix="/resume-history", tags=["Resume History"])

KNOWN_RESUME_SKILLS = [
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "C",
    "C++",
    "C#",
    "SQL",
    "HTML",
    "CSS",
    "React",
    "Angular",
    "Vue.js",
    "Node.js",
    "Express.js",
    "FastAPI",
    "Django",
    "Flask",
    "Spring Boot",
    "Machine Learning",
    "Deep Learning",
    "Data Analysis",
    "Data Structures",
    "Algorithms",
    "System Design",
    "OOP",
    "DBMS",
    "Cybersecurity",
    "AWS",
    "Azure",
    "GCP",
    "Docker",
    "Kubernetes",
    "Terraform",
    "Jenkins",
    "CI/CD",
    "Git",
    "Linux",
    "Postman",
    "Pandas",
    "NumPy",
    "TensorFlow",
    "PyTorch",
    "Scikit-Learn",
    "Rust",
    "Go",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Firebase",
]


class ResumeHistoryCreateRequest(BaseModel):
    user_id: int
    resume_name: Optional[str] = None
    analysis_result: Dict[str, Any]


class ResumeHistoryCompareRequest(BaseModel):
    user_id: int
    base_version_id: int = Field(..., description="Older resume version id")
    target_version_id: int = Field(..., description="Newer resume version id")


@router.post("")
async def save_resume_version(req: ResumeHistoryCreateRequest):
    if not req.analysis_result:
        raise HTTPException(status_code=400, detail="Analysis result is required.")

    parsed = _extract_snapshot(req.analysis_result)
    return resume_history_db.create_resume_version(
        user_id=req.user_id,
        resume_name=req.resume_name or "Resume analysis",
        ats_score=parsed["ats_score"],
        skills=parsed["skills"],
        projects=parsed["projects"],
        experience=parsed["experience"],
        certifications=parsed["certifications"],
        analysis_result=req.analysis_result,
    )


@router.get("/{user_id}")
async def get_resume_history(user_id: int):
    return {"versions": resume_history_db.list_resume_versions(user_id)}


@router.post("/compare")
async def compare_resume_versions(req: ResumeHistoryCompareRequest):
    base = resume_history_db.get_resume_version(req.base_version_id)
    target = resume_history_db.get_resume_version(req.target_version_id)

    if not base or not target:
        raise HTTPException(status_code=404, detail="Resume version not found.")
    if base["user_id"] != req.user_id or target["user_id"] != req.user_id:
        raise HTTPException(status_code=403, detail="Cannot compare another user's resume versions.")

    added_skills, removed_skills = _diff_items(base["skills"], target["skills"])
    added_projects, removed_projects = _diff_items(base["projects"], target["projects"])
    added_experience, removed_experience = _diff_items(base["experience"], target["experience"])
    added_certifications, removed_certifications = _diff_items(
        base["certifications"], target["certifications"]
    )
    score_delta = round((target["ats_score"] or 0) - (base["ats_score"] or 0), 2)

    return {
        "base_version": base,
        "target_version": target,
        "score_delta": score_delta,
        "added_skills": added_skills,
        "removed_skills": removed_skills,
        "section_changes": {
            "projects": {"added": added_projects, "removed": removed_projects},
            "experience": {"added": added_experience, "removed": removed_experience},
            "certifications": {
                "added": added_certifications,
                "removed": removed_certifications,
            },
        },
        "summary": _comparison_summary(score_delta, added_skills, removed_skills),
    }


def _extract_snapshot(analysis):
    cv_text = analysis.get("cv_text", "") or ""
    matched = analysis.get("matched_skills") or []
    missing = analysis.get("missing_skills") or []
    skills = _unique_text_items([*matched, *missing, *_extract_known_skills(cv_text)])

    return {
        "ats_score": float(
            analysis.get("skill_match_pct")
            or analysis.get("ats_score")
            or analysis.get("placement_probability")
            or 0
        ),
        "skills": skills,
        "projects": _extract_section_lines(cv_text, ["projects", "project"]),
        "experience": _extract_section_lines(
            cv_text, ["experience", "work experience", "employment"]
        ),
        "certifications": _extract_section_lines(
            cv_text, ["certifications", "certificates", "licenses"]
        ),
    }


def _extract_known_skills(text):
    if not text:
        return []

    found = []
    for skill in KNOWN_RESUME_SKILLS:
        pattern = rf"(?<![A-Za-z0-9+#./-]){re.escape(skill)}(?![A-Za-z0-9+#./-])"
        if re.search(pattern, text, re.IGNORECASE):
            found.append(skill)
    return found


def _extract_section_lines(text, headings):
    if not text:
        return []

    stop_words = [
        "education",
        "skills",
        "projects",
        "experience",
        "work experience",
        "certifications",
        "certificates",
        "achievements",
        "summary",
        "profile",
    ]
    heading_pattern = "|".join(re.escape(h) for h in headings)
    stop_pattern = "|".join(re.escape(s) for s in stop_words if s not in headings)
    match = re.search(
        rf"(?is)\b({heading_pattern})\b\s*:?\s*(.*?)(?=\n\s*(?:{stop_pattern})\b\s*:|\Z)",
        text,
    )
    if not match:
        return []

    lines = [
        re.sub(r"^[\s\-*•]+", "", line).strip()
        for line in match.group(2).splitlines()
    ]
    return _unique_text_items([line for line in lines if len(line) > 3])


def _unique_text_items(items):
    seen = set()
    unique = []
    for item in items:
        text = str(item).strip()
        key = text.lower()
        if text and key not in seen:
            seen.add(key)
            unique.append(text)
    return unique


def _diff_items(old_items, new_items):
    old_map = {item.lower(): item for item in old_items}
    new_map = {item.lower(): item for item in new_items}
    added = [new_map[key] for key in new_map.keys() - old_map.keys()]
    removed = [old_map[key] for key in old_map.keys() - new_map.keys()]
    return added, removed


def _comparison_summary(score_delta, added_skills, removed_skills):
    parts = []
    if score_delta > 0:
        parts.append(f"ATS score improved by {score_delta} points.")
    elif score_delta < 0:
        parts.append(f"ATS score decreased by {abs(score_delta)} points.")
    else:
        parts.append("ATS score stayed the same.")

    if added_skills:
        parts.append(f"Added {len(added_skills)} skill(s): {', '.join(added_skills[:5])}.")
    if removed_skills:
        parts.append(f"Removed {len(removed_skills)} skill(s): {', '.join(removed_skills[:5])}.")
    if not added_skills and not removed_skills:
        parts.append("Skill coverage is unchanged; improve impact bullets and section detail next.")
    return " ".join(parts)
