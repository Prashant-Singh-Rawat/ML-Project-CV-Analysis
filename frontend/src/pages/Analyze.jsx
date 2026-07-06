import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import InputForm from '../components/InputForm';
import {
  FiUploadCloud, FiEdit3, FiArrowRight, FiArrowLeft, FiX,
  FiUser, FiUsers, FiStar, FiCheck, FiChevronRight, FiBriefcase,
  FiAward, FiHeart, FiFileText, FiCamera, FiPlus, FiTrash2, FiMaximize2
} from 'react-icons/fi';
import html2pdf from 'html2pdf.js';
import SoftwareEngineerTemplate from '../components/templates/SoftwareEngineerTemplate';
import DataScientistTemplate from '../components/templates/DataScientistTemplate';
import AcademicResearchTemplate from '../components/templates/AcademicResearchTemplate';
import HealthcareProfessionalTemplate from '../components/templates/HealthcareProfessionalTemplate';
import BusinessExecutiveTemplate from '../components/templates/BusinessExecutiveTemplate';
import CreativeDesignerTemplate from '../components/templates/CreativeDesignerTemplate';



const FALLBACK_COMPANIES = [
  'Google', 'Amazon', 'Microsoft', 'Meta', 'Apple',
  'Netflix', 'Infosys', 'TCS', 'Oracle', 'IBM', 'Adobe',
];

const TEMPLATE_COLORS = [
  { name: 'Blue',       value: '#2563eb' },
  { name: 'Green',      value: '#10b981' },
  { name: 'Teal',       value: '#06b6d4' },
  { name: 'Purple',     value: '#8b5cf6' },
  { name: 'Slate',      value: '#334155' },
  { name: 'Orange',     value: '#f97316' },
];

