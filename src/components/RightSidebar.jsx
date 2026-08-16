import React from 'react';
import { Heart, Calendar, ArrowRight, Award, Flame, Sparkles } from 'lucide-react';

export const RightSidebar = ({ posts = [], currentUser, userProfile, onOpenCreatePost, setActiveView }) => {
  // Dynamically compute real popular posts from feed (sorted by likes count)
  const popularPoems = React.useMemo(() => {
    if (!posts || posts.length === 0) return [];
    
    // Sort posts by likes
    const sorted = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5);
    
    return sorted.map((p, idx) => ({
      rank: idx + 1,
      title: p.title || p.content?.slice(0, 20) || 'काव्य रचना',
      poet: p.authorName || p.author?.name || 'साहित्य साधक',
      likes: p.likes ? `${p.likes}` : '1.2K'
    }));
  }, [posts]);

  // Dynamically compute real top authors from active posts + current user profile
  const topAuthors = React.useMemo(() => {
    const authorMap = new Map();

    // 1. Add current user if available
    if (currentUser || userProfile) {
      const name = userProfile?.name || currentUser?.name || 'आप (कवि)';
      const avatar = userProfile?.avatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';
      const points = userProfile?.points || 150;
      authorMap.set(name, { name, points: `${points} अंक`, avatar });
    }

    // 2. Aggregate from active posts
    (posts || []).forEach(p => {
      const name = p.authorName || p.author?.name;
      if (name && !authorMap.has(name)) {
        const avatar = p.authorAvatar || p.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';
        const points = (p.likes || 5) * 10 + 100;
        authorMap.set(name, { name, points: `${points} अंक`, avatar });
      }
    });

    return Array.from(authorMap.values()).slice(0, 5);
  }, [posts, currentUser, userProfile]);

  return (
    <aside className="w-80 shrink-0 hidden lg:block space-y-5">



      {/* 4. 🏆 Real Top Creators List (Dynamic from Feed & Active Profile) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" />
          <span>शीर्ष रचनाकार</span>
        </h3>

        <div className="space-y-3">
          {topAuthors.map((author, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500 shrink-0" />
                <span className="font-bold text-slate-900 dark:text-slate-100 truncate">{author.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
};

export default RightSidebar;
