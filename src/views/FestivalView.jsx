import React from 'react';
import { Sparkles, ArrowLeft, Heart, ShieldCheck, Palette, Award, Play } from 'lucide-react';

export const FestivalView = ({ setActiveView, activeFestivalTheme }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Festival Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-amber-600 text-white shadow-2xl relative overflow-hidden text-center space-y-4">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-md flex items-center justify-center mx-auto text-4xl shadow-xl ring-4 ring-amber-400/40">
          🪈
        </div>

        <div className="space-y-2 max-w-xl mx-auto">
          <span className="inline-block px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase shadow tracking-wider">
            🚩 28 अगस्त पावन पर्व विशेषांक
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-rozha text-amber-100">
            श्रीकृष्ण जन्माष्टमी महोत्सव — पोस्टर Studio 3.0
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/90 font-tiro leading-relaxed">
            28 अगस्त श्रीकृष्ण जन्माष्टमी के पावन पर्व पर बोलती कलम पर मोरपंख, बांसुरी व भक्ति रस के साथ अपना HD कवि पोस्टर बनाएँ व WhatsApp पर शेयर करें!
          </p>
        </div>

        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setActiveView && setActiveView('posterStudio')}
            className="px-7 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-amber-950/40 active:scale-95 transition cursor-pointer"
          >
            <Palette className="w-4 h-4 text-slate-950" />
            <span>✨ जन्माष्टमी पोस्टर बनाएँ (Start Creating)</span>
          </button>

          <button
            onClick={() => setActiveView && setActiveView('feed')}
            className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs flex items-center gap-2 border border-white/20 active:scale-95 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>मुख्य पृष्ठ</span>
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
        <h2 className="text-lg sm:text-xl font-bold font-rozha text-slate-900 dark:text-slate-100">
          🪈 जन्माष्टमी विशेषांक में आपको क्या-क्या मिलेगा:
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-2 text-indigo-900 dark:text-indigo-300">
            <div className="text-3xl">🪶</div>
            <h3 className="font-extrabold text-sm">मोरपंख & दिव्य स्वर्ण बॉर्डर</h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">अपनी फोटो के साथ जन्माष्टमी का भव्य HD पोस्टर 4:5 व 9:16 स्टेटस साइज़ में बनाएँ।</p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-amber-900 dark:text-amber-300">
            <div className="text-3xl">🪷</div>
            <h3 className="font-extrabold text-sm">1-क्लिक रेडीमेड भक्ति छंद</h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">सूरदास, रसखान व आधुनिक कवियों की कृष्ण-भक्ति पंक्तियाँ 1 क्लिक में लोड करें।</p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-emerald-900 dark:text-emerald-300">
            <div className="text-3xl">📲</div>
            <h3 className="font-extrabold text-sm">WhatsApp 1-Click Direct Share</h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">बिना डाउनलोड किए सीधे अपने WhatsApp स्टेटस और दोस्तों को शेयर करें।</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FestivalView;
