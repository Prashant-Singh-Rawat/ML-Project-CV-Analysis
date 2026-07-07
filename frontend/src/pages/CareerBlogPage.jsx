import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiClock, FiTag, FiTrendingUp, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';
const CATEGORIES = ['All', 'Resume Tips', 'Job Search', 'ATS Guide', 'Career Growth', 'Interview Prep'];

const ARTICLES = [
  {
    id: 1, category: 'ATS Guide',
    title: 'How ATS Systems Actually Work (And How to Beat Them)',
    excerpt: 'Applicant Tracking Systems reject 75% of resumes before a human ever sees them. Here\'s the exact technical breakdown of how they parse your resume — and what you must do to pass.',
    readTime: '8 min read', date: 'Jun 15, 2026', featured: true,
    color: '#2563eb',
  },
  {
    id: 2, category: 'Resume Tips',
    title: '10 Power Verbs That Make Your Resume Stand Out',
    excerpt: 'Weak verbs like "helped" and "worked on" destroy your credibility. Replace them with these high-impact action verbs that command attention and demonstrate leadership.',
    readTime: '5 min read', date: 'Jun 12, 2026', featured: false,
    color: '#10b981',
  },
  {
    id: 3, category: 'Career Growth',
    title: 'How to Switch Careers in 2026: A Complete Roadmap',
    excerpt: 'Career pivots are more common than ever. This step-by-step guide covers how to identify transferable skills, reframe your experience, and land your first role in a new field.',
    readTime: '12 min read', date: 'Jun 10, 2026', featured: false,
    color: '#8b5cf6',
  },
  {
    id: 4, category: 'Interview Prep',
    title: 'The STAR Method: Answer Behavioral Questions Perfectly',
    excerpt: 'Situation, Task, Action, Result — master this framework and you\'ll have a compelling answer ready for any behavioral interview question. Includes 15 sample answers.',
    readTime: '7 min read', date: 'Jun 8, 2026', featured: false,
    color: '#f59e0b',
  },
  {
    id: 5, category: 'Job Search',
    title: 'LinkedIn Optimisation: Get Recruiters Coming to You',
    excerpt: 'A fully optimised LinkedIn profile gets 40x more opportunities. Here\'s the exact checklist used by career coaches to transform profiles from invisible to in-demand.',
    readTime: '10 min read', date: 'Jun 5, 2026', featured: false,
    color: '#0ea5e9',
  },
  {
    id: 6, category: 'Resume Tips',
    title: 'One Page vs Two Page Resume: The Definitive Guide',
    excerpt: 'The debate is over. After analysing 10,000 resumes and interviewing 50 hiring managers, we have the definitive answer on resume length — with one important caveat.',
    readTime: '6 min read', date: 'Jun 3, 2026', featured: false,
    color: '#ef4444',
  },
  {
    id: 7, category: 'ATS Guide',
    title: 'Keywords That Get You Past ATS in 2026',
    excerpt: 'ATS algorithms have evolved. Generic keywords no longer work. Discover the semantic matching techniques that modern systems use and how to beat them with context-aware language.',
    readTime: '9 min read', date: 'May 30, 2026', featured: false,
    color: '#06b6d4',
  },
  {
    id: 8, category: 'Career Growth',
    title: 'Salary Negotiation Scripts That Actually Work',
    excerpt: 'Most people leave money on the table because they don\'t know how to negotiate. These word-for-word scripts have helped candidates secure 15–30% higher offers.',
    readTime: '8 min read', date: 'May 27, 2026', featured: false,
    color: '#f97316',
  },
];

const BACKGROUND_DOTS = [...Array(20)].map(() => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  opacity: Math.random(),
}));

export default function CareerBlogPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = ARTICLES.filter(a => {
    const matchCat = activeCategory === 'All' || a.category === activeCategory;
    const matchSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = ARTICLES.find(a => a.featured);
  const rest = filtered.filter(a => !a.featured || activeCategory !== 'All' || searchTerm);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-20 px-6 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {BACKGROUND_DOTS.map((style, i) => (
            <div key={i} className="absolute w-1 h-1 bg-white rounded-full"
              style={style} />
          ))}
        </div>
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6">
            <FiTrendingUp size={12} /> Career Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            Career Insights &amp;<br /><span className="text-amber-400">Expert Advice</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto mb-8">
            Data-driven career advice, resume tips, and job search strategies from industry experts and AI analysis.
          </p>
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-full pl-12 pr-6 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-white/50 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Featured Article */}
        {featured && activeCategory === 'All' && !searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => navigate('/analyze')}
          >
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="lg:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    ⭐ Featured
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <FiTag size={10} /> {featured.category}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                  {featured.title}
                </h2>
                <p className="text-slate-500 leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><FiClock size={12} /> {featured.readTime}</span>
                    <span>{featured.date}</span>
                  </div>
                  <span className="text-blue-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read Article <FiArrowRight size={14} />
                  </span>
                </div>
              </div>
              <div className="lg:col-span-2 flex items-center justify-center p-8 min-h-48"
                style={{ background: `linear-gradient(135deg, ${featured.color}15, ${featured.color}30)` }}>
                <div className="text-8xl opacity-20 select-none font-black" style={{ color: featured.color }}>
                  ATS
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeCategory === 'All' && !searchTerm ? rest : filtered).map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate('/analyze')}
            >
              <div className="h-2" style={{ backgroundColor: article.color }} />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ color: article.color, background: article.color + '15' }}>
                    {article.category}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                  <span className="flex items-center gap-1"><FiClock size={11} /> {article.readTime}</span>
                  <span>{article.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No articles found</h3>
            <p className="text-slate-500">Try a different search term or category.</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="py-16 px-6 bg-slate-900 text-white text-center">
        <h2 className="text-3xl font-extrabold mb-3">Put the Advice Into Action</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">Use our AI-powered resume analyser to see exactly how your resume scores — and get personalised improvement tips.</p>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/analyze')}
          className="px-10 py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold uppercase rounded-full shadow-xl"
        >
          Analyse My Resume <FiArrowRight className="inline ml-2" size={16} />
        </motion.button>
      </div>
    </div>
  );
}
