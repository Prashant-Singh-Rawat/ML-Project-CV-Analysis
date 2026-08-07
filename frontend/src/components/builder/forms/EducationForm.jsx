import React, { useState } from 'react';
import { useResumeStore } from '../../../store/resumeStore';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function EducationForm() {
  const { resumeData, addArrayItem, updateArrayItem, removeArrayItem } = useResumeStore();
  const [expandedId, setExpandedId] = useState(null);

  const handleAdd = () => {
    addArrayItem('education', {
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: '',
    });
  };

  return (
    <div className="space-y-4 mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Education</h3>
        <button 
          onClick={handleAdd}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-md flex items-center gap-1"
        >
          <FiPlus /> Add
        </button>
      </div>

      <div className="space-y-3">
        {resumeData.education.map((edu, index) => {
          const isExpanded = expandedId === edu.id;
          
          return (
            <div key={edu.id} className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all shadow-sm hover:shadow-md">
              <div 
                className="px-4 py-3 cursor-pointer flex items-center justify-between bg-slate-50 border-b border-transparent hover:bg-slate-100 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : edu.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {edu.degree || '(Not specified)'} {edu.field && `in ${edu.field}`}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {edu.school || 'School/University'}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <button onClick={(e) => { e.stopPropagation(); removeArrayItem('education', edu.id); }} className="p-1.5 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                    <FiTrash2 size={14} />
                  </button>
                  {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                </div>
              </div>

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
                          <label className="block text-xs font-semibold text-slate-700 mb-1">School / University</label>
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => updateArrayItem('education', edu.id, 'school', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateArrayItem('education', edu.id, 'degree', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Field of Study</label>
                          <input
                            type="text"
                            value={edu.field}
                            onChange={(e) => updateArrayItem('education', edu.id, 'field', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Start / End Date</label>
                          <input
                            type="text"
                            value={edu.endDate}
                            onChange={(e) => updateArrayItem('education', edu.id, 'endDate', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            placeholder="2018 - 2022"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        {resumeData.education.length === 0 && (
          <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl">
            <button 
              onClick={handleAdd}
              className="px-4 py-2 bg-white border border-slate-200 hover:border-blue-500 text-blue-600 font-bold text-sm rounded-lg transition-colors shadow-sm"
            >
              + Add Education
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
