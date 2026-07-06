import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ROLES = ['Software Engineer', 'Data Scientist', 'ML Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer'];
const EXP_LEVELS = ['fresher', 'experienced', 'highly_experienced'];

export default function CareerRoadmapPage() {
  const [skills, setSkills] = useState('');
  const [role, setRole] = useState('Data Scientist');
  const [expLevel, setExpLevel] = useState('fresher');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!skills.trim()) { setError('Please enter your current skills.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API}/features/roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_skills: skills.split(',').map(s => s.trim()).filter(Boolean),
          desired_role: role,
          experience_level: expLevel,
        }),
      });
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch {
      setError('Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 pt-8 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-block bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-cyan-500/30">
            🗺️ Career Planning
          </span>
          <h1 className="text-4xl font-black text-white mb-3">Interactive Career Roadmap</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Get a personalized, step-by-step career roadmap based on your skills and desired role.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Desired Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full bg-slate-800/80 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/60 transition-all"
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Experience Level</label>
              <select
                value={expLevel}
                onChange={e => setExpLevel(e.target.value)}
                className="w-full bg-slate-800/80 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/60 transition-all"
              >
                {EXP_LEVELS.map(e => <option key={e} value={e}>{e.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Your Current Skills (comma-separated)</label>
            <input
              type="text"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              placeholder="e.g. Python, SQL, Git, React, Machine Learning..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/60 transition-all"
            />
          </div>
          {error && <p className="text-red-400 text-xs mt-3 font-semibold">{error}</p>}
          <div className="flex justify-end mt-5">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black px-8 py-3 rounded-2xl shadow-lg shadow-cyan-500/30 transition-all disabled:opacity-50"
            >
              {loading ? (
                <><span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Generating...</>
              ) : '🗺️ Generate My Roadmap'}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Timeline header */}
              <div className="text-center mb-8">
                <span className="inline-block bg-cyan-500/10 text-cyan-300 text-sm font-bold px-6 py-2 rounded-full border border-cyan-500/30">
                  ⏱️ Estimated Timeline: {result.estimated_timeline}
                </span>
              </div>

              {/* Timeline steps */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/60 via-blue-500/40 to-transparent" />

                <div className="space-y-6">
                  {result.roadmap.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: i * 0.1 } }}
                      className="relative flex gap-6"
                    >
                      {/* Step circle */}
                      <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-black shadow-lg z-10 border-2 ${
                        step.completed
                          ? 'bg-green-500 border-green-400 text-white shadow-green-500/40'
                          : 'bg-slate-800 border-white/10 text-white'
                      }`}>
                        {step.completed ? '✓' : `0${step.step}`}
                      </div>

                      {/* Card */}
                      <div className={`flex-1 rounded-3xl p-5 border transition-all ${
                        step.completed
                          ? 'bg-green-500/5 border-green-500/30'
                          : 'bg-white/5 border-white/10 hover:border-cyan-500/30'
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-white font-black text-base">{step.title}</h3>
                          {step.completed && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30 font-bold">Completed ✓</span>
                          )}
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {step.required_skills.map((sk, j) => {
                            const acquired = step.acquired_skills.includes(sk);
                            return (
                              <span key={j} className={`px-3 py-1 text-xs font-bold rounded-full border ${
                                acquired
                                  ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                  : 'bg-white/5 text-slate-400 border-white/10'
                              }`}>
                                {acquired ? '✓ ' : ''}{sk}
                              </span>
                            );
                          })}
                        </div>

                        {/* Resource */}
                        <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold">
                          <span>📚</span>
                          <span>{step.learning_resource}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
