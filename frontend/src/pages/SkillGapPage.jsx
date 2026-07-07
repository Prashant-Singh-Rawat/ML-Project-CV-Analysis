import React, { useState } from 'react';
import { motion } from 'framer-motion';
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const ROLES = ['Software Engineer', 'Data Scientist', 'ML Engineer', 'Frontend Developer', 'Full Stack Developer'];

export default function SkillGapPage() {
  const [role, setRole] = useState('Data Scientist');
  const [candidateSkills, setCandidateSkills] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!candidateSkills.trim()) { setError('Please enter your skills.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const params = new URLSearchParams({ target_role: role, candidate_skills: candidateSkills });
      const res = await fetch(`${API}/features/skill-gap-recommendations?${params.toString()}`);
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch {
      setError('Failed to analyze skill gaps. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const completePct = result ? Math.round((result.acquired_skills.length / result.required_skills.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 pt-8 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-block bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-indigo-500/30">
            📈 Skill Intelligence
          </span>
          <h1 className="text-4xl font-black text-white mb-3">Skill Gap & Learning Recommendations</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Discover what skills you need to acquire and get curated learning resources to bridge the gap.
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
              <label className="block text-sm font-semibold text-slate-300 mb-2">Your Current Skills</label>
              <input
                type="text"
                value={candidateSkills}
                onChange={e => setCandidateSkills(e.target.value)}
                placeholder="Python, SQL, Pandas..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}
          <div className="flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black px-8 py-3 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50"
            >
              {loading ? <><span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Analyzing...</> : '📈 Analyze Skill Gap'}
            </button>
          </div>
        </motion.div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {/* Progress */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-black text-lg">Role Readiness</h3>
                <span className={`text-2xl font-black ${completePct >= 80 ? 'text-green-400' : completePct >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{completePct}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completePct}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full rounded-full ${completePct >= 80 ? 'bg-green-500' : completePct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                />
              </div>
              <p className="text-slate-400 text-xs mt-2">{result.acquired_skills.length} of {result.required_skills.length} required skills acquired for {result.target_role}</p>
            </div>

            {/* Skill comparison */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-green-500/5 border border-green-500/20 rounded-3xl p-6">
                <h3 className="text-green-400 font-black text-sm mb-4 uppercase tracking-wide">✅ Skills You Have</h3>
                <div className="flex flex-wrap gap-2">
                  {result.acquired_skills.length > 0
                    ? result.acquired_skills.map((s, i) => (
                        <span key={i} className="px-3 py-1.5 bg-green-500/20 text-green-300 text-xs font-bold rounded-full border border-green-500/30">{s}</span>
                      ))
                    : <p className="text-slate-500 text-sm">None matched yet.</p>}
                </div>
              </div>
              <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6">
                <h3 className="text-red-400 font-black text-sm mb-4 uppercase tracking-wide">❌ Skills to Acquire</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missing_skills.length > 0
                    ? result.missing_skills.map((s, i) => (
                        <span key={i} className="px-3 py-1.5 bg-red-500/20 text-red-300 text-xs font-bold rounded-full border border-red-500/30">{s}</span>
                      ))
                    : <p className="text-green-400 text-sm font-bold">🎉 You have all the required skills!</p>}
                </div>
              </div>
            </div>

            {/* Learning Resources */}
            {result.recommendations.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                <h3 className="text-white font-black text-lg mb-5">📚 Curated Learning Resources</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {result.recommendations.map((rec, i) => (
                    <motion.a
                      key={i}
                      href={rec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: i * 0.08 } }}
                      className="group flex items-start gap-4 bg-white/5 hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-500/40 rounded-2xl p-4 transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-sm flex-shrink-0">
                        {rec.skill.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-black text-sm mb-0.5">{rec.skill}</p>
                        <p className="text-slate-400 text-xs mb-1">{rec.provider}</p>
                        <p className="text-indigo-400 text-xs font-semibold truncate group-hover:underline">{rec.url}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
