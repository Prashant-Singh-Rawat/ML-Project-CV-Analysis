import React from 'react';
import { FiMail, FiPhone, FiMapPin, FiLinkedin, FiGlobe, FiBookOpen, FiAward, FiFileText } from 'react-icons/fi';

export default function AcademicResearchTemplate({ data, color, photoEnabled }) {
  const accentColor = color || '#0891b2';
  const experiences = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];

  return (
    <div className="w-full bg-white p-6 sm:p-10 relative min-h-[700px] shadow-sm rounded-2xl" style={{ fontFamily: "'Georgia', serif" }}>
      {/* Premium Badge */}
      <div className="absolute top-4 right-4 z-20 print:hidden">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-black tracking-wider uppercase text-white shadow-md bg-gradient-to-r from-cyan-600 to-teal-600">
          <FiAward size={11} /> Academic
        </span>
      </div>

      {/* Name and Professional Title */}
      <div className="text-center pb-6 border-b" style={{ borderColor: `${accentColor}40` }}>
        <h1 className="text-3xl font-light text-slate-900 tracking-tight">
          {data.name || 'Your Name, PhD'}
        </h1>
        <p className="text-xs uppercase tracking-widest font-bold mt-2 font-sans" style={{ color: accentColor }}>
          {data.profession || 'Academic Researcher'}
        </p>

        {/* Traditional CV Contact Layout */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-4 text-[10.5px] text-slate-500 font-sans">
          {data.email && <span className="flex items-center gap-1"><FiMail /> {data.email}</span>}
          {data.phone && <span className="flex items-center gap-1"><FiPhone /> {data.phone}</span>}
          {data.location && <span className="flex items-center gap-1"><FiMapPin /> {data.location}</span>}
          {data.linkedin && <span className="flex items-center gap-1"><FiLinkedin /> LinkedIn</span>}
          {data.website && <span className="flex items-center gap-1"><FiGlobe /> {data.website}</span>}
        </div>
      </div>

      {/* Research interests statement */}
      {data.summary && (
        <div className="my-6">
          <h2 className="text-[11px] uppercase tracking-widest font-black font-sans border-b pb-1.5 mb-3" style={{ color: accentColor, borderColor: `${accentColor}30` }}>
            Research Interests & Statement
          </h2>
          <p className="text-slate-700 text-xs leading-relaxed font-sans">
            {data.summary}
          </p>
        </div>
      )}

      {/* 1. Education FIRST */}
      <div className="mb-6">
        <h2 className="text-[11px] uppercase tracking-widest font-black font-sans border-b pb-1.5 mb-3 flex items-center gap-1.5" style={{ color: accentColor, borderColor: `${accentColor}30` }}>
          <FiBookOpen size={13} /> Education & Credentials
        </h2>
        <div className="space-y-4 font-sans text-xs">
          {education.length > 0 ? (
            education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <span className="font-extrabold text-slate-800 text-xs">{edu.degree || 'Degree'}</span>
                  {edu.field && <span> in {edu.field}</span>}
                  <div className="text-slate-500 text-[11px] mt-0.5">{edu.school || 'University Name'}</div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">{edu.date || 'Year'}</span>
              </div>
            ))
          ) : (
            <span className="text-slate-400 text-xs italic">No education added</span>
          )}
        </div>
      </div>

      {/* 2. Selected Publications / Research Experience (reuse Experience) */}
      <div className="mb-6">
        <h2 className="text-[11px] uppercase tracking-widest font-black font-sans border-b pb-1.5 mb-3 flex items-center gap-1.5" style={{ color: accentColor, borderColor: `${accentColor}30` }}>
          <FiFileText size={13} /> Selected Publications & Appointments
        </h2>
        <div className="space-y-5 font-sans">
          {experiences.length > 0 ? (
            experiences.map((exp, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-xs">{exp.role || 'Research Appointment'}</h3>
                    <p className="text-slate-500 text-[11px] mt-0.5">{exp.company || 'Institution / Conference / Journal'}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                    {exp.startDate || 'Start'} – {exp.endDate || 'Present'}
                  </span>
                </div>
                {exp.desc && (
                  <p className="text-slate-600 text-[11px] mt-2 leading-relaxed whitespace-pre-line border-l-2 pl-3" style={{ borderColor: `${accentColor}40` }}>
                    {exp.desc}
                  </p>
                )}
              </div>
            ))
          ) : (
            <span className="text-slate-400 text-xs italic">No research appointments or publications added</span>
          )}
        </div>
      </div>

      {/* 3. Research Competencies (reuses Skills) */}
      <div>
        <h2 className="text-[11px] uppercase tracking-widest font-black font-sans border-b pb-1.5 mb-3" style={{ color: accentColor, borderColor: `${accentColor}30` }}>
          Key Research Competencies
        </h2>
        <div className="flex flex-wrap gap-1.5 font-sans">
          {skills.length > 0 ? (
            skills.map((skill, idx) => (
              <span 
                key={idx} 
                className="px-2.5 py-1 border text-slate-600 rounded text-xs font-semibold"
                style={{ borderColor: `${accentColor}40` }}
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-slate-400 text-xs italic">No skills added</span>
          )}
        </div>
      </div>

    </div>
  );
}