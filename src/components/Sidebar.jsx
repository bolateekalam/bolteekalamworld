import React from 'react';
import { 
  Home, Swords, Flame, Trophy, Calendar, Award, 
  BookOpen, Shield, User, Headphones
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Sidebar = ({ activeView, setActiveView, userRole, userProfile }) => {
  const { t } = useLanguage();
  const usernameClean = (userProfile?.username || 'writer').replace(/^[@#]/, '');

  const navItems = [
    { id: 'feed', label: 'होम', icon: Home, path: '/' },
    { id: 'certificates', label: '📜 सम्मान पत्र (Certificates)', icon: Award, badge: 'UNLOCKED', badgeColor: 'bg-amber-600', path: '/certificates' },
    { id: 'battles', label: 'कविताएँ', icon: Swords, path: '/poetry-battle' },
    { id: 'dailyChallenge', label: 'कहानी / लेख', icon: Flame, path: '/sahityik-chunautiyan' },
    { id: 'competitions', label: 'शायरी', icon: Trophy, path: '/sahityik-darpan' },
    { id: 'audioStories', label: 'ऑडियो स्टोरी', icon: Headphones, badge: 'शीघ्र', badgeColor: 'bg-purple-600', path: '/audio-stories' },
    { id: 'events', label: 'साहित्यिक आयोजन', icon: Calendar, path: '/events' },
    { id: 'posterStudio', label: 'चित्र / पोस्टर', icon: Award, badge: 'HOT', badgeColor: 'bg-rose-600', path: '/studio' },
    { id: 'magazine', label: 'पत्रिका / समाचार', icon: BookOpen, path: '/magazine' },
    { id: 'profile', label: 'मेरा प्रोफ़ाइल', icon: User, path: `/profile/${usernameClean}` },
    ...(userRole === 'admin' ? [{ id: 'admin', label: '🛠️ एडमिन डैशबोर्ड', icon: Shield, badge: 'ACTIVE', badgeColor: 'bg-emerald-600', path: '/admin' }] : [])
  ];

  const handleItemClick = (item) => {
    setActiveView(item.id);
    try {
      history.pushState(null, '', item.path);
    } catch (e) {}
  };

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
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold border-l-4 border-rose-500' 
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

        {/* Sahitya Motivational Quote Card */}
        <div className="bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-purple-500/10 border border-rose-500/20 rounded-2xl p-4 text-center space-y-2 relative overflow-hidden shadow-sm">
          <div className="text-xl">✍️</div>
          <p className="font-tiro text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
            "शब्द ही आपकी पहचान हैं, अपनी कलम से नए विचार रचिए।"
          </p>
          <p className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">
            बोलती कलम
          </p>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
