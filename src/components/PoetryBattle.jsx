import React, { useState } from 'react';
import { Swords, ThumbsUp, Flame, Trophy, Clock, CheckCircle2, Award, Share2, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

export const PoetryBattle = ({ battle }) => {
  const { t } = useLanguage();
  const [votedPoetId, setVotedPoetId] = useState(null);
  const [poet1Votes, setPoet1Votes] = useState(battle.poet1.votes);
  const [poet2Votes, setPoet2Votes] = useState(battle.poet2.votes);
  const [copiedLink, setCopiedLink] = useState(false);

  const total = poet1Votes + poet2Votes;
  const poet1Percent = Math.round((poet1Votes / total) * 100);
  const poet2Percent = Math.round((poet2Votes / total) * 100);

  const handleVote = (poetId) => {
    if (votedPoetId) return;

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });

    setVotedPoetId(poetId);
    if (poetId === battle.poet1.id) {
      setPoet1Votes(prev => prev + 1);
    } else {
      setPoet2Votes(prev => prev + 1);
    }
  };

  const handleShareBattle = () => {
    const link = `${window.location.origin}/battle/${battle.id}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-600/20 shrink-0">
            <Swords className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold tracking-wider">
                {battle.status}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                कुल वोट: {total.toLocaleString()}
              </span>
            </div>
            <h3 className="text-base md:text-lg font-rozha text-slate-900 dark:text-slate-100">
              {battle.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareBattle}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1 transition"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5 text-rose-500" />}
            <span>{copiedLink ? 'इनवाइट लिंक कॉपी हुआ!' : 'बैटल इनवाइट लिंक'}</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-mono text-slate-600 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>समाप्त होने में: {battle.endsIn}</span>
          </div>
        </div>
      </div>

      {/* Battle Cards Grid (2 Poets Head-to-Head) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Poet 1 */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition relative ${
          votedPoetId === battle.poet1.id
            ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20'
            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <img src={battle.poet1.avatar} alt={battle.poet1.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-500 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{battle.poet1.name}</h4>
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">{battle.poet1.title}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
              विजेता पुरस्कार: +150 Pts
            </span>
          </div>

          <div className="font-tiro text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed italic bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 mb-4">
            "{battle.poet1.lines}"
          </div>

          <button
            onClick={() => handleVote(battle.poet1.id)}
            disabled={!!votedPoetId}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
              votedPoetId === battle.poet1.id
                ? 'bg-rose-600 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-900/20'
            }`}
          >
            {votedPoetId === battle.poet1.id ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>वोट दर्ज हुआ ({poet1Percent}%)</span>
              </>
            ) : (
              <>
                <ThumbsUp className="w-4 h-4" />
                <span>वोट दें (Poet 1)</span>
              </>
            )}
          </button>
        </div>

        {/* Poet 2 */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition relative ${
          votedPoetId === battle.poet2.id
            ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20'
            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <img src={battle.poet2.avatar} alt={battle.poet2.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{battle.poet2.name}</h4>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">{battle.poet2.title}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
              विजेता पुरस्कार: +150 Pts
            </span>
          </div>

          <div className="font-tiro text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed italic bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 mb-4">
            "{battle.poet2.lines}"
          </div>

          <button
            onClick={() => handleVote(battle.poet2.id)}
            disabled={!!votedPoetId}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
              votedPoetId === battle.poet2.id
                ? 'bg-amber-500 text-slate-950'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
            }`}
          >
            {votedPoetId === battle.poet2.id ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>वोट दर्ज हुआ ({poet2Percent}%)</span>
              </>
            ) : (
              <>
                <ThumbsUp className="w-4 h-4" />
                <span>वोट दें (Poet 2)</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Real-time Voting Meter Bar */}
      <div className="space-y-1.5 pt-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-rose-600 dark:text-rose-400">{battle.poet1.name}: {poet1Percent}%</span>
          <span className="text-amber-500">{battle.poet2.name}: {poet2Percent}%</span>
        </div>
        <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
          <div style={{ width: `${poet1Percent}%` }} className="bg-rose-600 h-full transition-all duration-500" />
          <div style={{ width: `${poet2Percent}%` }} className="bg-amber-500 h-full transition-all duration-500" />
        </div>
      </div>

    </div>
  );
};

export default PoetryBattle;
