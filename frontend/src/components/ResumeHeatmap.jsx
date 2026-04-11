import React from 'react';
import { FiEye, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const ResumeHeatmap = ({ cvText, matchedSkills, missingSkills }) => {
  if (!cvText) return null;

  // Build a highlighted version of the CV text
  const renderHighlightedText = () => {
    let text = cvText;
    const highlights = [];

    // Find all matched skill positions
    matchedSkills.forEach(skill => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        highlights.push({
          start: match.index,
          end: match.index + match[0].length,
          word: match[0],
          type: 'matched',
        });
      }
    });

    // Sort by position
    highlights.sort((a, b) => a.start - b.start);

    // Build JSX fragments
    const fragments = [];
    let lastIndex = 0;

    highlights.forEach((h, i) => {
      if (h.start > lastIndex) {
        fragments.push(
          <span key={`text-${i}`} className="text-gray-400">{text.slice(lastIndex, h.start)}</span>
        );
      }
      fragments.push(
        <span
          key={`highlight-${i}`}
          className="px-1 py-0.5 rounded font-semibold transition-all"
          style={{
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#6ee7b7',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}
          title={`✓ Matched: ${h.word}`}
        >
          {h.word}
        </span>
      );
      lastIndex = h.end;
    });

    if (lastIndex < text.length) {
      fragments.push(<span key="text-end" className="text-gray-400">{text.slice(lastIndex)}</span>);
    }

    return fragments.length > 0 ? fragments : <span className="text-gray-400">{text}</span>;
  };

  return (
    <div className="glass-card p-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="p-2.5 rounded-xl" style={{ background: 'rgba(6, 182, 212, 0.12)' }}>
          <FiEye className="text-cyan-400" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Resume NLP Heatmap</h3>
          <p className="text-gray-500 text-xs mt-0.5">AI-highlighted keywords found in your CV — green = matched skills</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.3)' }}>Skill</span>
          <span className="text-gray-500">Matched Skill ({matchedSkills.length})</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)' }}>Skill</span>
          <span className="text-gray-500">Missing Skill ({missingSkills.length})</span>
        </div>
      </div>

      {/* CV Text with highlights */}
      <div
        className="p-5 rounded-xl text-sm leading-relaxed whitespace-pre-wrap break-words max-h-80 overflow-y-auto"
        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.04)', fontFamily: "'Inter', monospace" }}
      >
        {renderHighlightedText()}
      </div>

      {/* Missing Skills Alert */}
      {missingSkills.length > 0 && (
        <div className="mt-4 p-4 rounded-xl flex items-start gap-3" style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.12)' }}>
          <FiXCircle className="text-red-400 mt-0.5 flex-shrink-0" size={16} />
          <div>
            <p className="text-red-300 text-xs font-semibold mb-1">Keywords NOT found in your CV:</p>
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.map(skill => (
                <span key={skill} className="px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeHeatmap;
