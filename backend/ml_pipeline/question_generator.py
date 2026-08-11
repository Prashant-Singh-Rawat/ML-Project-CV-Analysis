import logging
import re

logger = logging.getLogger(__name__)

# Lazy-loaded pipeline singleton
_qg_pipeline = None
_pipeline_ok = None

def _get_qg_pipeline():
    global _qg_pipeline, _pipeline_ok
    if _pipeline_ok is True:
        return _qg_pipeline
    if _pipeline_ok is False:
        return None
        
    try:
        from transformers import pipeline
        logger.info("[Question Generator] Loading text2text-generation pipeline...")
        # A lightweight model for context-based question generation
        # In production, this would be a larger LLM like LLaMA-3 via an API or local vLLM instance
        _qg_pipeline = pipeline("text2text-generation", model="google/flan-t5-small")
        _pipeline_ok = True
        logger.info("[Question Generator] Pipeline loaded OK.")
        return _qg_pipeline
    except Exception as e:
        _pipeline_ok = False
        logger.warning(f"[Question Generator] Could not load model: {e}")
        return None

def generate_interview_questions(skills: list, summary: str) -> list:
    """
    Generates personalized interview questions based on the candidate's skills and summary.
    """
    if not skills and not summary:
        return []
        
    pipeline = _get_qg_pipeline()
    if not pipeline:
        return _fallback_questions(skills)
        
    questions = []
    
    # 1. Generate a question based on the summary
    if summary and len(summary) > 20:
        try:
            prompt = f"Generate an interview question asking the candidate to elaborate on this experience: {summary[:300]}"
            result = pipeline(prompt, max_length=50, num_return_sequences=1)
            q = result[0]['generated_text'].strip()
            if q and not q.isspace():
                questions.append(q)
        except Exception as e:
            logger.error(f"[Question Generator] Summary inference failed: {e}")
            
    # 2. Generate questions based on top skills
    top_skills = skills[:3]
    for skill in top_skills:
        try:
            prompt = f"Generate a technical interview question to assess a candidate's practical experience with {skill}."
            result = pipeline(prompt, max_length=50, num_return_sequences=1)
            q = result[0]['generated_text'].strip()
            if q and not q.isspace() and q not in questions:
                questions.append(q)
        except Exception as e:
            logger.error(f"[Question Generator] Skill inference failed for {skill}: {e}")

    # Fallback if inference failed to produce anything useful
    if not questions:
        return _fallback_questions(skills)
        
    return questions

def _fallback_questions(skills: list) -> list:
    """Simple heuristic fallback if LLM inference fails."""
    questions = []
    if skills:
        top_skills = skills[:3]
        for skill in top_skills:
            questions.append(f"Can you describe a challenging project where you utilized {skill} and what your specific contribution was?")
    else:
        questions.append("Can you walk me through the most technically challenging project on your resume?")
    return questions
