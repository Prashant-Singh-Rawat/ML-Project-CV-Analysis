import React from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLinkedin, FiGlobe, FiDatabase, FiCpu, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';

export default function DataScientistTemplate({ data, color, photoEnabled }) {
  const accentColor = color || '#7c3aed';
  const experiences = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];

  // Categorize skills array dynamically
  const programmingKeywords = ['python', 'r', 'sql', 'c++', 'java', 'julia', 'scala', 'bash', 'git', 'coding', 'rust', 'matlab'];
  const mlKeywords = ['ml', 'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit', 'keras', 'nlp', 'ai', 'regression', 'clustering', 'neural', 'pandas', 'numpy', 'scipy', 'bert', 'llm'];
  const vizKeywords = ['tableau', 'powerbi', 'matplotlib', 'seaborn', 'd3', 'plotly', 'visualization', 'bi', 'dashboard', 'analytics'];

  const programmingSkills = [];
  const mlSkills = [];
  const vizSkills = [];
  const generalSkills = [];

  skills.forEach(s => {
    const sl = s.toLowerCase();
    if (programmingKeywords.some(kw => sl.includes(kw))) {
      programmingSkills.push(s);
    } else if (mlKeywords.some(kw => sl.includes(kw))) {
      mlSkills.push(s);
    } else if (vizKeywords.some(kw => sl.includes(kw))) {
      vizSkills.push(s);
    } else {
      generalSkills.push(s);
    }
  });

  // Calculate a mock skill strength percentage deterministically based on character codes
  const getSkillStrength = (name) => {
    if (!name) return 85;
    const codeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return 75 + (codeSum % 21); // range 75 - 95%
  };

  return (
    <div className="w-full bg-white p-6 sm:p-8 relative min-h-[700px] shadow-sm rounded-2xl" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Premium Badge */}
      <div className="absolute top-4 right-4 z-20 print:hidden">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase text-white shadow-md bg-gradient-to-r from-purple-600 to-indigo-600">
          <FiBarChart2 size={11} /> Analytics
        </span>
      </div>

      {/* Header Panel with Purple Gradient */}
      <div className="relative rounded-2xl p-6 mb-6 text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #1e1b4b 100%)` }}>
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            {photoEnabled && (
              <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center shrink-0 overflow-hidden">
                {data.photoUrl ? (
                  <img src={data.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <FiUser size={30} className="text-white/80" />
                )}
              </div>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{data.name || 'Your Name'}</h1>
              <p className="text-sm font-bold text-purple-200 mt-1">{data.profession || 'Data Scientist / AI Engineer'}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-xs text-purple-100">
            {data.email && <span className="flex items-center gap-1.5"><FiMail size={12} /> {data.email}</span>}
            {data.phone && <span className="flex items-center gap-1.5"><FiPhone size={12} /> {data.phone}</span>}
            {data.location && <span className="flex items-center gap-1.5"><FiMapPin size={12} /> {data.location}</span>}
            {data.linkedin && <span className="flex items-center gap-1.5"><FiLinkedin size={12} /> LinkedIn</span>}
            {data.website && <span className="flex items-center gap-1.5"><FiGlobe size={12} /> {data.website}</span>}
          </div>
        </div>
      </div>

      {data.summary && (
        <div className="mb-6 p-4 rounded-xl border border-purple-100/30 bg-purple-50/10">
          <p className="text-slate-600 text-xs leading-relaxed italic font-medium">{data.summary}</p>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Dynamic Grouped Skills with Progress Bars & Education */}
        <div className="space-y-6 lg:col-span-1">
          {/* Skills group panel */}
          <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/30">
            <h3 className="text-xs font-black uppercase tracking-wider mb-4 flex items-center gap-1.5" style={{ color: accentColor }}>
              <FiDatabase size={14} /> Skills Matrix
            </h3>

            {/* Programming Section */}
            {programmingSkills.length > 0 && (
              <div className="mb-4">
                <h4 className="text-[10px] font-extrabold uppercase text-slate-400 mb-2 tracking-wide">Programming & Queries</h4>
                <div className="space-y-2">
                  {programmingSkills.map((s, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex justify-between font-semibold text-slate-700 mb-1">
                        <span>{s}</span>
                        <span>{getSkillStrength(s)}%</span>
                      </div>
                      <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${getSkillStrength(s)}%`, backgroundColor: accentColor }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ML & Modeling Section */}
            {mlSkills.length > 0 && (
              <div className="mb-4">
                <h4 className="text-[10px] font-extrabold uppercase text-slate-400 mb-2 tracking-wide font-sans">ML & Modeling</h4>
                <div className="space-y-2">
                  {mlSkills.map((s, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex justify-between font-semibold text-slate-700 mb-1">
                        <span>{s}</span>
                        <span>{getSkillStrength(s)}%</span>
                      </div>
                      <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${getSkillStrength(s)}%`, backgroundColor: accentColor }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Visualization Section */}
            {vizSkills.length > 0 && (
              <div className="mb-4">
                <h4 className="text-[10px] font-extrabold uppercase text-slate-400 mb-2 tracking-wide font-sans">Data Visualization</h4>
                <div className="space-y-2">
                  {vizSkills.map((s, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex justify-between font-semibold text-slate-700 mb-1">
                        <span>{s}</span>
                        <span>{getSkillStrength(s)}%</span>
                      </div>
                      <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${getSkillStrength(s)}%`, backgroundColor: accentColor }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* General Section */}
            {generalSkills.length > 0 && (
              <div>
                <h4 className="text-[10px] font-extrabold uppercase text-slate-400 mb-2 tracking-wide font-sans">Other Competencies</h4>
                <div className="flex flex-wrap gap-1">
                  {generalSkills.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {skills.length === 0 && (
              <span className="text-slate-400 text-xs italic">No skills added</span>
            )}
          </div>

          {/* Education Highlighted */}
          <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/30">
            <h3 className="text-xs font-black uppercase tracking-wider mb-4 flex items-center gap-1.5" style={{ color: accentColor }}>
              <FiCpu size={14} /> Education
            </h3>
            <div className="space-y-4">
              {education.length > 0 ? (
                education.map((edu, idx) => (
                  <div key={idx} className="relative pl-3 border-l-2" style={{ borderColor: `${accentColor}30` }}>
                    <h4 className="font-extrabold text-slate-800 text-xs leading-tight">
                      {edu.degree || 'Degree'}{edu.field ? ` in ${edu.field}` : ''}
                    </h4>
                    <p className="text-slate-500 text-[11px] font-semibold mt-0.5">{edu.school || 'University'}</p>
                    <p className="text-slate-400 text-[10px] font-mono mt-0.5">{edu.date || 'Year'}</p>
                  </div>
                ))
              ) : (
                <span className="text-slate-400 text-xs italic">No education added</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Projects (reused Experience) */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider mb-4 pb-1 border-b flex items-center gap-1.5" style={{ color: accentColor, borderColor: `${accentColor}30` }}>
              <FiTrendingUp size={14} /> Key Data Projects
            </h3>
            <div className="space-y-4">
              {experiences.length > 0 ? (
                experiences.map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition bg-white shadow-sm hover:shadow">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-snug">{exp.role || 'Project Lead'}</h4>
                        <p className="text-slate-400 text-[10px] font-semibold mt-0.5">{exp.company || 'Enterprise'}</p>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-100 whitespace-nowrap">
                        {exp.startDate || 'Start'} – {exp.endDate || 'Present'}
                      </span>
                    </div>
                    {exp.desc && (
                      <p className="text-slate-600 text-xs mt-3 leading-relaxed whitespace-pre-line border-t border-slate-50 pt-2.5">
                        {exp.desc}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-slate-400 text-xs italic">No projects added</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}