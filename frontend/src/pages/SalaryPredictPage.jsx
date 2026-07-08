import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ROLES = ['Software Engineer', 'Data Scientist', 'ML Engineer', 'Frontend Developer', 'Full Stack Developer', 'DevOps Engineer'];
const LOCATIONS = ['Bangalore', 'San Francisco', 'New York', 'London', 'Remote', 'Mumbai', 'Hyderabad'];

export default function SalaryPredictPage() {
  const [skills, setSkills] = useState('');
  const [role, setRole] = useState('Software Engineer');
  const [location, setLocation] = useState('Bangalore');
  const [expYears, setExpYears] = useState(2);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    if (!skills.trim()) { setError('Please enter at least a few skills.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API}/features/salary-predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: skills.split(',').map(s => s.trim()).filter(Boolean),
          role,
          location,
          experience_years: parseInt(expYears),
        }),
      });
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch {
      setError('Failed to predict salary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-amber-950 to-slate-900 pt-8 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-block bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-amber-500/30">
            💰 Salary Intelligence
          </span>
          <h1 className="text-4xl font-black text-white mb-3">Salary Prediction</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Estimate your market salary range based on your skills, role, location, and experience.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-6">
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Target Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-slate-800/80 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none">
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Location</label>
              <select value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-slate-800/80 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none">
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Years of Experience: <span className="text-amber-400 font-black">{expYears}</span>
            </label>
            <input
              type="range"
              min={0}
              max={15}
              value={expYears}
              onChange={e => setExpYears(e.target.value)}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0 yrs (Fresher)</span>
              <span>15+ yrs (Expert)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Your Skills (comma-separated)</label>
            <input
              type="text"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              placeholder="Python, Machine Learning, TensorFlow, SQL, Docker..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500/60 transition-all"
            />
          </div>

          {error && <p className="text-red-400 text-xs mt-3 font-semibold">{error}</p>}

          <div className="flex justify-end mt-5">
            <button
              onClick={handlePredict}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black px-8 py-3 rounded-2xl shadow-lg shadow-amber-500/30 transition-all disabled:opacity-50"
            >
              {loading ? (
                <><span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Predicting...</>
              ) : '💰 Predict My Salary'}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-3xl p-8 text-center">
                <p className="text-slate-400 text-sm font-semibold mb-3">Estimated Salary Range</p>
                <p className="text-5xl font-black text-amber-400 mb-2">{result.predicted_range}</p>
                <p className="text-slate-400 text-sm mb-1">Per Annum</p>
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 mt-4">
                  <span className="text-slate-400 text-xs">Market Median:</span>
                  <span className="text-white font-black text-sm">{result.average_market_median}</span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${result.confidence === 'High' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {result.confidence} Confidence
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-5">
                  * Estimated ranges are based on aggregated market data and may vary.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
