import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';

export default function FormPanel() {
  const { resumeData, updatePersonalInfo, design, updateDesign } = useResumeStore();

  const handleTemplateChange = (e) => updateDesign('templateId', e.target.value);
  const handleColorChange = (color) => updateDesign('themeColor', color);

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-10 flex justify-between items-center shadow-sm">
        <h2 className="text-lg font-black text-slate-900">Resume Details</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Design Settings */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Design & Layout</h3>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Template</label>
              <select 
                value={design.templateId}
                onChange={handleTemplateChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cascade">Cascade (Software Engineer)</option>
                <option value="cubic">Cubic (Data Scientist)</option>
                <option value="crisp">Crisp (Academic/Research)</option>
                <option value="aria">Aria (Healthcare)</option>
                <option value="nexus">Nexus (Creative)</option>
                <option value="apex">Apex (Executive)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Theme Color</label>
              <div className="flex items-center gap-2">
                {['#2563eb', '#10b981', '#6366f1', '#f97316', '#06b6d4', '#8b5cf6', '#0f172a'].map(color => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${design.themeColor === color ? 'border-slate-900 scale-110' : 'border-transparent hover:scale-110'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Personal Info Section */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Personal Info</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
              <input
                type="text"
                value={resumeData.personalInfo.firstName}
                onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
              <input
                type="text"
                value={resumeData.personalInfo.lastName}
                onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                placeholder="Doe"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
            <input
              type="text"
              value={resumeData.personalInfo.jobTitle}
              onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              placeholder="Software Engineer"
            />
          </div>
        </section>
        
        <ExperienceForm />
        <EducationForm />
        <SkillsForm />
      </div>
    </div>
  );
}
