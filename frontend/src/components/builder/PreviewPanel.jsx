import React, { useRef } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import SoftwareEngineerTemplate from '../templates/SoftwareEngineerTemplate';
import DataScientistTemplate from '../templates/DataScientistTemplate';
import AcademicResearchTemplate from '../templates/AcademicResearchTemplate';
import HealthcareProfessionalTemplate from '../templates/HealthcareProfessionalTemplate';
import BusinessExecutiveTemplate from '../templates/BusinessExecutiveTemplate';
import CreativeDesignerTemplate from '../templates/CreativeDesignerTemplate';
import html2pdf from 'html2pdf.js';

const TEMPLATES = {
  cascade: SoftwareEngineerTemplate,
  cubic: DataScientistTemplate,
  crisp: AcademicResearchTemplate,
  aria: HealthcareProfessionalTemplate,
  nexus: CreativeDesignerTemplate,
  apex: BusinessExecutiveTemplate,
};

export default function PreviewPanel() {
  const { resumeData, design } = useResumeStore();
  const resumeRef = useRef(null);

  const handleDownloadPdf = () => {
    if (!resumeRef.current) return;
    const opt = {
      margin:       0,
      filename:     `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(resumeRef.current).save();
  };

  // Adapter to match existing template schemas
  const adapterData = {
    name: `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}`.trim(),
    profession: resumeData.personalInfo.jobTitle,
    email: resumeData.personalInfo.email,
    phone: resumeData.personalInfo.phone,
    location: resumeData.personalInfo.location,
    linkedin: resumeData.personalInfo.linkedin,
    website: resumeData.personalInfo.website,
    summary: resumeData.personalInfo.summary,
    photoUrl: resumeData.personalInfo.photoUrl,
    experience: resumeData.experience.map(exp => ({
      role: exp.role,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.current ? 'Present' : exp.endDate,
      desc: exp.description
    })),
    education: resumeData.education.map(edu => ({
      degree: edu.degree,
      field: edu.field,
      school: edu.school,
      endDate: edu.endDate
    })),
    skills: [
      ...resumeData.skills.technical,
      ...resumeData.skills.soft,
      ...resumeData.skills.languages,
      ...resumeData.skills.tools
    ]
  };

  const SelectedTemplate = TEMPLATES[design.templateId] || SoftwareEngineerTemplate;

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-10 flex justify-between items-center shadow-sm">
        <h2 className="text-lg font-black text-slate-900">Live Preview</h2>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors">
            Zoom: 100%
          </button>
          <button 
            onClick={handleDownloadPdf}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md shadow-blue-500/20 transition-all"
          >
            Download PDF
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-100 flex justify-center">
        {/* A4 Paper Mockup Wrapper */}
        <div className="w-[850px] bg-white shadow-2xl transition-all origin-top scale-90 sm:scale-100">
          <div ref={resumeRef} className="w-[850px] min-h-[1100px]">
            <SelectedTemplate 
              data={adapterData} 
              color={design.themeColor} 
              photoEnabled={true} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
