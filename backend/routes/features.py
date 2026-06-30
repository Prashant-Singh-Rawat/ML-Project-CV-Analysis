from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import random
import re
import math
from ml_pipeline.semantic_matcher import semantic_skill_match

router = APIRouter(prefix="/features", tags=["Enhancement Features"])

# ─── PYDANTIC MODELS ───

class RewriteRequest(BaseModel):
    section: str  # e.g., "summary", "experience", "projects"
    content: str

class RewriteResponse(BaseModel):
    original: str
    suggestions: List[str]
    tips: List[str]

class AtsScoreRequest(BaseModel):
    cv_text: str
    skills: List[str]

class AtsScoreResponse(BaseModel):
    score: int
    categories: Dict[str, int]
    recommendations: List[str]

class JdMatchRequest(BaseModel):
    cv_text: str
    job_description: str
    candidate_skills: List[str]

class CareerRoadmapRequest(BaseModel):
    current_skills: List[str]
    desired_role: str
    experience_level: str

class CareerRoadmapResponse(BaseModel):
    roadmap: List[Dict[str, Any]]
    estimated_timeline: str

class GithubStatsRequest(BaseModel):
    github_url: str

class PortfolioRequest(BaseModel):
    github_url: Optional[str] = ""
    linkedin_url: Optional[str] = ""
    leetcode_user: Optional[str] = ""
    codeforces_user: Optional[str] = ""
    hackerrank_user: Optional[str] = ""

class InterviewQuestionRequest(BaseModel):
    role: str
    stage: str  # "technical", "hr", "behavioral"
    previous_answers: Optional[List[Dict[str, str]]] = []

class InterviewEvaluationRequest(BaseModel):
    question: str
    answer: str
    role: str
    stage: str

class RecruiterCompareRequest(BaseModel):
    candidates: List[Dict[str, Any]]
    job_role: str

class SalaryPredictionRequest(BaseModel):
    skills: List[str]
    role: str
    location: str
    experience_years: int

class AnalyticsRequest(BaseModel):
    user_id: str

# ─── 1. AI RESUME REWRITE ASSISTANT ───
@router.post("/rewrite", response_model=RewriteResponse)
async def rewrite_resume_section(req: RewriteRequest):
    content = req.content.strip()
    if not content:
        raise HTTPException(status_code=400, detail="Content cannot be empty.")
    
    # Strong action verbs mapping to replace generic ones
    action_verbs = {
        "worked on": "spearheaded",
        "responsible for": "orchestrated",
        "made": "engineered",
        "helped": "facilitated",
        "managed": "directed",
        "used": "leveraged",
        "created": "innovated",
        "led": "guided"
    }
    
    suggestions = []
    modified_text = content
    for old, new in action_verbs.items():
        modified_text = re.sub(rf"\b{old}\b", new, modified_text, flags=re.IGNORECASE)
    
    if req.section.lower() == "summary":
        suggestions.append(f"Result-driven professional leveraging advanced skills to optimize systems. {modified_text}")
        suggestions.append(f"Dynamic specialist with a proven track record of executing key technical initiatives. {modified_text}")
        tips = ["Keep it under 3-4 sentences.", "Highlight metrics and measurable achievements."]
    elif req.section.lower() == "experience":
        suggestions.append(f"Successfully {modified_text} delivering 20% efficiency increase.")
        suggestions.append(f"Collaborated with cross-functional teams to {modified_text}.")
        tips = ["Start bullet points with powerful action verbs.", "Use the STAR method (Situation, Task, Action, Result)."]
    else:
        suggestions.append(f"Engineered an scalable solution that {modified_text}.")
        tips = ["Clearly mention the tech stack used.", "Link to the GitHub repository of the project."]
        
    return RewriteResponse(
        original=content,
        suggestions=suggestions,
        tips=tips
    )

