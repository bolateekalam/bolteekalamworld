import React, { useState } from 'react';
import { Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
  requireAuth
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const publicActivePosts = posts.filter(p => !p.isArchived);

  const filteredPosts = selectedCategory === 'all' 
    ? publicActivePosts 
    : publicActivePosts.filter(p => p.category === selectedCategory);

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
          onClick={onOpenMembershipCard}
          className="z-10 px-5 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-extrabold rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-xl active:scale-95 transition"
        >
          <Award className="w-4 h-4" />
          <span>🪪 6-माह सदस्यता पत्र देखें (PNG)</span>
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
