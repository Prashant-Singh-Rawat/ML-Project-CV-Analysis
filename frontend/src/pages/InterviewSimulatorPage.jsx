import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const STAGES = ['technical', 'hr', 'behavioral'];
const ROLES = ['Software Engineer', 'Data Scientist', 'ML Engineer', 'Frontend Developer', 'Full Stack Developer'];

export default function InterviewSimulatorPage() {
  const [role, setRole] = useState('Software Engineer');
  const [stage, setStage] = useState('technical');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [loadingQ, setLoadingQ] = useState(false);
  const [loadingE, setLoadingE] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  const fetchQuestion = async () => {
    setLoadingQ(true);
    setEvaluation(null);
    setAnswer('');
    setError('');
    try {
      const res = await fetch(`${API}/features/interview/question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, stage, previous_answers: history }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setQuestion(data.question);
      setSessionActive(true);
    } catch {
      setError('Failed to load question. Please try again.');
    } finally {
      setLoadingQ(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) { setError('Please provide your answer.'); return; }
    setLoadingE(true);
    setError('');
    try {
      const res = await fetch(`${API}/features/interview/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer, role, stage }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEvaluation(data);
      setHistory(prev => [...prev, { question, answer, score: data.confidence_score }]);
    } catch {
      setError('Failed to evaluate answer. Please try again.');
    } finally {
      setLoadingE(false);
    }
  };

  const scoreColor = (s) => s >= 80 ? 'text-green-400' : s >= 65 ? 'text-amber-400' : 'text-red-400';
  const scoreBar = (s) => s >= 80 ? 'bg-green-500' : s >= 65 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-rose-950 to-slate-900 pt-8 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-block bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-rose-500/30">
            🎤 AI Interview
          </span>
          <h1 className="text-4xl font-black text-white mb-3">AI Interview Simulator</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Practice real interview questions and receive instant AI-powered feedback on every answer.
          </p>
        </motion.div>

        {/* Config */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-6">
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">Target Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-slate-800/80 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none">
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">Interview Stage</label>
              <div className="flex gap-2">
                {STAGES.map(s => (
                  <button
                    key={s}
                    onClick={() => setStage(s)}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold capitalize transition-all ${
                      stage === s ? 'bg-rose-600 text-white' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={fetchQuestion}
            disabled={loadingQ}
            className="w-full bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-rose-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loadingQ ? (
              <><span className="animate-spin inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> Loading Question...</>
            ) : sessionActive ? '⏭️ Next Question' : '🎤 Start Interview'}
          </button>
        </motion.div>

        {/* Question + Answer */}
        <AnimatePresence>
          {question && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              {/* Question card */}
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-600/30 flex items-center justify-center text-lg flex-shrink-0">🤖</div>
                  <div>
                    <p className="text-xs font-bold text-rose-400 mb-2 uppercase tracking-wider">{stage} Question</p>
                    <p className="text-white text-lg font-semibold leading-relaxed">{question}</p>
                  </div>
                </div>
              </div>

              {/* Answer */}
              {!evaluation && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                  <label className="block text-sm font-semibold text-slate-300 mb-3">Your Answer</label>
                  <textarea
                    rows={6}
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    placeholder="Type your detailed answer here..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 text-sm resize-none focus:outline-none focus:border-rose-500/60 transition-all"
                  />
                  {error && <p className="text-red-400 text-xs mt-2 font-semibold">{error}</p>}
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={submitAnswer}
                      disabled={loadingE}
                      className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-black px-8 py-3 rounded-2xl transition-all disabled:opacity-50"
                    >
                      {loadingE ? (
                        <><span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Evaluating...</>
                      ) : '✅ Submit Answer'}
                    </button>
                  </div>
                </div>
              )}

              {/* Evaluation */}
              {evaluation && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                  <h3 className="text-white font-black text-lg mb-5">📊 AI Evaluation Results</h3>
                  <div className="grid sm:grid-cols-3 gap-4 mb-5">
                    {[
                      { label: 'Confidence', value: evaluation.confidence_score },
                      { label: 'Relevance', value: evaluation.relevance_score },
                      { label: 'Grammar', value: evaluation.grammar_score },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                        <p className={`text-3xl font-black ${scoreColor(value)}`}>{value}%</p>
                        <p className="text-slate-400 text-xs font-semibold mt-1">{label}</p>
                        <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full ${scoreBar(value)} rounded-full`} style={{ width: `${value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 mb-4">
                    <p className="text-blue-300 text-xs font-bold mb-1">SPEAKING IMPROVEMENT</p>
                    <p className="text-slate-300 text-sm">{evaluation.speaking_improvement}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-black px-4 py-2 rounded-xl ${
                      evaluation.hiring_recommendation === 'Strong Hire'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {evaluation.hiring_recommendation === 'Strong Hire' ? '🌟' : '👍'} {evaluation.hiring_recommendation}
                    </span>
                    <button
                      onClick={fetchQuestion}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-2 rounded-xl transition-all text-sm border border-white/10"
                    >
                      Next Question ⏭️
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        {history.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
            <h3 className="text-white font-black text-base mb-4">📝 Session History ({history.length} answered)</h3>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between">
                  <p className="text-slate-300 text-sm truncate flex-1 mr-4">{h.question}</p>
                  <span className={`text-xs font-black px-2 py-1 rounded-lg ${scoreColor(h.score)} bg-white/5`}>{h.score.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
