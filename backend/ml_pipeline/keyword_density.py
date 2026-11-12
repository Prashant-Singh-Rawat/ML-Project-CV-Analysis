"""
Resume Keyword Density Analyzer (Issue #60)
Analyzes word frequency, density distribution, keyword stuffing warnings, and missing terms.
"""

import re
from collections import Counter
from typing import Dict, Any, List


STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
    "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both",
    "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't",
    "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't",
    "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
    "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll",
    "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's",
    "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on",
    "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own",
    "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some",
    "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then",
    "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this",
    "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we",
    "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's",
    "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with",
    "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your",
    "yours", "yourself", "yourselves", "etc", "using", "used", "worked", "working", "also",
}

ROLE_KEYWORD_BANKS = {
    "software engineer": ["python", "javascript", "react", "docker", "api", "git", "sql", "testing", "ci/cd", "microservices", "cloud", "aws", "architecture"],
    "data scientist": ["python", "machine learning", "pandas", "numpy", "sql", "statistics", "data analysis", "nlp", "scikit-learn", "deep learning", "visualization", "tableau"],
    "ml engineer": ["python", "pytorch", "tensorflow", "mlops", "docker", "kubernetes", "model deployment", "onnx", "cloud", "distributed systems", "scikit-learn"],
    "product manager": ["agile", "roadmap", "stakeholder", "kpi", "user research", "analytics", "cross-functional", "scrum", "strategy", "mvp", "prioritization"],
}


def analyze_keyword_density(cv_text: str, target_role: str = "") -> Dict[str, Any]:
    raw_tokens = re.findall(r"\b[a-zA-Z0-9+#.-]{2,}\b", cv_text.lower())
    total_tokens = len(raw_tokens)
    
    if total_tokens == 0:
        return {
            "total_words": 0,
            "unique_keywords": 0,
            "top_keywords": [],
            "stuffing_warnings": [],
            "missing_role_keywords": [],
            "density_score": 0,
            "recommendations": ["Upload or paste resume text to analyze keyword density."],
        }

    # Filter stop words and pure numbers
    filtered_tokens = [
        t for t in raw_tokens 
        if t not in STOPWORDS and not t.isdigit() and len(t) > 2
    ]
    
    counts = Counter(filtered_tokens)
    top_items = counts.most_common(20)
    
    top_keywords: List[Dict[str, Any]] = []
    stuffing_warnings: List[Dict[str, Any]] = []
    
    for word, count in top_items:
        density_pct = round((count / total_tokens) * 100, 2)
        is_overused = density_pct > 3.5  # SEO / ATS threshold for stuffing
        item = {
            "keyword": word,
            "count": count,
            "density_pct": density_pct,
            "status": "overused" if is_overused else "optimal",
        }
        top_keywords.append(item)
        if is_overused:
            stuffing_warnings.append({
                "keyword": word,
                "count": count,
                "density_pct": density_pct,
                "warning": f"'{word}' appears {count} times ({density_pct}% density). Consider varying with synonyms."
            })

    # Missing role keywords
    norm_role = target_role.strip().lower()
    expected_keywords = ROLE_KEYWORD_BANKS.get(norm_role, ROLE_KEYWORD_BANKS["software engineer"])
    text_lower = cv_text.lower()
    missing_role_keywords = [kw for kw in expected_keywords if kw not in text_lower]

    recommendations: List[str] = []
    if stuffing_warnings:
        recommendations.append(f"Reduce repetitions of flagged keywords ({', '.join(w['keyword'] for w in stuffing_warnings[:3])}) to prevent ATS spam filters.")
    if missing_role_keywords:
        recommendations.append(f"Consider naturally adding missing key industry terms: {', '.join(missing_role_keywords[:4])}.")
    if not recommendations:
        recommendations.append("Healthy keyword density. Keywords are distributed naturally without stuffing.")

    # Density health score (0-100)
    penalty = len(stuffing_warnings) * 15 + min(30, len(missing_role_keywords) * 5)
    density_score = max(40, 100 - penalty)

    return {
        "total_words": total_tokens,
        "unique_keywords": len(counts),
        "top_keywords": top_keywords,
        "stuffing_warnings": stuffing_warnings,
        "missing_role_keywords": missing_role_keywords,
        "density_score": density_score,
        "recommendations": recommendations,
    }

