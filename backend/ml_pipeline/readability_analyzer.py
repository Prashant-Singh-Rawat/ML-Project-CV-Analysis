"""
Resume Readability Analyzer (Issue #64)
Calculates Flesch Reading Ease, Flesch-Kincaid Grade Level, Gunning Fog index,
sentence complexity highlights, and actionable simplification recommendations.
"""

import re
from typing import Dict, Any, List


def count_syllables(word: str) -> int:
    w = word.lower().strip()
    if len(w) <= 3:
        return 1
    w = re.sub(r"(?:[^laeiouy]|ed|es|e)$", "", w)
    w = re.sub(r"^y", "", w)
    matches = re.findall(r"[aeiouy]{1,2}", w)
    return max(1, len(matches))


def analyze_readability(cv_text: str) -> Dict[str, Any]:
    lines = [line.strip() for line in cv_text.splitlines() if line.strip()]
    if not lines:
        return {
            "flesch_reading_ease": 0,
            "flesch_kincaid_grade": 0,
            "gunning_fog": 0,
            "total_words": 0,
            "total_sentences": 0,
            "avg_sentence_length": 0,
            "complex_words_pct": 0,
            "readability_level": "Unknown",
            "complex_sentences": [],
            "bullet_consistency": "Unknown",
            "recommendations": ["No text detected."],
        }

    # Extract sentences
    # Split by standard punctuation and newlines
    raw_sentences = re.split(r"(?<=[.!?])\s+|\n+", cv_text)
    sentences = [s.strip() for s in raw_sentences if len(s.strip().split()) >= 3]
    total_sentences = max(1, len(sentences))

    # Extract words
    words = re.findall(r"\b[A-Za-z0-9+#.-]+\b", cv_text)
    total_words = max(1, len(words))

    # Syllable metrics
    syllables = [count_syllables(w) for w in words]
    total_syllables = sum(syllables)
    complex_words = sum(1 for syl in syllables if syl >= 3)

    words_per_sentence = total_words / total_sentences
    syllables_per_word = total_syllables / total_words
    complex_pct = round((complex_words / total_words) * 100, 1)

    # 1. Flesch Reading Ease: 0-100 (Higher = easier)
    flesch = 206.835 - (1.015 * words_per_sentence) - (84.6 * syllables_per_word)
    flesch_score = round(max(10, min(100, flesch)), 1)

    # 2. Flesch-Kincaid Grade Level (Ideal for resume: 8 - 12)
    fk_grade = (0.39 * words_per_sentence) + (11.8 * syllables_per_word) - 15.59
    fk_grade = round(max(1, min(20, fk_grade)), 1)

    # 3. Gunning Fog Index
    gunning_fog = round(0.4 * (words_per_sentence + complex_pct), 1)

    # Classification
    if flesch_score >= 65:
        level = "Easy to Scan (Optimal for Recruiters)"
        level_tone = "excellent"
    elif flesch_score >= 45:
        level = "Standard Professional Readability"
        level_tone = "good"
    else:
        level = "Dense / Difficult to Scan"
        level_tone = "needs_work"

    # Identify long / complex sentences (>25 words)
    complex_sentences: List[Dict[str, Any]] = []
    for s in sentences:
        s_words = s.split()
        if len(s_words) > 24:
            complex_sentences.append({
                "sentence": s[:180] + ("..." if len(s) > 180 else ""),
                "word_count": len(s_words),
                "suggestion": "Split into 2 concise bullet points with action verbs and metrics."
            })

    # Bullet point consistency
    bullet_lines = [l for l in lines if l.startswith(("-", "•", "*", "–", "→"))]
    if len(bullet_lines) >= 4:
        bullet_status = "Consistent bullet formatting detected"
    else:
        bullet_status = "Few or no bullet points; consider bullet formatting for readability"

    # Actionable recommendations
    recommendations: List[str] = []
    if complex_sentences:
        recommendations.append(f"Shorten {len(complex_sentences)} long sentence(s) (over 24 words). Recruiters scan each line in ~6 seconds.")
    if complex_pct > 25:
        recommendations.append("High ratio of complex words. Replace jargon with clear, direct terminology where possible.")
    if flesch_score < 50:
        recommendations.append("Aim for shorter sentences (12-18 words per bullet) to improve ATS and human scan speed.")
    if not recommendations:
        recommendations.append("Excellent readability. Concise sentences and clear structure allow quick recruiter comprehension.")

    return {
        "flesch_reading_ease": flesch_score,
        "flesch_kincaid_grade": fk_grade,
        "gunning_fog": gunning_fog,
        "total_words": total_words,
        "total_sentences": total_sentences,
        "avg_sentence_length": round(words_per_sentence, 1),
        "complex_words_pct": complex_pct,
        "readability_level": level,
        "readability_tone": level_tone,
        "complex_sentences": complex_sentences[:5],
        "bullet_consistency": bullet_status,
        "recommendations": recommendations,
    }

