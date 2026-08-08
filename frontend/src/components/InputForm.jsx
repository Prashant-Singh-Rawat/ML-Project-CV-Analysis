import React, { useState, useRef, useEffect } from 'react';
import { FiUploadCloud, FiBriefcase, FiAward, FiArrowRight, FiMic, FiMicOff, FiX, FiChevronDown, FiCheck, FiSearch, FiUser, FiUsers, FiStar } from 'react-icons/fi';

const COMPANY_META = {
  Google:    { color: '#4285F4', bg: 'rgba(66,133,244,0.12)',  icon: '🔵' },
  Amazon:    { color: '#FF9900', bg: 'rgba(255,153,0,0.12)',   icon: '📦' },
  Microsoft: { color: '#00A4EF', bg: 'rgba(0,164,239,0.12)',  icon: '🪟' },
  Meta:      { color: '#1877F2', bg: 'rgba(24,119,242,0.12)', icon: '🌐' },
  Apple:     { color: '#A2AAAD', bg: 'rgba(162,170,173,0.12)', icon: '🍎' },
  Netflix:   { color: '#E50914', bg: 'rgba(229,9,20,0.12)',   icon: '🎬' },
  Infosys:   { color: '#007DC1', bg: 'rgba(0,125,193,0.12)', icon: '💼' },
  TCS:       { color: '#A100FF', bg: 'rgba(161,0,255,0.12)',  icon: '🏢' },
  Oracle:    { color: '#F80000', bg: 'rgba(248,0,0,0.12)',    icon: '🔴' },
  IBM:       { color: '#1F70C1', bg: 'rgba(31,112,193,0.12)', icon: '🔷' },
  Adobe:     { color: '#FF0000', bg: 'rgba(255,0,0,0.12)',    icon: '🎨' },
};

