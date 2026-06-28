import React from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLinkedin, FiGlobe, FiAward, FiActivity, FiShield } from 'react-icons/fi';

export default function HealthcareProfessionalTemplate({ data, color, photoEnabled }) {
  const accentColor = color || '#059669';
  const experiences = data.experience || [];
  const skills = data.skills || [];
  const education = data.education || [];

  // Parse certifications from skills or show placeholder
  const certifications = skills.filter(s => 
    s.toLowerCase().includes('cert') || 
    s.toLowerCase().includes('license') || 
    s.toLowerCase().includes('bls') || 
    s.toLowerCase().includes('acls') ||
    s.toLowerCase().includes('cpr') ||
    s.toLowerCase().includes('gmc') ||
    s.toLowerCase().includes('registered') ||
    s.toLowerCase().includes('board')
  );

  return (
    <div className="w-full bg-white p-6 sm:p-8 relative min-h-[700px] shadow-sm rounded-2xl" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Premium Badge */}
      <div className="absolute top-4 right-4 z-20 print:hidden">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase text-white shadow-md bg-gradient-to-r from-emerald-600 to-teal-600">
          <FiActivity size={11} /> Healthcare
        </span>
      </div>

      {/* Hospital-style Header with Green Accent Bar */}
      <div className="border-l-4 pl-4 py-2 mb-6" style={{ borderColor: accentColor }}>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-4">
            {photoEnabled && (
              <div className="w-16 h-16 rounded-full bg-slate-50 border flex items-center justify-center shrink-0 overflow-hidden" style={{ borderColor: `${accentColor}40` }}>
                {data.photoUrl ? (
                  <img src={data.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <FiUser size={30} style={{ color: accentColor }} />
                )}
              </div>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
                {data.name || 'Your Name'}
              </h1>
              <p className="text-sm font-bold mt-1 uppercase tracking-wider flex items-center gap-1.5" style={{ color: accentColor }}>
                <FiActivity size={14} /> {data.profession || 'Healthcare Professional'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500 w-full sm:w-auto">
            {data.email && <span className="flex items-center gap-1.5"><FiMail size={12} style={{ color: accentColor }} /> {data.email}</span>}
            {data.phone && <span className="flex items-center gap-1.5"><FiPhone size={12} style={{ color: accentColor }} /> {data.phone}</span>}
            {data.location && <span className="flex items-center gap-1.5"><FiMapPin size={12} style={{ color: accentColor }} /> {data.location}</span>}
            {data.linkedin && <span className="flex items-center gap-1.5"><FiLinkedin size={12} style={{ color: accentColor }} /> LinkedIn</span>}
            {data.website && <span className="flex items-center gap-1.5"><FiGlobe size={12} style={{ color: accentColor }} /> {data.website}</span>}
          </div>
        </div>
      </div>

      {data.summary && (
        <div className="mb-6 p-4 rounded-xl border-l-2 bg-emerald-50/20" style={{ borderColor: accentColor }}>
          <p className="text-slate-600 text-xs leading-relaxed font-medium">{data.summary}</p>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Clinical Experience (2/3 width) */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-wider mb-4 pb-1 border-b flex items-center gap-1.5" style={{ color: accentColor, borderColor: `${accentColor}30` }}>
              <FiActivity size={13} /> Clinical Experience
            </h2>
            <div className="space-y-4">
              {experiences.length > 0 ? (
                experiences.map((exp, idx) => (
                  <div key={idx} className="bg-slate-50/30 p-4 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-snug">{exp.role || 'Clinical Role'}</h3>
                        <p className="text-slate-500 text-xs font-semibold">{exp.company || 'Facility / Hospital'}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-100 whitespace-nowrap">
                        {exp.startDate || 'Start'} – {exp.endDate || 'Present'}
                      </span>
                    </div>
                    {exp.desc && (
                      <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line border-t border-slate-100/50 pt-2">
                        {exp.desc}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-slate-400 text-xs italic">No clinical experience added</span>
              )}
            </div>
          </div>
        </div>

        {/* Certifications, Clinical Skills & Education (1/3 width) */}
        <div className="space-y-6 md:col-span-1">
          {/* Licenses & Certifications Card */}
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <h2 className="text-[11px] font-black uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: accentColor }}>
              <FiAward size={13} /> Licenses & Certs
            </h2>
            <div className="space-y-2">
              {certifications.length > 0 ? (
                certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <FiShield size={12} style={{ color: accentColor }} />
                    <span className="font-bold">{cert}</span>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-xs italic p-1.5 rounded border border-dashed border-slate-200 bg-white text-center">
                  No certifications added
                </div>
              )}
            </div>
          </div>

          {/* Clinical Skills */}
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: accentColor, borderColor: `${accentColor}30` }}>
              Clinical Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.length > 0 ? (
                skills.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-slate-700 text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 text-xs italic">No clinical skills added</span>
              )}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: accentColor, borderColor: `${accentColor}30` }}>
              Education
            </h2>
            <div className="space-y-3">
              {education.length > 0 ? (
                education.map((edu, idx) => (
                  <div key={idx} className="space-y-0.5 text-xs">
                    <h4 className="font-extrabold text-slate-800 leading-tight">
                      {edu.degree || 'Degree'}{edu.field ? ` in ${edu.field}` : ''}
                    </h4>
                    <p className="text-slate-500 text-[11px] font-semibold">{edu.school || 'University'}</p>
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