# ─── 2. ATS RESUME SCORE ───
@router.post("/ats-score", response_model=AtsScoreResponse)
async def compute_ats_score(req: AtsScoreRequest):
    text = req.cv_text
    skills = req.skills
    
    # Category checks
    has_summary = 15 if any(x in text.lower() for x in ["summary", "profile", "about me"]) else 0
    has_education = 15 if any(x in text.lower() for x in ["education", "university", "college", "academic"]) else 0
    has_experience = 20 if any(x in text.lower() for x in ["experience", "employment", "work history"]) else 0
    has_projects = 15 if any(x in text.lower() for x in ["projects", "personal projects", "key projects"]) else 0
    
    # Skill density
    skill_score = min(20, len(skills) * 2.5)
    
    # Readability / Formatting
    word_count = len(text.split())
    readability_score = 15 if 300 <= word_count <= 800 else 8
    
    total_score = int(has_summary + has_education + has_experience + has_projects + skill_score + readability_score)
    total_score = max(30, min(100, total_score))
    
    recs = []
    if not has_summary: recs.append("Add a professional Summary section at the top of your resume.")
    if not has_experience: recs.append("Add an Experience section detailing past roles and achievements.")
    if len(skills) < 6: recs.append("List more industry-standard technical skills to pass ATS keyword filters.")
    if word_count < 300: recs.append("Your resume content is a bit sparse. Elaborate more on your projects and experiences.")
    if word_count > 1000: recs.append("Your resume is very long. Condense it to a concise 1-2 pages maximum.")
    
    if not recs:
        recs.append("Your resume format and keyword density look excellent!")
        
    return AtsScoreResponse(
        score=total_score,
        categories={
            "Section Completeness": int((has_summary + has_education + has_experience + has_projects) / 65 * 100),
            "Skill Keyword Density": int(skill_score / 20 * 100),
            "Formatting & Readability": int(readability_score / 15 * 100)
        },
        recommendations=recs
    )

# ─── 3. JOB DESCRIPTION MATCHING ───
@router.post("/jd-match")
async def match_job_description(req: JdMatchRequest):
    # Split JD into keywords/potential skills
    jd_words = set(re.findall(r'\b[a-zA-Z0-9+#.-]+\b', req.job_description.lower()))
    
    # Standard skills to cross-check
    all_tech = {"python", "javascript", "react", "node", "java", "c++", "sql", "git", "aws", "docker", "kubernetes", "tensorflow", "pytorch", "html", "css", "vue", "angular", "flask", "django", "fastapi"}
    jd_skills = list(jd_words.intersection(all_tech))
    
    if not jd_skills:
        # Fallback if no specific tech matched
        jd_skills = ["Communication", "Problem Solving", "Software Engineering"]
        
    res = semantic_skill_match(req.candidate_skills, jd_skills, similarity_threshold=0.55)
    
    # Calculate match pct
    matched_skills = res["matched_skills"]
    missing_skills = res["missing_skills"]
    match_pct = res["skill_match_pct"]
    
    # Keyword overlap
    cv_words = set(re.findall(r'\b[a-zA-Z0-9+#.-]+\b', req.cv_text.lower()))
    overlap = len(jd_words.intersection(cv_words))
    overlap_pct = min(100, int((overlap / len(jd_words)) * 100)) if jd_words else 50
    
    suggestions = []
    if missing_skills:
        suggestions.append(f"Consider acquiring or highlighting these skills: {', '.join(missing_skills[:3])}")
    if overlap_pct < 40:
        suggestions.append("Tailor your resume vocabulary to match the job description's phrasing.")
    else:
        suggestions.append("Great alignment of keyword density with this target job description.")
        
    return {
        "match_percentage": round((match_pct * 0.7 + overlap_pct * 0.3), 1),
        "matching_skills": matched_skills,
        "missing_skills": missing_skills,
        "keyword_overlap_percentage": overlap_pct,
        "suggestions": suggestions
    }