const CompanyDropdown = ({ value, onChange, companies }) => {
  const [open, setOpen]         = useState(false);
  const [search, setSearch]     = useState('');
  const dropdownRef             = useRef(null);
  const searchRef               = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
      }
    };
    if (open) {
      document.addEventListener('mousedown', handler);
    }
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [open]);

  const filtered = companies.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  const selected = companies.find(c => c === value);
  const meta = selected ? (COMPANY_META[selected] || { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', icon: '🏢' }) : null;

  return (
    <div ref={dropdownRef} className="relative w-full" style={{ zIndex: open ? 1000 : 1 }}>
      <button
        id="company-dropdown-trigger"
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-xl bg-white text-left transition-all"
      >
        {selected ? (
          <>
            <span className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 text-lg" style={{ background: meta.bg }}>
              {meta.icon}
            </span>
            <span className="flex-1 text-slate-800 font-bold truncate">{selected}</span>
          </>
        ) : (
          <>
            <FiBriefcase size={18} className="text-slate-500 shrink-0" />
            <span className="flex-1 text-slate-400 text-sm font-medium">Select a company (Optional)</span>
          </>
        )}
        <FiChevronDown size={18} className={`shrink-0 transition-transform text-slate-500 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden" style={{ zIndex: 1001 }}>
          {companies.length > 5 && (
            <div className="p-2 border-b border-slate-100">
              <div className="relative">
                <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search company..."
                  className="w-full rounded-lg py-2 pl-9 pr-3 text-sm text-slate-800 border border-slate-200 outline-none"
                />
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto p-1.5 custom-scrollbar bg-white">
            {filtered.length === 0 ? (
              <div className="py-4 text-center text-slate-400 text-sm">No companies found</div>
            ) : filtered.map(company => {
              const m = COMPANY_META[company] || { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', icon: '🏢' };
              const isSelected = company === value;
              return (
                <button
                  key={company}
                  type="button"
                  onClick={() => {
                    onChange(company);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 text-lg" style={{ background: m.bg }}>
                    {m.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate text-slate-800">{company}</div>
                  </div>
                  {isSelected && <FiCheck size={16} className="text-blue-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Stage-driven loading configuration.
 * Each stage corresponds to a real backend processing step.
 * Progress bar fills proportionally based on stage index — not fake time estimates.
 */
const ANALYSIS_STAGES = {
  connecting: {
    icon: '⏳',
    text: 'Connecting to TonyCV AI Engine',
    sub: 'Establishing connection to the AI backend…',
    progress: 5,
  },
  waking: {
    icon: '⏳',
    text: 'Waking up AI backend',
    sub: 'The server is starting up — this takes 30–90s on free hosting. Please don\'t close this tab.',
    progress: 20,
  },
  ready: {
    icon: '✓',
    text: 'AI backend ready',
    sub: 'Starting resume analysis…',
    progress: 35,
    accent: '#10b981',
  },
  parsing: {
    icon: '📄',
    text: 'Processing your resume',
    sub: 'Extracting text, structure and entities from your PDF…',
    progress: 55,
  },
  analyzing: {
    icon: '🧠',
    text: 'AI analysis in progress',
    sub: 'Evaluating skills, experience, education and ATS compatibility…',
    progress: 75,
  },
  finishing: {
    icon: '📊',
    text: 'Generating insights',
    sub: 'Preparing your personalised recommendations and hiring score…',
    progress: 90,
  },
  complete: {
    icon: '✓',
    text: 'Analysis complete!',
    sub: 'Your CV analysis is ready. Loading results…',
    progress: 100,
    accent: '#10b981',
  },
  timeout: {
    icon: '⚠️',
    text: 'Server taking longer than expected',
    sub: 'The AI backend is under high load. Your CV is ready — you can retry.',
    progress: 0,
    accent: '#f59e0b',
  },
};

const InputForm = ({ onAnalyze, isLoading, companies, analysisStage }) => {
  const [cvFile, setCvFile]             = useState(null);
  const [cgpa, setCgpa]                 = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [githubUrl, setGithubUrl]       = useState('');
  const [experienceLevel, setExperienceLevel] = useState('fresher');
  const [, setDragOver]         = useState(false);
  const [elapsed, setElapsed]           = useState(0);
  const elapsedRef                      = useRef(null);
  // Track whether we've already started (to show retry hint)
  const [hasAttempted, setHasAttempted] = useState(false);

  // Voice Input State
  const [isListening, setIsListening]   = useState(false);
  const [voiceText, setVoiceText]       = useState('');
  const [, setDetectedSkills] = useState([]);
  const recognitionRef                  = useRef(null);

  const KNOWN_SKILLS = [
    'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin', 'TypeScript', 'JavaScript',
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot',
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform',
    'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'TensorFlow', 'PyTorch',
    'Data Analysis', 'Pandas', 'NumPy', 'Git', 'GitHub', 'HTML', 'CSS',
  ];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        const fullText = (voiceText + ' ' + finalTranscript).trim();
        if (finalTranscript) {
          setVoiceText(fullText);
          const text = fullText.toLowerCase();
          const found = KNOWN_SKILLS.filter(skill => text.includes(skill.toLowerCase()));
          setDetectedSkills([...new Set(found)]);
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend   = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Elapsed timer — for secondary display only (not for progress bar)
  useEffect(() => {
    if (isLoading) {
      setElapsed(0);
      setHasAttempted(true);
      elapsedRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    } else {
      clearInterval(elapsedRef.current);
    }
    return () => clearInterval(elapsedRef.current);
  }, [isLoading]);

  // Resolve the current stage config from the analysisStage prop
  const activeStage = ANALYSIS_STAGES[analysisStage] || ANALYSIS_STAGES.connecting;

  const _toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setVoiceText('');
      setDetectedSkills([]);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const _removeSkill = (skill) => setDetectedSkills(prev => prev.filter(s => s !== skill));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cvFile) {
      alert('Please upload your Resume/CV PDF file.');
      return;
    }
    // Validate file type client-side (backend also validates independently)
    if (!cvFile.name.toLowerCase().endsWith('.pdf') && cvFile.type !== 'application/pdf') {
      alert('Only PDF files are supported. Please upload a .pdf file.');
      return;
    }
    // Validate file size client-side (5 MB limit)
    if (cvFile.size > 5 * 1024 * 1024) {
      alert('File is too large. Please upload a PDF under 5 MB.');
      return;
    }
    // Create form data — the File object stays in React state (cvFile),
    // so the user does not need to re-select the file on retry.
    const fd = new FormData();
    fd.append('cv_file', cvFile);
    if (cgpa) fd.append('cgpa', parseFloat(cgpa));
    if (targetCompany) fd.append('target_company', targetCompany);
    if (githubUrl) fd.append('github_url', githubUrl);
    fd.append('experience_level', experienceLevel);

    onAnalyze(fd);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const _supportsVoice = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  const companyList = companies && companies.length > 0 ? companies : [
    "Google", "Amazon", "Microsoft", "Meta", "Apple",
    "Netflix", "Infosys", "TCS", "Oracle", "IBM", "Adobe"
  ];

  const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 bg-white transition";

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xl max-w-2xl mx-auto text-left">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <FiUploadCloud size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Optimize Your CV</h2>
          <p className="text-slate-400 text-xs mt-0.5">Simply upload your resume PDF and we'll instantly grade & customize it.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Zone */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Resume / CV (PDF Only)</label>
          <div
            className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${cvFile ? 'border-blue-500 bg-blue-50/10' : 'border-slate-200 hover:border-blue-400 bg-slate-50/50'}`}
            onClick={() => document.getElementById('cv-upload').click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              id="cv-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setCvFile(e.target.files[0])}
            />
            <div className={`p-4 rounded-2xl transition-all ${cvFile ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
              <FiUploadCloud size={28} />
            </div>
            <div className="text-center">
              <p className="text-slate-700 font-bold text-sm">
                {cvFile ? cvFile.name : 'Click to upload or drag & drop'}
              </p>
              <p className="text-slate-400 text-xs mt-1">
                {cvFile ? `${(cvFile.size / 1024 / 1024).toFixed(2)} MB • PDF` : 'PDF only • Max 5MB'}
              </p>
            </div>
            {cvFile && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setCvFile(null); }}
                className="text-xs text-red-500 hover:underline mt-2 font-bold"
              >
                Remove File
              </button>
            )}
          </div>
        </div>

        {/* CGPA & Company Fields (Optional) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
              <FiAward size={14} /> CGPA <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="number"
              step="0.1"
              max="10"
              min="0"
              className={inputCls}
              placeholder="e.g. 8.5"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
              <FiBriefcase size={14} /> Target Company <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <CompanyDropdown
              value={targetCompany}
              onChange={setTargetCompany}
              companies={companyList}
            />
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
            <FiUsers size={14} /> Experience Level
          </label>
          <div className="grid grid-cols-3 gap-2 border border-slate-200 p-1.5 rounded-2xl bg-white">
            {[
              { id: 'fresher', label: 'Fresher', icon: <FiUser size={16} />, sub: '0-1 years', color: '#10b981' },
              { id: 'experienced', label: 'Experienced', icon: <FiUsers size={16} />, sub: '2-5 years', color: '#f59e0b' },
              { id: 'highly_experienced', label: 'Highly Exp.', icon: <FiStar size={16} />, sub: '5+ years', color: '#8b5cf6' },
            ].map(exp => (
              <button
                key={exp.id}
                type="button"
                onClick={() => setExperienceLevel(exp.id)}
                className={`relative flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl transition-all ${experienceLevel === exp.id ? 'text-slate-800' : 'text-slate-500 hover:text-slate-600 hover:bg-slate-50'}`}
                style={experienceLevel === exp.id ? {
                  background: `linear-gradient(135deg, ${exp.color}15, ${exp.color}05)`,
                  border: `1px solid ${exp.color}40`,
                } : { border: '1px solid transparent' }}
              >
                <div style={{ color: experienceLevel === exp.id ? exp.color : 'inherit' }}>
                  {exp.icon}
                </div>
                <span className="text-xs font-bold">{exp.label}</span>
                <span className="text-[9px] text-slate-400 font-medium">{exp.sub}</span>
                {experienceLevel === exp.id && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: exp.color }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* GitHub Link (Optional) */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            GitHub Profile URL <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="url"
            className={inputCls}
            placeholder="e.g. https://github.com/username"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
          />
        </div>

        {/* Submit Button + Loading Progress */}
        {isLoading ? (
          <div
            className="w-full rounded-2xl overflow-hidden border bg-gradient-to-br from-blue-50 to-indigo-50 p-4"
            style={{ borderColor: activeStage.accent ? `${activeStage.accent}40` : '#bfdbfe' }}
          >
            {/* Real stage-based progress bar — NOT fake time percentage */}
            <div className="h-1.5 bg-blue-100 rounded-full mb-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${activeStage.progress}%`,
                  background: activeStage.accent
                    ? `linear-gradient(90deg, ${activeStage.accent}, ${activeStage.accent}cc)`
                    : 'linear-gradient(90deg, #3b82f6, #6366f1)',
                }}
              />
            </div>
            {/* Stage status */}
            <div className="flex items-center gap-3">
              {/* Spinner — hidden on complete/timeout stages */}
              {analysisStage !== 'complete' && analysisStage !== 'timeout' ? (
                <div
                  className="w-5 h-5 border-2 rounded-full animate-spin shrink-0"
                  style={{
                    borderColor: activeStage.accent ? `${activeStage.accent}40` : '#bfdbfe',
                    borderTopColor: activeStage.accent || '#2563eb',
                  }}
                />
              ) : (
                <span className="text-lg shrink-0">{activeStage.icon}</span>
              )}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-bold truncate"
                  style={{ color: activeStage.accent || '#1e40af' }}
                >
                  {activeStage.text}
                </p>
                <p className="text-xs text-blue-500 mt-0.5 leading-snug">{activeStage.sub}</p>
              </div>
              <span className="ml-auto text-xs font-mono text-blue-400 shrink-0">{elapsed}s</span>
            </div>
            {/* Waking stage hint — shown only when backend is actually sleeping */}
            {analysisStage === 'waking' && elapsed >= 20 && (
              <p className="mt-2 text-xs text-amber-600 font-semibold text-center">
                ⚡ Render free tier servers sleep after 15 min of inactivity. Hang tight!
              </p>
            )}
          </div>
        ) : (
          <button
            type="submit"
            disabled={!cvFile}
            className="w-full py-4 rounded-2xl text-white font-extrabold text-base shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            style={{ background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)' }}
          >
            {hasAttempted ? 'Retry Analysis' : 'Upload & Grade CV'} <FiArrowRight />
          </button>
        )}
      </form>
    </div>
  );
};

export default InputForm;
