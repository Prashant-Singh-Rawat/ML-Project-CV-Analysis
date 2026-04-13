import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Doughnut, Radar, Bar } from 'react-chartjs-2';
import html2pdf from 'html2pdf.js';
import ResumeHeatmap from './ResumeHeatmap';
import CareerPathTree from './CareerPathTree';
import BiometricInterview from './BiometricInterview';
import AIAvatar from './AIAvatar';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import {
  FiCheckCircle, FiAlertTriangle, FiBookOpen, FiBarChart2,
  FiTarget, FiZap, FiSettings, FiArrowLeft, FiDownload,
  FiTrendingDown, FiAward, FiClock, FiCalendar, FiStar,
  FiX, FiCpu, FiDatabase, FiLayers, FiUsers, FiRefreshCw,
  FiCamera, FiShield, FiGithub, FiActivity, FiGlobe, FiLink
} from 'react-icons/fi';

ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler, CategoryScale, LinearScale, BarElement);

// ============ Helper: Generate detailed analysis ============
const generateReasons = (placement_probability, skill_match_pct, matched_skills, missing_skills) => {
  const reasons = [];

  if (skill_match_pct < 50) {
    reasons.push({
      factor: 'Low Skill Match',
      impact: 'Critical',
      detail: `Only ${skill_match_pct.toFixed(0)}% of required skills matched. This is the biggest factor dragging down your score.`,
      pct: Math.min(40, Math.round(100 - skill_match_pct)),
    });
  } else if (skill_match_pct < 75) {
    reasons.push({
      factor: 'Moderate Skill Gap',
      impact: 'High',
      detail: `${skill_match_pct.toFixed(0)}% skill match is decent but not competitive. Top candidates typically exceed 80%.`,
      pct: Math.min(25, Math.round(100 - skill_match_pct)),
    });
  }

  if (missing_skills.length > 3) {
    reasons.push({
      factor: 'Too Many Missing Skills',
      impact: 'Critical',
      detail: `You're missing ${missing_skills.length} required skills. Recruiters look for ≥80% alignment.`,
      pct: missing_skills.length * 5,
    });
  } else if (missing_skills.length > 0) {
    reasons.push({
      factor: 'Key Skills Missing',
      impact: 'Medium',
      detail: `${missing_skills.length} important skill(s) not found in your CV: ${missing_skills.slice(0, 3).join(', ')}.`,
      pct: missing_skills.length * 8,
    });
  }

  if (placement_probability < 50) {
    reasons.push({
      factor: 'Below Average Profile',
      impact: 'High',
      detail: 'Your combined CGPA and skill profile falls below the competitive threshold for this company.',
      pct: 20,
    });
  }

  if (matched_skills.length < 3) {
    reasons.push({
      factor: 'Limited Resume Keywords',
      impact: 'Medium',
      detail: 'Very few industry-relevant keywords detected. ATS systems may filter your resume.',
      pct: 15,
    });
  }

  if (reasons.length === 0) {
    reasons.push({
      factor: 'Strong Profile',
      impact: 'Low',
      detail: 'Your profile is competitive! Minor improvements can still boost your chances.',
      pct: 5,
    });
  }

  return reasons;
};

