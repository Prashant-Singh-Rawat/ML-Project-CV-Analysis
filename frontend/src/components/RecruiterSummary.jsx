import React, { useState } from 'react';

export default function RecruiterSummary({ data }) {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const { candidate_name, role, headline, top_strengths, key_metrics_highlight, elevator_pitch, formatted_copy_text } = data;

  const handleCopy = () => {
    if (formatted_copy_text) {
      navigator.clipboard.writeText(formatted_copy_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <h3 className="text-lg font-bold text-slate-800">Recruiter Executive Brief</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            AI-synthesized 30-second summary formatted for recruiter scanning and introduction pitches
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="self-start sm:self-auto text-xs font-bold px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm flex items-center gap-1.5 active:scale-95 shrink-0"
        >
          <span>{copied ? '✓ Copied to Clipboard!' : '📋 Copy Summary'}</span>
        </button>
      </div>

      {/* Headline & Role */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-100">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">{candidate_name}</span>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-semibold text-indigo-600">{role}</span>
        </div>
        <h4 className="text-base font-extrabold text-slate-900 leading-snug">{headline}</h4>
      </div>

      {/* Elevator Pitch */}
      <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Elevator Pitch</h5>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">{elevator_pitch}</p>
      </div>

      {/* Top Strengths Bullet Points */}
      {top_strengths && top_strengths.length > 0 && (
        <div className="mt-4">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Core Strengths Highlighted</h5>
          <div className="space-y-1.5">
            {top_strengths.map((str, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-800 flex items-start gap-2">
                <span className="text-blue-500 mt-0.5 font-bold">✔</span>
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quantified metrics */}
      {key_metrics_highlight && key_metrics_highlight.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Quantified Delivery Metrics</h5>
          <div className="space-y-1 text-xs text-slate-600 italic">
            {key_metrics_highlight.map((m, i) => (
              <p key={i}>📊 "{m}"</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

