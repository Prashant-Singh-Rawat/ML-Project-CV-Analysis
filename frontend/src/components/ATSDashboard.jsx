import React from 'react';

export default function ATSDashboard({ data }) {
  if (!data) return null;
  const { overall_ats_score, simulated_systems, breakdown_scores, critical_fixes } = data;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-800">ATS Simulator & Breakdown</h3>
          <p className="text-xs text-slate-500 mt-1">Multi-parser simulation across Workday, Taleo, and Greenhouse</p>
        </div>
        <div className="text-2xl font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
          {overall_ats_score}%
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        {Object.entries(simulated_systems || {}).map(([sys, score]) => (
          <div key={sys} className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
            <div className="text-xs font-semibold text-slate-500">{sys}</div>
            <div className="text-lg font-black text-slate-800 mt-1">{score}%</div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Evaluation Breakdown</h4>
        {Object.entries(breakdown_scores || {}).map(([metric, score]) => (
          <div key={metric} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
            <span className="capitalize font-medium text-slate-700">{metric.replace('_', ' ')}</span>
            <span className="font-bold text-slate-900">{score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