const generateSkillPlan = (missing_skills) => {
  const skillResources = {
    'Python': { hours: 25, difficulty: 'Beginner', resource: 'Python.org + LeetCode', links: ['https://docs.python.org/3/tutorial/', 'https://leetcode.com/problemset/'], priority: 1 },
    'Java': { hours: 30, difficulty: 'Intermediate', resource: 'Oracle Java Tutorials + HackerRank', links: ['https://dev.java/learn/', 'https://www.hackerrank.com/domains/java'], priority: 2 },
    'C++': { hours: 35, difficulty: 'Advanced', resource: 'cppreference.com + Competitive Programming', links: ['https://en.cppreference.com/', 'https://codeforces.com/'], priority: 3 },
    'JavaScript': { hours: 20, difficulty: 'Beginner', resource: 'MDN Web Docs + freeCodeCamp', links: ['https://developer.mozilla.org/en-US/docs/Web/JavaScript', 'https://www.freecodecamp.org/'], priority: 1 },
    'SQL': { hours: 15, difficulty: 'Beginner', resource: 'SQLBolt + LeetCode Database', links: ['https://sqlbolt.com/', 'https://leetcode.com/problemset/?topicSlugs=database'], priority: 1 },
    'Machine Learning': { hours: 40, difficulty: 'Advanced', resource: 'Andrew Ng (Coursera) + Kaggle', links: ['https://www.coursera.org/learn/machine-learning', 'https://www.kaggle.com/learn'], priority: 2 },
    'Deep Learning': { hours: 45, difficulty: 'Advanced', resource: 'fast.ai + PyTorch Tutorials', links: ['https://course.fast.ai/', 'https://pytorch.org/tutorials/'], priority: 3 },
    'Web Development': { hours: 30, difficulty: 'Intermediate', resource: 'The Odin Project + MDN', links: ['https://www.theodinproject.com/', 'https://developer.mozilla.org/'], priority: 2 },
    'Data Structures': { hours: 35, difficulty: 'Intermediate', resource: 'GeeksforGeeks + NeetCode', links: ['https://www.geeksforgeeks.org/data-structures/', 'https://neetcode.io/'], priority: 1 },
    'Cloud Computing': { hours: 25, difficulty: 'Intermediate', resource: 'AWS Free Tier + Cloud Guru', links: ['https://aws.amazon.com/free/', 'https://acloudguru.com/'], priority: 2 },
    'React': { hours: 20, difficulty: 'Intermediate', resource: 'React.dev + Scrimba', links: ['https://react.dev/learn', 'https://scrimba.com/learn/learnreact'], priority: 2 },
    'Node.js': { hours: 20, difficulty: 'Intermediate', resource: 'NodeSchool + Express docs', links: ['https://nodeschool.io/', 'https://expressjs.com/'], priority: 2 },
    'Docker': { hours: 15, difficulty: 'Intermediate', resource: 'Docker Docs + Play with Docker', links: ['https://docs.docker.com/get-started/', 'https://labs.play-with-docker.com/'], priority: 3 },
    'Git': { hours: 8, difficulty: 'Beginner', resource: 'Git-SCM + GitHub Learning Lab', links: ['https://git-scm.com/book/en/v2', 'https://skills.github.com/'], priority: 1 },
    'AWS': { hours: 30, difficulty: 'Intermediate', resource: 'AWS Skill Builder + Stephane Maarek', links: ['https://skillbuilder.aws/', 'https://www.udemy.com/user/stephane-maarek/'], priority: 2 },
    'TensorFlow': { hours: 35, difficulty: 'Advanced', resource: 'TensorFlow.org + Coursera TF', links: ['https://www.tensorflow.org/tutorials', 'https://www.coursera.org/professional-certificates/tensorflow-in-practice'], priority: 3 },
  };

  return missing_skills.map(skill => {
    const info = skillResources[skill] || {
      hours: 20,
      difficulty: 'Intermediate',
      resource: 'Online tutorials + Documentation',
      links: ['https://www.coursera.org/', 'https://www.udemy.com/'],
      priority: 2,
    };
    return { skill, ...info };
  }).sort((a, b) => a.priority - b.priority);
};

const generateWeeklyRoutine = (skillPlan) => {
  const weeks = [];
  let currentWeek = 1;
  let remainingSkills = [...skillPlan];

  while (remainingSkills.length > 0) {
    const weekSkills = remainingSkills.splice(0, 2);
    const totalHours = weekSkills.reduce((sum, s) => sum + Math.ceil(s.hours / 2), 0);

    weeks.push({
      week: currentWeek,
      focus: weekSkills.map(s => s.skill),
      dailyHours: Math.ceil(totalHours / 5),
      tasks: weekSkills.map(s => ({
        skill: s.skill,
        task: `Study ${s.skill} fundamentals via ${s.resource}`,
        hours: Math.ceil(s.hours / 2),
      })),
      milestone: `Complete core ${weekSkills.map(s => s.skill).join(' & ')} concepts`,
    });

    if (weekSkills.some(s => s.hours > 15)) {
      currentWeek++;
      weeks.push({
        week: currentWeek,
        focus: weekSkills.map(s => s.skill),
        dailyHours: Math.ceil(totalHours / 5),
        tasks: weekSkills.map(s => ({
          skill: s.skill,
          task: `Build practice projects with ${s.skill}`,
          hours: Math.ceil(s.hours / 2),
        })),
        milestone: `Complete ${weekSkills.map(s => s.skill).join(' & ')} hands-on projects`,
      });
    }

    currentWeek++;
  }

  return weeks;
};


