import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiCpu, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import DashboardPage from './pages/DashboardPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import CVPage from './pages/CVPage';
import CoverLetterPage from './pages/CoverLetterPage';
import CareerBlogPage from './pages/CareerBlogPage';
import AboutPage from './pages/AboutPage';
import RegisterPopup from './components/RegisterPopup';
// New Feature Pages
import ResumeRewritePage from './pages/ResumeRewritePage';
import AtsScorePage from './pages/AtsScorePage';
import JdMatchPage from './pages/JdMatchPage';
import CareerRoadmapPage from './pages/CareerRoadmapPage';
import InterviewSimulatorPage from './pages/InterviewSimulatorPage';
import SalaryPredictPage from './pages/SalaryPredictPage';
import SkillGapPage from './pages/SkillGapPage';
import PortfolioAnalyzerPage from './pages/PortfolioAnalyzerPage';

/* ── Scroll-to-top on route change ── */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/* ── Dropdown menu helper ── */
function NavDropdown({ label, items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold text-sm text-slate-600"
      >
        {label}
        <FiChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden min-w-[200px] z-50"
          >
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => { navigate(item.to); setOpen(false); }}
                className="w-full text-left px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-3"
              >
                {item.icon && <span className="text-base">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Navbar ── */
/* ── Navbar ── */
function Navbar({ user, onLogout, onOpenRegister }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      let url = searchTerm.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
      window.open(url, '_blank');
      setSearchTerm('');
    }
  };

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const resumeDropItems = [
    { label: 'Resume Builder', to: '/resume-builder', icon: '🛠️' },
    { label: 'Upload & Analyse', to: '/analyze', icon: '📊' },
    { label: 'AI Rewrite Assistant', to: '/ai-rewrite', icon: '✨' },
    { label: 'ATS Score Checker', to: '/ats-score', icon: '📊' },
  ];

  const cvDropItems = [
    { label: 'CV Builder', to: '/cv', icon: '📋' },
    { label: 'JD Matcher', to: '/jd-match', icon: '🎯' },
    { label: 'CV vs Resume Guide', to: '/cv', icon: '📖' },
  ];

  const careerDropItems = [
    { label: 'Career Roadmap', to: '/career-roadmap', icon: '🗺️' },
    { label: 'Skill Gap Analysis', to: '/skill-gap', icon: '📈' },
    { label: 'Portfolio Analyzer', to: '/portfolio-analyzer', icon: '🌐' },
    { label: 'Interview Simulator', to: '/interview-simulator', icon: '🎤' },
    { label: 'Salary Predictor', to: '/salary-predict', icon: '💰' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-600 shadow-sm">
            <FiCpu className="text-white" size={18} />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight hidden sm:block">
            Tony<span className="text-blue-600">CV</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-5 text-sm font-semibold text-slate-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <NavDropdown label="Resume" items={resumeDropItems} />
          <NavDropdown label="CV" items={cvDropItems} />
          <NavDropdown label="Career" items={careerDropItems} />
          <Link to="/cover-letter" className="hover:text-blue-600 transition-colors">Cover Letter</Link>
          <Link to="/career-blog" className="hover:text-blue-600 transition-colors">Blog</Link>
          <Link to="/about" className="hover:text-blue-600 transition-colors">About</Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden sm:flex items-center relative max-w-xs w-full">
            <FiSearch className="absolute left-3 text-slate-400" size={13} />
            <input
              type="text"
              className="bg-slate-50 border border-slate-200 pl-8 pr-4 py-1.5 text-xs rounded-full w-full text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition"
              placeholder="Search CV resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>

          {/* User auth details / Sign In CTA */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 hidden md:inline">Hi, {user.name}</span>
              <button 
                onClick={onLogout}
                className="text-xs font-black text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg border border-red-200/60 hover:bg-red-50 transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenRegister}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 px-3.5 py-1.5 rounded-full border border-blue-200 hover:bg-blue-50 transition"
            >
              Sign In
            </button>
          )}

          {/* Analyse CTA */}
          <Link
            to="/analyze"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-full shadow-sm"
          >
            Analyse CV
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {[
                { label: '🏠 Home', to: '/' },
                { label: '🛠️ Resume Builder', to: '/resume-builder' },
                { label: '📋 CV Builder', to: '/cv' },
                { label: '✉️ Cover Letter', to: '/cover-letter' },
                { label: '📊 Upload & Analyse', to: '/analyze' },
                { label: '📰 Career Blog', to: '/career-blog' },
                { label: 'ℹ️ About', to: '/about' },
              ].map((item) => (
                <button
                  key={item.to}
                  onClick={() => navigate(item.to)}
                  className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => navigate('/analyze')}
                  className="w-full text-center px-4 py-3 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-full transition"
                >
                  Analyse My CV Free →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ── Footer ── */
function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="relative z-10 border-t border-slate-200 bg-white py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-slate-500 text-sm">
          Built with React, FastAPI &amp; scikit-learn •{' '}
          <span className="text-blue-600 font-semibold">TonyCV</span> AI Engine
        </p>
        <div className="flex gap-5 text-xs font-semibold text-slate-500">
          <button onClick={() => navigate('/about')} className="hover:text-blue-600 transition-colors">About</button>
          <button onClick={() => navigate('/career-blog')} className="hover:text-blue-600 transition-colors">Blog</button>
          <button onClick={() => navigate('/analyze')} className="hover:text-blue-600 transition-colors">Analyse CV</button>
          <button onClick={() => navigate('/resume-builder')} className="hover:text-blue-600 transition-colors">Builder</button>
        </div>
      </div>
    </footer>
  );
}

/* ── App ── */
function App() {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('tonycv_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [registerOpen, setRegisterOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('tonycv_token');
    localStorage.removeItem('tonycv_user');
    setUser(null);
  };

  return (
    <Router>
      <ScrollToTop />
      {/* Global Toast Notifications (Errors, Warnings, Successes) */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Animated Background */}
      <div className="bg-animated" />

      {/* Navbar always visible */}
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onOpenRegister={() => setRegisterOpen(true)} 
      />

      {/* Main Content */}
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/resume-builder" element={<ResumeBuilderPage />} />
          <Route path="/cv" element={<CVPage />} />
          <Route path="/cover-letter" element={<CoverLetterPage />} />
          <Route path="/career-blog" element={<CareerBlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* New Feature Routes */}
          <Route path="/ai-rewrite" element={<ResumeRewritePage />} />
          <Route path="/ats-score" element={<AtsScorePage />} />
          <Route path="/jd-match" element={<JdMatchPage />} />
          <Route path="/career-roadmap" element={<CareerRoadmapPage />} />
          <Route path="/interview-simulator" element={<InterviewSimulatorPage />} />
          <Route path="/salary-predict" element={<SalaryPredictPage />} />
          <Route path="/skill-gap" element={<SkillGapPage />} />
          <Route path="/portfolio-analyzer" element={<PortfolioAnalyzerPage />} />
          {/* Catch-all → Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />

      {/* Registration & Login Popup */}
      <RegisterPopup 
        isOpen={registerOpen} 
        onClose={() => setRegisterOpen(false)} 
        onAuthSuccess={(u) => setUser(u)}
      />
    </Router>
  );
}

export default App;
