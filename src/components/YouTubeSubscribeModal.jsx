import React, { useState } from 'react';
import { Video, ExternalLink, CheckCircle2, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const YouTubeSubscribeModal = ({ isOpen, onClose, onConfirmSubscribe }) => {
  const { t } = useLanguage();
  const [visited, setVisited] = useState(false);

  if (!isOpen) return null;

  const handleOpenChannel = () => {
    window.open('https://www.youtube.com/@bolateekalam', '_blank');
    setVisited(true);
  };

  const handleClaimPoints = () => {
    if (onConfirmSubscribe) {
      onConfirmSubscribe();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-base">
            <Video className="w-5 h-5" />
            <span>YouTube चैनल सब्सक्राइब करें (+100 Pts)</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Channel Info Card */}
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 space-y-3 text-center">
          <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Video className="w-8 h-8" />
          </div>

          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">बोलती कलम (@bolateekalam)</h3>
            <p className="text-xs text-slate-500 mt-0.5">राष्ट्रीय ऑनलाइन कवि सम्मेलन एवं साहित्यिक चर्चाएँ</p>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>सब्सक्राइब करने पर तुरंत पाएँ +100 बोनस पॉइंट्स!</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleOpenChannel}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition active:scale-95"
          >
            <Video className="w-4 h-4" />
            <span>🔴 Bolti Kalam YouTube चैनल पर जाएँ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {visited && (
            <button
              onClick={handleClaimPoints}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>मैंने सब्सक्राइब कर दिया (+100 Points प्राप्त करें)</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default YouTubeSubscribeModal;
