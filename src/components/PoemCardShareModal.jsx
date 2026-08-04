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

  if (!isOpen || !post) return null;

  const authorName = post.author?.name || 'साहित्य साधक';
  const authorUsername = post.author?.username || '@writer';
  const authorAvatar = post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
  const poemTitle = post.title || 'बिना शीर्षक';
  const poemContent = post.content || '';
  const poemTags = post.tags || ['#हिंदीसाहित्य', '#बोलतीवर्ल्ड', '#कविता'];

  // Pure Canvas2D PNG Image Download Handler
  const handleDownloadPNG = () => {
    setDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');

      // Parchment Royal Background
      ctx.fillStyle = '#fffcf7';
      ctx.fillRect(0, 0, 1000, 1000);

      // Crimson Double Frame
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, 940, 940);

      ctx.strokeStyle = 'rgba(225, 29, 72, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(42, 42, 916, 916);

      // Header Branding
      ctx.fillStyle = '#881337';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('बोलती वर्ल्ड (bolateeworld.in)', 70, 110);

      ctx.fillStyle = '#e11d48';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`श्रेणी: ${post.category || 'कविता'}`, 760, 110);

      // Divider Line
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(70, 140);
      ctx.lineTo(930, 140);
      ctx.stroke();

      // Poem Title
      ctx.fillStyle = '#881337';
      ctx.font = 'bold 38px sans-serif';
      ctx.fillText(poemTitle, 70, 210);

      // Poem Content Lines
      ctx.fillStyle = '#1e293b';
      ctx.font = 'italic 24px serif';
      const lines = poemContent.split('\n');
      let currentY = 280;

      lines.forEach((lineText, idx) => {
        if (idx < 14 && currentY < 720) {
          ctx.fillText(`"${lineText.trim()}"`, 80, currentY);
          currentY += 42;
        }
      });

      // Tags Chips
      let tagX = 70;
      ctx.font = 'bold 18px sans-serif';
      poemTags.forEach(tag => {
        const width = ctx.measureText(tag).width + 24;
        ctx.fillStyle = '#ffe4e6';
        ctx.fillRect(tagX, 770, width, 36);
        ctx.strokeStyle = '#f43f5e';
        ctx.strokeRect(tagX, 770, width, 36);
        ctx.fillStyle = '#e11d48';
        ctx.fillText(tag, tagX + 12, 794);
        tagX += width + 14;
      });

      // Author Footer
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(70, 840);
      ctx.lineTo(930, 840);
      ctx.stroke();

      const avatarImg = new Image();
      avatarImg.crossOrigin = 'anonymous';
      avatarImg.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(110, 900, 36, 0, Math.PI * 2, true);
        ctx.clip();
        ctx.drawImage(avatarImg, 74, 864, 72, 72);
        ctx.restore();

        ctx.strokeStyle = '#e11d48';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(110, 900, 37, 0, Math.PI * 2, true);
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText(authorName, 170, 895);

        ctx.fillStyle = '#64748b';
        ctx.font = '20px sans-serif';
        ctx.fillText(authorUsername, 170, 925);

        ctx.fillStyle = '#e11d48';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('www.bolateeworld.in', 700, 910);

        // Download PNG File
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `BoltiWorld_Poem_${poemTitle.replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setDownloading(false);
      };

      avatarImg.onerror = () => {
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText(authorName, 70, 900);
        ctx.fillStyle = '#e11d48';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('www.bolateeworld.in', 700, 900);

        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `BoltiWorld_Poem_${poemTitle.replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setDownloading(false);
      };

      avatarImg.src = authorAvatar;
    } catch (e) {
      setDownloading(false);
    }
  };

  const handleShareWhatsApp = async () => {
    const poemSnippet = (poemContent || '').substring(0, 180);
    const shareText = `📜 '${poemTitle}' — ${authorName}\n\n"${poemSnippet}..."\n\nबोलती वर्ल्ड पर पूरी कविता पढ़ें:\nhttps://bolateeworld.in/#/${authorUsername.replace(/^@/,'')}`;

    if (navigator.share && navigator.canShare) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fffcf7';
        ctx.fillRect(0, 0, 600, 600);
        ctx.fillStyle = '#e11d48';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(poemTitle, 40, 60);
        ctx.fillStyle = '#334155';
        ctx.font = '16px serif';
        ctx.fillText(`"${poemSnippet}..."`, 40, 120);

        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], 'BoltiWorld_Poem.png', { type: 'image/png' });
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: poemTitle,
                text: shareText,
                files: [file]
              });
              return;
            }
          }
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
        });
        return;
      } catch (e) {}
    }

    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleCopyLink = () => {
    const link = `https://bolateeworld.in/#/${authorUsername.replace(/^@/,'')}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              रचना साझ करें (Share Poem PNG Card)
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label="शेयर मॉडल बंद करें"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Parchment Preview Card */}
        <div className="p-6 rounded-3xl bg-amber-50/90 dark:bg-slate-800 border-2 border-rose-500/30 text-slate-900 dark:text-slate-100 shadow-xl space-y-4 relative overflow-hidden">
          <div className="flex justify-between items-center border-b border-rose-500/20 pb-2">
            <span className="text-sm font-rozha text-rose-700 dark:text-rose-400">बोलती वर्ल्ड (bolateeworld.in)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 font-bold uppercase">{post.category || 'कविता'}</span>
          </div>

          <div>
            <h4 className="text-lg font-bold text-rose-950 dark:text-rose-100 font-rozha mb-2">{poemTitle}</h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-tiro leading-relaxed italic line-clamp-6">
              "{poemContent}"
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {poemTags.map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-300 text-[10px] font-bold">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-rose-500/20 text-xs">
            <div className="flex items-center gap-2">
              <img src={authorAvatar} alt={authorName} className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-500" />
              <div>
                <span className="font-bold block text-slate-900 dark:text-slate-100 text-xs">{authorName}</span>
                <span className="text-[10px] text-slate-500">{authorUsername}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-rose-600">bolateeworld.in</span>
          </div>
        </div>

        {/* Share & Download Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={handleDownloadPNG}
            disabled={downloading}
            className="py-2.5 px-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'PNG डाउनलोड हो रहा...' : 'PNG इमेज़ डाउनलोड करें'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="py-2.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95"
          >
            <WhatsAppIcon />
            <span>WhatsApp पर शेयर</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'लिंक कॉपी हुआ!' : 'लिंक कॉपी करें'}</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl text-xs"
        >
          बंद करें
        </button>

      </div>
    </div>
  );
};

export default PoemCardShareModal;
