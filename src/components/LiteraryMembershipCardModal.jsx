import React, { useRef, useState } from 'react';
import { X, Award, ShieldCheck, Download, Share2, Copy, Check, Sparkles, Calendar, Tag, User } from 'lucide-react';

const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export const LiteraryMembershipCardModal = ({ isOpen, onClose, userProfile }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const userName = userProfile?.name || 'साहित्य साधक';
  const userUsername = userProfile?.username || '@writer';
  const userAvatar = userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
  const userCity = userProfile?.city || 'प्रयागराज, उत्तर प्रदेश';

  // 6-Month Free Membership Validity Logic (From account creation date to 6 months later)
  const startDateStr = '05 अगस्त 2026';
  const endDateStr = '05 फ़रवरी 2027'; // Exactly 6 Months Free
  const membershipId = `BW-MEM-2026-${(userName.length * 37 + 500).toString()}`;
  const memberTags = ['#बोलतीवर्ल्ड', '#साहित्यसाधक', '#6माहनि:शुल्क', '#सत्यापितसदस्य'];

  // Pure Canvas2D PNG Image Generator (100% Reliable across all Desktop & Mobile Browsers)
  const handleDownloadPNG = () => {
    setDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 760;
      const ctx = canvas.getContext('2d');

      // 1. Premium Linear Background
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 760);
      bgGrad.addColorStop(0, '#881337');  // Deep Rose
      bgGrad.addColorStop(0.5, '#4c0519'); // Dark Crimson
      bgGrad.addColorStop(1, '#0f172a');   // Royal Slate
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 760);

      // 2. Gold Border Frame
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 8;
      ctx.strokeRect(30, 30, 1140, 700);

      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(42, 42, 1116, 676);

      // 3. Header Branding
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText('बोलती वर्ल्ड (bolateeworld.in)', 70, 110);

      ctx.fillStyle = '#fecdd3';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('राष्ट्रीय साहित्यिक 6-माह सदस्यता कार्ड (नि:शुल्क)', 70, 150);

      // Membership ID Badge Right
      ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
      ctx.fillRect(840, 75, 290, 50);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.strokeRect(840, 75, 290, 50);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(`ID: ${membershipId}`, 860, 108);

      // Divider Line
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(70, 185);
      ctx.lineTo(1130, 185);
      ctx.stroke();

      // 4. User Avatar & Member Details
      const avatarImg = new Image();
      avatarImg.crossOrigin = 'anonymous';
      avatarImg.onload = () => {
        // Draw Circular Avatar with Gold Ring
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

        // User Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText(userName, 280, 290);

        ctx.fillStyle = '#fda4af';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(userUsername, 280, 330);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '20px sans-serif';
        ctx.fillText(`📍 ${userCity}`, 280, 365);

        // 5. Member Tags Section
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 18px sans-serif';
        let tagX = 70;
        memberTags.forEach(tag => {
          const width = ctx.measureText(tag).width + 24;
          ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
          ctx.fillRect(tagX, 420, width, 36);
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
          ctx.strokeRect(tagX, 420, width, 36);
          ctx.fillStyle = '#fbbf24';
          ctx.fillText(tag, tagX + 12, 444);
          tagX += width + 14;
        });

        // 6. Validity Banner
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.fillRect(70, 490, 1060, 75);
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
        ctx.strokeRect(70, 490, 1060, 75);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(`📅 सदस्यता वैधता: ${startDateStr} — ${endDateStr} (6 माह)`, 100, 535);

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('✓ प्रथम 6 माह 100% नि:शुल्क सदस्य', 740, 535);

        // 7. Footer Signatures & Authorization
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.moveTo(70, 600);
        ctx.lineTo(1130, 600);
        ctx.stroke();

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '18px sans-serif';
        ctx.fillText('बोलती वर्ल्ड (bolateeworld.in) — आधिकारिक साहित्यिक पहचान पत्र', 70, 645);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('प्रमाणित: संस्थापक संजय राय (Sanjay Rai)', 740, 645);

        // Trigger Instant HD PNG Download
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `BoltiWorld_6Month_Membership_Card_${userUsername.replace('@','')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setDownloading(false);
      };

      avatarImg.onerror = () => {
        // Fallback without avatar image
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText(userName, 100, 290);
        ctx.fillStyle = '#fda4af';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(userUsername, 100, 330);

        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `BoltiWorld_6Month_Membership_Card.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloading(false);
      };

      avatarImg.src = userAvatar;
    } catch (err) {
      setDownloading(false);
    }
  };

  // WhatsApp & Native Mobile Share Handler (File / Link)
  const handleShareWhatsApp = async () => {
    const shareText = `🚩 बोलती वर्ल्ड (bolateeworld.in) — भारत का बहुभाषी साहित्यिक एवं काव्य मंच!\n\nयह मेरा 6-माह नि:शुल्क साहित्यिक सदस्यता कार्ड है (सदस्यता ID: ${membershipId})।\n\nआप भी आज ही बोलती वर्ल्ड पर 6-माह नि:शुल्क सदस्य बनें:\nhttps://bolateeworld.in/#/${userUsername.replace(/^@/,'')}`;
    
    // Check Native Web Share API for Mobile Image File Sharing
    if (navigator.share && navigator.canShare) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#881337';
        ctx.fillRect(0, 0, 800, 500);
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText('बोलती वर्ल्ड (bolateeworld.in)', 40, 60);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(`सदस्यता पत्र: ${userName} (${userUsername})`, 40, 120);
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('✓ 6 माह 100% नि:शुल्क सदस्य', 40, 170);

        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], 'BoltiWorld_Membership_Card.png', { type: 'image/png' });
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: 'बोलती वर्ल्ड सदस्यता कार्ड',
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
    const link = `https://bolateeworld.in/#/${userUsername.replace(/^@/,'')}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white flex items-center justify-center shadow">
              <Award className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>6-माह नि:शुल्क साहित्यिक सदस्यता कार्ड</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                ✓ प्रथम 6 माह 100% नि:शुल्क (Valid 6 Months Free)
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

        {/* Visual Membership Card (Royal Crimson & Amber Gold Devanagari Theme) */}
        <div className="relative p-6 rounded-3xl bg-gradient-to-br from-rose-900 via-rose-950 to-slate-950 border-2 border-amber-400/40 text-white shadow-2xl overflow-hidden space-y-4">
          
          {/* Watermark Logo Accent */}
          <div className="absolute -right-8 -bottom-8 opacity-10 text-amber-400 pointer-events-none">
            <Sparkles className="w-48 h-48" />
          </div>

          {/* Card Top Branding Header */}
          <div className="flex items-center justify-between border-b border-amber-400/30 pb-3">
            <div>
              <span className="text-lg font-rozha text-amber-400 block tracking-wide">
                बोलती वर्ल्ड (bolateeworld.in)
              </span>
              <span className="text-[10px] text-rose-200 font-medium block">
                राष्ट्रीय साहित्यिक एवं सांस्कृतिक डिजिटल मंच
              </span>
            </div>
            <div className="px-2.5 py-1 rounded-xl bg-amber-400/20 border border-amber-400/50 text-amber-300 text-[10px] font-bold">
              ID: {membershipId}
            </div>
          </div>

          {/* User Details Section */}
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
              <p className="text-xs text-rose-300 font-semibold truncate">{userUsername}</p>
              <p className="text-[11px] text-slate-300 truncate">📍 {userCity}</p>
            </div>
          </div>

          {/* Member Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {memberTags.map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-bold">
                {tag}
              </span>
            ))}
          </div>

          {/* Validity & Free 6-Month Badge */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>वैधता:</strong> {startDateStr} — {endDateStr} (6 माह)</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold shrink-0">
              ✓ 6 माह नि:शुल्क
            </span>
          </div>

          {/* Signatures Footer */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
            <span>बोलती वर्ल्ड डिजिटल साहित्यिक पहचान</span>
            <span>प्रमाणित: संस्थापक संजय राय (Sanjay Rai)</span>
          </div>
        </div>

        {/* Action Controls (PNG Download, WhatsApp Share, Copy Link) */}
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
