import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiFileText, FiArrowRight, FiCheck, FiEye,
  FiEdit3, FiGlobe, FiAward, FiUser, FiBriefcase, FiBookOpen,
  FiCode, FiBarChart2, FiBook, FiActivity, FiSettings, FiLayers,
  FiStar,
} from 'react-icons/fi';
import TemplateGalleryModal from '../components/TemplateGalleryModal';
import CVExamplePreview from '../components/CVExamplePreview';

/* ─────────────────── DATA ─────────────────── */

const CV_VS_RESUME = [
  { aspect: 'Length', cv: '2+ pages (full academic/career history)', resume: '1 page (tailored snapshot)' },
  { aspect: 'Purpose', cv: 'Academic, research, medical positions', resume: 'Industry / corporate jobs' },
  { aspect: 'Content', cv: 'Publications, grants, conferences', resume: 'Skills, achievements, impact' },
  { aspect: 'Regions', cv: 'UK, Europe, Middle East, Asia, Academia', resume: 'USA, Canada, tech industry' },
  { aspect: 'Updates', cv: 'Continuous — add everything', resume: 'Tailored per application' },
];

const CV_SECTIONS = [
  { icon: <FiUser size={20} />, title: 'Personal Profile', desc: 'Name, contact details, professional summary, and photo (optional).' },
  { icon: <FiBriefcase size={20} />, title: 'Work Experience', desc: 'Full chronological history of roles, responsibilities and achievements.' },
  { icon: <FiBookOpen size={20} />, title: 'Education', desc: 'Degrees, institutions, grades, and relevant modules or thesis topics.' },
  { icon: <FiAward size={20} />, title: 'Publications & Research', desc: 'Papers, journals, books, conference presentations, and grants.' },
  { icon: <FiGlobe size={20} />, title: 'Languages & Skills', desc: 'Technical skills, language proficiencies, and professional memberships.' },
  { icon: <FiEdit3 size={20} />, title: 'References', desc: 'Academic and professional referees with contact details.' },
];

const CV_CATEGORIES = ['All', 'Tech', 'Academic', 'Healthcare', 'Business', 'Creative'];

const CV_EXAMPLES = [
  {
    id: 'software-engineer',
    title: 'Software Engineer CV',
    description: 'Ideal for software development, backend, frontend, and full-stack roles at tech companies globally.',
    level: 'Entry Level',
    category: 'Tech',
    color: '#2563eb',
    icon: <FiCode size={22} />,
    tags: ['Tech', 'Full-Stack', 'Backend', 'Entry–Mid'],
    features: [
      'Technical skills & stack section',
      'GitHub / portfolio links',
      'Open source contributions block',
      'Project highlights with impact metrics',
      'Education with relevant coursework',
    ],
    popular: true,
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist CV',
    description: 'Highlights machine learning projects, research publications, and quantitative technical skills.',
    level: 'Professional',
    category: 'Tech',
    color: '#7c3aed',
    icon: <FiBarChart2 size={22} />,
    tags: ['ML/AI', 'Research', 'Statistics', 'Python'],
    features: [
      'Research & publications section',
      'Model performance metrics showcase',
      'Kaggle / competition highlights',
      'Tools & frameworks matrix',
      'Conference talks & posters',
    ],
    popular: false,
  },
  {
    id: 'research-cv',
    title: 'Academic Research CV',
    description: 'Perfect for academic positions, PhD applications, postdoc roles, and tenure-track applications.',
    level: 'Academic',
    category: 'Academic',
    color: '#0891b2',
    icon: <FiBook size={22} />,
    tags: ['Academia', 'PhD', 'Research', 'Publications'],
    features: [
      'Full publications list (APA/MLA format)',
      'Teaching experience section',
      'Research grants & funding history',
      'Conference presentations log',
      'Academic references with titles',
    ],
    popular: true,
  },
  {
    id: 'healthcare',
    title: 'Healthcare Professional CV',
    description: 'Structured for medical, nursing, and allied health professionals seeking NHS, hospital, or clinic roles.',
    level: 'Professional',
    category: 'Healthcare',
    color: '#059669',
    icon: <FiActivity size={22} />,
    tags: ['Medical', 'NHS', 'Clinical', 'Patient Care'],
    features: [
      'Professional registration & GMC number',
      'Clinical rotations & placements',
      'Continuous professional development',
      'Clinical skills & competencies',
      'Professional indemnity info',
    ],
    popular: false,
  },
  {
    id: 'business-executive',
    title: 'Business Executive CV',
    description: 'Designed for senior managers, directors, and C-suite executives targeting leadership roles.',
    level: 'Executive',
    category: 'Business',
    color: '#b45309',
    icon: <FiSettings size={22} />,
    tags: ['Executive', 'Leadership', 'C-Suite', 'Director'],
    features: [
      'Executive summary & value proposition',
      'Board memberships & advisory roles',
      'P&L responsibility highlights',
      'Strategic initiatives & transformations',
      'Key stakeholder relationships',
    ],
    popular: false,
  },
  {
    id: 'creative-designer',
    title: 'Creative Designer CV',
    description: 'Portfolio-forward layout for UX/UI designers, graphic designers, and creative directors.',
    level: 'Professional',
    category: 'Creative',
    color: '#e11d48',
    icon: <FiLayers size={22} />,
    tags: ['Design', 'UX/UI', 'Portfolio', 'Creative'],
    features: [
      'Portfolio link section (Behance/Dribbble)',
      'Design tools proficiency bars',
      'Client brands & project showcase',
      'Awards & design recognition',
      'Creative process description',
    ],
    popular: false,
  },
];

