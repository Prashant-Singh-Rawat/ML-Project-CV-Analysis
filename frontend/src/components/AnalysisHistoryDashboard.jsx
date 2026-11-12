import React from 'react';

export default function AnalysisHistoryDashboard({ items = [] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-1">Analysis History Dashboard</h3>
      <p className="text-xs text-slate-500 mb-4">Overview of recent resume scans and metrics</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Analyses</div>
          <div className="text-xl font-black text-slate-800 mt-1">{items.length}</div>
        </div>
      </div>
    </div>
  );
}
