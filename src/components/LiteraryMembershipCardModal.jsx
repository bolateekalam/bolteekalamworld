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
  const userCity = userProfile?.city || 'वाराणसी (बनारस)';
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

      // 2. Top Header Branding: Quill + Title
      ctx.fillStyle = '#0e2238';
      ctx.font = 'bold 44px serif';
      ctx.fillText('बोलती कलम', 120, 85);
      
      ctx.fillStyle = '#0e2238';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('(bolateeworld.in)', 340, 85);

      // Gold Quill Icon Symbol
      ctx.fillStyle = '#d97706';
      ctx.font = '36px serif';
      ctx.fillText('🪶', 65, 85);

      // Header Motto (Right under title)
      ctx.fillStyle = '#475569';
      ctx.font = 'italic bold 20px serif';
      ctx.fillText('“शब्दों से संवाद, विचारों से परिवर्तन”', 660, 125);

      // Membership Serial Badge Box (Top Right)
      ctx.fillStyle = '#0e2238';
      ctx.fillRect(715, 48, 300, 48);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.strokeRect(715, 48, 300, 48);

      ctx.fillStyle = '#fef3c7';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`क्रमांक: ${membershipId}`, 735, 80);

      // Center Navy Ribbon Banner (Y = 125)
      ctx.fillStyle = '#0e2238';
      ctx.fillRect(140, 120, 470, 42);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(140, 120, 470, 42);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('◆ राष्ट्रीय 6-माह डिजिटल साहित्यिक सदस्यता पत्र ◆', 155, 148);

      // 3. Member Avatar & Details
      const avatarImg = new Image();
      avatarImg.crossOrigin = 'anonymous';

      const drawCardDetails = () => {
        // Member Name (Centered Y = 230)
        ctx.fillStyle = '#0e2238';
        ctx.font = 'bold 46px serif';
        const nameWidth = ctx.measureText(userName).width;
        ctx.fillText(userName, (1080 - nameWidth) / 2, 225);

        // Member Username (Centered Y = 270)
        ctx.fillStyle = '#d97706';
        ctx.font = 'bold 24px sans-serif';
        const userText = `@${cleanUsername}`;
        const userWidth = ctx.measureText(userText).width;
        ctx.fillText(userText, (1080 - userWidth) / 2, 265);

        // Verified Badge Pill (Centered Y = 310)
        const badgeText = isExpired 
          ? '⚠️ सदस्यता समाप्त (EXPIRED — 6 माह पूर्ण)' 
          : '✔ 100% निःशुल्क आजीवन साहित्यिक सदस्य';
        ctx.font = 'bold 19px sans-serif';
        const badgeWidth = ctx.measureText(badgeText).width + 36;
        const badgeX = (1080 - badgeWidth) / 2;

        if (isExpired) {
          ctx.fillStyle = '#fee2e2';
          ctx.fillRect(badgeX, 290, badgeWidth, 34);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.strokeRect(badgeX, 290, badgeWidth, 34);
          ctx.fillStyle = '#b91c1c';
        } else {
          ctx.fillStyle = '#f1f5f9';
          ctx.fillRect(badgeX, 290, badgeWidth, 34);
          ctx.strokeStyle = '#0e2238';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(badgeX, 290, badgeWidth, 34);
          ctx.fillStyle = '#0e2238';
        }
        ctx.fillText(badgeText, badgeX + 18, 314);

        // Motto Quote (Y = 360)
        ctx.fillStyle = '#334155';
        ctx.font = 'italic bold 22px serif';
        const mottoText = '“ साहित्य, भाषा एवं सर्व-समावेशी अभिव्यक्ति को समर्पित निःशुल्क सदस्य ”';
        const mottoWidth = ctx.measureText(mottoText).width;
        ctx.fillText(mottoText, (1080 - mottoWidth) / 2, 360);

        // 4. 4-Point Metadata Grid (Y = 405, H = 100)
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(65, 405, 950, 95);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(65, 405, 950, 95);

        // Column 1: City
        ctx.fillStyle = '#64748b';
        ctx.font = '17px sans-serif';
        ctx.fillText('📍 गृह स्थान / शहर', 95, 440);
        ctx.fillStyle = '#0e2238';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(userCity, 95, 475);

        // Column 2: Genre
        ctx.fillStyle = '#64748b';
        ctx.font = '17px sans-serif';
        ctx.fillText('✍️ प्रमुख विधा', 335, 440);
        ctx.fillStyle = '#0e2238';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(userGenre, 335, 475);

        // Column 3: Issued Date
        ctx.fillStyle = '#64748b';
        ctx.font = '17px sans-serif';
        ctx.fillText('📅 जारी तिथि', 575, 440);
        ctx.fillStyle = '#0e2238';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(startDateStr, 575, 475);

        // Column 4: Validity
        ctx.fillStyle = '#64748b';
        ctx.font = '17px sans-serif';
        ctx.fillText('⏳ वैधता (6 माह)', 805, 440);
        ctx.fillStyle = isExpired ? '#dc2626' : '#d97706';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(endDateStr, 805, 475);

        // 5. Dark Navy Box: बोलती कलम के बारे में (Y = 530, H = 340)
        ctx.fillStyle = '#0e2238';
        ctx.fillRect(65, 530, 950, 340);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.strokeRect(65, 530, 950, 340);

        // Header Title in Navy Box
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 26px serif';
        const aboutTitle = '✦ बोलती कलम के बारे में ✦';
        const aboutTitleWidth = ctx.measureText(aboutTitle).width;
        ctx.fillText(aboutTitle, (1080 - aboutTitleWidth) / 2, 575);

        // Logo on left of Navy Box
        ctx.fillStyle = '#fef3c7';
        ctx.font = 'bold 36px serif';
        ctx.fillText('🪶 बोलती', 100, 680);
        ctx.fillText('कलम', 130, 725);

        // 3 Informative Paragraphs
        ctx.fillStyle = '#f1f5f9';
        ctx.font = '17px serif';
        ctx.fillText('बोलती कलम एक डिजिटल साहित्यिक मंच है, जो साहित्य प्रेमियों, रचनाकारों और विचारकों', 300, 630);
        ctx.fillText('को एक साझा मंच पर लाकर शब्दों की शक्ति को नई पहचान देता है।', 300, 655);

        ctx.fillStyle = '#fde68a';
        ctx.fillText('हमारा उद्देश्य है – हिंदी भाषा एवं साहित्य को बढ़ावा देना, रचनात्मक अभिव्यक्ति को प्रोत्साहन', 300, 700);
        ctx.fillText('देना और एक सकारात्मक, सम्मानजनक एवं समावेशी साहित्यिक समुदाय का निर्माण करना।', 300, 725);

        ctx.fillStyle = '#f1f5f9';
        ctx.fillText('यह मंच कवियों, लेखकों, चिंतकों और पाठकों के बीच संवाद, सहयोग और सृजनात्मकता', 300, 770);
        ctx.fillText('को सशक्त करता है। बोलती कलम में आपकी उपस्थिति हमारे परिवार को और समृद्ध बनाती है।', 300, 795);

        // 6. Middle Section: आपकी साहित्यिक यात्रा, हमारे साथ (Y = 910)
        ctx.fillStyle = '#854d0e';
        ctx.font = 'bold 24px serif';
        const journeyTitle = '🌾 आपकी साहित्यिक यात्रा, हमारे साथ 🌾';
        const journeyWidth = ctx.measureText(journeyTitle).width;
        ctx.fillText(journeyTitle, (1080 - journeyWidth) / 2, 920);

        // 4 Circular Journey Points
        // Point 1: Digital Platform
        ctx.fillStyle = '#0e2238';
        ctx.beginPath();
        ctx.arc(160, 990, 36, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '26px sans-serif';
        ctx.fillText('💻', 145, 998);

        ctx.fillStyle = '#0e2238';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('डिजिटल मंच पर', 115, 1045);
        ctx.fillText('रचनाओं का प्रकाशन', 105, 1065);

        // Point 2: Events
        ctx.fillStyle = '#0e2238';
        ctx.beginPath();
        ctx.arc(410, 990, 36, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '26px sans-serif';
        ctx.fillText('👥', 395, 998);

        ctx.fillStyle = '#0e2238';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('साहित्यिक आयोजनों एवं', 350, 1045);
        ctx.fillText('कार्यक्रमों में सहभागिता', 355, 1065);

        // Point 3: YouTube
        ctx.fillStyle = '#0e2238';
        ctx.beginPath();
        ctx.arc(660, 990, 36, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '26px sans-serif';
        ctx.fillText('▶️', 645, 998);

        ctx.fillStyle = '#0e2238';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('बोलती कलम के यूट्यूब चैनल', 590, 1045);
        ctx.fillText('पर विशेष पहचान', 625, 1065);

        // Point 4: Certificates
        ctx.fillStyle = '#0e2238';
        ctx.beginPath();
        ctx.arc(910, 990, 36, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '26px sans-serif';
        ctx.fillText('📜', 895, 998);

        ctx.fillStyle = '#0e2238';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('ई-सर्टिफिकेट एवं', 870, 1045);
        ctx.fillText('सम्मान-पत्र', 885, 1065);

        // 7. Golden Security Verification Seal & QR Box (Y = 1105, H = 100)
        ctx.fillStyle = '#fefce8';
        ctx.fillRect(65, 1105, 950, 100);
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(65, 1105, 950, 100);

        ctx.fillStyle = '#854d0e';
        ctx.font = 'bold 22px serif';
        ctx.fillText('🛡️ डिजिटल प्रमाणन मुहर (Official Digital Security Verification Seal)', 95, 1145);

        ctx.fillStyle = '#713f12';
        ctx.font = '16px sans-serif';
        ctx.fillText('यह सदस्यता पत्र बोलती कलम साहित्यिक मंच द्वारा विधिवत अधिकृत एवं डिजिटल रूप से सत्यापित है।', 95, 1180);

        // QR Code Placeholder on right
        ctx.fillStyle = '#0e2238';
        ctx.fillRect(915, 1115, 80, 80);
        ctx.fillStyle = '#ffffff';
        ctx.font = '36px sans-serif';
        ctx.fillText('📱', 938, 1165);

        // 8. Signatures Footer (Y = 1260)
        ctx.fillStyle = '#0e2238';
        ctx.fillRect(65, 1225, 950, 50);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '18px sans-serif';
        ctx.fillText('बोलती कलम — अभिव्यक्ति से साहित्यिक पहचान तक', 90, 1256);

        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 19px serif';
        const signRightText = '✍️ प्रमाणित: संस्थापक संजय राय (Sanjay Rai)';
        const signRightWidth = ctx.measureText(signRightText).width;
        ctx.fillText(signRightText, 995 - signRightWidth, 1256);

        resolve(canvas);
      };

      drawCardDetails();
    });
  };

  const handleDownloadHD = async () => {
    setDownloading(true);
    try {
      const canvas = await generateCanvasPNG();
      const link = document.createElement('a');
      link.download = `BolteeKalam_Membership_${membershipId}.png`;
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
                बोलती कलम आधिकारिक डिजिटल पहचान (bolateeworld.in)
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

        {/* The Exact Visual Card Matching Image 1 (4:5 Aspect Ratio Preview) */}
        <div className="relative rounded-2xl p-4 sm:p-6 bg-[#fdfbf7] text-slate-900 border-4 border-[#0e2238] shadow-2xl space-y-4 overflow-hidden">
          
          {/* Top Row: Brand & Serial */}
          <div className="flex items-center justify-between border-b-2 border-amber-500/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪶</span>
              <div>
                <h4 className="text-lg sm:text-xl font-black text-[#0e2238] font-rozha leading-none">
                  बोलती कलम <span className="text-sm font-sans font-bold text-slate-700">(bolateeworld.in)</span>
                </h4>
                <p className="text-[11px] font-serif italic text-slate-600 pt-0.5">
                  “शब्दों से संवाद, विचारों से परिवर्तन”
                </p>
              </div>
            </div>
            <div className="px-3 py-1 bg-[#0e2238] border border-amber-500 rounded-lg text-xs font-bold text-amber-200 shadow">
              क्रमांक: {membershipId}
            </div>
          </div>

          {/* Ribbon Subtitle Banner */}
          <div className="text-center">
            <span className="inline-block px-4 py-1 bg-[#0e2238] text-white text-[11px] font-bold rounded-md border border-amber-400 shadow">
              ◆ राष्ट्रीय 6-माह डिजिटल साहित्यिक सदस्यता पत्र ◆
            </span>
          </div>

          {/* Member Name & Handle */}
          <div className="flex flex-col items-center text-center space-y-1 pt-1">
            <h5 className="text-2xl sm:text-3xl font-black font-rozha text-[#0e2238]">
              {userName}
            </h5>
            <p className="text-sm font-bold text-amber-800">
              @{cleanUsername}
            </p>
            {isExpired ? (
              <span className="px-3.5 py-0.5 rounded-full bg-rose-100 border border-rose-500 text-rose-800 text-xs font-extrabold shadow-sm">
                ⚠️ सदस्यता समाप्त (EXPIRED — 6 माह पूर्ण)
              </span>
            ) : (
              <span className="px-3.5 py-0.5 rounded-full bg-slate-100 border border-[#0e2238] text-[#0e2238] text-xs font-extrabold shadow-sm flex items-center gap-1">
                <span>✔</span> 100% निःशुल्क आजीवन साहित्यिक सदस्य
              </span>
            )}
            <p className="text-xs italic font-serif font-bold text-slate-700 pt-1">
              “ साहित्य, भाषा एवं सर्व-समावेशी अभिव्यक्ति को समर्पित निःशुल्क सदस्य ”
            </p>
          </div>

          {/* 4-Point Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-white border border-slate-300 rounded-xl text-xs shadow-sm">
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

          {/* Dark Navy Section: बोलती कलम के बारे में */}
          <div className="p-4 bg-[#0e2238] text-white rounded-xl border border-amber-500 space-y-2.5 shadow-lg">
            <h6 className="text-center font-serif text-sm font-bold text-amber-300">
              ✦ बोलती कलम के बारे में ✦
            </h6>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="sm:col-span-1 flex flex-col items-center justify-center p-2 bg-slate-900/50 rounded-lg border border-amber-500/30 text-center">
                <span className="text-2xl">🪶</span>
                <span className="font-rozha font-bold text-amber-200 text-sm">बोलती कलम</span>
              </div>
              <div className="sm:col-span-3 space-y-1.5 text-[11px] text-slate-200 leading-relaxed font-serif">
                <p>बोलती कलम एक डिजिटल साहित्यिक मंच है, जो साहित्य प्रेमियों, रचनाकारों और विचारकों को एक साझा मंच पर लाकर शब्दों की शक्ति को नई पहचान देता है।</p>
                <p className="text-amber-100">हमारा उद्देश्य है – हिंदी भाषा एवं साहित्य को बढ़ावा देना, रचनात्मक अभिव्यक्ति को प्रोत्साहन देना और एक सकारात्मक, सम्मानजनक एवं समावेशी समुदाय का निर्माण करना।</p>
                <p>यह मंच कवियों, लेखकों, चिंतकों और पाठकों के बीच संवाद, सहयोग और सृजनात्मकता को सशक्त करता है।</p>
              </div>
            </div>
          </div>

          {/* Middle Section: आपकी साहित्यिक यात्रा, हमारे साथ */}
          <div className="space-y-2">
            <h6 className="text-center font-serif text-xs font-bold text-amber-900">
              🌾 आपकी साहित्यिक यात्रा, हमारे साथ 🌾
            </h6>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
              <div className="p-2 bg-white rounded-xl border border-slate-200 flex flex-col items-center gap-1 shadow-sm">
                <div className="w-7 h-7 rounded-full bg-[#0e2238] text-white flex items-center justify-center text-xs">
                  💻
                </div>
                <span className="font-bold text-[#0e2238]">डिजिटल मंच पर रचनाओं का प्रकाशन</span>
              </div>

              <div className="p-2 bg-white rounded-xl border border-slate-200 flex flex-col items-center gap-1 shadow-sm">
                <div className="w-7 h-7 rounded-full bg-[#0e2238] text-white flex items-center justify-center text-xs">
                  👥
                </div>
                <span className="font-bold text-[#0e2238]">साहित्यिक आयोजनों में सहभागिता</span>
              </div>

              <div className="p-2 bg-white rounded-xl border border-slate-200 flex flex-col items-center gap-1 shadow-sm">
                <div className="w-7 h-7 rounded-full bg-[#0e2238] text-white flex items-center justify-center text-xs">
                  ▶️
                </div>
                <span className="font-bold text-[#0e2238]">यूट्यूब चैनल पर विशेष पहचान</span>
              </div>

              <div className="p-2 bg-white rounded-xl border border-slate-200 flex flex-col items-center gap-1 shadow-sm">
                <div className="w-7 h-7 rounded-full bg-[#0e2238] text-white flex items-center justify-center text-xs">
                  📜
                </div>
                <span className="font-bold text-[#0e2238]">ई-सर्टिफिकेट एवं सम्मान-पत्र</span>
              </div>
            </div>
          </div>

          {/* Digital Security Seal Banner */}
          <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between text-[11px] shadow-sm">
            <div className="flex items-center gap-2 text-amber-900 font-semibold">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold block text-[11px]">डिजिटल प्रमाणन मुहर (Official Digital Security Verification Seal)</span>
                <span className="text-[10px] text-amber-800">यह सदस्यता पत्र बोलती कलम साहित्यिक मंच द्वारा विधिवत अधिकृत एवं डिजिटल रूप से सत्यापित है।</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-[#0e2238] text-white rounded-lg flex items-center justify-center text-base shrink-0 shadow">
              📱
            </div>
          </div>

          {/* Signatures Footer */}
          <div className="p-2 bg-[#0e2238] text-white rounded-xl flex items-center justify-between text-[10px] font-bold">
            <span className="text-slate-200">बोलती कलम — अभिव्यक्ति से साहित्यिक पहचान तक</span>
            <span className="text-amber-300">✍️ प्रमाणित: संस्थापक संजय राय (Sanjay Rai)</span>
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
