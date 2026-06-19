import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCpu, FiBarChart2, FiShield, FiZap, FiArrowRight, FiCheckCircle, FiStar } from 'react-icons/fi';

const features = [
  { icon: <FiCpu />, title: 'NLP Analysis', desc: 'Deep language understanding' },
  { icon: <FiBarChart2 />, title: 'ML Predictions', desc: 'RandomForest powered' },
  { icon: <FiShield />, title: 'Skill Match', desc: 'Industry-aligned scoring' },
  { icon: <FiZap />, title: 'Instant Results', desc: 'Real-time processing' },
];

const faqs = [
  { q: "How accurate is the ML prediction?", a: "Our RandomForest model is trained on thousands of successful tech resumes, giving you highly accurate placement probabilities based on current industry standards." },
  { q: "Is my data secure?", a: "Absolutely. We do not store your PDFs. They are processed in memory and discarded immediately after generating your report." },
  { q: "What roles do you analyze for?", a: "We currently specialize in Software Engineering, Data Science, ML Engineering, DevOps, and Full Stack roles." }
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 pt-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-wide uppercase"
            style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <FiZap size={12} /> AI-Powered Analysis Engine
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Analyze Your CV with<br />
            <span className="gradient-text-warm">Machine Learning</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Upload your resume, select your target role, and let our NLP pipeline predict your placement probability and identify critical skill gaps.
          </p>
          <button 
            onClick={() => navigate('/analyze')}
            className="btn-primary px-8 py-4 text-lg rounded-xl flex items-center gap-3 mx-auto shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform"
          >
            Start Free Analysis <FiArrowRight />
          </button>
        </motion.div>

        {/* Features Matrix */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
        >
          {features.map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="glass-card p-6 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 mb-4 text-xl">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust & Reviews Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-3xl font-bold text-center text-white mb-12">Trusted by Engineers Worldwide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="glass-card p-6">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, j) => <FiStar key={j} className="fill-current" />)}
                </div>
                <p className="text-gray-300 mb-4 italic">"TonyCV helped me identify exactly which keywords my resume was missing for the ML Engineer role. Got the interview!"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                    {['S', 'A', 'J'][i]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Verified User</div>
                    <div className="text-xs text-gray-400">Software Engineer</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-white mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <FiCheckCircle className="text-violet-400" /> {faq.q}
                </h3>
                <p className="text-gray-400 pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
