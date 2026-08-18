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
  onOpenYouTubeTask,
  onYouTubeVisit,
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

      {/* 🇮🇳 Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-rose-900 to-emerald-800 text-white shadow-2xl p-6 border border-amber-400/30">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
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
        </div>
      </div>

      {/* 50-50 Split Grid: Left = Poster Studio (1/2), Right = 6-Month Digital Card (1/2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: 📸 Digital Poet Poster Studio */}
        <div 
          onClick={() => {
            if (requireAuth && !requireAuth()) return;
            if (setActiveView) setActiveView('posterStudio');
          }}
          className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-col justify-between gap-3 cursor-pointer hover:scale-[1.01] transition border border-purple-500/30 group"
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md bg-purple-600 text-white font-extrabold text-[10px] uppercase tracking-wider shadow">
                POSTER STUDIO
              </span>
              <span className="text-xs font-bold text-purple-200">📸 डिजिटल पोस्टर</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold font-rozha text-purple-100 group-hover:text-amber-200 transition">
              कवि फोटो पोस्टर मेकर
            </h3>
            <p className="text-xs text-purple-200/90 leading-relaxed font-tiro">
              अपनी कविता को सुंदर डिजिटल पोस्टर में बदलें और एचडी फोटो डाउनलोड करें।
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button className="px-4 py-2 bg-white hover:bg-purple-50 text-purple-950 rounded-2xl text-xs font-extrabold shadow transition flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-purple-700" />
              <span>पोस्टर बनाएं →</span>
            </button>
          </div>
        </div>

        {/* Right: 🎖️ 6-Month Literary Membership Card */}
        <div 
          onClick={() => {
            if (requireAuth && !requireAuth()) return;
            if (onOpenMembershipCard) onOpenMembershipCard();
          }}
          className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-600 via-rose-800 to-rose-950 text-white shadow-xl flex flex-col justify-between gap-3 cursor-pointer hover:scale-[1.01] transition border border-amber-400/40 group"
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px] uppercase shadow">
                6-माह डिजिटल कार्ड
              </span>
              <span className="text-xs font-extrabold text-amber-200">🎖️ सदस्यता पत्र</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold font-rozha text-amber-50 group-hover:text-amber-300 transition">
              राष्ट्रीय 6-माह डिजिटल सदस्यता प्रमाणपत्र
            </h3>
            <p className="text-xs text-amber-100/90 leading-relaxed font-tiro">
              सदस्यता क्रमांक, 6 माह की वैधता तिथि व आधिकारिक डिजिटल पहचान पत्र डाउनलोड करें।
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl text-xs font-black shadow transition flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span>कार्ड देखें →</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🔴 Boltee Kalam YouTube Official Showcase & Task Card (Below the 50-50 Grid) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-red-700 via-rose-900 to-red-800 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-red-500/30">
        <div className="space-y-1 max-w-lg">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-white text-red-700 font-black text-[10px] uppercase tracking-wider shadow flex items-center gap-1">
              <span>🔴 YOUTUBE SPECIAL</span>
            </span>
            <span className="text-xs font-extrabold text-amber-300">+25 Pts Visit • +10 Pts Task</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold font-rozha text-white">
            बोलती कलम YouTube चैनल — काव्य पाठ, पॉडकास्ट व स्पेशल टास्क
          </h3>
          <p className="text-[11px] text-red-100">
            यूट्यूब चैनल विजिट करने पर <strong>+25 पॉइंट्स</strong> और वीडियो लाइक/कमेंट का स्क्रीनशॉट सबमिट करने पर <strong>+10 पॉइंट्स</strong> प्राप्त करें।
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => {
              if (onYouTubeVisit) onYouTubeVisit();
              else window.open('https://www.youtube.com/@bolteekalam', '_blank');
            }}
            className="px-3.5 py-2 bg-white text-red-700 hover:bg-red-50 font-extrabold rounded-2xl text-xs shadow transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span>🔴 चैनल देखें (+25 Pts)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (requireAuth && !requireAuth()) return;
              if (onOpenYouTubeTask) onOpenYouTubeTask();
            }}
            className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-2xl text-xs shadow-lg transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>स्क्रीनशॉट टास्क (+10 Pts)</span>
          </button>
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
