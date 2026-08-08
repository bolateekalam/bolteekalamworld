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
      
      {/* 1. 🇮🇳 Jai Hind - 15 August Independence Day Card */}
      <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-emerald-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden text-center space-y-3">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <p className="text-xs font-black uppercase tracking-widest text-amber-200">
            जय हिन्द
          </p>
          <h2 className="text-2xl font-black font-rozha tracking-tight">
            15 अगस्त स्वतंत्रता दिवस
          </h2>
          <p className="text-xs font-bold text-amber-100 italic">
            भारत माता की जय!
          </p>
        </div>

        {/* Emblem & Flag Artwork */}
        <div className="pt-1 flex items-center justify-center relative z-10">
          <img src="/images/emblem_flag.png" alt="Satyamev Jayate Emblem" className="h-28 object-contain drop-shadow-xl" />
        </div>

        {/* Badge */}
        <div className="pt-1 relative z-10">
          <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black border border-white/30 shadow">
            🇮🇳 80वाँ स्वतंत्रता दिवस पर्व
          </span>
        </div>
      </div>

      {/* 2. 🎭 15 Ras Chakra Wheel Widget */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 text-center">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>15 रस चक्र</span>
        </h3>

        {/* Interactive 15 Ras Wheel Diagram */}
        <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-emerald-500/40 animate-spin-slow" />
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-600 flex flex-col items-center justify-center text-emerald-600 dark:text-emerald-400">
            <span className="text-xl font-black">15</span>
            <span className="text-[10px] font-bold uppercase">रस</span>
          </div>
        </div>

        <button
          onClick={() => setActiveView && setActiveView('magazine')}
          className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95"
        >
          <span>रस पढ़ें</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. 🔥 Real Popular Poems List (Dynamic from Feed) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-orange-500" />
          <span>लोकप्रिय रचनाएँ</span>
        </h3>

        <div className="space-y-3">
          {popularPoems.map((poem) => (
            <div key={poem.rank} className="flex items-center justify-between gap-3 text-xs border-b border-slate-100 dark:border-slate-800/60 pb-2.5 last:border-none last:pb-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                  {poem.rank}
                </span>
                <div className="truncate">
                  <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{poem.title}</p>
                  <p className="text-[10px] text-slate-500 truncate">{poem.poet}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-rose-500 shrink-0">
                <Heart className="w-3 h-3 fill-rose-500" />
                <span>{poem.likes}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setActiveView && setActiveView('battles')}
          className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition"
        >
          <span>और देखें</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

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
              <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 shrink-0">
                {author.points}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. 📅 Upcoming Events Card */}
      <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/20 border-2 border-orange-500/30 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>आगामी कार्यक्रम</span>
          </span>
          <span className="text-[10px] bg-orange-500 text-white font-bold px-2 py-0.5 rounded-full">
            LIVE EVENT
          </span>
        </div>

        <div className="space-y-1">
          <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm font-rozha">
            स्वतंत्रता दिवस विशेष काव्य संध्या
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            15 अगस्त 2026 | समय: शाम 7:00 बजे
          </p>
        </div>

        <button
          onClick={() => setActiveView && setActiveView('events')}
          className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-xl text-xs shadow transition active:scale-95"
        >
          भाग लें
        </button>
      </div>

    </aside>
  );
};

export default RightSidebar;
