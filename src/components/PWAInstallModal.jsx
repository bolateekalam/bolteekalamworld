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
        alert('Chrome के ऊपर एड्रेस बार (URL) में दाईं तरफ दिए गए "Install App (⬇️ / ⊕)" आइकन पर क्लिक करें, या Chrome मेन्यू (3 डॉट्स) > "Save and Share" > "Install बोलती कलम" चुनें।');
      } else {
        alert('अपने ब्राउज़र के ऊपर 3-डॉट्स मेन्यू पर क्लिक करें और "Add to Home screen" (होम स्क्रीन पर जोड़ें) चुनें।');
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

        {/* Modal Top Header with Official Logo */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white p-1 border-2 border-amber-500 shadow-md flex items-center justify-center shrink-0">
            <img 
              src="/logo.png" 
              alt="Bolti Kalam Logo" 
              className="w-full h-full object-contain rounded-xl" 
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
            <span className="text-2xl font-bold text-[#0e2238]">🪶</span>
          </div>
          <div>
            <h3 className="text-lg font-black font-rozha text-slate-900 dark:text-slate-100">
              बोलती कलम {isDesktop ? 'डेस्कटॉप ऐप' : 'मोबाइल ऐप'}
            </h3>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-bold">
              {isDesktop ? 'Chrome से सीधे Desktop पर इंस्टॉल करें (0 MB)' : '1-क्लिक में फ़ोन पर इंस्टॉल करें (0 MB Space)'}
            </p>
          </div>
        </div>

        {/* App Highlights */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
          <div className="flex items-start gap-2 text-slate-700 dark:text-slate-200">
            <span className="text-base">⚡</span>
            <div>
              <strong className="block text-slate-900 dark:text-slate-100 font-bold">
                {isDesktop ? 'डेस्कटॉप शॉर्टकट & स्टैंडअलोन विंडो:' : 'सुपर फ़ास्ट & बिना लैग:'}
              </strong>
              <span>
                {isDesktop 
                  ? 'डेस्कटॉप पर बोलती कलम के लोगो का आइकन बनेगा और बिना ब्राउज़र टैब के फुलस्क्रीन खुलेगा।' 
                  : 'प्ले स्टोर जैसा 100% स्मूथ अनुभव बिना फ़ोन मेमोरी भरे।'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-slate-700 dark:text-slate-200">
            <span className="text-base">🔔</span>
            <div>
              <strong className="block text-slate-900 dark:text-slate-100 font-bold">लाइव अलर्ट & नोटिफिकेशन:</strong>
              <span>दैनिक काव्य शब्द, लाइव यूट्यूब सत्र और नई रचनाओं की ताज़ा सूचना।</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-slate-700 dark:text-slate-200">
            <span className="text-base">🎙️</span>
            <div>
              <strong className="block text-slate-900 dark:text-slate-100 font-bold">समय अनुसार वॉयस वेलकम:</strong>
              <span>ऐप खुलते ही आपका दिन शुभ हो / शुभ संध्या / शुभ रात्रि बोलते हुए स्वागत होगा।</span>
            </div>
          </div>
        </div>

        {/* Platform Specific Action / Help */}
        {isIOS ? (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs space-y-1 text-amber-900 dark:text-amber-200">
            <p className="font-bold flex items-center gap-1">
              <span>🍎 iPhone / iPad पर कैसे इंस्टॉल करें:</span>
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
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0e2238] via-slate-900 to-[#0e2238] hover:brightness-110 text-amber-300 font-black rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl border border-amber-500/40 transition active:scale-95 cursor-pointer disabled:opacity-60"
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
                      : (isDesktop ? '💻 डेस्कटॉप पर ऐप इंस्टॉल / डाउनलोड करें' : '📲 अपना ऐप डाउनलोड / इंस्टॉल करें')}
                  </span>
                </>
              )}
            </button>

            {isDesktop && !deferredPrompt && (
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-[11px] text-blue-800 dark:text-blue-200 leading-tight flex items-start gap-2">
                <Laptop className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>
                  <strong>डेस्कटॉप Chrome टिप:</strong> अगर बटन से सीधा पॉपअप न आए, तो Chrome URL बार में दाईं ओर <strong>⬇️ (Install)</strong> आइकन पर क्लिक करें।
                </span>
              </div>
            )}

            <p className="text-[10px] text-center text-slate-400">
              आधिकारिक बोलती कलम लोगो • सुरक्षित PWA एप्लीकेशन
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default PWAInstallModal;
