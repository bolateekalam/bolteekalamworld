import React, { useState } from 'react';
import { X, Award, ShieldCheck, Download, Share2, Copy, Check, Sparkles, Calendar } from 'lucide-react';

const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

export const LiteraryMembershipCardModal = ({ isOpen, onClose, userProfile }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const userName = userProfile?.name || 'साहित्य साधक';
  const cleanUsername = (userProfile?.username || 'writer').replace(/^[@#]/, '');
  
  // Custom avatar from localStorage or userProfile
  const userEmail = userProfile?.email || 'user';
  const savedCustomAvatar = localStorage.getItem(`custom_avatar_${userEmail}`) || localStorage.getItem('custom_avatar_global');
  const userAvatar = savedCustomAvatar || userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';

  // 6-Month Free Membership Validity Logic (05 अगस्त 2026 से 05 फ़रवरी 2027)
  const startDateStr = '05 अगस्त 2026';
  const endDateStr = '05 फ़रवरी 2027';

  // Sequential Serial Membership ID Format: BW-MEM-2026-001, BW-MEM-2026-002, etc.
  const getSequentialMembershipId = () => {
    const key = `bw_seq_mem_id_${userEmail}`;
    const existing = localStorage.getItem(key);
    if (existing) return existing;

    let counter = parseInt(localStorage.getItem('bw_global_mem_counter') || '1', 10);
    const numStr = counter.toString().padStart(3, '0');
    const newId = `BW-MEM-2026-${numStr}`;
    
    localStorage.setItem(key, newId);
    localStorage.setItem('bw_global_mem_counter', (counter + 1).toString());
    return newId;
  };

  const membershipId = getSequentialMembershipId();
  const shareProfileUrl = `https://www.bolateeworld.in/profile/${cleanUsername}`;

  // Pure Canvas2D HD PNG Image Generator
  const handleDownloadPNG = () => {
    setDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 760;
      const ctx = canvas.getContext('2d');

      // 1. Royal Dark Crimson Background
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 760);
      bgGrad.addColorStop(0, '#70071c');  // Deep Royal Crimson
      bgGrad.addColorStop(0.5, '#450a0a'); // Dark Parchment Maroon
      bgGrad.addColorStop(1, '#0f172a');   // Slate Base
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 760);

      // 2. Gold Filigree Border
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 8;
      ctx.strokeRect(30, 30, 1140, 700);

      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(42, 42, 1116, 676);

      // 3. Header Branding
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText('बोलती कलम (bolateeworld.in)', 70, 110);

      ctx.fillStyle = '#fecdd3';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('राष्ट्रीय 6-माह डिजिटल साहित्यिक सदस्यता पत्र', 70, 150);

      // Membership ID Badge (BW-MEM-2026-001, etc.)
      ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
      ctx.fillRect(820, 75, 310, 50);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.strokeRect(820, 75, 310, 50);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(`क्रमांक: ${membershipId}`, 840, 108);

      // Divider Line
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(70, 185);
      ctx.lineTo(1130, 185);
      ctx.stroke();

      // 4. Avatar Image & Member Details
      const avatarImg = new Image();
      avatarImg.crossOrigin = 'anonymous';
      avatarImg.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(160, 310, 80, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatarImg, 80, 230, 160, 160);
        ctx.restore();

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(160, 310, 82, 0, Math.PI * 2, true);
        ctx.stroke();

        // User Details
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 38px sans-serif';
        ctx.fillText(userName, 280, 290);

        ctx.fillStyle = '#fda4af';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(`${cleanUsername}`, 280, 335);

        // 5. Formal Literary Motto
        ctx.fillStyle = '#fef08a';
        ctx.font = 'italic 22px sans-serif';
        ctx.fillText('"साहित्य, भाषा एवं सर्व-समावेशी अभिव्यक्ति को समर्पित निष्ठावान सदस्य।"', 70, 435);

        // 6. Validity Banner
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(70, 485, 1060, 80);
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
        ctx.strokeRect(70, 485, 1060, 80);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(`📅 सदस्यता अवधि: ${startDateStr} — ${endDateStr} (6 माह)`, 100, 532);

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('✓ 6 माह 100% नि:शुल्क सदस्य', 740, 532);

        // 7. Footer Signatures
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.moveTo(70, 605);
        ctx.lineTo(1130, 605);
        ctx.stroke();

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '18px sans-serif';
        ctx.fillText('बोलती कलम (bolateeworld.in) — आधिकारिक डिजिटल पहचान पत्र', 70, 650);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('प्रमाणित: संस्थापक संजय राय (Sanjay Rai)', 740, 650);

        // Trigger Instant Download
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `BoltiKalam_Membership_Card_${cleanUsername}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setDownloading(false);
      };

      avatarImg.onerror = () => {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 38px sans-serif';
        ctx.fillText(userName, 100, 290);
        ctx.fillStyle = '#fda4af';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(`${cleanUsername}`, 100, 335);

        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `BoltiKalam_Membership_Card.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setDownloading(false);
      };

      avatarImg.src = userAvatar;
    } catch (e) {
      setDownloading(false);
    }
  };

  // WhatsApp & Native Mobile Share
  const handleShareWhatsApp = async () => {
    const shareText = `🚩 बोलती कलम (bolateeworld.in) — राष्ट्रीय साहित्यिक मंच\n\nयह मेरा 6-माह नि:शुल्क डिजिटल साहित्यिक सदस्यता पत्र है (क्रमांक: ${membershipId})।\n\nआप भी आज ही बोलती कलम पर 6-माह नि:शुल्क सदस्य बनें:\n${shareProfileUrl}`;

    if (navigator.share && navigator.canShare) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 900;
        canvas.height = 560;
        const ctx = canvas.getContext('2d');
        const bgGrad = ctx.createLinearGradient(0, 0, 900, 560);
        bgGrad.addColorStop(0, '#70071c');
        bgGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 900, 560);

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 6;
        ctx.strokeRect(20, 20, 860, 520);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText('बोलती कलम (bolateeworld.in)', 50, 70);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 30px sans-serif';
        ctx.fillText(`सदस्यता पत्र: ${userName} (${cleanUsername})`, 50, 140);

        ctx.fillStyle = '#fef08a';
        ctx.font = 'italic 20px sans-serif';
        ctx.fillText('"साहित्य, भाषा एवं अभिव्यक्ति को समर्पित निष्ठावान सदस्य।"', 50, 200);

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('✓ 6 माह 100% नि:शुल्क सदस्य', 50, 260);

        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], 'BoltiKalam_Membership_Card.png', { type: 'image/png' });
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: 'बोलती कलम सदस्यता पत्र',
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

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareProfileUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 via-rose-700 to-amber-500 text-white flex items-center justify-center shadow">
              <Award className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>6-माह नि:शुल्क डिजिटल साहित्यिक सदस्यता पत्र</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                ✓ प्रथम 6 माह 100% नि:शुल्क सदस्य (bolateeworld.in)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="सदस्यता कार्ड बंद करें"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Membership Card */}
        <div className="relative p-6 rounded-3xl bg-gradient-to-br from-rose-950 via-rose-900 to-slate-950 border-2 border-amber-400/40 text-white shadow-2xl overflow-hidden space-y-4">
          
          <div className="absolute -right-8 -bottom-8 opacity-10 text-amber-400 pointer-events-none">
            <Sparkles className="w-48 h-48" />
          </div>

          {/* Card Top Branding Header */}
          <div className="flex items-center justify-between border-b border-amber-400/30 pb-3">
            <div>
              <span className="text-lg font-rozha text-amber-400 block tracking-wide">
                बोलती कलम (bolateeworld.in)
              </span>
              <span className="text-[10px] text-rose-200 font-medium block">
                राष्ट्रीय डिजिटल साहित्यिक मंच
              </span>
            </div>
            <div className="px-2.5 py-1 rounded-xl bg-amber-400/20 border border-amber-400/50 text-amber-300 text-[10px] font-bold">
              क्रमांक: {membershipId}
            </div>
          </div>

          {/* User Details */}
          <div className="flex items-center gap-4">
            <img
              src={userAvatar}
              alt={userName}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-amber-400 shadow-md shrink-0"
            />
            <div className="space-y-0.5 min-w-0 flex-1">
              <h4 className="text-base font-bold text-white truncate flex items-center gap-1.5">
                <span>{userName}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              </h4>
              <p className="text-xs text-rose-300 font-semibold truncate">{cleanUsername}</p>
            </div>
          </div>

          {/* Formal Literary Motto */}
          <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-200 text-xs italic font-tiro">
            "साहित्य, भाषा एवं सर्व-समावेशी अभिव्यक्ति को समर्पित निष्ठावान सदस्य।"
          </div>

          {/* Validity Banner */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>अवधि:</strong> {startDateStr} — {endDateStr} (6 माह)</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold shrink-0">
              ✓ 6 माह नि:शुल्क
            </span>
          </div>

          {/* Footer Signatures */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
            <span>बोलती कलम डिजिटल पहचान पत्र</span>
            <span>प्रमाणित: संस्थापक संजय राय (Sanjay Rai)</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <button
            onClick={handleDownloadPNG}
            disabled={downloading}
            className="py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'PNG डाउनलोड हो रहा...' : 'PNG इमेज़ डाउनलोड करें'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="py-2.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95"
          >
            <WhatsAppIcon />
            <span>WhatsApp पर शेयर करें</span>
          </button>

          <button
            onClick={handleCopyShareLink}
            className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'लिंक कॉपी हुआ!' : 'लिंक कॉपी करें'}</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition"
        >
          बंद करें (Close)
        </button>

      </div>
    </div>
  );
};

export default LiteraryMembershipCardModal;
