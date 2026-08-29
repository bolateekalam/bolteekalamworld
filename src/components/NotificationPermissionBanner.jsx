import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { 
  getNotificationPermission, 
  requestNotificationPermission, 
  sendTestNotification 
} from '../lib/notificationService';

const DECISION_KEY = 'bolteekalam_push_decision_done';

export const NotificationPermissionBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);

  useEffect(() => {
    try {
      if (typeof window === 'undefined' || !('Notification' in window)) return;
      
      const perm = getNotificationPermission();
      const hasDecided = localStorage.getItem(DECISION_KEY) === 'true';
      
      // If already granted or dismissed previously, do not show
      if (perm === 'granted' || hasDecided) {
        return;
      }
      
      if (perm === 'default') {
        // Show after 3 seconds on page
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, []);

  const handleEnable = async () => {
    setIsEnabling(true);
    try {
      const perm = await requestNotificationPermission();
      localStorage.setItem(DECISION_KEY, 'true');
      
      if (perm === 'granted') {
        await sendTestNotification();
      }
    } catch (e) {}
    setIsEnabling(false);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem(DECISION_KEY, 'true');
    } catch (e) {}
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-4 z-40 max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-amber-500/50 rounded-2xl p-3.5 sm:p-4 shadow-2xl animate-in slide-in-from-bottom duration-300 text-slate-900 dark:text-slate-100">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md ring-2 ring-rose-500/20">
          <Bell className="w-5 h-5 animate-pulse" />
        </div>

        <div className="flex-1 space-y-1 pr-6">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs sm:text-sm font-bold font-rozha text-rose-950 dark:text-rose-200">
              दैनिक काव्य सूचनाएं चालू करें
            </h4>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-snug font-serif">
            आज का दैनिक काव्य शब्द, मानद सम्मान पत्र और लाइव मुशायरा अलर्ट सीधे पाएं!
          </p>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleEnable}
              disabled={isEnabling}
              className="px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold rounded-xl text-[11px] sm:text-xs shadow transition active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <Bell className="w-3 h-3 fill-white" />
              <span>{isEnabling ? 'चालू हो रहा है...' : 'चालू करें 🔔'}</span>
            </button>

            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl text-[11px] sm:text-xs transition cursor-pointer"
            >
              बाद में
            </button>
          </div>
        </div>

        {/* Close Button (Permanent until user clicks) */}
        <button
          onClick={handleDismiss}
          className="absolute top-2.5 right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition cursor-pointer"
          title="हटाएं (Close)"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default NotificationPermissionBanner;
