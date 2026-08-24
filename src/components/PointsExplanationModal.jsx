import React from 'react';
import { X, Trophy, Award, Gift, Sparkles, Send, Swords, Vote, Users, Flame, ShieldCheck, Download, Share2 } from 'lucide-react';

export const PointsExplanationModal = ({ isOpen, onClose, points }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white flex items-center justify-center font-bold shadow">
              <Trophy className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                पॉइंट्स प्रणाली एवं पासबुक नियम (Rules)
              </h3>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block">
                वर्तमान कुल उपलब्ध बैलेंस: {points || 0} Pts
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="पॉइंट्स नियम मॉडल बंद करें"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Points Badge Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border border-amber-500/30 text-center space-y-1">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block uppercase tracking-wider">
            आपके वर्तमान पॉइंट्स
          </span>
          <div className="text-3xl font-rozha text-slate-900 dark:text-slate-100">
            {points || 0} <span className="text-sm font-sans font-bold text-rose-600">Pts</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300">
            🎁 नए यूज़र को 50 वेलकम पॉइंट्स (2 HD पोस्टर्स के लिए) फ्री मिलते हैं!
          </p>
        </div>

        {/* Points Breakdown Rules List */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>पॉइंट्स कैसे कमाएँ? (Daily Earning Sequence)</span>
          </h4>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-rose-500 shrink-0" />
              <span>नया खाता बनाने पर (Welcome Bonus - एक बार)</span>
            </div>
            <span className="font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">+50 Pts</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500 shrink-0" />
              <span>दैनिक शब्द खेल (Daily Word Game - रोज़ाना)</span>
            </div>
            <span className="font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">+5 Pts</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-rose-500 shrink-0" />
              <span>नई कविता पोस्ट करने पर (दैनिक अधिकतम 2 बार)</span>
            </div>
            <span className="font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">+5 Pts</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>WhatsApp / सोशल मीडिया पर शेयर करने पर</span>
            </div>
            <span className="font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">+5 Pts</span>
          </div>
        </div>

        {/* Points Spending Rules */}
        <div className="space-y-2 text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Download className="w-4 h-4 text-rose-500" />
            <span>पॉइंट्स कहाँ खर्च होंगे? (Points Usage)</span>
          </h4>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span>HD कवि पोस्टर डाउनलोड करने पर</span>
            <span className="font-bold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-full">-25 Pts</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span>सीधे मंच (Feed) पर पोस्टर प्रकाशित करने पर</span>
            <span className="font-bold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-full">-15 Pts</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow transition active:scale-95 cursor-pointer"
        >
          समझ गया (Close)
        </button>

      </div>
    </div>
  );
};

export default PointsExplanationModal;
