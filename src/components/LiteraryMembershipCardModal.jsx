import React, { useState } from 'react';
import { X, Award, ShieldCheck, Download, Share2, Copy, Check, Sparkles, Calendar, MapPin, Feather, CheckCircle2, Star, ExternalLink, Laptop, Users, Video, FileText, QrCode } from 'lucide-react';

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

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
  </svg>
);

export const LiteraryMembershipCardModal = ({ isOpen, onClose, userProfile }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const userName = userProfile?.name || 'साहित्य साधक';
  const cleanUsername = (userProfile?.username || 'writer').replace(/^[@#]/, '');
  const userCity = userProfile?.city || 'वाराणसी (बनारस)';
  const userGenre = userProfile?.genre || 'कविता (Poetry)';
  
  const userEmail = userProfile?.email || 'user';
  const savedCustomAvatar = localStorage.getItem(`custom_avatar_${userEmail}`) || localStorage.getItem('custom_avatar_global');
  const userAvatar = savedCustomAvatar || userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';

  // Dynamic Hindi Date Formatter & Exact 6-Month Lifetime
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

  const startDateStr = formatHindiDate(validCreatedDate);
  const expiryDate = new Date(validCreatedDate);
  expiryDate.setMonth(expiryDate.getMonth() + 6);
  const endDateStr = formatHindiDate(expiryDate);

  const isExpired = new Date().getTime() > expiryDate.getTime();

  const getSequentialMembershipId = () => {
    try {
      const key = `bw_seq_mem_id_${userEmail}`;
      const existing = localStorage.getItem(key);
      if (existing) return existing;

      let counter = parseInt(localStorage.getItem('bw_global_mem_counter') || '2', 10);
      if (isNaN(counter) || counter < 1) counter = 2;
      const numStr = counter.toString().padStart(3, '0');
      const newId = `BW-MEM-2026-${numStr}`;
      
      localStorage.setItem(key, newId);
      localStorage.setItem('bw_global_mem_counter', (counter + 1).toString());
      return newId;
    } catch (e) {
      return 'BW-MEM-2026-002';
    }
  };

  const membershipId = getSequentialMembershipId();
  const shareProfileUrl = `https://www.bolateeworld.in/profile/${cleanUsername}`;
  const shareText = `🎖️ मेरा राष्ट्रीय 6-माह डिजिटल साहित्यिक सदस्यता पत्र — 'बोलती वर्ल्ड' (bolateeworld.in)\nलेखक: ${userName} (@${cleanUsername})\nसदस्यता क्रमांक: ${membershipId}\nवैधता: ${endDateStr} ${isExpired ? '(समाप्त)' : '(सक्रिय)'}\nदेखें: ${shareProfileUrl}`;

  // Generate 4:5 Aspect Ratio (1080x1350) High-Resolution Canvas PNG
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
      ctx.fillStyle = '#fdfbf7';
      ctx.fillRect(0, 0, 1080, 1350);

      // Ornate Dual Gold & Navy Border
      ctx.strokeStyle = '#0e2238';
      ctx.lineWidth = 14;
      ctx.stroke();

      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3.5;
      ctx.strokeRect(28, 28, 1024, 1294);
      ctx.restore();

      // 2. Top Header Branding: Quill + Bolti World & Bolti Kalam
      ctx.fillStyle = '#0e2238';
      ctx.font = 'bold 42px serif';
      ctx.fillText('बोलती वर्ल्ड', 120, 80);
      
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('(bolateeworld.in) • मंच', 335, 80);

      // Gold Quill Icon Symbol
      ctx.fillStyle = '#d97706';
      ctx.font = '36px serif';
      ctx.fillText('🪶', 65, 80);

      // Header Motto (Right under title)
      ctx.fillStyle = '#475569';
      ctx.font = 'italic bold 18px serif';
      ctx.fillText('“शब्दों से संवाद, विचारों से परिवर्तन”', 680, 120);

      // Membership Serial Badge Box (Top Right)
      ctx.fillStyle = '#0e2238';
      ctx.fillRect(720, 45, 295, 46);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.strokeRect(720, 45, 295, 46);

      ctx.fillStyle = '#fef3c7';
      ctx.font = 'bold 19px sans-serif';
      ctx.fillText(`क्रमांक: ${membershipId}`, 740, 75);

      // Center Navy Ribbon Banner (Y = 115)
      ctx.fillStyle = '#0e2238';
      ctx.fillRect(120, 108, 510, 38);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(120, 108, 510, 38);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 17px sans-serif';
      ctx.fillText('◆ राष्ट्रीय 6-माह डिजिटल साहित्यिक सदस्यता पत्र ◆', 135, 133);

      // 3. User Circular Profile Avatar & Details
      const avatarImg = new Image();
      avatarImg.crossOrigin = 'anonymous';

      const drawRemainingDetails = () => {
        // Member Name (Centered Y = 320)
        ctx.fillStyle = '#0e2238';
        ctx.font = 'bold 44px serif';
        const nameWidth = ctx.measureText(userName).width;
        ctx.fillText(userName, (1080 - nameWidth) / 2, 320);

        // Member Username (Centered Y = 358)
        ctx.fillStyle = '#d97706';
        ctx.font = 'bold 22px sans-serif';
        const userText = `@${cleanUsername}`;
        const userWidth = ctx.measureText(userText).width;
        ctx.fillText(userText, (1080 - userWidth) / 2, 355);

        // Verified Badge Pill (Centered Y = 398)
        const badgeText = isExpired 
          ? '⚠️ सदस्यता समाप्त (EXPIRED — 6 माह पूर्ण)' 
          : '✔ 100% निःशुल्क आजीवन साहित्यिक सदस्य';
        ctx.font = 'bold 18px sans-serif';
        const badgeWidth = ctx.measureText(badgeText).width + 36;
        const badgeX = (1080 - badgeWidth) / 2;

        if (isExpired) {
          ctx.fillStyle = '#fee2e2';
          ctx.fillRect(badgeX, 375, badgeWidth, 32);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.strokeRect(badgeX, 375, badgeWidth, 32);
          ctx.fillStyle = '#b91c1c';
        } else {
          ctx.fillStyle = '#f1f5f9';
          ctx.fillRect(badgeX, 375, badgeWidth, 32);
          ctx.strokeStyle = '#0e2238';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(badgeX, 375, badgeWidth, 32);
          ctx.fillStyle = '#0e2238';
        }
        ctx.fillText(badgeText, badgeX + 18, 398);

        // Motto Quote (Y = 440)
        ctx.fillStyle = '#334155';
        ctx.font = 'italic bold 21px serif';
        const mottoText = '“ साहित्य, भाषा एवं सर्व-समावेशी अभिव्यक्ति को समर्पित निष्ठावान सदस्य ”';
        const mottoWidth = ctx.measureText(mottoText).width;
        ctx.fillText(mottoText, (1080 - mottoWidth) / 2, 440);

        // 4. 4-Point Metadata Grid (Y = 475, H = 95)
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(65, 475, 950, 90);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(65, 475, 950, 90);

        // Column 1: City
        ctx.fillStyle = '#64748b';
        ctx.font = '16px sans-serif';
        ctx.fillText('📍 गृह स्थान / शहर', 95, 510);
        ctx.fillStyle = '#0e2238';
        ctx.font = 'bold 21px sans-serif';
        ctx.fillText(userCity, 95, 542);

        // Column 2: Genre
        ctx.fillStyle = '#64748b';
        ctx.font = '16px sans-serif';
        ctx.fillText('✍️ प्रमुख विधा', 335, 510);
        ctx.fillStyle = '#0e2238';
        ctx.font = 'bold 21px sans-serif';
        ctx.fillText(userGenre, 335, 542);

        // Column 3: Issued Date
        ctx.fillStyle = '#64748b';
        ctx.font = '16px sans-serif';
        ctx.fillText('📅 जारी तिथि', 575, 510);
        ctx.fillStyle = '#0e2238';
        ctx.font = 'bold 21px sans-serif';
        ctx.fillText(startDateStr, 575, 542);

        // Column 4: Validity
        ctx.fillStyle = '#64748b';
        ctx.font = '16px sans-serif';
        ctx.fillText('⏳ वैधता (6 माह)', 805, 510);
        ctx.fillStyle = isExpired ? '#dc2626' : '#d97706';
        ctx.font = 'bold 21px sans-serif';
        ctx.fillText(endDateStr, 805, 542);

        // 5. Dark Navy Box: बोलती वर्ल्ड व बोलती कलम के बारे में (Y = 590, H = 270)
        ctx.fillStyle = '#0e2238';
        ctx.fillRect(65, 590, 950, 270);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.strokeRect(65, 590, 950, 270);

        // Header Title in Navy Box
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 24px serif';
        const aboutTitle = '✦ बोलती वर्ल्ड डिजिटल साहित्यिक मंच ✦';
        const aboutTitleWidth = ctx.measureText(aboutTitle).width;
        ctx.fillText(aboutTitle, (1080 - aboutTitleWidth) / 2, 630);

        // Logo on left
        ctx.fillStyle = '#fef3c7';
        ctx.font = 'bold 30px serif';
        ctx.fillText('🪶 बोलती', 110, 720);
        ctx.fillText('वर्ल्ड', 140, 760);

        // 3 Paragraphs
        ctx.fillStyle = '#f1f5f9';
        ctx.font = '17px serif';
        ctx.fillText('बोलती वर्ल्ड एक डिजिटल साहित्यिक मंच है, जो साहित्य प्रेमियों और रचनाकारों को एक', 300, 680);
        ctx.fillText('साझा मंच पर लाकर शब्दों की शक्ति को नई पहचान देता है।', 300, 705);

        ctx.fillStyle = '#fde68a';
        ctx.fillText('हमारा उद्देश्य हिंदी भाषा एवं साहित्य को बढ़ावा देना और रचनात्मक अभिव्यक्ति को मंच देना है।', 300, 750);

        ctx.fillStyle = '#f1f5f9';
        ctx.fillText('बोलती कलम आधिकारिक यूट्यूब चैनल (@bolteekalam) द्वारा विशेष काव्य पाठ प्रसारित किए जाते हैं।', 300, 795);

        // 6. Middle Section: आपकी साहित्यिक यात्रा, हमारे साथ (Y = 890)
        ctx.fillStyle = '#854d0e';
        ctx.font = 'bold 22px serif';
        const journeyTitle = '🌾 आपकी साहित्यिक यात्रा, हमारे साथ 🌾';
        const journeyWidth = ctx.measureText(journeyTitle).width;
        ctx.fillText(journeyTitle, (1080 - journeyWidth) / 2, 900);

        // 4 Circular Journey Points (Y = 960)
        // Point 1: Digital Platform
        ctx.fillStyle = '#0e2238';
        ctx.beginPath();
        ctx.arc(160, 960, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '22px sans-serif';
        ctx.fillText('💻', 148, 968);

        ctx.fillStyle = '#0e2238';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('डिजिटल रचना प्रकाशन', 100, 1012);

        // Point 2: Events
        ctx.fillStyle = '#0e2238';
        ctx.beginPath();
        ctx.arc(410, 960, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '22px sans-serif';
        ctx.fillText('👥', 398, 968);

        ctx.fillStyle = '#0e2238';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('साहित्यिक सहभागिता', 355, 1012);

        // Point 3: YouTube
        ctx.fillStyle = '#0e2238';
        ctx.beginPath();
        ctx.arc(660, 960, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '22px sans-serif';
        ctx.fillText('▶️', 648, 968);

        ctx.fillStyle = '#0e2238';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('यूट्यूब (@bolteekalam)', 600, 1012);

        // Point 4: Certificates
        ctx.fillStyle = '#0e2238';
        ctx.beginPath();
        ctx.arc(910, 960, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '22px sans-serif';
        ctx.fillText('📜', 898, 968);

        ctx.fillStyle = '#0e2238';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('ई-सम्मान पत्र', 875, 1012);

        // 7. Golden Security Verification Seal & QR Box (Y = 1060, H = 90)
        ctx.fillStyle = '#fefce8';
        ctx.fillRect(65, 1060, 950, 90);
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(65, 1060, 950, 90);

        ctx.fillStyle = '#854d0e';
        ctx.font = 'bold 20px serif';
        ctx.fillText('🛡️ डिजिटल प्रमाणन मुहर (Official Digital Security Verification Seal)', 95, 1098);

        ctx.fillStyle = '#713f12';
        ctx.font = '15px sans-serif';
        ctx.fillText('यह सदस्यता पत्र बोलती वर्ल्ड व बोलती कलम साहित्यिक मंच द्वारा विधिवत अधिकृत व डिजिटल सत्यापित है।', 95, 1130);

        // QR Code Icon
        ctx.fillStyle = '#0e2238';
        ctx.fillRect(925, 1070, 70, 70);
        ctx.fillStyle = '#ffffff';
        ctx.font = '30px sans-serif';
        ctx.fillText('📱', 944, 1115);

        // 8. Signatures Footer (Y = 1200)
        ctx.fillStyle = '#0e2238';
        ctx.fillRect(65, 1180, 950, 48);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '16px sans-serif';
        ctx.fillText('बोलती वर्ल्ड (bolateeworld.in) — डिजिटल साहित्यिक मंच', 90, 1210);

        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 17px serif';
        const signRightText = '✍️ प्रमाणित: संस्थापक संजय राय (Sanjay Rai)';
        const signRightWidth = ctx.measureText(signRightText).width;
        ctx.fillText(signRightText, 995 - signRightWidth, 1210);

        resolve(canvas);
      };

      // Draw Avatar
      avatarImg.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(540, 215, 60, 0, Math.PI * 2, true);
        ctx.clip();
        ctx.drawImage(avatarImg, 480, 155, 120, 120);
        ctx.restore();

        // Dual Ring
        ctx.strokeStyle = '#0e2238';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(540, 215, 62, 0, Math.PI * 2, true);
        ctx.stroke();

        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(540, 215, 66, 0, Math.PI * 2, true);
        ctx.stroke();

        drawRemainingDetails();
      };

      avatarImg.onerror = () => {
        // Fallback Initial Circle if image cannot load
        ctx.fillStyle = '#0e2238';
        ctx.beginPath();
        ctx.arc(540, 215, 60, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 44px serif';
        ctx.fillText(userName.charAt(0) || 'क', 525, 230);

        drawRemainingDetails();
      };

      avatarImg.src = userAvatar;
    });
  };

  const handleDownloadHD = async () => {
    setDownloading(true);
    try {
      const canvas = await generateCanvasPNG();
      const link = document.createElement('a');
      link.download = `BoltiWorld_Membership_${membershipId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Download error:', e);
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

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareProfileUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-xl w-full p-4 sm:p-5 shadow-2xl space-y-4 max-h-[95vh] overflow-y-auto relative">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 font-rozha">
                राष्ट्रीय 6-माह डिजिटल साहित्यिक सदस्यता पत्र
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-400 font-bold">
                बोलती वर्ल्ड आधिकारिक डिजिटल पहचान (bolateeworld.in)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="खिड़की बंद करें"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* The Exact Visual Card Preview */}
        <div className="relative rounded-2xl p-4 sm:p-6 bg-[#fdfbf7] text-slate-900 border-4 border-[#0e2238] shadow-2xl space-y-3.5 overflow-hidden">
          
          {/* Top Row: Brand & Serial */}
          <div className="flex items-center justify-between border-b-2 border-amber-500/60 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪶</span>
              <div>
                <h4 className="text-lg sm:text-xl font-black text-[#0e2238] font-rozha leading-none">
                  बोलती वर्ल्ड <span className="text-xs font-sans font-bold text-slate-600">(bolateeworld.in)</span>
                </h4>
                <p className="text-[11px] font-serif italic text-slate-600 pt-0.5">
                  “शब्दों से संवाद, विचारों से परिवर्तन”
                </p>
              </div>
            </div>
            <div className="px-2.5 py-1 bg-[#0e2238] border border-amber-500 rounded-lg text-xs font-bold text-amber-200 shadow">
              क्रमांक: {membershipId}
            </div>
          </div>

          {/* Ribbon Subtitle Banner */}
          <div className="text-center">
            <span className="inline-block px-3.5 py-0.5 bg-[#0e2238] text-white text-[11px] font-bold rounded-md border border-amber-400 shadow">
              ◆ राष्ट्रीय 6-माह डिजिटल साहित्यिक सदस्यता पत्र ◆
            </span>
          </div>

          {/* Member Photo Avatar & Name Details */}
          <div className="flex flex-col items-center text-center space-y-1 pt-1">
            <div className="relative">
              <img 
                src={userAvatar} 
                alt={userName} 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-[#0e2238] shadow-md bg-white"
              />
              <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-[#0e2238] rounded-full shadow">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <h5 className="text-xl sm:text-2xl font-black font-rozha text-[#0e2238] pt-1">
              {userName}
            </h5>
            <p className="text-xs font-bold text-amber-800">
              @{cleanUsername}
            </p>
            {isExpired ? (
              <span className="px-3.5 py-0.5 rounded-full bg-rose-100 border border-rose-500 text-rose-800 text-xs font-extrabold shadow-sm">
                ⚠️ सदस्यता समाप्त (EXPIRED — 6 माह पूर्ण)
              </span>
            ) : (
              <span className="px-3.5 py-0.5 rounded-full bg-slate-100 border border-[#0e2238] text-[#0e2238] text-[11px] font-extrabold shadow-sm flex items-center gap-1">
                <span>✔</span> 100% निःशुल्क आजीवन साहित्यिक सदस्य
              </span>
            )}
            <p className="text-xs italic font-serif font-bold text-slate-700">
              “ साहित्य, भाषा एवं सर्व-समावेशी अभिव्यक्ति को समर्पित निष्ठावान सदस्य ”
            </p>
          </div>

          {/* 4-Point Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 bg-white border border-slate-300 rounded-xl text-xs shadow-sm">
            <div>
              <span className="text-slate-500 block text-[10px]">📍 गृह स्थान / शहर</span>
              <span className="font-bold text-[#0e2238]">{userCity}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">✍️ प्रमुख विधा</span>
              <span className="font-bold text-[#0e2238]">{userGenre}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">📅 जारी तिथि</span>
              <span className="font-bold text-[#0e2238]">{startDateStr}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">⏳ वैधता (6 माह)</span>
              <span className={`font-bold ${isExpired ? 'text-red-600' : 'text-amber-800'}`}>
                {endDateStr} {isExpired ? '(समाप्त)' : ''}
              </span>
            </div>
          </div>

          {/* Dark Navy Section: बोलती वर्ल्ड के बारे में */}
          <div className="p-3 bg-[#0e2238] text-white rounded-xl border border-amber-500 space-y-1.5 shadow-lg text-xs">
            <h6 className="text-center font-serif text-xs font-bold text-amber-300">
              ✦ बोलती वर्ल्ड डिजिटल साहित्यिक मंच ✦
            </h6>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div className="sm:col-span-1 flex flex-col items-center justify-center p-1.5 bg-slate-900/50 rounded-lg border border-amber-500/30 text-center">
                <span className="text-xl">🪶</span>
                <span className="font-rozha font-bold text-amber-200 text-xs">बोलती वर्ल्ड</span>
              </div>
              <div className="sm:col-span-3 space-y-1 text-[11px] text-slate-200 leading-relaxed font-serif">
                <p>बोलती वर्ल्ड एक डिजिटल साहित्यिक मंच है, जो साहित्य प्रेमियों और रचनाकारों को साझा मंच प्रदान करता है।</p>
                <p className="text-amber-100">बोलती कलम आधिकारिक यूट्यूब चैनल (@bolteekalam) द्वारा विशेष काव्य पाठ प्रसारित किए जाते हैं।</p>
              </div>
            </div>
          </div>

          {/* Middle Section: आपकी साहित्यिक यात्रा, हमारे साथ */}
          <div className="space-y-1.5">
            <h6 className="text-center font-serif text-[11px] font-bold text-amber-900">
              🌾 आपकी साहित्यिक यात्रा, हमारे साथ 🌾
            </h6>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center text-[10px]">
              <div className="p-1.5 bg-white rounded-xl border border-slate-200 flex flex-col items-center gap-0.5 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-[#0e2238] text-white flex items-center justify-center text-[10px]">💻</div>
                <span className="font-bold text-[#0e2238]">डिजिटल रचना प्रकाशन</span>
              </div>
              <div className="p-1.5 bg-white rounded-xl border border-slate-200 flex flex-col items-center gap-0.5 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-[#0e2238] text-white flex items-center justify-center text-[10px]">👥</div>
                <span className="font-bold text-[#0e2238]">साहित्यिक सहभागिता</span>
              </div>
              <div className="p-1.5 bg-white rounded-xl border border-slate-200 flex flex-col items-center gap-0.5 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-[#0e2238] text-white flex items-center justify-center text-[10px]">▶️</div>
                <span className="font-bold text-[#0e2238]">यूट्यूब (@bolteekalam)</span>
              </div>
              <div className="p-1.5 bg-white rounded-xl border border-slate-200 flex flex-col items-center gap-0.5 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-[#0e2238] text-white flex items-center justify-center text-[10px]">📜</div>
                <span className="font-bold text-[#0e2238]">ई-सम्मान पत्र</span>
              </div>
            </div>
          </div>

          {/* Digital Security Seal Banner */}
          <div className="p-2 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between text-[11px] shadow-sm">
            <div className="flex items-center gap-2 text-amber-900 font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold block text-[10px]">डिजिटल प्रमाणन मुहर (Official Digital Security Seal)</span>
                <span className="text-[9px] text-amber-800">यह सदस्यता पत्र बोलती वर्ल्ड साहित्यिक मंच द्वारा विधिवत अधिकृत व सत्यापित है।</span>
              </div>
            </div>
            <div className="w-8 h-8 bg-[#0e2238] text-white rounded-md flex items-center justify-center text-sm shrink-0">
              📱
            </div>
          </div>

          {/* Signatures Footer */}
          <div className="p-2 bg-[#0e2238] text-white rounded-xl flex items-center justify-between text-[10px] font-bold">
            <span className="text-slate-200">बोलती वर्ल्ड (bolateeworld.in) — मंच</span>
            <span className="text-amber-300">✍️ प्रमाणित: संस्थापक संजय राय</span>
          </div>

        </div>

        {/* 1-Click Social Sharing Actions Grid */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            🚀 1-क्लिक में सोशल मीडिया पर शेयर करें:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleShareFacebook}
              className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <FacebookIcon className="w-4 h-4" />
              <span>Facebook</span>
            </button>

            <button
              onClick={handleShareTwitter}
              className="py-2.5 px-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs shadow flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <TwitterIcon className="w-4 h-4" />
              <span>X (Twitter)</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs shadow flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'कॉपी हुआ!' : 'लिंक कॉपी'}</span>
            </button>
          </div>
        </div>

        {/* Download High-Resolution 4:5 PNG Button */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleDownloadHD}
            disabled={downloading}
            className="w-full py-3.5 bg-gradient-to-r from-[#0e2238] via-slate-900 to-[#0e2238] hover:brightness-110 text-white font-extrabold rounded-2xl text-xs shadow-xl flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 cursor-pointer border border-amber-500/40"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{downloading ? 'एचडी कार्ड तैयार हो रहा है...' : '📥 4:5 हाई-रेजोल्यूशन (1080x1350) कार्ड डाउनलोड करें (HD PNG)'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default LiteraryMembershipCardModal;