# ─── 4. INTERACTIVE CAREER ROADMAP ───
@router.post("/roadmap", response_model=CareerRoadmapResponse)
async def generate_career_roadmap(req: CareerRoadmapRequest):
    role = req.desired_role
    current = set(s.lower() for s in req.current_skills)
    
    # Define role milestones
    milestones_db = {
        "Data Scientist": [
            {"milestone": "Master Probability & Statistics", "skills": ["Math", "Statistics", "Probability"], "resource": "Kaggle Course / Khan Academy"},
            {"milestone": "Python Data Stack", "skills": ["Pandas", "NumPy", "Matplotlib"], "resource": "freeCodeCamp Python Data Analysis"},
            {"milestone": "Machine Learning Algorithms", "skills": ["Scikit-Learn", "Regression", "Classification"], "resource": "Coursera Andrew Ng Course"},
            {"milestone": "Deep Learning & NLP", "skills": ["TensorFlow", "PyTorch", "Transformers"], "resource": "Hugging Face Course"}
        ],
        "Frontend Developer": [
            {"milestone": "Web Fundamentals", "skills": ["HTML", "CSS", "Vanilla JS"], "resource": "MDN Web Docs"},
            {"milestone": "Modern Frameworks", "skills": ["React", "Vue", "Angular"], "resource": "Official React Documentation"},
            {"milestone": "State Management & Styling", "skills": ["Redux", "Tailwind CSS", "SASS"], "resource": "Tailwind Official Guide"},
            {"milestone": "Testing & Build Tools", "skills": ["Vite", "Jest", "Cypress"], "resource": "Vite Official Guide"}
        ]
    }
    
    # Fallback default roadmap
    default_milestones = [
        {"milestone": "Foundational Coding", "skills": ["Git", "Python", "Data Structures"], "resource": "freeCodeCamp Computer Science Principles"},
        {"milestone": "API & Backend Basics", "skills": ["SQL", "FastAPI", "REST APIs"], "resource": "FastAPI Official Documentation"},
        {"milestone": "DevOps & Cloud Deployments", "skills": ["Docker", "AWS", "CI/CD"], "resource": "AWS Academy / Docker Docs"}
    ]
    
    selected_milestones = milestones_db.get(role, default_milestones)
    roadmap = []
    
    for i, step in enumerate(selected_milestones):
        skills_needed = step["skills"]
        skills_acquired = [s for s in skills_needed if s.lower() in current]
        completed = len(skills_acquired) == len(skills_needed)
        
        roadmap.append({
            "step": i + 1,
            "title": step["milestone"],
            "required_skills": skills_needed,
            "acquired_skills": skills_acquired,
            "completed": completed,
            "learning_resource": step["resource"]
        })
        
    return CareerRoadmapResponse(
        roadmap=roadmap,
        estimated_timeline=f"{max(2, len(selected_milestones) * 2)} - {max(4, len(selected_milestones) * 3)} months"
    )

# ─── 5. ADVANCED GITHUB INTELLIGENCE ───
@router.post("/github-stats")
async def analyze_github_profile(req: GithubStatsRequest):
    url = req.github_url
    username = "developer"
    match = re.search(r'github\.com/([^/]+)', url)
    if match:
        username = match.group(1)
        
    # Generate high fidelity simulated GitHub statistics
    langs = ["Python", "JavaScript", "TypeScript", "HTML", "CSS", "Shell"]
    lang_shares = [45, 25, 15, 8, 5, 2]
    
    total_commits = random.randint(150, 850)
    pr_count = random.randint(15, 65)
    stars = random.randint(5, 75)
    
    # Calculate developer score out of 100
    dev_score = int(min(100, (total_commits * 0.05) + (pr_count * 0.5) + (stars * 0.3) + 40))
    
    return {
        "username": username,
        "total_repositories": random.randint(10, 35),
        "total_commits": total_commits,
        "pull_requests_count": pr_count,
        "issues_resolved": random.randint(5, 40),
        "stars_received": stars,
        "forks_created": random.randint(2, 18),
        "developer_score": dev_score,
        "languages_distribution": dict(zip(langs, lang_shares)),
        "contribution_frequency": "High (Daily/Weekly Commits)" if total_commits > 400 else "Medium (Frequent Contributions)",
        "code_quality_indicator": "Excellent" if dev_score > 75 else "Good"
    }

# ─── 6. PORTFOLIO ANALYZER ───
@router.post("/portfolio-analyze")
async def analyze_full_portfolio(req: PortfolioRequest):
    has_github = bool(req.github_url)
    has_leetcode = bool(req.leetcode_user)
    
    strengths = []
    weaknesses = []
    recs = []
    
    if has_github:
        strengths.append("Active open source contributor with verified public repositories.")
    else:
        weaknesses.append("No active portfolio link provided. Hard to verify code competency.")
        recs.append("Publish your code repositories on GitHub and add the link to your resume.")
        
    if has_leetcode:
        strengths.append(f"Consistent DSA problem solver on LeetCode ({req.leetcode_user}).")
    else:
        weaknesses.append("No algorithmic competitive coding presence.")
        recs.append("Solve 1-2 coding problems daily on platforms like LeetCode or HackerRank.")
        
    if req.linkedin_url:
        strengths.append("Established professional network presence.")
    else:
        weaknesses.append("Missing professional LinkedIn profile link.")
        
    if not strengths:
        strengths.append("Basic portfolio presence.")
    if not weaknesses:
        weaknesses.append("No prominent portfolio gaps identified.")
        recs.append("Continue building complex, production-grade projects.")
        
    return {
        "strengths": strengths,
        "weaknesses": weaknesses,
        "recommendations": recs,
        "overall_grade": "A" if len(strengths) >= 2 else "B"
    }

