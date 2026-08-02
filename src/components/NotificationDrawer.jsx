import React from 'react';
import { 
  Bell, Heart, MessageSquare, UserPlus, Cake, Trophy, 
  Calendar, Megaphone, CheckCircle2, X 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const NotificationDrawer = ({ onClose, unreadNotifications, setUnreadNotifications }) => {
  const { t } = useLanguage();

  const notifications = [
    {
      id: 1,
      type: 'like',
      icon: Heart,
      color: 'text-rose-500 bg-rose-500/10',
      title: 'अनामिका अंबर ने आपकी कविता को लाइक किया',
      desc: '"कोई दीवाना कहता है..." रचना पर नई लाइक मिली।',
      time: '10 मिनट पहले',
      isUnread: true
    },
    {
      id: 2,
      type: 'comment',
      icon: MessageSquare,
      color: 'text-blue-500 bg-blue-500/10',
      title: 'नई टिप्पणी',
      desc: 'रवि शर्मा: "अद्भुत भाव! हर पंक्ति दिल को छू गई।"',
      time: '25 मिनट पहले',
      isUnread: true
    },
    {
      id: 3,
      type: 'competition',
      icon: Trophy,
      color: 'text-amber-500 bg-amber-500/10',
      title: 'प्रतियोगिता परिणाम घोषित',
      desc: 'राष्ट्रीय हिंदी काव्य महोत्सव का परिणाम घोषित हुआ। डिजिटल सर्टिफिकेट डाउनलोड करें।',
      time: '2 घंटे पहले',
      isUnread: false
    },
    {
      id: 4,
      type: 'follow',
      icon: UserPlus,
      color: 'text-emerald-500 bg-emerald-500/10',
      title: 'नया फ़ॉलोअर',
      desc: 'डॉ. विनय पाठक ने आपको फ़ॉलो करना शुरू किया।',
      time: '5 घंटे पहले',
      isUnread: false
    },
    {
      id: 5,
      type: 'announcement',
      icon: Megaphone,
      color: 'text-purple-500 bg-purple-500/10',
      title: 'बोलती कलम ई-मैगज़ीन प्रकाशित',
      desc: 'अगस्त 2026 अंक अब ऑनलाइन पढ़ने के लिए उपलब्ध है।',
      time: '1 दिन पहले',
      isUnread: false
    }
  ];

  const handleMarkAllRead = () => {
    setUnreadNotifications(0);
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
      
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

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div 
              key={n.id}
              className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition ${
                n.isUnread && unreadNotifications > 0 ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${n.color}`}>
                <Icon className="w-4 h-4" />
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
        })}
      </div>

    </div>
  );
};

export default NotificationDrawer;
