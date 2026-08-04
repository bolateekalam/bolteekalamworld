import React from 'react';
import { Home, Swords, Flame, Trophy, Award, User, PlusCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const MobileBottomNav = ({ activeView, setActiveView, onOpenCreatePost }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'feed', label: 'मुख्य', icon: Home },
    { id: 'battles', label: 'संग्राम', icon: Swords },
    { id: 'dailyChallenge', label: 'चैलेंज', icon: Flame },
    { id: 'leaderboard', label: 'रैंकिंग', icon: Award },
    { id: 'profile', label: 'प्रोफ़ाइल', icon: User }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;

        const pathMap = {
          feed: '/',
          battles: '/poetry-battle',
          dailyChallenge: '/sahityik-chunautiyan',
          leaderboard: '/leaderboard',
          profile: '/profile'
        };

        const handleMobileClick = () => {
          setActiveView(item.id);
          try {
            history.pushState(null, '', pathMap[item.id] || '/');
          } catch (e) {}
        };

        return (
          <button
            key={item.id}
            onClick={handleMobileClick}
            aria-label={`${item.label} नेविगेशन देखें`}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              isActive 
                ? 'text-rose-600 dark:text-rose-400 font-bold scale-105' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
          </button>
        );
      })}

      {/* Quick Write Floating Post Button on Mobile */}
      <button
        onClick={onOpenCreatePost}
        aria-label="नई रचना लिखें"
        className="flex flex-col items-center gap-1 py-1 px-3 text-amber-600 dark:text-amber-400 active:scale-95 transition"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-900/30">
          <PlusCircle className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold">लिखें</span>
      </button>
    </div>
  );
};

export default MobileBottomNav;
