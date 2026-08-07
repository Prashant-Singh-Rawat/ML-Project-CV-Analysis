import React, { useState } from 'react';
import { useResumeStore } from '../../../store/resumeStore';
import { FiPlus, FiX } from 'react-icons/fi';

export default function SkillsForm() {
  const { resumeData, addSkill, removeSkill } = useResumeStore();
  const [inputValue, setInputValue] = useState('');
  const [activeCategory, setActiveCategory] = useState('technical');

  const categories = [
    { id: 'technical', label: 'Technical Skills' },
    { id: 'soft', label: 'Soft Skills' },
    { id: 'languages', label: 'Languages' },
    { id: 'tools', label: 'Tools & Tech' },
  ];

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    addSkill(activeCategory, inputValue.trim());
    setInputValue('');
  };

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Skills & Expertise</h3>

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${
                activeCategory === cat.id 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleAddSkill} className="flex gap-2 mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Add a ${activeCategory.replace(/s$/, '')}...`}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
          <button 
            type="submit"
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center"
          >
            <FiPlus />
          </button>
        </form>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {resumeData.skills[activeCategory].map((skill, index) => (
            <span 
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200"
            >
              {skill}
              <button 
                onClick={() => removeSkill(activeCategory, index)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <FiX size={14} />
              </button>
            </span>
          ))}
          {resumeData.skills[activeCategory].length === 0 && (
            <p className="text-sm text-slate-400 italic w-full text-center py-2">
              No skills added to this category yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
