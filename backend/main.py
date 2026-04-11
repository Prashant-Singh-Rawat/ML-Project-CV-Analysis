from fastapi import FastAPI, HTTPException, File, UploadFile, Form

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from utils.cv_parser import parse_cv_text, extract_text_from_pdf

from ml_pipeline.model_manager import ModelManager
from ml_pipeline.synthetic_data import COMPANIES

app = FastAPI(title="CV Analyzer API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev purposes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        
    # 5. Advanced Feature: Contextual Code Analysis (Mock GitHub Scan)
    github_analysis = []
    if github_url and "github.com" in github_url:
        import random
        vulnerabilities = [
            {"issue": "Hardcoded API Key detected in config.py", "severity": "High"},
            {"issue": "Unoptimized O(n^2) nested loop in DataProcessor", "severity": "Medium"},
            {"issue": "Missing error handling in async fetch promise", "severity": "Low"}
        ]
        github_analysis = random.sample(vulnerabilities, random.randint(1, 3))
        
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
