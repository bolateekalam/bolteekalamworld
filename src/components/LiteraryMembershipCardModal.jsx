import React, { useState } from 'react';
import { X, Award, ShieldCheck, Download, Share2, Copy, Check, Sparkles, Calendar, MapPin, Feather, CheckCircle2, Star, ExternalLink } from 'lucide-react';

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

export const LiteraryMembershipCardModal = ({ isOpen, onClose, userProfile }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const userName = userProfile?.name || 'साहित्य साधक';
  const cleanUsername = (userProfile?.username || 'writer').replace(/^[@#]/, '');
  const userCity = userProfile?.city || 'प्रयागराज';
  const userGenre = userProfile?.genre || 'कविता (Poetry)';
  
  const userEmail = userProfile?.email || 'user';
  const savedCustomAvatar = localStorage.getItem(`custom_avatar_${userEmail}`) || localStorage.getItem('custom_avatar_global');
  const userAvatar = savedCustomAvatar || userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';

  // Dynamic Hindi Date Formatter & Exact 6-Month Account Lifetime Calculation
  const formatHindiDate = (d) => {
    const hindiMonths = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
    const day = d.getDate().toString().padStart(2, '0');
    const month = hindiMonths[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const rawCreated = userProfile?.createdAt || localStorage.getItem(`bw_account_created_${userEmail}`) || new Date().toISOString();
  const createdDate = new Date(rawCreated);
  const validCreatedDate = isNaN(createdDate.getTime()) ? new Date() : createdDate;

  // Issue date is the exact platform account creation date
  const startDateStr = formatHindiDate(validCreatedDate);

  // Expiry date is exactly 6 months from account creation date
  const expiryDate = new Date(validCreatedDate);
  expiryDate.setMonth(expiryDate.getMonth() + 6);
  const endDateStr = formatHindiDate(expiryDate);

  // Check if 6 months lifetime has passed
  const isExpired = new Date().getTime() > expiryDate.getTime();

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
  const shareText = `🎖️ मेरा राष्ट्रीय 6-माह डिजिटल साहित्यिक सदस्यता पत्र — 'बोलती कलम' (bolateeworld.in)\nलेखक: ${userName} (@${cleanUsername})\nसदस्यता क्रमांक: ${membershipId}\nवैधता: ${endDateStr} ${isExpired ? '(समाप्त)' : '(सक्रिय)'}\nदेखें: ${shareProfileUrl}`;

  // Generate 4:5 Aspect Ratio (1080x1350) High-Resolution Royal Parchment Card PNG
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
        ctx.roundRect(14, 14, 1052, 1322, 28);
      } else {
        ctx.rect(14, 14, 1052, 1322);
      }
      ctx.clip();

      // Bright Warm Parchment Royal Background
      const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1350);
      bgGrad.addColorStop(0, '#fffdf9');   // Warm Cream
      bgGrad.addColorStop(0.3, '#fef9ee'); // Soft Ivory
      bgGrad.addColorStop(0.7, '#fef3c7'); // Soft Gold Parchment
      bgGrad.addColorStop(1, '#fffbf0');   // Rich Linen
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1350);

      // Sleek Dual Crimson & Gold Royal Border
      ctx.strokeStyle = '#be123c';
      ctx.lineWidth = 12;
      ctx.stroke();

      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      ctx.strokeRect(28, 28, 1024, 1294);
      ctx.restore();

      // 2. Top Header Branding
      ctx.fillStyle = '#881337';
      ctx.font = 'bold 44px serif';
      ctx.fillText('बोलती कलम (bolateeworld.in)', 65, 95);

      ctx.fillStyle = '#be123c';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('राष्ट्रीय 6-माह डिजिटल साहित्यिक सदस्यता पत्र', 65, 130);

      // Membership Serial Badge Box (Top Right)
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(710, 60, 305, 60);
      ctx.strokeStyle = '#be123c';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(710, 60, 305, 60);

      ctx.fillStyle = '#881337';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(`क्रमांक: ${membershipId}`, 725, 98);

      // Header Divider Line
      ctx.strokeStyle = '#be123c';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(65, 155);
      ctx.lineTo(1015, 155);
      ctx.stroke();

      // 3. Member Avatar & Details
      const avatarImg = new Image();
      avatarImg.crossOrigin = 'anonymous';

      const drawCardDetails = () => {
        // Member Name (Centered Y = 430)
        ctx.fillStyle = '#881337';
        ctx.font = 'bold 44px serif';
        const nameWidth = ctx.measureText(userName).width;
        ctx.fillText(userName, (1080 - nameWidth) / 2, 430);

        // Member Username (Centered Y = 470)
        ctx.fillStyle = '#be123c';
        ctx.font = 'bold 24px sans-serif';
        const userText = `@${cleanUsername}`;
        const userWidth = ctx.measureText(userText).width;
        ctx.fillText(userText, (1080 - userWidth) / 2, 470);

        // Verified Badge Pill (Centered Y = 512)
        const badgeText = isExpired 
          ? '⚠️ सदस्यता समाप्त (EXPIRED — 6 माह पूर्ण)' 
          : '✓ 6-माह सक्रिय साहित्यिक सदस्य (bolateeworld.in)';
        ctx.font = 'bold 19px sans-serif';
        const badgeWidth = ctx.measureText(badgeText).width + 36;
        const badgeX = (1080 - badgeWidth) / 2;

        if (isExpired) {
          ctx.fillStyle = '#fee2e2';
          ctx.fillRect(badgeX, 488, badgeWidth, 34);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.strokeRect(badgeX, 488, badgeWidth, 34);
          ctx.fillStyle = '#b91c1c';
        } else {
          ctx.fillStyle = '#dcfce7';
          ctx.fillRect(badgeX, 488, badgeWidth, 34);
          ctx.strokeStyle = '#16a34a';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(badgeX, 488, badgeWidth, 34);
          ctx.fillStyle = '#15803d';
        }
        ctx.fillText(badgeText, badgeX + 18, 512);

        // 4. Literary Motto Box (Y = 540)
        ctx.fillStyle = '#fff1f2';
        ctx.fillRect(75, 540, 930, 70);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(75, 540, 930, 70);

        ctx.fillStyle = '#9f1239';
        ctx.font = 'italic bold 22px serif';
        const mottoText = '"साहित्य, भाषा एवं सर्व-समावेशी अभिव्यक्ति को समर्पित निष्ठावान सदस्य।"';
        const mottoWidth = ctx.measureText(mottoText).width;
        ctx.fillText(mottoText, (1080 - mottoWidth) / 2, 582);

        // 5. 4-Point Metadata Grid (Y = 630, H = 100)
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(75, 630, 930, 95);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(75, 630, 930, 95);

        // Column 1: City
        ctx.fillStyle = '#64748b';
        ctx.font = '18px sans-serif';
        ctx.fillText('📍 गृह स्थान / शहर', 105, 665);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(userCity, 105, 700);

        // Column 2: Genre
        ctx.fillStyle = '#64748b';
        ctx.font = '18px sans-serif';
        ctx.fillText('✍️ प्रमुख विधा', 345, 665);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(userGenre, 345, 700);

        // Column 3: Issued Date
        ctx.fillStyle = '#64748b';
        ctx.font = '18px sans-serif';
        ctx.fillText('📅 जारी तिथि', 585, 665);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(startDateStr, 585, 700);

        // Column 4: Validity
        ctx.fillStyle = '#64748b';
        ctx.font = '18px sans-serif';
        ctx.fillText('⏳ वैधता (6 माह)', 815, 665);
        ctx.fillStyle = isExpired ? '#dc2626' : '#be123c';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`${endDateStr} ${isExpired ? '(समाप्त)' : '(सक्रिय)'}`, 815, 700);

        // 6. 4 Golden Pillars & Privileges Box (Y = 745, H = 260)
        ctx.fillStyle = '#881337'; // Royal Crimson Box
        ctx.fillRect(75, 745, 930, 260);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.strokeRect(75, 745, 930, 260);

        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('★ 6-माह राष्ट्रीय सदस्यता विशेषाधिकार एवं अधिकार (Member Privileges) ★', 140, 785);

        // Privilege 1
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('✓ 1. असीमित रचना प्रकाशन:', 105, 830);
        ctx.fillStyle = '#fde68a';
        ctx.font = '20px sans-serif';
        ctx.fillText('अखिल भारतीय पाठक वर्ग तक पहुंच व डिजिटल कॉपीराइट संरक्षण।', 360, 830);

        // Privilege 2
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('✓ 2. यूट्यूब व पॉडकास्ट मंच:', 105, 875);
        ctx.fillStyle = '#fde68a';
        ctx.font = '20px sans-serif';
        ctx.fillText('बोलती कलम आधिकारिक यूट्यूब चैनल (@bolteekalam) पर काव्य पाठ।', 360, 875);

        // Privilege 3
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('✓ 3. डिजिटल सम्मान पत्र:', 105, 920);
        ctx.fillStyle = '#fde68a';
        ctx.font = '20px sans-serif';
        ctx.fillText('मासिक श्रेष्ठ रचनाओं पर विशिष्ट ई-सर्टिफिकेट व लेखक सम्मान बैज।', 360, 920);

        // Privilege 4
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('✓ 4. राष्ट्रीय काव्य गोष्ठी:', 105, 965);
        ctx.fillStyle = '#fde68a';
        ctx.font = '20px sans-serif';
        ctx.fillText('ऑनलाइन कवि सम्मेलनों एवं साहित्यिक कार्यशालाओं में विशेष प्राथमिकता।', 360, 965);

        // 7. Golden Hologram Emblem Stamp (Y = 1040)
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(75, 1025, 930, 110);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.strokeRect(75, 1025, 930, 110);

        ctx.fillStyle = '#b45309';
        ctx.font = 'bold 20px serif';
        ctx.fillText('🛡️ डिजिटल प्रमाणन मुहर (Official Digital Security Verification Seal)', 110, 1065);

        ctx.fillStyle = '#78350f';
        ctx.font = '18px sans-serif';
        ctx.fillText('यह सदस्यता पत्र बोलती कलम साहित्यिक मंच द्वारा विधिवत अधिकृत व डिजिटल रूप से सत्यापित है।', 110, 1105);

        // 8. Signatures Footer
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(65, 1185);
        ctx.lineTo(1015, 1185);
        ctx.stroke();

        ctx.fillStyle = '#475569';
        ctx.font = '20px sans-serif';
        ctx.fillText('बोलती कलम — आधिकारिक डिजिटल पहचान पत्र', 65, 1240);

        ctx.fillStyle = '#881337';
        ctx.font = 'bold 22px sans-serif';
        const signRightText = 'प्रमाणित: संस्थापक संजय राय (Sanjay Rai)';
        const signRightWidth = ctx.measureText(signRightText).width;
        ctx.fillText(signRightText, 1015 - signRightWidth, 1240);

        resolve(canvas);
      };

      avatarImg.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(540, 275, 90, 0, Math.PI * 2, true);
        ctx.clip();
        ctx.drawImage(avatarImg, 450, 185, 180, 180);
        ctx.restore();

        // Golden/Crimson Ring
        ctx.strokeStyle = '#be123c';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(540, 275, 93, 0, Math.PI * 2, true);
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

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareProfileUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleShareInstagram = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2500);

    // Try native Web Share if available (mobile Instagram)
    if (navigator.share) {
      navigator.share({
        title: 'बोलती कलम डिजिटल सदस्यता पत्र',
        text: shareText,
        url: shareProfileUrl
      }).catch(() => {});
    } else {
      window.open('https://www.instagram.com/', '_blank');
    }
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareProfileUrl)}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareProfileUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-white dark:bg-slate-900 border-2 border-rose-500/40 rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 font-rozha">
                राष्ट्रीय 6-माह डिजिटल साहित्यिक सदस्यता पत्र
              </h3>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-bold">
                बोलती कलम आधिकारिक डिजिटल पहचान (bolateeworld.in)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="खिड़की बंद करें"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* The Grand Visual Card Preview */}
        <div className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-[#fffdf9] via-[#fef9ee] to-[#fffbf0] text-slate-900 border-4 border-rose-600/80 shadow-xl space-y-3.5 overflow-hidden">
          
          {/* Top Row: Brand & Serial */}
          <div className="flex items-center justify-between border-b-2 border-rose-600/60 pb-2">
            <div>
              <h4 className="text-base sm:text-lg font-black text-rose-900 font-rozha">
                बोलती कलम (bolateeworld.in)
              </h4>
              <p className="text-[11px] font-bold text-rose-700">
                राष्ट्रीय 6-माह डिजिटल साहित्यिक सदस्यता पत्र
              </p>
            </div>
            <div className="px-2.5 py-1 bg-amber-100 border border-rose-700/60 rounded-md text-[11px] font-bold text-rose-900">
              क्रमांक: {membershipId}
            </div>
          </div>

          {/* Member Bio & Avatar */}
          <div className="flex flex-col items-center text-center space-y-1.5 pt-1">
            <div className="relative">
              <img 
                src={userAvatar} 
                alt={userName} 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-rose-600 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-slate-950 rounded-full shadow">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <h5 className="text-lg sm:text-xl font-bold font-rozha text-rose-950 pt-1">
              {userName}
            </h5>
            <p className="text-xs font-bold text-rose-700">
              @{cleanUsername}
            </p>
            {isExpired ? (
              <span className="px-3 py-0.5 rounded-full bg-rose-100 border border-rose-500 text-rose-800 text-[10px] font-extrabold shadow-sm">
                ⚠️ सदस्यता समाप्त (EXPIRED — 6 माह पूर्ण)
              </span>
            ) : (
              <span className="px-3 py-0.5 rounded-full bg-emerald-100 border border-emerald-500 text-emerald-800 text-[10px] font-extrabold shadow-sm">
                ✓ 6-माह सक्रिय साहित्यिक सदस्य (bolateeworld.in)
              </span>
            )}
          </div>

          {/* Motto Box */}
          <div className="p-2 bg-rose-50 border border-rose-300 rounded-xl text-center">
            <p className="text-xs italic font-serif font-bold text-rose-900">
              "साहित्य, भाषा एवं सर्व-समावेशी अभिव्यक्ति को समर्पित निष्ठावान सदस्य।"
            </p>
          </div>

          {/* 4-Point Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px]">
            <div>
              <span className="text-slate-500 block text-[10px]">📍 गृह स्थान / शहर</span>
              <span className="font-bold text-slate-900">{userCity}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">✍️ प्रमुख विधा</span>
              <span className="font-bold text-slate-900">{userGenre}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">📅 जारी तिथि</span>
              <span className="font-bold text-slate-900">{startDateStr}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">⏳ वैधता (6 माह)</span>
              <span className={`font-bold ${isExpired ? 'text-red-600' : 'text-rose-700'}`}>
                {endDateStr} {isExpired ? '(समाप्त)' : '(सक्रिय)'}
              </span>
            </div>
          </div>

          {/* 4 Privileges Crimson Royal Box */}
          <div className="p-3 bg-gradient-to-r from-rose-900 to-rose-950 text-white rounded-xl border-2 border-amber-400 space-y-1.5 text-xs shadow-md">
            <div className="font-bold text-amber-300 text-[11px] flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>6-माह राष्ट्रीय सदस्यता विशेषाधिकार (Member Privileges):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-amber-100">
              <div className="flex items-start gap-1">
                <span className="text-amber-400 font-bold">✓</span>
                <span><strong>असीमित रचना प्रकाशन</strong> व कॉपीराइट सुरक्षा</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-amber-400 font-bold">✓</span>
                <span><strong>यूट्यूब मंच (@bolteekalam)</strong> व पॉडकास्ट फीचर</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-amber-400 font-bold">✓</span>
                <span><strong>डिजिटल सम्मान पत्र</strong> व मानद ई-सर्टिफिकेट</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-amber-400 font-bold">✓</span>
                <span><strong>राष्ट्रीय काव्य गोष्ठी</strong> में प्राथमिकता</span>
              </div>
            </div>
          </div>

          {/* Digital Security Seal Banner */}
          <div className="p-2 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>डिजिटल प्रमाणन: बोलती कलम साहित्यिक परिषद द्वारा सत्यापित पत्र</span>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded">
              VERIFIED
            </span>
          </div>

          {/* Signatures Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-300 text-[10px] font-bold text-slate-700">
            <span>बोलती कलम — आधिकारिक डिजिटल पहचान पत्र</span>
            <span className="text-rose-900">प्रमाणित: संस्थापक संजय राय (Sanjay Rai)</span>
          </div>
        </div>

        {/* 1-Click Social Sharing Action Suite */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5 text-rose-500" />
              <span>1-क्लिक सोशल मीडिया शेयरिंग:</span>
            </span>
            {copiedQuote && (
              <span className="text-[10px] text-emerald-600 font-bold animate-in fade-in">
                ✓ कैप्शन कॉपी हो गया! Instagram खुल रहा है...
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* WhatsApp Share */}
            <button
              onClick={handleShareWhatsApp}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            {/* Facebook Share */}
            <button
              onClick={handleShareFacebook}
              className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <FacebookIcon className="w-4 h-4" />
              <span>Facebook</span>
            </button>

            {/* Instagram Share */}
            <button
              onClick={handleShareInstagram}
              className="py-2.5 px-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Instagram</span>
            </button>

            {/* X / Twitter Share */}
            <button
              onClick={handleShareTwitter}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <TwitterIcon className="w-4 h-4" />
              <span>X (Twitter)</span>
            </button>
          </div>

          {/* Download & Copy Link Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleDownloadPNG}
              disabled={downloading}
              className="flex-1 py-3 bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-700 hover:to-rose-800 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'डाउनलोड हो रहा है...' : 'HD सदस्यता कार्ड डाउनलोड करें (PNG)'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              title="लिंक कॉपी करें"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'कॉपी हुआ!' : 'लिंक कॉपी'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LiteraryMembershipCardModal;
