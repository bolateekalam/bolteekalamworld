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
    { id: 'independenceSpecial', label: '15 अगस्त विशेष', icon: Flame, badge: 'NEW', badgeColor: 'bg-orange-500', path: '/' },
    { id: 'battles', label: 'कविताएँ', icon: Swords, path: '/poetry-battle' },
    { id: 'dailyChallenge', label: 'कहानी / लेख', icon: Flame, path: '/sahityik-chunautiyan' },
    { id: 'competitions', label: 'शायरी', icon: Trophy, path: '/sahityik-darpan' },
    { id: 'audioStories', label: 'ऑडियो स्टोरी', icon: Headphones, badge: 'शीघ्र', badgeColor: 'bg-purple-600', path: '/audio-stories' },
    { id: 'events', label: 'साहित्यिक आयोजन', icon: Calendar, path: '/events' },
    { id: 'posterStudio', label: 'चित्र / पोस्टर', icon: Award, badge: 'HOT', badgeColor: 'bg-rose-600', path: '/studio' },
    { id: 'magazine', label: 'पत्रिका / समाचार', icon: BookOpen, path: '/magazine' },
    { id: 'profile', label: 'मेरा प्रोफ़ाइल', icon: User, path: `/profile/${usernameClean}` },
    { id: 'admin', label: userRole === 'admin' ? '🛠️ एडमिन डैशबोर्ड' : '🔒 एडमिन लॉगिन', icon: Shield, badge: userRole === 'admin' ? 'ACTIVE' : 'LOCK', badgeColor: userRole === 'admin' ? 'bg-emerald-600' : 'bg-rose-600', path: '/admin' }
  ];

  const handleItemClick = (item) => {
    setActiveView(item.id === 'independenceSpecial' ? 'feed' : item.id);
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
              const isActive = activeView === item.id || (item.id === 'independenceSpecial' && activeView === 'feed');
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-bold border-l-4 border-orange-500' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600 dark:text-orange-400' : 'opacity-70'}`} />
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

        {/* 🇮🇳 Patriotic Independence Day Quote Card (Matching bottom-left of mockup) */}
        <div className="bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-emerald-500/10 border-2 border-orange-500/30 rounded-2xl p-4 text-center space-y-2 relative overflow-hidden shadow-sm">
          <div className="text-2xl">🇮🇳</div>
          <p className="font-tiro text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
            "स्वतंत्रता केवल एक दिन का उत्सव नहीं, बल्कि हर दिन का कर्तव्य है।"
          </p>
          <p className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
            जय हिन्द
          </p>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
