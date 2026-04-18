import React, { useState } from 'react';
import { FiChevronRight, FiStar, FiTrendingUp, FiCode, FiDatabase, FiCloud, FiSmartphone, FiShield, FiActivity } from 'react-icons/fi';

// Career paths with skill requirements and probabilities
const CAREER_PATHS = {
  'Software Engineer': {
    icon: <FiCode />,
    color: '#8b5cf6',
    requiredSkills: ['Python', 'Java', 'C++', 'Data Structures', 'Git'],
    salary: '$85K–$150K',
    demand: 'Very High',
    children: [
      { role: 'Senior Software Engineer', years: '3-5', extraSkills: ['System Design', 'Leadership'] },
      { role: 'Tech Lead', years: '5-8', extraSkills: ['Architecture', 'Mentoring'] },
      { role: 'Principal Engineer', years: '8+', extraSkills: ['Strategy', 'Innovation'] },
    ]
  },
  'Data Scientist': {
    icon: <FiDatabase />,
    color: '#3b82f6',
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Data Analysis', 'Statistics'],
    salary: '$90K–$160K',
    demand: 'High',
    children: [
      { role: 'Senior Data Scientist', years: '3-5', extraSkills: ['Deep Learning', 'MLOps'] },
      { role: 'ML Engineer', years: '4-6', extraSkills: ['TensorFlow', 'Deployment'] },
      { role: 'Head of AI', years: '8+', extraSkills: ['Strategy', 'Research'] },
    ]
  },
  'Frontend Developer': {
    icon: <FiSmartphone />,
    color: '#10b981',
    requiredSkills: ['JavaScript', 'React', 'HTML/CSS', 'TypeScript'],
    salary: '$75K–$140K',
    demand: 'High',
    children: [
      { role: 'Senior Frontend Dev', years: '3-5', extraSkills: ['Performance', 'Testing'] },
      { role: 'UI Architect', years: '5-8', extraSkills: ['Design Systems', 'Accessibility'] },
      { role: 'VP of Engineering', years: '10+', extraSkills: ['Management', 'Strategy'] },
    ]
  },
  'Cloud Engineer': {
    icon: <FiCloud />,
    color: '#f59e0b',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Cloud Computing', 'Linux'],
    salary: '$95K–$170K',
    demand: 'Very High',
    children: [
      { role: 'DevOps Engineer', years: '2-4', extraSkills: ['CI/CD', 'Terraform'] },
      { role: 'Cloud Architect', years: '5-8', extraSkills: ['Multi-Cloud', 'Security'] },
      { role: 'CTO', years: '10+', extraSkills: ['Vision', 'Business'] },
    ]
  },
  'Cybersecurity Analyst': {
    icon: <FiShield />,
    color: '#ef4444',
    requiredSkills: ['Python', 'Networking', 'Linux', 'Security'],
    salary: '$80K–$155K',
    demand: 'Very High',
    children: [
      { role: 'Security Engineer', years: '3-5', extraSkills: ['Penetration Testing', 'SIEM'] },
      { role: 'Security Architect', years: '6-8', extraSkills: ['Compliance', 'Risk Management'] },
      { role: 'CISO', years: '10+', extraSkills: ['Governance', 'Strategy'] },
    ]
  },
  'Full Stack Developer': {
    icon: <FiActivity />,
    color: '#ec4899',
    requiredSkills: ['JavaScript', 'Node.js', 'React', 'SQL', 'Git'],
    salary: '$80K–$150K',
    demand: 'High',
    children: [
      { role: 'Senior Full Stack', years: '3-5', extraSkills: ['Microservices', 'GraphQL'] },
      { role: 'Engineering Manager', years: '6-8', extraSkills: ['Team Building', 'Agile'] },
      { role: 'Director of Engineering', years: '10+', extraSkills: ['Strategy', 'P&L'] },
    ]
  },
};

