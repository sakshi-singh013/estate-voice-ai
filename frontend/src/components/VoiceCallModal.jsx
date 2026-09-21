import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, PhoneOff, Volume2, Sparkles, Send, Activity, Zap, CheckCircle2 } from 'lucide-react';
import { sendChatMessage } from '../services/api';

export default function VoiceCallModal({ isOpen, onClose, onNewTurn, activeLead }) {
  const [isCalling, setIsCalling] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [latestResponse, setLatestResponse] = useState("Hello! I am Aria, Senior Sales Advisor at Greenfield Heights. How can I assist your property search today?");
  const [userInput, setUserInput] = useState("");
  const [lastLatency, setLastLatency] = useState(380);
  const [lastTool, setLastTool] = useState(null);

  const timerRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsCalling(true);
      setCallDuration(0);
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      speakText("Hello! I am Aria, Senior Sales Advisor at Greenfield Heights. How can I assist your property search today?");
    } else {
      clearInterval(timerRef.current);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    return () => clearInterval(timerRef.current);
  }, [isOpen]);

  // Speech Synthesis helper
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        startListening();
      };
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Web Speech Recognition helper
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition && !isMuted) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
          setIsListening(false);
          const transcript = event.results[0][0].transcript;
          handleSendQuery(transcript);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        
        recognitionRef.current = recognition;
        recognition.start();
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const handleSendQuery = async (queryText) => {
    if (!queryText.trim()) return;
    setIsListening(false);
    
    // Call backend API
    const res = await sendChatMessage(queryText);
    setLatestResponse(res.spoken_response);
    setLastLatency(res.latency_ms);
    setLastTool(res.tool_called);
    
    onNewTurn({
      userText: queryText,
      agentResponse: res.spoken_response,
      latency: res.latency_ms,
      tool: res.tool_called,
      rag: res.rag_context,
      updatedLead: res.updated_lead
    });

    // Speak response
    speakText(res.spoken_response);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl p-8 border border-indigo-500/30 shadow-2xl shadow-indigo-950/50 flex flex-col items-center">
        
        {/* Header Badge */}
        <div className="w-full flex items-center justify-between mb-6 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                Aria <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">Live Voice Session</span>
              </h3>
              <p className="text-xs text-slate-400">Greenfield Heights Voice Sales Advisor</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-emerald-400">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>{lastLatency}ms</span>
            </div>
            <div className="text-xs font-mono text-slate-400">
              {formatTime(callDuration)}
            </div>
          </div>
        </div>

        {/* Central Audio Waveform Spectrum */}
        <div className="relative my-6 flex flex-col items-center justify-center">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
            isSpeaking 
              ? 'bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-500 shadow-2xl shadow-indigo-500/50 scale-105 ring-8 ring-indigo-500/20' 
              : isListening
              ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-2xl shadow-emerald-500/50 ring-8 ring-emerald-500/20 animate-pulse'
              : 'bg-slate-800 border-2 border-slate-700'
          }`}>
            <Volume2 className={`w-12 h-12 text-white ${isSpeaking ? 'animate-bounce' : ''}`} />
          </div>

          {/* Audio Wave Bars */}
          <div className="flex items-center gap-1.5 mt-6 h-10">
            {[40, 70, 30, 90, 60, 100, 50, 80, 40, 70, 30].map((h, i) => (
              <div 
                key={i} 
                className={`w-1.5 rounded-full transition-all duration-150 ${
                  isSpeaking ? 'bg-indigo-400 animate-pulse' : isListening ? 'bg-emerald-400' : 'bg-slate-700'
                }`}
                style={{ height: isSpeaking || isListening ? `${Math.max(12, (h * Math.random()).toFixed(0))}px` : '8px' }}
              />
            ))}
          </div>

          <span className="text-xs font-medium text-slate-400 mt-3 flex items-center gap-1.5">
            {isSpeaking ? (
              <span className="text-indigo-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Speaking to prospective buyer...
              </span>
            ) : isListening ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <Mic className="w-3.5 h-3.5 animate-pulse" /> Listening to your voice...
              </span>
            ) : (
              "Ready • Speak or type below"
            )}
          </span>
        </div>

        {/* Live Spoken Output Box */}
        <div className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl p-4 mb-6 text-sm text-slate-200 leading-relaxed shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-indigo-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Aria's Response
            </span>
            {lastTool && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[11px] flex items-center gap-1">
                <Zap className="w-3 h-3" /> Tool: {lastTool}
              </span>
            )}
          </div>
          <p className="italic">"{latestResponse}"</p>
        </div>

        {/* Text Input Fallback / Direct Trigger */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendQuery(userInput); setUserInput(""); }}
          className="w-full flex items-center gap-2 mb-6"
        >
          <input
            type="text"
            placeholder="Type a query (e.g. 'What is the price of 3 BHK?' or 'Book site visit')..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm flex items-center gap-1.5 transition-colors shadow-lg shadow-indigo-600/30"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </form>

        {/* Controls Bar */}
        <div className="w-full flex items-center justify-center gap-6 border-t border-slate-800/80 pt-6">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full border transition-all ${
              isMuted 
                ? 'bg-rose-500/20 border-rose-500 text-rose-400' 
                : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
            title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <button
            onClick={() => {
              setIsCalling(false);
              onClose();
            }}
            className="p-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/40 transition-transform active:scale-95"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>

      </div>
    </div>
  );
}
