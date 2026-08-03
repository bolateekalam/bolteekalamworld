import React, { useState } from 'react';
import { Swords, Trophy, Vote, Plus, Flame, Clock, Share2, ShieldCheck, Check, X, Bell, UserPlus, Sparkles, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PoetryBattleChallengeModal from '../components/PoetryBattleChallengeModal';

export const PoetryBattlesView = ({ poetryBattle, requireAuth, onRewardPoints }) => {
  const { t } = useLanguage();
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [userVotes, setUserVotes] = useState({});

  // Live Pending Battle Challenges State (Starts Empty [])
  const [pendingChallenges, setPendingChallenges] = useState([]);

  // Response Poem State for Accepted Battle
  const [responsePoem, setResponsePoem] = useState('');
  const [activeAcceptingId, setActiveAcceptingId] = useState(null);

  // Active Live Battles (Guaranteed Safe Real Team Schema)
  const [battles, setBattles] = useState([
    {
      id: 'pb-live-1',
      topic: '80वाँ स्वतंत्रता दिवस विशेष — देशभक्ति का महासंग्राम',
      user1: {
        id: 'u-sanjay',
        name: 'संजय राय (संस्थापक)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        poem: 'मातृभूमि की बलिवेदी पर शीश चढ़ाने आए हैं।\nविजय पताका फहराने हम देशभक्त मँडराए हैं।',
        votes: 75
      },
      user2: {
        id: 'u-akash',
        name: 'आकाश कुमार सिंह (सह-संस्थापक)',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
        poem: 'तिरंगे की शान में गाएँ हम वीरों की गाथा अमर।\nभारत माँ के चरणों में नत मस्तक है ये सारा नगर।',
        votes: 45
      },
      endsIn: '18 घंटे 45 मिनट'
    }
  ]);

  const handleVote = (battleId, targetUserId) => {
    if (requireAuth && !requireAuth()) return;

    if (userVotes[battleId]) {
      alert('आप इस बैटल में पहले ही अपना वोट दर्ज कर चुके हैं!');
      return;
    }

    setBattles(prev => prev.map(b => {
      if (b.id === battleId) {
        return {
          ...b,
          user1: b.user1 && targetUserId === b.user1.id ? { ...b.user1, votes: (b.user1.votes || 0) + 1 } : b.user1,
          user2: b.user2 && targetUserId === b.user2.id ? { ...b.user2, votes: (b.user2.votes || 0) + 1 } : b.user2
        };
      }
      return b;
    }));

    setUserVotes(prev => ({ ...prev, [battleId]: targetUserId }));
    if (onRewardPoints) onRewardPoints(5, 'पोएट्री बैटल में वोट देने पर');
  };

  const handleAcceptChallenge = (challengeId) => {
    if (requireAuth && !requireAuth()) return;
    setActiveAcceptingId(challengeId);
  };

  const handleFinalSubmitResponse = (challenge) => {
    if (!responsePoem.trim()) return;

    const newLiveBattle = {
      id: `pb-live-${Date.now()}`,
      topic: challenge.topic,
      user1: {
        id: 'challenger',
        name: challenge.challengerName || 'प्रतिद्वंद्वी कवि',
        avatar: challenge.challengerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        poem: challenge.challengerPoem || '',
        votes: 0
      },
      user2: {
        id: 'you',
        name: 'आप (User)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        poem: responsePoem,
        votes: 0
      },
      endsIn: '23 घंटे 59 मिनट'
    };

    setBattles(prev => [newLiveBattle, ...prev]);
    setPendingChallenges(prev => prev.filter(c => c.id !== challenge.id));
    setActiveAcceptingId(null);
    setResponsePoem('');

    if (onRewardPoints) onRewardPoints(20, 'पोएट्री बैटल चुनौती स्वीकार कर कविता पोस्ट करने पर');
  };

  const handleDeclineChallenge = (challengeId) => {
    if (requireAuth && !requireAuth()) return;
    setPendingChallenges(prev => prev.filter(c => c.id !== challengeId));
    alert('आपने इस पोएट्री बैटल चुनौती को अस्वीकार कर दिया है।');
  };

  const handleCreateChallenge = (challengeData) => {
    alert(`पोएट्री बैटल चुनौती '${challengeData?.opponent?.name || 'लेखक'}' को भेज दी गई है!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-800 via-rose-900 to-slate-950 text-white shadow-xl flex items-center justify-between flex-wrap gap-4 border border-rose-500/30">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <Swords className="w-6 h-6 text-rose-400 animate-pulse" />
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/30 text-rose-300 font-extrabold text-[10px] border border-rose-500/40">
              1-on-1 काव्य महासंग्राम (Poetry Battle Arena)
            </span>
          </div>
          <h1 className="text-2xl font-rozha text-rose-100">साहित्यिक पोएट्री बैटल</h1>
          <p className="text-xs text-slate-300 font-tiro leading-relaxed">
            प्लेटफ़ॉर्म के पंजीकृत कवियों को चुनौती दें, अपनी पंक्तियाँ लिखें और पाठकों से लाइव वोट प्राप्त करें!
          </p>
        </div>

        <button
          onClick={() => requireAuth(() => setShowChallengeModal(true))}
          aria-label="कवि को चुनौती दें"
          className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/40 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>कवि को चुनौती दें (Challenge Author)</span>
        </button>
      </div>

      {/* 🔴 Pending Challenge Invitation Inbox */}
      {pendingChallenges && pendingChallenges.length > 0 && (
        <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-3xl p-5 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500 animate-bounce" />
              <span>आपको प्राप्त बैटल चुनौतियाँ (Pending Challenge Invitations)</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
              🔴 {pendingChallenges.length} नई चुनौती
            </span>
          </div>

          {pendingChallenges.map((ch) => (
            <div key={ch.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <img src={ch.challengerAvatar} alt={ch.challengerName} className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{ch.challengerName} ने चुनौती भेजी है!</h4>
                    <span className="text-[10px] text-slate-400">विषय: <strong>{ch.topic}</strong> • {ch.createdAt}</span>
                  </div>
                </div>

                {activeAcceptingId !== ch.id && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAcceptChallenge(ch.id)}
                      aria-label="चुनौती स्वीकार करें"
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>स्वीकार करें (Accept)</span>
                    </button>
                    <button
                      onClick={() => handleDeclineChallenge(ch.id)}
                      aria-label="चुनौती अस्वीकार करें"
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/20 text-rose-600 text-xs font-bold flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>अस्वीकार करें (Decline)</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-tiro text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap border border-slate-200 dark:border-slate-700">
                "{ch.challengerPoem}"
              </div>

              {activeAcceptingId === ch.id && (
                <div className="pt-2 space-y-3 animate-in fade-in duration-200 border-t border-slate-200 dark:border-slate-800">
                  <label className="font-bold text-xs text-emerald-600 dark:text-emerald-400 block">
                    अपनी उत्तर कविता लिखें (जवाब देकर मुकाबला शुरू करें):
                  </label>
                  <textarea
                    value={responsePoem}
                    onChange={(e) => setResponsePoem(e.target.value)}
                    rows={3}
                    placeholder="अपनी 4 पंक्तियाँ उत्तर में लिखें..."
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-tiro border border-emerald-500/40 text-slate-900 dark:text-slate-100"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setActiveAcceptingId(null)}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                    >
                      रद्द करें
                    </button>
                    <button
                      onClick={() => handleFinalSubmitResponse(ch)}
                      className="px-5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center gap-1.5"
                    >
                      <Swords className="w-4 h-4" />
                      <span>मुकाबला शुरू करें (Publish Battle)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Live Active Battle Cards Showcase */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Flame className="w-4 h-4 text-rose-500" />
          <span>लाइव बैटल द्वंद्व एवं पब्लिक वोटिंग (Live Duels)</span>
        </h3>

        {battles && battles.map((b) => {
          if (!b || !b.user1 || !b.user2) return null;

          const u1Votes = b.user1.votes || 0;
          const u2Votes = b.user2.votes || 0;
          const totalVotes = u1Votes + u2Votes;
          
          const u1Percent = totalVotes > 0 ? Math.round((u1Votes / totalVotes) * 100) : 50;
          const u2Percent = totalVotes > 0 ? Math.round((u2Votes / totalVotes) * 100) : 50;
          const hasVoted = !!userVotes[b.id];

          return (
            <div key={b.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
              
              {/* Battle Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-2">
                <div>
                  <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 block uppercase tracking-wider">
                    द्वंद्व विषय
                  </span>
                  <h2 className="text-base font-rozha text-slate-900 dark:text-slate-100">{b.topic}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    <span>{b.endsIn || '18 घंटे 45 मिनट'}</span>
                  </span>
                </div>
              </div>

              {/* 1-on-1 Side by Side Duel Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-rose-600 text-white font-black text-xs items-center justify-center shadow-lg ring-4 ring-white dark:ring-slate-900 z-10">
                  VS
                </div>

                {/* User 1 Duel Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={b.user1.avatar} alt={b.user1.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500" />
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{b.user1.name}</h4>
                        <span className="text-[10px] text-rose-600 font-bold">{u1Votes} वोट्स ({u1Percent}%)</span>
                      </div>
                    </div>

                    <p className="font-tiro text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap italic leading-relaxed">
                      "{b.user1.poem}"
                    </p>
                  </div>

                  <button
                    onClick={() => handleVote(b.id, b.user1.id)}
                    disabled={hasVoted}
                    aria-label={`${b.user1.name} की कविता को वोट दें`}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                      userVotes[b.id] === b.user1.id
                        ? 'bg-emerald-600 text-white shadow'
                        : hasVoted
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md active:scale-95'
                    }`}
                  >
                    <Vote className="w-4 h-4" />
                    <span>{userVotes[b.id] === b.user1.id ? 'वोट दिया गया ✓' : 'इनकी कविता को वोट दें (+5 Pts)'}</span>
                  </button>
                </div>

                {/* User 2 Duel Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={b.user2.avatar} alt={b.user2.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500" />
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{b.user2.name}</h4>
                        <span className="text-[10px] text-amber-600 font-bold">{u2Votes} वोट्स ({u2Percent}%)</span>
                      </div>
                    </div>

                    <p className="font-tiro text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap italic leading-relaxed">
                      "{b.user2.poem}"
                    </p>
                  </div>

                  <button
                    onClick={() => handleVote(b.id, b.user2.id)}
                    disabled={hasVoted}
                    aria-label={`${b.user2.name} की कविता को वोट दें`}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                      userVotes[b.id] === b.user2.id
                        ? 'bg-emerald-600 text-white shadow'
                        : hasVoted
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md active:scale-95'
                    }`}
                  >
                    <Vote className="w-4 h-4" />
                    <span>{userVotes[b.id] === b.user2.id ? 'वोट दिया गया ✓' : 'इनकी कविता को वोट दें (+5 Pts)'}</span>
                  </button>
                </div>

              </div>

              {/* Voting Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-rose-600">{b.user1.name}: {u1Percent}%</span>
                  <span className="text-amber-600">{b.user2.name}: {u2Percent}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                  <div className="h-full bg-rose-600 transition-all duration-500" style={{ width: `${u1Percent}%` }} />
                  <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${u2Percent}%` }} />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Challenge Modal */}
      <PoetryBattleChallengeModal
        isOpen={showChallengeModal}
        onClose={() => setShowChallengeModal(false)}
        onCreateChallenge={handleCreateChallenge}
      />

    </div>
  );
};

export default PoetryBattlesView;
