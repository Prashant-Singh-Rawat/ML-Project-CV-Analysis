import spacy
import pdfplumber
import io

from typing import List, Dict
import re

import sys

# Load small english model. If not installed, you can use fallbacks or install it.
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # If not found, download it or fallback to basic parsing
    import subprocess
    print("Downloading spaCy model 'en_core_web_sm'...")
    subprocess.run([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
    try:
        nlp = spacy.load("en_core_web_sm")
    except OSError:
        # Final fallback to a blank model if all else fails
        print("Failed to download model. Falling back to blank English model.")
        nlp = spacy.blank("en")

from ml_pipeline.synthetic_data import SKILLS_DB

def extract_skills(text: str) -> List[str]:
    """
    Extracts skills from text based on a predefined skills taxonomy.
    Handles variations like 'NodeJS' vs 'Node.js' and ensures word boundaries.
    """
    text_processed = text.replace(".", " ").replace("/", " ").replace("-", " ")
    text_lower = text_processed.lower()
    found_skills = []
    
    for skill in SKILLS_DB:
        # Standardize skill for comparison
        skill_clean = skill.lower().replace(".", " ").replace("-", " ")
        pattern = r'\b' + re.escape(skill_clean) + r'\b'
        
        if re.search(pattern, text_lower):
            found_skills.append(skill)
        elif skill.lower() in text_lower: # Fallback for non-word boundary cases
             # Only add if it's a reasonably long string to avoid false positives (e.g., 'C' in 'CAT')
             if len(skill) > 2:
                 found_skills.append(skill)
            
    return list(set(found_skills))

def extract_entities(text: str) -> Dict[str, List[str]]:
    """
    Uses spacy to extract proper nouns, organizations, and other entities.
    """
    doc = nlp(text)
    entities = {
        "ORG": [],
        "PERSON": [],
        "GPE": [] # Locations
    }
    
    for ent in doc.ents:
        if ent.label_ in entities.keys():
            if ent.text not in entities[ent.label_]:
                entities[ent.label_].append(ent.text)
                
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

def parse_cv_text(text: str) -> Dict[str, any]:

    """
    Main parser function that takes raw CV text and returns parsed structured data.
    """
    skills = extract_skills(text)
    entities = extract_entities(text)
    
    # Calculate text length metrics
    doc = nlp(text)
    word_count = len([token for token in doc if not token.is_punct and not token.is_space])
    
    return {
        "skills": skills,
        "organizations": entities["ORG"],
        "persons": entities["PERSON"],
        "locations": entities["GPE"],
        "word_count": word_count,
        "raw_text": text
    }

if __name__ == "__main__":
    sample_cv = "I am an experienced Software Engineer with 5 years at Google. I excel in Python, Machine Learning, and SQL."
    print(parse_cv_text(sample_cv))
