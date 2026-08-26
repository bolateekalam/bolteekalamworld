import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { 
  getNotificationPermission, 
  requestNotificationPermission, 
  sendTestNotification 
} from '../lib/notificationService';

export const NotificationPermissionModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);

  useEffect(() => {
    // Only show if browser supports notifications, not already granted/denied, and not prompted recently
    try {
      if (typeof window === 'undefined' || !('Notification' in window)) return;
      
      const perm = getNotificationPermission();
      const dismissed = localStorage.getItem('bolteekalam_notif_prompt_dismissed');
      
      if (perm === 'default' && !dismissed) {
        // Gentle delay after engagement
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 3500);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, []);

  const handleEnable = async () => {
    setIsEnabling(true);
    try {
      const perm = await requestNotificationPermission();
      if (perm === 'granted') {
        await sendTestNotification();
      }
    } catch (e) {}
    setIsEnabling(false);
    setIsOpen(false);
    try {
      localStorage.setItem('bolteekalam_notif_prompt_dismissed', 'true');
    } catch (e) {}
  };

  const handleDismiss = () => {
    setIsOpen(false);
    try {
      localStorage.setItem('bolteekalam_notif_prompt_dismissed', 'true');
    } catch (e) {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl max-w-md w-full relative space-y-4 text-slate-900 dark:text-slate-100 animate-in slide-in-from-bottom-5 duration-300">
        
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-900/30 ring-4 ring-rose-500/20">
            <Bell className="w-6 h-6 animate-bounce" />
          </div>
          <div className="space-y-1 pr-4">
            <h3 className="text-base sm:text-lg font-bold font-rozha text-rose-950 dark:text-rose-100 flex items-center gap-1.5">
              <span>दैनिक काव्य सूचनाएं चालू करें</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-serif">
              आज का दैनिक काव्य शब्द, लाइव यूट्यूब मुशायरा, और साप्ताहिक ज्यूरी परिणामों के अलर्ट सीधे अपने मोबाइल पर पाएं!
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleDismiss}
            className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs transition cursor-pointer text-center"
          >
            बाद में (Later)
          </button>

          <button
            type="button"
            disabled={isEnabling}
            onClick={handleEnable}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-black rounded-2xl text-xs shadow-xl transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 fill-white" />
            <span>{isEnabling ? 'चालू हो रहा है...' : 'चालू करें 🔔'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotificationPermissionModal;
