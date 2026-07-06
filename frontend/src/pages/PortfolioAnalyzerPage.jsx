import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function PortfolioAnalyzerPage() {
  const [form, setForm] = useState({ github_url: '', linkedin_url: '', leetcode_user: '', codeforces_user: '', hackerrank_user: '' });
  const [githubResult, setGithubResult] = useState(null);
  const [portfolioResult, setPortfolioResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleAnalyze = async () => {
    if (!form.github_url && !form.leetcode_user && !form.linkedin_url) {
      setError('Please provide at least a GitHub URL or LeetCode username.');
      return;
    }
    setError('');
    setLoading(true);
    setGithubResult(null);
    setPortfolioResult(null);

    try {
      const [githubRes, portfolioRes] = await Promise.all([
        form.github_url ? fetch(`${API}/features/github-stats`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ github_url: form.github_url }),
        }) : Promise.resolve(null),
        fetch(`${API}/features/portfolio-analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }),
      ]);

      if (githubRes) setGithubResult(await githubRes.json());
      setPortfolioResult(await portfolioRes.json());
    } catch {
      setError('Failed to analyze portfolio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'github_url', label: 'GitHub Profile URL', placeholder: 'https://github.com/username', icon: '🐙' },
    { key: 'linkedin_url', label: 'LinkedIn Profile URL', placeholder: 'https://linkedin.com/in/username', icon: '💼' },
    { key: 'leetcode_user', label: 'LeetCode Username', placeholder: 'leetcode_username', icon: '⚡' },
    { key: 'codeforces_user', label: 'Codeforces Handle', placeholder: 'cf_handle', icon: '🏆' },
    { key: 'hackerrank_user', label: 'HackerRank Username', placeholder: 'hr_username', icon: '🌐' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 pt-8 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-block bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-teal-500/30">
            🌐 Portfolio Analysis
          </span>
          <h1 className="text-4xl font-black text-white mb-3">Portfolio Analyzer</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Connect your developer profiles for a holistic evaluation of your technical presence.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-6">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {fields.map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-slate-400 mb-2">{f.icon} {f.label}</label>
                <input
                  type="text"
                  value={form[f.key]}
                  onChange={e => handleChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500/60 transition-all"
                />
              </div>
            ))}
          </div>
          {error && <p className="text-red-400 text-xs font-semibold mb-3">{error}</p>}
          <div className="flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black px-8 py-3 rounded-2xl shadow-lg shadow-teal-500/30 transition-all disabled:opacity-50"
            >
              {loading ? <><span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Analyzing...</> : '🌐 Analyze Portfolio'}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {githubResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-5">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-white font-black text-lg">🐙 GitHub Profile — @{githubResult.username}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-teal-400">{githubResult.developer_score}</span>
                    <span className="text-slate-400 text-xs font-bold">/100 Score</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                  {[
                    { label: 'Repositories', value: githubResult.total_repositories, icon: '📁' },
                    { label: 'Total Commits', value: githubResult.total_commits, icon: '💾' },
                    { label: 'Pull Requests', value: githubResult.pull_requests_count, icon: '🔀' },
                    { label: 'Issues Resolved', value: githubResult.issues_resolved, icon: '✅' },
                    { label: 'Stars Received', value: githubResult.stars_received, icon: '⭐' },
                    { label: 'Forks Created', value: githubResult.forks_created, icon: '🍴' },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                      <span className="text-2xl mb-1 block">{icon}</span>
                      <p className="text-white font-black text-xl">{value}</p>
                      <p className="text-slate-400 text-xs">{label}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-3">Language Distribution</p>
                  {Object.entries(githubResult.languages_distribution).map(([lang, pct]) => (
                    <div key={lang} className="mb-2">
                      <div className="flex justify-between text-xs text-slate-300 mb-1 font-semibold">
                        <span>{lang}</span><span>{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {portfolioResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid md:grid-cols-3 gap-5">
              <div className="bg-green-500/5 border border-green-500/20 rounded-3xl p-5">
                <h4 className="text-green-400 font-black text-sm mb-4">💪 Strengths</h4>
                <ul className="space-y-2">
                  {portfolioResult.strengths.map((s, i) => <li key={i} className="text-slate-300 text-sm flex items-start gap-2"><span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>{s}</li>)}
                </ul>
              </div>
              <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-5">
                <h4 className="text-red-400 font-black text-sm mb-4">⚠️ Weaknesses</h4>
                <ul className="space-y-2">
                  {portfolioResult.weaknesses.map((s, i) => <li key={i} className="text-slate-300 text-sm flex items-start gap-2"><span className="text-red-400 mt-0.5 flex-shrink-0">!</span>{s}</li>)}
                </ul>
              </div>
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-3xl p-5">
                <h4 className="text-blue-400 font-black text-sm mb-4">🎯 Recommendations</h4>
                <ul className="space-y-2">
                  {portfolioResult.recommendations.map((s, i) => <li key={i} className="text-slate-300 text-sm flex items-start gap-2"><span className="text-blue-400 mt-0.5 flex-shrink-0">→</span>{s}</li>)}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
