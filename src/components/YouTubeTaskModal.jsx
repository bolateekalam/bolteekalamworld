import React, { useState } from 'react';
import { X, ThumbsUp, MessageSquare, Image, Upload, CheckCircle2, Clock, ShieldCheck, Sparkles, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const YouTubeIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const YouTubeTaskModal = ({ 
  isOpen, 
  onClose, 
  currentUser, 
  userProfile, 
  onSubmitProof 
}) => {
  const { t } = useLanguage();
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleOpenYouTubeVideo = () => {
    // Open official Boltee Kalam YouTube Video/Channel in new tab
    window.open('https://www.youtube.com/@bolteekalam', '_blank');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('कृपया 10MB से छोटी स्क्रीनशॉट इमेज चुनें!');
        return;
      }
      setError('');

      const reader = new FileReader();
      reader.onload = (event) => {
        const rawDataUrl = event.target.result;
        // Compress screenshot using Canvas2D
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setScreenshotPreview(compressed);
        };
        img.src = rawDataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = (e) => {
    e.preventDefault();
    setError('');

    if (!screenshotPreview) {
      setError('कृपया यूट्यूब वीडियो लाइक व कमेंट का स्क्रीनशॉट अपलोड करें!');
      return;
    }

    setIsSubmitting(true);

    const proofData = {
      id: `proof-${Date.now()}`,
      userId: currentUser?.id || 'u-me',
      userName: userProfile?.name || currentUser?.name || 'साहित्य साधक',
      userEmail: userProfile?.email || currentUser?.email || 'user@bolteekalam.com',
      userUsername: userProfile?.username || currentUser?.username || '@writer',
      userAvatar: userProfile?.avatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      screenshotUrl: screenshotPreview,
      notes: notes.trim(),
      points: 10,
      status: 'pending', // 'pending' | 'approved' | 'rejected'
      submittedAt: new Date().toLocaleString('hi-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      timestamp: Date.now()
    };

    if (onSubmitProof) {
      onSubmitProof(proofData);
    }

    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/10 text-rose-600 flex items-center justify-center font-bold">
              <YouTubeIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 font-rozha">
                बोलती कलम यूट्यूब स्पेशल टास्क
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>टास्क पूर्ण करने पर +10 रिवॉर्ड पॉइंट्स</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="खिड़की बंद करें"
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Banner */}
        {isSuccess ? (
          <div className="p-6 bg-emerald-500/10 border-2 border-emerald-500 rounded-2xl text-center space-y-2 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/30">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-emerald-700 dark:text-emerald-300 font-rozha">
              स्क्रीनशॉट सफलतापूर्वक सबमिट हो गया! 🎉
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              ⏳ आपका स्क्रीनशॉट सत्यापन के लिए भेज दिया गया है। <strong>24 से 48 घंटों में</strong> एडमिन अप्रूवल के बाद <strong>+10 रिवॉर्ड पॉइंट्स</strong> आपके वॉलेट में क्रेडिट कर दिए जाएंगे।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitProof} className="space-y-4">
            
            {/* Step Instructions Card */}
            <div className="p-3.5 bg-rose-50 dark:bg-slate-800/70 border border-rose-200 dark:border-slate-700 rounded-2xl space-y-2.5 text-xs">
              <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>टास्क पूरा करने के 3 सरल चरण:</span>
              </div>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                  <span>नीचे दिए गए बटन से बोलती कलम का <strong>यूट्यूब चैनल/वीडियो</strong> खोलें।</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>वीडियो को <strong>पूरा देखें, लाइक करें और एक सुंदर साहित्यिक कमेंट</strong> लिखें।</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                  <span>उसका <strong>स्क्रीनशॉट</strong> लेकर नीचे अपलोड करें।</span>
                </li>
              </ul>

              {/* YouTube Open Button */}
              <button
                type="button"
                onClick={handleOpenYouTubeVideo}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-95 cursor-pointer mt-1"
              >
                <YouTubeIcon className="w-4 h-4" />
                <span>यूट्यूब वीडियो व चैनल खोलें (YouTube Channel)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Upload Screenshot Area */}
            <div className="space-y-2">
              <label className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center justify-between">
                <span>यूट्यूब लाइक/कमेंट स्क्रीनशॉट अपलोड करें:</span>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">* अनिवार्य</span>
              </label>

              {screenshotPreview ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 max-h-48 bg-slate-950 flex items-center justify-center group">
                  <img 
                    src={screenshotPreview} 
                    alt="Proof Screenshot" 
                    className="w-full h-full object-contain max-h-48"
                  />
                  <button
                    type="button"
                    onClick={() => setScreenshotPreview(null)}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-full shadow hover:bg-rose-700 transition"
                    title="स्क्रीनशॉट हटाएँ"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-500 dark:hover:border-rose-500 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50 dark:bg-slate-800/40 transition">
                  <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    यहाँ क्लिक करके स्क्रीनशॉट चुनें
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    PNG, JPG, JPEG (अधिकतम 10MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Optional Comment/Notes */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                आपका यूट्यूब नाम या टिप्पणी (वैकल्पिक):
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="उदा. 'मैंने वीडियो लाइक कर दिया और कमेंट लिखा है'"
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Status Notice */}
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-700 dark:text-amber-300 flex items-start gap-2">
              <Clock className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>सत्यापन अवधि:</strong> सबमिशन के बाद यह 'पेंडिंग' रहेगा। एडमिन टीम <strong>24 से 48 घंटे</strong> में सत्यापन कर <strong>10 पॉइंट्स</strong> आपके खाते में क्रेडिट कर देगी।
              </span>
            </div>

            {error && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>सत्यापन हेतु भेजा जा रहा है...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>सत्यापन हेतु सबमिट करें (+10 Points Pending)</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default YouTubeTaskModal;
