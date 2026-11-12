"""
Resume Layout Quality Analyzer (Issue #65)
Evaluates visual layout metrics: line density, section spacing, margins, indentation consistency,
and formatting balance.
"""

from typing import Dict, Any, List
import re

def analyze_layout_quality(cv_text: str) -> Dict[str, Any]:
    lines = cv_text.splitlines()
    non_empty_lines = [line for line in lines if line.strip()]
    empty_lines = [line for line in lines if not line.strip()]
    
    total_lines = len(lines) if lines else 1
    total_non_empty = len(non_empty_lines) if non_empty_lines else 1
    
    # 1. Whitespace & Vertical Spacing Analysis
    whitespace_ratio = len(empty_lines) / total_lines
    # Ideal whitespace ratio for readable resume is between 15% and 35%
    if 0.15 <= whitespace_ratio <= 0.35:
        whitespace_score = 100
        whitespace_feedback = "Optimal vertical breathing room and section separation."
    elif whitespace_ratio < 0.15:
        whitespace_score = max(50, int(100 - (0.15 - whitespace_ratio) * 300))
        whitespace_feedback = "Layout is dense; consider adding blank lines between major sections."
    else:
        whitespace_score = max(60, int(100 - (whitespace_ratio - 0.35) * 200))
        whitespace_feedback = "Excessive vertical blank space; tighten section gaps."
        
    # 2. Line Length and Margin Check
    line_lengths = [len(line.strip()) for line in non_empty_lines]
    avg_line_length = sum(line_lengths) / total_non_empty
    max_line_length = max(line_lengths) if line_lengths else 0
    
    # Lines over 120 chars might overflow margins or cause eye fatigue
    overflow_lines = sum(1 for l in line_lengths if l > 120)
    if overflow_lines == 0:
        margin_score = 95
        margin_feedback = "Line lengths fit standard page margins with zero margin overflow."
    else:
        margin_score = max(50, 95 - overflow_lines * 5)
        margin_feedback = f"{overflow_lines} lines exceed 120 characters and may wrap awkwardly."
        
    # 3. Bullet Point & Indentation Consistency
    bullet_chars = ("•", "-", "*", "–", "▪", "▫", ">")
    bullet_lines = [line for line in non_empty_lines if line.strip().startswith(bullet_chars)]
    bullet_ratio = len(bullet_lines) / total_non_empty
    
    if bullet_ratio >= 0.25:
        bullet_score = 95
        bullet_feedback = f"Effective bulleted structure ({len(bullet_lines)} bullet items detected)."
    elif bullet_ratio > 0:
        bullet_score = 75
        bullet_feedback = "Some bullet points present; consider breaking paragraphs into bullets."
    else:
        bullet_score = 55
        bullet_feedback = "No bullet markers detected; use bullets for experience and accomplishments."

    # 4. Section Demarcation Check
    standard_headers = ["summary", "experience", "education", "skills", "projects", "certifications"]
    header_count = sum(1 for h in standard_headers if any(h in line.lower() for line in non_empty_lines))
    if header_count >= 4:
        section_score = 95
        section_feedback = f"Clear section headers identified ({header_count}/6 standard sections)."
    else:
        section_score = max(50, header_count * 20)
        section_feedback = "Section demarcation is subtle; use distinct, capitalized section headers."

    # Composite Layout Score
    composite_layout_score = int(
        whitespace_score * 0.30 +
        margin_score * 0.25 +
        bullet_score * 0.25 +
        section_score * 0.20
    )

    improvements: List[str] = []
    if whitespace_score < 80:
        improvements.append(whitespace_feedback)
    if margin_score < 80:
        improvements.append(margin_feedback)
    if bullet_score < 80:
        improvements.append(bullet_feedback)
    if section_score < 80:
        improvements.append(section_feedback)
    if not improvements:
        improvements.append("Layout formatting is well-balanced and recruiter-ready.")

    return {
        "layout_score": composite_layout_score,
        "metrics": {
            "whitespace_ratio_pct": round(whitespace_ratio * 100, 1),
            "avg_line_length": round(avg_line_length, 1),
            "bullet_items_count": len(bullet_lines),
            "detected_sections_count": header_count
        },
        "category_scores": {
            "whitespace_balance": whitespace_score,
            "margin_alignment": margin_score,
            "bullet_structure": bullet_score,
            "section_demarcation": section_score
        },
        "improvements": improvements
    }
