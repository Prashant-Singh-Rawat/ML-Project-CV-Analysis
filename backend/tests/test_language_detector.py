import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from ml_pipeline.language_detector import detect_resume_language

def test_language_detection_en_es():
    cv_en = 'Senior software engineer with extensive experience in system design and database architecture.'
    res_en = detect_resume_language(cv_en)
    assert res_en['language_code'] == 'en'
    
    cv_es = 'Experiencia laboral en desarrollo de software y sistemas distribuidos en la universidad.'
    res_es = detect_resume_language(cv_es)
    assert res_es['language_code'] == 'es'
