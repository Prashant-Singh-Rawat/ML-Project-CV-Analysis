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


from ml_pipeline.tone_analyzer import extract_summary_section, analyze_tone

# Fallback mocks in case previous PRs aren't fully merged into this branch
def redact_pii(text, entities): return text
class MockKG:
    def infer_implicit_skills(self, skills): return []
def get_skill_knowledge_graph(): return MockKG()

def parse_cv_text(text: str) -> dict[str, any]:
    """
    Main parser function that takes raw CV text and returns parsed structured data.
    """
    skills = extract_skills(text)
    entities = extract_entities(text)
    
    # Analyze tone from summary
    summary = extract_summary_section(text)
    tone_analysis = analyze_tone(summary)


    # Simple word count using split (no spacy needed)
    word_count = len([w for w in re.split(r"\s+", text) if w.strip()])

    return {
        "skills": skills,
        "implicit_skills": implicit_skills,
        "summary": summary,
        "tone_analysis": tone_analysis,
        "organizations": entities["ORG"],
        "persons": entities["PERSON"],
        "locations": entities["GPE"],
        "word_count": word_count,
        "raw_text": text,
    }


if __name__ == "__main__":
    sample_cv = "I am an experienced Software Engineer with 5 years at Google. I excel in Python, Machine Learning, and SQL."
    print(parse_cv_text(sample_cv))
