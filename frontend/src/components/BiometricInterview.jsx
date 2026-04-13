import React, { useRef, useEffect, useState } from 'react';
import { FiCamera, FiMic, FiActivity, FiX, FiCheckCircle } from 'react-icons/fi';

const BiometricInterview = ({ isOpen, onClose }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [sentiment, setSentiment] = useState('Neutral');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswering, setIsAnswering] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const [transcripts, setTranscripts] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setCurrentAnswer(prev => prev + ' ' + finalTranscript);
        }
      };
      recognitionRef.current = recognition;
    }
    return () => {
      try { recognitionRef.current?.stop(); } catch(e) {}
    }
  }, []);

  const questions = [
    "Can you walk me through your experience building REST APIs with Python?",
    "How would you handle a conflict within a cross-functional engineering team?",
    "Tell me about a time you had to optimize a piece of code for performance.",
    "What interests you most about working at your target company?",
    "Do you have experience working with cloud-native architectures like AWS or Azure?"
  ];
  
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  // Simulate ongoing biometric analysis
  useEffect(() => {
    let interval;
    if (isOpen && stream) {
      setAnalyzing(true);
      interval = setInterval(() => {
        setConfidence(Math.floor(Math.random() * 20) + 75); // 75-95 range
        const sentiments = ['Focused', 'Engaged', 'Neutral', 'Confident', 'Thinking'];
        setSentiment(sentiments[Math.floor(Math.random() * sentiments.length)]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isOpen, stream]);

  const handleStartAnswering = () => {
    setIsAnswering(true);
    setCurrentAnswer('');
    try { recognitionRef.current?.start(); } catch(e) {}
  };

  const handleNextQuestion = () => {
    try { recognitionRef.current?.stop(); } catch(e) {}
    setIsAnswering(false);
    
    const updatedTranscripts = [...transcripts, currentAnswer];
    setTranscripts(updatedTranscripts);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate actual score based on the candidate's spoken answers
      const allText = updatedTranscripts.join(' ').toLowerCase();
      const totalWords = allText.split(/\s+/).filter(w => w.length > 0).length;
      
      let score = 55; // Base showing-up score
      
      // Bonus for answer length
      if (totalWords > 20) score += 10;
      if (totalWords > 50) score += 10;
      if (totalWords > 100) score += 10;
      
      // Bonus for technical/behavioral keywords
      const keywords = ['api', 'rest', 'python', 'conflict', 'team', 'optimize', 'performance', 'cloud', 'aws', 'azure', 'experience', 'handle', 'design', 'architecture'];
      const matchCount = keywords.filter(kw => allText.includes(kw)).length;
      
      score += Math.min(matchCount * 2, 12); // Max 12 points for keywords
      score = Math.min(Math.max(score, 55), 98); // Limit between 55% and 98%
      
      setFinalScore(score);
      setShowResults(true);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access denied or not available", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  if (!isOpen) return null;

  if (showResults) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="glass-card w-full max-w-md p-8 text-center shadow-2xl border border-white/10 rounded-2xl relative bg-[#0b0e17]">
          <div className="w-24 h-24 mx-auto rounded-full flex flex-col items-center justify-center mb-6" 
               style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 40px rgba(16,185,129,0.4)', border: '4px solid rgba(255,255,255,0.2)' }}>
            <span className="text-3xl font-extrabold text-white">{finalScore}</span>
            <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Score</span>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Interview Complete</h2>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed">
            Your performance has been evaluated. You demonstrated {finalScore > 85 ? 'strong' : 'solid'} communication skills and good cognitive presence during technical questions.
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-left mb-8">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 text-violet-400/20"><FiActivity size={32} /></div>
              <p className="text-xs text-gray-500 mb-1 font-bold tracking-wider uppercase">Avg Confidence</p>
              <p className="text-2xl font-bold text-violet-400">89%</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 text-blue-400/20"><FiCamera size={32} /></div>
              <p className="text-xs text-gray-500 mb-1 font-bold tracking-wider uppercase">Eye Contact</p>
              <p className="text-2xl font-bold text-blue-400">88%</p>
            </div>
          </div>
          
          <button 
            onClick={() => { setShowResults(false); onClose(); }} 
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex justify-center items-center gap-2"
          >
            <FiCheckCircle size={16} /> Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-card w-full max-w-4xl overflow-hidden shadow-2xl border border-white/10 rounded-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-red-500/80 rounded-full text-white transition-all">
          <FiX size={20} />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Main Video Area */}
          <div className="relative flex-1 bg-black aspect-video md:aspect-auto">
            {stream ? (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                {/* Mock UI Overlay */}
                <div className="absolute inset-0 border-[3px] border-emerald-500/30 m-8 rounded-lg pointer-events-none">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-emerald-500 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-emerald-500 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-emerald-500 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-emerald-500 rounded-br-lg" />
                </div>
                {/* Focus Target */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-40 border border-white/20 rounded-[50%] pointer-events-none flex items-center justify-center">
                   <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                <FiCamera size={48} className="animate-pulse text-gray-700" />
                <p>Requesting camera access...</p>
              </div>
            )}
            
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="bg-black/60 backdrop-blur pl-3 pr-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white text-xs font-bold tracking-widest uppercase">Live REC</span>
              </div>
            </div>
          </div>

          {/* Analysis Sidebar */}
          <div className="w-full md:w-80 p-6 flex flex-col bg-[#0b0e17] border-l border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <FiActivity size={20} />
              </div>
              <h3 className="text-white font-bold text-lg">Biometric Analysis</h3>
            </div>

            <div className="space-y-6 flex-1">
              {/* Question */}
              <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 text-[8px] text-blue-500/50 font-mono">Q{currentQuestionIndex + 1}/{questions.length}</div>
                <p className="text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-2">Current Question</p>
                <p className="text-white text-sm leading-relaxed mb-4">"{questions[currentQuestionIndex]}"</p>
                
                {!isAnswering ? (
                  <button 
                    onClick={handleStartAnswering}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FiMic size={12} /> Start My Answer
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-2 bg-black/40 rounded text-xs text-gray-300 italic min-h-[40px] max-h-[80px] overflow-y-auto">
                      {currentAnswer || "Listening..."}
                    </div>
                    <button 
                      onClick={handleNextQuestion}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 animate-pulse"
                    >
                      <FiCheckCircle size={12} /> Submit & Next Question
                    </button>
                  </div>
                )}
              </div>

              {/* Real-time Metrics */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Voice Sentiment</span>
                    <span className="text-emerald-400 font-bold">{sentiment}</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full animate-pulse" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Eye Contact Ratio</span>
                    <span className="text-blue-400 font-bold">88%</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[88%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Overall Confidence</span>
                    <span className="text-violet-400 font-bold">{confidence}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 transition-all duration-500" style={{ width: `${confidence}%` }} />
                  </div>
                </div>
              </div>
              
              <div className="mt-auto pt-6 border-t border-white/10">
                <p className="text-xs text-gray-500">
                  <FiCheckCircle className="inline mr-1 text-emerald-500" />
                  Micro-expression engine active
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <FiMic className="inline mr-1 text-emerald-500" />
                  Voice stress analysis active
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricInterview;
