import React from 'react';

export default function ResumeActionPlan({ steps = [] }) {
  const defaultSteps = steps.length ? steps : [
    { step: 1, title: 'Inject High-Impact Metrics', desc: 'Add quantifiable outcomes to your latest project.' },
    { step: 2, title: 'Align Core Skills with Target Role', desc: 'Ensure Python, React, or Docker appear in experience bullets.' },
    { step: 3, title: 'Optimize Header Structure', desc: 'Ensure standard headers (Experience, Education, Skills) are present.' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-1">AI-Powered Resume Action Plan</h3>
      <p className="text-xs text-slate-500 mb-4">Prioritized step-by-step roadmap to maximize interview callbacks</p>
      <div className="space-y-2.5">
        {defaultSteps.map((s, idx) => (
          <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3 text-xs">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {idx + 1}
            </span>
            <div>
              <div className="font-bold text-slate-800">{s.title}</div>
              <p className="text-slate-500 mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
