import React from 'react';
import { 
  Home, Swords, Flame, Trophy, Calendar, Award, 
  BookOpen, Shield, User, Bookmark, Heart, Grid, Cake
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Sidebar = ({ activeView, setActiveView, userRole, onOpenBirthdayCard }) => {
  const { t } = useLanguage();

  const birthdayAuthor = {
    name: 'लोकेश शर्मा',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    city: 'जयपुर',
    date: '02 अगस्त (आज)'
  };

  const navItems = [
    { id: 'feed', label: t('nav.feed'), icon: Home },
    { id: 'battles', label: t('nav.battles'), icon: Swords, badge: 'LIVE', badgeColor: 'bg-rose-600' },
    { id: 'dailyChallenge', label: 'साप्ताहिक चुनौती', icon: Flame, badge: 'WEEKLY', badgeColor: 'bg-amber-500' },
    { id: 'competitions', label: t('nav.competitions'), icon: Trophy },
    { id: 'events', label: t('nav.events'), icon: Calendar },
    { id: 'leaderboard', label: t('nav.leaderboard'), icon: Award },
    { id: 'magazine', label: t('nav.magazine'), icon: BookOpen },
    { id: 'profile', label: t('nav.profile'), icon: User },
    ...(userRole === 'admin' ? [{ id: 'admin', label: t('nav.admin'), icon: Shield }] : [])
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <div className="sticky top-20 space-y-4">
        
        {/* Main Navigation Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm">
          <div className="px-3 py-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            मुख्य नेविगेशन
          </div>

          <nav className="space-y-1 mt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold border-l-4 border-rose-600' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600 dark:text-rose-400' : 'opacity-70'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold text-white ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
