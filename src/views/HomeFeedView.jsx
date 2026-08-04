import React, { useState } from 'react';
import { Sparkles, Flame, Swords, Filter, Heart, Sun, Feather, Calendar, Award, Mic, Volume2, ShieldCheck, Play, UserCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import DailyChallenge from '../components/DailyChallenge';
import PoetryBattle from '../components/PoetryBattle';
import PostCard from '../components/PostCard';
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
  requireAuth
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState(null);

  const featuredWriters = [
    { name: 'संजय राय (संस्थापक)', username: '@sanjayrai', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', city: 'प्रयागराज' },
    { name: 'काजल गुप्ता', username: '@kajal', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', city: 'लखनऊ' },
    { name: 'आकाश कुमार सिंह (डिजिटल प्रमुख)', username: '@akash_cofounder', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', city: 'नई दिल्ली' }
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
      
      {/* 🌟 Top Hero: 6-Month Free Digital Literary Membership Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-950 via-rose-900 to-slate-950 border-2 border-amber-400/40 text-white shadow-2xl flex items-center justify-between flex-wrap gap-5 relative overflow-hidden">
        
        {/* Background Accent */}
        <div className="absolute -right-6 -top-6 opacity-10 text-amber-400 pointer-events-none">
          <Award className="w-56 h-56" />
        </div>

        <div className="space-y-2 max-w-xl z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-[10px] border border-amber-400/40 uppercase tracking-wider">
              bolateeworld.in • 6-माह नि:शुल्क सदस्यता
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-rozha text-amber-300 leading-tight">
            बोलती कलम — 6-माह नि:शुल्क डिजिटल साहित्यिक सदस्यता पत्र
          </h2>

          <p className="text-xs sm:text-sm text-rose-200 font-tiro leading-relaxed">
            बोलती कलम (bolateeworld.in) पर आज ही अपना 6-माह नि:शुल्क राष्ट्रीय साहित्यिक सदस्यता पत्र जनरेट करें, HD PNG इमेज डाउनलोड करें और WhatsApp स्टेटस पर शेयर करें!
          </p>

          <div className="flex items-center gap-4 text-xs font-bold text-emerald-400 pt-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>प्रथम 6 माह 100% नि:शुल्क</span>
            </span>
            <span className="flex items-center gap-1 text-amber-300">
              <ShieldCheck className="w-4 h-4" />
              <span>डिजिटल प्रमाणित</span>
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowMembershipModal(true)}
          className="z-10 px-5 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-extrabold rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-xl active:scale-95 transition"
        >
          <Award className="w-4 h-4" />
          <span>🪪 6-माह सदस्यता पत्र देखें (PNG)</span>
        </button>
      </div>

      {/* Writers of the Day Spotlight */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-rose-600" />
            <span>🏆 आज के प्रमुख साहित्य साधक (Writers of the Day)</span>
          </h3>
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
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{w.name}</h4>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold block">{w.username}</span>
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
            <h3 className="text-xs font-bold text-white">🎙️ दैनिक ओपन माइक व काव्य पाठ (Voice Recitations)</h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold">लाइव ऑडियो</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {audioRecitations.map((rec) => (
            <div key={rec.id} className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-rose-200">{rec.title}</h4>
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
