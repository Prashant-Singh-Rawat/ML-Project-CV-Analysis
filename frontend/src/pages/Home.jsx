import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFileText, FiCheck, FiArrowRight, FiCheckCircle, FiEdit3, 
  FiLayout, FiMessageSquare, FiSliders, FiHelpCircle, FiSearch,
  FiBriefcase, FiZap, FiCpu, FiTrendingUp, FiStar, FiChevronDown, 
  FiChevronUp, FiFacebook, FiLinkedin, FiPhone, FiMail, FiArrowLeft
} from 'react-icons/fi';

export default function Home() {
  const navigate = useNavigate();

  // Template Preview Switcher State
  const [activeTemplate, setActiveTemplate] = useState('Cascade');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

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
                onClick={() => navigate('/analyze')}
                className="px-8 py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 text-sm font-extrabold uppercase rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-100 animate-pulse"
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
            onClick={() => navigate('/analyze')}
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
              onClick={() => navigate('/analyze')}
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

      {/* 6. NEW: Trustpilot Reviews Carousel Section */}
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

      {/* 7. NEW: Interactive Template Transformation Section */}
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
              onClick={() => navigate('/analyze')}
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

            <p className="text-blue-600 text-xs font-bold hover:underline cursor-pointer flex items-center gap-1.5 pt-2">
              See All Resume Templates <FiArrowRight size={14} />
            </p>
          </div>

        </div>
      </div>

      {/* 8. NEW: Frequently Asked Questions Accordion */}
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

      {/* 9. NEW: Bottom Transform Career CTA Banner */}
      <div className="py-16 px-6 sm:px-12 lg:px-24 bg-white">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-10 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold max-w-xl mx-auto leading-tight">
            Transform your career today and join thousands of satisfied users
          </h2>
          <button 
            onClick={() => navigate('/analyze')}
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

      {/* 10. NEW: Zety Inspired Brand Footer */}
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
                onClick={() => navigate('/analyze')}
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold uppercase rounded-lg text-center text-[10px] transition-colors"
              >
                Create My Resume
              </button>
              <div className="flex gap-3 text-white">
                <a href="#" className="hover:text-blue-500 transition-colors"><FiFacebook size={16} /></a>
                <a href="#" className="hover:text-blue-500 transition-colors"><FiLinkedin size={16} /></a>
              </div>
              <div className="space-y-1 text-gray-500">
                <p className="flex items-center gap-1.5"><FiPhone size={12} /> Call us: 800-985-7561</p>
                <p className="flex items-center gap-1.5"><FiMail size={12} /> Email: support@zety.com</p>
              </div>
            </div>

            {/* Resume Columns */}
            <div className="space-y-3">
              <h5 className="font-extrabold text-white uppercase tracking-wider">Resume</h5>
              <ul className="space-y-2 text-gray-500">
                <li><span className="hover:underline cursor-pointer">Resume Builder</span></li>
                <li><span className="hover:underline cursor-pointer">Resume Templates</span></li>
                <li><span className="hover:underline cursor-pointer">Resume Checker</span></li>
                <li><span className="hover:underline cursor-pointer">Resume Examples</span></li>
                <li><span className="hover:underline cursor-pointer">Best Resume Format</span></li>
                <li><span className="hover:underline cursor-pointer">How to Write a Resume</span></li>
                <li><span className="hover:underline cursor-pointer">Resume Help</span></li>
              </ul>
            </div>

            {/* CV Columns */}
            <div className="space-y-3">
              <h5 className="font-extrabold text-white uppercase tracking-wider">CV</h5>
              <ul className="space-y-2 text-gray-500">
                <li><span className="hover:underline cursor-pointer">CV Builder</span></li>
                <li><span className="hover:underline cursor-pointer">CV Templates</span></li>
                <li><span className="hover:underline cursor-pointer">CV Examples</span></li>
                <li><span className="hover:underline cursor-pointer">CV Format</span></li>
                <li><span className="hover:underline cursor-pointer">How to Write a CV</span></li>
                <li><span className="hover:underline cursor-pointer">CV Help</span></li>
              </ul>
            </div>

            {/* Cover Letter Columns */}
            <div className="space-y-3">
              <h5 className="font-extrabold text-white uppercase tracking-wider">Cover Letter</h5>
              <ul className="space-y-2 text-gray-500">
                <li><span className="hover:underline cursor-pointer">Cover Letter Builder</span></li>
                <li><span className="hover:underline cursor-pointer">Cover Letter Templates</span></li>
                <li><span className="hover:underline cursor-pointer">Cover Letter Examples</span></li>
                <li><span className="hover:underline cursor-pointer">Cover Letter Format</span></li>
                <li><span className="hover:underline cursor-pointer">How to Write a Cover Letter</span></li>
                <li><span className="hover:underline cursor-pointer">Cover Letter Help</span></li>
              </ul>
            </div>

            {/* Support Columns */}
            <div className="space-y-3">
              <h5 className="font-extrabold text-white uppercase tracking-wider">Support</h5>
              <ul className="space-y-2 text-gray-500">
                <li><span className="hover:underline cursor-pointer">About</span></li>
                <li><span className="hover:underline cursor-pointer">Pricing</span></li>
                <li><span className="hover:underline cursor-pointer">Contact</span></li>
                <li><span className="hover:underline cursor-pointer">Editorial Guidelines</span></li>
                <li><span className="hover:underline cursor-pointer">Media Mentions</span></li>
                <li><span className="hover:underline cursor-pointer">Accessibility</span></li>
                <li><span className="hover:underline cursor-pointer">Affiliates</span></li>
                <li><span className="hover:underline cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:underline cursor-pointer">Terms of service</span></li>
                <li><span className="hover:underline cursor-pointer">Cookies Policy</span></li>
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

    </div>
  );
}
