import React from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLinkedin, FiGlobe, FiTarget, FiTrendingUp, FiAward } from 'react-icons/fi';

export default function BusinessExecutiveTemplate({ data, color, photoEnabled }) {
  const accentColor = color || '#f97316';
  const experiences = data.experience || [];
  const skills = data.skills || [];
  const education = data.education || [];

  return (
    <div className="w-full bg-white p-6 sm:p-9 relative min-h-[700px] shadow-sm rounded-2xl" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Premium Badge */}
      <div className="absolute top-4 right-4 z-20 print:hidden">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase text-white shadow-md bg-gradient-to-r from-orange-600 to-amber-600">
          <FiAward size={11} /> Corporate
        </span>
      </div>

      {/* Large Professional Executive Header */}
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-6 pb-6 border-b-4" style={{ borderColor: accentColor }}>
        <div className="flex items-center gap-5">
          {photoEnabled && (
            <div className="w-18 h-18 rounded-xl bg-slate-50 border-2 flex items-center justify-center shrink-0 overflow-hidden shadow-sm" style={{ borderColor: accentColor }}>
              {data.photoUrl ? (
                <img src={data.photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FiUser size={36} style={{ color: accentColor }} />
              )}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
              {data.name || 'Your Name'}
            </h1>
            <p className="text-xs uppercase tracking-[0.25em] font-black mt-2" style={{ color: accentColor }}>
              {data.profession || 'EXECUTIVE OFFICER / DIRECTOR'}
            </p>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="flex flex-wrap md:flex-col justify-start md:justify-center md:items-end gap-x-4 gap-y-1 text-[11px] text-slate-500 font-sans md:border-l md:pl-6 border-slate-100 min-w-[200px]">
          {data.email && <span className="flex items-center gap-1.5"><FiMail size={12} style={{ color: accentColor }} /> {data.email}</span>}
          {data.phone && <span className="flex items-center gap-1.5"><FiPhone size={12} style={{ color: accentColor }} /> {data.phone}</span>}
          {data.location && <span className="flex items-center gap-1.5"><FiMapPin size={12} style={{ color: accentColor }} /> {data.location}</span>}
          {data.linkedin && <span className="flex items-center gap-1.5"><FiLinkedin size={12} style={{ color: accentColor }} /> LinkedIn</span>}
          {data.website && <span className="flex items-center gap-1.5"><FiGlobe size={12} style={{ color: accentColor }} /> {data.website}</span>}
        </div>
      </div>

      {/* Leadership Executive Summary Card */}
      {data.summary && (
        <div className="my-6 p-5 rounded-2xl border bg-slate-50/50 border-slate-100 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: accentColor }} />
          <h2 className="text-xs font-black uppercase tracking-widest mb-2 font-sans" style={{ color: accentColor }}>
            Executive Summary
          </h2>
          <p className="text-slate-700 text-xs font-sans leading-relaxed">
            {data.summary}
          </p>
        </div>
      )}

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        
        {/* Leadership Experience & Achievements - 2 Columns */}
        <div className="md:col-span-2 space-y-6">
          {/* Experience */}
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-wider mb-4 pb-1 border-b flex items-center gap-1.5" style={{ color: accentColor, borderColor: `${accentColor}30` }}>
              <FiTarget size={13} /> Leadership Experience & Achievements
            </h2>
            <div className="space-y-4">
              {experiences.length > 0 ? (
                experiences.map((exp, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                      <div>
                        <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm">{exp.role || 'Executive Position'}</h3>
                        <p className="text-slate-500 text-xs font-bold mt-0.5">{exp.company || 'Enterprise'}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 whitespace-nowrap">
                        {exp.startDate || 'Start'} – {exp.endDate || 'Present'}
                      </span>
                    </div>
                    {exp.desc && (
                      <div className="text-slate-600 text-xs leading-relaxed whitespace-pre-line border-t border-slate-50 pt-2">
                        {exp.desc}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-slate-400 text-xs italic">No leadership experience added</span>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Skills & Education */}
        <div className="space-y-6 md:col-span-1">
          {/* Core Competencies (reused Skills) */}
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <h2 className="text-[11px] font-black uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: accentColor }}>
              <FiTrendingUp size={13} /> Core Competencies
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.length > 0 ? (
                skills.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:scale-105 transition"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 text-xs italic">No competencies added</span>
              )}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: accentColor, borderColor: `${accentColor}30` }}>
              Education & Credentials
            </h2>
            <div className="space-y-3">
              {education.length > 0 ? (
                education.map((edu, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm space-y-0.5 text-xs">
                    <h4 className="font-extrabold text-slate-800 leading-tight">
                      {edu.degree || 'Degree'}{edu.field ? ` in ${edu.field}` : ''}
                    </h4>
                    <p className="text-slate-500 text-[11px] font-medium">{edu.school || 'University'}</p>
                    <p className="text-slate-400 text-[10px] font-mono">{edu.date || 'Year'}</p>
                  </div>
                ))
              ) : (
                <span className="text-slate-400 text-xs italic">No education added</span>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}