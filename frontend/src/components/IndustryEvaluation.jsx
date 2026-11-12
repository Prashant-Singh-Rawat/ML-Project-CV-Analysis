import React, { useState } from 'react';
import api from '../services/api';

export default function IndustryEvaluation({ initialData, cvText }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState(initialData?.industry_key || 'tech');

  const industries = [
    { key: 'tech', label: 'Tech & Engineering', icon: '💻' },
    { key: 'data_science', label: 'Data Science & AI', icon: '🤖' },
    { key: 'finance', label: 'Finance & Banking', icon: '📈' },
    { key: 'healthcare', label: 'Healthcare & Pharma', icon: '🏥' },
    { key: 'marketing', label: 'Marketing & Growth', icon: '🚀' },
    { key: 'product', label: 'Product Management', icon: '📋' },
  ];

  const handleSelectIndustry = async (key) => {
    setSelectedIndustry(key);
    if (!cvText) return;
    setLoading(true);
    try {
      const res = await api.post('/features/industry-eval', {
        cv_text: cvText,
        industry_key: key,
      });
      setData(res.data);
    } catch {
      // keep current data
    } finally {
      setLoading(false);
    }
  };

  if (!data) return null;

  const { industry_title, fit_score, fit_tier, matched_keywords, missing_keywords, recommended_metrics, industry_tips } = data;

  const scoreColor = fit_score >= 75 ? 'text-green-600' : fit_score >= 55 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏢</span>
            <h3 className="text-lg font-bold text-slate-800">Industry-Specific Evaluation</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Evaluates domain alignment, expected industry vocabulary, and rubric priorities
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
          <div className="text-right">
            <div className="text-[11px] font-semibold text-slate-500">{fit_tier}</div>
            <div className={`text-2xl font-black ${scoreColor}`}>{fit_score}%</div>
          </div>
        </div>
      </div>

      {/* Industry Tabs */}
      <div className="flex flex-wrap gap-1.5 mt-4">
        {industries.map((ind) => (
          <button
            key={ind.key}
            onClick={() => handleSelectIndustry(ind.key)}
            disabled={loading}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedIndustry === ind.key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{ind.icon}</span>
            <span>{ind.label}</span>
          </button>
        ))}
      </div>

      {/* Target Industry Active Banner */}
      <div className="mt-4 p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="font-bold text-blue-900">{industry_title}</span>
          <p className="text-blue-700 text-[11px] mt-0.5">Key Metrics Focus: {recommended_metrics}</p>
        </div>
        <span className="text-blue-800 font-semibold text-[11px] shrink-0">
          Matched: {matched_keywords?.length || 0} terms
        </span>
      </div>

      {/* Keywords Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Matched keywords */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          <h4 className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>✅</span> Present Industry Keywords ({matched_keywords?.length || 0})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {matched_keywords && matched_keywords.length > 0 ? (
              matched_keywords.map((kw, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-green-100/70 text-green-800 border border-green-200">
                  {kw}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No specific industry terms detected yet.</span>
            )}
          </div>
        </div>

        {/* Missing keywords */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>💡</span> Missing Industry Keywords ({missing_keywords?.length || 0})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {missing_keywords && missing_keywords.length > 0 ? (
              missing_keywords.map((kw, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-amber-100/70 text-amber-800 border border-amber-200">
                  + {kw}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">Great coverage of industry terms!</span>
            )}
          </div>
        </div>
      </div>

      {/* Industry Tips */}
      {industry_tips && industry_tips.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Industry-Specific Resume Tips</h4>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {industry_tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">📌</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