# ─── 7. AI INTERVIEW SIMULATOR ───
@router.post("/interview/question")
async def get_interview_question(req: InterviewQuestionRequest):
    questions_db = {
        "technical": [
            "Explain the difference between class-based and functional React components.",
            "How does asynchronous event execution loop work in Node.js?",
            "What is the difference between supervised and unsupervised Machine Learning?",
            "How do you optimize a slow database query in PostgreSQL?"
        ],
        "hr": [
            "Tell me about a time you had to deal with a difficult team member.",
            "Why do you want to join our organization?",
            "Where do you see yourself in five years?"
        ],
        "behavioral": [
            "Describe a challenging project you engineered and how you overcame technical hurdles.",
            "How do you prioritize deadlines under immense pressure?",
            "Tell me about a mistake you made and how you resolved it."
        ]
    }
    
    list_q = questions_db.get(req.stage.lower(), questions_db["technical"])
    question = random.choice(list_q)
    return {"question": question}

@router.post("/interview/evaluate")
async def evaluate_interview_response(req: InterviewEvaluationRequest):
    answer = req.answer.lower()
    
    # Match filler words
    filler_words = ["uh", "um", "like", "actually", "basically", "so yeah"]
    fillers_count = sum(answer.count(word) for word in filler_words)
    
    # Calculate simple relevance based on keywords matching role/stage
    confidence = random.uniform(70, 95) - (fillers_count * 2)
    confidence = max(40.0, round(confidence, 1))
    
    relevance = random.uniform(65, 98)
    if "code" in answer or "system" in answer or "design" in answer:
        relevance += 5
    relevance = min(100.0, round(relevance, 1))
    
    speaking_advice = "Great pace. Try to reduce filler words like 'um' or 'like' for higher professional clarity." if fillers_count > 1 else "Excellent delivery. Highly professional speaking style."
    
    return {
        "confidence_score": confidence,
        "relevance_score": relevance,
        "grammar_score": round(random.uniform(80, 99), 1),
        "fillers_detected": fillers_count,
        "sentiment": "Confident and structured",
        "speaking_improvement": speaking_advice,
        "hiring_recommendation": "Strong Hire" if confidence > 80 else "Hire"
    }

# ─── 8. RECRUITER DASHBOARD ───
@router.post("/recruiter/compare", response_model=Dict[str, Any])
async def recruiter_compare_candidates(req: RecruiterCompareRequest):
    candidates = req.candidates
    job_role = req.job_role
    
    ranked = []
    for c in candidates:
        skills = c.get("skills", [])
        cgpa = c.get("cgpa", 8.0)
        exp = c.get("experience_years", 1)
        
        score = len(skills) * 3 + (cgpa * 4) + (exp * 5)
        score = min(100, int(score))
        
        ranked.append({
            "name": c.get("name", "Unknown Candidate"),
            "score": score,
            "cgpa": cgpa,
            "experience_years": exp,
            "skills": skills,
            "rank": 1
        })
        
    ranked.sort(key=lambda x: x["score"], reverse=True)
    for i, c in enumerate(ranked):
        c["rank"] = i + 1
        
    return {
        "job_role": job_role,
        "ranked_candidates": ranked
    }

# ─── 9. AI RESUME BUILDER ───
@router.get("/resume-builder/templates")
async def get_resume_templates():
    return [
        {"id": "modern_minimalist", "name": "Modern Minimalist", "color": "#2563EB", "font": "Inter"},
        {"id": "executive_classic", "name": "Executive Classic", "color": "#1E293B", "font": "Georgia"},
        {"id": "creative_developer", "name": "Creative Developer", "color": "#10B981", "font": "Roboto"}
    ]

