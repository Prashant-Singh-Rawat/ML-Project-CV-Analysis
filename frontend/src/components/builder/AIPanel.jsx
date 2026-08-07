import React from 'react';
import { FiCheckCircle, FiAlertTriangle, FiZap } from 'react-icons/fi';

export default function AIPanel() {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-10 flex justify-between items-center shadow-sm">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <FiZap className="text-amber-500" /> AI Assistant
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* ATS Score Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-700">ATS Match Score</h3>
            <span className="text-2xl font-black text-emerald-500">85<span className="text-sm text-slate-400">/100</span></span>
          </div>
          
          <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4">
            <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <FiCheckCircle className="text-emerald-500 mt-0.5 shrink-0" />
              <span>Great use of action verbs in Experience.</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <FiAlertTriangle className="text-amber-500 mt-0.5 shrink-0" />
              <span>Missing "Cloud Computing" keyword for this role.</span>
            </div>
          </div>
        </div>
        
        {/* Chat / Suggestions area */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Smart Suggestions</h3>
          <button className="w-full text-left p-3 rounded-lg border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 transition-colors mb-3">
            <p className="text-sm font-semibold text-indigo-700">Generate Professional Summary</p>
            <p className="text-xs text-indigo-500 mt-1">Let AI write a strong opening based on your experience.</p>
          </button>
          
          <button className="w-full text-left p-3 rounded-lg border border-amber-100 bg-amber-50 hover:bg-amber-100 transition-colors">
            <p className="text-sm font-semibold text-amber-700">Suggest Job Titles</p>
            <p className="text-xs text-amber-500 mt-1">Discover titles that match your skill level and industry.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
