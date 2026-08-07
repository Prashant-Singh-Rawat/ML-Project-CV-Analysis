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


from transformers import pipeline

# Load RoBERTa NER pipeline for skill extraction (lazy loading to save memory on startup)
_roberta_ner_pipeline = None

def get_roberta_pipeline():
    global _roberta_ner_pipeline
    if _roberta_ner_pipeline is None:
        try:
            # Using a generic RoBERTa NER model; in production, this would be a fine-tuned model for skills
            _roberta_ner_pipeline = pipeline("ner", model="Jean-Baptiste/roberta-large-ner-english", aggregation_strategy="simple")
        except Exception as e:
            print(f"Error loading RoBERTa pipeline: {e}")
            _roberta_ner_pipeline = False
    return _roberta_ner_pipeline

def extract_skills(text: str) -> List[str]:
    """
    Extracts skills from text based on a predefined skills taxonomy and RoBERTa NER pipeline.
    Handles variations like 'NodeJS' vs 'Node.js' and ensures word boundaries.
    """
    text_processed = text.replace(".", " ").replace("/", " ").replace("-", " ")
    text_lower = text_processed.lower()
    found_skills = set()

    # 1. Regex/Taxonomy based extraction (fast path)
    for skill in SKILLS_DB:
        skill_clean = skill.lower().replace(".", " ").replace("-", " ")
        pattern = r"\b" + re.escape(skill_clean) + r"\b"
        if re.search(pattern, text_lower):
            found_skills.add(skill)
        elif skill.lower() in text_lower:
            if len(skill) > 2:
                found_skills.add(skill)
                
    # 2. RoBERTa NER based extraction (advanced semantic path)
    ner_pipe = get_roberta_pipeline()
    if ner_pipe:
        try:
            # Truncate text to avoid exceeding max sequence length of RoBERTa (usually 512 tokens)
            # A simple character truncation as approximation
            truncated_text = text[:2000]
            ner_results = ner_pipe(truncated_text)
            
            for entity in ner_results:
                # Typically skills might be recognized under various entity types depending on the model,
                # e.g., 'MISC' or custom 'SKILL' tags in a fine-tuned model.
                if entity['entity_group'] in ['MISC', 'ORG', 'SKILL']:
                    extracted_word = entity['word'].strip()
                    if len(extracted_word) > 2 and extracted_word.lower() not in [s.lower() for s in found_skills]:
                        # Optional: check against an expanded dictionary or just accept as candidate skill
                        found_skills.add(extracted_word)
        except Exception as e:
            print(f"RoBERTa NER extraction failed: {e}")

    return list(found_skills)


def extract_entities(text: str) -> Dict[str, List[str]]:
    """
    Uses spacy to extract proper nouns, organizations, and other entities.
    """
    doc = nlp(text)
    entities = {"ORG": [], "PERSON": [], "GPE": []}  # Locations

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
    word_count = len(
        [token for token in doc if not token.is_punct and not token.is_space]
    )

    return {
        "skills": skills,
        "organizations": entities["ORG"],
        "persons": entities["PERSON"],
        "locations": entities["GPE"],
        "word_count": word_count,
        "raw_text": text,
    }


if __name__ == "__main__":
    sample_cv = "I am an experienced Software Engineer with 5 years at Google. I excel in Python, Machine Learning, and SQL."
    print(parse_cv_text(sample_cv))