// ============ Settings Modal ============
const SettingsModal = ({ metrics, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-2xl p-8 animate-fade-in-up"
        style={{ background: '#111420', border: '1px solid rgba(255,255,255,0.08)' }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition">
          <FiX size={20} />
        </button>

        <h2 className="text-xl font-bold text-white mb-1">Model Configuration</h2>
        <p className="text-gray-500 text-xs mb-6">Technical details of the ML pipeline</p>

        <div className="space-y-4">
          {[
            { icon: <FiCpu />, label: 'Algorithm', value: 'RandomForestClassifier', color: '#8b5cf6' },
            { icon: <FiDatabase />, label: 'Training Data', value: '10,000 synthetic profiles', color: '#3b82f6' },
            { icon: <FiLayers />, label: 'Estimators', value: '100 decision trees', color: '#10b981' },
            { icon: <FiTarget />, label: 'Test Split', value: '80% train / 20% test', color: '#f59e0b' },
            { icon: <FiZap />, label: 'NLP Engine', value: 'spaCy en_core_web_sm', color: '#ec4899' },
            { icon: <FiBarChart2 />, label: 'Feature Vectors', value: 'CGPA + Skill Match + Company Encoding', color: '#06b6d4' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="p-2 rounded-lg" style={{ background: `${item.color}15`, color: item.color }}>
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">{item.label}</div>
                <div className="text-white text-sm font-semibold">{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {metrics && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              { label: 'Accuracy', value: (metrics.accuracy * 100).toFixed(1) + '%' },
              { label: 'F1 Score', value: (metrics.f1_score * 100).toFixed(1) + '%' },
              { label: 'Precision', value: (metrics.precision * 100).toFixed(1) + '%' },
              { label: 'Recall', value: (metrics.recall * 100).toFixed(1) + '%' },
            ].map((m, i) => (
              <div key={i} className="text-center p-3 rounded-xl" style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.12)' }}>
                <div className="text-lg font-black text-white">{m.value}</div>
                <div className="text-gray-500 text-[10px] uppercase tracking-wider">{m.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


// ============ PDF Generator — builds a clean printable HTML ============
const buildPDFContent = (result, skillPlan, weeklyRoutine, targetScore, totalUpskillHours) => {
  const { placement_probability, placement_status, skill_match_pct, matched_skills, missing_skills } = result;
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; padding: 40px; max-width: 700px; margin: 0 auto;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #7c3aed; padding-bottom: 20px;">
        <h1 style="margin: 0; font-size: 28px; color: #7c3aed;">TonyCV — Action Plan</h1>
        <p style="margin: 6px 0 0; color: #888; font-size: 12px;">Generated on ${date} • AI-Powered CV Analysis Report</p>
      </div>

      <!-- Score Summary -->
      <div style="display: flex; gap: 12px; margin-bottom: 25px;">
        <div style="flex:1; background: #f8f9fa; border-radius: 10px; padding: 16px; text-align: center; border: 1px solid #e9ecef;">
          <div style="font-size: 24px; font-weight: 800; color: ${placement_probability > 75 ? '#10b981' : placement_probability > 45 ? '#f59e0b' : '#ef4444'};">${placement_probability}%</div>
          <div style="font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Placement Score</div>
        </div>
        <div style="flex:1; background: #f8f9fa; border-radius: 10px; padding: 16px; text-align: center; border: 1px solid #e9ecef;">
          <div style="font-size: 24px; font-weight: 800; color: #7c3aed;">${Math.round(skill_match_pct)}%</div>
          <div style="font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Skill Match</div>
        </div>
        <div style="flex:1; background: #f8f9fa; border-radius: 10px; padding: 16px; text-align: center; border: 1px solid #e9ecef;">
          <div style="font-size: 24px; font-weight: 800; color: #10b981;">${targetScore}%</div>
          <div style="font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Target Score</div>
        </div>
      </div>

      <!-- Status -->
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin-bottom: 25px;">
        <strong style="color: #166534;">Status:</strong> <span style="color: #15803d;">${placement_status}</span> •
        <strong style="color: #166534;">Matched:</strong> <span style="color: #15803d;">${matched_skills.length} skills</span> •
        <strong style="color: #166534;">Missing:</strong> <span style="color: #dc2626;">${missing_skills.length} skills</span>
      </div>

      <!-- Skills Section -->
      <h2 style="font-size: 18px; color: #1a1a2e; border-bottom: 2px solid #e9ecef; padding-bottom: 8px; margin-bottom: 16px;">
        📊 Skills to Improve
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px;">
        <tr style="background: #f8f9fa;">
          <th style="text-align: left; padding: 10px 12px; border: 1px solid #e9ecef; font-weight: 700;">#</th>
          <th style="text-align: left; padding: 10px 12px; border: 1px solid #e9ecef; font-weight: 700;">Skill</th>
          <th style="text-align: left; padding: 10px 12px; border: 1px solid #e9ecef; font-weight: 700;">Difficulty</th>
          <th style="text-align: left; padding: 10px 12px; border: 1px solid #e9ecef; font-weight: 700;">Hours</th>
          <th style="text-align: left; padding: 10px 12px; border: 1px solid #e9ecef; font-weight: 700;">Resources</th>
        </tr>
        ${skillPlan.map((s, i) => `
          <tr>
            <td style="padding: 10px 12px; border: 1px solid #e9ecef; font-weight: 700; color: #7c3aed;">${i + 1}</td>
            <td style="padding: 10px 12px; border: 1px solid #e9ecef; font-weight: 600;">${s.skill}</td>
            <td style="padding: 10px 12px; border: 1px solid #e9ecef;">
              <span style="background: ${s.difficulty === 'Beginner' ? '#dcfce7' : s.difficulty === 'Intermediate' ? '#fef9c3' : '#fee2e2'}; color: ${s.difficulty === 'Beginner' ? '#166534' : s.difficulty === 'Intermediate' ? '#854d0e' : '#991b1b'}; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">${s.difficulty}</span>
            </td>
            <td style="padding: 10px 12px; border: 1px solid #e9ecef; font-weight: 700;">${s.hours}h</td>
            <td style="padding: 10px 12px; border: 1px solid #e9ecef; font-size: 11px;">
              ${(s.links || []).map(link => `<a href="${link}" style="color: #7c3aed; text-decoration: none;">${link.replace('https://', '').split('/')[0]}</a>`).join(' • ')}
            </td>
          </tr>
        `).join('')}
        <tr style="background: #f3f0ff;">
          <td colspan="3" style="padding: 10px 12px; border: 1px solid #e9ecef; font-weight: 700; color: #7c3aed;">Total Estimated Time</td>
          <td colspan="2" style="padding: 10px 12px; border: 1px solid #e9ecef; font-weight: 800; font-size: 16px; color: #7c3aed;">${totalUpskillHours} hours (~${Math.ceil(totalUpskillHours / 10)} weeks at 2h/day)</td>
        </tr>
      </table>

      <!-- Weekly Routine -->
      <h2 style="font-size: 18px; color: #1a1a2e; border-bottom: 2px solid #e9ecef; padding-bottom: 8px; margin-bottom: 16px;">
        📅 Weekly Study Routine
      </h2>
      ${weeklyRoutine.map(week => `
        <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 10px; padding: 16px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div>
              <span style="background: #7c3aed; color: white; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700;">Week ${week.week}</span>
              <span style="margin-left: 8px; color: #555; font-size: 13px;">Focus: <strong>${week.focus.join(' & ')}</strong></span>
            </div>
            <span style="color: #888; font-size: 12px;">⏱ ${week.dailyHours}h/day</span>
          </div>
          ${week.tasks.map(task => `
            <div style="padding: 6px 0 6px 16px; border-left: 2px solid #7c3aed; margin-bottom: 6px; font-size: 13px; color: #333;">
              ${task.task} <span style="color: #888; font-size: 11px;">(${task.hours}h)</span>
            </div>
          `).join('')}
          <div style="margin-top: 8px; font-size: 12px; color: #d97706;">
            ⭐ Milestone: ${week.milestone}
          </div>
        </div>
      `).join('')}

      <!-- Where to Study -->
      <h2 style="font-size: 18px; color: #1a1a2e; border-bottom: 2px solid #e9ecef; padding-bottom: 8px; margin: 25px 0 16px;">
        🔗 Where to Study — Resource Links
      </h2>
      <div style="margin-bottom: 25px;">
        ${skillPlan.map(s => `
          <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 12px 16px; margin-bottom: 8px;">
            <div style="font-weight: 700; color: #6d28d9; font-size: 14px; margin-bottom: 4px;">${s.skill}</div>
            <div style="font-size: 12px; color: #555;">
              ${(s.links || []).map(link => `<div style="margin: 2px 0;">→ <a href="${link}" style="color: #7c3aed; text-decoration: underline;">${link}</a></div>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e9ecef;">
        <p style="color: #7c3aed; font-weight: 700; font-size: 14px;">TonyCV AI Engine</p>
        <p style="color: #aaa; font-size: 11px;">This report was generated by TonyCV's NLP + ML pipeline.<br/>Follow the roadmap above to maximize your placement chances.</p>
      </div>
    </div>
  `;
};


// ============ Main Dashboard ============
const Dashboard = ({ result, metrics, onBack }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isBiometricOpen, setIsBiometricOpen] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintTxHash, setMintTxHash] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Adaptive Learning: track learned skills with localStorage
  const [learnedSkills, setLearnedSkills] = useState(() => {
    try {
      const saved = localStorage.getItem('tonycv_learned_skills');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('tonycv_learned_skills', JSON.stringify(learnedSkills));
  }, [learnedSkills]);

  const toggleLearnedSkill = useCallback((skill) => {
    setLearnedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  }, []);

  const resetLearnedSkills = useCallback(() => {
    setLearnedSkills([]);
    localStorage.removeItem('tonycv_learned_skills');
  }, []);

  if (!result) return null;

  const {
    placement_probability,
    placement_status,
    skill_match_pct,
    matched_skills,
    missing_skills,
    github_analysis,
    market_pulse_adjustments
  } = result;

  const statusColor = placement_probability > 75 ? '#10b981' : placement_probability > 45 ? '#f59e0b' : '#ef4444';
  const reasons = generateReasons(placement_probability, skill_match_pct, matched_skills, missing_skills);
  const skillPlan = generateSkillPlan(missing_skills);
  const weeklyRoutine = generateWeeklyRoutine(skillPlan);
  const totalUpskillHours = skillPlan.reduce((sum, s) => sum + s.hours, 0);
  const targetScore = Math.round(Math.min(95, placement_probability + missing_skills.length * 12));

  // Adaptive: remaining skills & projected score
  const remainingSkills = missing_skills.filter(s => !learnedSkills.includes(s));
  const learnedCount = missing_skills.length - remainingSkills.length;
  const projectedScore = Math.round(Math.min(98, placement_probability + learnedCount * 12));
  const remainingHours = skillPlan.filter(s => !learnedSkills.includes(s.skill)).reduce((sum, s) => sum + s.hours, 0);

  // Industry Benchmark data
  const benchmarkData = {
    avgCgpa: 8.2,
    avgSkillMatch: 78,
    topCandidateSkillMatch: 92,
    avgPlacement: 72,
    totalCandidates: 10000,
  };

  const impactColors = {
    'Critical': { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.25)', text: '#fca5a5', bar: '#ef4444' },
    'High': { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.25)', text: '#fde68a', bar: '#f59e0b' },
    'Medium': { bg: 'rgba(96, 165, 250, 0.1)', border: 'rgba(96, 165, 250, 0.25)', text: '#93c5fd', bar: '#3b82f6' },
    'Low': { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.25)', text: '#6ee7b7', bar: '#10b981' },
  };

  const difficultyColors = {
    'Beginner': '#10b981',
    'Intermediate': '#f59e0b',
    'Advanced': '#ef4444',
  };

  // Charts Config
  const gaugeData = {
    labels: ['Probability', 'Remaining'],
    datasets: [{
      data: [placement_probability, 100 - placement_probability],
      backgroundColor: [statusColor, 'rgba(255, 255, 255, 0.04)'],
      borderWidth: 0,
      circumference: 180,
      rotation: 270,
    }]
  };

  const gaugeOptions = {
    cutout: '80%',
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    maintainAspectRatio: false,
  };

  const barData = {
    labels: skillPlan.map(s => s.skill),
    datasets: [{
      label: 'Hours to Learn',
      data: skillPlan.map(s => s.hours),
      backgroundColor: skillPlan.map(s => difficultyColors[s.difficulty] + '40'),
      borderColor: skillPlan.map(s => difficultyColors[s.difficulty]),
      borderWidth: 1,
      borderRadius: 6,
    }]
  };

  const barOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#6b7280' } },
      y: { grid: { display: false }, ticks: { color: '#d1d5db' } }
    },
    plugins: { legend: { display: false } }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const pdfHTML = buildPDFContent(result, skillPlan, weeklyRoutine, targetScore, totalUpskillHours);
      const opt = {
        margin: [8, 5, 8, 5],
        filename: `TonyCV_Plan_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };
      const generatePdf = typeof html2pdf === 'function' ? html2pdf : (html2pdf.default || window.html2pdf);
      if (!generatePdf) throw new Error('PDF library not loaded');
      await generatePdf().set(opt).from(pdfHTML).save();
    } catch (err) {
      console.error('PDF failed:', err);
      alert('PDF download failed: ' + (err.message || 'Please try again.'));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleMintToBlockchain = () => {
    setIsMinting(true);
    setTimeout(() => {
      setMintTxHash('0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''));
      setIsMinting(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto relative">
      {showSettings && <SettingsModal metrics={metrics} onClose={() => setShowSettings(false)} />}
      <BiometricInterview isOpen={isBiometricOpen} onClose={() => setIsBiometricOpen(false)} />
      <AIAvatar placement_probability={placement_probability} missing_skills={missing_skills} result={result} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-all bg-white/5 border border-white/10 group">
          <FiArrowLeft className="group-hover:-translate-x-1" size={16} /> Back to Dashboard
        </button>
        <div className="flex gap-2">
          <button onClick={() => setIsBiometricOpen(true)} className="flex items-center gap-2 py-2 px-4 rounded-lg font-bold text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <FiCamera size={14} /> Start Mock Interview
          </button>
          <button onClick={handleMintToBlockchain} disabled={isMinting} className="flex items-center gap-2 py-2 px-4 rounded-lg font-bold text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <FiShield size={14} /> {isMinting ? 'Minting...' : mintTxHash ? 'Verified' : 'Mint to Blockchain'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10">
        {[
          { id: 'overview', icon: <FiBarChart2 />, label: 'Overview' },
          { id: 'verification', icon: <FiShield />, label: 'Verification' },
          { id: 'learning', icon: <FiBookOpen />, label: 'Learning' },
          { id: 'insights', icon: <FiTarget />, label: 'Insights' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            {tab.icon} <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeTab === 'overview' && (
          <>
            <div className="glass-card p-8 flex flex-col items-center justify-center col-span-1">
              <h3 className="text-lg font-bold text-white mb-6">Placement Probability</h3>
              <div className="relative w-56 h-28">
                <Doughnut data={gaugeData} options={gaugeOptions} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-2 text-center text-3xl font-black" style={{ color: statusColor }}>{placement_probability}%</div>
              </div>
              <div className="mt-8 px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider" style={{ background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30` }}>{placement_status}</div>
            </div>

            <div className="glass-card p-8 col-span-1">
               <h3 className="text-lg font-bold text-white mb-6">Comparison Metrics</h3>
               <div className="space-y-4">
                 {[
                   { label: 'Skill Match', value: skill_match_pct, color: '#8b5cf6' },
                   { label: 'Industry Avg', value: 72, color: '#3b82f6' },
                   { label: 'Top Candidate', value: 92, color: '#10b981' }
                 ].map(m => (
                   <div key={m.label}>
                     <div className="flex justify-between text-xs text-gray-400 mb-1">
                       <span>{m.label}</span>
                       <span style={{ color: m.color }}>{m.value}%</span>
                     </div>
                     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full transition-all duration-1000" style={{ width: `${m.value}%`, background: m.color }} />
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            <div className="glass-card p-8 lg:col-span-2">
              <h3 className="text-lg font-bold text-white mb-6">Why Your Score is {placement_probability}%</h3>
              <div className="space-y-3">
                {reasons.map((r, i) => (
                  <div key={i} className="p-4 rounded-xl flex gap-4" style={{ background: impactColors[r.impact].bg, border: `1px solid ${impactColors[r.impact].border}` }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-xs" style={{ background: impactColors[r.impact].border, color: impactColors[r.impact].text }}>{r.pct}%</div>
                    <div className="flex-1">
                      <div className="font-bold text-sm" style={{ color: impactColors[r.impact].text }}>{r.factor} ({r.impact} Impact)</div>
                      <p className="text-gray-400 text-xs mt-1">{r.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'verification' && (
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-8">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><FiShield className="text-blue-400"/> CV Trust Index</h3>
              <div className="h-4 bg-white/5 rounded-full overflow-hidden flex mb-2">
                <div className="h-full bg-emerald-500" style={{ width: '82%' }} />
                <div className="h-full bg-yellow-500/50" style={{ width: '18%' }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500 font-bold uppercase tracking-wider">
                <span className="text-emerald-400">82% Verified</span>
                <span className="text-yellow-400">18% Pending</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2"><FiGithub /> GitHub Scanner</h4>
                <div className="space-y-3">
                  {github_analysis?.map((a, i) => (
                    <div key={i} className="p-3 rounded-lg border border-white/5 bg-white/5 flex gap-3">
                       <FiAlertTriangle className={a.severity === 'High' ? 'text-red-400' : 'text-yellow-400'} />
                       <div>
                         <p className="text-xs font-bold text-white">{a.issue}</p>
                         <p className="text-[10px] text-gray-500">{a.detail}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card p-6">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2"><FiGlobe className="text-blue-500"/> LinkedIn Audit</h4>
                <div className="space-y-3 text-xs text-gray-400">
                  <div className="flex gap-2 items-center"><FiCheckCircle className="text-emerald-400"/> Role Matching: 100% Correct</div>
                  <div className="flex gap-2 items-center"><FiCheckCircle className="text-emerald-400"/> Skill Endorsements Found</div>
                  <div className="flex gap-2 items-center"><FiAlertTriangle className="text-yellow-400"/> Low activity detected</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learning' && (
          <div className="lg:col-span-2 space-y-6">

            {/* ── Score Boost Banner ── */}
            <div className="glass-card p-6 flex items-center justify-between" style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.12),rgba(16,185,129,0.08))', border: '1px solid rgba(139,92,246,0.2)' }}>
              <div>
                <h3 className="text-lg font-bold text-white">Adaptive Learning Roadmap</h3>
                <p className="text-xs text-gray-400 mt-1">Tick a skill when you learn it — your score updates instantly</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-emerald-400">+{Math.round(projectedScore - placement_probability)}%</div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Projected Boost</p>
              </div>
            </div>

            {/* ── Skill Checkboxes ── */}
            <div className="glass-card p-8">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2"><FiAward className="text-violet-400" /> Skills to Learn</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {missing_skills.map(s => (
                  <button key={s} onClick={() => toggleLearnedSkill(s)}
                    className={`p-4 rounded-xl flex items-center gap-3 transition-all border text-left ${learnedSkills.includes(s) ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10 hover:border-violet-500/40'}`}>
                    <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center ${learnedSkills.includes(s) ? 'bg-emerald-500' : 'bg-white/10'}`}>
                      {learnedSkills.includes(s) && <FiCheckCircle size={12} className="text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`font-semibold text-sm ${learnedSkills.includes(s) ? 'text-emerald-300 line-through' : 'text-white'}`}>{s}</span>
                      <span className="text-gray-600 text-xs ml-2">{skillPlan.find(p => p.skill === s)?.hours || 20}h</span>
                    </div>
                    {learnedSkills.includes(s) && <span className="text-emerald-400 text-xs font-bold flex-shrink-0">Done ✓</span>}
                  </button>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mb-2 flex justify-between text-xs text-gray-400">
                <span>Learning Progress</span>
                <span className="text-emerald-400 font-bold">{missing_skills.length > 0 ? Math.round((learnedCount / missing_skills.length) * 100) : 0}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden bg-white/5">
                <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${missing_skills.length > 0 ? (learnedCount / missing_skills.length) * 100 : 0}%` }} />
              </div>
            </div>

            {/* ── Bar Chart ── */}
            {skillPlan.length > 0 && (
              <div className="glass-card p-8">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2"><FiBarChart2 className="text-yellow-400" /> Skill Improvement Roadmap</h4>
                <p className="text-gray-500 text-xs mb-6">Prioritized skills with estimated learning hours and resources</p>
                <div style={{ height: `${Math.max(180, skillPlan.length * 56)}px` }}>
                  <Bar data={barData} options={barOptions} />
                </div>
              </div>
            )}

            {/* ── Course Cards with Links ── */}
            {skillPlan.length > 0 && (
              <div className="glass-card p-8">
                <h4 className="text-white font-bold mb-6 flex items-center gap-2"><FiBookOpen className="text-violet-400" /> Course Resources & Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skillPlan.map((s, i) => (
                    <div key={i} className="p-4 rounded-xl transition-all hover:scale-[1.01]"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0"
                          style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}>#{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-sm">{s.skill}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                              style={{ background: `${difficultyColors[s.difficulty]}18`, color: difficultyColors[s.difficulty], border: `1px solid ${difficultyColors[s.difficulty]}30` }}>
                              {s.difficulty}
                            </span>
                          </div>
                          <p className="text-gray-500 text-xs mt-0.5 truncate">{s.resource}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-black text-white">{s.hours}h</div>
                          <div className="text-gray-600 text-[10px]">est.</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(s.links || []).map((link, li) => (
                          <a key={li} href={link} target="_blank" rel="noopener noreferrer"
                            className="text-[11px] px-3 py-1 rounded-lg font-semibold transition-all hover:opacity-80"
                            style={{ background: 'rgba(139,92,246,0.15)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.2)' }}>
                            🔗 {link.replace('https://', '').split('/')[0]}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 p-4 rounded-xl flex items-center justify-between"
                  style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
                  <div className="flex items-center gap-2 text-violet-300 text-sm font-semibold">
                    <FiClock size={16} /> Total time: <span className="text-white font-black">{totalUpskillHours} hours</span>
                  </div>
                  <div className="text-violet-400 text-xs">~{Math.ceil(totalUpskillHours / 10)} weeks at 2h/day</div>
                </div>
              </div>
            )}

            {/* ── Weekly Study Routine ── */}
            {weeklyRoutine.length > 0 && (
              <div className="glass-card p-8">
                <h4 className="text-white font-bold mb-6 flex items-center gap-2"><FiCalendar className="text-blue-400" /> Weekly Study Routine</h4>
                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-px bg-blue-500/20" />
                  <div className="space-y-5">
                    {weeklyRoutine.map((week, i) => (
                      <div key={i} className="relative pl-14">
                        <div className="absolute left-3 top-1 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: '#06080f', border: '2px solid #3b82f6' }}>
                          <div className="w-2 h-2 rounded-full bg-blue-400" />
                        </div>
                        <div className="p-5 rounded-xl hover:scale-[1.005] transition-all"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-lg text-xs font-bold text-blue-300 bg-blue-500/15">Week {week.week}</span>
                              <span className="text-gray-400 text-xs">Focus: <span className="text-white font-semibold">{week.focus.join(' & ')}</span></span>
                            </div>
                            <span className="text-gray-500 text-xs flex items-center gap-1"><FiClock size={11} /> {week.dailyHours}h/day</span>
                          </div>
                          <div className="space-y-1.5 mb-3">
                            {week.tasks.map((task, j) => (
                              <div key={j} className="flex items-center gap-3 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                <span className="text-gray-300 flex-1">{task.task}</span>
                                <span className="text-gray-600 text-xs">{task.hours}h</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 text-xs pt-3 border-t border-white/5">
                            <FiStar className="text-yellow-400" size={11} />
                            <span className="text-yellow-200/80">Milestone: {week.milestone}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 p-5 rounded-xl text-center"
                  style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(59,130,246,0.08))', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <div className="text-emerald-400 text-sm font-bold mb-1">🎯 End Goal</div>
                  <p className="text-gray-300 text-sm">After completing this plan, your estimated placement probability will increase to <span className="text-white font-black">{targetScore}%</span></p>
                </div>
              </div>
            )}

            {/* ── PDF Download ── */}
            <div className="glass-card p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/15">
                  <FiDownload className="text-emerald-400" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold">Download Your Full Plan</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Complete roadmap with weekly schedule + all clickable links as PDF</p>
                </div>
              </div>
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 active:scale-100 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: isDownloading ? '#374151' : 'linear-gradient(135deg,#10b981,#059669)', boxShadow: isDownloading ? 'none' : '0 4px 20px rgba(16,185,129,0.3)' }}>
                {isDownloading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</>
                ) : (
                  <><FiDownload size={16} /> Download PDF</>
                )}
              </button>
            </div>

          </div>
        )}

        {activeTab === 'insights' && (
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-8">
              <h3 className="text-lg font-bold text-white mb-6">CV Keyword Heatmap</h3>
              <ResumeHeatmap cvText={result.cv_text} matchedSkills={matched_skills} missingSkills={missing_skills} />
            </div>
            <div className="glass-card p-8 h-[500px]">
              <h3 className="text-lg font-bold text-white mb-6">Career Path Network</h3>
              <CareerPathTree matchedSkills={matched_skills} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
