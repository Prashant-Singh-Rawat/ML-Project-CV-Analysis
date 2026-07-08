import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const SECTIONS = ['Summary', 'Experience', 'Projects', 'Skills', 'Achievements'];

export default function ResumeRewriteAssistant() {
  const [section, setSection] = useState('Summary');
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState(null);

  const handleRewrite = async () => {
    if (!content.trim()) { setError('Please enter some content to rewrite.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API}/features/rewrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: section.toLowerCase(), content }),
      });
      if (!res.ok) throw new Error('Rewrite request failed');
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-8 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-block bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-blue-500/30">
            ✨ AI-Powered
          </span>
          <h1 className="text-4xl font-black text-white mb-3">Resume Rewrite Assistant</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Transform generic resume content into ATS-optimized, high-impact professional language instantly.
          </p>
        </motion.div>

        {/* Section selector */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }} className="flex flex-wrap gap-2 justify-center mb-8">
          {SECTIONS.map(s => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                section === s
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
              }`}
            >
              {s}
            </button>
          ))}
        </motion.div>

        {/* Input card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-6">
          <label className="block text-sm font-semibold text-slate-300 mb-3">
            Your Current {section} Content
          </label>
          <textarea
            rows={6}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={`Paste your ${section.toLowerCase()} content here...`}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-500 text-sm resize-none focus:outline-none focus:border-blue-500/60 focus:bg-white/10 transition-all"
          />
          {error && <p className="text-red-400 text-xs mt-2 font-semibold">{error}</p>}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleRewrite}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black px-8 py-3 rounded-2xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
            >
              {loading ? (
                <><span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Rewriting...</>
              ) : '✨ Rewrite with AI'}
            </button>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Suggestions */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400">✓</span>
                  AI-Enhanced Suggestions
                </h3>
                <div className="space-y-3">
                  {result.suggestions.map((s, i) => (
                    <div key={i} className={`relative rounded-2xl p-4 border transition-all cursor-pointer ${applied === i ? 'border-green-500/60 bg-green-500/10' : 'border-white/10 bg-white/5 hover:border-blue-500/40 hover:bg-blue-500/5'}`}
                      onClick={() => setApplied(i)}>
                      <p className="text-slate-200 text-sm leading-relaxed">{s}</p>
                      {applied === i && (
                        <span className="absolute top-3 right-3 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold border border-green-500/30">Applied ✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6">
                <h3 className="text-amber-300 font-black text-base mb-3 flex items-center gap-2">💡 Pro Tips for {section}</h3>
                <ul className="space-y-2">
                  {result.tips.map((tip, i) => (
                    <li key={i} className="text-amber-100/80 text-sm flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">→</span> {tip}
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
