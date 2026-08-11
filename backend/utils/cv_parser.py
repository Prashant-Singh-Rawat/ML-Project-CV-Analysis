import io
import re

import pdfplumber

from ml_pipeline.synthetic_data import SKILLS_DB
from ml_pipeline.entity_resolver import get_entity_resolver
from ml_pipeline.anomaly_detector import get_anomaly_detector
from ml_pipeline.question_generator import generate_interview_questions
from ml_pipeline.contrastive_matcher import get_contrastive_matcher

# ── Known tech companies / organisations for lightweight NER ─────────────────
_KNOWN_ORGS = [
    "Google",
    "Amazon",
    "Microsoft",
    "Meta",
    "Apple",
    "Netflix",
    "Uber",
    "Airbnb",
    "Twitter",
    "LinkedIn",
    "Salesforce",
    "Adobe",
    "Oracle",
    "IBM",
    "Intel",
    "NVIDIA",
    "Qualcomm",
    "Samsung",
    "Sony",
    "Accenture",
    "Infosys",
    "TCS",
    "Wipro",
    "HCL",
    "Cognizant",
    "Capgemini",
    "Deloitte",
    "McKinsey",
    "BCG",
    "Bain",
    "JPMorgan",
    "Goldman Sachs",
    "Morgan Stanley",
]

_KNOWN_LOCS = [
    "India",
    "USA",
    "United States",
    "UK",
    "United Kingdom",
    "Germany",
    "France",
    "Canada",
    "Australia",
    "Singapore",
    "Japan",
    "China",
    "Bangalore",
    "Mumbai",
    "Delhi",
    "Hyderabad",
    "Chennai",
    "Pune",
    "New York",
    "San Francisco",
    "London",
    "Berlin",
    "Seattle",
    "Austin",
]


def extract_skills(text: str) -> list[str]:
    """
    Extracts skills from text based on a predefined skills taxonomy.
    Handles variations like 'NodeJS' vs 'Node.js' and ensures word boundaries.
    """
    text_processed = text.replace(".", " ").replace("/", " ").replace("-", " ")
    text_lower = text_processed.lower()
    found_skills = []

    for skill in SKILLS_DB:
        skill_clean = skill.lower().replace(".", " ").replace("-", " ")
        pattern = r"\b" + re.escape(skill_clean) + r"\b"

        if re.search(pattern, text_lower):
            found_skills.append(skill)
        elif skill.lower() in text_lower and len(skill) > 2:
            found_skills.append(skill)

    return list(set(found_skills))


def extract_entities(text: str) -> dict[str, list[str]]:
    """
    Lightweight regex-based entity extraction (no spacy dependency).
    Detects known organisations, locations, and capitalised proper nouns.
    """
    entities: dict[str, list[str]] = {"ORG": [], "PERSON": [], "GPE": []}

    # Match known orgs
    for org in _KNOWN_ORGS:
        if re.search(r"\b" + re.escape(org) + r"\b", text, re.IGNORECASE):
            if org not in entities["ORG"]:
                entities["ORG"].append(org)

    # Match known locations
    for loc in _KNOWN_LOCS:
        if re.search(r"\b" + re.escape(loc) + r"\b", text, re.IGNORECASE):
            if loc not in entities["GPE"]:
                entities["GPE"].append(loc)

    # Heuristic: two consecutive Title-Case words = likely a person name
    person_pattern = re.compile(r"\b([A-Z][a-z]+ [A-Z][a-z]+)\b")
    for match in person_pattern.findall(text):
        # Exclude if it looks like a job title or organisation
        if match not in entities["ORG"] and match not in entities["GPE"]:
            if match not in entities["PERSON"]:
                entities["PERSON"].append(match)

    return entities


def _estimate_experience_and_seniority(text: str) -> tuple[float, float]:
    """Mock heuristic to estimate years of experience and seniority score."""
    years = 2.0
    seniority = 3.0
    
    # Very crude heuristic for mock purposes
    if "senior" in text.lower() or "lead" in text.lower():
        seniority = 8.0
    if "executive" in text.lower() or "vp" in text.lower():
        seniority = 10.0
        
    year_match = re.search(r"(\d+)\+?\s*years", text.lower())
    if year_match:
        years = float(year_match.group(1))
        
    return years, seniority


def _extract_mock_summary(text: str) -> str:
    """Extracts a short snippet from the text to serve as the summary for generation."""
    return text[:300] if len(text) > 300 else text

def _extract_mock_university(text: str) -> str:
    """Mock heuristic to extract a university name."""
    match = re.search(r"(?:University of [A-Z][a-z]+|[A-Z][a-z]+ University|MIT|IIT\s?[A-Za-z]*)", text)
    if match:
        return match.group(0)
    return ""


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extracts text from a PDF file using pdfplumber.
    """
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text


def parse_cv_text(text: str, jd_text: str = None) -> dict[str, any]:
    """
    Main parser function that takes raw CV text and returns parsed structured data.
    """
    skills = extract_skills(text)
    entities = extract_entities(text)
    years_exp, seniority = _estimate_experience_and_seniority(text)

    # Entity Resolution for Education
    raw_university = _extract_mock_university(text)
    resolver = get_entity_resolver()
    education_resolution = resolver.resolve_institution(raw_university)

    # Simple word count using split (no spacy needed)
    word_count = len([w for w in re.split(r"\s+", text) if w.strip()])

    return {
        "skills": skills,
        "organizations": entities["ORG"],
        "persons": entities["PERSON"],
        "locations": entities["GPE"],
        "word_count": word_count,
        "raw_text": text,
        "education_resolution": education_resolution
    }


if __name__ == "__main__":
    sample_cv = "I am an experienced Software Engineer with 5 years at Google. I excel in Python, Machine Learning, and SQL."
    print(parse_cv_text(sample_cv))
