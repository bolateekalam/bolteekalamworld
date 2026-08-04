import React, { useRef, useState } from 'react';
import { X, Download, Share2, Copy, Check, Sparkles, Quote, Heart } from 'lucide-react';

const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

export const PoemCardShareModal = ({ isOpen, onClose, post }) => {
  const cardRef = useRef(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !post) return null;

  const authorName = post.author?.name || 'साहित्य साधक';
  const authorUsername = post.author?.username || '@writer';
  const authorAvatar = post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';

  // Download Poem Card as High-Resolution PNG Image
  const handleDownloadPNG = () => {
    setDownloading(true);
    try {
      const cardElement = cardRef.current;
      if (!cardElement) return;

      const safeContent = (post.content || '').substring(0, 300).replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const safeTitle = (post.title || 'बिना शीर्षक').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      const svgData = `
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: sans-serif; background: #fffcf7; color: #1e293b; padding: 32px; border-radius: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); width: 536px; height: 536px; border: 2px solid #e2e8f0; position: relative; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f43f5e; padding-bottom: 12px; margin-bottom: 20px;">
                  <div style="font-size: 20px; font-weight: 800; color: #e11d48;">बोलती कलम (Bolti Kalam)</div>
                  <div style="background: #ffe4e6; color: #e11d48; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 700;">${post.category || 'कविता'}</div>
                </div>
                <div style="font-size: 22px; font-weight: 800; color: #881337; margin-bottom: 16px;">${safeTitle}</div>
                <div style="font-size: 15px; line-height: 1.7; color: #334155; white-space: pre-wrap; font-style: italic;">"${safeContent}"</div>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 16px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <img src="${authorAvatar}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid #e11d48;" />
                  <div>
                    <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${authorName}</div>
                    <div style="font-size: 11px; color: #64748b;">${authorUsername}</div>
                  </div>
                </div>
                <div style="font-size: 11px; font-weight: 700; color: #e11d48;">www.bolteekalamvoice.in</div>
              </div>
            </div>
          </foreignObject>
        </svg>
      `;

      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `BoltiKalam_Poem_${safeTitle.replace(/\s+/g, '_')}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
        setDownloading(false);
      };
      img.src = url;
    } catch (e) {
      setDownloading(false);
    }
  };

  const handleShareWhatsApp = () => {
    const poemSnippet = (post.content || '').substring(0, 180);
    const shareText = `📜 '${post.title}' — ${authorName}\n\n"${poemSnippet}..."\n\nबोलती कलम पर पूरी कविता पढ़ने हेतु क्लिक करें:\nhttps://bolteekalamvoice.in/#/${authorUsername.replace(/^@/,'')}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleCopyLink = () => {
    const link = `https://bolteekalamvoice.in/#/${authorUsername.replace(/^@/,'')}`;
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
              रचना साझा करें (Share Poem Card)
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
        <div
          ref={cardRef}
          className="p-6 rounded-3xl bg-amber-50/90 dark:bg-slate-800 border-2 border-rose-500/30 text-slate-900 dark:text-slate-100 shadow-xl space-y-4 relative overflow-hidden"
        >
          <div className="flex justify-between items-center border-b border-rose-500/20 pb-2">
            <span className="text-sm font-rozha text-rose-700 dark:text-rose-400">बोलती कलम (Bolti Kalam)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 font-bold uppercase">{post.category || 'कविता'}</span>
          </div>

          <div>
            <h4 className="text-lg font-bold text-rose-950 dark:text-rose-100 font-rozha mb-2">{post.title}</h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-tiro leading-relaxed italic line-clamp-6">
              "{post.content}"
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-rose-500/20 text-xs">
            <div className="flex items-center gap-2">
              <img src={authorAvatar} alt={authorName} className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-500" />
              <div>
                <span className="font-bold block text-slate-900 dark:text-slate-100 text-xs">{authorName}</span>
                <span className="text-[10px] text-slate-500">{authorUsername}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-rose-600">bolteekalamvoice.in</span>
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
            <span>{downloading ? 'PNG डाउनलोड हो रहा...' : 'PNG डाउनलोड करें'}</span>
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
