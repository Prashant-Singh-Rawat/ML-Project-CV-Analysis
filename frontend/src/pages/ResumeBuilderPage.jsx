import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiFileText, FiArrowRight, FiDownload, FiEdit3, FiCheck,
  FiStar, FiLayout, FiZap, FiEye, FiGrid, FiList,
} from 'react-icons/fi';
import TemplateGalleryModal from '../components/TemplateGalleryModal';
import ResumeTemplatePreview from '../components/ResumeTemplatePreview';

/* ─────────────────── DATA ─────────────────── */

const CATEGORIES = ['All', 'Modern', 'Classic', 'Creative', 'Executive', 'Minimal'];

const TEMPLATES = [
  {
    id: 'cascade',
    name: 'Cascade',
    desc: 'Two-column layout with a bold navy sidebar — perfect for tech roles and any industry that values clarity.',
    color: '#2563eb',
    category: 'Modern',
    tags: ['Two-Column', 'Tech', 'ATS-Ready', 'Corporate'],
    features: [
      'Striking navy sidebar with skill bars',
      'Timeline-style work experience',
      'Dedicated certifications section',
      'ATS-parsed correctly by 98% of systems',
      'Fully customisable colour accent',
    ],
    popular: true,
  },
  {
    id: 'cubic',
    name: 'Cubic',
    desc: 'Bold emerald header banner with a grid-based body — modern, fresh, and highly readable for any recruiter.',
    color: '#10b981',
    category: 'Modern',
    tags: ['Grid Layout', 'Header Banner', 'Modern', 'Fresh'],
    features: [
      'Eye-catching full-width header',
      'Two-column lower section for space efficiency',
      'Skills matrix with ratings',
      'Project highlight cards',
      'Clean typographic hierarchy',
    ],
    popular: false,
  },
  {
    id: 'crisp',
    name: 'Crisp',
    desc: 'Single-column classic layout with indigo accents — trusted by recruiters across industries and geographies.',
    color: '#6366f1',
    category: 'Classic',
    tags: ['Single-Column', 'ATS-Optimised', 'Universal', 'Traditional'],
    features: [
      'Traditional recruiter-friendly format',
      'Elegant section dividers',
      'Summary & objective block',
      'Optimised for ATS keyword scanning',
      'Suits all career levels',
    ],
    popular: true,
  },
  {
    id: 'nexus',
    name: 'Nexus',
    desc: 'Bold asymmetric layout with gradient accents and personality — built for designers who want their resume to feel like a portfolio piece.',
    color: '#f97316',
    category: 'Creative',
    tags: ['Asymmetric Layout', 'Portfolio-Style', 'Creative', 'Stand-Out'],
    features: [
      'Gradient-pill section headers with bold typography',
      'Asymmetric two-column portfolio-style layout',
      'Skill tags with subtle hover motion',
      'Dedicated portfolio/project experience section',
      'Great for designers, illustrators & creative leads',
    ],
    popular: false,
  },
  {
    id: 'aria',
    name: 'Aria',
    desc: 'Ultra-minimal with teal accents — stripped to essentials so your content, not design, does the talking.',
    color: '#06b6d4',
    category: 'Minimal',
    tags: ['Minimal', 'ATS-Max', 'Clean', 'Content-First'],
    features: [
      'Maximum ATS compatibility',
      'Zero-noise typography-only design',
      'Optimised white-space for readability',
      'Ideal for applicant tracking systems',
      'Scales beautifully from 1–3 pages',
    ],
    popular: false,
  },
  {
    id: 'apex',
    name: 'Apex',
    desc: 'Bold sidebar layout with premium corporate styling — a boardroom-ready executive resume that opens C-suite doors.',
    color: '#8b5cf6',
    category: 'Executive',
    tags: ['Executive', 'C-Suite', 'Leadership', 'Premium'],
    features: [
      'Premium sidebar with photo placeholder',
      'Executive summary & core competencies',
      'Leadership achievements highlight panel',
      'Dedicated education & credentials section',
      'Strategic leadership-focused layout',
    ],
    popular: true,
  },
];

const FEATURES = [
  { icon: <FiEdit3 size={22} />, title: 'Step-by-Step Wizard', desc: 'Our guided builder walks you through every section — no blank page anxiety.' },
  { icon: <FiLayout size={22} />, title: 'Live Preview', desc: 'See your resume update in real time as you type. WYSIWYG perfection.' },
  { icon: <FiZap size={22} />, title: 'AI Suggestions', desc: 'Get AI-powered bullet points, skill recommendations, and impact phrases.' },
  { icon: <FiStar size={22} />, title: 'ATS-Friendly', desc: 'All templates are tested against top ATS systems to maximise shortlisting.' },
  { icon: <FiDownload size={22} />, title: 'PDF Export', desc: 'Download your polished resume as a pixel-perfect PDF with one click.' },
  { icon: <FiCheck size={22} />, title: 'Instant Score', desc: 'Analyse your resume immediately after building to get your ATS score.' },
];

/* ─────────────────── TEMPLATE CARD ─────────────────── */

