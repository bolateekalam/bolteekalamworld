import React, { useState } from 'react';
import { X, ThumbsUp, MessageSquare, Image, Upload, CheckCircle2, Clock, ShieldCheck, Sparkles, AlertCircle, ExternalLink, Loader2, ListOrdered, AlertTriangle, Ban } from 'lucide-react';
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
  onSubmitProof,
  allProofs = []
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('submit'); // 'submit' | 'history'
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const userEmail = userProfile?.email || currentUser?.email || 'user';
  const isBanned = Boolean(
    userProfile?.isYtBanned || 
    localStorage.getItem(`bw_yt_banned_${userEmail}`) === 'true'
  );
  const strikesCount = parseInt(localStorage.getItem(`bw_yt_strikes_${userEmail}`) || '0', 10);

  // Filter this user's submitted proofs
  const myProofs = allProofs.filter(p => 
    p.userEmail === userEmail || 
    (currentUser?.id && p.userId === currentUser.id) ||
    (userProfile?.username && p.userUsername === userProfile.username)
  );

  const handleOpenYouTubeVideo = () => {
    window.open('https://www.youtube.com/@bolteekalam', '_blank');
  };

  const handleImageUpload = (e) => {
    if (isBanned) return;
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

    if (isBanned) {
      setError('आप इस टास्क के लिए स्थायी रूप से ब्लॉक किए गए हैं!');
      return;
    }

    if (!screenshotPreview) {
      setError('कृपया यूट्यूब वीडियो लाइक व कमेंट का स्क्रीनशॉट अपलोड करें!');
      return;
    }

    setIsSubmitting(true);

    const proofData = {
      id: `proof-${Date.now()}`,
      userId: currentUser?.id || 'u-me',
      userName: userProfile?.name || currentUser?.name || 'साहित्य साधक',
      userEmail: userEmail,
      userUsername: userProfile?.username || currentUser?.username || '@writer',
      userAvatar: userProfile?.avatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      screenshotUrl: screenshotPreview,
      notes: notes.trim(),
      points: 10,
      status: 'pending', // 'pending' | 'approved' | 'rejected' | 'penalty50' | 'penalty100' | 'banned'
      submittedAt: new Date().toLocaleString('hi-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      timestamp: Date.now()
    };

    if (onSubmitProof) {
      onSubmitProof(proofData);
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    setScreenshotPreview(null);
    setNotes('');

    setTimeout(() => {
      setIsSuccess(false);
      setActiveTab('history');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto relative">
        
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

        {/* Tab Switcher: Submit vs History */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl gap-1">
          <button
            onClick={() => setActiveTab('submit')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'submit'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>टास्क सबमिट करें</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>मेरे सबमिट टास्क ({myProofs.length})</span>
          </button>
        </div>

        {/* Permanent Ban Warning */}
        {isBanned && (
          <div className="p-4 bg-red-500/10 border-2 border-red-500 rounded-2xl flex items-start gap-3 text-red-700 dark:text-red-300 text-xs animate-in fade-in">
            <Ban className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm">यूट्यूब टास्क से ब्लॉक (Permanently Banned)</h4>
              <p>
                बार-बार डुप्लीकेट या अमान्य स्क्रीनशॉट सबमिट करने के कारण आपको इस सेक्शन से स्थायी रूप से ब्लॉक कर दिया गया है।
              </p>
            </div>
          </div>
        )}

        {/* Strike Warning (If any) */}
        {!isBanned && strikesCount > 0 && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/40 rounded-2xl flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 font-semibold">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>आपके खाते पर <strong>{strikesCount}/3 स्ट्राइक</strong> दर्ज हैं।</span>
            </div>
            <span className="text-[10px] font-bold bg-amber-200 dark:bg-amber-900/40 px-2 py-0.5 rounded">
              चेतावनी
            </span>
          </div>
        )}

        {/* TAB 1: Submit Proof */}
        {activeTab === 'submit' && (
          <>
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
                    <div className="relative rounded-2xl overflow-hidden border-2 border-rose-500/50 bg-slate-950 p-2 flex flex-col items-center">
                      <img 
                        src={screenshotPreview} 
                        alt="Screenshot Preview" 
                        className="max-h-56 w-auto object-contain rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setScreenshotPreview(null)}
                        className="absolute top-3 right-3 p-1.5 bg-rose-600 text-white rounded-full shadow hover:bg-rose-700 transition"
                        title="हटाएं"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className={`border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 transition bg-slate-50 dark:bg-slate-800/40 ${isBanned ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                      <Upload className="w-8 h-8 text-rose-500" />
                      <div className="text-center">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                          स्क्रीनशॉट चुनने के लिए क्लिक करें
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          PNG, JPG (अधिकतम 10MB)
                        </span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        disabled={isBanned}
                        onChange={handleImageUpload} 
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>

                {/* Additional Note (Optional) */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    अतिरिक्त विवरण / यूट्यूब यूज़रनेम (वैकल्पिक):
                  </label>
                  <input
                    type="text"
                    value={notes}
                    disabled={isBanned}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="उदा. @my_youtube_handle या वीडियो का शीर्षक"
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                {/* Anti-Fraud Warning Box */}
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800 rounded-xl text-[11px] text-amber-900 dark:text-amber-200 space-y-0.5">
                  <p className="font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>सख्त नियम व पेनल्टी सूचना:</span>
                  </p>
                  <p>
                    कृपया केवल वास्तविक स्क्रीनशॉट ही सबमिट करें। बार-बार समान या फेक स्क्रीनशॉट सबमिट करने पर <strong>-50 Pts</strong> (1st Strike), <strong>-100 Pts</strong> (2nd Strike) और 3rd Strike पर <strong>हमेशा के लिए ब्लॉक</strong> कर दिया जाएगा।
                  </p>
                </div>

                {error && (
                  <p className="text-xs text-rose-600 font-bold bg-rose-50 dark:bg-rose-900/30 p-2.5 rounded-xl border border-rose-300">
                    ⚠️ {error}
                  </p>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !screenshotPreview || isBanned}
                  className="w-full py-3 bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-700 hover:to-rose-800 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>सबमिट हो रहा है...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>स्क्रीनशॉट सत्यापन हेतु सबमिट करें (+10 Pts)</span>
                    </>
                  )}
                </button>

              </form>
            )}
          </>
        )}

        {/* TAB 2: Task History */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              आपके द्वारा सबमिट किए गए स्क्रीनशॉट व स्थिति:
            </h4>

            {myProofs.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl space-y-2 border border-slate-200 dark:border-slate-800">
                <Clock className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  आपने अभी तक कोई यूट्यूब टास्क सबमिट नहीं किया है।
                </p>
                <button
                  onClick={() => setActiveTab('submit')}
                  className="px-3.5 py-1.5 bg-rose-600 text-white font-bold rounded-xl text-xs"
                >
                  पहला टास्क सबमिट करें →
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                {myProofs.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.screenshotUrl && (
                        <img 
                          src={item.screenshotUrl} 
                          alt="Thumbnail" 
                          className="w-12 h-12 object-cover rounded-xl border border-slate-300 dark:border-slate-600 shrink-0" 
                        />
                      )}
                      <div className="min-w-0">
                        <span className="font-bold block truncate text-slate-900 dark:text-slate-100">
                          {item.notes || 'यूट्यूब लाइक/कमेंट टास्क'}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          🕒 {item.submittedAt}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {item.status === 'pending' ? (
                        <span className="px-2.5 py-1 bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold rounded-full text-[10px] flex items-center gap-1">
                          <Clock className="w-3 h-3 animate-pulse" />
                          <span>⏳ पेंडिंग</span>
                        </span>
                      ) : item.status === 'approved' ? (
                        <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold rounded-full text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>✓ +10 Pts क्रेडिट</span>
                        </span>
                      ) : item.status === 'penalty50' ? (
                        <span className="px-2.5 py-1 bg-red-500/20 text-red-700 dark:text-red-300 font-extrabold rounded-full text-[10px]">
                          ⚠️ पेनल्टी (-50 Pts)
                        </span>
                      ) : item.status === 'penalty100' ? (
                        <span className="px-2.5 py-1 bg-red-500/20 text-red-700 dark:text-red-300 font-extrabold rounded-full text-[10px]">
                          ⚠️ पेनल्टी (-100 Pts)
                        </span>
                      ) : item.status === 'banned' ? (
                        <span className="px-2.5 py-1 bg-red-600 text-white font-extrabold rounded-full text-[10px]">
                          🚫 ब्लॉक किया गया
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-rose-500/20 text-rose-700 dark:text-rose-300 font-extrabold rounded-full text-[10px]">
                          ❌ अस्वीकृत
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default YouTubeTaskModal;
