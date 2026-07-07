import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function ScoreGauge({ score }) {
  const pct = score / 100;
  const radius = 70;
  const circ = 2 * Math.PI * radius;
  const strokeDashoffset = circ * (1 - pct);
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center">
      <svg width={180} height={180} viewBox="0 0 180 180">
        <circle cx={90} cy={90} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={12} />
        <circle
          cx={90} cy={90} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeDasharray={circ}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)', filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
        <text x={90} y={85} textAnchor="middle" fill="white" fontSize={32} fontWeight="900">{score}</text>
        <text x={90} y={108} textAnchor="middle" fill={color} fontSize={11} fontWeight="700">/100 ATS Score</text>
      </svg>
      <span className={`text-sm font-black mt-1 ${score >= 80 ? 'text-green-400' : score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
        {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'}
      </span>
    </div>
  );
}

export default function AtsScorePage() {
  const [cvText, setCvText] = useState('');
  const [skills, setSkills] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!cvText.trim()) { setError('Please paste your CV text.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API}/features/ats-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cv_text: cvText,
          skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch {
      setError('Failed to compute ATS score. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 pt-8 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-block bg-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-violet-500/30">
            📊 ATS Analyzer
          </span>
          <h1 className="text-4xl font-black text-white mb-3">ATS Resume Score</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Get a comprehensive ATS compatibility score and discover exactly what to improve.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Paste Your Resume Text *</label>
              <textarea
                rows={8}
                value={cvText}
                onChange={e => setCvText(e.target.value)}
                placeholder="Paste your full resume/CV text here..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-500 text-sm resize-none focus:outline-none focus:border-violet-500/60 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Your Skills (comma-separated)</label>
              <input
                type="text"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                placeholder="e.g. Python, React, SQL, Docker, Machine Learning"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500/60 transition-all"
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-xs mt-3 font-semibold">{error}</p>}
          <div className="flex justify-end mt-5">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-black px-8 py-3 rounded-2xl shadow-lg shadow-violet-500/30 transition-all disabled:opacity-50"
            >
              {loading ? (
                <><span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Analyzing...</>
              ) : '📊 Analyze ATS Score'}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              {/* Score display */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-10">
                <ScoreGauge score={result.score} />
                <div className="flex-1 space-y-3">
                  <h3 className="text-white font-black text-xl mb-5">Category Breakdown</h3>
                  {Object.entries(result.categories).map(([cat, val]) => (
                    <div key={cat}>
                      <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                        <span>{cat}</span><span className="text-white">{val}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${val}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full ${val >= 80 ? 'bg-green-500' : val >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                <h3 className="text-white font-black text-lg mb-4">🎯 Recommendations</h3>
                <ul className="space-y-3">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                      <span className="w-5 h-5 flex-shrink-0 bg-violet-500/20 text-violet-400 rounded-full flex items-center justify-center text-xs font-black">{i + 1}</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}