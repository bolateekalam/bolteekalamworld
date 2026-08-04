import React, { useState } from 'react';
import { 
  Feather, Search, PlusCircle, Bell, Sun, Moon, Globe, 
  Shield, Check, Filter, User, LogIn, LogOut, ChevronDown, Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { mockCategories } from '../data/mockPosts';

export const Navbar = ({ 
  onOpenCreatePost, 
  activeView, 
  setActiveView,
  searchQuery,
  setSearchQuery,
  searchType,
  setSearchType,
  notificationsList = [],
  unreadNotifications,
  setUnreadNotifications,
  userRole,
  setUserRole,
  currentUser,
  onOpenAuthModal,
  onLogout
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveView('search');
    }
  };

  const currentProfileName = currentUser?.name || (userRole === 'admin' ? 'बोलती कलम वर्ल्ड' : 'आप (User Author)');
  const currentProfileAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Title */}
        <div 
          onClick={() => setActiveView('feed')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-900/20">
            <Feather className="w-5 h-5 transform -rotate-45" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <h1 className="font-rozha text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-none">
                बोलती कलम
              </h1>
              <span className="px-1.5 py-0.2 text-[10px] font-extrabold bg-rose-600 text-white rounded-md">
                v2.0
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-tiro">
              बहुभाषी साहित्यिक मंच
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="flex-1 max-w-md mx-2 hidden md:block"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="रचना, कवि, शहर या श्रेणी खोजें..."
              aria-label="रचना, कवि या श्रेणी खोजें"
              className="w-full pl-9 pr-24 py-2 text-xs rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />

            <div className="absolute right-1 flex items-center">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                aria-label="खोज श्रेणी चुनें (Select Search Category)"
                className="bg-transparent text-[11px] font-semibold text-slate-600 dark:text-slate-400 border-none focus:ring-0 py-1 pr-6 cursor-pointer"
              >
                <option value="all">सभी (All)</option>
                <option value="kavita">कविता</option>
                <option value="shayari">शायरी</option>
                <option value="author">कवि/लेखक</option>
              </select>
            </div>
          </div>
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Write New Post Button */}
          <button
            onClick={onOpenCreatePost}
            aria-label="रचना लिखें (Write Post)"
            className="px-3.5 py-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-900/20 flex items-center gap-1.5 active:scale-95 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">रचना लिखें</span>
          </button>

          {/* Notification Bell Icon */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="नोटिफिकेशन देखें"
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition relative"
            >
              <Bell className="w-4.5 h-4.5 text-rose-600 dark:text-rose-400" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-bold text-[9px] flex items-center justify-center animate-pulse shadow">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {showNotifications && (
              <NotificationDrawer
                onClose={() => setShowNotifications(false)}
                notifications={notificationsList}
                unreadNotifications={unreadNotifications}
                setUnreadNotifications={setUnreadNotifications}
              />
            )}
          </div>

          {/* Theme Toggle (Dark/Light) */}
          <button
            onClick={toggleTheme}
            aria-label="थीम बदलें (Toggle Theme)"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Auth State Button / User Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                aria-label="यूज़र प्रोफ़ाइल मेन्यू"
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <img
                  src={currentProfileAvatar}
                  alt={currentProfileName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-500"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden lg:inline max-w-[100px] truncate">
                  {currentProfileName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 text-xs font-semibold">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{currentProfileName}</p>
                    <span className="text-[10px] text-rose-500 font-bold uppercase">{userRole === 'admin' ? 'Super Admin' : 'साहित्यिक सदस्य'}</span>
                  </div>

                  <button
                    onClick={() => { setActiveView('profile'); setShowUserDropdown(false); }}
                    aria-label="मेरी प्रोफ़ाइल देखें"
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>मेरी प्रोफ़ाइल</span>
                  </button>

                  {userRole === 'admin' && (
                    <button
                      onClick={() => { setActiveView('admin'); setShowUserDropdown(false); }}
                      aria-label="एडमिन डैशबोर्ड देखें"
                      className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-rose-600 font-bold"
                    >
                      <Shield className="w-4 h-4 text-rose-600" />
                      <span>एडमिन डैशबोर्ड</span>
                    </button>
                  )}

                  <button
                    onClick={() => { onLogout(); setShowUserDropdown(false); }}
                    aria-label="साइन आउट करें"
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>साइन आउट (Log Out)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              aria-label="लॉगिन या नया खाता बनाएँ"
              className="px-3 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow active:scale-95 transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>लॉगिन / नया खाता</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};

export default Navbar;
