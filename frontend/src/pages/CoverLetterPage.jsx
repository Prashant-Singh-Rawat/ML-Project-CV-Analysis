import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiFileText, FiArrowRight, FiEdit3, FiCheck, FiMessageSquare,
  FiDownload, FiZap, FiStar
} from 'react-icons/fi';

const LETTER_TYPES = [
  { title: 'Application Letter', desc: 'Introduce yourself and explain why you want the role.', icon: '📝' },
  { title: 'Referral Letter', desc: 'When someone at the company referred you for the position.', icon: '🤝' },
  { title: 'Cold Cover Letter', desc: 'Reach out to a company that hasn\'t advertised a role.', icon: '📬' },
  { title: 'Career Change Letter', desc: 'Explain your pivot and transferable skills.', icon: '🔄' },
];

const TIPS = [
  { num: '01', title: 'Address the Hiring Manager', tip: 'Always find and use the hiring manager\'s name. "Dear Mr. Smith" beats "To Whom It May Concern" every time.' },
  { num: '02', title: 'Open with Impact', tip: 'Start with a compelling hook that immediately shows your value — not "I am applying for…"' },
  { num: '03', title: 'Match the Job Description', tip: 'Mirror the language and keywords from the job posting. ATS systems scan cover letters too.' },
  { num: '04', title: 'Show, Don\'t Tell', tip: 'Back up every claim with a specific, measurable achievement. Numbers create credibility.' },
  { num: '05', title: 'Keep It to One Page', tip: 'Hiring managers spend 7 seconds on a cover letter. Be concise, compelling, and scannable.' },
  { num: '06', title: 'End with a CTA', tip: 'Close by requesting a specific next step: "I\'d love to discuss this opportunity in an interview."' },
];

const TEMPLATE_SAMPLE = `Dear [Hiring Manager's Name],

I am excited to apply for the [Job Title] position at [Company Name]. With [X] years of experience in [field], I have developed a proven track record of [key achievement].

In my current role at [Current Company], I [specific achievement with numbers]. This experience has equipped me with [relevant skills that match the job].

I am particularly drawn to [Company Name] because [specific reason showing research]. I believe my background in [skill/experience] aligns perfectly with your team's goals.

I would welcome the opportunity to discuss how my experience can contribute to [Company Name]'s continued success. Thank you for your consideration.

Warm regards,
[Your Name]`;

export default function CoverLetterPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(TEMPLATE_SAMPLE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 py-20 px-6 text-white text-center relative overflow-hidden">
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6">
            <FiMessageSquare size={12} /> Cover Letter Builder
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            Write a Cover Letter<br />
            <span className="text-amber-400">That Gets Read</span>
          </h1>
          <p className="text-emerald-100 text-lg max-w-xl mx-auto mb-8">
            A great cover letter is your first impression. Use our templates and AI-powered tips to craft a compelling letter that makes hiring managers take notice.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/analyze')}
            className="px-10 py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-sm uppercase rounded-full shadow-xl"
          >
            Write My Cover Letter <FiArrowRight className="inline ml-2" size={16} />
          </motion.button>
        </div>
      </div>

      {/* Cover Letter Types */}
      <div className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-10">Types of Cover Letters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LETTER_TYPES.map((lt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 text-center hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate('/analyze')}
            >
              <div className="text-4xl mb-4">{lt.icon}</div>
              <h3 className="font-bold text-slate-900 mb-2">{lt.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{lt.desc}</p>
              <div className="mt-4 text-emerald-600 text-xs font-bold flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Use this type <FiArrowRight size={12} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Template Sample */}
      <div className="py-16 px-6 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-4">Cover Letter Template</h2>
          <p className="text-slate-500 text-center mb-8">Copy this professional template and customise it for your application.</p>
          <div className="relative bg-slate-900 rounded-2xl p-6 text-sm font-mono text-slate-300 leading-relaxed whitespace-pre-line border border-slate-700 shadow-2xl">
            <button
              onClick={handleCopy}
              className={`absolute top-4 right-4 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                copied ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {copied ? <><FiCheck size={12} /> Copied!</> : <><FiEdit3 size={12} /> Copy</>}
            </button>
            {TEMPLATE_SAMPLE}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="py-16 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-10">6 Cover Letter Tips That Actually Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TIPS.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all"
              >
                <span className="text-2xl font-black text-slate-200">{tip.num}</span>
                <h3 className="font-bold text-slate-900 mt-1 mb-2">{tip.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{tip.tip}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 px-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-center">
        <h2 className="text-3xl font-extrabold mb-4">Ready to Write Your Cover Letter?</h2>
        <p className="text-emerald-100 mb-8 max-w-md mx-auto">Use our AI-powered tool to craft a personalised, compelling cover letter in under 5 minutes.</p>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/analyze')}
          className="px-10 py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold uppercase rounded-full shadow-xl"
        >
          Start Writing <FiArrowRight className="inline ml-2" size={16} />
        </motion.button>
      </div>
    </div>
  );
}
