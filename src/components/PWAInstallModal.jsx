import React, { useState } from 'react';
import { X, Download, Smartphone, Check, Sparkles, Monitor, Laptop, HelpCircle, ShieldCheck } from 'lucide-react';

export const PWAInstallModal = ({ isOpen, onClose, deferredPrompt }) => {
  const [installed, setInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  if (!isOpen) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isDesktop = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setInstalled(true);
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
      } finally {
        setIsInstalling(false);
      }
    } else {
      if (isDesktop) {
        alert('Chrome के एड्रेस बार (URL) में दाईं ओर दिए गए "Install App (⬇️)" आइकन पर क्लिक करें, या Chrome मेन्यू > "Install बोलती कलम" चुनें।');
      } else {
        alert('अपने ब्राउज़र के 3-डॉट्स मेन्यू पर क्लिक करें और "Add to Home screen" (होम स्क्रीन पर जोड़ें) चुनें।');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="बंद करें"
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Top Header with Clean Official Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white p-1 border-2 border-amber-500 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
            <img 
              src="/logo.png" 
              alt="Bolti Kalam Logo" 
              className="w-full h-full object-contain rounded-xl" 
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
            <span className="text-xl font-bold text-[#0e2238]">🪶</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-black font-rozha text-slate-900 dark:text-slate-100 truncate">
              बोलती कलम {isDesktop ? 'डेस्कटॉप ऐप' : 'मोबाइल ऐप'}
            </h3>
            <p className="text-xs text-amber-700 dark:text-amber-400 font-bold truncate">
              आधिकारिक डिजिटल मंच (bolateeworld.in)
            </p>
          </div>
        </div>

        {/* Professional Feature List */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
          <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-200">
            <span className="text-base shrink-0">📱</span>
            <div>
              <strong className="block text-slate-900 dark:text-slate-100 font-bold">
                {isDesktop ? 'डेस्कटॉप शॉर्टकट & स्टैंडअलोन विंडो:' : 'होम स्क्रीन पर त्वरित एक्सेस:'}
              </strong>
              <span className="text-slate-600 dark:text-slate-300">
                {isDesktop 
                  ? 'डेस्कटॉप पर बोलती कलम का आइकॉन बनेगा और बिना ब्राउज़र टैब के अलग विंडो में खुलेगा।' 
                  : 'फ़ोन की होम स्क्रीन से सीधे एक क्लिक में अपनी साहित्यिक दुनिया में प्रवेश करें।'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-200">
            <span className="text-base shrink-0">🔔</span>
            <div>
              <strong className="block text-slate-900 dark:text-slate-100 font-bold">लाइव अपडेट्स & गोष्ठी सूचनाएँ:</strong>
              <span className="text-slate-600 dark:text-slate-300">दैनिक शब्द, लाइव काव्य गोष्ठियों एवं नई रचनाओं की ताज़ा जानकारी प्राप्त करें।</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-200">
            <span className="text-base shrink-0">✨</span>
            <div>
              <strong className="block text-slate-900 dark:text-slate-100 font-bold">सहज और सुरक्षित उपयोग:</strong>
              <span className="text-slate-600 dark:text-slate-300">सभी सुविधाएं, प्रमाणपत्र और साहित्यिक सदस्यता सीधे ऐप में सुरक्षित रहेंगी।</span>
            </div>
          </div>
        </div>

        {/* Platform Specific Action / Help */}
        {isIOS ? (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs space-y-1 text-amber-900 dark:text-amber-200">
            <p className="font-bold flex items-center gap-1">
              <span>🍎 iPhone / iPad पर कैसे जोड़ें:</span>
            </p>
            <ol className="list-decimal list-inside space-y-0.5 text-[11px] opacity-90 pl-1">
              <li>Safari ब्राउज़र में नीचे <strong>Share</strong> (⬆️) बटन दबाएं।</li>
              <li>नीचे स्क्रॉल करके <strong>'Add to Home Screen'</strong> चुनें।</li>
              <li>ऊपर दाईं ओर <strong>'Add'</strong> पर क्लिक करें!</li>
            </ol>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={handleInstallClick}
              disabled={isInstalling || installed}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0e2238] via-slate-900 to-[#0e2238] hover:brightness-110 text-amber-300 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl border border-amber-500/40 transition active:scale-95 cursor-pointer disabled:opacity-60"
            >
              {installed ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>सफलतापूर्वक इंस्टॉल हो गया!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>
                    {isInstalling 
                      ? 'इंस्टॉल हो रहा है...' 
                      : (isDesktop ? '💻 डेस्कटॉप पर ऐप जोड़ें' : '📲 ऐप इंस्टॉल करें')}
                  </span>
                </>
              )}
            </button>

            {isDesktop && !deferredPrompt && (
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-[11px] text-blue-800 dark:text-blue-200 leading-tight flex items-start gap-2">
                <Laptop className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Chrome टिप:</strong> एड्रेस बार में दाईं ओर <strong>⬇️ (Install)</strong> बटन पर क्लिक करके भी सीधे इंस्टॉल कर सकते हैं।
                </span>
              </div>
            )}

            <p className="text-[10px] text-center text-slate-400">
              आधिकारिक बोलती कलम मंच • सुरक्षित एवं प्रमाणित
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default PWAInstallModal;
