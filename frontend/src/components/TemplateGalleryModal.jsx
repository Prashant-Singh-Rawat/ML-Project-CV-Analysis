import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowRight, FiExternalLink, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * TemplateGalleryModal — reusable lightbox/modal for template previews.
 *
 * Props:
 *  - template: object { id, name, desc, color, tags, image, features, category }
 *  - onClose: fn
 *  - onUse: fn(template)
 *  - onPrev: fn   (navigate to previous template)
 *  - onNext: fn   (navigate to next template)
 *  - hasPrev: bool
 *  - hasNext: bool
 *  - renderCustomPreview: fn (optional — renders custom JSX instead of <img> for CV examples)
 */
export default function TemplateGalleryModal({
  template,
  onClose,
  onUse,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  renderCustomPreview,
}) {
  // Close on Escape, navigate with arrow keys
  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    },
    [onClose, onPrev, onNext, hasPrev, hasNext]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  if (!template) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
        style={{ background: 'rgba(8,12,28,0.82)', backdropFilter: 'blur(10px)' }}
        onClick={onClose}
      >
        {/* Modal panel */}
        <motion.div
          key={template.id}
          initial={{ opacity: 0, scale: 0.93, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col lg:flex-row"
          style={{ background: '#fff' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Left: Image preview ── */}
          <div
            className="relative lg:w-[55%] flex-shrink-0 flex items-center justify-center overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${template.color}18 0%, ${template.color}06 100%)`,
              minHeight: 320,
            }}
          >
            {/* Category badge */}
            <div
              className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-md"
              style={{ background: template.color }}
            >
              {template.category}
            </div>

            {/* Nav arrows */}
            {hasPrev && (
              <button
                onClick={onPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
                aria-label="Previous template"
              >
                <FiChevronLeft size={20} className="text-slate-700" />
              </button>
            )}
            {hasNext && (
              <button
                onClick={onNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
                aria-label="Next template"
              >
                <FiChevronRight size={20} className="text-slate-700" />
              </button>
            )}

            {/* Template image or custom SVG preview */}
            <motion.div
              key={template.id + '-preview'}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center w-[82%]"
            >
              {renderCustomPreview ? (
                renderCustomPreview()
              ) : (
                <img
                  src={template.image}
                  alt={`${template.name} template preview`}
                  className="w-full max-h-[72vh] object-contain rounded-2xl shadow-2xl border border-slate-100"
                  style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.18))' }}
                />
              )}
            </motion.div>
          </div>

          {/* ── Right: Details panel ── */}
          <div className="flex flex-col lg:w-[45%] overflow-y-auto p-8 gap-5">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              aria-label="Close preview"
            >
              <FiX size={18} className="text-slate-600" />
            </button>

            {/* Title */}
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-1">{template.name}</h2>
              <p className="text-slate-500 text-sm leading-relaxed">{template.desc}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {template.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-semibold border"
                  style={{ color: template.color, borderColor: template.color + '40', background: template.color + '10' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Features checklist */}
            {template.features?.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">What's included</h3>
                <ul className="space-y-2">
                  {template.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span
                        className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: template.color + '20' }}
                      >
                        <FiCheck size={11} style={{ color: template.color }} />
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-slate-100" />

            {/* ATS score badge */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-sm flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${template.color}, ${template.color}bb)` }}
              >
                ATS
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">ATS-Optimised</p>
                <p className="text-xs text-slate-500">Tested against top applicant tracking systems</p>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 mt-auto pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onUse(template)}
                className="w-full py-3.5 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                style={{ background: `linear-gradient(135deg, ${template.color} 0%, ${template.color}cc 100%)` }}
              >
                Use This Template <FiArrowRight size={16} />
              </motion.button>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl font-semibold text-slate-500 text-sm bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                Browse More Templates
              </button>
            </div>

            {/* Keyboard hint */}
            <p className="text-center text-xs text-slate-400 pb-1">
              Use <kbd className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px]">←</kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px]">→</kbd> to navigate •{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px]">Esc</kbd> to close
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
