import React, { useState } from 'react';
import { X, Download, Share2, Copy, Check, Sparkles, Image as ImageIcon } from 'lucide-react';

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

  // Clean poem lines - remove unwanted surrounding quotes or dashes
  const poemLines = poemContent.split('\n').map(line => {
    return line.replace(/^["'“”«»-]+|["'“”«»-]+$/g, '').trim();
  });

  // Generate 4:5 Aspect Ratio (1080x1350) Canvas PNG
  const generateCanvasPNG = () => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');

      // 1. Parchment Background
      ctx.fillStyle = '#fffdf9';
      ctx.fillRect(0, 0, 1080, 1350);

      // 2. Double Crimson Frame
      ctx.strokeStyle = '#be123c';
      ctx.lineWidth = 8;
      ctx.strokeRect(36, 36, 1008, 1278);

      ctx.strokeStyle = 'rgba(190, 18, 60, 0.25)';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 50, 980, 1250);

      // 3. Top Header Bar: Post Title at Top Left, Category at Top Right
      ctx.fillStyle = '#881337';
      ctx.font = 'bold 36px serif';
      const truncatedTopTitle = poemTitle.length > 25 ? poemTitle.slice(0, 25) + '...' : poemTitle;
      ctx.fillText(truncatedTopTitle, 75, 115);

      ctx.fillStyle = '#e11d48';
      ctx.font = 'bold 22px sans-serif';
      const categoryText = `श्रेणी: ${post.category || 'कविता'}`;
      const catWidth = ctx.measureText(categoryText).width;
      ctx.fillText(categoryText, 1005 - catWidth, 115);

      // 4. Header Divider Line
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(75, 145);
      ctx.lineTo(1005, 145);
      ctx.stroke();

      // 5. Main Poem Title
      ctx.fillStyle = '#881337';
      ctx.font = 'bold 44px serif';
      ctx.fillText(poemTitle, 75, 225);

      // 6. Render Poem Lines (No quotes, no dashes, clean stanza gaps)
      ctx.fillStyle = '#1e293b';
      ctx.font = '26px serif';

      let currentY = 295;
      const maxLinesY = 1140;

      for (let i = 0; i < poemLines.length; i++) {
        const line = poemLines[i];
        if (currentY > maxLinesY) break;

        if (line === '') {
          // Empty line / stanza gap: advance Y space without drawing quotes or dashes
          currentY += 28;
        } else {
          ctx.fillText(line, 80, currentY);
          currentY += 46;
        }
      }

      // 7. Footer Divider Line
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(75, 1180);
      ctx.lineTo(1005, 1180);
      ctx.stroke();

      // 8. Footer Author Info & Website Brand URL
      const avatarImg = new Image();
      avatarImg.crossOrigin = 'anonymous';

      const drawFooterDetails = () => {
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(authorName, 175, 1240);

        ctx.fillStyle = '#64748b';
        ctx.font = '20px sans-serif';
        ctx.fillText(authorUsername, 175, 1272);

        ctx.fillStyle = '#e11d48';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('www.bolateeworld.in', 740, 1255);

        resolve(canvas);
      };

      avatarImg.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(115, 1250, 42, 0, Math.PI * 2, true);
        ctx.clip();
        ctx.drawImage(avatarImg, 73, 1208, 84, 84);
        ctx.restore();

        ctx.strokeStyle = '#e11d48';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(115, 1250, 43, 0, Math.PI * 2, true);
        ctx.stroke();

        drawFooterDetails();
      };

      avatarImg.onerror = () => {
        drawFooterDetails();
      };

      avatarImg.src = authorAvatar;
    });
  };

  // Pure PNG Download Handler (4:5 Ratio)
  const handleDownloadPNG = async () => {
    setDownloading(true);
    try {
      const canvas = await generateCanvasPNG();
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `Bolateeworld_${poemTitle.replace(/\s+/g, '_')}_4x5.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('PNG download error:', e);
    } finally {
      setDownloading(false);
    }
  };

  // WhatsApp Native File & Text Share Handler
  const handleShareWhatsApp = async () => {
    setSharingWhatsApp(true);
    const cleanUser = authorUsername.replace(/^[@#]/, '');
    const poemSnippet = poemLines.filter(l => l.length > 0).slice(0, 6).join('\n');
    
    const shareText = `📜 *${poemTitle}*\n✍️ *रचनाकार:* ${authorName} (${authorUsername})\n\n${poemSnippet}\n\n📖 पूरी रचना बोलती कलम पर पढ़ें:\nhttps://www.bolateeworld.in/profile/${cleanUser}`;

    try {
      const canvas = await generateCanvasPNG();
      
      // Try Web Share API with 4:5 PNG Image File for direct WhatsApp Image/Status Sharing
      canvas.toBlob(async (blob) => {
        if (blob && navigator.share && navigator.canShare) {
          const file = new File([blob], `${poemTitle.replace(/\s+/g, '_')}_4x5.png`, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                title: poemTitle,
                text: shareText,
                files: [file]
              });
              setSharingWhatsApp(false);
              return;
            } catch (err) {
              // User cancelled share modal
              if (err.name !== 'AbortError') {
                console.warn('File share fallback:', err);
              }
            }
          }
        }

        // Web Fallback: Automatically download 4:5 image and open WhatsApp with clean multi-line poem text
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `Bolateeworld_${poemTitle.replace(/\s+/g, '_')}_4x5.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
        setSharingWhatsApp(false);
      }, 'image/png');
    } catch (e) {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
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
              रचना कार्ड साझ करें (4:5 HD Image)
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

        {/* 4:5 Aspect Ratio Preview Parchment Card */}
        <div className="relative w-full aspect-[4/5] p-5 rounded-3xl bg-[#fffdf9] dark:bg-slate-900 border-4 border-rose-600/80 text-slate-900 dark:text-slate-100 shadow-xl flex flex-col justify-between overflow-hidden">
          
          {/* Inner Accent Line */}
          <div className="absolute inset-2 border border-rose-600/20 rounded-2xl pointer-events-none" />

          {/* Top Bar: Poem Title on Left, Category on Right */}
          <div className="flex justify-between items-center border-b border-rose-600/30 pb-2 z-10">
            <h4 className="text-base font-bold font-rozha text-rose-900 dark:text-rose-300 truncate max-w-[220px]">
              {poemTitle}
            </h4>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 font-extrabold uppercase shrink-0">
              श्रेणी: {post.category || 'कविता'}
            </span>
          </div>

          {/* Center Body: Title & Clean Poem Lines (No quotes, no dashes) */}
          <div className="my-auto py-2 z-10 overflow-hidden space-y-2">
            <h3 className="text-lg font-bold font-rozha text-rose-950 dark:text-rose-100">
              {poemTitle}
            </h3>
            
            <div className="font-tiro text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed max-h-[220px] overflow-y-auto pr-1">
              {poemLines.map((line, idx) => (
                line === '' ? (
                  <div key={idx} className="h-3" />
                ) : (
                  <p key={idx} className="py-0.5">
                    {line}
                  </p>
                )
              ))}
            </div>
          </div>

          {/* Footer: Author Info & Website Brand URL */}
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

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownloadPNG}
              disabled={downloading}
              className="py-2.5 px-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? '4:5 PNG डाउनलोड...' : '4:5 HD इमेज़ (PNG)'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              disabled={sharingWhatsApp}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95 disabled:opacity-50"
            >
              <WhatsAppIcon />
              <span>{sharingWhatsApp ? 'शेयर हो रहा...' : 'WhatsApp शेयर'}</span>
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'लिंक कॉपी हुआ!' : 'कविता लिंक कॉपी करें'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default PoemCardShareModal;
