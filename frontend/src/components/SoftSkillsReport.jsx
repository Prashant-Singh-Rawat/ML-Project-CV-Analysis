import React from 'react';

export default function SoftSkillsReport({ data }) {
  if (!data || !data.detected_by_category) return null;

  const {
    total_detected,
    soft_skills_score,
    categories_covered,
    total_categories,
    detected_by_category,
    missing_soft_skills,
    recommendations,
  } = data;

  const scoreColor = soft_skills_score >= 75 ? 'text-green-600' : soft_skills_score >= 50 ? 'text-blue-600' : 'text-amber-600';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🤝</span>
            <h3 className="text-lg font-bold text-slate-800">Soft Skills & Behavioral Competencies</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Detects behavioral strengths, leadership traits, and team collaboration capabilities
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
          <div className="text-right">
            <div className="text-[11px] font-semibold text-slate-500">Soft Skills Index</div>
            <div className={`text-2xl font-black ${scoreColor}`}>{soft_skills_score}/100</div>
          </div>
          <div className="text-xs text-slate-500 border-l border-slate-200 pl-3">
            <div><strong>{total_detected}</strong> detected</div>
            <div><strong>{categories_covered}/{total_categories}</strong> pillars</div>
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
        {Object.entries(detected_by_category).map(([category, items], idx) => (
          <div key={idx} className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800">{category}</h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {items.length} skills
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {items.map((it, i) => (
                <div
                  key={i}
                  title={`Context: "${it.context}"`}
                  className="group relative text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-800 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>{it.skill}</span>
                  <span className={`text-[9px] font-bold px-1 rounded ${it.confidence === 'High' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {it.confidence}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Missing soft skills */}
      {missing_soft_skills && missing_soft_skills.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Recommended Soft Skills to Showcase</h4>
          <div className="flex flex-wrap gap-1.5">
            {missing_soft_skills.map((s, i) => (
              <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                + {s}
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

