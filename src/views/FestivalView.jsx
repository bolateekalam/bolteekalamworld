import React from 'react';
import { Sparkles, ArrowLeft, Heart, ShieldCheck, Flag, Award } from 'lucide-react';

export const FestivalView = ({ setActiveView, activeFestivalTheme }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-600 text-white shadow-2xl relative overflow-hidden text-center space-y-4">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto text-3xl shadow-xl ring-4 ring-white/30">
          🇮🇳
        </div>

        <div className="space-y-2 max-w-xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase shadow tracking-wider">
            ⏳ कमिंग सून (Coming Soon)
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-rozha text-white">
            15 अगस्त स्वतंत्रता दिवस विशेषांक — पोस्टर Studio
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/90 font-tiro leading-relaxed">
            15 अगस्त के पावन अवसर पर बोलती कलम (bolateeworld.in) का विशेष 80वाँ स्वतंत्रता दिवस डिजिटल पोस्टर जनरेटर शीघ्र चालू होने जा रहा है!
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setActiveView && setActiveView('feed')}
            className="px-6 py-3 bg-white text-slate-950 hover:bg-slate-100 font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-xl active:scale-95 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>🏠 मुख्य पृष्ठ पर वापस जाएँ</span>
          </button>
        </div>
      </div>

      {/* Feature Preview Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
        <h2 className="text-lg font-bold font-rozha text-slate-900 dark:text-slate-100">
          ✨ इस सेवा में आपको क्या-क्या मिलेगा:
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 space-y-2 text-orange-700 dark:text-orange-300">
            <div className="text-2xl">🖼️</div>
            <h3 className="font-bold">HD तिरंगा फ़्रेम डिज़ाइन</h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">अपनी फोटो के साथ 80वें स्वतंत्रता दिवस का प्रीमियम तिरंगा पोस्टर बनाएँ।</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-emerald-700 dark:text-emerald-300">
            <div className="text-2xl">✒️</div>
            <h3 className="font-bold">देशभक्ति कविता & शायरी</h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">अपनी काव्य पंक्तियों या लोकप्रिय राष्ट्रभक्ति छंदों को पोस्टर पर लिखें।</p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-2 text-purple-700 dark:text-purple-300">
            <div className="text-2xl">📲</div>
            <h3 className="font-bold">1-क्लिक शेयरिंग</h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">HD PNG इमेज डाउनलोड करें और WhatsApp स्टेटस या मंच पर साझा करें।</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FestivalView;
