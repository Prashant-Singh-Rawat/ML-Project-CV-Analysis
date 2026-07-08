import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCpu, FiArrowRight, FiUsers, FiStar, FiZap,
  FiShield, FiGlobe, FiTarget, FiTrendingUp, FiHeart
} from 'react-icons/fi';

const STATS = [
  { num: '2.4M+', label: 'Resumes Analysed' },
  { num: '94%', label: 'Interview Success Rate' },
  { num: '12+', label: 'AI Scoring Dimensions' },
  { num: '150+', label: 'Countries Supported' },
];

const TEAM = [
  { name: 'Tony Chen', role: 'Founder & CEO', initials: 'TC', color: '#2563eb', bio: 'Ex-Google recruiter with 10+ years in talent acquisition. Built TonyCV after seeing thousands of qualified candidates fail ATS filters.' },
  { name: 'Priya Sharma', role: 'Head of AI', initials: 'PS', color: '#8b5cf6', bio: 'PhD in Natural Language Processing from IIT Delhi. Leads our BERT-based semantic matching research.' },
  { name: 'Marcus Rivera', role: 'Lead Engineer', initials: 'MR', color: '#10b981', bio: 'Full-stack engineer specialising in scalable Python APIs and React interfaces. Previously at Infosys.' },
  { name: 'Aisha Thompson', role: 'Career Coach', initials: 'AT', color: '#f59e0b', bio: 'Certified career counsellor who has personally coached 500+ job seekers into their dream roles.' },
];

const VALUES = [
  { icon: <FiTarget size={24} />, title: 'Results-Driven', desc: 'Every feature we build is measured by one metric: does it help our users land more interviews?' },
  { icon: <FiShield size={24} />, title: 'Privacy First', desc: 'Your resume data is never sold, never stored longer than needed, and always encrypted in transit.' },
  { icon: <FiZap size={24} />, title: 'Accessible to All', desc: 'Career tools shouldn\'t be a luxury. Our core analyser is free — because everyone deserves a fair shot.' },
  { icon: <FiHeart size={24} />, title: 'Human-Centered AI', desc: 'AI assists — it doesn\'t replace. Our technology amplifies human potential rather than reducing it.' },
];

const TIMELINE = [
  { year: '2021', event: 'TonyCV founded in Bangalore with a simple mission: make ATS systems fair.' },
  { year: '2022', event: 'Launched our first BERT-based keyword analyser. 10,000 users in the first month.' },
  { year: '2023', event: 'Introduced live resume builder with PDF export. Partnered with 50+ universities.' },
  { year: '2024', event: 'Reached 1 million resumes analysed. Expanded to UK, US, and Southeast Asia.' },
  { year: '2025', event: 'Launched biometric interview prep and AI avatar coaching features.' },
  { year: '2026', event: 'Today: 2.4M+ users worldwide, powered by our next-generation AI engine v2.0.' },
];

const BACKGROUND_SHAPES = [...Array(30)].map(() => ({
  width: Math.random() * 200 + 50,
  height: Math.random() * 200 + 50,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  opacity: Math.random() * 0.5,
}));

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-24 px-6 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {BACKGROUND_SHAPES.map((style, i) => (
            <div key={i} className="absolute rounded-full bg-white" style={style} />
          ))}
        </div>
        <div className="relative max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl">
              <FiCpu size={28} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight">Tony<span className="text-blue-300">CV</span></span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            We're on a Mission to<br />
            <span className="text-amber-400">Level the Playing Field</span>
          </h1>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto leading-relaxed">
            Every year, millions of qualified candidates are rejected by ATS systems before a human ever reads their resume.
            TonyCV exists to change that — using the same AI that powers enterprise hiring to help every job seeker succeed.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="py-12 px-6 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-black text-blue-600 mb-1">{s.num}</div>
              <div className="text-slate-500 text-sm font-semibold">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Our Story */}
      <div className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                TonyCV was founded in 2021 by Tony Chen, a former Google recruiter who watched helplessly as brilliant candidates were filtered out by ATS algorithms — not because they were unqualified, but because they didn't know the rules of the game.
              </p>
              <p>
                "The hiring system was broken," Tony says. "Companies were spending $5,000 per hire on enterprise ATS tools, while candidates had nothing. I wanted to give job seekers access to the same intelligence."
              </p>
              <p>
                Starting with a team of three in Bangalore, TonyCV grew from a simple keyword checker into a full AI career platform — powered by BERT semantic models, real-time resume builders, and intelligent scoring systems trusted by millions worldwide.
              </p>
            </div>
          </div>
          {/* Timeline */}
          <div className="space-y-4">
            {TIMELINE.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    {t.year.slice(2)}
                  </div>
                  {i < TIMELINE.length - 1 && <div className="w-px flex-1 bg-blue-100 mt-1" />}
                </div>
                <div className="pb-4">
                  <div className="text-xs font-bold text-blue-600 mb-0.5">{t.year}</div>
                  <p className="text-slate-600 text-sm leading-relaxed">{t.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-20 px-6 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="text-center p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-all bg-slate-50"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                  {v.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-20 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-12">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm hover:shadow-lg transition-all"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-black text-lg shadow-lg"
                  style={{ backgroundColor: member.color }}
                >
                  {member.initials}
                </div>
                <h3 className="font-bold text-slate-900">{member.name}</h3>
                <p className="text-xs font-semibold text-blue-600 mb-3">{member.role}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Press / Recognition */}
      <div className="py-12 px-6 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-8">As featured in</p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {['TechCrunch', 'Product Hunt', 'Forbes', 'The Guardian', 'YCombinator'].map((brand) => (
              <span key={brand} className="text-slate-300 font-black text-lg tracking-tight hover:text-slate-500 transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 px-6 bg-gradient-to-br from-blue-700 to-indigo-800 text-white text-center">
        <h2 className="text-3xl font-extrabold mb-4">Join 2.4 Million Job Seekers</h2>
        <p className="text-blue-100 mb-8 max-w-lg mx-auto">
          Start with a free resume analysis. No credit card required. See exactly where your resume stands in under 60 seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/analyze')}
            className="px-10 py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold uppercase rounded-full shadow-xl"
          >
            Analyse My Resume Free <FiArrowRight className="inline ml-2" size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/resume-builder')}
            className="px-10 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-extrabold uppercase rounded-full transition-all"
          >
            Build My Resume
          </motion.button>
        </div>
      </div>
    </div>
  );
}
