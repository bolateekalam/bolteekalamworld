import React, { useState } from 'react';
import { X, Download, Share2, Copy, Check, Sparkles, ShieldCheck, Lock, AlertCircle } from 'lucide-react';

const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
  </svg>
);

export const PoemCardShareModal = ({ 
  isOpen, 
  onClose, 
  post, 
  isUserOwnPost = false,
  userPoints = 30,
  onDeductPoints
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPoemText, setCopiedPoemText] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharingWhatsApp, setSharingWhatsApp] = useState(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState('');

  if (!isOpen || !post) return null;

  const authorName = post.author?.name || 'साहित्य साधक';
  const authorUsername = post.author?.username || '@writer';
  const authorAvatar = post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
  const poemTitle = post.title || 'बिना शीर्षक';
  const poemContent = post.content || '';
  const hasAttachedPosterImage = Boolean(post.imageUrl || post.image);
  const attachedPosterUrl = post.imageUrl || post.image;

  const cleanUser = authorUsername.replace(/^[@#]/, '');
  const postShareUrl = `https://www.bolateeworld.in/profile/${cleanUser}`;
  const shareText = `📜 *${poemTitle}*\n\n"${poemContent.slice(0, 180)}${poemContent.length > 180 ? '...' : ''}"\n\n✍️ रचनाकार: ${authorName} (${authorUsername})\n🌐 पढ़ें बोलती वर्ल्ड पर: ${postShareUrl}`;

  // Clean poem lines
  const poemLines = poemContent.split('\n').map(line => {
    return line.replace(/^["'“”«»-]+|["'“”«»-]+$/g, '').trim();
  });

  const validLinesCount = poemLines.filter(l => l.length > 0).length;

  // Generate 4:5 Aspect Ratio Canvas PNG with or without watermark
  const generateCanvasPNG = (withWatermark = true) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');

      ctx.save();
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(14, 14, 1052, 1322, 28);
      } else {
        ctx.rect(14, 14, 1052, 1322);
      }
      ctx.clip();

      // Parchment Royal Background
      ctx.fillStyle = '#fffdf9';
      ctx.fillRect(0, 0, 1080, 1350);

      // Border
      ctx.strokeStyle = '#0e2238';
      ctx.lineWidth = 10;
      ctx.stroke();

      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.strokeRect(28, 28, 1024, 1294);
      ctx.restore();

      // Top Brand
      ctx.fillStyle = '#0e2238';
      ctx.font = 'bold 36px serif';
      ctx.fillText('बोलती वर्ल्ड', 75, 95);

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('(bolateeworld.in)', 260, 95);

      // Title
      ctx.fillStyle = '#881337';
      ctx.font = 'bold 44px serif';
      const titleWidth = ctx.measureText(poemTitle).width;
      ctx.fillText(poemTitle, (1080 - titleWidth) / 2, 190);

      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(300, 215);
      ctx.lineTo(780, 215);
      ctx.stroke();

      // Poem Lines
      ctx.fillStyle = '#1e293b';
      let startY = 320;
      let fontSize = validLinesCount <= 8 ? 32 : validLinesCount <= 14 ? 26 : 22;
      let lineHeight = fontSize * 1.8;
      ctx.font = `${fontSize}px serif`;

      poemLines.slice(0, 18).forEach((line) => {
        if (line === '') {
          startY += lineHeight * 0.5;
        } else {
          const lineWidth = ctx.measureText(line).width;
          ctx.fillText(line, (1080 - lineWidth) / 2, startY);
          startY += lineHeight;
        }
      });

      // Bottom Footer Author Info
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(65, 1220);
      ctx.lineTo(1015, 1220);
      ctx.stroke();

      ctx.fillStyle = '#0e2238';
      ctx.font = 'bold 26px serif';
      ctx.fillText(`✍️ रचनाकार: ${authorName}`, 75, 1275);

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`${authorUsername}`, 75, 1310);

      // Watermark Stamp
      if (withWatermark) {
        ctx.fillStyle = '#881337';
        ctx.font = 'bold 22px sans-serif';
        const wmText = 'बोलती वर्ल्ड • bolateeworld.in';
        const wmWidth = ctx.measureText(wmText).width;
        ctx.fillText(wmText, 1005 - wmWidth, 1290);
      }

      resolve(canvas);
    });
  };

  const handleDownloadPNG = async (withWatermark = true) => {
    if (!isUserOwnPost) {
      alert('⚠️ डाउनलोड केवल मूल लेखक के लिए उपलब्ध है। आप इसे सोशल मीडिया पर शेयर कर सकते हैं!');
      return;
    }

    if (!withWatermark) {
      if ((userPoints || 0) < 10) {
        alert('⚠️ बिना वॉटरमार्क HD डाउनलोड के लिए कम से कम 10 रिवॉर्ड पॉइंट्स आवश्यक हैं।');
        return;
      }
      if (onDeductPoints) {
        onDeductPoints(10, 'रचना पोस्टर बिना वॉटरमार्क डाउनलोड करने पर');
      }
    }

    setDownloading(true);
    try {
      const canvas = await generateCanvasPNG(withWatermark);
      const link = document.createElement('a');
      link.download = `BolateeWorld_${poemTitle.replace(/\s+/g, '_')}_${withWatermark ? 'Watermark' : 'HD'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setDownloadSuccessMsg(withWatermark ? '✓ वॉटरमार्क सहित पोस्टर डाउनलोड हो गया!' : '✓ बिना वॉटरमार्क HD पोस्टर डाउनलोड हुआ! (-10 Pts)');
      setTimeout(() => setDownloadSuccessMsg(''), 4000);
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setDownloading(false);
    }
  };

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postShareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleShareInstagram = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedPoemText(true);
    setTimeout(() => {
      window.open('https://www.instagram.com', '_blank');
      setCopiedPoemText(false);
    }, 800);
  };

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-4 sm:p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-rozha">
              रचना शेयर व पोस्टर
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Card Preview */}
        <div className="p-4 rounded-2xl bg-[#fffdf9] dark:bg-slate-800/80 border-2 border-[#0e2238] shadow-inner space-y-2">
          <div className="flex items-center justify-between text-xs border-b border-slate-200 dark:border-slate-700 pb-2">
            <div className="flex items-center gap-1.5">
              <img src="/logo.png" alt="Bolti World" className="w-5 h-5 object-contain" />
              <span className="font-bold text-[#0e2238] dark:text-amber-200">बोलती वर्ल्ड</span>
            </div>
            <span className="text-[10px] text-slate-500">bolateeworld.in</span>
          </div>

          <h4 className="font-bold text-sm text-center font-rozha text-rose-900 dark:text-rose-300 pt-1">
            {poemTitle}
          </h4>

          <div className="font-tiro text-xs text-slate-800 dark:text-slate-200 max-h-36 overflow-y-auto space-y-0.5 pr-1 leading-relaxed text-center">
            {poemLines.slice(0, 8).map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-700 dark:text-slate-300">✍️ {authorName}</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold">{authorUsername}</span>
          </div>
        </div>

        {/* Success Message Banner */}
        {downloadSuccessMsg && (
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500 rounded-xl text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
            {downloadSuccessMsg}
          </div>
        )}

        {/* 1-Click Social Sharing Actions */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            🚀 सोशल मीडिया पर शेयर करें:
          </span>

          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={handleShareWhatsApp}
              className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-1 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleShareFacebook}
              className="py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-1 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <FacebookIcon className="w-4 h-4" />
              <span>Facebook</span>
            </button>

            <button
              onClick={handleShareInstagram}
              className="py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-1 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Instagram</span>
            </button>

            <button
              onClick={handleShareTwitter}
              className="py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-1 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <TwitterIcon className="w-4 h-4" />
              <span>X (Twitter)</span>
            </button>
          </div>

          {/* Download Permissions Area */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {!isUserOwnPost ? (
              <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-1">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>रचनाकार कॉपीराइट संरक्षण</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  डाउनलोड केवल रचनाकार के लिए उपलब्ध है। आप इसे सीधे सोशल मीडिया पर शेयर कर सकते हैं।
                </p>
                <button
                  onClick={handleCopyLink}
                  className="w-full mt-1.5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'लिंक कॉपी हुआ!' : 'रचना लिंक कॉपी करें'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  📥 अपनी रचना का पोस्टर डाउनलोड करें:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Option 1: Free with Watermark */}
                  <button
                    onClick={() => handleDownloadPNG(true)}
                    disabled={downloading}
                    className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold rounded-xl text-xs flex flex-col items-center justify-center gap-0.5 transition active:scale-95 cursor-pointer text-center"
                  >
                    <div className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5 text-rose-600" />
                      <span>मुफ़्त डाउनलोड</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal">(bolateeworld.in वॉटरमार्क सहित)</span>
                  </button>

                  {/* Option 2: 10 Points without Watermark */}
                  <button
                    onClick={() => handleDownloadPNG(false)}
                    disabled={downloading}
                    className="p-2.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:brightness-110 text-white font-bold rounded-xl text-xs flex flex-col items-center justify-center gap-0.5 transition active:scale-95 shadow cursor-pointer text-center"
                  >
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                      <span>HD डाउनलोड (-10 Pts)</span>
                    </div>
                    <span className="text-[10px] text-amber-100 font-normal">(बिना वॉटरमार्क क्रिस्टल HD)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default PoemCardShareModal;
