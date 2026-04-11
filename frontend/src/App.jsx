import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InputForm from './components/InputForm';
import Dashboard from './components/Dashboard';
import { FiSearch, FiCpu, FiBarChart2, FiShield, FiZap } from 'react-icons/fi';

const API_BASE_URL = 'https://tonycv-backend.onrender.com';

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [step, setStep] = useState('input');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE_URL}/companies`)
      .then(res => setCompanies(res.data.companies))
      .catch(() => {
        setCompanies(["Google", "Amazon", "Microsoft", "Meta", "Apple"]);
      });

    axios.get(`${API_BASE_URL}/metrics`)
      .then(res => setMetrics(res.data))
      .catch(err => console.error("Error fetching metrics", err));
  }, []);

  // Magic Search — type a URL to open it
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      let url = searchTerm.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      window.open(url, '_blank');
      setSearchTerm('');
    }
  };

  const handleAnalyze = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('cv_file', data.cv_file);
      formData.append('cgpa', data.cgpa);
      formData.append('target_company', data.target_company);

      const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
      setStep('result');
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred while connecting to the AI model.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetToInput = () => {
    setResult(null);
    setStep('input');
    setError(null);
  };

  const features = [
    { icon: <FiCpu />, title: 'NLP Analysis', desc: 'Deep language understanding' },
    { icon: <FiBarChart2 />, title: 'ML Predictions', desc: 'RandomForest powered' },
    { icon: <FiShield />, title: 'Skill Match', desc: 'Industry-aligned scoring' },
    { icon: <FiZap />, title: 'Instant Results', desc: 'Real-time processing' },
  ];

  return (
    <>
      {/* Animated Background */}
      <div className="bg-animated" />

      {/* Navbar */}
      <nav className="navbar">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}>
              <FiCpu className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Tony<span className="gradient-text">CV</span>
            </span>
          </div>

          {/* Search Bar */}
          <div className="hidden sm:flex items-center relative max-w-xs w-full mx-4">
            <FiSearch className="absolute left-3 text-gray-500" size={16} />
            <input
              type="text"
              className="input-field pl-9 py-2 text-sm rounded-full"
              placeholder="Type a URL and press Enter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:block">AI-Powered Engine v2.0</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-screen pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-wide uppercase" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <FiZap size={12} /> AI-Powered Analysis Engine
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-5 leading-tight">
              Analyze Your CV with<br />
              <span className="gradient-text-warm">Machine Learning</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {step === 'input'
                ? "Upload your resume, enter your CGPA, and select your dream company. Our NLP pipeline will analyze your profile and predict your placement probability."
                : "Your AI-generated placement analysis and skill gap report is ready."
              }
            </p>
          </div>

          {/* Feature Pills — only on input page */}
          {step === 'input' && (
            <div className="flex flex-wrap justify-center gap-4 mb-10 animate-fade-in-up delay-200" style={{ opacity: 0 }}>
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 glass-card px-5 py-3">
                  <div className="feature-icon text-violet-400">
                    {f.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{f.title}</div>
                    <div className="text-xs text-gray-500">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="animate-slide-down mb-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 px-5 py-4 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <div className="text-red-400 text-lg">⚠</div>
                <p className="text-red-300 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Content Area */}
          {step === 'input' ? (
            <div className="animate-fade-in-up delay-300" style={{ opacity: 0 }}>
              <InputForm onAnalyze={handleAnalyze} isLoading={isLoading} companies={companies} />

              {isLoading && (
                <div className="flex flex-col items-center justify-center gap-4 mt-12 animate-fade-in">
                  <div className="spinner" />
                  <p className="text-violet-400 font-semibold tracking-widest uppercase text-xs">Processing NLP Vectors...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fade-in-up">
              <Dashboard result={result} metrics={metrics} onBack={resetToInput} />
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <p className="text-gray-600 text-sm">
          Built with React, FastAPI & scikit-learn • <span className="gradient-text font-semibold">TonyCV</span> AI Engine
        </p>
      </footer>
    </>
  );
}

export default App;
