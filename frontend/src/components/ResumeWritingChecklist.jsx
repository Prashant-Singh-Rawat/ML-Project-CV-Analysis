import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DEFAULT_ITEMS = [
  // Content
  { id: 'c1', cat: 'Content', label: 'Every bullet point starts with a strong action verb (Architected, Spearheaded, Accelerated)', tip: 'Avoid passive phrases like "Responsible for" or "Assisted in".' },
  { id: 'c2', cat: 'Content', label: 'Achievements are quantified with numbers, percentages, or dollar impact', tip: 'e.g., "Reduced response latency by 35%" instead of "Improved latency".' },
  { id: 'c3', cat: 'Content', label: 'Tailored for target job description with relevant technologies and keywords', tip: 'Align skill labels with industry postings.' },
  { id: 'c4', cat: 'Content', label: 'Includes a clear 2-3 sentence Professional Summary at the top', tip: 'Highlights key specialization, years of experience, and primary competencies.' },
  { id: 'c5', cat: 'Content', label: 'Projects highlight problem, technical stack used, and outcome achieved', tip: 'Include GitHub or live URLs for proof of execution.' },
  { id: 'c6', cat: 'Content', label: 'Removed obsolete information (high school details, outdated ancient tech)', tip: 'Focus only on relevant career milestones.' },

  // Formatting
  { id: 'f1', cat: 'Formatting', label: 'Length is strictly 1 page (under 5 years experience) or max 2 pages', tip: 'Recruiters scan quickly; conciseness is preferred.' },
  { id: 'f2', cat: 'Formatting', label: 'Consistent font family (e.g. Inter, Roboto, Arial, Calibri)', tip: 'Limit to 1-2 clean font families throughout.' },
  { id: 'f3', cat: 'Formatting', label: 'Margins are balanced (between 0.5" and 1.0" on all sides)', tip: 'Ensure sufficient white space for visual breathing room.' },
  { id: 'f4', cat: 'Formatting', label: 'Dates follow a uniform format throughout (e.g., "Jan 2023 - Present")', tip: 'Inconsistent date formatting signals lack of attention to detail.' },
  { id: 'f5', cat: 'Formatting', label: 'Visual hierarchy: Section titles stand out with bolding and spacing', tip: 'Helps human eyes jump effortlessly between sections.' },
  { id: 'f6', cat: 'Formatting', label: 'No typos, grammar errors, or double spaces', tip: 'Use spell-check tools before submitting.' },

  // ATS
  { id: 'a1', cat: 'ATS', label: 'Standard section headers used (Experience, Education, Skills, Projects)', tip: 'Creative headers like "My Journey" confuse ATS parsers.' },
  { id: 'a2', cat: 'ATS', label: 'Single-column text layout without complicated nested tables or text boxes', tip: 'Complex multi-column tables frequently break ATS text extraction.' },
  { id: 'a3', cat: 'ATS', label: 'Exported as PDF with selectable, machine-readable text (not a scanned image)', tip: 'Highlight text in Acrobat to verify it is selectable.' },
  { id: 'a4', cat: 'ATS', label: 'No personal photos, headshots, or graphic skill-bar meters', tip: 'Photos violate US/UK anti-bias screening and skill bars cannot be parsed.' },
  { id: 'a5', cat: 'ATS', label: 'Technical keywords appear in both Skills and Experience sections in context', tip: 'ATS algorithms weigh keywords backed by context higher than standalone lists.' },
  { id: 'a6', cat: 'ATS', label: 'Hyperlinks include clean clickable text and fall back to plain URLs if printed', tip: 'e.g., github.com/username.' },

  // Tone
  { id: 't1', cat: 'Tone', label: 'Zero first-person pronouns (no "I", "me", "my", "we")', tip: 'Standard resume conventions omit subject pronouns.' },
  { id: 't2', cat: 'Tone', label: 'Consistent past tense for previous jobs, present tense for current job', tip: 'Check all verbs for tense consistency.' },
  { id: 't3', cat: 'Tone', label: 'Professional email address with clean name domain (no gamer tags)', tip: 'Use firstname.lastname@gmail.com or personal domain.' },
  { id: 't4', cat: 'Tone', label: 'Avoided empty buzzwords ("hard worker", "go-getter", "team player")', tip: 'Demonstrate qualities through accomplishments instead of stating them.' },
  { id: 't5', cat: 'Tone', label: 'Active voice used across all bullet descriptions', tip: 'Active voice creates a confident, direct impression.' },
  { id: 't6', cat: 'Tone', label: 'Contact header includes location, phone, email, and LinkedIn profile', tip: 'City and State/Country are sufficient; omit street address.' },
];

export default function ResumeWritingChecklist() {
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('tonycv_resume_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    try {
      localStorage.setItem('tonycv_resume_checklist', JSON.stringify(checkedItems));
    } catch {
      // storage quota or disabled
    }
  }, [checkedItems]);

  const toggleItem = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleReset = () => {
    if (window.confirm('Reset all checklist items?')) {
      setCheckedItems({});
    }
  };

  const categories = ['All', 'Content', 'Formatting', 'ATS', 'Tone'];
  const filteredItems = activeCategory === 'All'
    ? DEFAULT_ITEMS
    : DEFAULT_ITEMS.filter((i) => i.cat === activeCategory);

  const totalCount = DEFAULT_ITEMS.length;
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">✅</span>
            <h3 className="text-lg font-bold text-slate-800">Resume Writing Checklist</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            24 recruiter-approved best practices across Content, Format, ATS, and Tone
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-slate-500 hover:text-red-500 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-red-200 transition-colors"
          >
            Reset
          </button>
          <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl text-right">
            <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Completed</div>
            <div className="text-xl font-black text-blue-700">{completedCount}/{totalCount} ({progressPct}%)</div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
        <motion.div
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.4 }}
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
        />
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 mt-5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Checklist items */}
      <div className="space-y-2.5 mt-4">
        {filteredItems.map((item) => {
          const isDone = !!checkedItems[item.id];
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                isDone
                  ? 'bg-green-50/60 border-green-200/80 text-slate-700'
                  : 'bg-slate-50/50 border-slate-200/70 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <input
                type="checkbox"
                checked={isDone}
                onChange={() => {}} // handled by wrapper click
                className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${isDone ? 'line-through text-slate-400' : 'text-slate-800 font-semibold'}`}>
                    {item.label}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-200/70 text-slate-600">
                    {item.cat}
                  </span>
                </div>
                {item.tip && (
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    💡 Tip: {item.tip}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

