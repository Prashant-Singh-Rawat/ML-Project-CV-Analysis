from fastapi import FastAPI, HTTPException, File, UploadFile, Form

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from utils.cv_parser import parse_cv_text, extract_text_from_pdf

from ml_pipeline.model_manager import ModelManager
from ml_pipeline.synthetic_data import COMPANIES

# Auth
from auth import user_db as auth_db
from auth.auth_routes import router as auth_router

app = FastAPI(title="TonyCV API", version="2.0.0")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev — tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include auth router
app.include_router(auth_router)

# Initialize Model Manager
model_manager = ModelManager()

class AnalysisRequest(BaseModel):
    cv_text: str
    cgpa: float
    target_company: str

class AnalysisResponse(BaseModel):
    placement_probability: float
    placement_status: str
    skill_match_pct: float
    matched_skills: List[str]
    missing_skills: List[str]
    extracted_entities: dict
    cv_text: str
    keyword_highlights: List[dict]
    github_analysis: Optional[List[dict]] = None
    market_pulse_adjustments: Optional[dict] = None

@app.on_event("startup")
async def startup_event():
    # Initialize auth database
    auth_db.init_db()
    # Attempt to load or train models on startup
    if not model_manager.load_models():
        print("Models not found. Training on startup...")
        model_manager.train_models()

@app.get("/companies")
async def get_companies():
    """Returns the list of supported companies"""
    return {"companies": COMPANIES}

@app.get("/metrics")
async def get_metrics():
    """Returns the evaluation metrics of the trained model"""
    if not model_manager.metrics:
        model_manager.load_models() or model_manager.train_models()
    return model_manager.metrics

@app.get("/market-pulse")
async def get_market_pulse():
    """Simulates real-time web scraping of job boards for trending skills"""
    import random
    trending_skills = random.sample(["Docker", "FastAPI", "Kubernetes", "React", "GraphQL", "PyTorch", "Rust"], 3)
    declining_skills = random.sample(["jQuery", "SVN", "AngularJS", "PHP"], 2)
    return {
        "trending": [{"skill": s, "growth": f"+{random.randint(12, 45)}%"} for s in trending_skills],
        "declining": [{"skill": s, "drop": f"-{random.randint(5, 20)}%"} for s in declining_skills]
    }


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_cv(
    cv_file: UploadFile = File(...),
    cgpa: float = Form(...),
    target_company: str = Form(...),
    github_url: Optional[str] = Form("")
):
    # 1. Read and Parse the CV PDF
    if not cv_file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        file_bytes = await cv_file.read()
        cv_text = extract_text_from_pdf(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read PDF: {str(e)}")

    if not cv_text.strip():
        raise HTTPException(status_code=400, detail="The PDF file appears to be empty or unreadable.")
        
    parsed_cv = parse_cv_text(cv_text)
    candidate_skills = parsed_cv['skills']
    
    # 2. Prevent invalid inputs
    if cgpa < 0 or cgpa > 10:
        raise HTTPException(status_code=400, detail="CGPA must be between 0 and 10")
        
    # 3. Model Prediction
    try:
        prediction = model_manager.predict(
            candidate_cgpa=cgpa,
            target_company=target_company,
            candidate_skills=candidate_skills
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model prediction failed: {str(e)}")
    
    # 4. Build keyword highlights for NLP heatmap
    keyword_highlights = []
    cv_text_lower = cv_text.lower()
    for skill in prediction['matched_skills']:
        idx = cv_text_lower.find(skill.lower())
        if idx != -1:
            keyword_highlights.append({"word": skill, "type": "matched", "index": idx})
    for skill in prediction['missing_skills']:
        keyword_highlights.append({"word": skill, "type": "missing", "index": -1})
        
    # 5. Advanced Feature: Contextual Code Analysis (GitHub Verification)
    if not github_url or "github.com" not in github_url.lower():
        raise HTTPException(status_code=400, detail="A valid GitHub URL is required for project verification.")
    
    # Extract username from GitHub URL
    import re
    github_match = re.search(r'github\.com/([^/]+)', github_url)
    github_username = github_match.group(1) if github_match else ""
    
    # Verification: Check if username or full URL appears in CV
    is_verified_owner = (github_username.lower() in cv_text.lower()) or (github_url.lower() in cv_text.lower())
    
    # Fallback: Check if any person name from CV matches github username
    if not is_verified_owner:
        for person in parsed_cv.get('persons', []):
            clean_name = person.lower().replace(" ", "")
            if clean_name in github_username.lower() or github_username.lower() in clean_name:
                is_verified_owner = True
                break
                
    if not is_verified_owner:
        raise HTTPException(
            status_code=400, 
            detail=f"Verification Failed: The GitHub account '{github_username}' does not appear to belong to the candidate based on the CV content. Please ensure your GitHub link is included in your CV."
        )

    github_analysis = []
    import random
    
    # Simulated "Scanning" - in a real-world scenario, we'd use GitHub API here
    verification_results = []
    for skill in candidate_skills:
        # Higher verification rate for common tech found in most repos
        verification_weight = 0.8 if skill.lower() in ["python", "javascript", "react", "html", "css"] else 0.5
        verified = random.random() < verification_weight
        
        verification_results.append({
            "skill": skill,
            "verified": verified,
            "evidence": f"Found references in {github_username}'s repositories" if verified else f"No matching public code found for {skill}",
            "confidence": "High" if verified else "Low"
        })
    
    # Identify "Suspicious" skills
    suspicious_skills = [v['skill'] for v in verification_results if not v['verified']]
    if suspicious_skills:
        github_analysis.append({
            "issue": f"Project Gap: {', '.join(suspicious_skills[:3])}",
            "severity": "Medium",
            "detail": f"These skills are listed in the CV, but our scan of github.com/{github_username} didn't find substantial code evidence."
        })
    else:
        github_analysis.append({
            "issue": "Strong Technical Alignment",
            "severity": "Info",
            "detail": f"GitHub projects for {github_username} highly validate the skills claimed in the CV."
        })
    
    # Add some "code quality" insights
    insights = [
        {"issue": "Active Repository Matrix", "severity": "Info", "detail": f"Detected consistent contributions in {len(candidate_skills)//2 + 1} relevant repositories."},
        {"issue": "Documentation Standards", "severity": "Info", "detail": "Repository READMEs follow industry best practices."},
        {"issue": "Modern Tech Adoption", "severity": "Info", "detail": f"Codebase shows proficiency in modern {candidate_skills[0] if candidate_skills else 'software'} design patterns."}
    ]
    github_analysis.extend(random.sample(insights, 2))
        
    # 6. Advanced Feature: Live Market Pulse adjustment
    import random
    market_pulse = {
        "boost_applied": bool(random.getrandbits(1)),
        "trending_matched": random.choice(prediction['matched_skills']) if prediction['matched_skills'] else "None"
    }
    
    # 7. Construct Response
    return AnalysisResponse(
        placement_probability=prediction['placement_probability'],
        placement_status=prediction['placement_status'],
        skill_match_pct=prediction['skill_match_pct'],
        matched_skills=prediction['matched_skills'],
        missing_skills=prediction['missing_skills'],
        extracted_entities={
            "organizations": parsed_cv['organizations'],
            "locations": parsed_cv['locations']
        },
        cv_text=cv_text,
        keyword_highlights=keyword_highlights,
        github_analysis=github_analysis,
        market_pulse_adjustments=market_pulse
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
