import React, { useState } from 'react';
import { useResumeStore } from '../../../store/resumeStore';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExperienceForm() {
  const { resumeData, addArrayItem, updateArrayItem, removeArrayItem } = useResumeStore();
  const [expandedId, setExpandedId] = useState(null);

  const handleAdd = () => {
    addArrayItem('experience', {
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Experience</h3>
        <button 
          onClick={handleAdd}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-md flex items-center gap-1"
        >
          <FiPlus /> Add
        </button>
      </div>

      <div className="space-y-3">
        {resumeData.experience.map((exp, index) => {
          const isExpanded = expandedId === exp.id;
          
          return (
            <div key={exp.id} className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all shadow-sm hover:shadow-md">
              {/* Header / Summary */}
              <div 
                className="px-4 py-3 cursor-pointer flex items-center justify-between bg-slate-50 border-b border-transparent hover:bg-slate-100 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : exp.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {exp.role || '(Not specified)'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {exp.company || 'Company'} {exp.startDate && `• ${exp.startDate}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <button onClick={(e) => { e.stopPropagation(); removeArrayItem('experience', exp.id); }} className="p-1.5 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                    <FiTrash2 size={14} />
                  </button>
                  {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                </div>
              </div>

              {/* Expanded Form */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-200"
                  >
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => updateArrayItem('experience', exp.id, 'role', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            placeholder="Senior Engineer"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateArrayItem('experience', exp.id, 'company', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            placeholder="Google"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => updateArrayItem('experience', exp.id, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            placeholder="Jan 2020"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                          <input
                            type="text"
                            value={exp.endDate}
                            onChange={(e) => updateArrayItem('experience', exp.id, 'endDate', e.target.value)}
                            disabled={exp.current}
                            className={`w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white ${exp.current ? 'opacity-50 cursor-not-allowed' : ''}`}
                            placeholder="Present"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id={`current-${exp.id}`}
                          checked={exp.current}
                          onChange={(e) => updateArrayItem('experience', exp.id, 'current', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`current-${exp.id}`} className="text-sm font-medium text-slate-700 cursor-pointer">I currently work here</label>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-semibold text-slate-700">Description</label>
                          <button className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-amber-100 transition-colors">
                            <FiZap /> AI Rewrite
                          </button>
                        </div>
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateArrayItem('experience', exp.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white custom-scrollbar"
                          rows={4}
                          placeholder="• Led a team of 5 engineers...&#10;• Reduced load times by 40%..."
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        {resumeData.experience.length === 0 && (
          <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-sm text-slate-500 mb-3">Highlight your professional history</p>
            <button 
              onClick={handleAdd}
              className="px-4 py-2 bg-white border border-slate-200 hover:border-blue-500 text-blue-600 font-bold text-sm rounded-lg transition-colors shadow-sm"
            >
              + Add Experience
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
