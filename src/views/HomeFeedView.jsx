import React, { useState } from 'react';
import { Sparkles, Flame, Swords, Filter, Heart, Sun, Feather, Calendar, Award, Mic, Volume2, ShieldCheck, Play, UserCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import DailyChallenge from '../components/DailyChallenge';
import PoetryBattle from '../components/PoetryBattle';
import PostCard from '../components/PostCard';
import PanchangWidget from '../components/PanchangWidget';
import LiteraryMembershipCardModal from '../components/LiteraryMembershipCardModal';
import { mockCategories } from '../data/mockPosts';

export const HomeFeedView = ({ 
  posts = [], 
  dailyChallenge, 
  poetryBattle, 
  onOpenCertificate,
  setActiveView,
  onEditPost,
  onDeletePost,
  onOpenAuthorProfile,
  onOpenPoetryChallenge,
  onLikePost,
  userProfile,
  patrioticBanner,
  requireAuth
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState(null);

  const todayFormattedDate = new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const bannerData = patrioticBanner || {
    tag: '80वाँ स्वतंत्रता दिवस & रक्षाबंधन विशेषांक 🇮🇳',
    title: 'समस्त देशवासियों को 80वें स्वतंत्रता दिवस की हार्दिक शुभकामनाएँ!',
    description: 'बोलती वर्ल्ड (bolateeworld.in) पर 80वें स्वतंत्रता दिवस एवं रक्षाबंधन के पावन अवसर पर अपनी देशभक्ति व भ्रातृ-स्नेह रचनाएँ साझा करें।',
    bgImage: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&q=80&w=800'
  };

  const featuredWriters = [
    { name: 'संजय राय (संस्थापक)', username: '@sanjayrai', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', city: 'प्रयागराज' },
    { name: 'काजल गुप्ता', username: '@kajal', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', city: 'लखनऊ' },
    { name: 'आकाश कुमार सिंह', username: '@akash_cofounder', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', city: 'नई दिल्ली' }
  ];

  const audioRecitations = [
    { id: 'rec-1', title: 'सावन की शाम और यादें', author: 'संजय राय', duration: '1:45', voice: 'काव्य पाठ' },
    { id: 'rec-2', title: 'देशभक्ति की अखंड ज्वाला', author: 'आकाश कुमार सिंह', duration: '2:10', voice: 'ओपन माइक पाठ' }
  ];

  const publicActivePosts = posts.filter(p => !p.isArchived);

  const filteredPosts = selectedCategory === 'all' 
    ? publicActivePosts 
    : publicActivePosts.filter(p => p.category === selectedCategory);

  const toggleAudioPlay = (id) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 50-50 Split Top Grid: Festive Banner & Authentic Panchang Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left 50%: Dynamic Festive Banner */}
        <div 
          className="p-5 rounded-3xl text-white shadow-xl flex flex-col justify-between border border-orange-500/40 min-h-[220px] relative overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(to right, rgba(154, 46, 12, 0.92), rgba(159, 18, 57, 0.88), rgba(4, 120, 87, 0.88)), url("${bannerData.bgImage || 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&q=80&w=800'}")` }}
        >
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{bannerData.tag || 'बोलती वर्ल्ड विशेषांक 🇮🇳'}</span>
            </div>
            <h3 className="text-lg font-bold font-rozha text-white leading-tight">
              {bannerData.title}
            </h3>
            <p className="text-xs text-orange-100 font-tiro leading-relaxed">
              {bannerData.description}
            </p>
          </div>

          <div className="relative z-10 pt-2 flex items-center justify-between text-[11px] font-bold text-amber-200">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>आज: {todayFormattedDate}</span>
            </span>
          </div>
        </div>

        {/* Right 50%: Authentic Indian Panchang & Upcoming Festivals Widget */}
        <PanchangWidget />

      </div>

      {/* 6-Month Free Literary Membership Banner Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-900 via-rose-950 to-slate-950 border-2 border-amber-400/40 text-white shadow-xl flex items-center justify-between flex-wrap gap-4 relative overflow-hidden">
        <div className="space-y-1.5 max-w-lg z-10">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-[10px] border border-amber-400/40 uppercase tracking-wider">
              bolateeworld.in 6-माह नि:शुल्क सदस्यता
            </span>
          </div>
          <h3 className="text-lg font-bold font-rozha text-amber-300">
            बोलती वर्ल्ड 6-माह राष्ट्रीय साहित्यिक सदस्यता कार्ड
          </h3>
          <p className="text-xs text-rose-200 font-tiro">
            आज ही अपना 6-माह नि:शुल्क सदस्यता कार्ड जनरेट करें, PNG इमेज डाउनलोड करें और WhatsApp स्टेटस पर शेयर करें!
          </p>
        </div>

        <button
          onClick={() => setShowMembershipModal(true)}
          className="z-10 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-2xl text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition"
        >
          <Award className="w-4 h-4" />
          <span>🪪 6-माह कार्ड जनरेट करें (PNG)</span>
        </button>
      </div>

      {/* Writers of the Day Spotlight */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-rose-600" />
            <span>🏆 आज के प्रमुख साहित्य साधक (Writers of the Day)</span>
          </h4>
          <button 
            onClick={() => setActiveView('leaderboard')}
            className="text-[11px] text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-0.5"
          >
            <span>सभी देखें</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {featuredWriters.map((w, idx) => (
            <div 
              key={idx}
              onClick={() => onOpenAuthorProfile({ name: w.name, username: w.username, avatar: w.avatar })}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center gap-3 cursor-pointer hover:border-rose-500 transition"
            >
              <img src={w.avatar} alt={w.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{w.name}</h5>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold block">{w.username}</span>
                <span className="text-[9px] text-slate-400 block">📍 {w.city}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Voice Recitations & Open Mic Audio Section */}
      <div className="p-4 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-rose-400 animate-pulse" />
            <h4 className="text-xs font-bold text-white">🎙️ दैनिक ओपन माइक व काव्य पाठ (Voice Recitations)</h4>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold">लाइव ऑडियो</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {audioRecitations.map((rec) => (
            <div key={rec.id} className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold text-rose-200">{rec.title}</h5>
                <span className="text-[10px] text-slate-400 block">पाठक: {rec.author} ({rec.voice})</span>
              </div>
              <button
                onClick={() => toggleAudioPlay(rec.id)}
                className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition"
              >
                {playingAudioId === rec.id ? <Volume2 className="w-4 h-4 animate-bounce" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Literature Challenge Banner */}
      {dailyChallenge && (
        <DailyChallenge 
          challenge={dailyChallenge} 
          onOpenCertificate={onOpenCertificate} 
        />
      )}

      {/* Category Chips Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-900/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
          }`}
        >
          सभी रचनाएँ ({posts.length})
        </button>

        {mockCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.name
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Main Posts Stream */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            onOpenCertificate={onOpenCertificate} 
            onEditPost={onEditPost}
            onDeletePost={onDeletePost}
            onOpenAuthorProfile={onOpenAuthorProfile}
            onOpenPoetryChallenge={onOpenPoetryChallenge}
            onLikePost={onLikePost}
            requireAuth={requireAuth}
          />
        ))}
      </div>

      {/* 6-Month Free Membership Card Modal */}
      <LiteraryMembershipCardModal
        isOpen={showMembershipModal}
        onClose={() => setShowMembershipModal(false)}
        userProfile={userProfile}
      />

    </div>
  );
};

export default HomeFeedView;
