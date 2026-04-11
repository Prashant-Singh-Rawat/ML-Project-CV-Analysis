import React, { useState, useRef, useEffect } from 'react';
import { FiUploadCloud, FiBriefcase, FiAward, FiArrowRight, FiMic, FiMicOff, FiX } from 'react-icons/fi';

const InputForm = ({ onAnalyze, isLoading, companies }) => {
  const [cvFile, setCvFile] = useState(null);
  const [cgpa, setCgpa] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);

  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [detectedSkills, setDetectedSkills] = useState([]);
  const recognitionRef = useRef(null);

  // Known skills list for voice detection
  const KNOWN_SKILLS = [
    'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin', 'TypeScript', 'JavaScript',
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot',
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform',
    'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'TensorFlow', 'PyTorch',
    'Data Analysis', 'Pandas', 'NumPy', 'Git', 'GitHub', 'HTML', 'CSS',
    'Data Structures', 'Algorithms', 'Web Development', 'Cloud Computing',
  ];

  // Initialize Web Speech API
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        const fullText = (voiceText + ' ' + finalTranscript).trim();
        if (finalTranscript) {
          setVoiceText(fullText);
          // Extract skills from transcript
          const text = fullText.toLowerCase();
          const found = KNOWN_SKILLS.filter(skill =>
            text.includes(skill.toLowerCase())
          );
          setDetectedSkills([...new Set(found)]);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setVoiceText('');
      setDetectedSkills([]);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const removeSkill = (skill) => {
    setDetectedSkills(prev => prev.filter(s => s !== skill));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cvFile || !cgpa || !targetCompany) return;
    onAnalyze({ cv_file: cvFile, cgpa: parseFloat(cgpa), target_company: targetCompany, github_url: githubUrl });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.pdf')) {
      setCvFile(file);
    }
  };

  const supportsVoice = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  return (
    <div className="glass-card p-8 md:p-10 w-full max-w-2xl mx-auto">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="feature-icon p-3 text-violet-400">
          <FiUploadCloud size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Analyze Your Profile</h2>
          <p className="text-gray-500 text-sm">Fill in your details to generate an AI report</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Zone */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-3">Resume / CV</label>
          <div
            className={`upload-zone ${cvFile ? 'active' : ''} ${dragOver ? 'active' : ''}`}
            onClick={() => document.getElementById('cv-upload').click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              id="cv-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setCvFile(e.target.files[0])}
            />
            <div className={`p-4 rounded-2xl transition-all ${cvFile
              ? 'bg-violet-500/20 text-violet-300'
              : 'bg-white/5 text-gray-500'
            }`}>
              <FiUploadCloud size={28} />
            </div>
            <div className="text-center">
              <p className="text-gray-200 font-semibold text-sm">
                {cvFile ? cvFile.name : 'Click to upload or drag & drop'}
              </p>
              <p className="text-gray-600 text-xs mt-1">
                {cvFile
                  ? `${(cvFile.size / 1024 / 1024).toFixed(2)} MB • PDF`
                  : 'PDF only • Max 5MB'
                }
              </p>
            </div>
            {cvFile && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setCvFile(null); }}
                className="absolute top-3 right-3 text-xs text-gray-500 hover:text-red-400 transition px-2 py-1 rounded-md bg-white/5"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Voice Input Section */}
        {supportsVoice && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
              <FiMic size={14} /> Voice Skill Input <span className="text-gray-600 text-xs">(optional)</span>
            </label>
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${isListening ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255,255,255,0.06)'}` }}>
              <div className="flex items-center gap-3 mb-3">
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`p-3 rounded-xl transition-all ${isListening
                    ? 'bg-red-500/20 text-red-400 animate-pulse'
                    : 'bg-violet-500/15 text-violet-400 hover:bg-violet-500/25'
                  }`}
                >
                  {isListening ? <FiMicOff size={20} /> : <FiMic size={20} />}
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    {isListening ? '🔴 Listening... Speak your skills' : 'Click mic to speak your skills'}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {isListening ? 'Say: "I know Python, Java, and Machine Learning"' : 'The AI will detect skills from your voice'}
                  </p>
                </div>
              </div>

              {/* Voice Transcript */}
              {voiceText && (
                <div className="mb-3 p-3 rounded-lg text-sm text-gray-300 italic" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  "{voiceText}"
                </div>
              )}

              {/* Detected Skills Chips */}
              {detectedSkills.length > 0 && (
                <div>
                  <p className="text-green-400 text-xs font-semibold mb-2">✓ Detected {detectedSkills.length} skill(s):</p>
                  <div className="flex flex-wrap gap-2">
                    {detectedSkills.map(skill => (
                      <span key={skill} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-300 transition">
                          <FiX size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CGPA + Company Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
              <FiAward size={14} /> CGPA
            </label>
            <input
              type="number"
              step="0.1"
              max="10"
              min="0"
              className="input-field"
              placeholder="e.g. 8.5"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              required
            />
            <p className="text-gray-600 text-xs mt-1.5">Scale of 0–10</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
              <FiBriefcase size={14} /> Target Company
            </label>
            <select
              className="input-field"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              required
            >
              <option value="" disabled>Select company...</option>
              {companies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* GitHub URL */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="14" width="14" xmlns="http://www.w3.org/2000/svg"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            GitHub Profile / Repo URL <span className="text-gray-600 text-xs">(optional for codebase scan)</span>
          </label>
          <input
            type="url"
            className="input-field w-full"
            placeholder="e.g. https://github.com/username"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2 text-base"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Generate AI Report <FiArrowRight />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