/* ─────────────────────────────────────────────
   3-D SCANNER ANIMATION COMPONENT
───────────────────────────────────────────── */
function ResumeGraderScanner() {
  const [statusText, setStatusText] = useState('Initializing scan…');
  const [activeLight, setActiveLight] = useState(0);

  useEffect(() => {
    const steps = [
      { t: 0,    text: 'Uploading document format…',                              light: 0 },
      { t: 1500, text: 'Extracting text & scanning PDF entities…',                light: 1 },
      { t: 3000, text: 'Matching keywords & computing BERT similarity vectors…',  light: 2 },
      { t: 4500, text: 'Generating AI recommendations & hiring scoring matrix…',  light: 3 },
      { t: 6000, text: 'Finalising report generation…',                           light: 3 },
    ];
    const timers = steps.map(s => setTimeout(() => { setStatusText(s.text); setActiveLight(s.light); }, s.t));
    return () => timers.forEach(clearTimeout);
  }, []);

  const lights = [
    { label: 'PDF Parse',    color: '#6366f1' },
    { label: 'NLP Scan',     color: '#06b6d4' },
    { label: 'AI Match',     color: '#10b981' },
    { label: 'Score Build',  color: '#f59e0b' },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 max-w-4xl mx-auto w-full">
      <div className="w-full flex flex-col md:flex-row items-stretch justify-center gap-8 mb-8">

        {/* LEFT: Grader Console */}
        <div className="w-full md:w-64 bg-gradient-to-b from-slate-900 to-indigo-950 text-white rounded-3xl p-6 border border-slate-700/50 shadow-2xl flex flex-col justify-between items-center select-none relative overflow-hidden" style={{ minHeight: 360 }}>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />

          <div className="text-center w-full">
            <h4 className="font-black text-xs tracking-[0.25em] text-indigo-400 uppercase font-mono mb-1">Resume Grader</h4>
            <div className="h-0.5 bg-indigo-500/20 w-3/4 mx-auto rounded" />
          </div>

          {/* Gauge */}
          <div className="relative w-40 h-20 overflow-hidden flex items-end justify-center mt-6">
            <div className="absolute inset-0 border-t-8 border-l-8 border-r-8 border-indigo-500/10 rounded-t-full" />
            <div className="absolute inset-0 border-t-8 border-l-8 border-r-8 rounded-t-full" style={{
              backgroundImage: 'conic-gradient(from 180deg, #ef4444 0%, #f59e0b 25%, #10b981 50%)',
              clipPath: 'polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%)',
              maskImage: 'linear-gradient(to top, transparent 10%, black 10%)',
            }} />
            <motion.div
              className="absolute bottom-0 left-1/2 w-1 bg-white rounded-full origin-bottom shadow-lg"
              style={{ height: 52, marginLeft: -2 }}
              animate={{ rotate: ['-80deg', '0deg', '60deg', '-40deg', '70deg'] }}
              transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            />
            <div className="absolute bottom-0 left-1/2 w-4 h-4 rounded-full bg-white border-2 border-indigo-500 shadow-lg" style={{ marginLeft: -8, marginBottom: -8 }} />
          </div>

          {/* Score */}
          <motion.div
            className="text-5xl font-black text-white mt-2 tabular-nums"
            animate={{ opacity: [0.6, 1], scale: [0.97, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse' }}
          >
            82
          </motion.div>
          <div className="text-indigo-300 text-xs font-semibold tracking-widest uppercase">/ 100  ATS Score</div>

          {/* Stage lights */}
          <div className="w-full mt-4 space-y-2">
            {lights.map((l, i) => (
              <div key={l.label} className="flex items-center gap-2">
                <motion.div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: l.color }}
                  animate={activeLight >= i ? { opacity: [0.4, 1], scale: [0.8, 1.2, 1] } : { opacity: 0.2 }}
                  transition={{ duration: 0.6 }}
                />
                <span className="text-[10px] font-mono text-slate-400">{l.label}</span>
                {activeLight >= i && (
                  <motion.div
                    className="ml-auto text-[9px] font-mono text-green-400"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  >
                    OK
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CENTER: Document */}
        <div className="flex-1 relative flex flex-col items-center justify-center" style={{ minHeight: 360 }}>
          <div className="relative w-48 h-64 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden select-none flex flex-col p-4 gap-2">
            {/* Scan line */}
            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent z-20 shadow-lg"
              animate={{ top: ['5%', '95%', '5%'] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="h-2 w-24 bg-slate-800 rounded mb-1" />
            <div className="h-1.5 w-16 bg-slate-300 rounded" />
            {[28, 20, 24, 18, 22, 16, 20, 14, 18, 22].map((w, i) => (
              <motion.div
                key={i}
                className="h-1.5 rounded"
                style={{ width: `${w * 3}px`, backgroundColor: i % 3 === 0 ? '#2563eb22' : '#94a3b822' }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
              />
            ))}
            <div className="absolute bottom-3 right-3 bg-green-400 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">AI</div>
          </div>
          <div className="mt-4 text-xs text-slate-500 font-mono text-center px-4 max-w-xs">{statusText}</div>
        </div>

        {/* RIGHT: Stats */}
        <div className="w-full md:w-56 bg-gradient-to-b from-white to-blue-50 rounded-3xl p-5 border border-blue-100 shadow-xl flex flex-col gap-3 select-none">
          <h4 className="font-black text-xs tracking-[0.2em] text-blue-700 uppercase font-mono">AI Insights</h4>
          {[
            { label: 'Keyword Match',   val: 78, color: '#2563eb' },
            { label: 'Format Score',    val: 91, color: '#10b981' },
            { label: 'Impact Phrases',  val: 65, color: '#8b5cf6' },
            { label: 'ATS Readability', val: 88, color: '#06b6d4' },
          ].map(s => (
            <div key={s.label}>
              <div className="flex justify-between text-[10px] font-semibold text-slate-600 mb-0.5">
                <span>{s.label}</span><span>{s.val}%</span>
              </div>
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: s.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${s.val}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
          <div className="mt-auto pt-2 border-t border-blue-100">
            <div className="text-[9px] text-blue-400 font-mono">Powered by TonyCV AI Engine v2.0</div>
          </div>
        </div>
      </div>

      <p className="text-slate-500 text-sm text-center max-w-md">
        Our AI engine analyses your CV across <strong>12+ dimensions</strong> including ATS readability, keyword density, impact phrasing, and format quality.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LIVE RESUME PREVIEW
───────────────────────────────────────────── */
function LiveResumePreview({ data, color, layout, photoEnabled, templateId }) {
  const tid = (templateId || '').toLowerCase().trim();

  let templateContent = null;

  if (tid === 'cascade' || tid === 'software-engineer') {
    templateContent = <SoftwareEngineerTemplate data={data} color={color} photoEnabled={photoEnabled} />;
  } else if (tid === 'cubic' || tid === 'data-scientist') {
    templateContent = <DataScientistTemplate data={data} color={color} photoEnabled={photoEnabled} />;
  } else if (tid === 'crisp' || tid === 'research-cv') {
    templateContent = <AcademicResearchTemplate data={data} color={color} photoEnabled={photoEnabled} />;
  } else if (tid === 'aria' || tid === 'healthcare') {
    templateContent = <HealthcareProfessionalTemplate data={data} color={color} photoEnabled={photoEnabled} />;
  } else if (tid === 'nexus') {
    templateContent = <CreativeDesignerTemplate data={data} color={color} photoEnabled={photoEnabled} />;
  } else if (tid === 'business-executive') {
    templateContent = <BusinessExecutiveTemplate data={data} color={color} photoEnabled={photoEnabled} />;
  } else if (tid === 'apex') {
    templateContent = <BusinessExecutiveTemplate data={data} color={color} photoEnabled={photoEnabled} />;
  } else if (tid === 'creative-designer') {
    templateContent = <CreativeDesignerTemplate data={data} color={color} photoEnabled={photoEnabled} />;
  }

  if (templateContent) {
    return (
      <div id="live-resume-preview" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden w-full h-full" style={{ minHeight: 520 }}>
        {templateContent}
      </div>
    );
  }

  return (
    <div
      id="live-resume-preview"
      className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif", minHeight: 520, fontSize: 11 }}
    >
      {/* Header */}
      <div className="px-8 py-6 flex items-start gap-4" style={{ backgroundColor: `${color}10`, borderBottom: `3px solid ${color}` }}>
        {photoEnabled && (
          <div className="w-14 h-14 rounded-full bg-slate-200 border-2 flex items-center justify-center shrink-0 overflow-hidden" style={{ borderColor: color }}>
            {data.photoUrl
              ? <img src={data.photoUrl} alt="profile" className="w-full h-full object-cover" />
              : <FiUser size={24} style={{ color }} />}
          </div>
        )}
        <div className="flex-1">
          <h1 className="font-black text-xl text-slate-900 leading-tight">{data.name || 'Your Name'}</h1>
          <p className="font-semibold text-sm mt-0.5" style={{ color }}>{data.profession || 'Job Title'}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-[10px] text-slate-500">
            {data.email && <span>✉ {data.email}</span>}
            {data.phone && <span>📞 {data.phone}</span>}
            {data.location && <span>📍 {data.location}</span>}
            {data.linkedin && <span>🔗 {data.linkedin}</span>}
            {data.website && <span>🌐 {data.website}</span>}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={`p-6 ${layout === 'Two columns' ? 'grid grid-cols-3 gap-6' : 'flex flex-col gap-4'}`}>

        {/* Left / Full column */}
        <div className={layout === 'Two columns' ? 'col-span-1 space-y-4 border-r pr-4' : 'space-y-4'} style={{ borderColor: `${color}20` }}>

          {/* Education */}
          <div>
            <h3 className="font-extrabold uppercase tracking-widest text-[9px] mb-2" style={{ color }}>Education</h3>
            <div className="space-y-3">
              {(data.education || []).map((edu, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="font-bold text-slate-800">{edu.degree || 'Degree'}{edu.field ? ` in ${edu.field}` : ''}</div>
                  <div className="text-slate-500 text-[10px]">{edu.school || 'School / Uni'}</div>
                  <div className="text-slate-400 font-mono text-[9px]">{edu.date || 'Year'}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-extrabold uppercase tracking-widest text-[9px] mb-2" style={{ color }}>Skills</h3>
            <div className="flex flex-wrap gap-1">
              {(data.skills || []).map((skill, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-semibold">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className={layout === 'Two columns' ? 'col-span-2 space-y-4' : 'space-y-4'}>
          {/* Summary */}
          {data.summary && (
            <div>
              <h3 className="font-extrabold uppercase tracking-widest text-[9px] mb-2" style={{ color }}>Summary</h3>
              <p className="text-slate-600 leading-relaxed text-[10px]">{data.summary}</p>
            </div>
          )}

          {/* Experience */}
          <div>
            <h3 className="font-extrabold uppercase tracking-widest text-[9px] mb-2" style={{ color }}>Experience</h3>
            <div className="space-y-4">
              {(data.experience || []).map((exp, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-slate-800">{exp.role || 'Job Role'}</div>
                    <div className="text-slate-400 font-mono text-[9px] shrink-0 ml-2">{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</div>
                  </div>
                  <div className="text-slate-500 font-semibold text-[10px]">{exp.company || 'Employer'}</div>
                  <p className="text-slate-600 leading-relaxed text-[9.5px] mt-0.5 whitespace-pre-line">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN ANALYZE PAGE
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   Template colour map — shared by the lazy
   state initialisers and the wizard banner.
───────────────────────────────────────────── */
const TEMPLATE_COLOR_MAP = {
  cascade: '#2563eb',
  cubic:   '#10b981',
  crisp:   '#6366f1',
  nexus:   '#f97316',
  aria:    '#06b6d4',
  apex:    '#8b5cf6',
};

/**
 * Read React Router's location state *synchronously* at init time.
 * window.history.state.usr is where React Router v6 stores { state }.
 * Falling back to null is safe — it just means a direct /analyze visit.
 */
function getRouterState() {
  try { return window.history.state?.usr ?? null; } catch { return null; }
}

export default function Analyze() {
  const navigate = useNavigate();


  // ── Lazy initialisers: read router state once, synchronously ──
  // This means the correct step is set on the VERY FIRST render —
  // no intermediate flash of the option-select screen.
  const [step, setStep] = useState(() => {
    const s = getRouterState();
    return s?.startMode === 'scratch' ? 'wizard_experience' : 'option_select';
  });

  const [, setSelectedOption] = useState(() => {
    const s = getRouterState();
    return s?.startMode === 'scratch' ? 'scratch' : null;
  });

  const [appliedTemplate, setAppliedTemplate] = useState(() => {
    const s = getRouterState();
    return s?.templateId ?? null;
  });

  // Onboarding answers
  const [experience, setExperience] = useState(null);
  const [isStudent, setIsStudent] = useState(null);
  const [photoEnabled, setPhotoEnabled] = useState(false);
  const [layoutPref, setLayoutPref] = useState('Two columns');

  const [selectedColor, setSelectedColor] = useState(() => {
    const s = getRouterState();
    const color = s?.templateId ? TEMPLATE_COLOR_MAP[s.templateId] : null;
    return color ?? TEMPLATE_COLORS[0].value;
  });

  // Resume form data
  const [resumeData, setResumeData] = useState({
    name: '', profession: '', email: '', phone: '', location: '',
    linkedin: '', website: '', summary: '', photoUrl: '',
    education: [{ school: '', degree: '', field: '', date: '' }],
    experience: [{ role: '', company: '', startDate: '', endDate: '', desc: '' }],
    skills: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [builderStep, setBuilderStep] = useState(0);

  // Upload & analyze
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [companies, setCompanies] = useState(FALLBACK_COMPANIES);

  const photoRef = useRef(null);

  // Fetch companies
  useEffect(() => {
    api.get(`/companies`).then(r => setCompanies(r.data?.companies || FALLBACK_COMPANIES)).catch(() => {});
  }, []);

  // Handle analyze (upload path)
  const handleAnalyze = async (formData) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.post(`/analyze`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/dashboard', { state: { analysisData: res.data } });
    } catch (err) {
      setError(err?.response?.data?.detail || 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate PDF from scratch builder and send to /analyze
  const handleScratchAnalyze = async () => {
    setIsLoading(true);
    setError('');
    try {
      const el = document.getElementById('live-resume-preview');
      const blob = await html2pdf().set({ margin: 0, filename: 'resume.pdf', image: { type: 'jpeg', quality: 0.98 }, jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' } }).from(el).outputPdf('blob');
      const file = new File([blob], 'resume.pdf', { type: 'application/pdf' });
      const fd = new FormData();
      fd.append('cv_file', file);
      fd.append('target_company', companies[0] || 'Google');
      fd.append('job_description', '');
      const res = await api.post(`/analyze`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/dashboard', { state: { analysisData: res.data } });
    } catch (err) {
      setError(err?.response?.data?.detail || 'Could not analyse your resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Education helpers
  const updateEdu = (i, field, val) => setResumeData(p => {
    const ed = [...p.education]; ed[i] = { ...ed[i], [field]: val }; return { ...p, education: ed };
  });
  const addEdu = () => setResumeData(p => ({ ...p, education: [...p.education, { school: '', degree: '', field: '', date: '' }] }));
  const removeEdu = (i) => setResumeData(p => ({ ...p, education: p.education.filter((_, idx) => idx !== i) }));

  // Experience helpers
  const updateExp = (i, field, val) => setResumeData(p => {
    const ex = [...p.experience]; ex[i] = { ...ex[i], [field]: val }; return { ...p, experience: ex };
  });
  const addExp = () => setResumeData(p => ({ ...p, experience: [...p.experience, { role: '', company: '', startDate: '', endDate: '', desc: '' }] }));
  const removeExp = (i) => setResumeData(p => ({ ...p, experience: p.experience.filter((_, idx) => idx !== i) }));

  // Skills helpers
  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !resumeData.skills.includes(s)) {
      setResumeData(p => ({ ...p, skills: [...p.skills, s] }));
      setSkillInput('');
    }
  };
  const removeSkill = (s) => setResumeData(p => ({ ...p, skills: p.skills.filter(x => x !== s) }));

  // Photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setResumeData(p => ({ ...p, photoUrl: url }));
  };

  // Builder sections
  const BUILDER_STEPS = [
    { id: 'contact',    label: 'Contact Info' },
    { id: 'summary',    label: 'Summary' },
    { id: 'education',  label: 'Education' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills',     label: 'Skills' },
    { id: 'preview',    label: 'Preview & Analyse' },
  ];

  const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 bg-white transition";
  const labelCls = "block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <AnimatePresence mode="wait">

          {/* ── STEP 1: Option Select ── */}
          {step === 'option_select' && (
            <motion.div key="option_select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>

              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-5 py-2 text-blue-700 text-sm font-semibold mb-5">
                  <FiFileText size={14} /> TonyCV · AI Resume Analyser
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
                  Build a resume that <span className="text-blue-600">gets interviews</span>
                </h1>
                <p className="text-slate-500 text-lg max-w-xl mx-auto">
                  Upload your existing CV for instant AI analysis, or build a polished resume from scratch in minutes.
                </p>
              </div>

              {/* 3-D Scanner */}
              <ResumeGraderScanner />

              {/* Options */}
              <div className="grid md:grid-cols-2 gap-6 mt-8 max-w-3xl mx-auto">
                {[
                  {
                    key: 'upload',
                    icon: <FiUploadCloud size={32} />,
                    title: 'Upload & Analyse',
                    desc: 'Upload your PDF resume and get an instant AI-powered ATS score, keyword analysis, and improvement tips.',
                    badge: 'Most Popular',
                    color: 'blue',
                  },
                  {
                    key: 'scratch',
                    icon: <FiEdit3 size={32} />,
                    title: 'Build from Scratch',
                    desc: 'Use our guided resume wizard to create a professional resume with live preview, then analyse it instantly.',
                    badge: 'Step-by-step',
                    color: 'purple',
                  },
                ].map(opt => (
                  <motion.button
                    key={opt.key}
                    whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(37,99,235,0.15)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedOption(opt.key); setStep(opt.key === 'upload' ? 'form_input' : 'wizard_experience'); }}
                    className="relative text-left p-8 rounded-3xl border-2 bg-white transition-all group"
                    style={{ borderColor: opt.color === 'blue' ? '#bfdbfe' : '#e9d5ff' }}
                  >
                    <div className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${opt.color === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {opt.badge}
                    </div>
                    <div className={`mb-4 ${opt.color === 'blue' ? 'text-blue-600' : 'text-purple-600'}`}>{opt.icon}</div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">{opt.title}</h2>
                    <p className="text-slate-500 text-sm leading-relaxed">{opt.desc}</p>
                    <div className={`mt-6 flex items-center gap-2 font-semibold text-sm ${opt.color === 'blue' ? 'text-blue-600' : 'text-purple-600'}`}>
                      Get started <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Experience Level ── */}
          {step === 'wizard_experience' && (
            <motion.div key="wizard_experience" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              {/* Template applied banner */}
              {appliedTemplate && (
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-2xl mx-auto mb-6 flex items-center gap-3 px-5 py-3 rounded-2xl border text-sm font-semibold"
                  style={{
                    background: selectedColor + '12',
                    borderColor: selectedColor + '40',
                    color: selectedColor,
                  }}
                >
                  <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-black" style={{ background: selectedColor }}>✓</span>
                  <span>
                    <span className="capitalize font-black">{appliedTemplate}</span> template applied —
                    its accent colour has been pre-selected. You can change it in the colour step.
                  </span>
                </motion.div>
              )}
              <WizardShell title="How long have you been working?" subtitle="This helps us tailor your resume to your career stage." onBack={() => { setAppliedTemplate(null); setStep('option_select'); }}>
                <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {[
                    { label: 'No Experience', icon: <FiStar size={28} />, desc: 'Student or first-time jobseeker' },
                    { label: 'Less Than 3 Years', icon: <FiBriefcase size={28} />, desc: 'Early-career professional' },
                    { label: '3+ Years', icon: <FiAward size={28} />, desc: 'Experienced professional' },
                  ].map(opt => (
                    <WizardCard key={opt.label} icon={opt.icon} label={opt.label} desc={opt.desc} selected={experience === opt.label}
                      onClick={() => { setExperience(opt.label); setStep('wizard_student'); }} />
                  ))}
                </div>
              </WizardShell>
            </motion.div>
          )}

          {/* ── STEP 3: Student? ── */}
          {step === 'wizard_student' && (
            <motion.div key="wizard_student" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <WizardShell title="Are you a student?" subtitle="Students get a resume optimised for internships and entry-level roles." onBack={() => setStep('wizard_experience')}>
                <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                  {[
                    { label: "Yes, I'm a student", icon: <FiHeart size={28} />, val: true },
                    { label: "No, I'm not a student", icon: <FiUsers size={28} />, val: false },
                  ].map(opt => (
                    <WizardCard key={opt.label} icon={opt.icon} label={opt.label} selected={isStudent === opt.val}
                      onClick={() => { setIsStudent(opt.val); setStep('wizard_photo'); }} />
                  ))}
                </div>
              </WizardShell>
            </motion.div>
          )}

          {/* ── STEP 4: Photo ── */}
          {step === 'wizard_photo' && (
            <motion.div key="wizard_photo" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <WizardShell title="Will you be adding a photo to your resume?" subtitle="Add a photo if it is standard practice in your industry or region." onBack={() => setStep('wizard_student')}>
                <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                  {[
                    { label: 'With photo', icon: <FiCamera size={28} />, val: true, desc: 'Common in Europe, Asia, and creative industries' },
                    { label: 'Without photo', icon: <FiUser size={28} />, val: false, desc: 'Standard for US, UK, and tech roles' },
                  ].map(opt => (
                    <WizardCard key={opt.label} icon={opt.icon} label={opt.label} desc={opt.desc} selected={photoEnabled === opt.val}
                      onClick={() => { setPhotoEnabled(opt.val); setStep('wizard_layout'); }} />
                  ))}
                </div>
              </WizardShell>
            </motion.div>
          )}

          {/* ── STEP 5: Layout ── */}
          {step === 'wizard_layout' && (
            <motion.div key="wizard_layout" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <WizardShell title="What layout suits you best?" subtitle="Use one column to fit more info, or two columns for better organisation." onBack={() => setStep('wizard_photo')}>
                <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                  {[
                    { label: 'Two columns', icon: '▐▌', desc: 'Compact and well-organised — most ATS-friendly' },
                    { label: 'One column', icon: '▐', desc: 'Traditional, great for detailed descriptions' },
                  ].map(opt => (
                    <WizardCard key={opt.label} icon={<span className="text-3xl">{opt.icon}</span>} label={opt.label} desc={opt.desc}
                      selected={layoutPref === opt.label}
                      onClick={() => { setLayoutPref(opt.label); setStep('wizard_color'); }} />
                  ))}
                </div>
              </WizardShell>
            </motion.div>
          )}

          {/* ── STEP 6: Color ── */}
          {step === 'wizard_color' && (
            <motion.div key="wizard_color" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <WizardShell title="Pick your accent color" subtitle="This sets the personality of your resume." onBack={() => setStep('wizard_layout')}>
                <div className="flex flex-wrap justify-center gap-4 max-w-lg mx-auto">
                  {TEMPLATE_COLORS.map(c => (
                    <button
                      key={c.value}
                      onClick={() => setSelectedColor(c.value)}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div
                        className="w-14 h-14 rounded-2xl shadow-lg transition-transform group-hover:scale-110"
                        style={{ backgroundColor: c.value, outline: selectedColor === c.value ? `3px solid ${c.value}` : '3px solid transparent', outlineOffset: 3 }}
                      />
                      <span className="text-xs font-semibold text-slate-600">{c.name}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-center mt-8">
                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setStep('builder')}
                    className="flex items-center gap-2 px-8 py-3 rounded-2xl text-white font-bold text-base shadow-lg"
                    style={{ backgroundColor: selectedColor }}
                  >
                    Continue to Builder <FiArrowRight size={18} />
                  </motion.button>
                </div>
              </WizardShell>
            </motion.div>
          )}

          {/* ── STEP 7: Resume Builder ── */}
          {step === 'builder' && (
            <motion.div key="builder" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex items-center gap-3 mb-8">
                <button onClick={() => setStep('wizard_color')} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-medium text-sm">
                  <FiArrowLeft size={16} /> Back
                </button>
                <div className="flex-1 h-px bg-slate-200" />
                {BUILDER_STEPS.map((s, i) => (
                  <button key={s.id} onClick={() => setBuilderStep(i)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${builderStep === i ? 'text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                    style={builderStep === i ? { backgroundColor: selectedColor } : {}}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Form Panel */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-6">
                  <h2 className="text-xl font-bold text-slate-800">{BUILDER_STEPS[builderStep].label}</h2>

                  {/* Contact */}
                  {builderStep === 0 && (
                    <div className="space-y-4">
                      {photoEnabled && (
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-slate-50 transition" onClick={() => photoRef.current?.click()}>
                            {resumeData.photoUrl ? <img src={resumeData.photoUrl} alt="" className="w-full h-full object-cover" /> : <FiCamera size={22} className="text-slate-400" />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-700">Profile Photo</p>
                            <button onClick={() => photoRef.current?.click()} className="text-xs text-blue-600 hover:underline">Upload photo</button>
                          </div>
                          <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                        </div>
                      )}
                      {[
                        { f: 'name',       label: 'Full Name',       ph: 'John Smith' },
                        { f: 'profession', label: 'Job Title',        ph: 'Software Engineer' },
                        { f: 'email',      label: 'Email',            ph: 'john@email.com' },
                        { f: 'phone',      label: 'Phone',            ph: '+91 98765 43210' },
                        { f: 'location',   label: 'Location',         ph: 'Mumbai, India' },
                        { f: 'linkedin',   label: 'LinkedIn URL',     ph: 'linkedin.com/in/johnsmith' },
                        { f: 'website',    label: 'Website / GitHub', ph: 'github.com/johnsmith' },
                      ].map(({ f, label, ph }) => (
                        <div key={f}>
                          <label className={labelCls}>{label}</label>
                          <input className={inputCls} placeholder={ph} value={resumeData[f]} onChange={e => setResumeData(p => ({ ...p, [f]: e.target.value }))} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Summary */}
                  {builderStep === 1 && (
                    <div>
                      <label className={labelCls}>Professional Summary</label>
                      <textarea
                        className={`${inputCls} resize-none`}
                        rows={7}
                        placeholder="A results-driven software engineer with 4+ years of experience building scalable web applications…"
                        value={resumeData.summary}
                        onChange={e => setResumeData(p => ({ ...p, summary: e.target.value }))}
                      />
                    </div>
                  )}

                  {/* Education */}
                  {builderStep === 2 && (
                    <div className="space-y-5">
                      {resumeData.education.map((edu, i) => (
                        <div key={i} className="relative border border-slate-100 rounded-2xl p-4 space-y-3 bg-slate-50">
                          {resumeData.education.length > 1 && (
                            <button onClick={() => removeEdu(i)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500"><FiTrash2 size={14} /></button>
                          )}
                          {[
                            { f: 'school', label: 'School / University', ph: 'IIT Bombay' },
                            { f: 'degree', label: 'Degree',              ph: 'Bachelor of Technology' },
                            { f: 'field',  label: 'Field of Study',      ph: 'Computer Science' },
                            { f: 'date',   label: 'Graduation Year',     ph: '2022' },
                          ].map(({ f, label, ph }) => (
                            <div key={f}>
                              <label className={labelCls}>{label}</label>
                              <input className={inputCls} placeholder={ph} value={edu[f]} onChange={e => updateEdu(i, f, e.target.value)} />
                            </div>
                          ))}
                        </div>
                      ))}
                      <button onClick={addEdu} className="flex items-center gap-2 text-blue-600 text-sm font-semibold hover:underline">
                        <FiPlus size={14} /> Add Education
                      </button>
                    </div>
                  )}

                  {/* Experience */}
                  {builderStep === 3 && (
                    <div className="space-y-5">
                      {resumeData.experience.map((exp, i) => (
                        <div key={i} className="relative border border-slate-100 rounded-2xl p-4 space-y-3 bg-slate-50">
                          {resumeData.experience.length > 1 && (
                            <button onClick={() => removeExp(i)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500"><FiTrash2 size={14} /></button>
                          )}
                          {[
                            { f: 'role',      label: 'Job Title',  ph: 'Senior Software Engineer' },
                            { f: 'company',   label: 'Company',    ph: 'Google' },
                            { f: 'startDate', label: 'Start Date', ph: 'Jan 2022' },
                            { f: 'endDate',   label: 'End Date',   ph: 'Present' },
                          ].map(({ f, label, ph }) => (
                            <div key={f}>
                              <label className={labelCls}>{label}</label>
                              <input className={inputCls} placeholder={ph} value={exp[f]} onChange={e => updateExp(i, f, e.target.value)} />
                            </div>
                          ))}
                          <div>
                            <label className={labelCls}>Description / Achievements</label>
                            <textarea
                              className={`${inputCls} resize-none`}
                              rows={4}
                              placeholder="• Led a team of 5 engineers to deliver…&#10;• Reduced API latency by 35%…"
                              value={exp.desc}
                              onChange={e => updateExp(i, 'desc', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                      <button onClick={addExp} className="flex items-center gap-2 text-blue-600 text-sm font-semibold hover:underline">
                        <FiPlus size={14} /> Add Experience
                      </button>
                    </div>
                  )}

                  {/* Skills */}
                  {builderStep === 4 && (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          className={inputCls}
                          placeholder="e.g. React, Python, SQL…"
                          value={skillInput}
                          onChange={e => setSkillInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && addSkill()}
                        />
                        <button onClick={addSkill} className="px-4 py-2.5 rounded-xl text-white font-bold text-sm shrink-0" style={{ backgroundColor: selectedColor }}>Add</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map(s => (
                          <span key={s} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: selectedColor }}>
                            {s}
                            <button onClick={() => removeSkill(s)} className="hover:opacity-70"><FiX size={12} /></button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preview & Analyse */}
                  {builderStep === 5 && (
                    <div className="space-y-4">
                      <p className="text-slate-600 text-sm">Your resume is ready! Review the live preview on the right, then click Analyse to get your AI report.</p>
                      {error && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                          <span className="text-red-500">⚠</span>
                          <p className="text-red-700 text-sm">{error}</p>
                        </div>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={handleScratchAnalyze}
                        disabled={isLoading}
                        className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                        style={{ backgroundColor: selectedColor }}
                      >
                        {isLoading ? (
                          <><span className="animate-spin inline-block w-5 h-5 border-2 border-white/40 border-t-white rounded-full" /> Analysing…</>
                        ) : (
                          <><FiCheck size={18} /> Analyse My Resume</>
                        )}
                      </motion.button>
                    </div>
                  )}

                  {/* Nav buttons */}
                  <div className="flex justify-between pt-4">
                    {builderStep > 0 && (
                      <button onClick={() => setBuilderStep(s => s - 1)} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-medium text-sm">
                        <FiArrowLeft size={14} /> Previous
                      </button>
                    )}
                    {builderStep < BUILDER_STEPS.length - 1 && (
                      <button onClick={() => setBuilderStep(s => s + 1)} className="ml-auto flex items-center gap-1.5 font-bold text-sm px-5 py-2.5 rounded-xl text-white" style={{ backgroundColor: selectedColor }}>
                        Next <FiArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Live Preview Panel */}
                <div className="hidden lg:block">
                  <div className="sticky top-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Preview</span>
                      <div className="flex gap-2">
                        {TEMPLATE_COLORS.map(c => (
                          <button key={c.value} onClick={() => setSelectedColor(c.value)}
                            className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
                            style={{ backgroundColor: c.value, borderColor: selectedColor === c.value ? c.value : 'transparent' }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-2xl shadow-2xl" style={{ transform: 'scale(0.75)', transformOrigin: 'top center', marginBottom: '-25%' }}>
                      <LiveResumePreview data={resumeData} color={selectedColor} layout={layoutPref} photoEnabled={photoEnabled} templateId={appliedTemplate} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 8: Standard Upload Form ── */}
          {step === 'form_input' && (
            <motion.div key="form_input" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <div className="text-center mb-8">
                <button onClick={() => setStep('option_select')} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4 font-medium mx-auto">
                  <FiArrowLeft size={16} /> Back
                </button>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Upload & Analyse</h1>
                <p className="text-slate-500">Upload your resume PDF and provide the target company & job description.</p>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6">
                  <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-red-50 border border-red-200">
                    <span className="text-red-500 text-lg">⚠</span>
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                </motion.div>
              )}

              <InputForm onAnalyze={handleAnalyze} isLoading={isLoading} companies={companies} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SHARED WIZARD COMPONENTS
───────────────────────────────────────────── */
function WizardShell({ title, subtitle, onBack, children }) {
  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-medium text-sm mb-8">
        <FiArrowLeft size={16} /> Back
      </button>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-900 mb-3">{title}</h2>
        {subtitle && <p className="text-slate-500 text-base">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function WizardCard({ icon, label, desc, selected, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(37,99,235,0.15)' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative flex flex-col items-center text-center gap-3 p-6 rounded-3xl border-2 bg-white transition-all ${selected ? 'border-blue-500 shadow-blue-100 shadow-xl' : 'border-slate-200 hover:border-blue-300'}`}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
          <FiCheck size={10} className="text-white" />
        </div>
      )}
      <div className={`transition ${selected ? 'text-blue-600' : 'text-slate-400'}`}>{icon}</div>
      <span className="font-bold text-slate-800 text-sm">{label}</span>
      {desc && <span className="text-slate-500 text-xs leading-snug">{desc}</span>}
    </motion.button>
  );
}