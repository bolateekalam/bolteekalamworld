import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, X, CheckCircle2, Send, ShieldCheck, AlertCircle, Radio, Smartphone, Trophy, Flame } from 'lucide-react';
import { 
  getNotificationPermission, 
  requestNotificationPermission, 
  sendTestNotification 
} from '../lib/notificationService';

export const PushNotificationStatusModal = ({ isOpen, onClose }) => {
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSentSuccess, setTestSentSuccess] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPermissionStatus(getNotificationPermission());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEnablePermission = async () => {
    setIsEnabling(true);
    try {
      const perm = await requestNotificationPermission();
      setPermissionStatus(perm);
      if (perm === 'granted') {
        await sendTestNotification();
        setTestSentSuccess(true);
        setTimeout(() => setTestSentSuccess(false), 4000);
      }
    } catch (e) {}
    setIsEnabling(false);
  };

  const handleSendTestPush = async () => {
    setIsSendingTest(true);
    const success = await sendTestNotification();
    setIsSendingTest(false);
    if (success) {
      setTestSentSuccess(true);
      setTimeout(() => setTestSentSuccess(false), 4000);
    }
  };

  const isGranted = permissionStatus === 'granted';
  const isDenied = permissionStatus === 'denied';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border-2 border-rose-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl max-w-md w-full relative space-y-5 text-slate-900 dark:text-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="relative inline-block mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 text-white flex items-center justify-center shadow-xl shadow-rose-900/30 ring-4 ring-rose-500/20">
              <Bell className="w-8 h-8 animate-bounce" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isGranted ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-4 w-4 ${isGranted ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black font-rozha text-slate-900 dark:text-slate-100">
            बोलती कलम पुश नोटिफिकेशन केंद्र
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-serif">
            काव्य गोष्ठी, शब्द सामर्थ्य व लाइव अपडेट्स
          </p>
        </div>

        {/* Live Status Card */}
        <div className={`p-4 rounded-2xl border transition space-y-2 ${
          isGranted 
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-300'
            : isDenied
            ? 'bg-rose-500/10 border-rose-500/40 text-rose-900 dark:text-rose-300'
            : 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-300'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono uppercase tracking-wider">डिवाइस स्थिति:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1 shadow-sm ${
              isGranted 
                ? 'bg-emerald-600 text-white' 
                : isDenied 
                ? 'bg-rose-600 text-white' 
                : 'bg-amber-500 text-slate-950'
            }`}>
              {isGranted ? '🟢 सक्रिय (Active)' : isDenied ? '🔴 ब्लॉक (Blocked)' : '🟡 प्रतीक्षित (Pending)'}
            </span>
          </div>

          <p className="text-xs font-serif leading-relaxed">
            {isGranted 
              ? '✓ आपके मोबाइल / कंप्यूटर पर पुश नोटिफिकेशन सक्रिय है। जब भी नया काव्य पाठ या परिणाम घोषित होगा, आपको तुरंत स्टेटस बार में अलर्ट मिलेगा।'
              : isDenied
              ? '⚠️ आपके ब्राउज़र ने नोटिफिकेशन ब्लॉक कर रखा है। कृपया ब्राउज़र सेटिंग्स में जाकर "bolateeworld.in" के लिए नोटिफिकेशन Allow करें।'
              : '🔔 अभी पुश नोटिफिकेशन की अनुमति नहीं दी गई है। लाइव अलर्ट पाने के लिए नीचे दिए बटन से अनुमति चालू करें।'}
          </p>
        </div>

        {/* Features Highlights */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px]">मोबाइल स्टेटस बार अलर्ट</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px]">ज्यूरी परिणाम सूचना</span>
          </div>
        </div>

        {/* Success Alert */}
        {testSentSuccess && (
          <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>✓ टेस्ट पुश नोटिफिकेशन आपके डिवाइस पर सफलतापूर्वक भेजा गया! अपनी स्क्रीन या नोटिफिकेशन बार चेक करें।</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {isGranted ? (
            <button
              type="button"
              disabled={isSendingTest}
              onClick={handleSendTestPush}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-black rounded-2xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSendingTest ? 'टेस्ट भेजा जा रहा है...' : '📲 अभी टेस्ट अलर्ट भेजें (Test Alert)'}</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isEnabling}
              onClick={handleEnablePermission}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-2xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Bell className="w-4 h-4 fill-white" />
              <span>{isEnabling ? 'चालू हो रहा है...' : '🔔 अभी पुश नोटिफिकेशन चालू करें'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition cursor-pointer text-center"
          >
            बंद करें (Close)
          </button>
        </div>

      </div>
    </div>
  );
};

export default PushNotificationStatusModal;
