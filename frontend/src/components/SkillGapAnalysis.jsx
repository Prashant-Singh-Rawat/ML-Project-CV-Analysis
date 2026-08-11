import React, { useState } from 'react';
import { FiExternalLink, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const SkillGapAnalysis = ({ missingSkills, matchedSkills }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);

  if (!missingSkills || missingSkills.length === 0) {
    return (
      <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
        <FiCheckCircle className="text-emerald-500 text-3xl" />
        <div>
          <h4 className="text-emerald-900 font-bold text-lg">Perfect Alignment!</h4>
          <p className="text-emerald-700 text-sm mt-1">Your CV contains all the required skills for this target role. Great job!</p>
        </div>
      </div>
    );
  }

  const getLearningLink = (skill) => `https://www.coursera.org/search?query=${encodeURIComponent(skill)}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500">
            <FiAlertCircle size={20} />
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-lg">Skill Gap Analysis</h3>
            <p className="text-slate-500 text-xs font-medium mt-0.5">Automated highlighting of missing competencies</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-rose-500">{missingSkills.length}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Missing Skills</div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Based on the target role's Job Description graph, we identified the following required competencies that are currently absent from your CV. Click any skill to view recommended learning resources.
        </p>

        <div className="flex flex-wrap gap-2">
          {missingSkills.map((skill, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSkill(skill)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-200 ${
                selectedSkill === skill 
                  ? 'bg-rose-500 text-white border-rose-600 shadow-md transform scale-105' 
                  : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>

        {selectedSkill && (
          <div className="mt-8 p-5 rounded-xl border-2 border-rose-100 bg-rose-50/50 flex flex-col sm:flex-row items-center gap-5">
            <div className="flex-1">
              <h4 className="font-black text-slate-800 text-lg flex items-center gap-2">
                Bridge the Gap: <span className="text-rose-600">{selectedSkill}</span>
              </h4>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Adding {selectedSkill} to your skillset will significantly boost your ATS match score for this role.
              </p>
            </div>
            <a 
              href={getLearningLink(selectedSkill)}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-sm shadow-lg hover:bg-slate-800 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              Learn on Coursera <FiExternalLink />
            </a>
            <button onClick={() => setSelectedSkill(null)} className="text-slate-400 hover:text-slate-600">
              <FiX size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillGapAnalysis;
