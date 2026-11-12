"""
Multi-Language Resume Detector & Localizer (Issue #61)
Identifies resume language, script, confidence, and multilingual ATS guidance.
"""

import re
from typing import Dict, Any


LANGUAGE_PATTERNS = {
    "es": {
        "name": "Spanish",
        "keywords": {"experiencia", "educacion", "educación", "habilidades", "resumen", "contacto", "idiomas", "proyectos", "laboral", "universidad"},
        "flag": "🇪🇸",
    },
    "fr": {
        "name": "French",
        "keywords": {"experience", "expérience", "formation", "competences", "compétences", "profil", "langues", "projets", "universite", "université"},
        "flag": "🇫🇷",
    },
    "de": {
        "name": "German",
        "keywords": {"berufserfahrung", "ausbildung", "kenntnisse", "sprachen", "projekte", "studium", "lebenslauf", "kontakt", "qualifikationen"},
        "flag": "🇩🇪",
    },
    "pt": {
        "name": "Portuguese",
        "keywords": {"experiencia", "experiência", "educacao", "educação", "habilidades", "competencias", "projetos", "idiomas", "resumo"},
        "flag": "🇵🇹",
    },
    "hi": {
        "name": "Hindi",
        "keywords": {"अनुभव", "शिक्षा", "कौशल", "परियोजना", "संपर्क", "विवरण", "योग्यता"},
        "flag": "🇮🇳",
    },
    "en": {
        "name": "English",
        "keywords": {"experience", "education", "skills", "summary", "projects", "certifications", "profile", "contact", "work"},
        "flag": "🇬🇧",
    },
}


def detect_resume_language(cv_text: str) -> Dict[str, Any]:
    text_lower = cv_text.lower()
    tokens = set(re.findall(r"\b[\wÀ-ÿ]+\b", text_lower))

    scores = {}
    for code, info in LANGUAGE_PATTERNS.items():
        matched = tokens.intersection(info["keywords"])
        scores[code] = len(matched)

    # Check for Devanagari script (Hindi/Marathi)
    has_devanagari = bool(re.search(r"[\u0900-\u097F]", cv_text))
    if has_devanagari:
        scores["hi"] = scores.get("hi", 0) + 10

    best_code = max(scores, key=scores.get) if scores else "en"
    highest_score = scores.get(best_code, 0)

    # Default to English if no strong indicator or if English is equal or highest
    if scores.get("en", 0) >= highest_score or highest_score == 0:
        best_code = "en"
        confidence = 0.95
    else:
        confidence = min(0.98, round(0.6 + (highest_score * 0.08), 2))

    lang_info = LANGUAGE_PATTERNS.get(best_code, LANGUAGE_PATTERNS["en"])

    is_english = (best_code == "en")
    recommendations = []
    if not is_english:
        recommendations.append(
            f"Resume detected in {lang_info['name']} {lang_info['flag']}. For international and US/UK roles, creating an English version ensures maximum ATS compatibility."
        )
        recommendations.append("Ensure technical skill names (Python, React, AWS, Docker) match standard English naming.")
    else:
        recommendations.append("Language is English — compatible with standard international Applicant Tracking Systems.")

    return {
        "language_code": best_code,
        "language_name": lang_info["name"],
        "flag": lang_info["flag"],
        "confidence": confidence,
        "is_english": is_english,
        "requires_translation_for_global_ats": not is_english,
        "recommendations": recommendations,
    }

