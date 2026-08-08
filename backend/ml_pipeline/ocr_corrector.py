import logging
import re

logger = logging.getLogger(__name__)

# Lazy-loaded pipeline singleton
_ocr_pipeline = None
_pipeline_ok = None

def _get_ocr_pipeline():
    global _ocr_pipeline, _pipeline_ok
    if _pipeline_ok is True:
        return _ocr_pipeline
    if _pipeline_ok is False:
        return None
        
    try:
        from transformers import pipeline
        logger.info("[OCR Corrector] Loading sequence-to-sequence model...")
        # A lightweight model placeholder for ByT5 or similar OCR correction model.
        # In a real environment, this would be `google/byt5-small` fine-tuned on noisy text.
        _ocr_pipeline = pipeline("text2text-generation", model="google/flan-t5-small")
        _pipeline_ok = True
        logger.info("[OCR Corrector] Pipeline loaded OK.")
        return _ocr_pipeline
    except Exception as e:
        _pipeline_ok = False
        logger.warning(f"[OCR Corrector] Could not load model: {e}")
        return None

def correct_ocr_text(raw_text: str) -> str:
    """
    Applies post-OCR sequence-to-sequence error correction to fix misspellings,
    hallucinated characters, and broken words generated during PDF text extraction.
    """
    if not raw_text or not raw_text.strip():
        return raw_text
        
    pipeline = _get_ocr_pipeline()
    if not pipeline:
        return _heuristic_correction(raw_text)
        
    # Split text into manageable chunks (paragraphs) to prevent sequence length overflow
    chunks = re.split(r'\n{2,}', raw_text)
    corrected_chunks = []
    
    for chunk in chunks:
        if len(chunk.strip()) < 10:
            corrected_chunks.append(chunk)
            continue
            
        try:
            # Prompt the model to fix OCR errors
            prompt = f"Fix OCR errors in this text: {chunk[:500]}"
            result = pipeline(prompt, max_length=512, num_return_sequences=1)
            corrected_text = result[0]['generated_text'].strip()
            # If the model hallucinates wildly or deletes everything, fallback
            if len(corrected_text) < (len(chunk.strip()) * 0.3):
                corrected_chunks.append(_heuristic_correction(chunk))
            else:
                corrected_chunks.append(corrected_text)
        except Exception as e:
            logger.error(f"[OCR Corrector] Inference failed for chunk: {e}")
            corrected_chunks.append(_heuristic_correction(chunk))
            
    return "\n\n".join(corrected_chunks)

def _heuristic_correction(text: str) -> str:
    """
    Graceful fallback using regex to fix common OCR artifacts
    (e.g., '1' for 'l', '0' for 'O', spurious spaces).
    """
    # Fix common character hallucinations based on context
    text = re.sub(r'\b(l|1)n\b', 'in', text)
    text = re.sub(r'0bjective', 'Objective', text)
    
    # Remove excessive repeated punctuation
    text = re.sub(r'([.,;:-])\1+', r'\1', text)
    
    # Fix fragmented words (e.g., "M a c h i n e")
    # A crude heuristic: if we see 4+ single letters separated by spaces, join them
    text = re.sub(r'(\b[a-zA-Z]\s){3,}\b[a-zA-Z]\b', lambda m: m.group(0).replace(' ', ''), text)
    
    return text
