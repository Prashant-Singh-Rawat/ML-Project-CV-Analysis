import React from 'react';

export default function KeywordDensity({ data }) {
  if (!data || !data.top_keywords) return null;

  const { total_words, unique_keywords, top_keywords, stuffing_warnings, missing_role_keywords, density_score, recommendations } = data;

  const scoreColor = density_score >= 80 ? 'text-green-600' : density_score >= 60 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔍</span>
            <h3 className="text-lg font-bold text-slate-800">Keyword Density & ATS Optimization</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Evaluates keyword distribution, frequency percentages, and flags repetitive keyword stuffing
          </p>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
          <div className="text-right">
            <div className="text-[11px] font-semibold text-slate-500">Density Health</div>
            <div className={`text-2xl font-black ${scoreColor}`}>{density_score}/100</div>
          </div>
          <div className="text-xs text-slate-500 border-l border-slate-200 pl-3">
            <div><strong>{total_words}</strong> words</div>
            <div><strong>{unique_keywords}</strong> terms</div>
          </div>
        </div>
      </div>

      {/* Stuffing warnings */}
      {stuffing_warnings && stuffing_warnings.length > 0 && (
        <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          <div className="font-bold flex items-center gap-1.5 mb-1">
            <span>⚠️</span> Keyword Stuffing Warning ({stuffing_warnings.length} terms exceeding 3.5% density)
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
            {stuffing_warnings.map((w, i) => (
              <li key={i}>{w.warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Top Keywords Table */}
      <div className="mt-5">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Top Keyword Distribution</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {top_keywords.slice(0, 12).map((kw, idx) => {
            const isOverused = kw.status === 'overused';
            return (
              <div key={idx} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-800 truncate">
                  <span className="text-slate-400 font-mono text-[11px]">#{idx + 1}</span>
                  <span className="truncate">{kw.keyword}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${isOverused ? 'bg-amber-500' : 'bg-blue-600'} rounded-full`}
                      style={{ width: `${Math.min(100, kw.density_pct * 25)}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] text-slate-600 font-bold">{kw.count}x ({kw.density_pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Missing Role Keywords */}
      {missing_role_keywords && missing_role_keywords.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Recommended Industry Keywords to Add</h4>
          <div className="flex flex-wrap gap-1.5">
            {missing_role_keywords.map((kw, i) => (
              <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                + {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
          {recommendations.map((rec, i) => (
            <p key={i}>• {rec}</p>
          ))}
        </div>
      )}
    </div>
  );
}

