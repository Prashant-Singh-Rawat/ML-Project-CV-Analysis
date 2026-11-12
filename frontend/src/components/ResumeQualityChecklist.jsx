import React from 'react';

export default function ResumeQualityChecklist({ data }) {
  if (!data || !data.categories) return null;

  const { overall_quality_score, total_passed, total_checks, categories, action_items } = data;

  const scoreColor = overall_quality_score >= 80 ? 'text-green-600' : overall_quality_score >= 60 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <h3 className="text-lg font-bold text-slate-800">Resume Quality Checklist Dashboard</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated quality audit across Contact, Content, Sections, and ATS formatting standards
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
          <div className="text-right">
            <div className="text-[11px] font-semibold text-slate-500">Quality Score</div>
            <div className={`text-2xl font-black ${scoreColor}`}>{overall_quality_score}%</div>
          </div>
          <div className="text-xs text-slate-500 border-l border-slate-200 pl-3">
            <div><strong>{total_passed}/{total_checks}</strong> checks</div>
            <div>passed</div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
        {categories.map((cat, idx) => (
          <div key={idx} className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-800">{cat.category}</span>
              <span className="text-[11px] font-mono font-bold text-slate-600">
                {cat.passed_count}/{cat.total_count} ({cat.score_pct}%)
              </span>
            </div>
            {/* Category bar */}
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full ${cat.score_pct >= 80 ? 'bg-green-500' : cat.score_pct >= 60 ? 'bg-amber-500' : 'bg-red-500'} rounded-full`}
                style={{ width: `${cat.score_pct}%` }}
              />
            </div>
            {/* Checks list */}
            <div className="space-y-1.5">
              {cat.checks.map((chk, i) => (
                <div key={i} className="flex items-start justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <span>{chk.passed ? '✅' : '❌'}</span>
                    <span className={`truncate ${chk.passed ? 'text-slate-700' : 'text-slate-500 line-through'}`}>{chk.item}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 italic shrink-0">{chk.tip}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Immediate action items */}
      {action_items && action_items.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Priority Quality Fixes</h4>
          <div className="space-y-2">
            {action_items.map((act, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-amber-600 font-bold">🔧 {act.action}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-800 uppercase tracking-wider">{act.category}</span>
                </div>
                <span className="text-[11px] text-amber-800 italic shrink-0">{act.tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

