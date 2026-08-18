import React, { useState } from 'react';
import { Award, ShieldCheck, CheckCircle2, Sparkles, Image as ImageIcon, Flame, Feather, Flag, ArrowRight } from 'lucide-react';
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

      {/* 🇮🇳 15th August Independence Day Patriotic Special Banner (100% Fail-Safe Gradient) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-rose-900 to-emerald-800 text-white shadow-2xl p-6 border border-amber-400/30">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-extrabold shadow-md">
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              <span>राष्ट्रीय डिजिटल साहित्यिक मंच ✍️</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-rozha text-amber-100 leading-tight">
              बोलती कलम में आपका स्वागत है!
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-tiro">
              अपनी कविताएँ, ग़ज़लें, विचार साझा करें, दैनिक काव्य चुनौतियों में भाग लें और सुंदर कवि पोस्टर डिज़ाइन करें।
            </p>
          </div>

          <button
            onClick={() => setActiveView && setActiveView('posterStudio')}
            className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-xl flex items-center gap-2 transition transform active:scale-95 shrink-0 cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-slate-950" />
            <span>साहित्यिक पोस्टर बनाएं</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 📸 Poet Digital Poster Maker Banner */}
      <div 
        onClick={() => setActiveView && setActiveView('posterStudio')}
        className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-rose-900 text-white shadow-xl flex items-center justify-between gap-4 cursor-pointer hover:opacity-95 transition group border border-purple-500/20"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white font-extrabold text-[10px] uppercase tracking-wider shadow">
              POSTER STUDIO
            </span>
            <span className="text-xs font-bold text-purple-200">डिजिटल कवि पोस्टर मेकर</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold font-rozha text-purple-100 group-hover:underline">
            📸 अपनी कविता को सुंदर फोटो पोस्टर में बदलकर शेयर करें
          </h3>
          <p className="text-[11px] text-purple-200 hidden sm:block">
            फोटो स्टूडियो कैनवास का उपयोग करें और अपनी रचना का 1-क्लिक शेयर पोस्टर कार्ड बनाएं।
          </p>
        </div>

        <button className="px-4 py-2 bg-white text-purple-950 rounded-2xl text-xs font-extrabold shadow-md hover:bg-purple-100 transition shrink-0 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-purple-700" />
          <span>पोस्टर स्टूडियो खोलें →</span>
        </button>
      </div>

      {/* 🎖️ 6-Month Literary Membership Card Quick Access Banner */}
      <div 
        onClick={() => onOpenMembershipCard && onOpenMembershipCard()}
        className="p-4 rounded-3xl bg-gradient-to-r from-amber-500 via-rose-700 to-amber-600 text-white shadow-xl flex items-center justify-between gap-4 cursor-pointer hover:brightness-105 transition border border-amber-300/40"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-white text-rose-900 font-black text-[10px] uppercase shadow">
              6-माह डिजिटल कार्ड
            </span>
            <span className="text-xs font-extrabold text-amber-100">राष्ट्रीय सदस्यता प्रमाणपत्र</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold font-rozha text-amber-50">
            🎖️ अपना 6-माह सदस्यता पत्र देखें व व्हाट्सएप पर शेयर करें
          </h3>
          <p className="text-[11px] text-amber-100 hidden sm:block">
            प्रमाणित सदस्य संख्या, 6 माह की वैधता तिथि व आधिकारिक डिजिटल पहचान पत्र डाउनलोड करें।
          </p>
        </div>
        <button className="px-3.5 py-2 bg-white text-rose-950 rounded-2xl text-xs font-black shadow hover:bg-amber-50 transition shrink-0 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>कार्ड देखें →</span>
        </button>
      </div>

      {/* 🔴 Boltee Kalam YouTube Official Showcase Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-red-700 via-rose-900 to-red-800 text-white shadow-xl flex items-center justify-between gap-4 border border-red-500/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-white text-red-700 font-black text-[10px] uppercase tracking-wider shadow flex items-center gap-1">
              <span>🔴 YOUTUBE MANCH</span>
            </span>
            <span className="text-xs font-bold text-red-200">+100 Pts Bonus</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold font-rozha text-white">
            बोलती कलम YouTube चैनल से जुड़ें एवं काव्य पाठ का आनंद लें
          </h3>
          <p className="text-[11px] text-red-100 hidden sm:block">
            हमारे आधिकारिक यूट्यूब चैनल @bolateekalam को सब्सक्राइब करें और पाएं 100 रिवॉर्ड पॉइंट्स।
          </p>
        </div>
        <a
          href="https://www.youtube.com/@bolateekalam"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-white text-red-700 hover:bg-red-50 font-black rounded-2xl text-xs shadow-md transition shrink-0 flex items-center gap-1.5"
        >
          <span>🔴 Subscribe (+100 Pts)</span>
        </a>
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
          सभी रचनाएँ ({publicActivePosts.length})
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
            onLikePost={onLikePost}
            onAddComment={onAddComment}
            onFollowAuthor={onFollowAuthor}
            requireAuth={requireAuth}
          />
        ))}
      </div>

    </div>
  );
};

export default HomeFeedView;
