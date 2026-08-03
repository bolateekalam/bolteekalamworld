import React from 'react';
import { X, Trophy, Award, Gift, Sparkles, Send, Swords, Vote, Users, Flame, ShieldCheck } from 'lucide-react';

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
                साहित्यिक पॉइंट्स प्रणाली (Points Rules)
              </h3>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block">
                वर्तमान कुल अर्जित पॉइंट्स: {points || 0} pts
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
            पॉइंट्स कमाकर राष्ट्रीय साहित्यिक प्रमाण-पत्र व मेडल प्राप्त करें!
          </p>
        </div>

        {/* Points Breakdown Rules List */}
        <div className="space-y-2.5 text-xs">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>पॉइंट्स कैसे कमाएँ? (How to earn Points)</span>
          </h4>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Send className="w-4 h-4 text-rose-500" />
              <span>नई साहित्य रचना (कविता/शायरी) पोस्ट करने पर</span>
            </div>
            <span className="font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">+10 Pts</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>साप्ताहिक लेखन चुनौती (Weekly Challenge) जीतने पर</span>
            </div>
            <span className="font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">+500 Pts</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Swords className="w-4 h-4 text-rose-500" />
              <span>पोएट्री बैटल (Poetry Battle) मुकाबला जीतने पर</span>
            </div>
            <span className="font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">+100 Pts</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Vote className="w-4 h-4 text-amber-500" />
              <span>पोएट्री बैटल में वोट दर्ज करने पर</span>
            </div>
            <span className="font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">+5 Pts</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-emerald-500" />
              <span>मित्र को बोलती कलम पर आमंत्रित (Refer) करने पर</span>
            </div>
            <span className="font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">+100 Pts</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>दैनिक लॉगिन स्ट्रैक (Daily Login Streak) पर</span>
            </div>
            <span className="font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">+5 Pts</span>
          </div>
        </div>

        {/* Milestones Rewards */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5 text-xs text-amber-800 dark:text-amber-300 font-bold">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-amber-600" />
            <span>रिवार्ड्स व प्रमाण-पत्र अनलॉकिंग:</span>
          </div>
          <p className="text-[11px] font-normal text-slate-600 dark:text-slate-300">
            • <strong>1,000 Pts</strong>: साहित्य साधक डिजिटल सर्टिफिकेट<br/>
            • <strong>2,500 Pts</strong>: वरिष्ठ रचनाकार मास्टर्स सर्टिफिकेट<br/>
            • <strong>5,000 Pts</strong>: बोलती कलम बुक + मेडल किट होम डिलीवरी!
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow transition active:scale-95"
        >
          समझ गया (Close)
        </button>

      </div>
    </div>
  );
};

export default PointsExplanationModal;
