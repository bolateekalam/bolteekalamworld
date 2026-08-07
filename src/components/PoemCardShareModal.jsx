import React, { useState } from 'react';
import { X, Download, Share2, Copy, Check, Sparkles } from 'lucide-react';

const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

export const PoemCardShareModal = ({ isOpen, onClose, post }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharingWhatsApp, setSharingWhatsApp] = useState(false);

  if (!isOpen || !post) return null;

  const authorName = post.author?.name || 'साहित्य साधक';
  const authorUsername = post.author?.username || '@writer';
  const authorAvatar = post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
  const poemTitle = post.title || 'बिना शीर्षक';
  const poemContent = post.content || '';
  const hasAttachedPosterImage = Boolean(post.imageUrl || post.image);
  const attachedPosterUrl = post.imageUrl || post.image;

  // Clean poem lines
  const poemLines = poemContent.split('\n').map(line => {
    return line.replace(/^["'“”«»-]+|["'“”«»-]+$/g, '').trim();
  });

  const validLinesCount = poemLines.filter(l => l.length > 0).length;

  // Helper to convert Base64 Data URL to Blob File for native sharing
  const dataURLtoBlob = (dataurl) => {
    try {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    } catch (e) {
      return null;
    }
  };

  // Generate 4:5 Aspect Ratio Canvas PNG for text posts
  const generateCanvasPNG = () => {
    if (hasAttachedPosterImage && attachedPosterUrl) {
      return Promise.resolve(attachedPosterUrl);
    }

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');

      // 1. Clip Canvas with 24px Rounded Outer Corners
      ctx.save();
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(12, 12, 1056, 1326, 24);
      } else {
        ctx.rect(12, 12, 1056, 1326);
      }
      ctx.clip();

      // Parchment Royal Background
      ctx.fillStyle = '#fffdf9';
      ctx.fillRect(0, 0, 1080, 1350);

      // Sleek 24px Rounded Crimson Outer Border
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.restore();

      // 3. Top Header Bar: Title at Top Left, Category at Top Right
      ctx.fillStyle = '#881337';
      ctx.font = 'bold 42px serif';
      const truncatedTopTitle = poemTitle.length > 22 ? poemTitle.slice(0, 22) + '...' : poemTitle;
      ctx.fillText(truncatedTopTitle, 75, 115);

      ctx.fillStyle = '#e11d48';
      ctx.font = 'bold 24px sans-serif';
      const categoryText = `श्रेणी: ${post.category || 'कविता'}`;
      const catWidth = ctx.measureText(categoryText).width;
      ctx.fillText(categoryText, 1005 - catWidth, 115);

      // 4. Header Divider Line
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(75, 150);
      ctx.lineTo(1005, 150);
      ctx.stroke();

      let fontSize = 38;
      let lineHeight = 64;
      let fontWeight = 'bold';

      if (validLinesCount <= 6) {
        fontSize = 42;
        lineHeight = 68;
        fontWeight = 'bold';
      } else if (validLinesCount <= 10) {
        fontSize = 34;
        lineHeight = 54;
        fontWeight = 'bold';
      } else if (validLinesCount <= 16) {
        fontSize = 28;
        lineHeight = 44;
        fontWeight = 'normal';
      } else {
        fontSize = 24;
        lineHeight = 38;
        fontWeight = 'normal';
      }

      ctx.fillStyle = '#1e293b';
      ctx.font = `${fontWeight} ${fontSize}px serif`;

      let currentY = 240;
      const maxLinesY = 1140;

      const renderLinesList = validLinesCount > 0 ? poemLines : ['★ बोलती कलम साहित्य रचना...'];

      for (let i = 0; i < renderLinesList.length; i++) {
        const line = renderLinesList[i];
        if (currentY > maxLinesY) break;

        if (line === '') {
          currentY += Math.round(lineHeight * 0.6);
        } else {
          ctx.fillText(line, 75, currentY);
          currentY += lineHeight;
        }
      }

      // Footer Divider
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(75, 1170);
      ctx.lineTo(1005, 1170);
      ctx.stroke();

      const avatarImg = new Image();
      avatarImg.crossOrigin = 'anonymous';

      const drawFooterDetails = () => {
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 30px sans-serif';
        ctx.fillText(authorName, 180, 1240);

        ctx.fillStyle = '#64748b';
        ctx.font = '22px sans-serif';
        ctx.fillText(authorUsername, 180, 1275);

        ctx.fillStyle = '#e11d48';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText('www.bolateeworld.in', 720, 1255);

        resolve(canvas.toDataURL('image/png'));
      };

      avatarImg.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(115, 1250, 44, 0, Math.PI * 2, true);
        ctx.clip();
        ctx.drawImage(avatarImg, 71, 1206, 88, 88);
        ctx.restore();

        ctx.strokeStyle = '#e11d48';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(115, 1250, 45, 0, Math.PI * 2, true);
        ctx.stroke();

        drawFooterDetails();
      };

      avatarImg.onerror = () => {
        drawFooterDetails();
      };

      avatarImg.src = authorAvatar;
    });
  };

  // Pure PNG Download Handler
  const handleDownloadPNG = async () => {
    setDownloading(true);
    try {
      const imageUrl = await generateCanvasPNG();
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `Bolateeworld_${poemTitle.replace(/\s+/g, '_')}_Poster.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('PNG download error:', e);
    } finally {
      setDownloading(false);
    }
  };

  // WhatsApp & Native Share Handler - Shares ACTUAL Poster PNG Image!
  const handleShareWhatsApp = async () => {
    setSharingWhatsApp(true);

    try {
      const imageUrl = await generateCanvasPNG();
      const blob = dataURLtoBlob(imageUrl);

      if (blob && navigator.share && navigator.canShare) {
        const file = new File([blob], `Bolateeworld_${poemTitle.replace(/\s+/g, '_')}.png`, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: poemTitle,
              text: `📜 *${poemTitle}* — ${authorName}\nbolateeworld.in`,
              files: [file]
            });
            setSharingWhatsApp(false);
            return;
          } catch (err) {
            if (err.name !== 'AbortError') {
              console.warn('File share fallback:', err);
            }
          }
        }
      }

      // Web Fallback: Direct Download of PNG Image + WhatsApp Link
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `Bolateeworld_${poemTitle.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const cleanUser = authorUsername.replace(/^[@#]/, '');
      const shareLinkText = `📜 *${poemTitle}* — ${authorName}\nhttps://www.bolateeworld.in/profile/${cleanUser}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareLinkText)}`, '_blank');
    } catch (e) {
      console.error('WhatsApp share error:', e);
    } finally {
      setSharingWhatsApp(false);
    }
  };

  const handleCopyLink = () => {
    const cleanUser = authorUsername.replace(/^[@#]/, '');
    const link = `https://www.bolateeworld.in/profile/${cleanUser}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              रचना पोस्टर कार्ड साझा करें (HD Image)
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label="मॉडल बंद करें"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Poster Image Preview Container */}
        {hasAttachedPosterImage ? (
          <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-rose-600/40 bg-slate-950">
            <img 
              src={attachedPosterUrl} 
              alt={poemTitle} 
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="relative w-full aspect-[4/5] p-5 rounded-3xl bg-[#fffdf9] dark:bg-slate-900 border-4 border-rose-600/80 text-slate-900 dark:text-slate-100 shadow-xl flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-2 border border-rose-600/20 rounded-2xl pointer-events-none" />

            <div className="flex justify-between items-center border-b border-rose-600/30 pb-2 z-10">
              <h4 className="text-base sm:text-lg font-bold font-rozha text-rose-900 dark:text-rose-300 truncate max-w-[240px]">
                {poemTitle}
              </h4>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 font-extrabold uppercase shrink-0">
                श्रेणी: {post.category || 'कविता'}
              </span>
            </div>

            <div className="my-auto py-2 z-10 overflow-hidden space-y-1">
              <div className={`font-tiro text-slate-900 dark:text-slate-100 max-h-[250px] overflow-y-auto pr-1 ${
                validLinesCount <= 6 ? 'text-sm sm:text-base font-bold leading-relaxed' : validLinesCount <= 10 ? 'text-xs sm:text-sm font-semibold leading-relaxed' : 'text-xs leading-normal'
              }`}>
                {poemLines.map((line, idx) => (
                  line === '' ? (
                    <div key={idx} className="h-2.5" />
                  ) : (
                    <p key={idx} className="py-0.5">
                      {line}
                    </p>
                  )
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-300 dark:border-slate-800 flex items-center justify-between text-xs z-10">
              <div className="flex items-center gap-2">
                <img 
                  src={authorAvatar} 
                  alt={authorName} 
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-600" 
                />
                <div className="min-w-0">
                  <span className="font-bold block text-slate-900 dark:text-slate-100 text-xs truncate max-w-[130px]">
                    {authorName}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate block">
                    {authorUsername}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-extrabold text-rose-600 dark:text-rose-400">
                www.bolateeworld.in
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons: WhatsApp Share & PNG Download */}
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShareWhatsApp}
              disabled={sharingWhatsApp}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition disabled:opacity-50"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
              <span>{sharingWhatsApp ? 'शेयर हो रहा...' : 'WhatsApp पर शेयर'}</span>
            </button>

            <button
              onClick={handleDownloadPNG}
              disabled={downloading}
              className="py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'डाउनलोडिंग...' : 'HD इमेज़ डाउनलोड'}</span>
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'लिंक कॉपी हो गया!' : 'प्रोफ़ाइल लिंक कॉपी करें'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default PoemCardShareModal;
