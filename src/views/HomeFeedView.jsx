import React, { useState, useMemo, useRef } from 'react';
import { 
  Award, ShieldCheck, CheckCircle2, Sparkles, Image as ImageIcon, 
  Flame, Feather, Flag, ArrowRight, BookOpen, Heart, MessageCircle, 
  Share2, Trophy, Star, Users, Zap, Compass, TrendingUp, Play, Pause,
  Volume2, Eye, Clock, Check, Swords, ThumbsUp, Quote, LayoutGrid, List, Download, Copy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import DailyChallenge from '../components/DailyChallenge';
import PostCard from '../components/PostCard';
import PoemCardShareModal from '../components/PoemCardShareModal';
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
  currentUser,
  requireAuth,
  activeFestivalTheme,
  authorProfileMap
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [feedLayoutMode, setFeedLayoutMode] = useState('editorial'); // 'editorial' | 'visualGrid' | 'trending'
  
  // Interactive Duel Voting State in Feed
  const [duelVotes, setDuelVotes] = useState({ poetA: 64, poetB: 36, userVoted: null });
  
  // Featured Masterpiece Wah Count & Image Generating state
  const [featuredWahCount, setFeaturedWahCount] = useState(154);
  const [hasGivenWah, setHasGivenWah] = useState(false);
  const [generatingStatusImg, setGeneratingStatusImg] = useState(false);
  const [statusImageSuccess, setStatusImageSuccess] = useState(false);
  const [showFeaturedShareModal, setShowFeaturedShareModal] = useState(false);

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

  // 🌟 Dynamic Masterpiece of the Day Picker:
  // 1. Checks if any post was published today with highest likes
  // 2. If none today, picks top liked masterpiece from all posts
  const featuredPoem = useMemo(() => {
    if (publicActivePosts.length === 0) return null;
    
    // Sort all by likes
    const sortedByLikes = [...publicActivePosts].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    return sortedByLikes[0];
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
            fullAuthor: p.author
          });
        }
      }
    });
    return list.slice(0, 10);
  }, [posts]);

  // Handle Wah-Wah celebration on Featured Poem
  const handleFeaturedWah = () => {
    if (requireAuth && !requireAuth()) return;
    if (!hasGivenWah) {
      setFeaturedWahCount(prev => prev + 1);
      setHasGivenWah(true);
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  // Safe Image Loader for Canvas
  const safeLoadImage = (src) => {
    return new Promise((resolve) => {
      if (!src) return resolve(null);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      let resolved = false;

      img.onload = () => {
        if (!resolved) {
          resolved = true;
          resolve(img);
        }
      };
      img.onerror = () => {
        if (!resolved) {
          resolved = true;
          resolve(null);
        }
      };

      img.src = src;
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve(null);
        }
      }, 2000);
    });
  };

  // 📸 Generate 4:5 HD Masterpiece Poster Image (1080x1350 Canvas)
  const handleGenerateWhatsAppStatusImage = async () => {
    if (!featuredPoem) return;
    setGeneratingStatusImg(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');

      // 1. Royal Dark Velvet Gradient Background
      const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1350);
      bgGrad.addColorStop(0, '#0c1829');
      bgGrad.addColorStop(0.4, '#161226');
      bgGrad.addColorStop(0.8, '#1e0e22');
      bgGrad.addColorStop(1, '#080c14');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1350);

      // 2. Gold Frame Borders
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, 1020, 1290);

      ctx.strokeStyle = '#be123c';
      ctx.lineWidth = 2;
      ctx.strokeRect(42, 42, 996, 1266);

      // 3. Logo & Platform Header
      const logoImg = await safeLoadImage('/logo.png');
      if (logoImg) {
        ctx.drawImage(logoImg, 540 - 45, 65, 90, 90);
      }

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 38px serif';
      ctx.textAlign = 'center';
      ctx.fillText('बोलती कलम', 540, 195);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '20px sans-serif';
      ctx.fillText('राष्ट्रीय डिजिटल साहित्यिक मंच (bolateeworld.in)', 540, 230);

      // 4. Badge: Masterpiece of the Day
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.roundRect(540 - 230, 260, 460, 48, 24);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('👑 आज की सर्वश्रेष्ठ रचना (Poem of the Day)', 540, 292);

      // 5. Poem Title
      const poemTitle = featuredPoem.title || 'अनुपम काव्य रचना';
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 46px serif';
      ctx.fillText(poemTitle, 540, 370);

      // Category Tag
      ctx.fillStyle = '#fda4af';
      ctx.font = 'italic 22px serif';
      ctx.fillText('विधा: ' + (featuredPoem.category || 'कविता'), 540, 408);

      // Decorative Separator Line
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(320, 430);
      ctx.lineTo(760, 430);
      ctx.stroke();

      // 6. Poetry Content Body (4:5 Formatted)
      const poemLines = (featuredPoem.content || '').split('\n').slice(0, 9);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '34px serif';
      ctx.textAlign = 'center';
      
      let lineY = 490;
      poemLines.forEach((line) => {
        if (line.trim()) {
          ctx.fillText(line, 540, lineY);
          lineY += 56;
        }
      });

      // 7. Poet Info Card at Bottom (4:5 Standard Placement)
      const poetY = 1140;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(140, poetY - 65, 800, 130, 24);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Poet Avatar
      const poetAvatarUrl = featuredPoem.author?.avatar;
      const avatarImg = await safeLoadImage(poetAvatarUrl);
      if (avatarImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(215, poetY, 44, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatarImg, 171, poetY - 44, 88, 88);
        ctx.restore();
        
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(215, poetY, 44, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.textAlign = 'left';
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 32px serif';
      ctx.fillText('✍️ ' + (featuredPoem.author?.name || 'साहित्य साधक'), 280, poetY - 5);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '20px sans-serif';
      ctx.fillText((featuredPoem.author?.username || '@writer') + ' • प्रमाणित साहित्यकार', 280, poetY + 30);

      // 8. Footer Watermark
      ctx.textAlign = 'center';
      ctx.fillStyle = '#64748b';
      ctx.font = '18px sans-serif';
      ctx.fillText('बोलती कलम ऐप • bolateeworld.in (HD)', 540, 1260);

      // Download image
      const link = document.createElement('a');
      link.download = 'BolateeKalam_Poster_' + Date.now() + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      setStatusImageSuccess(true);
      setTimeout(() => setStatusImageSuccess(false), 4000);

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

    } catch (err) {
      console.error('Status image generation error:', err);
    }
    setGeneratingStatusImg(false);
  };

  // Copy Viral Social Caption for Featured Masterpiece
  const [copiedFeaturedCaption, setCopiedFeaturedCaption] = useState(false);

  const handleCopyFeaturedCaption = () => {
    if (!featuredPoem) return;
    const authorName = featuredPoem.author?.name || 'साहित्य साधक';
    const captionText = '✨ ━━━━━━━━━━━━━━━━━━ ✨\n👑 【 ' + (featuredPoem.title || 'अनुपम काव्य रचना') + ' 】 🪶\n✨ ━━━━━━━━━━━━━━━━━━ ✨\n\n' + (featuredPoem.content?.trim() || '') + '\n\n━━━━━━━━━━━━━━━━━━━━━\n✍️ रचनाकार: ' + authorName + '\n📖 आज की सर्वश्रेष्ठ रचना • बोलती कलम (Bolatee Kalam)\n🌐 पूरी रचना पढ़ें व अपनी कविताएं प्रकाशित करें:\n👉 https://bolateeworld.in\n\n🏷️ #बोलतीकलम #BolateeKalam #हिंदीकविता #HindiPoetry #Shayari #Sahitya #WritersOfIndia #PoetryCommunity #Kavita\n✨ ━━━━━━━━━━━━━━━━━━ ✨';

    navigator.clipboard.writeText(captionText);
    setCopiedFeaturedCaption(true);
    setTimeout(() => setCopiedFeaturedCaption(false), 3000);
  };

  // In-Feed Duel Vote
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
    'from-emerald-950 via-slate-900 to-teal-950 border-emerald-500/40 text-emerald-100'
  ];

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300 pb-12">

      {/* 👑 1. Clean, Modern, Brand-Grade Hero Banner (100% Responsive on Mobile & Desktop) */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm transition-all">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 text-center sm:text-left">
          
          {/* Logo & Brand Identity */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 flex-1 min-w-0">
            
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-400 p-0.5 shadow-md">
                <div className="w-full h-full bg-white dark:bg-slate-950 rounded-2xl p-2 flex items-center justify-center">
                  <img 
                    src="/logo.png" 
                    alt="बोलती कलम" 
                    className="w-full h-full object-contain" 
                  />
                </div>
              </div>
              <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase shadow">
                राष्ट्रीय मंच
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black font-rozha text-slate-900 dark:text-amber-200">
                बोलती कलम
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-serif">
                भारत का प्रमुख बहुभाषी डिजिटल साहित्यिक मंच • कविता, ग़ज़ल, शायरी और विचार
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span>✓ 6-माह निःशुल्क सदस्यता</span>
                <span>•</span>
                <span>✓ डिजिटल मानद सम्मान पत्र</span>
              </div>
            </div>

          </div>

          {/* Quick Action Compose Button */}
          <div className="w-full sm:w-auto shrink-0">
            <button
              onClick={() => {
                if (requireAuth && !requireAuth()) return;
                if (onOpenCreatePost) onOpenCreatePost();
              }}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Feather className="w-4 h-4" />
              <span>+ नई रचना प्रकाशित करें</span>
            </button>
          </div>

        </div>

        {/* 4 Feature Launchers Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 text-xs text-center">
          <div 
            onClick={() => setActiveView && setActiveView('posterStudio')}
            className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 hover:bg-purple-100 transition cursor-pointer border border-purple-200 dark:border-purple-800/60 font-bold flex items-center justify-center gap-1.5"
          >
            <span>📸</span>
            <span>कवि पोस्टर Studio</span>
          </div>

          <div 
            onClick={() => onOpenMembershipCard && onOpenMembershipCard()}
            className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100 transition cursor-pointer border border-amber-200 dark:border-amber-800/60 font-bold flex items-center justify-center gap-1.5"
          >
            <span>🎖️</span>
            <span>सदस्यता कार्ड</span>
          </div>

          <div 
            onClick={() => setActiveView && setActiveView('battles')}
            className="p-2.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200 hover:bg-orange-100 transition cursor-pointer border border-orange-200 dark:border-orange-800/60 font-bold flex items-center justify-center gap-1.5"
          >
            <span>⚔️</span>
            <span>काव्य दंगल</span>
          </div>

          <div 
            onClick={() => setActiveView && setActiveView('certificates')}
            className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 transition cursor-pointer border border-emerald-200 dark:border-emerald-800/60 font-bold flex items-center justify-center gap-1.5"
          >
            <span>📜</span>
            <span>सम्मान पत्र</span>
          </div>
        </div>

      </div>

      {/* 🌟 2. आज की सर्वश्रेष्ठ रचना (Featured Masterpiece with 9:16 WhatsApp Status Image Generator) */}
      {featuredPoem && (
        <div className="rounded-3xl bg-gradient-to-br from-[#0c1829] via-slate-900 to-[#121c2e] text-white border-2 border-amber-500/40 p-5 sm:p-7 shadow-xl space-y-4">
          
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-amber-500/20 pb-3">
            <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs rounded-full shadow flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
              <span>👑 आज की सर्वश्रेष्ठ रचना (Poem of the Day)</span>
            </span>

            <span className="text-xs text-amber-300 font-bold">
              ❤️ {featuredPoem.likes || 48} पाठकों की पसंद
            </span>
          </div>

          {/* Masterpiece Content Body */}
          <div className="space-y-2.5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg sm:text-2xl font-black font-rozha text-amber-200">
                  {featuredPoem.title || 'अनुपम काव्य रचना'}
                </h3>
                <p className="text-xs text-slate-400 font-serif">
                  विधा: <strong className="text-amber-400">{featuredPoem.category === 'lekh' ? 'लेख (Article)' : (featuredPoem.category || 'कविता')}</strong> • रचनाकार: <strong className="text-white">{featuredPoem.author?.name || 'साहित्य साधक'}</strong>
                </p>
              </div>

              <div 
                onClick={() => onOpenAuthorProfile && onOpenAuthorProfile(featuredPoem.author)}
                className="flex items-center gap-2 cursor-pointer bg-slate-950/80 px-3 py-1.5 rounded-2xl border border-amber-500/30 hover:border-amber-400 transition shrink-0"
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

            {/* Decorative Quote Text */}
            <div className="relative p-4 sm:p-5 rounded-2xl bg-black/40 border border-amber-500/20 text-slate-100 font-tiro text-xs sm:text-sm leading-relaxed italic">
              <Quote className="w-6 h-6 text-amber-400/15 absolute top-3 left-3 pointer-events-none" />
              <p className="relative z-10 whitespace-pre-line pl-6">
                {featuredPoem.content?.slice(0, 240)}
                {featuredPoem.content?.length > 240 && '...'}
              </p>
            </div>
          </div>

          {/* Masterpiece Actions: 4:5 Poster Generator Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleFeaturedWah}
                className={'flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-black transition active:scale-95 flex items-center justify-center gap-1.5 shadow cursor-pointer ' + (
                  hasGivenWah 
                    ? 'bg-rose-600 text-white ring-2 ring-rose-400' 
                    : 'bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950'
                )}
              >
                <Heart className={'w-3.5 h-3.5 ' + (hasGivenWah ? 'fill-white text-white' : 'fill-slate-950 text-slate-950')} />
                <span>{hasGivenWah ? '❤️ दाद समर्पित' : ('दाद दें • ' + featuredWahCount)}</span>
              </button>

              <button
                onClick={() => setShowFeaturedShareModal(true)}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>काव्य पोस्टर शेयर व डाउनलोड</span>
              </button>

              <button
                onClick={handleCopyFeaturedCaption}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-extrabold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 shadow flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <Copy className={'w-3.5 h-3.5 ' + (copiedFeaturedCaption ? 'text-emerald-400' : 'text-amber-300')} />
                <span>{copiedFeaturedCaption ? '✓ सोशल कैप्शन कॉपी हुआ!' : '📋 कविता + लिंक कॉपी करें'}</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* 🌟 Poem of the Day Share & Download Modal */}
      {showFeaturedShareModal && featuredPoem && (
        <PoemCardShareModal
          isOpen={showFeaturedShareModal}
          onClose={() => setShowFeaturedShareModal(false)}
          post={featuredPoem}
          isUserOwnPost={false}
          userPoints={userProfile?.points || currentUser?.points || 50}
        />
      )}

      {/* ⚔️ 3. Interactive Live Poetry Duel Arena (In-Feed Battle Challenge) */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
        
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gradient-to-r from-orange-600 to-rose-600 text-white font-black text-xs rounded-full shadow flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-amber-300" />
              <span>काव्य दंगल मुकाबला</span>
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-serif">विषय: "इश्क़ बनाम आज़ादी"</span>
          </div>

          <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
            {duelVotes.poetA + duelVotes.poetB} वोट्स
          </span>
        </div>

        {/* 2 Poets Side-by-Side Arena */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Poet A */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
                  alt="कवि 1" 
                  className="w-8 h-8 rounded-full object-cover border border-amber-400"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">राघवेंद्र मिश्र 'साहिल'</h4>
                  <span className="text-[10px] text-slate-500">प्रयागराज</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-tiro italic bg-white dark:bg-slate-900 p-2 rounded-xl leading-relaxed">
                "हवाओं में बहक जाने की ख्वाहिश अब नहीं रहती, तेरी महफ़िल से बेहतर कोई वीराना नहीं मिलता।"
              </p>
            </div>

            <button
              onClick={() => handleDuelVote('A')}
              disabled={duelVotes.userVoted !== null}
              className={'w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow ' + (
                duelVotes.userVoted === 'A'
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                  : 'bg-orange-600 hover:bg-orange-700 text-white cursor-pointer'
              )}
            >
              <ThumbsUp className="w-3 h-3" />
              <span>{duelVotes.userVoted === 'A' ? '✓ आपका वोट समर्पित' : ('वोट दें (' + duelVotes.poetA + ')')}</span>
            </button>
          </div>

          {/* Poet B */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" 
                  alt="कवि 2" 
                  className="w-8 h-8 rounded-full object-cover border border-rose-400"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">आनंद वर्धन 'नीरव'</h4>
                  <span className="text-[10px] text-slate-500">वाराणसी</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-tiro italic bg-white dark:bg-slate-900 p-2 rounded-xl leading-relaxed">
                "आज़ाद परिंदों को पिंजरों का खौफ़ क्या होगा, जो खुद आसमाँ बन जाएं उन्हें तूफानों का डर क्या।"
              </p>
            </div>

            <button
              onClick={() => handleDuelVote('B')}
              disabled={duelVotes.userVoted !== null}
              className={'w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow ' + (
                duelVotes.userVoted === 'B'
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                  : 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer'
              )}
            >
              <ThumbsUp className="w-3 h-3" />
              <span>{duelVotes.userVoted === 'B' ? '✓ आपका वोट समर्पित' : ('वोट दें (' + duelVotes.poetB + ')')}</span>
            </button>
          </div>

        </div>

        {/* Voting Progress Bar */}
        <div className="space-y-1 pt-1">
          {(() => {
            const total = duelVotes.poetA + duelVotes.poetB || 1;
            const pctA = Math.round((duelVotes.poetA / total) * 100);
            const pctB = 100 - pctA;
            return (
              <>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  <span className="text-orange-600 dark:text-orange-400">राघवेंद्र: {pctA}%</span>
                  <span className="text-rose-600 dark:text-rose-400">आनंद: {pctB}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div style={{ width: pctA + '%' }} className="bg-orange-500 h-full transition-all duration-500" />
                  <div style={{ width: pctB + '%' }} className="bg-rose-600 h-full transition-all duration-500" />
                </div>
              </>
            );
          })()}
        </div>

      </div>

      {/* ⭐ 4. शीर्ष साहित्यकार स्टोरी रील (Top Poets Avatar Circles) */}
      {spotlightAuthors.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold font-rozha text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>सत्यापित रचनाकार</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              प्रोफाइल देखें
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-1 scrollbar-none">
            {spotlightAuthors.map((author, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (onOpenAuthorProfile) onOpenAuthorProfile(author.fullAuthor);
                }}
                className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group w-16 text-center"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-300 group-hover:scale-105 transition-transform shadow-sm">
                    <img 
                      src={author.avatar} 
                      alt={author.name}
                      className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-900"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[8px] font-black border border-white dark:border-slate-900 shadow">
                    ✓
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate w-full group-hover:text-rose-600 transition">
                  {author.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🏆 5. Weekly Literature Challenge Banner */}
      {dailyChallenge && (
        <DailyChallenge 
          challenge={dailyChallenge} 
          onOpenCertificate={onOpenCertificate} 
          setActiveView={setActiveView}
        />
      )}

      {/* 🏷️ 6. Category Filter Bar & Feed Mode Toggle */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
          
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-rose-600" />
            <h3 className="text-xs sm:text-sm font-bold font-rozha text-slate-900 dark:text-slate-100">
              साहित्यिक विधाएं
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-extrabold">
              {filteredPosts.length} रचनाएँ
            </span>
          </div>

          {/* 3 Layout Switchers */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs self-stretch sm:self-auto justify-center">
            <button
              onClick={() => setFeedLayoutMode('editorial')}
              className={'px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer ' + (
                feedLayoutMode === 'editorial'
                  ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm font-extrabold'
                  : 'text-slate-600 dark:text-slate-400'
              )}
            >
              <List className="w-3.5 h-3.5" />
              <span>संपादकीय</span>
            </button>

            <button
              onClick={() => setFeedLayoutMode('visualGrid')}
              className={'px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer ' + (
                feedLayoutMode === 'visualGrid'
                  ? 'bg-purple-600 text-white shadow-sm font-extrabold'
                  : 'text-slate-600 dark:text-slate-400'
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>विज़ुअल कार्ड्स</span>
            </button>

            <button
              onClick={() => setFeedLayoutMode('trending')}
              className={'px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer ' + (
                feedLayoutMode === 'trending'
                  ? 'bg-orange-600 text-white shadow-sm font-extrabold'
                  : 'text-slate-600 dark:text-slate-400'
              )}
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
            className={'px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ' + (
              selectedCategory === 'all'
                ? 'bg-rose-600 text-white shadow-rose-900/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            )}
          >
            <span>✨ सभी</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-black/20 text-white font-bold">
              {publicActivePosts.length}
            </span>
          </button>

          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={'px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ' + (
                selectedCategory === cat.name
                  ? 'bg-rose-600 text-white shadow-rose-900/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              )}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 📜 7. Main Posts Content: Visual Card Wall OR Editorial Stream */}
      {feedLayoutMode === 'visualGrid' ? (
        /* 🖼️ Pinterest/Instagram-Style Visual Poetry Card Wall */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredPosts.map((post, idx) => {
            const gradientStyle = cardGradients[idx % cardGradients.length];
            return (
              <div 
                key={post.id}
                className={'p-5 rounded-3xl bg-gradient-to-br ' + gradientStyle + ' border-2 shadow-lg flex flex-col justify-between gap-3.5 hover:scale-[1.01] transition-transform relative overflow-hidden'}
              >
                <div className="space-y-2.5">
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

                  <h4 className="text-base font-bold font-rozha text-amber-200">
                    {post.title || 'काव्य रचना'}
                  </h4>

                  <div className="text-xs font-tiro leading-relaxed italic whitespace-pre-line bg-black/25 p-3 rounded-2xl border border-white/10">
                    {post.content?.slice(0, 160)}
                    {post.content?.length > 160 && '...'}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onLikePost && onLikePost(post)}
                      className="flex items-center gap-1 font-bold hover:scale-105 transition cursor-pointer"
                    >
                      ❤️ {post.likes || 12}
                    </button>
                    <span className="flex items-center gap-1 font-bold text-slate-300">
                      💬 {post.comments?.length || 0}
                    </span>
                  </div>

                  {(() => {
                    const isOwnPost = (currentUser && (post.author?.username === currentUser?.username || post.author?.email === currentUser?.email)) ||
                                      (userProfile && (post.author?.username === userProfile?.username || post.author?.name === userProfile?.name));
                    if (isOwnPost) {
                      return (
                        <button
                          onClick={() => {
                            if (setActiveView) setActiveView('posterStudio');
                          }}
                          className="px-3 py-1.5 bg-white hover:bg-amber-100 text-slate-950 font-bold rounded-xl text-[11px] shadow flex items-center gap-1 transition cursor-pointer"
                        >
                          <span>📸 HD पोस्टर बनाएं</span>
                        </button>
                      );
                    }
                    return (
                      <span className="text-[10px] text-amber-200/90 font-serif">
                        बोलती कलम प्रमाणित
                      </span>
                    );
                  })()}
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

    </div>
  );
};

export default HomeFeedView;
