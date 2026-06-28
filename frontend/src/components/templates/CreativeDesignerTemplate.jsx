import React from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLinkedin, FiGlobe, FiLayers } from 'react-icons/fi';

export default function CreativeDesignerTemplate({ data, color, photoEnabled }) {
  const accentColor = color || '#ec4899';
  const experiences = data.experience || [];
  const skills = data.skills || [];
  const education = data.education || [];

  return (
    <div className="w-full bg-white p-6 sm:p-8 relative min-h-[700px] shadow-sm rounded-2xl" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      {/* Premium Badge */}
      <div className="absolute top-4 right-4 z-20 print:hidden">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase text-white shadow-md bg-gradient-to-r from-pink-500 to-rose-600">
          <FiLayers size={11} /> Modern
        </span>
      </div>

      {/* Asymmetrical Creative Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 items-start justify-between">
        <div className="flex gap-4 items-center">
          {photoEnabled && (
            <div 
              className="w-18 h-18 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden rotate-3 hover:rotate-0 transition duration-300 shadow-md"
              style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #06b6d4 100%)`, padding: '3px' }}
            >
              <div className="w-full h-full bg-white rounded-[13px] overflow-hidden flex items-center justify-center">
                {data.photoUrl ? (
                  <img src={data.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <FiUser size={30} style={{ color: accentColor }} />
                )}
              </div>
            </div>
          )}
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800 uppercase">
              {data.name || 'Your Name'}
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="h-1.5 w-1.5 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
              <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">
                {data.profession || 'Creative / Visual Designer'}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Colorful Contact Details Badge */}
        <div className="p-4 rounded-2xl border text-xs text-slate-600 space-y-1.5 w-full md:w-auto shadow-sm" style={{ borderColor: `${accentColor}25`, backgroundColor: `${accentColor}04` }}>
          {data.email && <span className="flex items-center gap-2"><FiMail size={12} style={{ color: accentColor }} /> {data.email}</span>}
          {data.phone && <span className="flex items-center gap-2"><FiPhone size={12} style={{ color: accentColor }} /> {data.phone}</span>}
          {data.location && <span className="flex items-center gap-2"><FiMapPin size={12} style={{ color: accentColor }} /> {data.location}</span>}
          {data.linkedin && <span className="flex items-center gap-2"><FiLinkedin size={12} style={{ color: accentColor }} /> LinkedIn</span>}
          {data.website && <span className="flex items-center gap-2"><FiGlobe size={12} style={{ color: accentColor }} /> {data.website}</span>}
        </div>
      </div>

      {data.summary && (
        <div className="mb-8 p-5 rounded-2xl border border-dashed text-slate-600 text-xs leading-relaxed bg-slate-50/50 hover:bg-slate-50 transition" style={{ borderColor: `${accentColor}40` }}>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: accentColor }}>
            Profile
          </h2>
          <p className="font-medium text-slate-600">{data.summary}</p>
        </div>
      )}

      {/* Main Creative Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left column (4/12 width) */}
        <div className="md:col-span-4 space-y-6">
          {/* Design Skills */}
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 py-1.5 px-3 rounded-lg text-white inline-block shadow-sm" style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #06b6d4 100%)` }}>
              Design Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.length > 0 ? (
                skills.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg border bg-white hover:shadow transition duration-200 hover:-translate-y-0.5"
                    style={{ borderColor: `${accentColor}20`, color: '#334155' }}
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 text-xs italic">No skills added</span>
              )}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 py-1.5 px-3 rounded-lg text-white inline-block shadow-sm" style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #06b6d4 100%)` }}>
              Education
            </h2>
            <div className="space-y-4">
              {education.length > 0 ? (
                education.map((edu, idx) => (
                  <div key={idx} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-1 text-xs hover:scale-[1.02] transition duration-200">
                    <h4 className="font-extrabold text-slate-800 leading-tight">
                      {edu.degree || 'Degree'}{edu.field ? ` in ${edu.field}` : ''}
                    </h4>
                    <p className="text-slate-500 text-[11px] font-semibold">{edu.school || 'Design Academy'}</p>
                    <p className="text-slate-400 text-[10px] font-mono">{edu.date || 'Year'}</p>
                  </div>
                ))
              ) : (
                <span className="text-slate-400 text-xs italic">No education added</span>
              )}
            </div>
          </div>
        </div>

        {/* Right column (8/12 width) */}
        <div className="md:col-span-8 space-y-6">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 py-1.5 px-3 rounded-lg text-white inline-block shadow-sm" style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #06b6d4 100%)` }}>
              Portfolio Experience
            </h2>
            <div className="space-y-4">
              {experiences.length > 0 ? (
                experiences.map((exp, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow transition duration-200 space-y-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                      <div>
                        <h3 className="font-extrabold text-slate-800 text-sm leading-snug">{exp.role || 'Design Position'}</h3>
                        <p className="text-slate-500 text-xs font-semibold mt-0.5">{exp.company || 'Design Agency'}</p>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-100 whitespace-nowrap">
                        {exp.startDate || 'Start'} – {exp.endDate || 'Present'}
                      </span>
                    </div>
                    {exp.desc && (
                      <p className="text-slate-600 text-xs mt-2.5 leading-relaxed whitespace-pre-line border-t border-slate-50 pt-2.5">
                        {exp.desc}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-slate-400 text-xs italic">No experience added</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}