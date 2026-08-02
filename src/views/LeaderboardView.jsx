import React, { useState } from 'react';
import { Award, Flame, ShieldCheck, Trophy, Crown, Star, Medal } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { mockLeaderboards } from '../data/mockLeaderboard';

export const LeaderboardView = () => {
  const { t } = useLanguage();
  const [period, setPeriod] = useState('weekly');

  const currentList = mockLeaderboards[period] || mockLeaderboards.weekly;

  const periods = [
    { id: 'weekly', label: t('leaderboard.weekly') },
    { id: 'monthly', label: t('leaderboard.monthly') },
    { id: 'yearly', label: t('leaderboard.yearly') },
    { id: 'allTime', label: t('leaderboard.allTime') }
  ];

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-600 via-amber-700 to-rose-900 text-white shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-400/20 text-amber-300">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-rozha text-amber-100">
              {t('leaderboard.title')}
            </h1>
            <p className="text-xs text-amber-100/90 mt-1 font-tiro">
              रचनाएँ लिखकर, प्रतियोगिता जीत कर एवं सक्रिय रहकर लीडरबोर्ड में शीर्ष स्थान प्राप्त करें।
            </p>
          </div>
        </div>

        {/* Period Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-2xl backdrop-blur-md">
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                period === p.id 
                  ? 'bg-amber-500 text-slate-950 shadow-md' 
                  : 'text-rose-100 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {currentList.slice(0, 3).map((writer, index) => {
          const ranks = [
            { crown: Crown, color: 'border-amber-400 bg-amber-500/10 text-amber-500', rankNum: '#1 Gold' },
            { crown: Medal, color: 'border-slate-300 bg-slate-400/10 text-slate-300', rankNum: '#2 Silver' },
            { crown: Medal, color: 'border-amber-700 bg-amber-800/10 text-amber-700', rankNum: '#3 Bronze' }
          ];
          const RankIcon = ranks[index].crown;

          return (
            <div 
              key={index}
              className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border ${ranks[index].color} text-center space-y-3 shadow-md relative overflow-hidden`}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden mx-auto ring-4 ring-amber-500/30">
                <img src={writer.avatar} alt={writer.name} className="w-full h-full object-cover" />
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                  {ranks[index].rankNum}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {writer.name}
                </h3>
                <span className="text-xs text-slate-500">{writer.city}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-outfit font-bold text-sm">
                {writer.points.toLocaleString()} पॉइंट्स
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1 text-rose-500">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{writer.streak} दिन Streak</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Complete Ranks Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300">
          सम्पूर्ण रैंकिंग तालिका
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {currentList.map((item) => (
            <div 
              key={item.rank}
              className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-full font-outfit font-bold text-xs flex items-center justify-center ${
                  item.rank === 1 ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  #{item.rank}
                </span>

                <div className="flex items-center gap-3">
                  <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.badge !== 'none' && (
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </h4>
                    <span className="text-xs text-slate-500">{item.city} • {item.postsCount} रचनाएँ</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold font-outfit text-rose-600 dark:text-rose-400">
                  {item.points.toLocaleString()} pts
                </div>
                <div className="text-[11px] text-amber-500 font-semibold flex items-center gap-1 justify-end">
                  <Flame className="w-3 h-3" />
                  <span>{item.streak} day streak</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default LeaderboardView;
