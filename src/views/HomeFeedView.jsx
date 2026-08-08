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
  activeFestivalTheme
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const publicActivePosts = posts.filter(p => !p.isArchived);

  const filteredPosts = selectedCategory === 'all' 
    ? publicActivePosts 
    : publicActivePosts.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-6">

      {/* 🇮🇳 15 AUGUST PATRIOTIC SPECIAL HERO BANNER (Controlled by Admin Theme Engine) */}
      {activeFestivalTheme?.id === 'independenceDay' && (
        <div className="space-y-4">
          <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-600 text-white shadow-xl relative overflow-hidden flex items-center justify-between flex-wrap gap-4">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-1.5 max-w-xl z-10">
              <p className="text-xs font-bold text-amber-100 tracking-wide">
                स्वतंत्रता दिवस की हार्दिक शुभकामनाएँ!
              </p>
              <h1 className="text-2xl sm:text-3xl font-black font-rozha text-white drop-shadow">
                15 अगस्त स्वतंत्रता दिवस
              </h1>
              <p className="text-xs font-bold text-amber-100 flex items-center gap-2">
                <span>स्वतंत्रता</span> • <span>समर्पण</span> • <span>स्वाभिमान</span>
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setActiveView && setActiveView('festival')}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-full text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition"
                >
                  <span>15 अगस्त विशेषांक देखें</span>
                  <span>➔</span>
                </button>
              </div>
            </div>

            <div className="z-10 text-4xl sm:text-5xl">
              🇮🇳
            </div>
          </div>
        </div>
      )}

      {/* 📸 New Feature: Poet Image Poster Studio Banner */}
      <div 
        onClick={() => {
          if (setActiveView) {
            setActiveView('posterStudio');
          } else {
            window.location.href = '/studio';
          }
        }}
        className="p-5 rounded-3xl bg-gradient-to-r from-purple-950 via-purple-900 to-slate-900 border-2 border-purple-500/40 text-white shadow-xl flex items-center justify-between flex-wrap gap-4 relative overflow-hidden cursor-pointer hover:border-amber-400/60 hover:shadow-2xl transition group"
      >
        <div className="space-y-1.5 z-10 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-rose-950 font-extrabold text-[10px] uppercase shadow">
              ✨ नया ख़ास फ़ीचर
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-rozha text-purple-200 group-hover:text-amber-300 transition">
            कवि इमेज़ पोस्टर Studio — अपनी कविता + इमेज़ से सुंदर पोस्टर बनाएँ!
          </h3>
          <p className="text-xs text-purple-200 font-tiro">
            अपनी कविता को अपनी फोटो या इमेज़ के साथ सुंदर पोस्टर में बदलें और सीधे शेयर या मंच पर पोस्ट करें!
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (setActiveView) {
              setActiveView('posterStudio');
            } else {
              window.location.href = '/studio';
            }
          }}
          className="z-10 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-lg active:scale-95 transition"
        >
          <Sparkles className="w-4 h-4 text-rose-950" />
          <span>🎨 कवि पोस्टर Studio खोलें</span>
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