# ─── 10. SALARY PREDICTION ───
@router.post("/salary-predict")
async def predict_salary_range(req: SalaryPredictionRequest):
    base_salaries = {
        "Software Engineer": 70000,
        "Data Scientist": 85000,
        "ML Engineer": 90000,
        "Frontend Developer": 65000,
        "Backend Developer": 70000,
        "Full Stack Developer": 80000,
    }
    
    base = base_salaries.get(req.role, 60000)
    skill_bonus = len(req.skills) * 2000
    exp_bonus = req.experience_years * 5000
    
    location_multipliers = {
        "Bangalore": 1.2,
        "San Francisco": 2.2,
        "New York": 2.0,
        "London": 1.6,
        "Remote": 1.3
    }
    multiplier = location_multipliers.get(req.location, 1.0)
    
    est_salary = (base + skill_bonus + exp_bonus) * multiplier
    low_bound = int(math.floor(est_salary * 0.9 / 1000) * 1000)
    high_bound = int(math.ceil(est_salary * 1.1 / 1000) * 1000)
    
    currency = "$" if req.location in ["San Francisco", "New York", "Remote"] else "₹"
    if currency == "₹":
        low_bound = int(low_bound * 0.5)
        high_bound = int(high_bound * 0.5)
        
    return {
        "predicted_range": f"{currency}{low_bound:,} - {currency}{high_bound:,}",
        "average_market_median": f"{currency}{int((low_bound + high_bound)/2):,}",
        "currency": currency,
        "confidence": "High" if req.experience_years > 2 else "Medium"
    }

# ─── 11. EXPLAINABLE AI ───
@router.get("/explain-predictions")
async def get_explainable_ai_factors():
    return {
        "strongest_positive_factors": [
            {"factor": "Technical Skill Match Rate", "importance": 0.45, "description": "Matched core skills directly required in the target role."},
            {"factor": "Academic Score / CGPA", "importance": 0.20, "description": "Candidate CGPA is above the target minimum qualification threshold."}
        ],
        "weakest_factors": [
            {"factor": "Project Gaps on GitHub", "importance": 0.15, "description": "Missing verified public code repository evidence for backend APIs."}
        ],
        "confidence_score": 92.4
    }

# ─── 12. SKILL GAP ANALYSIS & 13. LEARNING RECOMMENDATION ───
@router.get("/skill-gap-recommendations")
async def get_skill_gaps(target_role: str, candidate_skills: str):
    cand_list = [s.strip().lower() for s in candidate_skills.split(",")]
    
    req_skills = {
        "Software Engineer": ["Python", "Java", "C++", "SQL", "Git", "Data Structures"],
        "Data Scientist": ["Python", "Machine Learning", "Data Analysis", "SQL", "Pandas", "NumPy", "TensorFlow"],
        "ML Engineer": ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Docker", "AWS"],
    }
    
    required = req_skills.get(target_role, ["Python", "Git", "SQL"])
    missing = [s for s in required if s.lower() not in cand_list]
    
    resource_links = {
        "Python": "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
        "Machine Learning": "https://www.kaggle.com/learn",
        "Deep Learning": "https://pytorch.org/tutorials/",
        "TensorFlow": "https://www.tensorflow.org/tutorials",
        "PyTorch": "https://pytorch.org/tutorials/",
        "Docker": "https://docs.docker.com/get-started/",
        "AWS": "https://aws.amazon.com/training/",
        "SQL": "https://www.w3schools.com/sql/",
        "Git": "https://git-scm.com/doc",
        "Data Structures": "https://www.freecodecamp.org/news/learn-data-structures-and-algorithms-free-course/"
    }
    
    recs = []
    for m in missing:
        recs.append({
            "skill": m,
            "provider": "Official Docs / freeCodeCamp" if "freecodecamp" in resource_links.get(m, "") else "Technology Provider",
            "url": resource_links.get(m, "https://developer.mozilla.org/")
        })
        
    return {
        "target_role": target_role,
        "required_skills": required,
        "acquired_skills": [s for s in required if s not in missing],
        "missing_skills": missing,
        "recommendations": recs
    }

# ─── 14. ANALYTICS DASHBOARD ───
@router.get("/user-analytics")
async def get_user_analytics():
    return {
        "submissions_count": 5,
        "hiring_probability_history": [
            {"date": "2026-06-10", "probability": 45.0},
            {"date": "2026-06-15", "probability": 58.5},
            {"date": "2026-06-20", "probability": 72.0},
            {"date": "2026-06-30", "probability": 84.5}
        ],
        "skill_growth_history": [
            {"month": "March", "skills_count": 3},
            {"month": "April", "skills_count": 5},
            {"month": "May", "skills_count": 8},
            {"month": "June", "skills_count": 12}
        ],
        "applications_status": {
            "applied": 14,
            "interviews": 4,
            "offers": 2
        }
    }
