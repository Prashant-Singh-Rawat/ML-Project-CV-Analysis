import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import InputForm from '../components/InputForm';
import { 
  FiFileText, FiCheck, FiArrowRight, FiCheckCircle, FiEdit3, 
  FiLayout, FiMessageSquare, FiSliders, FiHelpCircle, FiSearch,
  FiBriefcase, FiZap, FiCpu, FiTrendingUp, FiStar, FiChevronDown, 
  FiChevronUp, FiFacebook, FiLinkedin, FiPhone, FiMail, FiArrowLeft,
  FiUploadCloud, FiX, FiUser, FiUsers, FiAward, FiHeart, FiCamera,
  FiPlus, FiTrash2
} from 'react-icons/fi';
import html2pdf from 'html2pdf.js';
import SoftwareEngineerTemplate from '../components/templates/SoftwareEngineerTemplate';
import DataScientistTemplate from '../components/templates/DataScientistTemplate';
import AcademicResearchTemplate from '../components/templates/AcademicResearchTemplate';
import HealthcareProfessionalTemplate from '../components/templates/HealthcareProfessionalTemplate';
import BusinessExecutiveTemplate from '../components/templates/BusinessExecutiveTemplate';
import CreativeDesignerTemplate from '../components/templates/CreativeDesignerTemplate';
import RegisterPopup from '../components/RegisterPopup';

const isLocal =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.startsWith('192.168.') ||
  window.location.hostname.startsWith('172.') ||
  window.location.hostname.startsWith('10.');