/* ─────────────────── CV EXAMPLE CARD ─────────────────── */

function CVExampleCard({ example, onPreview }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', damping: 22, stiffness: 280 }}
      className="group cursor-pointer rounded-2xl border-2 border-slate-200 hover:border-slate-300 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200"
    >
      {/* Live template thumbnail */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${example.color}10 0%, ${example.color}04 100%)`,
          height: 220,
        }}
      >
        {/* Level badge */}
        <div
          className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow"
          style={{ background: example.color }}
        >
          {example.level}
        </div>

        {/* Popular badge */}
        {example.popular && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black text-amber-700 bg-amber-100">
            <FiStar size={8} /> Top Pick
          </div>
        )}

        {/* Live template preview (clipped page peek) */}
        <CVExamplePreview exampleId={example.id} color={example.color} mode="thumbnail" />

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/25 transition-all duration-300">
          <button
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 px-5 py-2.5 rounded-full bg-white text-slate-900 text-xs font-black flex items-center gap-2 shadow-xl"
            onClick={() => onPreview(example)}
          >
            <FiEye size={14} /> View Example
          </button>
        </div>
      </div>

      {/* Card footer */}
      <div className="p-4 bg-white flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="font-black text-slate-900 text-base">{example.title}</h4>
          </div>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{example.description}</p>
        </div>
        <button
          className="flex-shrink-0 flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
          style={{ color: example.color, background: example.color + '12' }}
          onClick={() => onPreview(example)}
          title="View CV example"
        >
          <FiEye size={12} /> View
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────── MAIN PAGE ─────────────────── */

export default function CVPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [previewExample, setPreviewExample] = useState(null);

  const filtered = useMemo(
    () =>
      activeCategory === 'All'
        ? CV_EXAMPLES
        : CV_EXAMPLES.filter((e) => e.category === activeCategory),
    [activeCategory]
  );

  const previewIndex = useMemo(
    () => filtered.findIndex((e) => e.id === previewExample?.id),
    [filtered, previewExample]
  );

  const handleOpenPreview = (example) => setPreviewExample(example);
  const handleClosePreview = () => setPreviewExample(null);
  const handlePrev = () => { if (previewIndex > 0) setPreviewExample(filtered[previewIndex - 1]); };
  const handleNext = () => { if (previewIndex < filtered.length - 1) setPreviewExample(filtered[previewIndex + 1]); };

  const faqs = [
    { q: 'What is a CV?', a: 'A Curriculum Vitae (CV) is a comprehensive document listing your full academic and professional history including publications, research, awards, and teaching. Unlike a resume, a CV grows over time and is typically 2+ pages.' },
    { q: 'When should I use a CV instead of a resume?', a: 'Use a CV when applying for academic, research, medical, or senior roles in the UK, Europe, Middle East, or Asia. US employers generally expect a resume unless the role is in academia or medicine.' },
    { q: 'How long should my CV be?', a: 'Unlike a resume (1 page), a CV can be 2–10+ pages depending on your career stage. Entry-level CVs are typically 2 pages; senior academics may have CVs exceeding 10 pages.' },
    { q: 'Should I include a photo on my CV?', a: 'This depends on the country. In Europe, Asia, and the Middle East, a professional headshot is common and expected. In the US and Canada, photos are generally avoided to prevent bias.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800 py-20 px-6 text-white text-center relative overflow-hidden">
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6">
            <FiFileText size={12} /> CV Builder &amp; Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            Create a Professional CV<br />
            <span className="text-amber-400">That Opens Doors</span>
          </h1>
          <p className="text-indigo-100 text-lg max-w-xl mx-auto mb-8">
            Build a complete Curriculum Vitae for academic, research, or international job applications. Our guided tool ensures every section is perfectly structured.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/analyze')}
            className="px-10 py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-sm uppercase rounded-full shadow-xl"
          >
            Build My CV Now <FiArrowRight className="inline ml-2" size={16} />
          </motion.button>
        </div>
      </div>

      {/* ── CV vs Resume ── */}
      <div className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-4">CV vs Resume: What's the Difference?</h2>
        <p className="text-slate-500 text-center mb-10 max-w-xl mx-auto">Understanding when to use each document is crucial to your job search success.</p>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="py-3 px-5 text-left font-bold">Aspect</th>
                <th className="py-3 px-5 text-left font-bold text-indigo-300">CV</th>
                <th className="py-3 px-5 text-left font-bold text-amber-300">Resume</th>
              </tr>
            </thead>
            <tbody>
              {CV_VS_RESUME.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="py-3 px-5 font-semibold text-slate-700">{row.aspect}</td>
                  <td className="py-3 px-5 text-slate-600">{row.cv}</td>
                  <td className="py-3 px-5 text-slate-600">{row.resume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CV Sections ── */}
      <div className="py-16 px-6 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-10">What to Include in Your CV</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CV_SECTIONS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-slate-50 rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                  {s.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CV Example Gallery ── */}
      <div className="py-16 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
              Professional CV Examples
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Browse {CV_EXAMPLES.length} professionally structured CV examples. Click <strong>View Example</strong> on any card to see a full breakdown of layout and content.
            </p>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-10">
            {CV_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold border transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                    : 'text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 bg-white'
                }`}
              >
                {cat}
                {cat !== 'All' && (
                  <span className={`ml-1.5 text-[10px] font-black ${activeCategory === cat ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {CV_EXAMPLES.filter((e) => e.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Count info */}
          <p className="text-xs text-slate-400 text-center mb-6">
            Showing {filtered.length} of {CV_EXAMPLES.length} CV examples
          </p>

          {/* Gallery grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((example) => (
                <CVExampleCard
                  key={example.id}
                  example={example}
                  onPreview={handleOpenPreview}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* CTA */}
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/analyze')}
              className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm uppercase rounded-full shadow-lg transition-all"
            >
              Build Your Own CV <FiArrowRight className="inline ml-2" size={16} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="py-16 px-6 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 font-bold text-slate-800 flex justify-between items-center hover:bg-slate-100 transition-colors"
                >
                  {faq.q}
                  <span className="text-slate-400 text-lg">{openFaq === i ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                      className="px-5 py-4 text-slate-500 text-sm leading-relaxed border-t border-slate-200 bg-white"
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

      {/* ── CTA Banner ── */}
      <div className="py-16 px-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-center">
        <h2 className="text-3xl font-extrabold mb-4">Ready to Build Your CV?</h2>
        <p className="text-indigo-100 mb-8 max-w-md mx-auto">Use our AI-powered builder to create a professional CV in minutes. Get an ATS score instantly.</p>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/analyze')}
          className="px-10 py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold uppercase rounded-full shadow-xl"
        >
          Build My CV <FiArrowRight className="inline ml-2" size={16} />
        </motion.button>
      </div>

      {/* ── Lightbox Modal ── */}
      <AnimatePresence>
        {previewExample && (
          <TemplateGalleryModal
            template={{
              ...previewExample,
              name: previewExample.title,
              desc: previewExample.description,
              image: null,
            }}
            onClose={handleClosePreview}
            onUse={(t) => {
              handleClosePreview();
              navigate('/analyze', {
                state: { startMode: 'scratch', templateId: t.id },
              });
            }}
            onPrev={handlePrev}
            onNext={handleNext}
            hasPrev={previewIndex > 0}
            hasNext={previewIndex < filtered.length - 1}
            renderCustomPreview={() => (
              <CVExamplePreview exampleId={previewExample.id} color={previewExample.color} mode="full" />
            )}
          />
        )}
      </AnimatePresence>
    </div>
  );
}