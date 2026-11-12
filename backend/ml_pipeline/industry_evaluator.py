"""
Industry-Specific Resume Evaluator (Issue #66)
Evaluates resume against tailored industry rubrics, benchmarks, and core competencies.
"""

import re
from typing import Dict, Any, List


INDUSTRY_PROFILES: Dict[str, Dict[str, Any]] = {
    "tech": {
        "title": "Technology & Software Engineering",
        "keywords": [
            "python", "javascript", "react", "docker", "kubernetes", "git", "ci/cd",
            "sql", "api", "rest", "microservices", "cloud", "aws", "data structures",
            "algorithms", "unit testing", "linux", "backend", "frontend"
        ],
        "key_metrics": "System scalability, response times, deployment pipelines, latency, test coverage",
        "weight_projects": 25,
        "weight_experience": 30,
        "weight_skills": 30,
        "weight_education": 15,
        "tips": [
            "Highlight production metrics (e.g., 'reduced API latency by 35%').",
            "Include GitHub or live project URLs directly in your contact or project headers.",
            "List specific tools and frameworks rather than broad categories.",
        ]
    },
    "data_science": {
        "title": "Data Science & Artificial Intelligence",
        "keywords": [
            "python", "pandas", "numpy", "machine learning", "deep learning", "sql",
            "scikit-learn", "tensorflow", "pytorch", "statistics", "data analysis",
            "nlp", "computer vision", "feature engineering", "tableau", "bigquery"
        ],
        "key_metrics": "Model accuracy, precision/recall, AUC-ROC, business ROI, dataset volume",
        "weight_projects": 25,
        "weight_experience": 30,
        "weight_skills": 30,
        "weight_education": 15,
        "tips": [
            "Mention model evaluation metrics (F1 score, AUC, MAE) rather than just stating 'built a model'.",
            "Highlight data pipeline tools (Spark, Airflow, SQL) alongside ML modeling.",
            "Demonstrate end-to-end deployment (FastAPI, Docker, Streamlit) of data products.",
        ]
    },
    "finance": {
        "title": "Finance & Investment Banking",
        "keywords": [
            "financial modeling", "valuation", "excel", "dcf", "risk management",
            "portfolio", "forecasting", "budgeting", "compliance", "sec", "audit",
            "accounting", "equity research", "cfa", "asset management", "m&a"
        ],
        "key_metrics": "Portfolio returns, deal volume ($ millions), cost savings, P&L responsibility",
        "weight_projects": 15,
        "weight_experience": 40,
        "weight_skills": 25,
        "weight_education": 20,
        "tips": [
            "Quantify dollar amounts, portfolio sizes, and percentage returns explicitly.",
            "Prominently display certifications like CFA, CPA, or FINRA series licenses.",
            "Use standard reverse-chronological Wall Street/financial template layouts.",
        ]
    },
    "healthcare": {
        "title": "Healthcare & Biotechnology",
        "keywords": [
            "clinical", "patient care", "hipaa", "protocol", "fda", "pharmacology",
            "biotechnology", "medical records", "ehr", "emr", "trial", "research",
            "compliance", "diagnosis", "laboratory", "gcp", "gmp"
        ],
        "key_metrics": "Patient outcomes, clinical trial phases, regulatory audits passed, lab accuracy",
        "weight_projects": 15,
        "weight_experience": 35,
        "weight_skills": 25,
        "weight_education": 25,
        "tips": [
            "Ensure licenses, state boards, and credentials (RN, MD, PhD, BLS) are in the header.",
            "Detail compliance with HIPAA, FDA, GCP, and other regulatory frameworks.",
            "Highlight cross-disciplinary teamwork with clinical and administrative staff.",
        ]
    },
    "marketing": {
        "title": "Marketing, Sales & Growth",
        "keywords": [
            "seo", "sem", "google analytics", "campaign", "conversion rate", "ctr",
            "lead generation", "crm", "hubspot", "salesforce", "roi", "social media",
            "content strategy", "cac", "ltv", "funnel", "a/b testing"
        ],
        "key_metrics": "Revenue generated, conversion rate improvements, CAC reductions, impressions, ROI",
        "weight_projects": 20,
        "weight_experience": 40,
        "weight_skills": 25,
        "weight_education": 15,
        "tips": [
            "Lead every bullet with marketing metrics (e.g. '+120% organic traffic growth in 6 months').",
            "Demonstrate proficiency in modern growth stacks (GA4, HubSpot, Mixpanel, A/B testing).",
            "Showcase budget ownership and customer acquisition cost (CAC) efficiency.",
        ]
    },
    "product": {
        "title": "Product & Project Management",
        "keywords": [
            "agile", "scrum", "product roadmap", "user stories", "stakeholder management",
            "kpi", "okr", "cross-functional", "sprint planning", "jira", "user research",
            "prioritization", "wireframing", "product lifecycle", "mvp"
        ],
        "key_metrics": "Feature adoption, sprint velocity, customer churn reduction, CSAT, time-to-market",
        "weight_projects": 20,
        "weight_experience": 40,
        "weight_skills": 25,
        "weight_education": 15,
        "tips": [
            "Emphasize outcomes over output (e.g. 'boosted DAU by 28%' instead of 'shipped 5 features').",
            "Highlight cross-functional leadership across engineering, design, and executive stakeholders.",
            "Mention certifications like PMP, Scrum Master (CSM), or Pragmatic Institute.",
        ]
    },
}


def evaluate_industry_fit(cv_text: str, industry_key: str = "tech") -> Dict[str, Any]:
    norm_key = industry_key.lower().replace("-", "_").replace(" ", "_")
    profile = INDUSTRY_PROFILES.get(norm_key, INDUSTRY_PROFILES["tech"])

    text_lower = cv_text.lower()
    matched_keywords: List[str] = []
    missing_keywords: List[str] = []

    for kw in profile["keywords"]:
        # Handle simple token match or phrase match
        if re.search(rf"\b{re.escape(kw)}\b", text_lower):
            matched_keywords.append(kw)
        else:
            missing_keywords.append(kw)

    total_expected = len(profile["keywords"])
    match_ratio = len(matched_keywords) / total_expected

    # Score from 40 to 98
    fit_score = int(min(98, max(35, round(match_ratio * 100 * 1.15))))

    if fit_score >= 80:
        fit_tier = "Strong Alignment"
    elif fit_score >= 60:
        fit_tier = "Moderate Alignment"
    else:
        fit_tier = "Needs Optimization"

    return {
        "industry_key": norm_key,
        "industry_title": profile["title"],
        "fit_score": fit_score,
        "fit_tier": fit_tier,
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords[:8],
        "matched_count": len(matched_keywords),
        "total_industry_keywords": total_expected,
        "recommended_metrics": profile["key_metrics"],
        "industry_tips": profile["tips"],
        "available_industries": [
            {"key": k, "title": v["title"]} for k, v in INDUSTRY_PROFILES.items()
        ]
    }

