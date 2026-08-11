import React, { useState } from 'react';
import { Award, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import DailyChallenge from '../components/DailyChallenge';
import PostCard from '../components/PostCard';
import { mockCategories } from '../data/mockPosts';

export const HomeFeedView = ({ 
  posts = [], 
  dailyChallenge, 
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
  userProfile,
  requireAuth,
  activeFestivalTheme,
  authorProfileMap
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const publicActivePosts = posts.filter(p => !p.isArchived);

  const filteredPosts = selectedCategory === 'all' 
    ? publicActivePosts 
    : publicActivePosts.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-6">

      {/* 📸 New Feature: Poet Image Poster Studio Banner */}
      <div 
        onClick={() => setActiveView && setActiveView('canvas')}
        className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-600 via-rose-600 to-purple-700 text-white shadow-xl flex items-center justify-between gap-4 cursor-pointer hover:opacity-95 transition group"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider">
              NEW FEATURE
            </span>
            <span className="text-xs font-bold text-amber-200">डिजिटल कवि पोस्टर मेकर</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold font-rozha text-amber-100 group-hover:underline">
            📸 अपनी कविता को सुंदर फोटो पोस्टर में बदलकर शेयर करें
          </h3>
          <p className="text-[11px] text-rose-100 hidden sm:block">
            फोटो स्टूडियो कैनवास का उपयोग करें और अपनी रचना का 1-क्लिक शेयर कार्ड बनाएं।
          </p>
        </div>

        <button className="px-4 py-2 bg-white text-rose-900 rounded-2xl text-xs font-extrabold shadow-md hover:bg-amber-100 transition shrink-0">
          पोस्टर बनाएं →
        </button>
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
            onAddComment={onAddComment}
            onFollowAuthor={onFollowAuthor}
            userProfile={userProfile}
            requireAuth={requireAuth}
          />
        ))}
      </div>

    </div>
  );
};

export default HomeFeedView;
