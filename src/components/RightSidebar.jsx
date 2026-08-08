import React from 'react';
import { Heart, Calendar, ArrowRight, Award, Flame, Sparkles } from 'lucide-react';

export const RightSidebar = ({ onOpenCreatePost, setActiveView }) => {
  const popularPoems = [
    { rank: 1, title: 'ऐ मेरे वतन के लोगों', poet: 'श्री प्रदीप', likes: '2.5K' },
    { rank: 2, title: 'वंदे मातरम्', poet: 'बंकिम चंद्र चटर्जी', likes: '2.1K' },
    { rank: 3, title: 'सरफ़रोशी की तमन्ना', poet: 'रामप्रसाद बिस्मिल', likes: '1.8K' },
    { rank: 4, title: 'जन गण मन', poet: 'रवींद्रनाथ टैगोर', likes: '1.5K' },
    { rank: 5, title: 'झंडा ऊंचा रहे हमारा', poet: 'श्री श्यामलाल गुप्त', likes: '1.2K' }
  ];

  const topAuthors = [
    { name: 'सरस्वती पाठक', points: '2.3K अंक', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
    { name: 'वीर प्रताप सिंह', points: '1.9K अंक', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
    { name: 'प्रिया वर्मा', points: '1.7K अंक', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
    { name: 'अमित शुक्ला', points: '1.4K अंक', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
    { name: 'काव्या जोशी', points: '1.2K अंक', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150' }
  ];

  return (
    <aside className="w-80 shrink-0 hidden lg:block space-y-5">
      
      {/* 1. 🇮🇳 Jai Hind - 15 August Independence Day Card (Matching top right of mockup) */}
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

        {/* Silhouette Illustration Badge */}
        <div className="pt-2 relative z-10">
          <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black border border-white/30 shadow">
            🇮🇳 80वाँ स्वतंत्रता दिवस पर्व
          </span>
        </div>
      </div>

      {/* 2. 🎭 15 Ras Chakra Wheel Widget (Matching right middle of mockup) */}
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

      {/* 3. 🔥 Popular Patriotic Poems List (Matching right widget of mockup) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-orange-500" />
          <span>लोकप्रिय कविताएँ</span>
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

      {/* 4. 🏆 Top Creators List (Matching right bottom of mockup) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" />
          <span>शीर्ष रचनाकार</span>
        </h3>

        <div className="space-y-3">
          {topAuthors.map((author, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500 shrink-0" />
                <span className="font-bold text-slate-900 dark:text-slate-100">{author.name}</span>
              </div>
              <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 shrink-0">
                {author.points}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. 📅 Upcoming Events Card (Matching bottom right of mockup) */}
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
