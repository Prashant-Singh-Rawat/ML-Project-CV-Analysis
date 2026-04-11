import React, { useState, useEffect } from 'react';
import { FiMessageSquare, FiX, FiVolume2, FiMic, FiMicOff, FiSend } from 'react-icons/fi';

const AIAvatar = ({ placement_probability, missing_skills, result }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Speech Recognition Setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
  }

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMsgs = [
        { role: 'ai', text: `Hello! I'm Tony, your AI Recruiter. I've analyzed your profile and I'm ready to help you prepare for your target company.` },
        { role: 'ai', text: `You have a ${Math.round(placement_probability)}% chance of placement. ${placement_probability > 70 ? "That's quite competitive!" : "There is definitely room for improvement."}` }
      ];
      
      let delay = 0;
      initialMsgs.forEach((m, i) => {
        setTimeout(() => {
          setMessages(prev => [...prev, m]);
          speak(m.text);
        }, delay);
        delay += 2500;
      });
    }
  }, [isOpen]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.1;
      
      // Select a premium sounding voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Female')) || voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;

      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
    }
  };

  const startListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    
    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
      // Automatically send if clear
      setTimeout(() => handleSendMessage(null, transcript), 500);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };



  const handleSendMessage = (e, overrideText = null) => {
    if (e) e.preventDefault();
    const textToSend = overrideText || inputText;
    if (!textToSend.trim()) return;

    const userMsg = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // AI Response Logic (Deeply coupled with project results)
    setTimeout(() => {
      let responseText = "";
      const input = textToSend.toLowerCase();
      const { matched_skills, missing_skills, extracted_entities, market_pulse_adjustments } = result;

      if (input.includes('skill') || input.includes('improve') || input.includes('gap')) {
        if (missing_skills.length > 0) {
          responseText = `I've identified ${missing_skills.length} critical skill gaps. You should prioritize ${missing_skills[0]} immediately. Check out the resources in your personalized roadmap below!`;
        } else {
          responseText = "Your technical skill set is phenomenal. It perfectly aligns with the industry benchmark for a top-tier engineer.";
        }
      } 
      else if (input.includes('company') || input.includes('chance') || input.includes('target')) {
        responseText = `For your target company, your probability stands at ${Math.round(placement_probability)}%. ${placement_probability > 80 ? "You're in the green zone!" : "We need to bridge some gaps to get you into the high-probability tier."}`;
      } 
      else if (input.includes('entity') || input.includes('organization') || input.includes('work')) {
        const orgs = extracted_entities?.organizations || [];
        if (orgs.length > 0) {
          responseText = `I noticed you've worked with or been involved with ${orgs.slice(0, 2).join(' and ')}. That's a great highlight for your resume!`;
        } else {
          responseText = "I couldn't find many major organizations in your resume. Adding specific company names or projects can help my NLP engine rank you higher.";
        }
      }
      else if (input.includes('market') || input.includes('trend')) {
        const trending = market_pulse_adjustments?.trending_matched || "None";
        responseText = `Live market data shows ${trending} is in high demand right now. Since you have this in your CV, you're currently getting a profile boost!`;
      }
      else if (input.includes('hello') || input.includes('hi') || input.includes('tony')) {
        responseText = "Hello! I'm Tony. I can help you decode your CV performance, explain your placement probability, or guide you through your skill roadmap. What's on your mind?";
      } 
      else {
        responseText = `Interesting question. Looking at your ${matched_skills.length} matched skills, I'd say you're strongest in ${matched_skills[0] || 'your core projects'}. Do you want to know how to leverage that in an interview?`;
      }

      setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
      speak(responseText);
      setIsTyping(false);
    }, 1200);
  };

  const toggleAvatar = () => {
    if (isOpen) {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
    } else {
      setSpeaking(true);
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Orb Button */}
      {!isOpen && (
        <button 
          onClick={toggleAvatar}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 shadow-[0_0_30px_rgba(139,92,246,0.5)] z-40 flex items-center justify-center hover:scale-110 transition-transform group"
        >
          <div className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-50"></div>
          <FiVolume2 className="text-white relative z-10" size={24} />
          
          <div className="absolute right-full mr-4 bg-black/80 backdrop-blur text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
            Talk to AI Recruiter
          </div>
        </button>
      )}

      {/* Avatar Dialog UI */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 glass-card p-0 overflow-hidden z-50 shadow-2xl border border-white/20 animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-900/50 to-fuchsia-900/50 p-4 border-b border-white/10 flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/20 blur-[50px] rounded-full"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 p-0.5">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center relative overflow-hidden">
                  <div className={`w-full h-full bg-white/20 rounded-full ${speaking ? 'animate-pulse scale-150' : ''} transition-all duration-300`}></div>
                  <div className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Autonomous AI Recruiter</h3>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <button onClick={toggleAvatar} className="text-gray-400 hover:text-white relative z-10">
              <FiX size={20} />
            </button>
          </div>

          {/* Dialogue Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-black/40 space-y-4 max-h-[350px] scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 animate-fade-in-up ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${m.role === 'ai' ? 'bg-violet-600 shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'bg-fuchsia-600 shadow-[0_0_10px_rgba(217,70,239,0.5)]'}`}>
                  {m.role === 'ai' ? 'AI' : 'YOU'}
                </div>
                <div className={`p-3 rounded-2xl text-sm text-white shadow-lg max-w-[80%] ${
                  m.role === 'ai' 
                    ? 'bg-white/10 border border-white/5 rounded-tl-sm' 
                    : 'bg-violet-600/40 border border-white/10 rounded-tr-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-violet-600/20 flex-shrink-0 flex items-center justify-center text-[10px]">...</div>
                <div className="bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white/5 border-t border-white/10 flex gap-2">
            <button 
              type="button"
              onClick={startListening}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
            >
              {isListening ? <FiMicOff size={18} /> : <FiMic size={18} />}
            </button>
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? "Listening..." : "Ask Tony about your CV..."}
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50 transition-colors"
            />
            <button 
              type="submit"
              className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white hover:bg-violet-500 transition-colors shadow-lg shadow-violet-600/20"
            >
              <FiSend size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIAvatar;
