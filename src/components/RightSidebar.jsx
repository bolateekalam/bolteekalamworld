import React from 'react';
import { Heart, Calendar, ArrowRight, Award, Flame, Sparkles, CheckCircle2, Video } from 'lucide-react';

const YouTubeIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const RightSidebar = ({ posts = [], currentUser, userProfile, onOpenCreatePost, setActiveView }) => {
  // Dynamically compute real popular posts from feed
  const popularPoems = React.useMemo(() => {
    if (!posts || posts.length === 0) return [];
    const sorted = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5);
    return sorted.map((p, idx) => ({
      rank: idx + 1,
      title: p.title || p.content?.slice(0, 20) || 'काव्य रचना',
      poet: p.authorName || p.author?.name || 'साहित्य साधक',
      likes: p.likes ? `${p.likes}` : '12'
    }));
  }, [posts]);

  // Top Creators List
  const topAuthors = React.useMemo(() => {
    const authorMap = new Map();

    if (currentUser || userProfile) {
      const name = userProfile?.name || currentUser?.name || 'आप (कवि)';
      const avatar = userProfile?.avatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';
      const points = userProfile?.points || 50;
      authorMap.set(name, { name, points: `${points} अंक`, avatar });
    }

    (posts || []).forEach(p => {
      const name = p.authorName || p.author?.name;
      if (name && !authorMap.has(name)) {
        const avatar = p.authorAvatar || p.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';
        const points = p.author?.points || 50;
        authorMap.set(name, { name, points: `${points} अंक`, avatar });
      }
    });

    return Array.from(authorMap.values()).slice(0, 5);
  }, [posts, currentUser, userProfile]);

  return (
    <aside className="w-72 2xl:w-80 shrink-0 hidden xl:block space-y-4">

      {/* 1. 📜 Milestone Certificates Side Widget (Prominently visible) */}
      <div className="bg-gradient-to-br from-[#0e2238] via-slate-900 to-[#0e2238] text-white border-2 border-amber-500/40 rounded-3xl p-4 shadow-xl space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
            <Award className="w-4 h-4 text-amber-400" />
            <span>साहित्यिक सम्मान पत्र</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
            ✓ 1 UNLOCKED
          </span>
        </div>

        <div className="p-2.5 bg-slate-900/60 rounded-xl border border-amber-500/20 space-y-1">
          <span className="text-[11px] font-bold text-amber-200 block font-rozha">
            📜 प्रथम साहित्यिक पदार्पण सम्मान पत्र
          </span>
          <p className="text-[10px] text-slate-300 leading-relaxed font-serif">
            बोलती कलम (Bolti Kalam) में खाता बनते ही जारी किया गया आधिकारिक डिजिटल सम्मान पत्र।
          </p>
        </div>

        <button
          onClick={() => {
            setActiveView('certificates');
            try {
              history.pushState(null, '', '/certificates');
            } catch (e) {}
          }}
          className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>सम्मान पत्र देखें व डाउनलोड करें →</span>
        </button>
      </div>

      {/* 2. 🔴 Official YouTube Channel Widget (@bolteekalam) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
            <YouTubeIcon className="w-4 h-4 text-red-600" />
            <span className="text-slate-900 dark:text-slate-100">बोलती कलम यूट्यूब</span>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">@bolteekalam</span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          बोलती कलम के आधिकारिक यूट्यूब चैनल पर अपनी कविता का पाठ देखें और नए साहित्यकारों से जुड़ें।
        </p>

        <a
          href="https://www.youtube.com/@bolteekalam"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow cursor-pointer"
        >
          <YouTubeIcon className="w-3.5 h-3.5" />
          <span>YouTube चैनल देखें (@bolteekalam)</span>
        </a>
      </div>

      {/* 3. 🏆 Top Creators List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-3">
        <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" />
          <span>शीर्ष रचनाकार</span>
        </h3>

        <div className="space-y-2.5">
          {topAuthors.map((author, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <img src={author.avatar} alt={author.name} className="w-7 h-7 rounded-full object-cover ring-2 ring-amber-500 shrink-0" />
                <span className="font-bold text-slate-900 dark:text-slate-100 truncate">{author.name}</span>
              </div>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold shrink-0">
                {author.points}
              </span>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
};

export default RightSidebar;
