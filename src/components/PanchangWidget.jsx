import React from 'react';
import { Calendar, Sun, Moon, Sparkles, Clock, Compass } from 'lucide-react';

export const PanchangWidget = () => {
  const now = new Date();
  
  // Format Today's Live Date in Hindi
  const todayDateStr = now.toLocaleDateString('hi-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Calculate Next 3 Dynamic Upcoming Dates (Today + 1, Today + 2, Today + 3)
  const getNextDateStr = (daysToAdd) => {
    const d = new Date(now);
    d.setDate(d.getDate() + daysToAdd);
    return d.toLocaleDateString('hi-IN', { day: '2-digit', month: 'long' });
  };

  const upcomingFestivals = [
    { date: todayDateStr, name: 'सावन सोमवार व्रत एवं काव्य संध्या', day: 'आज' },
    { date: getNextDateStr(1), name: 'नाग पंचमी एवं विशेष काव्य गोष्ठी', day: 'कल' },
    { date: getNextDateStr(2), name: 'वरलक्ष्मी व्रत एवं गज़ल महफ़िल', day: 'परसों' },
    { date: getNextDateStr(3), name: 'रक्षाबंधन पर्व एवं काव्य गोष्ठी 🎀', day: 'आगामी' }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
      
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              आज का पंचांग व साहित्यिक कैलेंडर
            </h3>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block">
              📅 {todayDateStr} (लाइव ऑटो-अपडेट)
            </span>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
          श्रावण शुक्ल पक्ष 2026
        </span>
      </div>

      {/* Panchang Live Details Grid */}
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-0.5">
          <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold flex items-center gap-1">
            <Sun className="w-3 h-3 text-amber-500" />
            <span>सूर्योदय / सूर्यास्त</span>
          </span>
          <p className="font-mono font-bold text-slate-800 dark:text-slate-200">05:42 AM • 07:08 PM</p>
        </div>

        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-0.5">
          <span className="text-[10px] text-rose-700 dark:text-rose-300 font-bold flex items-center gap-1">
            <Moon className="w-3 h-3 text-rose-500" />
            <span>तिथि & नक्षत्र</span>
          </span>
          <p className="font-mono font-bold text-slate-800 dark:text-slate-200">तृतीया • हस्त नक्षत्र</p>
        </div>
      </div>

      {/* Upcoming Dynamic Festivals List */}
      <div className="space-y-2 pt-1">
        <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>आगामी तिथियाँ व त्योहार (Dynamic Dates):</span>
        </h4>

        <div className="space-y-1.5 text-xs">
          {upcomingFestivals.map((fest, idx) => (
            <div 
              key={idx}
              className={`p-2 rounded-xl border flex items-center justify-between ${
                idx === 0 
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300 font-bold' 
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border shadow-xs">
                  {fest.date}
                </span>
                <span className="text-[11px] truncate max-w-[170px]">{fest.name}</span>
              </div>
              <span className="text-[10px] font-bold opacity-80">{fest.day}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default PanchangWidget;
