import React, { useState, useEffect } from 'react';
import { Swords, Trophy, Vote, Plus, Flame, Clock, Share2, ShieldCheck, Check, X, Bell, UserPlus, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PoetryBattleChallengeModal from '../components/PoetryBattleChallengeModal';

export const PoetryBattlesView = ({ 
  poetryBattle, 
  requireAuth, 
  onRewardPoints,
  currentUser,
  userProfile,
  posts = [],
  registeredUsers = []
}) => {
  const { t } = useLanguage();
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [userVotes, setUserVotes] = useState({});
  const [customAlertMsg, setCustomAlertMsg] = useState('');

  // Live Pending Battle Challenges State (Persisted in localStorage)
  const [pendingChallenges, setPendingChallenges] = useState(() => {
    try {
      const saved = localStorage.getItem('bolteekalam_pending_challenges_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  // Response Poem State for Accepted Battle
  const [responsePoem, setResponsePoem] = useState('');
  const [activeAcceptingId, setActiveAcceptingId] = useState(null);

  // Active Live Battles (Starts Empty [] or persisted from localStorage - No Dummy Battles!)
  const [battles, setBattles] = useState(() => {
    try {
      const saved = localStorage.getItem('bolteekalam_active_battles_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  // Save battles state to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('bolteekalam_active_battles_v2', JSON.stringify(battles));
    } catch (e) {}
  }, [battles]);

  // Save pending challenges state to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('bolteekalam_pending_challenges_v2', JSON.stringify(pendingChallenges));
    } catch (e) {}
  }, [pendingChallenges]);

  const handleVote = (battleId, targetUserId) => {
    if (requireAuth && !requireAuth()) return;

    if (userVotes[battleId]) {
      setCustomAlertMsg('आप इस बैटल में पहले ही अपना वोट दर्ज कर चुके हैं!');
      return;
    }

    setBattles(prev => prev.map(b => {
      if (b.id === battleId) {
        const isUser1Target = targetUserId === b.user1?.id;
        const newU1Votes = isUser1Target ? (b.user1.votes || 0) + 1 : (b.user1.votes || 0);
        const newU2Votes = !isUser1Target ? (b.user2.votes || 0) + 1 : (b.user2.votes || 0);

        // Check if winner reward threshold reached (+25 Pts to Winner!)
        if ((newU1Votes + newU2Votes) >= 5 && onRewardPoints) {
          const winnerName = newU1Votes > newU2Votes ? b.user1.name : b.user2.name;
          if (winnerName.includes('आप') || winnerName === currentUser?.name) {
            onRewardPoints(25, 'काव्य संग्राम में विजयी होने पर (+25 Pts Reward)');
          }
        }

        return {
          ...b,
          user1: b.user1 ? { ...b.user1, votes: newU1Votes } : b.user1,
          user2: b.user2 ? { ...b.user2, votes: newU2Votes } : b.user2
        };
      }
      return b;
    }));

    setUserVotes(prev => ({ ...prev, [battleId]: targetUserId }));
  };

  const handleAcceptChallenge = (challengeId) => {
    if (requireAuth && !requireAuth()) return;

    const challenge = pendingChallenges.find(c => c.id === challengeId);
    if (challenge) {
      // Check if current user is ALREADY in an active battle!
      const myName = currentUser?.name || userProfile?.name || 'आप';
      const isAlreadyInBattle = battles.some(b => 
        b.user1?.name?.includes(myName) || b.user2?.name?.includes(myName)
      );

      if (isAlreadyInBattle) {
        setCustomAlertMsg('आप इस समय पहले से एक सक्रिय काव्य संग्राम में भाग ले रहे हैं! वर्तमान संग्राम समाप्त होने के बाद ही नई चुनौती स्वीकार करें।');
        return;
      }
    }

    setActiveAcceptingId(challengeId);
  };

  const handleFinalSubmitResponse = (challenge) => {
    if (!responsePoem.trim()) return;

    const myName = currentUser?.name || userProfile?.name || 'आप (कवि)';
    const myAvatar = currentUser?.avatar || userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';

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
        name: myName,
        avatar: myAvatar,
        poem: responsePoem,
        votes: 0
      },
      endsIn: '3 घंटे'
    };

    setBattles(prev => [newLiveBattle, ...prev]);
    setPendingChallenges(prev => prev.filter(c => c.id !== challenge.id));
    setActiveAcceptingId(null);
    setResponsePoem('');

    // Deduct 15 points from Acceptor upon accepting challenge (-15 Pts)
    if (onRewardPoints) onRewardPoints(-15, 'काव्य संग्राम चुनौती स्वीकार करने पर (-15 Pts)');
    setCustomAlertMsg('काव्य संग्राम अब लाइव है! 3 घंटे का मुकाबला शुरू हो चुका है। (-15 Pts)');
  };

  const handleDeclineChallenge = (challengeId) => {
    if (requireAuth && !requireAuth()) return;
    setPendingChallenges(prev => prev.filter(c => c.id !== challengeId));
    setCustomAlertMsg('आपने इस पोएट्री बैटल चुनौती को अस्वीकार कर दिया है।');
  };

  // 🔴 Challenger Cancels Invitation (Refund +10 Pts, Net -5 Pts fee!)
  const handleCancelMySentChallenge = (challengeId) => {
    if (requireAuth && !requireAuth()) return;

    setPendingChallenges(prev => prev.filter(c => c.id !== challengeId));

    // Refund +10 Pts to Challenger
    if (onRewardPoints) onRewardPoints(10, 'काव्य चुनौती रद्द करने पर (+10 Pts Refund)');
    setCustomAlertMsg('आपकी काव्य चुनौती सफलतापूर्वक रद्द कर दी गई है! 10 पॉइंट्स आपके वॉलेट में वापस जमा कर दिए गए हैं (केवल 5 पॉइंट्स प्रोसेसिंग शुल्क काटा गया)।');
  };

  // 🔴 Create Challenge: Store in Pending Challenges (Do NOT publish immediately!)
  const handleCreateChallenge = (challengeData) => {
    if (!challengeData) return;

    const myName = currentUser?.name || userProfile?.name || 'आप (कवि)';
    const myAvatar = currentUser?.avatar || userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';

    // Check if current user is ALREADY in an active battle!
    const isAlreadyInBattle = battles.some(b => 
      b.user1?.name?.includes(myName) || b.user2?.name?.includes(myName)
    );

    if (isAlreadyInBattle) {
      setCustomAlertMsg('आप इस समय पहले से एक सक्रिय काव्य संग्राम में भाग ले रहे हैं! वर्तमान संग्राम समाप्त होने के बाद ही नई चुनौती भेजें।');
      return;
    }

    const opponentName = typeof challengeData.opponent === 'string' ? challengeData.opponent : (challengeData.opponent?.name || 'प्रतिद्वंद्वी कवि');

    const newPendingChallenge = {
      id: challengeData.id || `ch-${Date.now()}`,
      topic: challengeData.topic || 'काव्य महासंग्राम',
      challengerName: myName,
      challengerAvatar: myAvatar,
      opponentName: opponentName,
      challengerPoem: challengeData.myPoem?.content || challengeData.myPoem?.title || 'काव्य रचना',
      createdAt: 'अभी-अभी',
      status: 'PENDING'
    };

    // Store in pendingChallenges (NOT live battle!)
    setPendingChallenges(prev => [newPendingChallenge, ...prev]);

    // Deduct 15 points from Challenger upon sending challenge (-15 Pts)
    if (onRewardPoints) onRewardPoints(-15, 'काव्य चुनौती भेजने पर (-15 Pts)');

    setCustomAlertMsg(`चुनौती '${opponentName}' को सफलतापूर्वक भेज दी गई है! जैसे ही वे इसे स्वीकार करेंगे, आपका संग्राम लाइव हो जाएगा। (-15 Pts)`);
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

      {/* 🔴 1. Received Challenges Inbox (आपको प्राप्त चुनौतियाँ) */}
      {pendingChallenges && pendingChallenges.length > 0 && (
        <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-3xl p-5 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500 animate-bounce" />
              <span>आपको प्राप्त बैटल चुनौतियाँ (Received Challenge Invitations)</span>
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
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{ch.challengerName} ने आपको चुनौती भेजी है!</h4>
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
                      <span>स्वीकार करें (Accept -15 Pts)</span>
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
                      <span>मुकाबला शुरू करें (-15 Pts)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* 🟡 2. Sent Challenges Tracker (आपकी भेजी गई चुनौतियाँ - प्रतीक्षारत) */}
      {pendingChallenges && pendingChallenges.some(ch => ch.challengerName?.includes(currentUser?.name || userProfile?.name || 'आप')) && (
        <div className="bg-rose-500/10 border-2 border-rose-500/30 rounded-3xl p-5 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-500 animate-spin" />
              <span>आपकी भेजी गई चुनौतियाँ (Sent Invitations - Awaiting Acceptance)</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px]">
              प्रतीक्षारत (Pending)
            </span>
          </div>

          {pendingChallenges
            .filter(ch => ch.challengerName?.includes(currentUser?.name || userProfile?.name || 'आप'))
            .map((ch) => (
              <div key={ch.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      प्रतिद्वंद्वी: <strong>{ch.opponentName}</strong>
                    </h4>
                    <span className="text-[10px] text-slate-500 block">
                      विषय: {ch.topic} • स्थिति: <strong>कवि की स्वीकृति की प्रतीक्षा है...</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => handleCancelMySentChallenge(ch.id)}
                    aria-label="चुनौती रद्द करें"
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow active:scale-95 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>चुनौती रद्द करें (+10 Pts Refund)</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-tiro text-xs text-slate-800 dark:text-slate-200 italic border border-slate-200 dark:border-slate-700">
                  "{ch.challengerPoem}"
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Custom Alert Modal (No Default Browser Alerts!) */}
      {customAlertMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-rose-500/30 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto ring-4 ring-rose-500/20">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-tiro leading-relaxed">
              {customAlertMsg}
            </p>
            <button
              onClick={() => setCustomAlertMsg('')}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-xs shadow transition active:scale-95"
            >
              ठीक है (OK)
            </button>
          </div>
        </div>
      )}

      {/* Live Active Battle Cards Showcase */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Flame className="w-4 h-4 text-rose-500" />
          <span>लाइव बैटल द्वंद्व एवं पब्लिक वोटिंग (Live Duels)</span>
        </h3>

        {(!battles || battles.length === 0) ? (
          <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-rose-500/30 rounded-3xl p-8 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto ring-4 ring-rose-500/20">
              <Swords className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-rozha text-slate-900 dark:text-slate-100">
                वर्तमान में कोई सक्रिय काव्य संग्राम नहीं चल रहा है
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-tiro max-w-md mx-auto">
                आप पहले साहित्यकार हैं जो किसी साथी कवि को चुनौती दे सकते हैं! ⚔️ अपनी पंक्तियाँ लिखें और चुनौती भेजें (-15 Pts)
              </p>
            </div>
            <button
              onClick={() => requireAuth(() => setShowChallengeModal(true))}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-extrabold text-xs inline-flex items-center gap-2 shadow-lg active:scale-95 transition"
            >
              <Swords className="w-4 h-4" />
              <span>साहित्यकार को चुनौती दें (-15 Pts)</span>
            </button>
          </div>
        ) : (
          battles.map((b) => {
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
                      <span>{b.endsIn || '3 घंटे'}</span>
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
                      <span>{userVotes[b.id] === b.user1.id ? 'वोट दिया गया ✓' : 'इनकी कविता को वोट दें'}</span>
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
                      <span>{userVotes[b.id] === b.user2.id ? 'वोट दिया गया ✓' : 'इनकी कविता को वोट दें'}</span>
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
          })
        )}
      </div>

      {/* Challenge Modal */}
      <PoetryBattleChallengeModal
        isOpen={showChallengeModal}
        onClose={() => setShowChallengeModal(false)}
        onCreateChallenge={handleCreateChallenge}
        registeredUsers={registeredUsers}
        posts={posts}
        currentUser={currentUser}
        activeBattles={battles}
      />

    </div>
  );
};

export default PoetryBattlesView;
