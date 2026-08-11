import io
import re

import pdfplumber

from ml_pipeline.synthetic_data import SKILLS_DB

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


def redact_pii(text: str, entities: dict[str, list[str]]) -> str:
    """
    Redacts Personally Identifiable Information (PII) to mitigate bias.
    Redacts Names (PERSON), specific dates/years (age/graduation bias), 
    and gendered pronouns.
    """
    debiased_text = text
    
    # 1. Redact extracted names
    for name in entities.get("PERSON", []):
        debiased_text = re.sub(r"\b" + re.escape(name) + r"\b", "[REDACTED_NAME]", debiased_text, flags=re.IGNORECASE)
        
    # 2. Redact years (e.g., graduation years, birth years) to prevent age bias
    # Looks for years between 1950 and 2050
    debiased_text = re.sub(r"\b(19[5-9]\d|20[0-4]\d)\b", "[REDACTED_YEAR]", debiased_text)
    
    # 3. Redact gendered pronouns (He/She, Him/Her, His/Hers)
    gender_replacements = {
        r"\bhe\b": "they",
        r"\bshe\b": "they",
        r"\bhim\b": "them",
        r"\bher\b": "them",
        r"\bhis\b": "their",
        r"\bhers\b": "theirs",
        r"\bhimslef\b": "themself",
        r"\bherself\b": "themself"
    }
    
    for pattern, replacement in gender_replacements.items():
        # Case insensitive replacement, but trying to preserve some casing is complex; 
        # for ML models, lowercasing or just substituting is usually enough.
        debiased_text = re.sub(pattern, replacement, debiased_text, flags=re.IGNORECASE)
        
    # 4. Redact potential affiliated organizations that could infer ethnicity/gender
    biased_org_keywords = ["women", "black", "hispanic", "asian", "christian", "muslim", "jewish", "lgbt", "queer"]
    for org in entities.get("ORG", []):
        if any(keyword in org.lower() for keyword in biased_org_keywords):
            debiased_text = re.sub(r"\b" + re.escape(org) + r"\b", "[REDACTED_AFFILIATION]", debiased_text, flags=re.IGNORECASE)

    return debiased_text

def parse_cv_text(text: str) -> dict[str, any]:
    """
    Main parser function that takes raw CV text and returns parsed structured data.
    """
    skills = extract_skills(text)
    entities = extract_entities(text)
    debiased_text = redact_pii(text, entities)

    # Simple word count using split (no spacy needed)
    word_count = len([w for w in re.split(r"\s+", text) if w.strip()])

    return {
        "skills": skills,
        "organizations": entities["ORG"],
        "persons": entities["PERSON"],
        "locations": entities["GPE"],
        "word_count": word_count,
        "raw_text": text,
        "debiased_text": debiased_text
    }


if __name__ == "__main__":
    sample_cv = "I am an experienced Software Engineer with 5 years at Google. I excel in Python, Machine Learning, and SQL."
    print(parse_cv_text(sample_cv))
