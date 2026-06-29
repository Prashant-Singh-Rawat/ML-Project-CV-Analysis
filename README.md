# 🚀 TonyCV: AI-Powered Recruitment Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.12+](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/)
[![React: 19](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![ML: Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn-F7931E.svg)](https://scikit-learn.org/)
[![Frontend: GitHub Pages](https://img.shields.io/badge/Frontend-GitHub%20Pages-222222.svg)](https://prashant-singh-rawat.github.io/ML-Project-CV-Analysis/)
[![Backend: Render](https://img.shields.io/badge/Backend-Render-46E3B7.svg)](https://tonycv-backend.onrender.com)

**TonyCV** is a state-of-the-art, end-to-end recruitment intelligence platform designed to bridge the gap between candidates and recruiters using advanced Natural Language Processing (NLP) and Machine Learning (ML). It transforms static resumes into dynamic, data-driven career roadmaps while providing recruiters with verified, high-confidence candidate scores.

🌐 **Live App**: [prashant-singh-rawat.github.io/ML-Project-CV-Analysis](https://prashant-singh-rawat.github.io/ML-Project-CV-Analysis/)

---

## 🏛️ System Architecture

TonyCV utilizes a decoupled micro-architecture designed for scalability and high-performance analysis:

- **Frontend Application**: A React 19 (Vite) single-page application hosted on **GitHub Pages**, utilizing atomic design principles, glassmorphic UI, and real-time state persistence.
- **Mobile Application**: A native Android build wrapped using Capacitor for mobile recruitment experiences.
- **NLP & ML Engine**: A FastAPI (Python) backend deployed on **Render**, serving as the core computational layer, handling vector extraction and predictive inference.
- **Data Persistence**: LocalStorage and session-based state management for ultra-fast, offline-capable performance.

---
## 📋 Table of Contents

- [📖 Project Overview](#-project-overview)
- [🏗️ System Architecture](#️-system-architecture)
- [🧬 Core Technical Innovation](#-core-technical-innovation-patent-ready-concepts)
- [✨ Key Modules](#-key-modules)
- [🛠️ Technology Stack](#️-technology-stack)
- [🚀 Local Development Setup](#-local-development-setup)
- [☁️ Production Deployment](#️-production-deployment)
- [📈 Future Roadmap](#-future-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📞 Contact](#-contact)

## 🧬 Core Technical Innovation (Patent-Ready Concepts)

### 1. Multi-Vector NLP Parsing Engine
Unlike standard ATS systems, TonyCV employs a multi-tiered parsing strategy:
- **Heuristic Tokenization**: Custom rules to normalize erratic resume formatting.
- **Entity Recognition (NER)**: Powered by `spaCy`, extracting `ORG` (Organizations), `PERSON` (Identity), and `GPE` (Geographic markers) to build a candidate identity graph.
- **Taxonomy Matching**: A propriety skills database cross-referenced against raw text to identify not just keywords, but contextual proficiencies.

### 2. Random Forest Predictive Scoring
The system utilizes an ensemble learning approach via `RandomForestClassifier` (100 Decision Trees) to predict placement probability.
- **Feature Convergence**: CGPA metrics, normalized Skill Match percentages, and company-specific "cultural fit" weights are converged into a unified feature vector.
- **Aesthetic Probability Calibration**: Raw ML probabilities are passed through a regression filter to provide human-readable score gradients (High/Medium/Low Chance).

### 3. Automated Identity & Authority Verification
A unique security layer that cross-references CV claims with external digital footprints:
- **GitHub Metadata Audit**: Scans provided repository URLs to check for username match, code ownership evidence, and technical alignment.
- **Blockchain Credentialing (Simulated)**: Generates immutable hashes of analysis reports to prevent credential tampering.

---

## ✨ Key Modules

### 📊 Intelligence Dashboard
Interactive visualizations using `Chart.js` including:
- **Placement Gauge**: Real-time probability tracking.
- **Skill Gap Heatmap**: Highlighting missing proficiencies vs. target requirements.
- **Industry Benchmark Radar**: Comparing the candidate against 10,000+ industry-standard profiles.

### 🌳 Dynamic Career Roadmap
A visual, tree-based progression engine that calculates the "Shortest Path to Placement":
- **Upskilling Milestones**: Specific, time-bound tasks to bridge skill gaps.
- **Resource Aggregator**: Curated links to high-authority documentation and courses (Coursera, MDN, Kaggle, etc.).

### 🎤 Biometric Interview Simulation
An AI-driven practice module tracking technical responses. (Note: Current version simulates marker tracking for professional growth practice).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons, Chart.js, LocalStorage API |
| **Mobile** | Capacitor (Android) |
| **Backend** | FastAPI, Uvicorn, Python 3.12+ |
| **ML/Analytics** | Scikit-Learn, Pandas, NumPy, Joblib |
| **NLP** | spaCy (en_core_web_sm), PDFPlumber, RE |
| **Frontend Hosting** | GitHub Pages |
| **Backend Hosting** | Render (Web Service) |
| **CI/CD** | GitHub Actions Pipeline (Automated testing & linting) |
| **Export** | Browser Print-to-PDF Engine (Custom HTML Templates) |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js v18+
- Python 3.11 or 3.12 (Recommended)
- Git

### 1. Automated Setup (Windows)
Run the provided PowerShell script from the root directory:
```powershell
.\start_app.ps1
```

### 2. Manual Installation

**Backend Setup:**
```bash
cd backend
python -m venv .venv

# Activate virtual environment (Windows)
.\.venv\Scripts\activate
# Activate virtual environment (Mac/Linux)
# source .venv/bin/activate

pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Copy configuration template
python -c "import shutil; shutil.copy('../.env.example', '.env')"
uvicorn main:app --reload
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

**Android Mobile Build Setup:**
```bash
cd frontend
npm install
npx cap sync android
# Build the release APK (Android Studio can also be opened via 'npx cap open android')
cd android
./gradlew assembleRelease
```

---

## ☁️ Production Deployment

TonyCV uses a **split deployment** strategy — the frontend and backend are hosted on separate platforms for optimal performance and cost:

| Layer | Platform | URL |
| :--- | :--- | :--- |
| **Frontend** | GitHub Pages | [prashant-singh-rawat.github.io/ML-Project-CV-Analysis](https://prashant-singh-rawat.github.io/ML-Project-CV-Analysis/) |
| **Backend API** | Render (Web Service) | [tonycv-backend.onrender.com](https://tonycv-backend.onrender.com) |

---

### Backend — Render Web Service (Python / FastAPI)

| Property | Value |
| :--- | :--- |
| **Platform** | Render Web Service |
| **Runtime** | Python 3.10 |
| **Root Directory** | `backend/` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Config File** | `render.yaml` (root of repo) |
| **Environment Vars** | `JWT_SECRET_KEY` (set in Render Dashboard) |

**Deploy Backend to Render:**
1. Go to [Render Dashboard](https://dashboard.render.com) → **New → Blueprint**
2. Connect your GitHub repository
3. Render detects `render.yaml` and sets up the backend service automatically
4. Set `JWT_SECRET_KEY` under the service → **Environment** tab
5. Click **Apply** — the backend will build and deploy

---

### Frontend — GitHub Pages (React / Vite)

| Property | Value |
| :--- | :--- |
| **Platform** | GitHub Pages |
| **Build Output** | `frontend/dist/` |
| **Live URL** | `https://prashant-singh-rawat.github.io/ML-Project-CV-Analysis/` |

**Deploy Frontend to GitHub Pages:**
```bash
cd frontend
npm install
npm run build
# The dist/ folder is then published via the gh-pages branch or GitHub Actions
```

> The frontend communicates with the Render backend via the hardcoded API base URL (`https://tonycv-backend.onrender.com`) with a `localhost` fallback for local development.

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help make TonyCV better:

### How to Contribute

1. **Fork the repository**
   - Click the "Fork" button on the top right of the repository page.

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/ML-Project-CV-Analysis.git
   cd ML-Project-CV-Analysis
   
## 📈 Future Roadmap
- **Live GitHub API Integration**: Real-time repository sentiment analysis.
- **Generative AI Feedback**: Integration with LLMs for personalized interview coaching.
- **Web3 Credential Issuance**: Real-world NFT/SBT minting of verified skill reports.

---

## 🤝 Community & Contributing
We welcome contributions! Please check our GitHub Issues tab for requested features and bug fixes. Before participating, please read our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming environment for everyone.

---

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

---
*Developed with ❤️ for the future of AI-driven recruitment by [Prashant Singh Rawat](https://github.com/Prashant-Singh-Rawat).*