const CareerPathTree = ({ matchedSkills }) => {
  const [expandedPath, setExpandedPath] = useState(null);

  // Calculate match percentage for each career path
  const careerMatches = Object.entries(CAREER_PATHS).map(([title, path]) => {
    const matched = path.requiredSkills.filter(s =>
      matchedSkills.some(ms => ms.toLowerCase() === s.toLowerCase())
    );
    const pct = Math.round((matched.length / path.requiredSkills.length) * 100);
    return { title, ...path, matchedCount: matched.length, matchPct: pct, matchedList: matched };
  }).sort((a, b) => b.matchPct - a.matchPct);

  const topMatch = careerMatches[0];

  return (
    <div className="glass-card p-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="p-2.5 rounded-xl" style={{ background: 'rgba(236, 72, 153, 0.12)' }}>
          <FiTrendingUp className="text-pink-400" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Predictive Career Paths</h3>
          <p className="text-gray-500 text-xs mt-0.5">AI-predicted career trajectories based on your skill profile</p>
        </div>
      </div>

      {/* Top Match Banner */}
      {topMatch && topMatch.matchPct > 0 && (
        <div className="mb-6 p-4 rounded-xl flex items-center gap-4" style={{ background: `${topMatch.color}10`, border: `1px solid ${topMatch.color}25` }}>
          <div className="p-2 rounded-lg text-xl" style={{ background: `${topMatch.color}20`, color: topMatch.color }}>
            {topMatch.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm">{topMatch.title}</span>
              <FiStar className="text-yellow-400" size={14} />
              <span className="text-yellow-300 text-xs font-semibold">Best Match</span>
            </div>
            <p className="text-gray-400 text-xs mt-0.5">{topMatch.matchPct}% skill alignment • {topMatch.salary}</p>
          </div>
          <div className="text-2xl font-black" style={{ color: topMatch.color }}>{topMatch.matchPct}%</div>
        </div>
      )}

      {/* Career Path Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {careerMatches.map((career, i) => (
          <div key={i} className={`rounded-2xl transition-all duration-300 h-full ${expandedPath === career.title ? 'ring-2 ring-white/10 bg-white/5' : 'bg-white/[0.03]'}`} style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            {/* Card Header */}
            <button
              className="w-full p-4 flex items-center gap-3 text-left hover:bg-white/5 transition-all"
              onClick={() => setExpandedPath(expandedPath === career.title ? null : career.title)}
            >
              <div className="p-2 rounded-lg" style={{ background: `${career.color}15`, color: career.color }}>
                {career.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold text-sm">{career.title}</div>
                <div className="text-gray-500 text-xs">{career.salary} • {career.demand} demand</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-lg font-black" style={{ color: career.matchPct > 60 ? '#10b981' : career.matchPct > 30 ? '#f59e0b' : '#6b7280' }}>
                    {career.matchPct}%
                  </div>
                  <div className="text-[10px] text-gray-600">match</div>
                </div>
                <FiChevronRight
                  className={`text-gray-500 transition-transform ${expandedPath === career.title ? 'rotate-90' : ''}`}
                  size={16}
                />
              </div>
            </button>

            {/* Match Progress Bar */}
            <div className="px-4 pb-2">
              <div className="h-1.5 rounded-full overflow-hidden bg-white/5">
                <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ 
                  width: `${career.matchPct}%`, 
                  background: `linear-gradient(90deg, ${career.color}aa, ${career.color})`,
                  boxShadow: `0 0 10px ${career.color}40`
                }} />
              </div>
            </div>

            {/* Expanded Career Path */}
            {expandedPath === career.title && (
              <div className="px-4 pb-4 animate-fade-in">
                {/* Required Skills */}
                <div className="mb-3">
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mb-2">Required Skills</div>
                  <div className="flex flex-wrap gap-1.5">
                    {career.requiredSkills.map(skill => {
                      const isMatched = career.matchedList.some(m => m.toLowerCase() === skill.toLowerCase());
                      return (
                        <span key={skill} className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{
                          background: isMatched ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: isMatched ? '#6ee7b7' : '#fca5a5',
                          border: `1px solid ${isMatched ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                        }}>
                          {isMatched ? '✓' : '✗'} {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Career Progression Tree */}
                <div className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mb-2">Career Progression</div>
                <div className="relative pl-4 border-l-2 space-y-3" style={{ borderColor: `${career.color}30` }}>
                  {career.children.map((child, j) => (
                    <div key={j} className="relative pl-4">
                      <div className="absolute -left-[9px] top-1.5 w-3 h-3 rounded-full" style={{ background: career.color, border: '2px solid #111420' }} />
                      <div className="text-white text-sm font-semibold">{child.role}</div>
                      <div className="text-gray-500 text-xs">{child.years} years • Needs: {child.extraSkills.join(', ')}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerPathTree;
