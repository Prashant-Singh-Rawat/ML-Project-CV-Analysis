import React from 'react';

export default function ResumeImprovementTracker({ history = [] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-1">Resume Improvement Progress Tracker</h3>
      <p className="text-xs text-slate-500 mb-4">Track ATS score progression across iterations</p>
      
      <div className="space-y-3">
        {history.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Save multiple versions to track your progress timeline.</p>
        ) : (
          history.map((ver, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800">Version {idx + 1}</span>
                <span className="text-slate-400 ml-2">{ver.date}</span>
              </div>
              <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">Score: {ver.score}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
