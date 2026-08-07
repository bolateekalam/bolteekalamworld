import React from 'react';
import { Headphones, Sparkles, Home, BellRing, Radio, ArrowLeft } from 'lucide-react';

export const AudioStoriesView = ({ setActiveView }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-950 border border-purple-500/30 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold backdrop-blur-md">
            <Radio className="w-4 h-4 animate-pulse text-purple-400" />
            <span>🎧 ऑडियो स्टोरी (Audio Stories) — शीघ्र आ रहा है</span>
          </div>

          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 p-1 mx-auto shadow-2xl ring-4 ring-purple-500/20">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
              <Headphones className="w-12 h-12 text-purple-400 animate-bounce" />
            </div>
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-300">
              ऑडियो स्टोरीज़ अनुभव
            </h1>
            <p className="text-sm sm:text-base text-purple-200/90 font-medium">
              हिंदी साहित्य एवं कविताओं का मंत्रमुग्ध कर देने वाला ऑडियो अनुभव जल्द ही आपकी सेवा में चालू होगा।
            </p>
          </div>

          <div className="bg-slate-950/60 border border-purple-500/20 rounded-2xl p-5 text-xs sm:text-sm text-purple-200 max-w-md mx-auto space-y-2 backdrop-blur-sm shadow-inner">
            <div className="flex items-center justify-center gap-2 font-bold text-amber-400">
              <BellRing className="w-4 h-4" />
              <span>अपकमिंग सेवा (Notice)</span>
            </div>
            <p>
              कृपया आप होम पेज पर जाएं। जल्द से जल्द ये सेवाएं जैसे ही चालू होंगी, आपको तुरंत सूचित कर दिया जाएगा।
            </p>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={() => setActiveView && setActiveView('feed')}
              className="px-8 py-3.5 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white font-extrabold rounded-2xl shadow-xl hover:shadow-rose-500/20 transition active:scale-95 flex items-center gap-2.5 text-sm"
            >
              <Home className="w-4 h-4" />
              <span>होम पेज पर जाएं</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioStoriesView;