function TemplateCard({ template, isSelected, onSelect, onPreview }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', damping: 22, stiffness: 280 }}
      onClick={() => onSelect(template.id)}
      className={`group cursor-pointer rounded-2xl border-2 overflow-hidden transition-all duration-200 ${
        isSelected
          ? 'shadow-2xl'
          : 'border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl'
      }`}
      style={isSelected ? { borderColor: template.color, boxShadow: `0 20px 50px ${template.color}25` } : {}}
    >
      {/* Thumbnail */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${template.color}12 0%, ${template.color}05 100%)`,
          height: 220,
        }}
      >
        {/* Category badge — matches the CV Examples gallery styling */}
        <div
          className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow"
          style={{ background: template.color }}
        >
          {template.category}
        </div>

        {/* Popular badge */}
        {template.popular && !isSelected && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black text-amber-700 bg-amber-100 shadow">
            <FiStar size={8} /> Popular
          </div>
        )}

        {/* Selected check */}
        {isSelected && (
          <div
            className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center shadow-md"
            style={{ background: template.color }}
          >
            <FiCheck size={13} className="text-white" />
          </div>
        )}

        {/* Live template preview (clipped page peek) */}
        <ResumeTemplatePreview templateId={template.id} color={template.color} mode="thumbnail" />

        {/* Hover overlay with View Example button */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300">
          <motion.button
            initial={{ opacity: 0, scale: 0.85 }}
            whileHover={{ scale: 1.05 }}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 px-5 py-2.5 rounded-full bg-white text-slate-900 text-xs font-black flex items-center gap-2 shadow-xl"
            onClick={(e) => { e.stopPropagation(); onPreview(template); }}
          >
            <FiEye size={14} /> View Example
          </motion.button>
        </div>
      </div>

      {/* Card footer */}
      <div className="p-4 bg-white flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="font-black text-slate-900 text-base mb-0.5">{template.name}</h4>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{template.desc}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onPreview(template); }}
          className="flex-shrink-0 flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
          style={{ color: template.color, background: template.color + '12' }}
          title="Preview template"
        >
          <FiEye size={12} /> Preview
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────── MAIN PAGE ─────────────────── */

export default function ResumeBuilderPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const filtered = useMemo(
    () =>
      activeCategory === 'All'
        ? TEMPLATES
        : TEMPLATES.filter((t) => t.category === activeCategory),
    [activeCategory]
  );

  const previewIndex = useMemo(
    () => filtered.findIndex((t) => t.id === previewTemplate?.id),
    [filtered, previewTemplate]
  );

  const handleUseTemplate = (template) => {
    navigate('/analyze', { state: { startMode: 'scratch', templateId: template?.id } });
  };

  const handleOpenPreview = (template) => setPreviewTemplate(template);
  const handleClosePreview = () => setPreviewTemplate(null);

  const handlePrev = () => {
    if (previewIndex > 0) setPreviewTemplate(filtered[previewIndex - 1]);
  };
  const handleNext = () => {
    if (previewIndex < filtered.length - 1) setPreviewTemplate(filtered[previewIndex + 1]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 py-20 px-6 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6">
            <FiFileText size={12} /> Resume Builder
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
            Build a Resume<br /><span className="text-amber-400">That Gets Hired</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto mb-8">
            Choose from {TEMPLATES.length} professionally designed templates and use our AI-powered builder to craft a job-winning resume in minutes.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => handleUseTemplate({})}
            className="px-10 py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-sm uppercase rounded-full shadow-xl transition-all"
          >
            Start Building Free <FiArrowRight className="inline ml-2" size={16} />
          </motion.button>
        </div>
      </div>

      {/* ── Features ── */}
      <div className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-12">
          Everything You Need to Stand Out
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Template Gallery ── */}
      <div className="py-16 px-6 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Choose Your Template</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              All templates are ATS-optimised, fully customisable, and designed by professional resume experts.
            </p>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold border transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                    : 'text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600 bg-white'
                }`}
              >
                {cat}
                {cat !== 'All' && (
                  <span className={`ml-1.5 text-[10px] font-black ${activeCategory === cat ? 'text-blue-100' : 'text-slate-400'}`}>
                    {TEMPLATES.filter((t) => t.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Count info */}
          <p className="text-xs text-slate-400 text-center mb-6">
            Showing {filtered.length} of {TEMPLATES.length} templates
            {selected && ` · Selected: ${TEMPLATES.find((t) => t.id === selected)?.name}`}
          </p>

          {/* Template grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((t) => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  isSelected={selected === t.id}
                  onSelect={setSelected}
                  onPreview={handleOpenPreview}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* CTA */}
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => handleUseTemplate(TEMPLATES.find((t) => t.id === selected) || {})}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm uppercase rounded-full shadow-lg transition-all"
            >
              {selected
                ? `Use ${TEMPLATES.find((t) => t.id === selected)?.name} Template`
                : 'Start Building Now'}
              <FiArrowRight className="inline ml-2" size={16} />
            </motion.button>
            {selected && (
              <p className="mt-3 text-xs text-slate-400">
                Or{' '}
                <button
                  className="text-blue-500 font-semibold hover:underline"
                  onClick={() => handleOpenPreview(TEMPLATES.find((t) => t.id === selected))}
                >
                  preview this template
                </button>{' '}
                before committing
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Lightbox Modal ── */}
      <AnimatePresence>
        {previewTemplate && (
          <TemplateGalleryModal
            template={previewTemplate}
            onClose={handleClosePreview}
            onUse={(t) => { handleClosePreview(); handleUseTemplate(t); }}
            onPrev={handlePrev}
            onNext={handleNext}
            hasPrev={previewIndex > 0}
            hasNext={previewIndex < filtered.length - 1}
            renderCustomPreview={() => (
              <ResumeTemplatePreview templateId={previewTemplate.id} color={previewTemplate.color} mode="full" />
            )}
          />
        )}
      </AnimatePresence>
    </div>
  );
}