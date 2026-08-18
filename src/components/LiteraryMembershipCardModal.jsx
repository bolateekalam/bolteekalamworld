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
  
  const userEmail = userProfile?.email || 'user';
  const savedCustomAvatar = localStorage.getItem(`custom_avatar_${userEmail}`) || localStorage.getItem('custom_avatar_global');
  const userAvatar = savedCustomAvatar || userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';

  const startDateStr = '05 अगस्त 2026';
  const endDateStr = '05 फ़रवरी 2027';

  const getSequentialMembershipId = () => {
    try {
      const key = `bw_seq_mem_id_${userEmail}`;
      const existing = localStorage.getItem(key);
      if (existing) return existing;

      let counter = parseInt(localStorage.getItem('bw_global_mem_counter') || '1', 10);
      if (isNaN(counter) || counter < 1) counter = 1;
      const numStr = counter.toString().padStart(3, '0');
      const newId = `BW-MEM-2026-${numStr}`;
      
      localStorage.setItem(key, newId);
      localStorage.setItem('bw_global_mem_counter', (counter + 1).toString());
      return newId;
    } catch (e) {
      return 'BW-MEM-2026-001';
    }
  };

  const membershipId = getSequentialMembershipId();
  const shareProfileUrl = `https://www.bolateeworld.in/profile/${cleanUsername}`;

  // Generate 4:5 Aspect Ratio (1080x1350) Bright Parchment Royal Membership Certificate PNG
  const generateCanvasPNG = () => {
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

      // Bright Warm Parchment Royal Background
      const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1350);
      bgGrad.addColorStop(0, '#fffdf9');   // Warm Cream
      bgGrad.addColorStop(0.5, '#fef3c7'); // Soft Gold Parchment
      bgGrad.addColorStop(1, '#fffbf0');   // Rich Linen
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1350);

      // Sleek 24px Rounded Crimson Outer Border
      ctx.strokeStyle = '#be123c';
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.restore();

      // 2. Top Header Branding (GUARANTEED NO OVERLAPPING!)
      ctx.fillStyle = '#881337';
      ctx.font = 'bold 44px serif';
      ctx.fillText('बोलती कलम (bolateeworld.in)', 75, 115);

      ctx.fillStyle = '#be123c';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('राष्ट्रीय 6-माह डिजिटल साहित्यिक सदस्यता पत्र', 75, 155);

      // Membership Serial Badge Box (Top Right cleanly inside frame)
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(710, 75, 295, 55);
      ctx.strokeStyle = '#be123c';
      ctx.lineWidth = 2;
      ctx.strokeRect(710, 75, 295, 55);

      ctx.fillStyle = '#881337';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(`क्रमांक: ${membershipId}`, 730, 110);

      // Header Divider Line
      ctx.strokeStyle = '#be123c';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(75, 180);
      ctx.lineTo(1005, 180);
      ctx.stroke();

      // 3. Large Centered Member Avatar (Y = 330)
      const avatarImg = new Image();
      avatarImg.crossOrigin = 'anonymous';

      const drawCardDetails = () => {
        // Member Name (Centered Y = 495)
        ctx.fillStyle = '#881337';
        ctx.font = 'bold 46px serif';
        const nameWidth = ctx.measureText(userName).width;
        ctx.fillText(userName, (1080 - nameWidth) / 2, 495);

        // Member Username (Centered Y = 545)
        ctx.fillStyle = '#be123c';
        ctx.font = 'bold 26px sans-serif';
        const userText = `@${cleanUsername}`;
        const userWidth = ctx.measureText(userText).width;
        ctx.fillText(userText, (1080 - userWidth) / 2, 545);

        // Verified Badge Pill (Centered Y = 595)
        const badgeText = '✓ 100% नि:शुल्क सदस्य (bolateeworld.in)';
        ctx.font = 'bold 20px sans-serif';
        const badgeWidth = ctx.measureText(badgeText).width + 36;
        const badgeX = (1080 - badgeWidth) / 2;

        ctx.fillStyle = '#dcfce7';
        ctx.fillRect(badgeX, 570, badgeWidth, 38);
        ctx.strokeStyle = '#16a34a';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(badgeX, 570, badgeWidth, 38);

        ctx.fillStyle = '#15803d';
        ctx.fillText(badgeText, badgeX + 18, 596);

        // 4. Literary Motto Box (Centered Y = 685, H = 95)
        ctx.fillStyle = '#fff1f2';
        ctx.fillRect(90, 640, 900, 95);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.strokeRect(90, 640, 900, 95);

        ctx.fillStyle = '#9f1239';
        ctx.font = 'italic bold 25px serif';
        const mottoText = '"साहित्य, भाषा एवं सर्व-समावेशी अभिव्यक्ति को समर्पित निष्ठावान सदस्य।"';
        const mottoWidth = ctx.measureText(mottoText).width;
        ctx.fillText(mottoText, (1080 - mottoWidth) / 2, 698);

        // 5. 6-Month Perks & Official YouTube Feature Box (Centered Y = 860, H = 150)
        ctx.fillStyle = '#881337'; // Royal Deep Crimson
        ctx.fillRect(90, 765, 900, 155);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(90, 765, 900, 155);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px sans-serif';
        const validText = `📅 सदस्यता अवधि: ${startDateStr} — ${endDateStr} (6 माह)`;
        const validWidth = ctx.measureText(validText).width;
        ctx.fillText(validText, (1080 - validWidth) / 2, 810);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 22px sans-serif';
        const perkText = '✓ असीमित रचना प्रकाशन • डिजिटल सम्मान पत्र • काव्य गोष्ठी';
        const perkWidth = ctx.measureText(perkText).width;
        ctx.fillText(perkText, (1080 - perkWidth) / 2, 855);

        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 21px sans-serif';
        const ytText = '▶ Boltee Kalam Official YouTube Feature & Podcasts';
        const ytWidth = ctx.measureText(ytText).width;
        ctx.fillText(ytText, (1080 - ytWidth) / 2, 895);

        // 7. Official Certification & Signatures Footer (ZERO OVERLAPPING GUARANTEED!)
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(75, 1180);
        ctx.lineTo(1005, 1180);
        ctx.stroke();

        // Left Signature Text
        ctx.fillStyle = '#475569';
        ctx.font = '20px sans-serif';
        ctx.fillText('बोलती कलम — आधिकारिक डिजिटल पहचान पत्र', 75, 1235);

        // Right Signature Text (Calculated alignment from right edge 1005 so it NEVER overlaps!)
        ctx.fillStyle = '#881337';
        ctx.font = 'bold 22px sans-serif';
        const signRightText = 'प्रमाणित: संस्थापक संजय राय (Sanjay Rai)';
        const signRightWidth = ctx.measureText(signRightText).width;
        ctx.fillText(signRightText, 1005 - signRightWidth, 1235);

        resolve(canvas);
      };

      avatarImg.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(540, 330, 100, 0, Math.PI * 2, true);
        ctx.clip();
        ctx.drawImage(avatarImg, 440, 230, 200, 200);
        ctx.restore();

        ctx.strokeStyle = '#be123c';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.arc(540, 330, 103, 0, Math.PI * 2, true);
        ctx.stroke();

        drawCardDetails();
      };

      avatarImg.onerror = () => {
        drawCardDetails();
      };

      avatarImg.src = userAvatar;
    });
  };

  const handleDownloadPNG = async () => {
    setDownloading(true);
    try {
      const canvas = await generateCanvasPNG();
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `BoltiKalam_Membership_Card_${cleanUsername}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('PNG download error:', e);
    } finally {
      setDownloading(false);
    }
  };

  const handleShareWhatsApp = async () => {
    try {
      const canvas = await generateCanvasPNG();
      
      canvas.toBlob(async (blob) => {
        if (blob && navigator.share && navigator.canShare) {
          const file = new File([blob], `BoltiKalam_Membership_${cleanUsername}.png`, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                title: 'बोलती कलम सदस्यता पत्र',
                text: '',
                files: [file]
              });
              return;
            } catch (err) {
              if (err.name !== 'AbortError') {
                console.warn('File share fallback:', err);
              }
            }
          }
        }

        const shareText = `🚩 बोलती कलम (bolateeworld.in) — राष्ट्रीय साहित्यिक मंच\n\nयह मेरा 6-माह नि:शुल्क डिजिटल साहित्यिक सदस्यता पत्र है (क्रमांक: ${membershipId})।\n\nआप भी आज ही बोलती कलम पर 6-माह नि:शुल्क सदस्य बनें:\n${shareProfileUrl}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
      }, 'image/png');
    } catch (e) {
      const shareText = `🚩 बोलती कलम (bolateeworld.in)\n${shareProfileUrl}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareProfileUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-rose-600 via-rose-700 to-amber-500 text-white flex items-center justify-center shadow">
              <Award className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                <span>6-माह नि:शुल्क सदस्यता पत्र (HD PNG)</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                ✓ 100% डिजिटल प्रमाणित सदस्यता
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

        {/* 4:5 Aspect Ratio Bright Parchment Royal Membership Card */}
        <div className="relative w-full aspect-[4/5] p-5 rounded-3xl bg-gradient-to-br from-amber-50 via-amber-100/60 to-rose-50 border-4 border-rose-700 text-slate-900 shadow-2xl overflow-hidden flex flex-col justify-between">
          
          <div className="absolute -right-8 -bottom-8 opacity-10 text-rose-800 pointer-events-none">
            <Sparkles className="w-48 h-48" />
          </div>

          {/* Card Top Branding Header */}
          <div className="flex items-center justify-between border-b border-rose-700/30 pb-2 z-10">
            <div>
              <span className="text-base font-rozha text-rose-950 block tracking-wide">
                बोलती कलम (bolateeworld.in)
              </span>
              <span className="text-[9px] text-rose-700 font-bold block">
                राष्ट्रीय 6-माह डिजिटल साहित्यिक सदस्यता पत्र
              </span>
            </div>
            <div className="px-2 py-0.5 rounded-lg bg-amber-200/80 border border-rose-700/50 text-rose-900 text-[10px] font-extrabold shrink-0">
              क्रमांक: {membershipId}
            </div>
          </div>

          {/* User Avatar & Name Center */}
          <div className="my-auto space-y-2.5 text-center z-10">
            <img
              src={userAvatar}
              alt={userName}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-rose-700 shadow-xl mx-auto"
            />
            <div>
              <h4 className="text-lg font-bold text-rose-950 flex items-center justify-center gap-1.5">
                <span>{userName}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </h4>
              <p className="text-xs text-rose-700 font-bold">@{cleanUsername}</p>
            </div>

            <div className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-500 text-emerald-800 text-[10px] font-bold inline-block mx-auto">
              ✓ 100% नि:शुल्क सदस्य (bolateeworld.in)
            </div>

            <div className="p-2.5 rounded-xl bg-rose-100/70 border border-rose-300 text-rose-900 text-[11px] italic font-tiro max-w-xs mx-auto">
              "साहित्य, भाषा एवं सर्व-समावेशी अभिव्यक्ति को समर्पित निष्ठावान सदस्य।"
            </div>

            <div className="p-2.5 rounded-xl bg-rose-900 text-white flex items-center justify-between text-[10px] sm:text-[11px] gap-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span><strong>अवधि:</strong> {startDateStr} — {endDateStr}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-rose-950 text-[9px] font-bold shrink-0">
                ✓ 6 माह नि:शुल्क
              </span>
            </div>
          </div>

          {/* Footer Signatures */}
          <div className="flex items-center justify-between text-[9px] text-slate-600 font-medium pt-2 border-t border-rose-700/30 z-10">
            <span>बोलती कलम — डिजिटल पहचान पत्र</span>
            <span className="font-bold text-rose-900">प्रमाणित: संस्थापक संजय राय (Sanjay Rai)</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleDownloadPNG}
            disabled={downloading}
            className="py-2.5 px-3 bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'डाउनलोड हो रहा...' : 'PNG कार्ड डाउनलोड करें'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95"
          >
            <WhatsAppIcon />
            <span>WhatsApp पर कार्ड शेयर करें</span>
          </button>

          <a
            href="https://www.youtube.com/@bolateekalam"
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95"
          >
            <span>🔴 Boltee Kalam YouTube चैनल सब्सक्राइब करें</span>
          </a>

          <button
            onClick={handleCopyShareLink}
            className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'प्रोफ़ाइल लिंक कॉपी हुआ!' : 'प्रोफ़ाइल लिंक कॉपी करें'}</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition"
        >
          बंद करें
        </button>

      </div>
    </div>
  );
};

export default LiteraryMembershipCardModal;
