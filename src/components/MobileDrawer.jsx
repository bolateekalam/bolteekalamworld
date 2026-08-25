import React from 'react';
import { 
  Home, Swords, Flame, Trophy, Calendar, Award, 
  BookOpen, Sparkles, Shield, User, X, Feather, Globe, Moon, Sun, Monitor
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export const MobileDrawer = ({ isOpen, onClose, activeView, setActiveView, onOpenAiAssistant, userRole }) => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { themeMode, setThemeMode } = useTheme();

  if (!isOpen) return null;

  const navItems = [
    { id: 'feed', label: t('nav.feed'), icon: Home },
    { id: 'battles', label: t('nav.battles'), icon: Swords, badge: 'LIVE' },
    { id: 'dailyChallenge', label: t('nav.dailyChallenge'), icon: Flame, badge: 'DAILY' },
    { id: 'competitions', label: t('nav.competitions'), icon: Trophy },
    { id: 'events', label: t('nav.events'), icon: Calendar },
    { id: 'certificates', label: '📜 सम्मान पत्र', icon: Award, badge: 'UNLOCKED' },
    { id: 'magazine', label: t('nav.magazine'), icon: BookOpen },
    { id: 'profile', label: t('nav.profile'), icon: User }
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-80 max-w-[85vw] h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-250">
        
        {/* Drawer Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-700 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Feather className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-rozha text-lg text-slate-900 dark:text-rose-100">
                  {t('brandName')}
                </h2>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {t('tagline')}
                </p>
              </div>
            </div>

            <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick AI Assistant Banner */}
          <button
            onClick={() => { onClose(); onOpenAiAssistant(); }}
            className="w-full p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>{t('ai.title')}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">AI</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1 max-h-[50vh] overflow-y-auto pr-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Drawer Footer: Language & Theme Controls */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">भाषा / Language:</span>
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-rose-500" />
              <span className="uppercase">{lang}</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">थीम मोड्:</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setThemeMode('light')}
                className={`p-1.5 rounded-lg ${themeMode === 'light' ? 'bg-white shadow text-amber-500' : 'text-slate-400'}`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setThemeMode('dark')}
                className={`p-1.5 rounded-lg ${themeMode === 'dark' ? 'bg-slate-900 shadow text-rose-400' : 'text-slate-400'}`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setThemeMode('system')}
                className={`p-1.5 rounded-lg ${themeMode === 'system' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MobileDrawer;
