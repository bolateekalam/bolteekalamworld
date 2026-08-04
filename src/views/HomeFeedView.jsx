import React, { useState } from 'react';
import { Sparkles, Flame, Swords, Filter, Cake, Heart, Sun, Feather, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import DailyChallenge from '../components/DailyChallenge';
import PoetryBattle from '../components/PoetryBattle';
import PostCard from '../components/PostCard';
import PanchangWidget from '../components/PanchangWidget';
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
  onOpenBirthdayCard,
  userProfile,
  patrioticBanner,
  requireAuth
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const todayFormattedDate = new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const bannerData = patrioticBanner || {
    tag: '80वाँ स्वतंत्रता दिवस & रक्षाबंधन विशेषांक 🇮🇳',
    title: 'समस्त देशवासियों को 80वें स्वतंत्रता दिवस की हार्दिक शुभकामनाएँ!',
    description: '80वें स्वतंत्रता दिवस एवं रक्षाबंधन के पावन अवसर पर अपनी देशभक्ति व भ्रातृ-स्नेह रचनाएँ साझा करें।',
    bgImage: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&q=80&w=800'
  };

  const publicActivePosts = posts.filter(p => !p.isArchived);

  const filteredPosts = selectedCategory === 'all' 
    ? publicActivePosts 
    : publicActivePosts.filter(p => p.category === selectedCategory);

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
              <span>{bannerData.tag || '80वाँ स्वतंत्रता दिवस विशेषांक 🇮🇳'}</span>
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

      {/* 1. Weekly Literature Challenge Banner */}
      {dailyChallenge && (
        <DailyChallenge 
          challenge={dailyChallenge} 
          onOpenCertificate={onOpenCertificate} 
        />
      )}

      {/* 2. Category Chips Filter Bar */}
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

      {/* 3. Main Posts Stream */}
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

    </div>
  );
};

export default HomeFeedView;
