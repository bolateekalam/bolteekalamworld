import React, { useState } from 'react';
import { X, Award, ShieldCheck, Download, Share2, Copy, Check, Sparkles, Calendar, Feather, CheckCircle2, Star, ExternalLink, QrCode } from 'lucide-react';

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
  const shareText = `🎖️ मेरा राष्ट्रीय 6-माह डिजिटल साहित्यिक सदस्यता पत्र — 'बोलती कलम' (bolateeworld.in)\nलेखक: ${userName} (@${cleanUsername})\nसदस्यता क्रमांक: ${membershipId}\nवैधता: ${endDateStr} ${isExpired ? '(समाप्त)' : '(सक्रिय)'}\nदेखें: ${shareProfileUrl}`;

  // High-Resolution 1080x1520 Canvas PNG Generator with Spacious Balanced Layout & Authentic Verification Seal
  const generateCanvasPNG = () => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1520;
      const ctx = canvas.getContext('2d');

      // 1. Outer Background & Borders
      ctx.fillStyle = '#fdfbf7';
      ctx.fillRect(0, 0, 1080, 1520);

      // Ornate Dual Border
      ctx.strokeStyle = '#0e2238';
      ctx.lineWidth = 14;
      ctx.strokeRect(22, 22, 1036, 1476);

      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3.5;
      ctx.strokeRect(36, 36, 1008, 1448);

      // 4 Corner Gold Accents
      const cornerSize = 28;
      ctx.fillStyle = '#d97706';
      ctx.fillRect(36, 36, cornerSize, cornerSize);
      ctx.fillRect(1044 - cornerSize, 36, cornerSize, cornerSize);
      ctx.fillRect(36, 1484 - cornerSize, cornerSize, cornerSize);
      ctx.fillRect(1044 - cornerSize, 1484 - cornerSize, cornerSize);

      const renderCanvasContent = (logoImgObj, userImgObj) => {
        // 2. Top Header Section (Y = 60 to 130)
        if (logoImgObj) {
          ctx.drawImage(logoImgObj, 60, 58, 80, 80);
        } else {
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.arc(100, 98, 38, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#0e2238';
          ctx.font = 'bold 36px serif';
          ctx.textAlign = 'center';
          ctx.fillText('🪶', 100, 110);
        }

        ctx.textAlign = 'left';
        ctx.fillStyle = '#0e2238';
        ctx.font = 'bold 40px serif';
        ctx.fillText('बोलती कलम', 155, 95);
        
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('bolateeworld.in • राष्ट्रीय डिजिटल साहित्यिक मंच', 155, 126);

        // Membership ID Box (Top Right)
        ctx.fillStyle = '#0e2238';
        ctx.fillRect(710, 60, 310, 52);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.strokeRect(710, 60, 310, 52);

        ctx.fillStyle = '#fef3c7';
        ctx.font = 'bold 19px monospace';
        ctx.fillText(`क्रमांक: ${membershipId}`, 725, 93);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#475569';
        ctx.font = 'italic bold 16px serif';
        ctx.fillText('“शब्दों से संवाद, विचारों से परिवर्तन”', 1020, 134);

        // Center Navy Ribbon Banner (Y = 155)
        ctx.fillStyle = '#0e2238';
        ctx.fillRect(60, 155, 960, 46);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(60, 155, 960, 46);

        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px serif';
        ctx.fillText('◆ राष्ट्रीय 6-माह डिजिटल साहित्यिक सदस्यता पहचान पत्र ◆', 540, 185);

        // 3. User Avatar Photo (Large & Prominent, Y = 230 to 390)
        const avatarY = 300;
        const avatarRadius = 75;

        if (userImgObj) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(540, avatarY, avatarRadius, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(userImgObj, 540 - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
          ctx.restore();

          ctx.strokeStyle = '#0e2238';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.arc(540, avatarY, avatarRadius + 1, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(540, avatarY, avatarRadius + 6, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.fillStyle = '#0e2238';
          ctx.beginPath();
          ctx.arc(540, avatarY, avatarRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fde68a';
          ctx.font = 'bold 56px serif';
          ctx.fillText(userName.charAt(0) || 'क', 540, avatarY + 20);
        }

        // 4. Member Name & Username with Generous Spacing
        ctx.fillStyle = '#0e2238';
        ctx.font = 'bold 44px serif';
        ctx.fillText(userName, 540, 425);

        ctx.fillStyle = '#d97706';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(`@${cleanUsername}`, 540, 460);

        // Verified Badge Pill
        const badgeText = isExpired 
          ? '⚠️ सदस्यता समाप्त (EXPIRED — 6 माह पूर्ण)' 
          : '✔ 100% निःशुल्क आजीवन साहित्यिक सदस्य';
        ctx.font = 'bold 17px sans-serif';
        const badgeWidth = ctx.measureText(badgeText).width + 40;
        const badgeX = 540 - badgeWidth / 2;

        ctx.fillStyle = isExpired ? '#fee2e2' : '#f1f5f9';
        ctx.fillRect(badgeX, 480, badgeWidth, 34);
        ctx.strokeStyle = isExpired ? '#ef4444' : '#0e2238';
        ctx.lineWidth = 2;
        ctx.strokeRect(badgeX, 480, badgeWidth, 34);

        ctx.fillStyle = isExpired ? '#b91c1c' : '#0e2238';
        ctx.fillText(badgeText, 540, 503);

        // Motto Quote
        ctx.fillStyle = '#334155';
        ctx.font = 'italic bold 21px serif';
        ctx.fillText('“ साहित्य, भाषा एवं सर्व-समावेशी अभिव्यक्ति को समर्पित निष्ठावान सदस्य ”', 540, 548);

        // 5. Clean 2-Column Date & Validity Row (Spacious & Balanced, Y = 580 to 670)
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(60, 580, 960, 90);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.strokeRect(60, 580, 960, 90);

        // Divider
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(540, 590);
        ctx.lineTo(540, 660);
        ctx.stroke();

        // Left Col: Issued Date
        ctx.textAlign = 'center';
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('📅 सदस्यता जारी तिथि', 300, 615);
        ctx.fillStyle = '#0e2238';
        ctx.font = 'bold 24px serif';
        ctx.fillText(startDateStr, 300, 650);

        // Right Col: Validity
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('⏳ सदस्यता वैधता अवधि (6 माह)', 780, 615);
        ctx.fillStyle = isExpired ? '#dc2626' : '#d97706';
        ctx.font = 'bold 24px serif';
        ctx.fillText(`${endDateStr} (सक्रिय)`, 780, 650);

        // 6. Grand Navy Mission Box (Y = 700 to 950)
        ctx.fillStyle = '#0e2238';
        ctx.fillRect(60, 700, 960, 240);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(60, 700, 960, 240);

        ctx.textAlign = 'center';
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 26px serif';
        ctx.fillText('✦ बोलती कलम राष्ट्रीय डिजिटल साहित्यिक मंच ✦', 540, 742);

        // Left Official Logo Inside Navy Box
        if (logoImgObj) {
          ctx.drawImage(logoImgObj, 95, 765, 95, 95);
        } else {
          ctx.fillStyle = '#fef3c7';
          ctx.font = 'bold 44px serif';
          ctx.fillText('🪶', 145, 825);
        }

        ctx.textAlign = 'left';
        ctx.fillStyle = '#f1f5f9';
        ctx.font = '20px serif';
        ctx.fillText('बोलती कलम एक राष्ट्रीय डिजिटल साहित्यिक मंच है, जो साहित्य प्रेमियों और नवोदित', 215, 785);
        ctx.fillText('रचनाकारों को एक साझा मंच पर लाकर शब्दों की शक्ति को नई पहचान प्रदान करता है।', 215, 818);

        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 20px serif';
        ctx.fillText('हमारा उद्देश्य हिंदी भाषा, साहित्य एवं नव-रचनात्मकता को नई ऊँचाइयों तक पहुँचाना है।', 215, 860);

        ctx.fillStyle = '#f1f5f9';
        ctx.font = '19px serif';
        ctx.fillText('आधिकारिक यूट्यूब चैनल (@bolteekalam) द्वारा विशेष काव्य गोष्ठियाँ एवं लाइव पाठ प्रसारित होते हैं।', 215, 900);

        // 7. Grand Authentic Digital Verification Seal & Stamp Box (Y = 970 to 1270)
        ctx.fillStyle = '#fffbeb';
        ctx.fillRect(60, 970, 960, 275);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(60, 970, 960, 275);

        // Left Verification Details
        ctx.textAlign = 'left';
        ctx.fillStyle = '#854d0e';
        ctx.font = 'bold 24px serif';
        ctx.fillText('🛡️ राष्ट्रीय डिजिटल सुरक्षा एवं प्रमाणन मुहर', 95, 1020);

        ctx.fillStyle = '#713f12';
        ctx.font = '18px sans-serif';
        ctx.fillText('यह सदस्यता पहचान पत्र बोलती कलम साहित्यिक मंच द्वारा', 95, 1060);
        ctx.fillText('पूर्णतः अधिकृत, पंजीकृत एवं डिजिटल रूप से सत्यापित है।', 95, 1092);

        ctx.fillStyle = '#b45309';
        ctx.font = 'bold 16px monospace';
        ctx.fillText(`सत्यापन लिंक: bolateeworld.in/profile/${cleanUsername}`, 95, 1140);
        ctx.fillText(`सुरक्षा टोकन: BK-SEC-${membershipId}-VERIFIED`, 95, 1175);

        // Center-Right Official Circular Stamp (Wax / Authorized Notary Stamp Style)
        const stampCenterX = 820;
        const stampCenterY = 1105;
        const stampR = 90;

        // Stamp Outer Circles
        ctx.strokeStyle = '#b91c1c';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(stampCenterX, stampCenterY, stampR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#b91c1c';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.arc(stampCenterX, stampCenterY, stampR - 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash

        ctx.strokeStyle = '#b91c1c';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(stampCenterX, stampCenterY, stampR - 15, 0, Math.PI * 2);
        ctx.stroke();

        // Stamp Text & Badges
        ctx.textAlign = 'center';
        ctx.fillStyle = '#b91c1c';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('★ BOLTI KALAM OFFICIAL SEAL ★', stampCenterX, stampCenterY - 45);

        ctx.font = 'bold 30px serif';
        ctx.fillText('🪶', stampCenterX, stampCenterY - 10);

        // Verified Pill in Stamp
        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(stampCenterX - 65, stampCenterY + 12, 130, 26);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('VERIFIED 2026', stampCenterX, stampCenterY + 30);

        ctx.fillStyle = '#b91c1c';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('डिजिटल प्रमाणिक', stampCenterX, stampCenterY + 55);

        // 8. Official Signatures Footer (Y = 1275, H = 60)
        ctx.fillStyle = '#0e2238';
        ctx.fillRect(60, 1275, 960, 60);

        ctx.textAlign = 'left';
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('बोलती कलम (bolateeworld.in) — राष्ट्रीय साहित्यिक मंच', 90, 1312);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 19px serif';
        ctx.fillText('✍️ प्रमाणित: संस्थापक संजय राय (Sanjay Rai)', 990, 1312);

        // 9. Bottom Equal Footnote
        ctx.textAlign = 'center';
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('अखिल भारतीय डिजिटल साहित्य संवर्धन परिषद • राष्ट्रीय साहित्यिक समन्वय • bolateeworld.in', 540, 1385);

        resolve(canvas);
      };

      // Load Logo and User Avatar with Fallback
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      const userImg = new Image();
      userImg.crossOrigin = 'anonymous';

      let logoLoaded = false;
      let userLoaded = false;

      const attemptRender = () => {
        renderCanvasContent(
          logoLoaded ? logoImg : null,
          userLoaded ? userImg : null
        );
      };

      logoImg.onload = () => { logoLoaded = true; attemptRender(); };
      logoImg.onerror = () => { logoLoaded = false; attemptRender(); };
      logoImg.src = '/logo.png';

      userImg.onload = () => { userLoaded = true; attemptRender(); };
      userImg.onerror = () => { userLoaded = false; attemptRender(); };
      userImg.src = userAvatar;

      setTimeout(() => {
        attemptRender();
      }, 1200);
    });
  };

  const handleDownloadHD = async () => {
    setDownloading(true);
    try {
      const canvas = await generateCanvasPNG();
      const link = document.createElement('a');
      link.download = `BoltiKalam_Membership_${membershipId}.png`;
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareProfileUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-xl w-full p-4 sm:p-5 shadow-2xl space-y-4 my-auto max-h-[94vh] overflow-y-auto relative">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              🎖️
            </div>
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

        {/* The Exact Visual Card Preview (Spacious, Elegant & Balanced) */}
        <div className="relative rounded-2xl p-5 sm:p-7 bg-[#fdfbf7] text-slate-900 border-4 border-[#0e2238] shadow-2xl space-y-5 overflow-hidden">
          
          {/* Top Gold Corner Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 bg-amber-500 border-b-2 border-r-2 border-[#0e2238]" />
          <div className="absolute top-0 right-0 w-8 h-8 bg-amber-500 border-b-2 border-l-2 border-[#0e2238]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 bg-amber-500 border-t-2 border-r-2 border-[#0e2238]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-amber-500 border-t-2 border-l-2 border-[#0e2238]" />

          {/* Card Top Header */}
          <div className="flex items-center justify-between gap-3 border-b-2 border-amber-500/40 pb-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-amber-500 shadow-sm bg-white p-1 flex items-center justify-center shrink-0">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-full h-full object-contain rounded-full" 
                  onError={(e) => { e.target.style.display = 'none'; }} 
                />
                <span className="text-xl font-bold text-[#0e2238]">🪶</span>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-black font-rozha text-[#0e2238] leading-tight">बोलती कलम</h4>
                <p className="text-[11px] text-slate-600 font-bold">bolateeworld.in • राष्ट्रीय डिजिटल मंच</p>
              </div>
            </div>

            <div className="text-right">
              <div className="px-3 py-1.5 bg-[#0e2238] text-amber-300 rounded-xl border border-amber-500 text-xs font-bold font-mono shadow-sm">
                क्रमांक: {membershipId}
              </div>
              <span className="text-[10px] text-slate-500 font-serif italic block mt-1">“शब्दों से संवाद, विचारों से परिवर्तन”</span>
            </div>
          </div>

          {/* Ribbon Title */}
          <div className="py-2 px-3 bg-[#0e2238] text-white text-center rounded-xl font-bold text-xs sm:text-sm border border-amber-500 shadow-sm">
            ◆ राष्ट्रीय 6-माह डिजिटल साहित्यिक सदस्यता पहचान पत्र ◆
          </div>

          {/* Author Details (Spacious & Clean) */}
          <div className="flex flex-col items-center text-center space-y-2 py-2">
            <div className="relative">
              <img 
                src={userAvatar} 
                alt={userName} 
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-[#0e2238] shadow-xl ring-4 ring-amber-500/80" 
              />
            </div>
            <div className="space-y-1 pt-1">
              <h5 className="text-2xl sm:text-3xl font-black font-rozha text-[#0e2238]">{userName}</h5>
              <p className="text-sm font-bold text-amber-700">@{cleanUsername}</p>
            </div>
            <span className="px-4 py-1 rounded-full text-xs font-extrabold bg-slate-100 border-2 border-[#0e2238] text-[#0e2238] shadow-sm">
              {isExpired ? '⚠️ सदस्यता समाप्त (6 माह पूर्ण)' : '✔ 100% निःशुल्क आजीवन साहित्यिक सदस्य'}
            </span>
            <p className="text-xs italic font-serif text-slate-700 max-w-md pt-1">
              “साहित्य, भाषा एवं सर्व-समावेशी अभिव्यक्ति को समर्पित निष्ठावान सदस्य”
            </p>
          </div>

          {/* Clean 2-Item Date & Validity Row */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center">
            <div className="border-r border-slate-200 pr-2">
              <span className="text-xs text-slate-500 font-bold block mb-1">📅 सदस्यता जारी तिथि</span>
              <span className="text-sm sm:text-base font-bold font-rozha text-slate-900 block">{startDateStr}</span>
            </div>
            <div className="pl-2">
              <span className="text-xs text-slate-500 font-bold block mb-1">⏳ सदस्यता वैधता (6 माह)</span>
              <span className="text-sm sm:text-base font-bold font-rozha text-amber-700 block">{endDateStr} (सक्रिय)</span>
            </div>
          </div>

          {/* Grand Navy Mission Box */}
          <div className="p-4 sm:p-5 bg-[#0e2238] text-white rounded-2xl border-2 border-amber-500 space-y-2.5 text-center shadow-lg">
            <h6 className="font-bold text-amber-300 font-rozha text-base sm:text-lg">✦ बोलती कलम राष्ट्रीय डिजिटल साहित्यिक मंच ✦</h6>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white p-1 border-2 border-amber-400 shrink-0 hidden sm:flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain rounded-full" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif text-left">
                बोलती कलम एक राष्ट्रीय डिजिटल साहित्यिक मंच है, जो साहित्य प्रेमियों और रचनाकारों को एक साझा मंच पर लाकर रचनात्मक अभिव्यक्ति को नई पहचान देता है।
              </p>
            </div>
            <p className="text-xs text-amber-200 font-medium pt-1 border-t border-amber-500/30">
              आधिकारिक यूट्यूब चैनल (<strong className="text-white">@bolteekalam</strong>) द्वारा विशेष काव्य गोष्ठियाँ एवं लाइव पाठ प्रसारित किए जाते हैं।
            </p>
          </div>

          {/* Grand Verification Seal & Stamp */}
          <div className="p-4 bg-amber-50/90 border-2 border-amber-400 rounded-2xl flex items-center justify-between flex-wrap gap-4 shadow-sm">
            <div className="space-y-1 max-w-xs">
              <p className="font-bold text-[#0e2238] flex items-center gap-1.5 text-xs sm:text-sm font-rozha">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>राष्ट्रीय डिजिटल सुरक्षा एवं प्रमाणन</span>
              </p>
              <p className="text-[11px] text-slate-700 leading-tight">
                यह सदस्यता पहचान पत्र bolateeworld.in द्वारा विधिवत अधिकृत व डिजिटल सत्यापित है।
              </p>
              <p className="text-[10px] text-amber-800 font-mono font-bold">
                सुरक्षा टोकन: BK-SEC-{membershipId}
              </p>
            </div>

            {/* Official Stamp Mockup */}
            <div className="w-24 h-24 rounded-full border-4 border-dashed border-red-700 bg-red-50 flex flex-col items-center justify-center text-center p-1 shadow-inner shrink-0 rotate-[-6deg]">
              <span className="text-[8px] font-black uppercase text-red-800 tracking-tighter">BOLTI KALAM</span>
              <span className="text-sm font-black text-red-700">🪶</span>
              <span className="text-[8px] font-black bg-red-700 text-white px-1.5 py-0.5 rounded mt-0.5">VERIFIED</span>
              <span className="text-[7px] text-red-800 font-bold mt-0.5">2026-27</span>
            </div>
          </div>

          {/* Signatures Footer */}
          <div className="flex items-center justify-between p-3 bg-[#0e2238] text-white rounded-xl text-xs flex-wrap gap-2">
            <span className="text-[11px] text-slate-300 font-medium">बोलती कलम (bolateeworld.in)</span>
            <span className="font-bold font-rozha text-amber-300 text-xs sm:text-sm">✍️ प्रमाणित: संस्थापक संजय राय</span>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={handleDownloadHD}
            disabled={downloading}
            className="w-full py-3.5 px-4 bg-[#0e2238] hover:bg-slate-900 text-amber-300 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl border border-amber-500/40 transition active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{downloading ? 'HD सदस्यता पत्र तैयार हो रहा है...' : '📥 HD 6-माह सदस्यता पत्र डाउनलोड करें (Free)'}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95 cursor-pointer"
            >
              <WhatsAppIcon />
              <span>WhatsApp शेयर</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-300 dark:border-slate-700 transition active:scale-95 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'कॉपी हुआ!' : 'लिंक कॉपी करें'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LiteraryMembershipCardModal;
