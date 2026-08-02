import React from 'react';
import { Flame, Clock, Award, Sparkles, Trophy, ChevronRight, Send } from 'lucide-react';
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
    <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-500/30 rounded-3xl p-5 shadow-sm space-y-4">
      
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-500 text-slate-950 rounded-full font-bold text-xs flex items-center gap-1.5 shadow">
            <Trophy className="w-3.5 h-3.5 text-slate-950" />
            <span>साप्ताहिक लेखन चुनौती (Weekly Challenge)</span>
          </span>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold font-mono">
            ⏱️ {activeChallenge.endsIn || '4 दिन 14 घंटे'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold text-rose-600 dark:text-rose-400">
          <span>🥇 1st: +500 Pts</span>
          <span>🥈 2nd: +250 Pts</span>
        </div>
      </div>

      {/* Challenge Title & Prompt */}
      <div className="space-y-1">
        <h3 className="font-rozha text-xl text-slate-900 dark:text-slate-100">
          विषय: "{topicName}"
        </h3>
        <p className="font-tiro text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
          "{promptText}"
        </p>
      </div>

      {/* External Submit Entry Action Button on Card */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={() => {
            if (setActiveView) setActiveView('dailyChallenge');
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md active:scale-95 transition"
        >
          <Send className="w-4 h-4 text-slate-950" />
          <span>✍️ प्रविष्टि सबमिट करें (Submit Entry)</span>
        </button>
      </div>

    </div>
  );
};

export default DailyChallenge;
