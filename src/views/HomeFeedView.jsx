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
  onOpenBirthdayCard,
  userProfile,
  patrioticBanner,
  requireAuth
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const bannerData = patrioticBanner || {
    tag: '79वाँ स्वतंत्रता दिवस & रक्षाबंधन विशेषांक 🇮🇳',
    title: 'समस्त देशवासियों को 79वें स्वतंत्रता दिवस की हार्दिक शुभकामनाएँ!',
    description: 'स्वतंत्रता दिवस एवं रक्षाबंधन के पावन अवसर पर अपनी देशभक्ति व भ्रातृ-स्नेह रचनाएँ साझा करें।',
    bgImage: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&q=80&w=800'
  };

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(p => p.category === selectedCategory);

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
              <span>{bannerData.tag || 'त्योहार विशेषांक 🇮🇳'}</span>
            </div>
            <h3 className="text-lg font-bold font-rozha text-white leading-tight">
              {bannerData.title}
            </h3>
            <p className="text-xs text-orange-100 font-tiro leading-relaxed">
              {bannerData.description}
            </p>
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
          setActiveView={setActiveView}
          requireAuth={requireAuth}
        />
      )}

      {/* 2. Poetry Battle Arena Preview */}
      {poetryBattle && (
        <PoetryBattle battle={poetryBattle} requireAuth={requireAuth} />
      )}

      {/* 3. Categories Horizontal Filter Navigation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            सभी रचनाएँ (All)
          </button>

          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/20 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.hi} ({cat.en})
            </button>
          ))}
        </div>
      </div>

      {/* 4. Main Posts Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>नवीनतम एवं ट्रेंडिंग रचनाएँ</span>
          </h3>
          <span className="text-xs text-slate-500">
            {filteredPosts.length} रचनाएँ पाई गईं
          </span>
        </div>

        {filteredPosts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            onOpenCertificate={onOpenCertificate} 
            onEditPost={onEditPost}
            onDeletePost={onDeletePost}
            requireAuth={requireAuth}
          />
        ))}
      </div>

    </div>
  );
};

export default HomeFeedView;
