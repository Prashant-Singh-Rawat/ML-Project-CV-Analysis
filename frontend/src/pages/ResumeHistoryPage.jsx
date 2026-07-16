import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('tonycv_user'));
  } catch {
    return null;
  }
}

function formatDate(value) {
  if (!value) return 'Unknown date';
  return new Date(value).toLocaleString();
}

function SkillList({ title, items, tone }) {
  const color = tone === 'good' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200';
  return (
    <div>
      <h3 className="text-sm font-black text-slate-800 mb-3">{title}</h3>
      {items?.length ? (
        <div className="flex flex-wrap gap-2">
          {items.map(item => (
            <span key={item} className={`text-xs font-bold px-3 py-1.5 rounded-full border ${color}`}>
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No changes detected.</p>
      )}
    </div>
  );
}

function SectionChange({ title, change }) {
  return (
    <div className="border border-slate-200 rounded-2xl p-4 bg-white">
      <h3 className="text-sm font-black text-slate-800 mb-3">{title}</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-black text-green-600 mb-2">Added</p>
          {change?.added?.length ? (
            <ul className="space-y-1 text-sm text-slate-700">
              {change.added.map(item => <li key={item}>+ {item}</li>)}
            </ul>
          ) : <p className="text-sm text-slate-500">None</p>}
        </div>
        <div>
          <p className="text-xs font-black text-red-600 mb-2">Removed</p>
          {change?.removed?.length ? (
            <ul className="space-y-1 text-sm text-slate-700">
              {change.removed.map(item => <li key={item}>- {item}</li>)}
            </ul>
          ) : <p className="text-sm text-slate-500">None</p>}
        </div>
      </div>
    </div>
  );
}

export default function ResumeHistoryPage() {
  const user = getCurrentUser();
  const [versions, setVersions] = useState([]);
  const [baseId, setBaseId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    api.get(`/resume-history/${user.id}`)
      .then(res => {
        const items = res.data?.versions || [];
        setVersions(items);
        if (items[1]) setBaseId(String(items[1].id));
        if (items[0]) setTargetId(String(items[0].id));
      })
      .catch(() => setError('Could not load resume history.'))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const compareVersions = async () => {
    if (!baseId || !targetId || baseId === targetId) {
      setError('Select two different resume versions to compare.');
      return;
    }

    setError('');
    setComparison(null);
    setLoading(true);
    try {
      const res = await api.post('/resume-history/compare', {
        user_id: user.id,
        base_version_id: Number(baseId),
        target_version_id: Number(targetId),
      });
      setComparison(res.data);
    } catch {
      setError('Could not compare the selected versions.');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.id) {
    return (
      <div className="min-h-screen px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-xl p-8 text-center">
          <h1 className="text-3xl font-black text-slate-900 mb-3">Resume History</h1>
          <p className="text-slate-600">Sign in to save resume analyses and compare versions over time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Resume Version History</h1>
          <p className="text-slate-600">Compare saved resume analyses to track score, skill, and section improvements.</p>
        </motion.div>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-3 text-sm font-semibold">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl shadow-xl p-5">
            <h2 className="text-lg font-black text-slate-900 mb-4">Saved Analyses</h2>
            {loading && !versions.length ? (
              <p className="text-sm text-slate-500">Loading history...</p>
            ) : versions.length ? (
              <div className="space-y-3">
                {versions.map(version => (
                  <div key={version.id} className="border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black text-slate-800">{version.resume_name}</p>
                        <p className="text-xs text-slate-500">{formatDate(version.created_at)}</p>
                      </div>
                      <span className="text-sm font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                        {Math.round(version.ats_score || 0)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">{version.skills?.slice(0, 5).join(', ') || 'No skills captured'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No saved analyses yet. Upload and analyse a resume to create your first version.</p>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-5">
              <h2 className="text-lg font-black text-slate-900 mb-4">Compare Versions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase mb-2">Older version</label>
                  <select value={baseId} onChange={e => setBaseId(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm">
                    <option value="">Select version</option>
                    {versions.map(version => (
                      <option key={version.id} value={version.id}>{version.resume_name} - {formatDate(version.created_at)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase mb-2">Newer version</label>
                  <select value={targetId} onChange={e => setTargetId(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm">
                    <option value="">Select version</option>
                    {versions.map(version => (
                      <option key={version.id} value={version.id}>{version.resume_name} - {formatDate(version.created_at)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={compareVersions}
                disabled={loading || versions.length < 2}
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-black px-5 py-3 rounded-xl disabled:opacity-50"
              >
                Compare Selected Versions
              </button>
            </div>

            {comparison && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-6">
                  <div className="grid md:grid-cols-3 gap-4 items-center">
                    <div>
                      <p className="text-xs font-black text-slate-500 uppercase">Older Score</p>
                      <p className="text-4xl font-black text-slate-900">{Math.round(comparison.base_version.ats_score || 0)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-500 uppercase">Difference</p>
                      <p className={`text-4xl font-black ${comparison.score_delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {comparison.score_delta > 0 ? '+' : ''}{comparison.score_delta}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-500 uppercase">Newer Score</p>
                      <p className="text-4xl font-black text-slate-900">{Math.round(comparison.target_version.ats_score || 0)}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm text-slate-700 bg-slate-50 rounded-2xl p-4">{comparison.summary}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-5 bg-white border border-slate-200 rounded-3xl shadow-xl p-6">
                  <SkillList title="Added Skills" items={comparison.added_skills} tone="good" />
                  <SkillList title="Removed Skills" items={comparison.removed_skills} tone="bad" />
                </div>

                <SectionChange title="Projects" change={comparison.section_changes?.projects} />
                <SectionChange title="Experience" change={comparison.section_changes?.experience} />
                <SectionChange title="Certifications" change={comparison.section_changes?.certifications} />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
