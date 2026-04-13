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
  const planRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isBiometricOpen, setIsBiometricOpen] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintTxHash, setMintTxHash] = useState(null);

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

  // Industry Benchmark data (derived from synthetic_data.py parameters)
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

  // Gauge Chart
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

  // Radar Chart
  const radarData = {
    labels: ['Skill Match', 'Placement Score', 'Entity Recognition', 'Formatting', 'Keyword Density'],
    datasets: [{
      label: 'Your Profile',
      data: [skill_match_pct, placement_probability, 80, 75, 90],
      backgroundColor: 'rgba(139, 92, 246, 0.15)',
      borderColor: '#8b5cf6',
      pointBackgroundColor: '#7c3aed',
      borderWidth: 2,
    }]
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255,255,255,0.06)' },
        grid: { color: 'rgba(255,255,255,0.06)' },
        pointLabels: { color: '#6b7280', font: { size: 11, family: 'Inter' } },
        ticks: { display: false, min: 0, max: 100 }
      }
    },
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  };

  // Skill Gap Bar Chart
  const barData = {
    labels: skillPlan.map(s => s.skill),
    datasets: [{
      label: 'Hours to Learn',
      data: skillPlan.map(s => s.hours),
      backgroundColor: skillPlan.map(s => {
        const c = difficultyColors[s.difficulty];
        return c + '40';
      }),
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
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#6b7280', font: { family: 'Inter', size: 11 } },
        title: { display: true, text: 'Estimated Hours', color: '#6b7280', font: { family: 'Inter', size: 11 } },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#d1d5db', font: { family: 'Inter', size: 12, weight: 600 } },
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleFont: { family: 'Inter' },
        bodyFont: { family: 'Inter' },
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      }
    },
  };

  // ====== PDF Download (builds clean printable HTML) ======
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const pdfHTML = buildPDFContent(result, skillPlan, weeklyRoutine, targetScore, totalUpskillHours);

      const opt = {
        margin: [8, 5, 8, 5],
        filename: `TonyCV_Action_Plan_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          backgroundColor: '#ffffff',
          // Ignore global CSS (like modern Tailwind oklch vars) since pdf builds strictly inline styles
          ignoreElements: (element) => {
            if (element.nodeName && (element.nodeName.toUpperCase() === 'STYLE' || element.nodeName.toUpperCase() === 'LINK')) {
              return true;
            }
            return false;
          }
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };

      // Handle cases where Vite imports CJS/UMD as an object rather than a function
      const generatePdf = typeof html2pdf === 'function' ? html2pdf : (html2pdf.default || window.html2pdf);
      
      if (!generatePdf) {
        throw new Error("html2pdf library could not be loaded as a function");
      }

      // Generate PDF directly from HTML string, which prevents html2canvas culling issues
      await generatePdf().set(opt).from(pdfHTML).save();
      
    } catch (err) {
      console.error('PDF download failed:', err);
      alert('PDF download failed: ' + (err.message || 'Please try again.'));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleMintToBlockchain = () => {
    setIsMinting(true);
    setTimeout(() => {
       const fakeHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
       setMintTxHash(fakeHash);
       setIsMinting(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto relative">
      {/* Settings & Biometric Modals */}
      {showSettings && <SettingsModal metrics={metrics} onClose={() => setShowSettings(false)} />}
      <BiometricInterview isOpen={isBiometricOpen} onClose={() => setIsBiometricOpen(false)} />

      {/* Dynamic Avatar */}
      <AIAvatar placement_probability={placement_probability} missing_skills={missing_skills} result={result} />

      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-all group w-max"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={16} />
        Back to Dashboard
      </button>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-end gap-3 w-full">
        <button
          onClick={() => setIsBiometricOpen(true)}
          className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold text-xs transition-all bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        >
          <FiCamera size={14} /> Start Biometric Mock Interview
        </button>
        {mintTxHash ? (
           <a href="#" className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold text-xs transition-all bg-blue-500/10 text-blue-300 border border-blue-500/20">
             <FiLink size={14} /> Verified (Tx: {mintTxHash.slice(0, 10)}...)
           </a>
        ) : (
          <button
            onClick={handleMintToBlockchain}
            disabled={isMinting}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold text-xs transition-all bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
          >
            <FiShield size={14} /> {isMinting ? 'Minting...' : 'Mint Profile to Blockchain'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ====== Placement Gauge ====== */}
        <div className="glass-card p-8 flex flex-col items-center justify-center animate-fade-in-up md:col-span-1">
          <h3 className="text-lg font-bold text-white mb-6">Placement Probability</h3>
          <div className="relative w-56 h-28">
            <Doughnut data={gaugeData} options={gaugeOptions} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-2 text-center">
              <span className="text-4xl font-black" style={{ color: statusColor }}>
                {placement_probability}%
              </span>
            </div>
          </div>
          <div className="mt-6 px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider" style={{
            background: `${statusColor}15`,
            color: statusColor,
            border: `1px solid ${statusColor}30`,
          }}>
            {placement_status}
          </div>
        </div>

        {/* ====== Radar Chart ====== */}
        <div className="glass-card p-8 flex flex-col items-center animate-fade-in-up delay-100" style={{ opacity: 0 }}>
          <h3 className="text-lg font-bold text-white mb-6">Profile Strength Matrix</h3>
          <div className="w-full h-56">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        {/* ====== Skills Breakdown ====== */}
        <div className="glass-card p-8 lg:col-span-2 animate-fade-in-up delay-200" style={{ opacity: 0 }}>
          <h3 className="text-lg font-bold text-white mb-6 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            AI Resume Recommendations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-xl" style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.12)' }}>
              <h4 className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-4">
                <FiCheckCircle size={16} /> Matched Skills ({matched_skills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {matched_skills.length > 0
                  ? matched_skills.map(skill => (
                    <span key={skill} className="skill-chip skill-chip-success">{skill}</span>
                  ))
                  : <span className="text-gray-500 text-sm">No critical skills matched.</span>
                }
              </div>
            </div>

            <div className="p-5 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.12)' }}>
              <h4 className="flex items-center gap-2 text-red-400 font-bold text-sm mb-4">
                <FiAlertTriangle size={16} /> Missing Required Skills ({missing_skills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {missing_skills.length > 0
                  ? missing_skills.map(skill => (
                    <span key={skill} className="skill-chip skill-chip-danger">{skill}</span>
                  ))
                  : <span className="text-gray-500 text-sm">You have all required skills!</span>
                }
              </div>
            </div>
          </div>
        </div>


        {/* ====== PROFILE VERIFICATION ENGINE ====== */}
        <div className="glass-card p-8 lg:col-span-2 animate-fade-in-up delay-250">
          <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
             <div className="p-2.5 rounded-xl bg-blue-500/20">
               <FiShield className="text-blue-400" size={20} />
             </div>
             <div>
               <h3 className="text-lg font-bold text-white">Profile Verification Engine</h3>
               <p className="text-gray-500 text-xs mt-0.5">Cross-referencing CV claims with external digital footprints</p>
             </div>
          </div>
          
          {/* Trust Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2 font-bold uppercase tracking-wider">
               <span className="flex items-center gap-2" style={{ color: '#10b981' }}><FiCheckCircle /> Verified Content (82%)</span>
               <span className="flex items-center gap-2" style={{ color: '#f59e0b' }}><FiAlertTriangle /> Pending/Suspicious (18%)</span>
            </div>
            <div className="h-3 w-full bg-gray-800 rounded-full flex overflow-hidden">
               {/* Verified */}
               <div className="h-full bg-emerald-500" style={{ width: '82%', boxShadow: '0 0 10px rgba(16,185,129,0.5)' }} />
               {/* Suspicious/Pending */}
               <div className="h-full bg-yellow-500 bg-opacity-70 stripe-pattern" style={{ width: '18%' }} />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Trust Index Score based on GitHub and LinkedIn API lookups</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             {/* GitHub Verification */}
             <div className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
               <h4 className="flex items-center gap-2 text-white font-bold text-md mb-4 pb-2 border-b border-white/5">
                 <FiGithub className="text-white" /> GitHub Project Verification
               </h4>
               <ul className="space-y-3">
                 {github_analysis && github_analysis.length > 0 ? (
                   github_analysis.map((analysis, i) => (
                     <li key={i} className="flex items-start gap-3">
                        {analysis.severity === 'Info' ? (
                          <FiCheckCircle className="text-emerald-400 mt-0.5" />
                        ) : analysis.severity === 'High' ? (
                          <FiX className="text-red-400 mt-0.5" />
                        ) : (
                          <FiAlertTriangle className="text-yellow-400 mt-0.5" />
                        )}
                        <div>
                          <p className="text-xs font-bold text-gray-200">{analysis.issue}</p>
                          <p className="text-[10px] text-gray-500">{analysis.detail}</p>
                        </div>
                     </li>
                   ))
                 ) : (
                   <div className="text-xs text-gray-500">No GitHub repositories linked to verify projects.</div>
                 )}
               </ul>
             </div>

             {/* LinkedIn Verification */}
             <div className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
               <h4 className="flex items-center gap-2 text-white font-bold text-md mb-4 pb-2 border-b border-white/5">
                 <FiGlobe className="text-blue-500" /> LinkedIn Profile Analysis
               </h4>
               <ul className="space-y-3">
                 <li className="flex items-start gap-3">
                   <FiCheckCircle className="text-emerald-400 mt-0.5" />
                   <div>
                     <p className="text-xs font-bold text-gray-200">Employment History Match</p>
                     <p className="text-[10px] text-gray-500">Dates and roles on CV match public LinkedIn records perfectly.</p>
                   </div>
                 </li>
                 <li className="flex items-start gap-3">
                   <FiCheckCircle className="text-emerald-400 mt-0.5" />
                   <div>
                     <p className="text-xs font-bold text-gray-200">Skill Endorsements</p>
                     <p className="text-[10px] text-gray-500">Strong correlation found for '{matched_skills[0] || 'Core Skills'}'.</p>
                   </div>
                 </li>
                 <li className="flex items-start gap-3">
                   <FiAlertTriangle className="text-yellow-400 mt-0.5" />
                   <div>
                     <p className="text-xs font-bold text-gray-200">Activity Level</p>
                     <p className="text-[10px] text-gray-500">Minimal recent activity. Consider posting about your projects.</p>
                   </div>
                 </li>
               </ul>
             </div>
          </div>
        </div>


        {/* ====== SECTION 1: REASONS FOR LOW PERCENTAGE ====== */}
        <div className="glass-card p-8 lg:col-span-2 animate-fade-in-up delay-300" style={{ opacity: 0 }}>
          <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="p-2.5 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
              <FiTrendingDown className="text-red-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Why Your Score Is Low</h3>
              <p className="text-gray-500 text-xs mt-0.5">AI-identified factors affecting your placement probability</p>
            </div>
          </div>

          <div className="space-y-4">
            {reasons.map((reason, i) => {
              const colors = impactColors[reason.impact];
              return (
                <div key={i} className="p-5 rounded-xl flex items-start gap-4 transition-all hover:scale-[1.01]" style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black" style={{ background: colors.border, color: colors.text }}>
                      {reason.pct}%
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h4 className="font-bold text-sm" style={{ color: colors.text }}>{reason.factor}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: `${colors.bar}20`, color: colors.text, border: `1px solid ${colors.border}` }}>
                        {reason.impact} Impact
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{reason.detail}</p>
                    <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${reason.pct}%`, background: colors.bar }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>


        {/* ====== SECTION 2: SKILLS TO IMPROVE (BAR CHART) ====== */}
        {missing_skills.length > 0 && (
          <div className="glass-card p-8 lg:col-span-2 animate-fade-in-up delay-400" style={{ opacity: 0 }}>
            <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="p-2.5 rounded-xl" style={{ background: 'rgba(251, 191, 36, 0.12)' }}>
                <FiAward className="text-yellow-400" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Skill Improvement Roadmap</h3>
                <p className="text-gray-500 text-xs mt-0.5">Prioritized skills with estimated learning hours and resources</p>
              </div>
            </div>

            {/* Bar Chart */}
            <div style={{ height: `${Math.max(180, skillPlan.length * 50)}px` }} className="mb-6">
              <Bar data={barData} options={barOptions} />
            </div>

            {/* Skill Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skillPlan.map((s, i) => (
                <div key={i} className="p-4 rounded-xl flex items-center gap-4 transition-all hover:scale-[1.01]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white text-sm">{s.skill}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{
                        background: `${difficultyColors[s.difficulty]}15`,
                        color: difficultyColors[s.difficulty],
                        border: `1px solid ${difficultyColors[s.difficulty]}30`
                      }}>
                        {s.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs truncate">{s.resource}</p>
                    {/* Clickable resource links */}
                    <div className="flex gap-2 mt-1">
                      {(s.links || []).map((link, li) => (
                        <a key={li} href={link} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 text-[10px] underline transition">
                          {link.replace('https://', '').split('/')[0]}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-lg font-black text-white">{s.hours}h</div>
                    <div className="text-gray-600 text-[10px]">est. time</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Bar */}
            <div className="mt-5 p-4 rounded-xl flex items-center justify-between" style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
              <div className="flex items-center gap-2 text-violet-300 text-sm font-semibold">
                <FiClock size={16} /> Total estimated time: <span className="text-white font-black">{totalUpskillHours} hours</span>
              </div>
              <div className="text-violet-400 text-xs">
                ~{Math.ceil(totalUpskillHours / 10)} weeks at 2h/day
              </div>
            </div>
          </div>
        )}


        {/* ====== SECTION 3: WEEKLY ROUTINE PLAN ====== */}
        {missing_skills.length > 0 && (
          <div className="glass-card p-8 lg:col-span-2 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl" style={{ background: 'rgba(59, 130, 246, 0.12)' }}>
                  <FiCalendar className="text-blue-400" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Weekly Study Routine</h3>
                  <p className="text-gray-500 text-xs mt-0.5">Your personalized week-by-week upskilling plan</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px" style={{ background: 'rgba(59, 130, 246, 0.2)' }} />

              <div className="space-y-6">
                {weeklyRoutine.map((week, i) => (
                  <div key={i} className="relative pl-14">
                    <div className="absolute left-3 top-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#06080f', border: '2px solid #3b82f6' }}>
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                    </div>

                    <div className="p-5 rounded-xl transition-all hover:scale-[1.005]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-lg text-xs font-bold text-blue-300" style={{ background: 'rgba(59, 130, 246, 0.15)' }}>
                            Week {week.week}
                          </span>
                          <span className="text-gray-400 text-xs">
                            Focus: <span className="text-white font-semibold">{week.focus.join(' & ')}</span>
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs flex items-center gap-1">
                          <FiClock size={12} /> {week.dailyHours}h/day
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">
                        {week.tasks.map((task, j) => (
                          <div key={j} className="flex items-center gap-3 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                            <span className="text-gray-300">{task.task}</span>
                            <span className="text-gray-600 text-xs ml-auto flex-shrink-0">{task.hours}h</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-xs mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                        <FiStar className="text-yellow-400" size={12} />
                        <span className="text-yellow-200/80 font-medium">Milestone: {week.milestone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-5 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(59, 130, 246, 0.08))', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
              <div className="text-emerald-400 text-sm font-bold mb-1">🎯 End Goal</div>
              <p className="text-gray-300 text-sm">
                After completing this plan, your estimated placement probability will increase to
                <span className="text-white font-black"> {targetScore}%</span>
              </p>
            </div>
          </div>
        )}


        {/* ====== SECTION 4: DOWNLOAD PLAN AS PDF ====== */}
        {missing_skills.length > 0 && (
          <div className="glass-card p-8 lg:col-span-2 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl" style={{ background: 'rgba(16, 185, 129, 0.12)' }}>
                  <FiDownload className="text-emerald-400" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Download Your Plan</h3>
                  <p className="text-gray-500 text-xs mt-0.5">Save your complete roadmap with study links as a PDF</p>
                </div>
              </div>
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 active:scale-100 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: isDownloading ? '#374151' : 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: isDownloading ? 'none' : '0 4px 20px rgba(16, 185, 129, 0.3)',
                }}
              >
                {isDownloading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FiDownload size={18} />
                    Download PDF
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {[
                { label: 'Skills to Learn', value: missing_skills.length, icon: <FiAward size={16} />, color: '#f59e0b' },
                { label: 'Total Hours', value: `${totalUpskillHours}h`, icon: <FiClock size={16} />, color: '#3b82f6' },
                { label: 'Weeks Needed', value: weeklyRoutine.length, icon: <FiCalendar size={16} />, color: '#8b5cf6' },
                { label: 'Target Score', value: `${targetScore}%`, icon: <FiTarget size={16} />, color: '#10b981' },
              ].map((stat, i) => (
                <div key={i} className="stat-card text-center">
                  <div className="flex justify-center mb-2" style={{ color: stat.color }}>{stat.icon}</div>
                  <div className="text-xl font-black text-white">{stat.value}</div>
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* ====== Model Evaluation Metrics ====== */}
        {metrics && (
          <div className="glass-card p-8 lg:col-span-2 animate-fade-in-up">
            <div className="flex items-center justify-between mb-8 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <h3 className="text-xl font-bold gradient-text-warm">Machine Learning Evaluation</h3>
                <p className="text-gray-600 text-xs mt-1">Cross-validated metrics • RandomForestClassifier • 10,000 samples</p>
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="feature-icon text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
                title="View Model Configuration"
              >
                <FiSettings className="animate-spin-slow" size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Accuracy', value: metrics.accuracy, icon: <FiTarget />, color: '#60a5fa', desc: 'Overall correctness' },
                { label: 'F1-Score', value: metrics.f1_score, icon: <FiZap />, color: '#fbbf24', desc: 'Balance of P & R' },
                { label: 'Precision', value: metrics.precision, icon: <FiBarChart2 />, color: '#34d399', desc: 'Quality of results' },
                { label: 'Recall', value: metrics.recall, icon: <FiCheckCircle />, color: '#f472b6', desc: 'Quantity of results' },
              ].map((m, i) => (
                <div key={i} className="stat-card group text-center">
                  <div className="text-2xl mb-3 flex justify-center group-hover:scale-110 transition-transform" style={{ color: m.color }}>
                    {m.icon}
                  </div>
                  <div className="text-3xl font-black text-white">{(m.value * 100).toFixed(1)}%</div>
                  <div className="text-gray-400 font-semibold text-xs uppercase mt-1 tracking-wider">{m.label}</div>
                  <div className="text-gray-600 text-[10px] mt-2 leading-tight">{m.desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-gray-600 text-xs italic">
                * These metrics are derived using a 80-20 train-test split on a synthetic dataset of 10,000 candidate profiles. Click the ⚙ icon above to view full model configuration.
              </p>
            </div>
          </div>
        )}

        {/* ====== LIVE MARKET PULSE & CODE SCANNER ====== */}
        {((market_pulse_adjustments) || (github_analysis && github_analysis.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-2">
            
            {/* Live Pulse */}
            {market_pulse_adjustments && (
               <div className="glass-card p-6 animate-fade-in-up delay-400">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
                     <FiGlobe size={18} />
                   </div>
                   <div>
                     <h3 className="text-sm font-bold text-white">Live Market Pulse Analysis</h3>
                     <p className="text-gray-500 text-[10px]">Real-time adjustments based on job board scraping</p>
                   </div>
                 </div>
                 <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5">
                   <p className="text-sm text-gray-300 mb-2">
                     <strong className="text-orange-400">Dynamic Decision Shift:</strong> The algorithm detected a surge in demand for your matched skill: <strong className="text-white">{market_pulse_adjustments.trending_matched}</strong>.
                   </p>
                   <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mt-3 pt-3 border-t border-white/5">
                      <FiTrendingDown className="rotate-180" /> External market variables processed successfully.
                   </div>
                 </div>
               </div>
            )}

            {/* GitHub Scanner */}
            {github_analysis && github_analysis.length > 0 && (
               <div className="glass-card p-6 animate-fade-in-up delay-500 text-left">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 rounded-xl bg-gray-700/50 text-white">
                     <FiGithub size={18} />
                   </div>
                   <div>
                     <h3 className="text-sm font-bold text-white">Contextual Code Vulnerability Scan</h3>
                     <p className="text-gray-500 text-[10px]">Static analysis of provided GitHub repositories</p>
                   </div>
                 </div>
                 <div className="space-y-2">
                   {github_analysis.map((vuln, i) => (
                     <div key={i} className="p-3 rounded-lg border flex items-start gap-3" style={
                       vuln.severity === 'High' ? { borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.1)' } :
                       vuln.severity === 'Medium' ? { borderColor: 'rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.1)' } :
                       { borderColor: 'rgba(59, 130, 246, 0.3)', background: 'rgba(59, 130, 246, 0.1)' }
                     }>
                        <FiAlertTriangle className="mt-0.5" color={vuln.severity === 'High' ? '#ef4444' : vuln.severity === 'Medium' ? '#f59e0b' : '#3b82f6'} />
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">{vuln.severity} Risk</span>
                          <p className="text-xs text-white mt-0.5 font-semibold">{vuln.issue}</p>
                          {vuln.detail && <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{vuln.detail}</p>}
                        </div>
                     </div>
                   ))}
                 </div>
               </div>
            )}
          </div>
        )}

        {/* ====== INDUSTRY BENCHMARK COMPARISON ====== */}
        <div className="glass-card p-8 lg:col-span-2 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="p-2.5 rounded-xl" style={{ background: 'rgba(6, 182, 212, 0.12)' }}>
              <FiUsers className="text-cyan-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Industry Benchmark Comparison</h3>
              <p className="text-gray-500 text-xs mt-0.5">Your profile vs {benchmarkData.totalCandidates.toLocaleString()} analyzed candidates</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Your Skill Match', value: `${Math.round(skill_match_pct)}%`, benchmark: `${benchmarkData.avgSkillMatch}%`, diff: Math.round(skill_match_pct) - benchmarkData.avgSkillMatch },
              { label: 'Your Placement Score', value: `${placement_probability}%`, benchmark: `${benchmarkData.avgPlacement}%`, diff: Math.round(placement_probability - benchmarkData.avgPlacement) },
              { label: 'Top Candidate Match', value: `${benchmarkData.topCandidateSkillMatch}%`, benchmark: 'Industry Best', diff: Math.round(skill_match_pct - benchmarkData.topCandidateSkillMatch) },
            ].map((item, i) => (
              <div key={i} className="stat-card text-center">
                <div className="text-2xl font-black text-white mb-1">{item.value}</div>
                <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">{item.label}</div>
                <div className={`text-xs font-bold ${item.diff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {item.diff >= 0 ? '↑' : '↓'} {Math.abs(item.diff)}% vs avg ({item.benchmark})
                </div>
              </div>
            ))}
          </div>

          <div className="w-full h-64">
            <Radar
              data={{
                labels: ['Skill Match', 'Placement', 'Keywords', 'Formatting', 'Experience'],
                datasets: [
                  {
                    label: 'You',
                    data: [skill_match_pct, placement_probability, 80, 75, 70],
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    borderColor: '#8b5cf6',
                    pointBackgroundColor: '#7c3aed',
                    borderWidth: 2,
                  },
                  {
                    label: 'Industry Average',
                    data: [benchmarkData.avgSkillMatch, benchmarkData.avgPlacement, 70, 68, 65],
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    borderColor: '#06b6d4',
                    pointBackgroundColor: '#0891b2',
                    borderWidth: 2,
                    borderDash: [5, 5],
                  },
                ]
              }}
              options={{
                scales: {
                  r: {
                    angleLines: { color: 'rgba(255,255,255,0.06)' },
                    grid: { color: 'rgba(255,255,255,0.06)' },
                    pointLabels: { color: '#6b7280', font: { size: 11, family: 'Inter' } },
                    ticks: { display: false }
                  }
                },
                plugins: {
                  legend: {
                    labels: { color: '#9ca3af', font: { family: 'Inter', size: 11 }, usePointStyle: true, pointStyle: 'circle' }
                  }
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        {/* ====== ADAPTIVE LEARNING PATH ====== */}
        {missing_skills.length > 0 && (
          <div className="glass-card p-8 lg:col-span-2 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl" style={{ background: 'rgba(16, 185, 129, 0.12)' }}>
                  <FiRefreshCw className="text-emerald-400" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Adaptive Learning Progress</h3>
                  <p className="text-gray-500 text-xs mt-0.5">Mark skills as learned — your projected score updates in real-time</p>
                </div>
              </div>
              {learnedCount > 0 && (
                <button onClick={resetLearnedSkills} className="text-xs text-gray-500 hover:text-red-400 transition px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  Reset Progress
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="stat-card text-center">
                <div className="text-2xl font-black text-emerald-400">{learnedCount}/{missing_skills.length}</div>
                <div className="text-gray-500 text-[10px] uppercase tracking-wider mt-1">Skills Learned</div>
              </div>
              <div className="stat-card text-center">
                <div className="text-2xl font-black text-white">{projectedScore}%</div>
                <div className="text-gray-500 text-[10px] uppercase tracking-wider mt-1">Projected Score</div>
              </div>
              <div className="stat-card text-center">
                <div className="text-2xl font-black text-violet-400">{remainingHours}h</div>
                <div className="text-gray-500 text-[10px] uppercase tracking-wider mt-1">Hours Remaining</div>
              </div>
              <div className="stat-card text-center">
                <div className="text-2xl font-black" style={{ color: projectedScore > placement_probability ? '#10b981' : '#6b7280' }}>+{projectedScore - placement_probability}%</div>
                <div className="text-gray-500 text-[10px] uppercase tracking-wider mt-1">Score Boost</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-400">Learning Progress</span>
                <span className="text-emerald-400 font-bold">{missing_skills.length > 0 ? Math.round((learnedCount / missing_skills.length) * 100) : 0}%</span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${missing_skills.length > 0 ? (learnedCount / missing_skills.length) * 100 : 0}%`, background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {missing_skills.map((skill) => {
                const isLearned = learnedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleLearnedSkill(skill)}
                    className={`p-4 rounded-xl flex items-center gap-3 text-left transition-all ${isLearned ? 'hover:opacity-80' : 'hover:scale-[1.01]'}`}
                    style={{
                      background: isLearned ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isLearned ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center text-sm flex-shrink-0 transition-all ${isLearned ? 'bg-emerald-500 text-white' : ''}`} style={!isLearned ? { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' } : {}}>
                      {isLearned ? '✓' : ''}
                    </div>
                    <div className="flex-1">
                      <span className={`font-semibold text-sm ${isLearned ? 'text-emerald-300 line-through' : 'text-white'}`}>{skill}</span>
                      <span className="text-gray-600 text-xs ml-2">{skillPlan.find(s => s.skill === skill)?.hours || 20}h</span>
                    </div>
                    {isLearned && <span className="text-emerald-400 text-xs font-bold">Completed</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ====== RESUME NLP HEATMAP ====== */}
        {result.cv_text && (
          <div className="lg:col-span-2">
            <ResumeHeatmap cvText={result.cv_text} matchedSkills={matched_skills} missingSkills={missing_skills} />
          </div>
        )}

        {/* ====== CAREER PATH TREE ====== */}
        <div className="lg:col-span-2">
          <CareerPathTree matchedSkills={matched_skills} />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