const API_BASE_URL = isLocal
  ? `http://${window.location.hostname}:8000`
  : 'https://tonycv-backend.onrender.com';

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
    <div className="flex flex-col items-center justify-center py-10 px-4 max-w-4xl mx-auto w-full">
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
          <div className="text-indigo-300 text-xs font-semibold tracking-widest uppercase">/ 100 ATS Score</div>

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
  } else if (tid === 'nexus' || tid === 'business-executive') {
    templateContent = <BusinessExecutiveTemplate data={data} color={color} photoEnabled={photoEnabled} />;
  } else if (tid === 'apex' || tid === 'creative-designer') {
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

export default function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('tonycv_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [registerOpen, setRegisterOpen] = useState(false);

  // Sync user state on changes
  useEffect(() => {
    const checkUser = () => {
      const cached = localStorage.getItem('tonycv_user');
      setUser(cached ? JSON.parse(cached) : null);
    };
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleActionClick = (nextAction) => {
    const cachedUser = localStorage.getItem('tonycv_user');
    if (!cachedUser) {
      setRegisterOpen(true);
    } else {
      nextAction();
    }
  };

  // Onboarding settings
  const [experience, setExperience] = useState(null);
  const [isStudent, setIsStudent] = useState(null);
  const [photoEnabled, setPhotoEnabled] = useState(false);
  const [layoutPref, setLayoutPref] = useState('Two columns');
  const [selectedColor, setSelectedColor] = useState(TEMPLATE_COLORS[0].value);

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

  // UI status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [companies, setCompanies] = useState(FALLBACK_COMPANIES);

  const photoRef = useRef(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);
  const [activeTemplate, setActiveTemplate] = useState('Cascade');
  // Wizard / Builder Console State
  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState('option_select');
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/companies`).then(r => setCompanies(r.data?.companies || FALLBACK_COMPANIES)).catch(() => {});
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Handler for analyzing uploaded resume file
  const handleAnalyze = async (formData) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/analyze`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/dashboard', { state: { analysisData: res.data } });
    } catch (err) {
      setError(err?.response?.data?.detail || 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Compile PDF & run analyze from scratch builder
  const handleScratchAnalyze = async () => {
    setIsLoading(true);
    setError('');
    try {
      const el = document.getElementById('live-resume-preview');
      const blob = await html2pdf().set({ margin: 0, filename: 'resume.pdf', image: { type: 'jpeg', quality: 0.98 }, jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' } }).from(el).outputPdf('blob');
      const file = new File([blob], 'resume.pdf', { type: 'application/pdf' });
      const fd = new FormData();
      fd.append('file', file);
      fd.append('target_company', companies[0] || 'Google');
      fd.append('job_description', '');
      const res = await axios.post(`${API_BASE_URL}/analyze`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/dashboard', { state: { analysisData: res.data } });
    } catch (err) {
      setError(err?.response?.data?.detail || 'Could not analyse resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Education Helpers
  const updateEdu = (i, field, val) => setResumeData(p => {
    const ed = [...p.education]; ed[i] = { ...ed[i], [field]: val }; return { ...p, education: ed };
  });
  const addEdu = () => setResumeData(p => ({ ...p, education: [...p.education, { school: '', degree: '', field: '', date: '' }] }));
  const removeEdu = (i) => setResumeData(p => ({ ...p, education: p.education.filter((_, idx) => idx !== i) }));

  // Experience Helpers
  const updateExp = (i, field, val) => setResumeData(p => {
    const ex = [...p.experience]; ex[i] = { ...ex[i], [field]: val }; return { ...p, experience: ex };
  });
  const addExp = () => setResumeData(p => ({ ...p, experience: [...p.experience, { role: '', company: '', startDate: '', endDate: '', desc: '' }] }));
  const removeExp = (i) => setResumeData(p => ({ ...p, experience: p.experience.filter((_, idx) => idx !== i) }));

  // Skills Helpers
  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !resumeData.skills.includes(s)) {
      setResumeData(p => ({ ...p, skills: [...p.skills, s] }));
      setSkillInput('');
    }
  };
  const removeSkill = (s) => setResumeData(p => ({ ...p, skills: p.skills.filter(x => x !== s) }));

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeData(p => ({ ...p, photoUrl: URL.createObjectURL(file) }));
  };

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

  const benefits = [
    {
      icon: <FiFileText className="text-blue-600" size={24} />,
      title: "Optimal length",
      desc: "Most employers prefer a resume that fits on one page. Our ATS checker gives you tips to help you highlight your top strengths clearly and concisely."
    },
    {
      icon: <FiEdit3 className="text-blue-600" size={24} />,
      title: "Fix typos",
      desc: "A polished resume is free of grammar and spelling mistakes. Our resume analyzer catches errors to help you submit a flawless application."
    },
    {
      icon: <FiCheck className="text-blue-600" size={24} />,
      title: "Comprehensiveness",
      desc: "Make sure your resume checks all the right boxes. Our AI tool helps you include the key details employers want to see."
    },
    {
      icon: <FiSliders className="text-blue-600" size={24} />,
      title: "Measurable results",
      desc: "Stand out with results that show real impact. Our scanner helps you add clear, measurable achievements."
    },
    {
      icon: <FiZap className="text-blue-600" size={24} />,
      title: "Word choice",
      desc: "Use powerful action verbs to show your value. The AI resume checker suggests active language that gets noticed."
    },
    {
      icon: <FiLayout className="text-blue-600" size={24} />,
      title: "Formatting",
      desc: "Clean, consistent formatting helps your resume pass ATS and impress employers. Our checker makes sure your layout is perfect."
    },
    {
      icon: <FiMessageSquare className="text-blue-600" size={24} />,
      title: "Strong summary",
      desc: "Keep hiring managers reading with a compelling resume summary. Get expert tips to make your introduction count."
    },
    {
      icon: <FiCpu className="text-blue-600" size={24} />,
      title: "Customization",
      desc: "Select your job title and get a list of the most important skills you should include in your resume. Enrich your resume with the right keywords."
    },
    {
      icon: <FiHelpCircle className="text-blue-600" size={24} />,
      title: "Clear contact Info",
      desc: "Don't miss out on interviews because of missing or hard-to-find details. Our checker ensures your contact info is complete and easy to spot."
    }
  ];

  const reviews = [
    { title: "Zety Its good app for re...", text: "Zety its good app for resume creation and review.", author: "mm", time: "23 hours ago" },
    { title: "awesome easy to access", text: "awesome easy to access template tools and reviews.", author: "SATHESHRAJ S/...", time: "1 day ago" },
    { title: "compared to other platf...", text: "compared to other platforms Zety has better formatting guidelines.", author: "Josh", time: "1 day ago" },
    { title: "Zety wrote an amazing ...", text: "Zety wrote an amazing cover letter for me! It was done in minutes.", author: "Christi", time: "2 days ago" },
    { title: "Very good tool strongly...", text: "Very good tool strongly recommend to all job seekers.", author: "Ulises Vargas", time: "2 days ago" }
  ];

  const faqs = [
    { q: "What is a resume check?", a: "A resume check is an automated process where an AI scanning engine parses your resume, identifies formatting blocks, extracts keywords, and scores your content against standard hiring metrics and applicant tracking system (ATS) filters." },
    { q: "How do I know my resume has a good ATS score?", a: "An ATS score above 75% is generally considered strong. Our system breaks down your score by skill relevance, formatting accuracy, keyword density, and structural issues so you know exactly where you stand." },
    { q: "Which resume scanner is the best in 2026?", a: "TonyCV combines local BERT semantic sentence transformers with traditional keyword matching algorithms, providing deep semantic scores that reflect realistic candidate value rather than simple text-matching." },
    { q: "Which resume file format is best?", a: "PDF (Portable Document Format) is the gold standard for preserving formatting, fonts, and structure. It ensures your resume renders exactly the same way on the recruiter's machine as it did on yours." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* 1. Hero Banner Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 py-16 px-6 sm:px-12 lg:px-24 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Resume Templates &gt; Resume Checker</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              ATS Resume Checker:<br />
              Score Your Resume Online
            </h1>
            <p className="text-base sm:text-lg text-blue-100 max-w-xl leading-relaxed">
              Boost your chances of landing the job with our ATS Resume Checker. Scan your resume from any device, get a personalized score, and receive actionable suggestions.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <button 
                onClick={() => {
                  setShowWizard(true);
                  const el = document.getElementById('interactive-wizard-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 text-sm font-extrabold uppercase rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-100"
              >
                Check Your Resume
              </button>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-200">
                <span>Excellent</span>
                <span className="flex gap-0.5 text-emerald-400">★★★★★</span>
                <span>on Trustpilot / BERT AI</span>
              </div>
            </div>
          </div>

          {/* Right Mock CV Illustration Column */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 w-full max-w-sm text-slate-800 relative z-10">
              {/* Fake Resume Details */}
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center">RH</div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Robert Hahn</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Marketing Manager (Social Media)</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-3/4 bg-slate-100 rounded" />
                <div className="h-2 w-5/6 bg-slate-100 rounded" />
                <div className="h-2 w-2/3 bg-slate-100 rounded" />
              </div>
              
              {/* Overlay Interactive Elements */}
              <div className="absolute -left-12 top-1/3 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 w-32 justify-center">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="68 100" />
                  </svg>
                  <span className="absolute text-xs font-black text-slate-900">68</span>
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-900">68%</p>
                  <span className="text-[8px] font-bold text-emerald-500 uppercase">Good</span>
                </div>
              </div>

              <div className="absolute -right-8 bottom-1/4 space-y-1.5 z-20">
                <div className="bg-white px-3 py-1.5 rounded-full shadow-lg border border-slate-100 text-[10px] font-bold text-red-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> ! Skills
                </div>
                <div className="bg-white px-3 py-1.5 rounded-full shadow-lg border border-slate-100 text-[10px] font-bold text-red-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> ! Education
                </div>
                <div className="bg-white px-3 py-1.5 rounded-full shadow-lg border border-slate-100 text-[10px] font-bold text-emerald-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> ✓ Work History
                </div>
                <div className="bg-white px-3 py-1.5 rounded-full shadow-lg border border-slate-100 text-[10px] font-bold text-emerald-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> ✓ Summary
                </div>
              </div>
            </div>
            {/* Background Blob Decor */}
            <div className="absolute right-4 bottom-4 w-48 h-48 bg-blue-500/20 rounded-full filter blur-xl z-0" />
          </div>
        </div>
      </div>

      {/* Customer Bar */}
      <div className="bg-slate-900 text-slate-400 py-6 text-center border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-x-12 gap-y-4 text-xs font-semibold uppercase tracking-widest">
          <span>Hired by top companies:</span>
          <span className="text-white hover:text-blue-400 transition-colors">Amazon</span>
          <span className="text-white hover:text-blue-400 transition-colors">Walmart</span>
          <span className="text-white hover:text-blue-400 transition-colors">AT&T</span>
          <span className="text-white hover:text-blue-400 transition-colors">FedEx</span>
          <span className="text-white hover:text-blue-400 transition-colors">Microsoft</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
         INTERACTIVE BUILDER & SCANNER WIZARD (MERGED)
      ───────────────────────────────────────────── */}
      <div id="interactive-wizard-section" className="scroll-mt-10 py-16 bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          
          {!showWizard ? (
            /* Call to Action panel to unlock scanner */
            <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-xl max-w-4xl mx-auto text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
                <FiZap size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900">Try the Live Resume Checker & Builder</h2>
              <p className="text-slate-500 text-sm max-w-xl mx-auto">
                Unlock our 3D scanner, visual grade analyzers, and template customizers instantly. Build your resume step-by-step or upload to scan.
              </p>
              <button
                onClick={() => handleActionClick(() => setShowWizard(true))}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase rounded-full shadow-lg transition-all"
              >
                Launch Builder & Scanner Console
              </button>
            </div>
          ) : (
            <div className="bg-white/60 backdrop-blur rounded-3xl border border-slate-200 p-8 shadow-xl">
              
              <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                <span className="text-xs font-black tracking-widest text-slate-400 uppercase">Live Console</span>
                <button 
                  onClick={() => setShowWizard(false)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 font-semibold"
                >
                  <FiX size={14} /> Close Console
                </button>
              </div>

              <AnimatePresence mode="wait">

                {/* ── STEP 1: Option Select ── */}
                {step === 'option_select' && (
                  <motion.div key="option_select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-black text-slate-900 mb-2">Select Your Path</h2>
                      <p className="text-slate-500 text-sm max-w-md mx-auto">
                        Choose whether to scan an existing PDF or design a clean resume layout from scratch.
                      </p>
                    </div>

                    <ResumeGraderScanner />

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
                        <button
                          key={opt.key}
                          onClick={() => { setSelectedOption(opt.key); setStep(opt.key === 'upload' ? 'form_input' : 'wizard_experience'); }}
                          className="relative text-left p-8 rounded-3xl border-2 bg-white hover:border-blue-400 hover:shadow-lg transition-all group"
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
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 2: Experience Level ── */}
                {step === 'wizard_experience' && (
                  <motion.div key="wizard_experience" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
                    <WizardShell title="How long have you been working?" subtitle="This helps us tailor your resume to your career stage." onBack={() => setStep('option_select')}>
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
                      <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6">
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
                            <LiveResumePreview data={resumeData} color={selectedColor} layout={layoutPref} photoEnabled={photoEnabled} />
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
          )}

        </div>
      </div>

      {/* 2. Benefits Grid Section */}
      <div className="py-20 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Why You Should Use Our Resume Checker
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Our automated checker reads details accurately and compares metrics against thousands of recruiter standards instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
                  {b.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{b.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. CTA Feedback Banner */}
      <div className="py-12 px-6 sm:px-12 lg:px-24 bg-white border-t border-b border-slate-200">
        <div className="max-w-4xl mx-auto bg-blue-50 rounded-2xl border border-dashed border-blue-200 p-8 text-center space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Get Instant Resume Feedback</h3>
          <button 
            onClick={() => handleActionClick(() => {
              setShowWizard(true);
              const el = document.getElementById('interactive-wizard-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            })}
            className="px-8 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs uppercase rounded-full shadow transition-all"
          >
            Scan Your Resume Now
          </button>
          <p className="text-xs text-slate-500">
            Don't have a resume yet? Use our AI Resume Builder to create a professional, ATS-friendly resume in minutes.
          </p>
        </div>
      </div>

      {/* 4. How It Works Section */}
      <div className="py-20 px-6 sm:px-12 lg:px-24 bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900">How Our Resume Checker Works</h2>
            <p className="text-slate-500 text-sm">Four simple steps to polish your resume and impress employers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { num: "1", title: "Upload your resume", text: "Upload your resume or create a new one and check its score in our dashboard." },
              { num: "2", title: "Get your score", text: "Read your free resume review report and follow the tips to polish your resume." },
              { num: "3", title: "Apply changes", text: "Click 'Fix My Resume' to instantly optimize your resume or fix the errors manually." },
              { num: "4", title: "Download and send", text: "Select 'Done' when finished and download your flawless resume in your desired format." }
            ].map((step, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 font-black flex items-center justify-center shrink-0">
                  {step.num}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button 
              onClick={() => handleActionClick(() => {
                setShowWizard(true);
                const el = document.getElementById('interactive-wizard-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              })}
              className="px-8 py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs uppercase rounded-full shadow transition-all"
            >
              Optimize Your Resume Now
            </button>
          </div>
        </div>
      </div>

      {/* 5. What You Get Section */}
      <div className="py-20 px-6 sm:px-12 lg:px-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900">What You Get With TonyCV's Resume Checker</h2>
            <p className="text-slate-500 text-sm">Our resume checker comes with a resume builder that has everything you need to create a job-winning resume in just a few clicks.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Image Mockup */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl flex flex-col items-center max-w-md w-full relative">
                {/* Simulated Paper CV */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md w-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">RH</div>
                    <div className="text-left">
                      <h5 className="text-xs font-bold text-slate-800">Robert Hahn</h5>
                      <span className="text-[8px] text-slate-400 font-semibold uppercase">Marketing Manager</span>
                    </div>
                  </div>
                  <div className="space-y-2 border-b border-slate-100 pb-4 mb-4">
                    <div className="h-1.5 w-full bg-slate-100 rounded" />
                    <div className="h-1.5 w-5/6 bg-slate-100 rounded" />
                  </div>
                  
                  {/* Gauge indicator inside CV mockup */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="48 100" />
                      </svg>
                      <span className="absolute text-[10px] font-black text-slate-900">48</span>
                    </div>
                    <div className="text-left text-[10px]">
                      <p className="font-bold text-slate-800">48 Average</p>
                      <p className="text-[8px] text-red-500 font-bold uppercase mt-0.5">! 4 suggested improvements</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Features Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900">ATS-focused check</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Run your resume through our ATS resume checker to get a score and step-by-step tips to help you pass the ATS and get noticed by employers. Our tool scans for keywords, formatting issues, and other ATS blockers so you can improve your chances of landing an interview.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 6. Reviews Carousel Section */}
      <div className="py-20 px-6 sm:px-12 lg:px-24 bg-slate-50 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <h2 className="text-3xl font-extrabold text-slate-900 text-center">See Why Job Seekers Rely on Us</h2>
          
          <div className="flex items-center justify-center gap-4">
            <button className="p-3 bg-white border border-slate-200 rounded-full shadow hover:bg-slate-50 text-slate-600 transition-all shrink-0">
              <FiArrowLeft size={16} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-hidden w-full py-2">
              {reviews.map((r, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-3 shrink-0 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                      <span className="bg-emerald-500 text-white p-0.5 rounded text-[8px]">★</span>
                      <span className="bg-emerald-500 text-white p-0.5 rounded text-[8px]">★</span>
                      <span className="bg-emerald-500 text-white p-0.5 rounded text-[8px]">★</span>
                      <span className="bg-emerald-500 text-white p-0.5 rounded text-[8px]">★</span>
                      <span className="bg-emerald-500 text-white p-0.5 rounded text-[8px]">★</span>
                      <span className="text-[10px] text-gray-400 font-bold ml-1">✓ Invited</span>
                    </div>
                    <h5 className="font-extrabold text-slate-900 text-xs truncate">{r.title}</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">"{r.text}"</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                    <span className="font-bold text-slate-500">{r.author}</span>
                    <span>{r.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="p-3 bg-white border border-slate-200 rounded-full shadow hover:bg-slate-50 text-slate-600 transition-all shrink-0">
              <FiArrowRight size={16} />
            </button>
          </div>
          
          <div className="text-center text-xs font-semibold text-slate-500 space-y-1">
            <p>Rated <span className="font-extrabold text-slate-900">4.3 / 5</span> based on <span className="text-blue-600 underline cursor-pointer">12,413 reviews</span>. Showing our 4 & 5 star reviews.</p>
            <div className="flex justify-center items-center gap-1 text-[11px] font-black text-emerald-600">
              <span>★</span> Trustpilot
            </div>
          </div>
        </div>
      </div>

      {/* 7. Template Transformation Section */}
      <div className="py-20 px-6 sm:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Real-time CV Preview Frame */}
          <div className="lg:col-span-6 flex flex-col items-center space-y-4">
            <div className="border border-slate-200 bg-slate-100 p-6 rounded-2xl shadow-xl w-full max-w-md min-h-[460px] flex flex-col justify-between relative overflow-hidden">
              
              {/* Fake Template Cascade */}
              {activeTemplate === 'Cascade' && (
                <div className="bg-white rounded-xl flex flex-row h-full min-h-[400px] border border-slate-200 overflow-hidden shadow">
                  <div className="w-1/3 bg-blue-900 text-white p-4 space-y-4 text-left">
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-xs">Edwin L. Fleming</h4>
                      <p className="text-[7px] text-blue-200 font-bold uppercase">Elementary Teacher</p>
                    </div>
                    <div className="h-0.5 bg-blue-800" />
                    <div className="space-y-2">
                      <span className="text-[7px] text-blue-200 font-bold uppercase">Contact</span>
                      <div className="h-1.5 w-full bg-blue-800 rounded" />
                      <div className="h-1.5 w-4/5 bg-blue-800 rounded" />
                    </div>
                  </div>
                  <div className="w-2/3 p-4 space-y-4 text-left">
                    <div className="space-y-1.5">
                      <span className="text-[8px] text-blue-900 font-bold uppercase">Experience</span>
                      <div className="h-1.5 w-full bg-slate-100 rounded" />
                      <div className="h-1.5 w-5/6 bg-slate-100 rounded" />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[8px] text-blue-900 font-bold uppercase">Education</span>
                      <div className="h-1.5 w-3/4 bg-slate-100 rounded" />
                    </div>
                  </div>
                </div>
              )}

              {/* Fake Template Cubic */}
              {activeTemplate === 'Cubic' && (
                <div className="bg-white rounded-xl flex flex-col h-full min-h-[400px] border border-slate-200 overflow-hidden shadow">
                  <div className="bg-emerald-800 text-white p-4 space-y-1 text-left">
                    <h4 className="font-extrabold text-sm">Anna R. Smith</h4>
                    <p className="text-[8px] text-emerald-200 font-bold uppercase">Project Manager</p>
                  </div>
                  <div className="p-4 grid grid-cols-12 gap-4 text-left">
                    <div className="col-span-8 space-y-3">
                      <span className="text-[8px] text-emerald-800 font-bold uppercase">Work Experience</span>
                      <div className="h-1.5 w-full bg-slate-100 rounded" />
                      <div className="h-1.5 w-5/6 bg-slate-100 rounded" />
                    </div>
                    <div className="col-span-4 space-y-3 border-l border-slate-100 pl-3">
                      <span className="text-[8px] text-emerald-800 font-bold uppercase">Skills</span>
                      <div className="h-1.5 w-full bg-slate-100 rounded" />
                      <div className="h-1.5 w-full bg-slate-100 rounded" />
                    </div>
                  </div>
                </div>
              )}

              {/* Fake Template Crisp */}
              {activeTemplate === 'Crisp' && (
                <div className="bg-white rounded-xl flex flex-col h-full min-h-[400px] border border-slate-200 p-5 shadow text-left space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="font-black text-lg text-slate-800">Harmony Blackwell</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Key Account Director</p>
                  </div>
                  <div className="space-y-3">
                    <span className="text-[9px] text-blue-600 font-bold uppercase">Professional Experience</span>
                    <div className="h-1.5 w-full bg-slate-100 rounded" />
                    <div className="h-1.5 w-11/12 bg-slate-100 rounded" />
                  </div>
                  <div className="space-y-3">
                    <span className="text-[9px] text-blue-600 font-bold uppercase">Education</span>
                    <div className="h-1.5 w-3/4 bg-slate-100 rounded" />
                  </div>
                </div>
              )}

              {/* Toggle handle indicator */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full p-2.5 shadow-lg flex items-center justify-center cursor-pointer hover:scale-115 transition-all">
                <span className="text-[8px] font-bold tracking-widest uppercase flex gap-1">◀ ▶</span>
              </div>
            </div>
            <button 
              onClick={() => {
                setShowWizard(true);
                const el = document.getElementById('interactive-wizard-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-md transition-all"
            >
              Use This Template
            </button>
          </div>

          {/* Right Column: Template details */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <h2 className="text-3xl font-extrabold text-slate-900">See How The Right Template Transforms Your Resume</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Anyone can spot a good-looking resume—but experts know what makes one truly effective. Our professionally designed templates help you create a resume that's both eye-catching and built to perform.
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              {['Cascade', 'Cubic', 'Crisp'].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTemplate(t)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    activeTemplate === t 
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600' 
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="h-12 w-full bg-slate-100 rounded mb-2 overflow-hidden flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase">
                    {t === 'Cascade' && 'Blue Sidebar'}
                    {t === 'Cubic' && 'Green Header'}
                    {t === 'Crisp' && 'Classic White'}
                  </div>
                  <span className="text-xs font-bold text-slate-800">{t}</span>
                </button>
              ))}
            </div>

            <button onClick={() => navigate('/resume-builder')} className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1.5 pt-2">
              See All Resume Templates <FiArrowRight size={14} />
            </button>
          </div>

        </div>
      </div>

      {/* 8. Frequently Asked Questions Accordion */}
      <div className="py-20 px-6 sm:px-12 lg:px-24 bg-slate-50 border-t border-b border-slate-200">
        <div className="max-w-3xl mx-auto space-y-12">
          <h2 className="text-3xl font-extrabold text-slate-900 text-center">Frequently Asked Questions about ATS Resume Checker</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex justify-between items-center text-slate-800 hover:bg-slate-50 transition-colors font-bold text-sm"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <FiChevronUp size={18} className="text-slate-500" /> : <FiChevronDown size={18} className="text-slate-500" />}
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-slate-100 p-5 text-xs text-slate-500 leading-relaxed bg-slate-50/50"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 9. Bottom Transform Career CTA Banner */}
      <div className="py-16 px-6 sm:px-12 lg:px-24 bg-white">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-10 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold max-w-xl mx-auto leading-tight">
            Transform your career today and join thousands of satisfied users
          </h2>
          <button 
            onClick={() => {
              setShowWizard(true);
              const el = document.getElementById('interactive-wizard-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 text-sm font-extrabold uppercase rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-100"
          >
            Create Your Resume Now
          </button>
          
          <div className="pt-8 border-t border-blue-500/30 flex justify-between items-center text-xs text-blue-200 font-medium">
            <span>Last updated: August 8, 2025</span>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:underline flex items-center gap-1">
              Back to Top ↑
            </button>
          </div>
        </div>
      </div>

      {/* 10. Zety Inspired Brand Footer */}
      <footer className="bg-[#0b0e17] text-gray-400 pt-16 pb-8 px-6 sm:px-12 lg:px-24 border-t border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Upper Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs">
            
            {/* Logo and Pitch */}
            <div className="space-y-4 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <FiCpu className="text-white" size={16} />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">Tony<span className="text-blue-500">CV</span></span>
              </div>
              <p className="leading-relaxed text-gray-500">
                TonyCV's resume templates and job-winning resume builder and cover letter generator are powered by the best career experts and data-driven career insights.
              </p>
              <button 
                onClick={() => {
                  setShowWizard(true);
                  const el = document.getElementById('interactive-wizard-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold uppercase rounded-lg text-center text-[10px] transition-colors"
              >
                Create My Resume
              </button>
              <div className="flex gap-3 text-white">
                <a href="#" className="hover:text-blue-500 transition-colors"><FiFacebook size={16} /></a>
                <a href="#" className="hover:text-blue-500 transition-colors"><FiLinkedin size={16} /></a>
              </div>
              <div className="space-y-1 text-gray-500">
                <p className="flex items-center gap-1.5"><FiPhone size={12} /> Call us: +91 88666 71624</p>
                <p className="flex items-center gap-1.5"><FiMail size={12} /> Email: rawatnaksh67@gmail.com</p>
              </div>
            </div>

            {/* Columns... */}
            <div className="space-y-3">
              <h5 className="font-extrabold text-white uppercase tracking-wider">Resume</h5>
              <ul className="space-y-2 text-gray-500">
                <li><button onClick={() => navigate('/resume-builder')} className="hover:underline hover:text-white transition-colors text-left">Resume Builder</button></li>
                <li><button onClick={() => navigate('/resume-builder')} className="hover:underline hover:text-white transition-colors text-left">Resume Templates</button></li>
                <li><button onClick={() => navigate('/analyze')} className="hover:underline hover:text-white transition-colors text-left">Resume Checker</button></li>
                <li><button onClick={() => navigate('/resume-builder')} className="hover:underline hover:text-white transition-colors text-left">Resume Examples</button></li>
                <li><button onClick={() => navigate('/career-blog')} className="hover:underline hover:text-white transition-colors text-left">Best Resume Format</button></li>
                <li><button onClick={() => navigate('/career-blog')} className="hover:underline hover:text-white transition-colors text-left">How to Write a Resume</button></li>
                <li><button onClick={() => navigate('/analyze')} className="hover:underline hover:text-white transition-colors text-left">Resume Help</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-extrabold text-white uppercase tracking-wider">CV</h5>
              <ul className="space-y-2 text-gray-500">
                <li><button onClick={() => navigate('/cv')} className="hover:underline hover:text-white transition-colors text-left">CV Builder</button></li>
                <li><button onClick={() => navigate('/cv')} className="hover:underline hover:text-white transition-colors text-left">CV Templates</button></li>
                <li><button onClick={() => navigate('/cv')} className="hover:underline hover:text-white transition-colors text-left">CV Examples</button></li>
                <li><button onClick={() => navigate('/cv')} className="hover:underline hover:text-white transition-colors text-left">CV Format</button></li>
                <li><button onClick={() => navigate('/cv')} className="hover:underline hover:text-white transition-colors text-left">How to Write a CV</button></li>
                <li><button onClick={() => navigate('/cv')} className="hover:underline hover:text-white transition-colors text-left">CV Help</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-extrabold text-white uppercase tracking-wider">Cover Letter</h5>
              <ul className="space-y-2 text-gray-500">
                <li><button onClick={() => navigate('/cover-letter')} className="hover:underline hover:text-white transition-colors text-left">Cover Letter Builder</button></li>
                <li><button onClick={() => navigate('/cover-letter')} className="hover:underline hover:text-white transition-colors text-left">Cover Letter Templates</button></li>
                <li><button onClick={() => navigate('/cover-letter')} className="hover:underline hover:text-white transition-colors text-left">Cover Letter Examples</button></li>
                <li><button onClick={() => navigate('/cover-letter')} className="hover:underline hover:text-white transition-colors text-left">Cover Letter Format</button></li>
                <li><button onClick={() => navigate('/cover-letter')} className="hover:underline hover:text-white transition-colors text-left">How to Write a Cover Letter</button></li>
                <li><button onClick={() => navigate('/cover-letter')} className="hover:underline hover:text-white transition-colors text-left">Cover Letter Help</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-extrabold text-white uppercase tracking-wider">Support</h5>
              <ul className="space-y-2 text-gray-500">
                <li><button onClick={() => navigate('/about')} className="hover:underline hover:text-white transition-colors text-left">About</button></li>
                <li><button onClick={() => navigate('/analyze')} className="hover:underline hover:text-white transition-colors text-left">Pricing</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:underline hover:text-white transition-colors text-left">Contact</button></li>
                <li><button onClick={() => navigate('/career-blog')} className="hover:underline hover:text-white transition-colors text-left">Editorial Guidelines</button></li>
                <li><button onClick={() => navigate('/career-blog')} className="hover:underline hover:text-white transition-colors text-left">Media Mentions</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:underline hover:text-white transition-colors text-left">Accessibility</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:underline hover:text-white transition-colors text-left">Affiliates</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:underline hover:text-white transition-colors text-left">Privacy Policy</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:underline hover:text-white transition-colors text-left">Terms of service</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:underline hover:text-white transition-colors text-left">Cookies Policy</button></li>
              </ul>
            </div>

          </div>

          {/* Region Chooser */}
          <div className="border-t border-slate-800 pt-6 text-[10px] text-gray-500 font-semibold flex flex-wrap gap-x-4 gap-y-2 items-center">
            <span className="text-gray-400">CHOOSE YOUR REGION:</span>
            <span className="hover:text-blue-500 cursor-pointer">English (IN)</span>
            <span className="hover:text-blue-500 cursor-pointer">English (UK)</span>
            <span className="hover:text-blue-500 cursor-pointer">English (US)</span>
            <span className="hover:text-blue-500 cursor-pointer">Deutsch</span>
            <span className="hover:text-blue-500 cursor-pointer">Español</span>
            <span className="hover:text-blue-500 cursor-pointer">Français (France)</span>
            <span className="hover:text-blue-500 cursor-pointer">Italiano</span>
            <span className="hover:text-blue-500 cursor-pointer">Polski</span>
            <span className="hover:text-blue-500 cursor-pointer">Português (Brasil)</span>
          </div>

          {/* Copy Bar */}
          <div className="text-center text-[10px] text-gray-600 border-t border-slate-800/40 pt-4">
            <p>© {new Date().getFullYear()} TonyCV. All rights reserved. Powered by semantic BERT matching algorithms.</p>
          </div>

        </div>
      </footer>

      {/* Registration & Login Popup wrapper */}
      <RegisterPopup 
        isOpen={registerOpen} 
        onClose={() => setRegisterOpen(false)} 
        onAuthSuccess={(u) => setUser(u)}
      />

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
