import logging
import re

logger = logging.getLogger(__name__)

# Lazy-loaded pipeline singleton
_tone_pipeline = None
_pipeline_ok = None

def _get_tone_pipeline():
    global _tone_pipeline, _pipeline_ok
    if _pipeline_ok is True:
        return _tone_pipeline
    if _pipeline_ok is False:
        return None
        
    try:
        from transformers import pipeline
        logger.info("[Tone Analyzer] Loading zero-shot-classification pipeline...")
        # A lightweight zero-shot classification model for tone analysis
        _tone_pipeline = pipeline("zero-shot-classification", model="typeform/distilbert-base-uncased-mnli")
        _pipeline_ok = True
        logger.info("[Tone Analyzer] Pipeline loaded OK.")
        return _tone_pipeline
    except Exception as e:
        _pipeline_ok = False
        logger.warning(f"[Tone Analyzer] Could not load model: {e}")
        return None

def extract_summary_section(text: str) -> str:
    """
    Attempts to extract the Summary or Objective section from the CV text.
    Uses regex to find common headers and extracts the text up to the next header.
    """
    # Look for Summary, Objective, Profile, About Me
    header_pattern = re.compile(r"^\s*(Summary|Objective|Profile|About Me|Professional Summary|Career Objective)\s*$", re.IGNORECASE | re.MULTILINE)
    
    match = header_pattern.search(text)
    if not match:
        return ""
        
    start_pos = match.end()
    
    # Common headers to signify the end of the summary section
    next_header_pattern = re.compile(r"^\s*(Experience|Work History|Employment|Education|Skills|Projects|Certifications)\s*$", re.IGNORECASE | re.MULTILINE)
    
    next_match = next_header_pattern.search(text, start_pos)
    if next_match:
        end_pos = next_match.start()
        summary = text[start_pos:end_pos].strip()
    else:
        # If no next header is found, just take a chunk of text (e.g., first 500 chars)
        summary = text[start_pos:start_pos+500].strip()
        
    return summary

def analyze_tone(text: str) -> dict:
    """
    Analyzes the tone of the given text (e.g., a CV summary) 
    using a zero-shot classification model.
    """
    if not text or len(text.strip()) < 20:
        return {"error": "Text too short or missing", "tones": {}}
        
    # Limit text length to prevent long inference times
    text = text[:1000]
        
    pipeline = _get_tone_pipeline()
    if not pipeline:
        return {"error": "Model unavailable", "tones": {}}
        
    try:
        candidate_labels = ["action-oriented", "collaborative", "analytical", "leadership", "innovative"]
        result = pipeline(text, candidate_labels, multi_label=True)
        
        tones = {label: round(score * 100, 1) for label, score in zip(result['labels'], result['scores'])}
        
        # Sort by score descending
        sorted_tones = dict(sorted(tones.items(), key=lambda item: item[1], reverse=True))
        
        return {
            "primary_tone": list(sorted_tones.keys())[0],
            "tones": sorted_tones
        }
    except Exception as e:
        logger.error(f"[Tone Analyzer] Inference failed: {e}")
        return {"error": str(e), "tones": {}}
