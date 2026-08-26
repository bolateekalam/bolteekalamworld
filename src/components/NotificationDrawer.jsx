import React, { useState, useEffect } from 'react';
import { 
  Bell, Heart, MessageSquare, UserPlus, Cake, Trophy, 
  Calendar, Megaphone, CheckCircle2, X, Send, Sparkles, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { 
  getNotificationPermission, 
  requestNotificationPermission, 
  sendTestNotification 
} from '../lib/notificationService';
import PushNotificationStatusModal from './PushNotificationStatusModal';

export const NotificationDrawer = ({ onClose, notifications = [], unreadNotifications, setUnreadNotifications, onClearNotifications }) => {
  const { t } = useLanguage();
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSentSuccess, setTestSentSuccess] = useState(false);
  const [showPushModal, setShowPushModal] = useState(false);

  useEffect(() => {
    setPermissionStatus(getNotificationPermission());
  }, []);

  const handleMarkAllRead = () => {
    setUnreadNotifications(0);
    if (onClearNotifications) onClearNotifications();
  };

  const handleEnableNotifications = async () => {
    const perm = await requestNotificationPermission();
    setPermissionStatus(perm);
    if (perm === 'granted') {
      handleSendTest();
    }
  };

  const handleSendTest = async () => {
    setIsSendingTest(true);
    const success = await sendTestNotification();
    setIsSendingTest(false);
    if (success) {
      setPermissionStatus('granted');
      setTestSentSuccess(true);
      setTimeout(() => setTestSentSuccess(false), 3500);
    }
  };

  return (
    <div className="fixed sm:absolute right-2 sm:right-0 top-16 sm:top-full mt-2 w-[calc(100vw-1.5rem)] max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
      
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {t('notifications.title')}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {unreadNotifications > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>{t('notifications.markAllRead')}</span>
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Push Notification Permission & Test Trigger Strip with Popup Trigger */}
      <div 
        onClick={() => setShowPushModal(true)}
        className="p-3 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-rose-500/10 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-rose-500/15 transition"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base animate-bounce">🔔</span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate flex items-center gap-1">
                <span>{permissionStatus === 'granted'
                  ? 'पुश नोटिफिकेशन सक्रिय 🟢'
                  : permissionStatus === 'denied'
                  ? 'नोटिफिकेशन ब्लॉक है ⚠️'
                  : 'साहित्यिक अलर्ट सक्षम करें'}</span>
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {permissionStatus === 'granted'
                  ? 'काव्य गोष्ठी व लाइव अपडेट्स'
                  : permissionStatus === 'denied'
                  ? 'ब्राउज़र सेटिंग में अनुमति दें'
                  : 'दैनिक शब्द व ज्यूरी परिणाम पाएं'}
              </p>
            </div>
          </div>

          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowPushModal(true)}
              className="px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 active:scale-95 text-white font-bold rounded-xl text-[10px] shadow transition flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>पॉपअप खोलें / टेस्ट अलर्ट 📲</span>
            </button>
          </div>
        </div>

        {testSentSuccess && (
          <div className="mt-2 p-1.5 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>✓ टेस्ट पुश नोटिफिकेशन आपके डिवाइस पर भेज दिया गया!</span>
          </div>
        )}
      </div>

      {/* Push Notification Status & Test Alert Dedicated Popup */}
      <PushNotificationStatusModal
        isOpen={showPushModal}
        onClose={() => {
          setShowPushModal(false);
          setPermissionStatus(getNotificationPermission());
        }}
      />

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 font-semibold space-y-1">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p>अभी कोई नया नोटिफिकेशन नहीं है।</p>
          </div>
        ) : (
          notifications.map((n) => {
            const IconComponent = n.icon || (n.type === 'like' ? Heart : n.type === 'comment' ? MessageSquare : n.type === 'follow' ? UserPlus : Megaphone);
            const colorStyle = n.color || (n.type === 'like' ? 'text-rose-500 bg-rose-500/10' : n.type === 'comment' ? 'text-blue-500 bg-blue-500/10' : n.type === 'follow' ? 'text-amber-500 bg-amber-500/10' : 'text-purple-500 bg-purple-500/10');
            return (
              <div 
                key={n.id}
                onClick={() => {
                  if (n.url) window.open(n.url, '_blank');
                }}
                className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition cursor-pointer ${
                  n.isUnread && unreadNotifications > 0 ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${colorStyle}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">
                    {n.desc}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default NotificationDrawer;
