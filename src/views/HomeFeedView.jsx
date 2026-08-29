import React, { useState, useMemo } from 'react';
import { 
  Award, ShieldCheck, CheckCircle2, Sparkles, Image as ImageIcon, 
  Flame, Feather, Flag, ArrowRight, BookOpen, Heart, MessageCircle, 
  Share2, Trophy, Star, Users, Zap, Compass, TrendingUp, Play, Pause,
  Volume2, Eye, Clock, Check, Swords, ThumbsUp, Quote, LayoutGrid, List, Sparkle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import DailyChallenge from '../components/DailyChallenge';
import PostCard from '../components/PostCard';
import { mockCategories } from '../data/mockPosts';

export const HomeFeedView = ({ 
  posts = [], 
  dailyChallenge, 
  onOpenCreatePost,
  onOpenCertificate,
  setActiveView,
  onEditPost,
  onDeletePost,
  onOpenAuthorProfile,
  onOpenPoetryChallenge,
  onLikePost,
  onAddComment,
  onFollowAuthor,
  onOpenMembershipCard,
  onOpenYouTubeTask,
  onYouTubeVisit,
  userProfile,
  requireAuth,
  activeFestivalTheme,
  authorProfileMap
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [feedLayoutMode, setFeedLayoutMode] = useState('editorial'); // 'editorial' | 'visualGrid' | 'trending'
  
  // Interactive Duel Voting State in Feed
  const [duelVotes, setDuelVotes] = useState({ poetA: 64, poetB: 36, userVoted: null });
  
  // Featured Masterpiece Audio Recite state
  const [isPlayingFeaturedAudio, setIsPlayingFeaturedAudio] = useState(false);
  const [featuredWahCount, setFeaturedWahCount] = useState(148);
  const [hasGivenWah, setHasGivenWah] = useState(false);

  const publicActivePosts = posts.filter(p => !p.isArchived);

  // Category Filtered
  const categoryFiltered = selectedCategory === 'all' 
    ? publicActivePosts 
    : publicActivePosts.filter(p => p.category === selectedCategory);

  // Layout mode sorting
  const filteredPosts = useMemo(() => {
    if (feedLayoutMode === 'trending') {
      return [...categoryFiltered].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    return categoryFiltered;
  }, [categoryFiltered, feedLayoutMode]);

  // Featured Poem of the Day (Top liked post or first standout poem)
  const featuredPoem = useMemo(() => {
    if (publicActivePosts.length === 0) return null;
    const sorted = [...publicActivePosts].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    return sorted[0];
  }, [publicActivePosts]);

  // Top Authors Spotlight Reel
  const spotlightAuthors = useMemo(() => {
    const seen = new Set();
    const list = [];
    posts.forEach(p => {
      if (p.author && p.author.name) {
        const key = p.author.name.trim().toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          list.push({
            name: p.author.name,
            username: p.author.username || '@writer',
            avatar: p.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
            city: p.author.city || 'प्रयागराज',
            followers: p.author.followers || 420,
            fullAuthor: p.author
          });
        }
      }
    });
    return list.slice(0, 12);
  }, [posts]);

  // Handle Wah-Wah celebration on Featured Poem
  const handleFeaturedWah = () => {
    if (requireAuth && !requireAuth()) return;
    if (!hasGivenWah) {
      setFeaturedWahCount(prev => prev + 1);
      setHasGivenWah(true);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  // Handle In-Feed Duel Vote
  const handleDuelVote = (poet) => {
    if (requireAuth && !requireAuth()) return;
    if (duelVotes.userVoted) return;

    if (poet === 'A') {
      setDuelVotes(prev => ({ poetA: prev.poetA + 1, poetB: prev.poetB, userVoted: 'A' }));
    } else {
      setDuelVotes(prev => ({ poetA: prev.poetA, poetB: prev.poetB + 1, userVoted: 'B' }));
    }

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}
  };

  // Visual Card Background Palettes
  const cardGradients = [
    'from-rose-950 via-slate-900 to-[#0e2238] border-rose-500/40 text-rose-100',
    'from-purple-950 via-slate-900 to-indigo-950 border-purple-500/40 text-purple-100',
    'from-amber-950 via-slate-900 to-stone-900 border-amber-500/40 text-amber-100',
    'from-emerald-950 via-slate-900 to-teal-950 border-emerald-500/40 text-emerald-100',
    'from-blue-950 via-slate-900 to-slate-950 border-blue-500/40 text-blue-100'
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-8">

      {/* 🔴 1. Live Community Heartbeat & Daily Literary Quest Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-[#0c1829] via-slate-900 to-[#161d31] rounded-2xl border border-amber-500/30 text-white shadow-lg">
        
        {/* Live Active Poets Metric */}
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div className="text-xs">
            <span className="font-extrabold text-emerald-400">1,420+ साहित्य साधक</span>
            <span className="text-slate-300 font-medium hidden sm:inline"> अभी मंच पर सक्रिय व सृजनरत हैं</span>
          </div>
        </div>

        {/* User Daily Quest Mini Tracker */}
        <div className="flex items-center gap-3 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-amber-400/20 text-xs">
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>दैनिक स्ट्रीक: 3 दिन</span>
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 text-[11px]">
            रिवॉर्ड वॉलेट: <strong className="text-amber-300">{userProfile?.points || 50} Pts</strong>
          </span>
        </div>

      </div>

      {/* 👑 2. Royal Designer Hero Banner & Creative Studio Launcher */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1424] via-[#141e33] to-[#070e1a] text-white shadow-2xl p-5 sm:p-8 border-2 border-amber-500/40">
        
        {/* Background Atmosphere Lights */}
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-72 h-72 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          
          {/* Top Tag & Council Verification */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/25 via-rose-500/20 to-amber-500/25 border border-amber-400/50 text-amber-300 text-xs font-black shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>🏛️ राष्ट्रीय डिजिटल साहित्यिक मंच • बोलती कलम</span>
            </div>

            <span className="text-[11px] text-amber-200/90 font-serif italic">
              "जहाँ शब्द बोलते हैं और कलम गाती है"
            </span>
          </div>

          {/* Hero Main Content */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Brand Logo & Headline */}
            <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
              
              {/* 3D Glowing Brand Logo */}
              <div className="relative group shrink-0">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 via-rose-500 to-amber-300 rounded-3xl blur-md opacity-80 group-hover:opacity-100 transition duration-500 animate-pulse" />
                <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-2xl bg-slate-950 p-2 border-2 border-amber-400 shadow-2xl flex items-center justify-center">
                  <img 
                    src="/logo.png" 
                    alt="बोलती कलम" 
                    className="w-full h-full object-contain filter drop-shadow" 
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span className="text-3xl font-bold">🪶</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-4xl font-black font-rozha text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 tracking-wide drop-shadow">
                    बोलती कलम
                  </h1>
                  <span className="px-2.5 py-0.5 text-[10px] font-black bg-gradient-to-r from-rose-600 to-amber-600 text-white rounded-full uppercase tracking-wider shadow">
                    Verified Digital Platform
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-serif leading-relaxed max-w-xl">
                  भारत का प्रमुख बहुभाषी साहित्यिक संसार — नई कविताएँ, शायरी व ग़ज़लें पढ़ें, 1-on-1 काव्य दंगल लड़ें और अपना कवि पोस्टर बनाएं।
                </p>
              </div>

            </div>

            {/* Main Creative CTA Buttons */}
            <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap sm:flex-nowrap">
              <button
                onClick={() => {
                  if (requireAuth && !requireAuth()) return;
                  if (onOpenCreatePost) onOpenCreatePost();
                }}
                className="flex-1 sm:flex-initial px-6 py-3.5 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:brightness-110 text-white font-black rounded-2xl text-xs sm:text-sm shadow-xl shadow-rose-900/40 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer border border-amber-400/40 whitespace-nowrap"
              >
                <Feather className="w-4 h-4" />
                <span>+ नई रचना प्रकाशित करें</span>
              </button>

              <button
                onClick={() => {
                  if (setActiveView) setActiveView('posterStudio');
                }}
                className="flex-1 sm:flex-initial px-5 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-amber-300 font-extrabold rounded-2xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer border border-amber-500/30 whitespace-nowrap"
              >
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>📸 कवि Studio</span>
              </button>
            </div>

          </div>

          {/* Quick Feature Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-700/50 text-center text-xs">
            <div 
              onClick={() => setActiveView && setActiveView('posterStudio')}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 transition cursor-pointer border border-purple-500/30 text-purple-200 flex items-center justify-center gap-1.5"
            >
              <span>📸</span>
              <span className="font-bold">पोस्टर Studio</span>
            </div>

            <div 
              onClick={() => onOpenMembershipCard && onOpenMembershipCard()}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 transition cursor-pointer border border-amber-500/30 text-amber-200 flex items-center justify-center gap-1.5"
            >
              <span>🎖️</span>
              <span className="font-bold">सदस्यता कार्ड</span>
            </div>

            <div 
              onClick={() => setActiveView && setActiveView('battles')}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 transition cursor-pointer border border-orange-500/30 text-orange-200 flex items-center justify-center gap-1.5"
            >
              <span>⚔️</span>
              <span className="font-bold">काव्य दंगल</span>
            </div>

            <div 
              onClick={() => setActiveView && setActiveView('certificates')}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 transition cursor-pointer border border-emerald-500/30 text-emerald-200 flex items-center justify-center gap-1.5"
            >
              <span>📜</span>
              <span className="font-bold">सम्मान पत्र</span>
            </div>
          </div>

        </div>
      </div>

      {/* 🌟 3. आज की सर्वश्रेष्ठ रचना (Featured Masterpiece Spotlight) */}
      {featuredPoem && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#120a1c] via-[#1a1226] to-[#0a0712] border-2 border-amber-400/50 p-5 sm:p-7 text-white shadow-2xl space-y-4">
          
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-amber-500/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs rounded-full shadow flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                <span>👑 आज की श्रेष्ठ रचना (Masterpiece of the Day)</span>
              </span>
            </div>

            <span className="text-xs text-amber-300 font-bold font-mono">
              ❤️ {featuredPoem.likes || 48} पाठकों ने सराहा
            </span>
          </div>

          {/* Masterpiece Content Body */}
          <div className="space-y-3 pt-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg sm:text-2xl font-black font-rozha text-amber-200">
                  {featuredPoem.title || 'शीर्षक विहीन अनुपम रचना'}
                </h3>
                <p className="text-xs text-slate-400 font-serif">
                  विधा: <strong className="text-amber-400">{featuredPoem.category || 'कविता'}</strong> • रचनाकार: <strong className="text-white">{featuredPoem.author?.name || 'साहित्य साधक'}</strong>
                </p>
              </div>

              <div 
                onClick={() => onOpenAuthorProfile && onOpenAuthorProfile(featuredPoem.author)}
                className="flex items-center gap-2 cursor-pointer bg-slate-900/80 px-3 py-1.5 rounded-2xl border border-amber-500/30 hover:border-amber-400 transition shrink-0"
              >
                <img 
                  src={featuredPoem.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'} 
                  alt={featuredPoem.author?.name} 
                  className="w-8 h-8 rounded-full object-cover border border-amber-400"
                />
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-bold text-white block leading-tight">{featuredPoem.author?.name}</span>
                  <span className="text-[10px] text-amber-400 block">सत्यापित कवि</span>
                </div>
              </div>
            </div>

            {/* Decorative Quote Typography */}
            <div className="relative p-4 sm:p-6 rounded-2xl bg-black/40 border border-amber-500/20 text-slate-100 font-tiro text-sm sm:text-base leading-loose italic">
              <Quote className="w-8 h-8 text-amber-400/30 absolute top-2 left-2 pointer-events-none" />
              <p className="relative z-10 whitespace-pre-line pl-4">
                {featuredPoem.content?.slice(0, 300)}
                {featuredPoem.content?.length > 300 && '...'}
              </p>
            </div>
          </div>

          {/* Masterpiece Interaction Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleFeaturedWah}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition active:scale-95 flex items-center gap-2 shadow-lg cursor-pointer ${
                  hasGivenWah 
                    ? 'bg-rose-600 text-white shadow-rose-900/40 ring-2 ring-rose-400' 
                    : 'bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasGivenWah ? 'fill-white text-white' : 'fill-slate-950 text-slate-950'}`} />
                <span>{hasGivenWah ? '❤️ वाह! दाद समर्पित' : `दाद दें (Wah-Wah!) • ${featuredWahCount}`}</span>
              </button>

              <button
                onClick={() => {
                  const shareText = encodeURIComponent(`📜 बोलती कलम पर आज की श्रेष्ठ रचना: "${featuredPoem.title}" by ${featuredPoem.author?.name}\n\nपढ़ें: ${window.location.origin}`);
                  window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
                }}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow flex items-center gap-1.5 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp शेयर</span>
              </button>
            </div>

            <button
              onClick={() => {
                if (onOpenAuthorProfile) onOpenAuthorProfile(featuredPoem.author);
              }}
              className="text-xs text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <span>कवि की अन्य रचनाएँ देखें →</span>
            </button>
          </div>

        </div>
      )}

      {/* ⚔️ 4. Interactive Live Poetry Duel Arena (In-Feed Battle Challenge) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#1a0c0c] via-[#241212] to-[#120707] text-white border-2 border-orange-500/40 shadow-xl space-y-4">
        
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gradient-to-r from-orange-600 to-rose-600 text-white font-black text-xs rounded-full shadow flex items-center gap-1.5">
              <Swords className="w-4 h-4 text-amber-300" />
              <span>⚔️ लाइव काव्य दंगल (Live Battle Duel)</span>
            </span>
            <span className="text-[11px] text-orange-300 font-mono">विषय: "इश्क़ बनाम आज़ादी"</span>
          </div>

          <span className="text-xs font-bold text-amber-400 bg-orange-950/60 px-3 py-1 rounded-xl border border-orange-500/30">
            🔥 {duelVotes.poetA + duelVotes.poetB} वोट्स डाले गए
          </span>
        </div>

        {/* 2 Poets Side-by-Side Arena */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Poet A Card */}
          <div className="p-4 rounded-2xl bg-black/40 border border-orange-500/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
                  alt="कवि 1" 
                  className="w-9 h-9 rounded-full object-cover border border-amber-400"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-amber-200">राघवेंद्र मिश्र 'साहिल'</h4>
                  <span className="text-[10px] text-slate-400">प्रयागराज • 520 Pts</span>
                </div>
              </div>
              <p className="text-xs text-slate-200 font-tiro italic bg-white/5 p-2.5 rounded-xl leading-relaxed">
                "हवाओं में बहक जाने की ख्वाहिश अब नहीं रहती,\nतेरी महफ़िल से बेहतर कोई वीराना नहीं मिलता।"
              </p>
            </div>

            <button
              onClick={() => handleDuelVote('A')}
              disabled={duelVotes.userVoted !== null}
              className={`w-full py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow ${
                duelVotes.userVoted === 'A'
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                  : 'bg-gradient-to-r from-orange-500 to-rose-600 hover:brightness-110 text-white cursor-pointer'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{duelVotes.userVoted === 'A' ? '✓ आपका वोट समर्पित' : `कवि राघवेंद्र को वोट दें (${duelVotes.poetA})`}</span>
            </button>
          </div>

          {/* Poet B Card */}
          <div className="p-4 rounded-2xl bg-black/40 border border-rose-500/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" 
                  alt="कवि 2" 
                  className="w-9 h-9 rounded-full object-cover border border-rose-400"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-rose-200">आनंद वर्धन 'नीरव'</h4>
                  <span className="text-[10px] text-slate-400">वाराणसी • 480 Pts</span>
                </div>
              </div>
              <p className="text-xs text-slate-200 font-tiro italic bg-white/5 p-2.5 rounded-xl leading-relaxed">
                "आज़ाद परिंदों को पिंजरों का खौफ़ क्या होगा,\nजो खुद आसमाँ बन जाएं उन्हें तूफानों का डर क्या।"
              </p>
            </div>

            <button
              onClick={() => handleDuelVote('B')}
              disabled={duelVotes.userVoted !== null}
              className={`w-full py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow ${
                duelVotes.userVoted === 'B'
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                  : 'bg-gradient-to-r from-rose-600 to-purple-600 hover:brightness-110 text-white cursor-pointer'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{duelVotes.userVoted === 'B' ? '✓ आपका वोट समर्पित' : `कवि आनंद को वोट दें (${duelVotes.poetB})`}</span>
            </button>
          </div>

        </div>

        {/* Live Voting Percentage Progress Bar */}
        <div className="space-y-1.5 pt-1">
          {(() => {
            const total = duelVotes.poetA + duelVotes.poetB || 1;
            const pctA = Math.round((duelVotes.poetA / total) * 100);
            const pctB = 100 - pctA;
            return (
              <>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                  <span className="text-orange-300">राघवेंद्र: {pctA}%</span>
                  <span className="text-rose-300">आनंद: {pctB}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                  <div style={{ width: `${pctA}%` }} className="bg-orange-500 h-full transition-all duration-500" />
                  <div style={{ width: `${pctB}%` }} className="bg-rose-600 h-full transition-all duration-500" />
                </div>
              </>
            );
          })()}
        </div>

      </div>

      {/* ⭐ 5. शीर्ष साहित्यकार स्टोरी रील (Top Poets Spotlight Story Circles) */}
      {spotlightAuthors.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-md space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-black font-rozha text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>सत्यापित रचनाकार (Top Poets Spotlight)</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              प्रोफाइल देखें
            </span>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
            {spotlightAuthors.map((author, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (onOpenAuthorProfile) onOpenAuthorProfile(author.fullAuthor);
                }}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group w-18 text-center"
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-rose-500 to-amber-300 group-hover:scale-108 transition-transform shadow-md ring-2 ring-rose-500/20">
                    <img 
                      src={author.avatar} 
                      alt={author.name}
                      className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-900"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[9px] font-black border border-white dark:border-slate-900 shadow">
                    ✓
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate w-full group-hover:text-rose-600 transition">
                  {author.name}
                </span>
                <span className="text-[9px] text-slate-400 truncate w-full">
                  {author.city}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🏆 6. Weekly Literature Challenge Banner */}
      {dailyChallenge && (
        <DailyChallenge 
          challenge={dailyChallenge} 
          onOpenCertificate={onOpenCertificate} 
          setActiveView={setActiveView}
        />
      )}

      {/* 🏷️ 7. Dynamic Layout Switcher & Category Filter Bar */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
          
          {/* Category Heading */}
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-rose-600" />
            <h3 className="text-xs sm:text-sm font-black font-rozha text-slate-900 dark:text-slate-100">
              साहित्यिक विधाएं
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-extrabold">
              {filteredPosts.length} रचनाएँ
            </span>
          </div>

          {/* 3 Layout Mode Switchers */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs self-stretch sm:self-auto justify-center">
            <button
              onClick={() => setFeedLayoutMode('editorial')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer ${
                feedLayoutMode === 'editorial'
                  ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>संपादकीय फीड</span>
            </button>

            <button
              onClick={() => setFeedLayoutMode('visualGrid')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer ${
                feedLayoutMode === 'visualGrid'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>विज़ुअल कार्ड्स</span>
            </button>

            <button
              onClick={() => setFeedLayoutMode('trending')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer ${
                feedLayoutMode === 'trending'
                  ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-sm font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>ट्रेंडिंग</span>
            </button>
          </div>

        </div>

        {/* Category Pills Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-rose-900/20 scale-[1.02] ring-2 ring-amber-400/40'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>✨ सभी रचनाएँ</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-black/20 text-white font-bold">
              {publicActivePosts.length}
            </span>
          </button>

          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-rose-900/20 scale-[1.02] ring-2 ring-amber-400/40'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 📜 8. Posts Content: Visual Card Wall Mode OR Editorial Stream */}
      {feedLayoutMode === 'visualGrid' ? (
        /* 🖼️ Pinterest/Instagram-Style Visual Poetry Card Wall */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {filteredPosts.map((post, idx) => {
            const gradientStyle = cardGradients[idx % cardGradients.length];
            return (
              <div 
                key={post.id}
                className={`p-5 sm:p-6 rounded-3xl bg-gradient-to-br ${gradientStyle} border-2 shadow-xl flex flex-col justify-between gap-4 hover:scale-[1.01] transition-transform relative overflow-hidden`}
              >
                <div className="space-y-3">
                  {/* Top Author Pill */}
                  <div className="flex items-center justify-between gap-2">
                    <div 
                      onClick={() => onOpenAuthorProfile && onOpenAuthorProfile(post.author)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <img 
                        src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'} 
                        alt={post.author?.name} 
                        className="w-7 h-7 rounded-full object-cover border border-amber-400"
                      />
                      <span className="text-xs font-bold text-white truncate max-w-[140px]">{post.author?.name}</span>
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-wider">
                      {post.category || 'कविता'}
                    </span>
                  </div>

                  {/* Title & Poetry Lines */}
                  <h4 className="text-base sm:text-lg font-black font-rozha text-amber-200">
                    {post.title || 'काव्य रचना'}
                  </h4>

                  <div className="text-xs sm:text-sm font-tiro leading-relaxed italic whitespace-pre-line bg-black/25 p-3 rounded-2xl border border-white/10">
                    {post.content?.slice(0, 180)}
                    {post.content?.length > 180 && '...'}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-bold">
                      ❤️ {post.likes || 12}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-slate-300">
                      💬 {post.comments?.length || 0}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (setActiveView) setActiveView('posterStudio');
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-amber-100 text-slate-950 font-black rounded-xl text-[11px] shadow flex items-center gap-1 transition cursor-pointer"
                  >
                    <span>📸 HD पोस्टर बनाएं</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 📜 Classic Editorial Stream */
        <div className="space-y-5">
          {filteredPosts.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-4xl">🪶</span>
              <h4 className="text-base font-bold font-rozha text-slate-800 dark:text-slate-200">
                इस विधा में अभी रचनाएँ उपलब्ध नहीं हैं
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-serif">
                आप इस विधा के प्रथम रचयिता बनें और अपनी नई रचना प्रकाशित करें!
              </p>
              {onOpenCreatePost && (
                <button
                  onClick={() => {
                    if (requireAuth && !requireAuth()) return;
                    onOpenCreatePost();
                  }}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-xs shadow transition active:scale-95 cursor-pointer"
                >
                  + प्रथम रचना लिखें
                </button>
              )}
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onOpenCertificate={onOpenCertificate} 
                onEditPost={onEditPost}
                onDeletePost={onDeletePost}
                onOpenAuthorProfile={onOpenAuthorProfile}
                onLikePost={onLikePost}
                onAddComment={onAddComment}
                onFollowAuthor={onFollowAuthor}
                requireAuth={requireAuth}
                userProfile={userProfile}
                authorProfileMap={authorProfileMap}
                onDeductPoints={onYouTubeVisit}
              />
            ))
          )}
        </div>
      )}

      {/* 🚀 9. Floating Sticky Quick Action Pill (Mobile & Desktop UX) */}
      <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 bg-slate-950/90 backdrop-blur-xl border-2 border-amber-500/50 p-1.5 sm:p-2 rounded-full shadow-2xl flex items-center gap-2 text-white">
        <button
          onClick={() => {
            if (requireAuth && !requireAuth()) return;
            if (onOpenCreatePost) onOpenCreatePost();
          }}
          className="px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black rounded-full text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
        >
          <Feather className="w-4 h-4" />
          <span>+ रचना लिखें</span>
        </button>

        <button
          onClick={() => setActiveView && setActiveView('posterStudio')}
          className="px-3 py-2 bg-purple-900/80 hover:bg-purple-800 text-purple-200 font-bold rounded-full text-xs flex items-center gap-1 transition active:scale-95 cursor-pointer"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">पोस्टर Studio</span>
        </button>

        <button
          onClick={() => setActiveView && setActiveView('battles')}
          className="px-3 py-2 bg-orange-950/80 hover:bg-orange-900 text-orange-200 font-bold rounded-full text-xs flex items-center gap-1 transition active:scale-95 cursor-pointer"
        >
          <Swords className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">काव्य दंगल</span>
        </button>
      </div>

    </div>
  );
};

export default HomeFeedView;
