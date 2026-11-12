import React from 'react';

export default function ReadabilityScore({ data }) {
  if (!data) return null;

  const {
    flesch_reading_ease,
    flesch_kincaid_grade,
    gunning_fog,
    avg_sentence_length,
    complex_words_pct,
    readability_level,
    readability_tone,
    complex_sentences,
    bullet_consistency,
    recommendations,
  } = data;

  const badgeBg = readability_tone === 'excellent'
    ? 'bg-green-100 text-green-700 border-green-200'
    : readability_tone === 'good'
    ? 'bg-blue-100 text-blue-700 border-blue-200'
    : 'bg-amber-100 text-amber-700 border-amber-200';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <h3 className="text-lg font-bold text-slate-800">Readability & Recruiter Scan Score</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Calculated via Flesch-Kincaid & Gunning Fog indexes for fast recruiter comprehension
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${badgeBg}`}>
            {readability_level}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reading Ease</div>
          <div className="text-xl font-black text-slate-800 mt-0.5">{flesch_reading_ease} <span className="text-xs font-normal text-slate-400">/100</span></div>
          <div className="text-[10px] text-slate-400">Higher is easier</div>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Grade Level</div>
          <div className="text-xl font-black text-slate-800 mt-0.5">{flesch_kincaid_grade}th</div>
          <div className="text-[10px] text-slate-400">Target: 8th - 12th</div>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Avg Length</div>
          <div className="text-xl font-black text-slate-800 mt-0.5">{avg_sentence_length}</div>
          <div className="text-[10px] text-slate-400">words / sentence</div>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Complex Words</div>
          <div className="text-xl font-black text-slate-800 mt-0.5">{complex_words_pct}%</div>
          <div className="text-[10px] text-slate-400">3+ syllables</div>
        </div>
      </div>

      {/* Bullet consistency badge */}
      <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700">Formatting Structure</span>
        <span className="text-slate-600 font-medium">✨ {bullet_consistency}</span>
      </div>

      {/* Flagged complex sentences */}
      {complex_sentences && complex_sentences.length > 0 && (
        <div className="mt-5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            Sentences to Simplify ({complex_sentences.length} flagged)
          </h4>
          <div className="space-y-2">
            {complex_sentences.map((cs, idx) => (
              <div key={idx} className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200/70 text-amber-900">
                    {cs.word_count} words
                  </span>
                  <span className="text-[11px] text-amber-700 italic">{cs.suggestion}</span>
                </div>
                <p className="text-slate-700 font-serif leading-relaxed italic">"{cs.sentence}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
          {recommendations.map((rec, i) => (
            <p key={i}>• {rec}</p>
          ))}
        </div>
      )}
    </div>
  );
}

