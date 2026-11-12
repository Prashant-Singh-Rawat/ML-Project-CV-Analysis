"""
LinkedIn Profile vs Resume Comparator (Issue #72)
Performs side-by-side reconciliation between uploaded Resume and LinkedIn Profile export.
Identifies discrepancies, missing skills, title mismatches, and overall consistency score.
"""

import re
from typing import Dict, Any, List


KNOWN_TECH_SKILLS = {
    "python", "javascript", "typescript", "react", "node", "node.js", "java", "c++", "c#",
    "go", "rust", "sql", "postgresql", "mysql", "mongodb", "redis", "docker", "kubernetes",
    "aws", "azure", "gcp", "git", "ci/cd", "fastapi", "django", "flask", "html", "css",
    "tailwind", "next.js", "graphql", "rest", "linux", "machine learning", "deep learning",
    "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "agile", "scrum", "jira"
}


def compare_resume_with_linkedin(cv_text: str, linkedin_text: str) -> Dict[str, Any]:
    cv_lower = cv_text.lower()
    li_lower = linkedin_text.lower()

    # 1. Skill Extraction & Diff
    cv_skills = {s for s in KNOWN_TECH_SKILLS if re.search(rf"\b{re.escape(s)}\b", cv_lower)}
    li_skills = {s for s in KNOWN_TECH_SKILLS if re.search(rf"\b{re.escape(s)}\b", li_lower)}

    matched_skills = sorted(list(cv_skills.intersection(li_skills)))
    only_in_cv = sorted(list(cv_skills - li_skills))
    only_in_linkedin = sorted(list(li_skills - cv_skills))

    # 2. Company / Employer Consistency
    # Look for common company indicators or capitalized patterns
    company_keywords = ["google", "amazon", "microsoft", "meta", "apple", "netflix", "infosys", "tcs", "oracle", "ibm", "adobe", "accenture", "deloitte", "uber", "salesforce"]
    cv_companies = {c for c in company_keywords if c in cv_lower}
    li_companies = {c for c in company_keywords if c in li_lower}

    matched_companies = sorted([c.title() for c in cv_companies.intersection(li_companies)])
    missing_in_cv_companies = sorted([c.title() for c in (li_companies - cv_companies)])
    missing_in_li_companies = sorted([c.title() for c in (cv_companies - li_companies)])

    # 3. Discrepancy Analysis & Alerts
    inconsistencies: List[Dict[str, Any]] = []

    if only_in_linkedin:
        inconsistencies.append({
            "type": "Missing Skills in Resume",
            "severity": "Medium",
            "message": f"LinkedIn lists skills ({', '.join(only_in_linkedin[:4])}) that are absent from your resume.",
            "recommendation": "Incorporate these verified LinkedIn skills into your resume to ensure consistency during recruiter checks."
        })

    if only_in_cv:
        inconsistencies.append({
            "type": "Missing Skills on LinkedIn",
            "severity": "Low",
            "message": f"Resume highlights skills ({', '.join(only_in_cv[:4])}) not found on your LinkedIn profile.",
            "recommendation": "Add these skills to your LinkedIn profile to increase recruiter search visibility."
        })

    if missing_in_cv_companies:
        inconsistencies.append({
            "type": "Employer History Mismatch",
            "severity": "High",
            "message": f"LinkedIn lists past employment at {', '.join(missing_in_cv_companies)} which is missing on your resume.",
            "recommendation": "Ensure employment histories match to avoid background check discrepancies."
        })

    if missing_in_li_companies:
        inconsistencies.append({
            "type": "Outdated LinkedIn Experience",
            "severity": "Medium",
            "message": f"Resume mentions experience at {', '.join(missing_in_li_companies)} not updated on LinkedIn.",
            "recommendation": "Update your LinkedIn profile with your latest company experience."
        })

    # Consistency Score (0-100)
    all_skills_count = max(1, len(cv_skills.union(li_skills)))
    skill_match_ratio = len(matched_skills) / all_skills_count
    
    company_match_ratio = 1.0
    all_companies_count = len(cv_companies.union(li_companies))
    if all_companies_count > 0:
        company_match_ratio = len(matched_companies) / all_companies_count

    consistency_score = int(min(100, max(35, (skill_match_ratio * 60) + (company_match_ratio * 40))))

    return {
        "consistency_score": consistency_score,
        "matched_skills": [s.title() for s in matched_skills],
        "only_in_resume": [s.title() for s in only_in_cv],
        "only_in_linkedin": [s.title() for s in only_in_linkedin],
        "matched_companies": matched_companies,
        "missing_in_resume_companies": missing_in_cv_companies,
        "missing_in_linkedin_companies": missing_in_li_companies,
        "inconsistencies": inconsistencies,
        "total_discrepancies": len(inconsistencies),
        "status": "Consistent" if consistency_score >= 80 else ("Moderate Variance" if consistency_score >= 60 else "High Discrepancy")
    }

