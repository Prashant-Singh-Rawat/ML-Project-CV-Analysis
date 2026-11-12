import React from 'react';

export default function ResumeReviewTimeline({ reviews = [] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-1">Resume Review History Timeline</h3>
      <p className="text-xs text-slate-500 mb-4">Chronological record of resume evaluations</p>
      <div className="border-l-2 border-blue-500/30 pl-4 ml-2 space-y-4 text-xs">
        {reviews.length === 0 ? (
          <p className="text-slate-400 italic">Timeline initializes automatically on each scan.</p>
        ) : (
          reviews.map((r, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600" />
              <div className="font-bold text-slate-800">{r.title || 'Resume Review'}</div>
              <div className="text-slate-400 text-[11px]">{r.date}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
