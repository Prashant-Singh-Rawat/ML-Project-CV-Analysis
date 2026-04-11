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

  const handleNextQuestion = () => {
    setIsAnswering(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      alert("Mock Interview Complete! Our AI has analyzed your biometric signals and performance.");
      onClose();
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
                    onClick={() => setIsAnswering(true)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FiMic size={12} /> Start My Answer
                  </button>
                ) : (
                  <button 
                    onClick={handleNextQuestion}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FiCheckCircle size={12} /> Submit & Next Question
                  </button>
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
