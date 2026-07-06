import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function JdMatchPage() {
  const [cvText, setCvText] = useState('');
  const [jd, setJd] = useState('');
  const [skills, setSkills] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMatch = async () => {
    if (!cvText.trim() || !jd.trim()) { setError('Please provide both your CV and the Job Description.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API}/features/jd-match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cv_text: cvText,
          job_description: jd,
          candidate_skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch {
      setError('Failed to run JD match. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const matchColor = (pct) => pct >= 75 ? 'text-green-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400';
  const matchBg = (pct) => pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 pt-8 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-emerald-500/30">
            🎯 Job Matching
          </span>
          <h1 className="text-4xl font-black text-white mb-3">Job Description Matcher</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Upload your resume and paste a job description to see exactly how well you match.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 mb-6">
          {/* CV Input */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <label className="block text-sm font-bold text-slate-300 mb-3">📄 Your Resume / CV Text</label>
            <textarea
              rows={10}
              value={cvText}
              onChange={e => setCvText(e.target.value)}
              placeholder="Paste your full resume text here..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 text-sm resize-none focus:outline-none focus:border-emerald-500/60 transition-all"
            />
            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-400 mb-2">Your Skills (comma-separated)</label>
              <input
                type="text"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                placeholder="Python, React, SQL, AWS..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500/60 transition-all"
              />
            </div>
          </motion.div>

          {/* JD Input */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.15 } }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <label className="block text-sm font-bold text-slate-300 mb-3">💼 Job Description</label>
            <textarea
              rows={14}
              value={jd}
              onChange={e => setJd(e.target.value)}
              placeholder="Paste the full job description here..."
              className="w-full h-[calc(100%-2.5rem)] bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 text-sm resize-none focus:outline-none focus:border-emerald-500/60 transition-all"
            />
          </motion.div>
        </div>

        {error && <p className="text-red-400 text-xs font-semibold mb-4 text-center">{error}</p>}

        <div className="flex justify-center mb-8">
          <button
            onClick={handleMatch}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black px-10 py-4 rounded-2xl shadow-lg shadow-emerald-500/30 transition-all text-base disabled:opacity-50"
          >
            {loading ? (
              <><span className="animate-spin inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> Analyzing Match...</>
            ) : '🎯 Match My Resume to JD'}
          </button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              {/* Match Percentage */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
                <p className="text-slate-400 text-sm font-semibold mb-2">Overall Match Score</p>
                <p className={`text-7xl font-black mb-2 ${matchColor(result.match_percentage)}`}>{result.match_percentage}%</p>
                <div className="max-w-sm mx-auto h-3 bg-white/10 rounded-full overflow-hidden mt-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.match_percentage}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className={`h-full rounded-full ${matchBg(result.match_percentage)}`}
                  />
                </div>
                <p className="text-slate-400 text-xs mt-2">Keyword Overlap: {result.keyword_overlap_percentage}%</p>
              </div>

              {/* Skills */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="bg-green-500/5 border border-green-500/20 rounded-3xl p-6">
                  <h3 className="text-green-400 font-black text-base mb-4">✅ Matching Skills ({result.matching_skills.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.matching_skills.length > 0 ? result.matching_skills.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-bold rounded-full border border-green-500/30">{s}</span>
                    )) : <p className="text-slate-500 text-sm">No exact matches found.</p>}
                  </div>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6">
                  <h3 className="text-red-400 font-black text-base mb-4">❌ Missing Skills ({result.missing_skills.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_skills.length > 0 ? result.missing_skills.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-red-500/20 text-red-300 text-xs font-bold rounded-full border border-red-500/30">{s}</span>
                    )) : <p className="text-slate-500 text-sm">No missing required skills!</p>}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6">
                <h3 className="text-amber-300 font-black text-base mb-3">💡 Improvement Suggestions</h3>
                <ul className="space-y-2">
                  {result.suggestions.map((sug, i) => (
                    <li key={i} className="text-amber-100/80 text-sm flex items-start gap-2">
                      <span className="text-amber-400">→</span> {sug}
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
