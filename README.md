# 🚀 TonyCV: AI-Powered Career Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.12+](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/)
[![React: 19](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688.svg)](https://fastapi.tiangolo.com/)
[![ML: Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn-F7931E.svg)](https://scikit-learn.org/)
[![Frontend: GitHub Pages](https://img.shields.io/badge/Frontend-GitHub%20Pages-222222.svg)](https://prashant-singh-rawat.github.io/ML-Project-CV-Analysis/)
[![Backend: Render](https://img.shields.io/badge/Backend-Render-46E3B7.svg)](https://tonycv-backend.onrender.com)
[![CI/CD](https://github.com/Prashant-Singh-Rawat/ML-Project-CV-Analysis/actions/workflows/ci.yml/badge.svg)](https://github.com/Prashant-Singh-Rawat/ML-Project-CV-Analysis/actions)

**TonyCV** is a production-grade, end-to-end AI career intelligence platform that goes far beyond resume parsing. It combines advanced NLP, semantic ML matching, and an interactive career coaching suite — giving candidates, job seekers, and recruiters a complete 360° talent analysis system.

🌐 **Live App**: [prashant-singh-rawat.github.io/ML-Project-CV-Analysis](https://prashant-singh-rawat.github.io/ML-Project-CV-Analysis/)
🔗 **API Backend**: [tonycv-backend.onrender.com](https://tonycv-backend.onrender.com)

---

## 🆕 What's New — v3.0.0 (Latest)

| Feature | Route | Description |
|:---|:---|:---|
| ✨ AI Resume Rewrite Assistant | `/ai-rewrite` | Transforms generic resume content into ATS-optimized language |
| 📊 ATS Resume Score | `/ats-score` | Comprehensive 0–100 ATS compatibility score with recommendations |
| 🎯 Job Description Matcher | `/jd-match` | Match your CV against any JD with semantic similarity analysis |
| 🗺️ Interactive Career Roadmap | `/career-roadmap` | Personalized step-by-step career growth plan |
| 🐙 GitHub Intelligence | `/portfolio-analyzer` | Deep GitHub developer score, language analysis & activity |
| 🌐 Portfolio Analyzer | `/portfolio-analyzer` | Multi-platform (GitHub, LinkedIn, LeetCode) portfolio review |
| 🎤 AI Interview Simulator | `/interview-simulator` | Technical, HR & behavioral interview practice with scoring |
| 💰 Salary Predictor | `/salary-predict` | AI-estimated salary ranges by role, location & skills |
| 📈 Skill Gap Analysis | `/skill-gap` | Interactive gap dashboard with curated learning resources |
| 🏆 Recruiter Dashboard | `/recruiter` | Multi-candidate ranking, comparison & export tools |
| 🧠 Explainable AI | (integrated) | Human-readable factor explanations for every ML prediction |
| 📊 Analytics Dashboard | (integrated) | Application tracking and score improvement history |

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    TonyCV v3.0.0                            │
├──────────────────────┬──────────────────────────────────────┤
│   FRONTEND (Vite)    │          BACKEND (FastAPI)           │
│   React 19           │  ┌──────────────────────────────┐   │
│   Tailwind CSS       │  │  ML Pipeline                 │   │
│   Framer Motion      │  │  ├─ RandomForestClassifier   │   │
│   React Router v6    │  │  ├─ BERT Semantic Matcher    │   │
│                      │  │  └─ spaCy NLP Parser         │   │
│   8 New Feature Pages│  ├──────────────────────────────┤   │
│   + 7 Existing Pages │  │  Feature Router (/features/) │   │
│                      │  │  ├─ /rewrite                 │   │
│   GitHub Pages Host  │  │  ├─ /ats-score               │   │
│                      │  │  ├─ /jd-match                │   │
│                      │  │  ├─ /roadmap                 │   │
│                      │  │  ├─ /github-stats            │   │
│                      │  │  ├─ /interview/question      │   │
│                      │  │  ├─ /salary-predict          │   │
│                      │  │  └─ /skill-gap-recommendations│   │
│                      │  │  Auth Router (/auth/)         │   │
│                      │  │  Core Router (/analyze, etc.) │   │
│                      │  └──────────────────────────────┘   │
│                      │          Render.com Host            │
└──────────────────────┴──────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|:---|:---|
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion, React Router v6 |
| **Backend** | FastAPI 0.110, Uvicorn, Python 3.12+, Pydantic v2 |
| **ML/Analytics** | Scikit-Learn, Pandas, NumPy, Joblib, RandomForest |
| **NLP** | spaCy (en_core_web_sm), sentence-transformers (BERT), PDFPlumber |
| **Auth** | JWT (python-jose), bcrypt (passlib), SQLite |
| **Frontend Hosting** | GitHub Pages (automated via CI/CD) |
| **Backend Hosting** | Render Web Service |
| **CI/CD** | GitHub Actions (auto-build + deploy on push to main) |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js v18+
- Python 3.11 or 3.12+
- Git

### ⚡ One-Command Setup (Windows)
```powershell
.\start_app.ps1
```

### Manual Installation

**Backend:**
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate        # Windows
# source .venv/bin/activate     # Mac/Linux

pip install -r requirements.txt
uvicorn main:app --reload
# API available at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# App available at http://localhost:5173
```

---

## 📡 API Endpoints

### Core Analysis
| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/analyze` | Full CV analysis (PDF upload) |
| `GET` | `/companies` | List supported companies |
| `GET` | `/metrics` | ML model performance metrics |
| `GET` | `/market-pulse` | Trending skills market data |
| `POST` | `/evaluate-answer` | Interview answer evaluation |

### Auth
| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/auth/register` | User registration |
| `POST` | `/auth/login` | User login (returns JWT) |

### Feature Endpoints (New v3.0.0)
| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/features/rewrite` | AI resume section rewriter |
| `POST` | `/features/ats-score` | ATS compatibility score |
| `POST` | `/features/jd-match` | Job description matcher |
| `POST` | `/features/roadmap` | Career roadmap generator |
| `POST` | `/features/github-stats` | GitHub developer intelligence |
| `POST` | `/features/portfolio-analyze` | Multi-platform portfolio analyzer |
| `POST` | `/features/interview/question` | Interview question generator |
| `POST` | `/features/interview/evaluate` | Answer evaluator with feedback |
| `POST` | `/features/recruiter/compare` | Candidate ranking/comparison |
| `GET` | `/features/resume-builder/templates` | Resume template options |
| `POST` | `/features/salary-predict` | Salary range predictor |
| `GET` | `/features/explain-predictions` | Explainable AI factors |
| `GET` | `/features/skill-gap-recommendations` | Skill gap + learning links |
| `GET` | `/features/user-analytics` | User progress analytics |

> Full interactive API docs: [tonycv-backend.onrender.com/docs](https://tonycv-backend.onrender.com/docs)

---

## ☁️ Production Deployment

| Layer | Platform | URL |
|:---|:---|:---|
| **Frontend** | GitHub Pages | [prashant-singh-rawat.github.io/ML-Project-CV-Analysis](https://prashant-singh-rawat.github.io/ML-Project-CV-Analysis/) |
| **Backend API** | Render (Web Service) | [tonycv-backend.onrender.com](https://tonycv-backend.onrender.com) |

### Deploy Backend to Render
1. Go to [Render Dashboard](https://dashboard.render.com) → **New → Blueprint**
2. Connect your GitHub repository
3. Render auto-detects `render.yaml` and sets up the service
4. Set `JWT_SECRET_KEY` under **Environment** tab
5. Click **Apply** — backend builds and deploys automatically

### Deploy Frontend to GitHub Pages
```bash
cd frontend
npm run build
# GitHub Actions CI/CD automatically deploys dist/ to GitHub Pages on every push to main
```

---

## 📁 Project Structure

```
ML-Project-CV-Analysis/
├── backend/
│   ├── main.py                    # FastAPI app entry point
│   ├── requirements.txt
│   ├── routes/
│   │   ├── __init__.py
│   │   └── features.py            # 14 new feature endpoints (v3.0.0)
│   ├── auth/
│   │   ├── auth_routes.py         # JWT auth endpoints
│   │   ├── auth_utils.py
│   │   └── user_db.py
│   ├── ml_pipeline/
│   │   ├── model_manager.py       # RandomForest trainer + predictor
│   │   ├── semantic_matcher.py    # BERT semantic skill matching
│   │   ├── synthetic_data.py
│   │   └── model.pkl
│   └── utils/
│       └── cv_parser.py           # spaCy PDF parser
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Router + Nav (updated v3.0.0)
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Analyze.jsx
│   │   │   ├── ResumeRewritePage.jsx   # NEW
│   │   │   ├── AtsScorePage.jsx        # NEW
│   │   │   ├── JdMatchPage.jsx         # NEW
│   │   │   ├── CareerRoadmapPage.jsx   # NEW
│   │   │   ├── InterviewSimulatorPage.jsx # NEW
│   │   │   ├── SalaryPredictPage.jsx   # NEW
│   │   │   ├── SkillGapPage.jsx        # NEW
│   │   │   └── PortfolioAnalyzerPage.jsx # NEW
│   │   └── components/
│   │       ├── Dashboard.jsx
│   │       ├── BiometricInterview.jsx
│   │       └── RegisterPopup.jsx
│   └── package.json
├── .github/
│   └── workflows/
│       └── ci.yml                 # CI/CD: build + deploy to GitHub Pages
├── render.yaml                    # Render backend deployment config
└── README.md
```

---

## 🤝 Contributing
We welcome contributions! Check our [GitHub Issues](https://github.com/Prashant-Singh-Rawat/ML-Project-CV-Analysis/issues) tab for requested features and bug reports. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## 📜 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 📈 Changelog

### v3.0.0 — June 2026
- ✨ 14 new AI-powered feature endpoints
- 🎨 8 new premium frontend pages
- 🗺️ Career roadmap generator
- 🎤 AI interview simulator with multi-stage support
- 💰 Salary prediction engine
- 🐙 GitHub developer intelligence scoring
- 📊 ATS compatibility scoring with breakdown
- 🎯 Job description semantic matcher
- 📈 Skill gap analysis + curated learning links
- 🌐 Portfolio analyzer (multi-platform)

### v2.0.0 — May 2026
- BERT semantic skill matching
- JWT authentication system
- Biometric interview simulator
- Resume builder with templates

### v1.0.0 — April 2026
- Initial release: CV analysis + placement prediction
- RandomForest ML pipeline
- spaCy NLP parser

---
*Developed with ❤️ by [Prashant Singh Rawat](https://github.com/Prashant-Singh-Rawat)*
