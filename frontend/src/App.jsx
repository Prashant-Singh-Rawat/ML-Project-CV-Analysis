import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiCpu } from 'react-icons/fi';

// Pages
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import DashboardPage from './pages/DashboardPage';

function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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

  return (
    <nav className="navbar relative z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}>
            <FiCpu className="text-white" size={18} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Tony<span className="gradient-text">CV</span>
          </span>
        </Link>

        <div className="hidden sm:flex items-center relative max-w-xs w-full mx-4">
          <FiSearch className="absolute left-3 text-gray-500" size={16} />
          <input
            type="text"
            className="input-field pl-9 py-2 text-sm rounded-full w-full"
            placeholder="Type a URL and press Enter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        <div className="flex items-center gap-4">
          <Link to="/analyze" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
            Analyze CV
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      {/* Animated Background */}
      <div className="bg-animated" />

      {/* Navbar always visible */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6 text-center mt-auto">
        <p className="text-gray-600 text-sm">
          Built with React, FastAPI & scikit-learn • <span className="gradient-text font-semibold">TonyCV</span> AI Engine
        </p>
      </footer>
    </Router>
  );
}

export default App;
