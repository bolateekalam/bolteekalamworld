import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Sparkles, Feather } from 'lucide-react';

export const SplashScreen = ({ onFinish, duration = 2400 }) => {
  const [fadingOut, setFadingOut] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);

  // Determine Time-Based Greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 4 && hour < 12) {
      return {
        period: 'morning',
        badge: '🌅 सुप्रभात',
        title: 'आपका दिन शुभ हो',
        subtext: 'साहित्य एवं काव्य की इस पावन प्रभात में आपका हार्दिक स्वागत है',
        voiceText: 'नमस्ते! आपका दिन शुभ हो। बोलती कलम में आपका स्वागत है।',
        accentColor: 'from-amber-400 to-rose-400'
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        period: 'afternoon',
        badge: '☀️ शुभ दोपहर',
        title: 'आपका दिन अच्छा हो',
        subtext: 'काव्य और साहित्य की ऊर्जा से भरा यह समय मंगलमय हो',
        voiceText: 'शुभ दोपहर! आपका दिन अच्छा हो। बोलती कलम में आपका स्वागत है।',
        accentColor: 'from-amber-300 via-orange-400 to-rose-500'
      };
    } else if (hour >= 17 && hour < 21) {
      return {
        period: 'evening',
        badge: '🌇 शुभ संध्या',
        title: 'शुभ संध्या! आपका स्वागत है',
        subtext: 'मनमोहक शाम और काव्य रस की महफ़िल में आपका अभिनंदन',
        voiceText: 'शुभ संध्या! बोलती कलम में आपका हार्दिक स्वागत है।',
        accentColor: 'from-rose-400 via-purple-400 to-amber-300'
      };
    } else {
      return {
        period: 'night',
        badge: '🌙 शुभ रात्रि',
        title: 'शुभ रात्रि!',
        subtext: 'सुखद सपनों, सुकून और सुंदर कविताओं भरी शांत रात',
        voiceText: 'शुभ रात्रि! बोलती कलम में आपका स्वागत है। सुखद सपनों भरी रात।',
        accentColor: 'from-indigo-300 via-purple-300 to-amber-200'
      };
    }
  };

  const greeting = getTimeBasedGreeting();

  // Web Speech API: Voice Synthesis for Hindi Greeting
  useEffect(() => {
    let utterance = null;

    const speak = () => {
      try {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel(); // Stop prior pending audio

          utterance = new SpeechSynthesisUtterance(greeting.voiceText);
          utterance.lang = 'hi-IN';
          utterance.rate = 0.95;
          utterance.pitch = 1.05;

          const voices = window.speechSynthesis.getVoices();
          const hindiVoice = voices.find(
            (v) => (v.lang && (v.lang.includes('hi') || v.lang.includes('IN'))) || v.name.includes('Hindi')
          );
          if (hindiVoice) {
            utterance.voice = hindiVoice;
          }

          utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = () => setIsSpeaking(false);

          window.speechSynthesis.speak(utterance);
        }
      } catch (e) {
        setIsSpeaking(false);
      }
    };

    // If voices are already loaded, speak; otherwise wait for onvoiceschanged
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.getVoices().length > 0) {
        speak();
      } else {
        window.speechSynthesis.onvoiceschanged = () => speak();
      }
    }

    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, Math.max(duration - 400, 1600));

    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
      try {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } catch (e) {}
    };
  }, [duration, onFinish, greeting.voiceText]);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-[#071322] via-[#0b1f36] to-[#050c17] text-white select-none transition-all duration-400 ${
        fadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Radial Glow */}
      <div className="absolute w-80 h-80 rounded-full bg-amber-500/15 blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute w-64 h-64 rounded-full bg-rose-600/10 blur-2xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4 px-4 max-w-md animate-in zoom-in-95 duration-500">
        
        {/* Time-Based Greeting Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-amber-400/30 backdrop-blur-md shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
          <span className="text-xs font-bold text-amber-300">
            {greeting.badge}
          </span>
          {isSpeaking && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-300 font-semibold pl-1 border-l border-white/20">
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              <span>Voice</span>
            </span>
          )}
        </div>

        {/* Glowing Logo Circle */}
        <div className="relative my-1">
          <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-amber-400 blur-md opacity-80 animate-spin" style={{ animationDuration: '7s' }} />
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white p-2 border-4 border-amber-400 shadow-2xl flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="बोलती कलम" 
              className="w-full h-full object-contain rounded-full"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            {/* Fallback Feather Emblem */}
            <div className="text-4xl text-[#0e2238] font-bold">
              🪶
            </div>
          </div>
        </div>

        {/* Dynamic Spoken Greeting Heading */}
        <div className="space-y-1">
          <h2 className={`text-2xl sm:text-3xl font-black font-rozha text-transparent bg-clip-text bg-gradient-to-r ${greeting.accentColor} drop-shadow-md tracking-wide`}>
            {greeting.title}
          </h2>
          <h1 className="text-lg sm:text-xl font-black text-amber-100 font-rozha tracking-wider">
            बोलती कलम (Bolatee Kalam)
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-300 font-tiro max-w-xs mx-auto leading-relaxed pt-1 opacity-90">
            {greeting.subtext}
          </p>
        </div>

        {/* Poetic Quote */}
        <div className="pt-1">
          <p className="text-[11px] font-serif italic text-amber-200/80 border-t border-b border-amber-500/20 py-1 px-4">
            “शब्द ही चेतना हैं, शब्द ही संस्कृति के संवाहक हैं”
          </p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-40 h-1 bg-slate-800/80 rounded-full overflow-hidden mt-3 border border-amber-500/20">
          <div className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-amber-300 animate-[progress_1.8s_ease-in-out_forwards]" />
        </div>

        <span className="text-[10px] text-slate-400 pt-0.5">
          साहित्यिक मंच लोड हो रहा है...
        </span>
      </div>

    </div>
  );
};

export default SplashScreen;
