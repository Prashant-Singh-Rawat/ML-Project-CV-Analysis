import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from ml_pipeline.keyword_density import analyze_keyword_density

def test_keyword_density_analysis():
    cv = """Python developer building Python apps with Python, FastAPI, and Docker for cloud microservices."""
    res = analyze_keyword_density(cv, 'python developer')
    assert 'total_words' in res
    assert 'top_keywords' in res
    assert any(k['keyword'] == 'python' for k in res['top_keywords'])
    assert 'density_score' in res
