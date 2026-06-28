import React from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLinkedin, FiGlobe, FiTerminal, FiBriefcase, FiBookOpen, FiStar } from 'react-icons/fi';

export default function SoftwareEngineerTemplate({ data, color, photoEnabled }) {
  const accentColor = color || '#2563eb';
  const experiences = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];

  const hasSkills = skills.length > 0;
  const hasEducation = education.length > 0;
  const hasExperience = experiences.length > 0;
  const hasSummary = !!data.summary;

  return (
    <div className="w-full bg-white p-6 sm:p-8 relative min-h-[700px] shadow-sm rounded-2xl" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Premium Badge */}
      <div className="absolute top-4 right-4 z-20 print:hidden">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase text-white shadow-md bg-gradient-to-r from-blue-600 to-indigo-600">
          <FiStar size={10} /> ATS Optimized
        </span>
      </div>

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-start gap-4">
          {photoEnabled && (
            <div 
              className="w-18 h-18 rounded-2xl bg-slate-50 border-2 flex items-center justify-center shrink-0 overflow-hidden shadow-sm" 
              style={{ borderColor: accentColor }}
            >
              {data.photoUrl ? (
                <img src={data.photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FiUser size={32} style={{ color: accentColor }} />
              )}
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-none">
              {data.name || 'Your Name'}
            </h1>
            <p className="text-sm font-bold mt-2 flex items-center gap-2" style={{ color: accentColor }}>
              <FiTerminal size={14} /> {data.profession || 'Software Engineer'}
            </p>
            {hasSummary && (
              <p className="text-slate-600 text-xs mt-3 leading-relaxed max-w-xl font-medium">
                {data.summary}
              </p>
            )}
          </div>
        </div>

        {/* Contact Links */}
        <div className="flex flex-wrap md:flex-col gap-2 text-xs text-slate-500 w-full md:w-auto mt-2 md:mt-0 md:items-end">
          {data.email && (
            <a href={`mailto:${data.email}`} className="flex items-center gap-1.5 hover:text-slate-800 transition">
              <FiMail size={12} style={{ color: accentColor }} /> {data.email}
            </a>
          )}
          {data.phone && (
            <span className="flex items-center gap-1.5">
              <FiPhone size={12} style={{ color: accentColor }} /> {data.phone}
            </span>
          )}
          {data.location && (
            <span className="flex items-center gap-1.5">
              <FiMapPin size={12} style={{ color: accentColor }} /> {data.location}
            </span>
          )}
          {data.linkedin && (
            <span className="flex items-center gap-1.5">
              <FiLinkedin size={12} style={{ color: accentColor }} /> {data.linkedin}
            </span>
          )}
          {data.website && (
            <span className="flex items-center gap-1.5">
              <FiGlobe size={12} style={{ color: accentColor }} /> {data.website}
            </span>
          )}
        </div>
      </div>

      {/* Two Column Content - Only make two columns if there is sidebar content */}
      <div className={`grid grid-cols-1 ${hasSkills || hasEducation ? 'md:grid-cols-12' : 'md:grid-cols-1'} gap-6 mt-6`}>
        
        {/* Left Side: Skills & Education */}
        {(hasSkills || hasEducation) && (
          <div className="md:col-span-4 space-y-6 md:border-r md:border-slate-100 md:pr-6">
            {/* Skills Sidebar */}
            {hasSkills && (
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                <h2 className="text-[11px] font-black uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: accentColor }}>
                  <FiTerminal size={13} /> Technical Stack
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 rounded-md text-[11px] font-bold border transition hover:scale-105"
                      style={{ 
                        backgroundColor: `${accentColor}08`, 
                        borderColor: `${accentColor}20`, 
                        color: accentColor 
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education Card */}
            {hasEducation && (
              <div>
                <h2 className="text-[11px] font-black uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: accentColor }}>
                  <FiBookOpen size={13} /> Education
                </h2>
                <div className="space-y-4">
                  {education.map((edu, idx) => (
                    <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm space-y-1">
                      <h3 className="font-extrabold text-slate-800 text-xs leading-tight">
                        {edu.degree || 'Degree'}{edu.field ? ` in ${edu.field}` : ''}
                      </h3>
                      <p className="text-slate-500 text-[11px] font-semibold">{edu.school || 'University'}</p>
                      <p className="text-slate-400 text-[10px] font-mono">{edu.date || 'Year'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Side: Timeline Cards of Experience */}
        {hasExperience && (
          <div className={`${hasSkills || hasEducation ? 'md:col-span-8' : 'md:col-span-1'} space-y-6`}>
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-wider mb-4 flex items-center gap-1.5" style={{ color: accentColor }}>
                <FiBriefcase size={13} /> Work History
              </h2>
              <div className="space-y-4 relative pl-3 border-l-2" style={{ borderColor: `${accentColor}20` }}>
                {experiences.map((exp, idx) => (
                  <div key={idx} className="relative bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                    {/* Circle timeline dot */}
                    <div 
                      className="absolute -left-[19px] top-5 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: accentColor }}
                    />
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm leading-snug">{exp.role || 'Role'}</h3>
                        <p className="text-slate-500 text-xs font-semibold mt-0.5">{exp.company || 'Company'}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-100 whitespace-nowrap">
                        {exp.startDate || 'Start'} – {exp.endDate || 'Present'}
                      </span>
                    </div>
                    {exp.desc && (
                      <p className="text-slate-600 text-xs mt-3 leading-relaxed whitespace-pre-line border-t border-slate-50 pt-2.5">
                        {exp.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}