import React from 'react';

export default function BenchmarkComparison({ data }) {
  if (!data || !data.metrics) return null;

  const { target_role, overall_percentile, percentile_label, metrics, insights } = data;

  const scoreColor = overall_percentile >= 75 ? 'text-green-600' : overall_percentile >= 50 ? 'text-blue-600' : 'text-amber-600';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h3 className="text-lg font-bold text-slate-800">Competitive Benchmark Comparison</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Benchmarks your CV against typical candidate distributions for <strong>{target_role}</strong>
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
          <div className="text-right">
            <div className="text-[11px] font-semibold text-slate-500">{percentile_label}</div>
            <div className={`text-2xl font-black ${scoreColor}`}>{overall_percentile}th <span className="text-xs text-slate-400 font-normal">%tile</span></div>
          </div>
        </div>
      </div>

      {/* Metrics Comparison Bars */}
      <div className="space-y-4 mt-5">
        {metrics.map((m, idx) => (
          <div key={idx} className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-800">{m.metric}</span>
              <div className="flex items-center gap-2 text-slate-600 font-mono text-[11px]">
                <span>You: <strong>{m.candidate_val}</strong> {m.unit}</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-400">Benchmark: {m.benchmark_val} {m.unit}</span>
              </div>
            </div>
            {/* Percentile bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                style={{ width: `${m.percentile}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
              <span>0%</span>
              <span className="font-semibold text-slate-600">{m.percentile}th percentile</span>
              <span>100%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Benchmark Insights */}
      {insights && insights.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Benchmark Insights</h4>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {insights.map((ins, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">💡</span>
                <span>{ins}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

