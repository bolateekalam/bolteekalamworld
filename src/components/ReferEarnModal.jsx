import React, { useState } from 'react';
import { Gift, Share2, Copy, Check, Users, Sparkles, Trophy, X, Package } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ReferEarnModal = ({ isOpen, onClose, userPoints = 4890 }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [referralCode] = useState('BK-REF-8921');
  const [referredCount] = useState(8);

  if (!isOpen) return null;

  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-500">
              <Gift className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {t('profile.referEarnTitle')}
              </h3>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                प्रति सफल रेफ़रल पर पाएँ +50 बोनस पॉइंट्स!
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Unique Referral Code Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <span className="text-xs font-semibold text-slate-500 block">
            {t('profile.yourReferralCode')}
          </span>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-500/40 text-rose-600 dark:text-rose-400 font-mono font-bold text-lg tracking-wider">
            <span>{referralCode}</span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-sans font-bold flex items-center gap-1 shadow transition active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'कॉपी हो गया!' : t('profile.copyReferralLink')}</span>
            </button>
          </div>
        </div>

        {/* Progress Toward 5,000 Pts Bolatee Kalam Kit */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-900 to-amber-950 text-white space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1 text-amber-300">
              <Package className="w-4 h-4" />
              <span>बोलती कलम किट (5,000 Points Goal)</span>
            </span>
            <span className="font-outfit text-amber-400">{userPoints} / 5,000 pts</span>
          </div>
          <div className="h-2.5 w-full bg-slate-950/80 rounded-full overflow-hidden">
            <div 
              style={{ width: `${Math.min((userPoints / 5000) * 100, 100)}%` }} 
              className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500" 
            />
          </div>
          <p className="text-[11px] text-rose-200/80">
            {5000 - userPoints > 0 ? `किट मँगवाने के लिए ${5000 - userPoints} पॉइंट्स और चाहिए (कम से कम 2-3 महीने नियमित सक्रियता आवश्यक)।` : '🎉 बधाई! आप बोलती कलम किट क्लेम कर सकते हैं!'}
          </p>
        </div>

        {/* Live Verified Referral Stats */}
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-500" />
              <span>सत्यापित जुड़े सदस्य:</span>
            </span>
            <span className="text-rose-600 dark:text-rose-400 font-outfit text-sm">{referredCount} सदस्य</span>
          </div>
          <p className="text-[11px] text-slate-500">
            जब आपके दिए गए लिंक से कोई नया लेखक प्लेटफ़ॉर्म पर रजिस्टर करेगा और पहली रचना पोस्ट करेगा, तो आपको +50 बोनस पॉइंट्स अपने आप जुड़ जाएँगे।
          </p>
        </div>

      </div>
    </div>
  );
};

export default ReferEarnModal;
