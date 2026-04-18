# 🚀 TonyCV: AI-Powered Recruitment Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.12+](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/)
[![React: 19](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![ML: Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn-F7931E.svg)](https://scikit-learn.org/)

**TonyCV** is a state-of-the-art, end-to-end recruitment intelligence platform designed to bridge the gap between candidates and recruiters using advanced Natural Language Processing (NLP) and Machine Learning (ML). It transforms static resumes into dynamic, data-driven career roadmaps while providing recruiters with verified, high-confidence candidate scores.

---

## 🏛️ System Architecture

TonyCV utilizes a decoupled micro-architecture designed for scalability and high-performance analysis:

- **Frontend Application**: A React 19 (Vite) single-page application utilizing atomic design principles, glassmorphic UI, and real-time state persistence.
- **NLP & ML Engine**: A FastAPI (Python) backend serving as the core computational layer, handling vector extraction and predictive inference.
- **Data Persistence**: LocalStorage and session-based state management for ultra-fast, offline-capable performance.

---

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
| **Backend** | FastAPI, Uvicorn, Python 3.12+ |
| **ML/Analytics** | Scikit-Learn, Pandas, NumPy, Joblib |
| **NLP** | spaCy (en_core_web_sm), PDFPlumber, RE |
| **Export** | Browser Print-to-PDF Engine (Custom HTML Templates) |

---

## 🚀 Installation & Deployment

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
.\.venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📈 Future Roadmap
- **Live GitHub API Integration**: Real-time repository sentiment analysis.
- **Generative AI Feedback**: Integration with LLMs for personalized interview coaching.
- **Web3 Credential Issuance**: Real-world NFT/SBT minting of verified skill reports.

---

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

---
*Developed with ❤️ for the future of AI-driven recruitment by [Prashant Singh Rawat](https://github.com/Prashant-Singh-Rawat).*
