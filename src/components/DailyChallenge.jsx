import React from 'react';
import { Flame, Clock, Award, Sparkles, Trophy, ChevronRight, Send, Medal } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const DailyChallenge = ({ challenge, onOpenCertificate, setActiveView }) => {
  const { t } = useLanguage();

  const activeChallenge = challenge || {
    topic: 'बरसात का पहला ख़त',
    prompt: 'सावन की पहली फुहार और पुराने ख़तों की यादों को समेटते हुए 4 पंक्तियाँ लिखें।',
    endsIn: '4 दिन 14 घंटे',
    reward1st: 500,
    reward2nd: 250
  };

  const topicName = activeChallenge.topic || activeChallenge.title || 'बरसात का पहला ख़त';
  const promptText = activeChallenge.prompt || activeChallenge.description || 'सावन की पहली फुहार और पुराने ख़तों की यादों को समेटते हुए 4 पंक्तियाँ लिखें।';

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-purple-500/15 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-lg space-y-4 backdrop-blur-sm">
      
      {/* Top Banner Tag & Rewards Row */}
      <div className="flex items-center justify-between flex-wrap gap-2.5">
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-full font-black text-xs flex items-center gap-1.5 shadow-md">
            <Trophy className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
            <span>साप्ताहिक लेखन चुनौती</span>
          </span>
          <span className="text-xs text-amber-700 dark:text-amber-300 font-bold font-mono bg-amber-500/20 px-2.5 py-0.5 rounded-lg border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{activeChallenge.endsIn || '4 दिन शेष'}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-extrabold">
          <span className="px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-400 flex items-center gap-1">
            <span>🥇 प्रथम:</span>
            <span>+{activeChallenge.reward1st || 500} Pts</span>
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center gap-1">
            <span>🥈 द्वितीय:</span>
            <span>+{activeChallenge.reward2nd || 250} Pts</span>
          </span>
        </div>
      </div>

      {/* Challenge Title & Prompt */}
      <div className="space-y-1.5">
        <h3 className="font-rozha text-xl sm:text-2xl text-slate-900 dark:text-amber-200">
          विषय: "{topicName}"
        </h3>
        <p className="font-tiro text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic bg-white/50 dark:bg-slate-950/40 p-3 rounded-2xl border border-amber-500/20">
          "{promptText}"
        </p>
      </div>

      {/* Action Bar */}
      <div className="pt-1 flex items-center justify-between flex-wrap gap-2">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          सभी प्रविष्टियों का ज्यूरी द्वारा निष्पक्ष मूल्यांकन
        </span>

        <button
          onClick={() => {
            if (setActiveView) setActiveView('daily');
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 via-rose-600 to-rose-700 hover:from-amber-600 hover:to-rose-800 text-white font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-lg active:scale-95 transition cursor-pointer border border-amber-400/30"
        >
          <Send className="w-3.5 h-3.5" />
          <span>✍️ प्रविष्टि सबमिट करें (Submit Entry)</span>
        </button>
      </div>

    </div>
  );
};

export default DailyChallenge;
