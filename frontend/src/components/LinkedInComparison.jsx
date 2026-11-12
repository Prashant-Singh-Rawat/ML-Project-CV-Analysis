import React, { useState } from 'react';
import api from '../services/api';

export default function LinkedInComparison({ cvText }) {
  const [linkedinText, setLinkedinText] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async () => {
    if (!cvText) {
      setError('Please provide or upload a Resume first.');
      return;
    }
    if (!linkedinText.trim()) {
      setError('Please paste your LinkedIn Profile text or PDF export text.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/features/linkedin-compare', {
        cv_text: cvText,
        linkedin_text: linkedinText,
      });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to compare LinkedIn profile.');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = data?.consistency_score >= 80 ? 'text-green-600' : data?.consistency_score >= 60 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔗</span>
            <h3 className="text-lg font-bold text-slate-800">LinkedIn Profile Reconciler</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Reconciles Resume against LinkedIn profile to eliminate cross-platform inconsistencies
          </p>
        </div>
        {data && (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
            <div className="text-right">
              <div className="text-[11px] font-semibold text-slate-500">Consistency</div>
              <div className={`text-2xl font-black ${scoreColor}`}>{data.consistency_score}%</div>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-slate-200 text-slate-700">
              {data.status}
            </span>
          </div>
        )}
      </div>

      {/* Input box */}
      {!data && (
        <div className="mt-4 space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Paste LinkedIn Profile Text or Export
          </label>
          <textarea
            rows={5}
            value={linkedinText}
            onChange={(e) => setLinkedinText(e.target.value)}
            placeholder="Paste your LinkedIn 'Save to PDF' text, headline, about summary, experience, and skills list here..."
            className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-sans"
          />
          {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
          <button
            onClick={handleCompare}
            disabled={loading}
            className="text-xs font-bold px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm flex items-center gap-2 active:scale-95"
          >
            {loading ? 'Reconciling Profiles...' : 'Reconcile Resume vs LinkedIn'}
          </button>
        </div>
      )}

      {/* Comparison Results */}
      {data && (
        <div className="mt-5 space-y-5">
          {/* Inconsistency Alerts */}
          {data.inconsistencies && data.inconsistencies.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Discrepancies Flagged ({data.total_discrepancies})
              </h4>
              {data.inconsistencies.map((inc, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                    inc.severity === 'High'
                      ? 'bg-red-50/70 border-red-200 text-red-900'
                      : inc.severity === 'Medium'
                      ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                      : 'bg-blue-50/70 border-blue-200 text-blue-900'
                  }`}
                >
                  <span className="text-base shrink-0">
                    {inc.severity === 'High' ? '🚨' : inc.severity === 'Medium' ? '⚠️' : 'ℹ️'}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 font-bold mb-0.5">
                      <span>{inc.type}</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-white/70 border">
                        {inc.severity} Priority
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{inc.message}</p>
                    <p className="text-[11px] font-semibold mt-1 opacity-90">Action: {inc.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skill Comparison Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-green-50/60 rounded-xl border border-green-200 text-xs">
              <div className="font-bold text-green-800 mb-2 flex items-center justify-between">
                <span>Matched Skills</span>
                <span className="text-[10px] px-1.5 rounded bg-green-200/80">{data.matched_skills.length}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {data.matched_skills.map((s, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-white text-green-800 border border-green-200 font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs">
              <div className="font-bold text-blue-800 mb-2 flex items-center justify-between">
                <span>Only in Resume</span>
                <span className="text-[10px] px-1.5 rounded bg-blue-200/80">{data.only_in_resume.length}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {data.only_in_resume.map((s, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-white text-blue-800 border border-blue-200 font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs">
              <div className="font-bold text-amber-800 mb-2 flex items-center justify-between">
                <span>Only on LinkedIn</span>
                <span className="text-[10px] px-1.5 rounded bg-amber-200/80">{data.only_in_linkedin.length}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {data.only_in_linkedin.map((s, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-white text-amber-800 border border-amber-200 font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Reset / Re-run */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setData(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              ← Compare another profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

