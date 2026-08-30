import React, { useState, useRef } from 'react';
import { X, Award, ShieldCheck, Download, Share2, Copy, Check, Sparkles, Calendar, Feather, CheckCircle2, Star, ExternalLink, QrCode } from 'lucide-react';
import html2canvas from 'html2canvas';

const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

export const LiteraryMembershipCardModal = ({ isOpen, onClose, userProfile }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef(null);

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

  // Safe Image Loader Helper to prevent Canvas Tainting
  const safeLoadImage = (src) => {
    return new Promise((resolve) => {
      if (!src) return resolve(null);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      let resolved = false;

      img.onload = () => {
        if (!resolved) {
          resolved = true;
          resolve(img);
        }
      };
      img.onerror = () => {
        if (!resolved) {
          resolved = true;
          resolve(null);
        }
      };

      img.src = src;
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve(null);
        }
      }, 1500);
    });
  };

  // High-Resolution 1080x1350 Canvas PNG Generator with Clean Symmetry & Authentic Verification Seal (4:5 Aspect Ratio)
  const generateCanvasPNG = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');

    // 1. Outer Background & Borders
    ctx.fillStyle = '#fdfbf7';
    ctx.fillRect(0, 0, 1080, 1350);

    // Ornate Dual Border
    ctx.strokeStyle = '#0e2238';
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, 1040, 1310);

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3.5;
    ctx.strokeRect(32, 32, 1016, 1286);

    // Subtle Gold Corner Accents
    const drawCornerOrnament = (x, y, flipX, flipY) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(24, 0);
      ctx.lineTo(0, 24);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    drawCornerOrnament(38, 38, false, false);
    drawCornerOrnament(1042, 38, true, false);
    drawCornerOrnament(38, 1312, false, true);
    drawCornerOrnament(1042, 1312, true, true);

    const [logoImgObj, userImgObj] = await Promise.all([
      safeLoadImage('/logo.png'),
      safeLoadImage(userAvatar)
    ]);

    // 2. Top Header Section (Y = 46 to 125)
    if (logoImgObj) {
      ctx.drawImage(logoImgObj, 58, 46, 78, 78);
    } else {
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(96, 85, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0e2238';
      ctx.font = 'bold 34px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🪶', 96, 96);
    }

    ctx.textAlign = 'left';
    ctx.fillStyle = '#0e2238';
    ctx.font = 'bold 38px serif';
    ctx.fillText('बोलती कलम', 148, 82);
    
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 16.5px sans-serif';
    ctx.fillText('bolateeworld.in • राष्ट्रीय डिजिटल साहित्यिक मंच', 148, 112);

    // Membership ID Box (Top Right)
    ctx.fillStyle = '#0e2238';
    ctx.fillRect(720, 46, 302, 48);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.strokeRect(720, 46, 302, 48);

    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 18.5px monospace';
    ctx.fillText(`क्रमांक: ${membershipId}`, 735, 76);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#475569';
    ctx.font = 'italic bold 15px serif';
    ctx.fillText('“शब्दों से संवाद, विचारों से परिवर्तन”', 1022, 116);

    // Center Navy Ribbon Banner (Y = 138 to 184)
    ctx.fillStyle = '#0e2238';
    ctx.fillRect(58, 138, 964, 46);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(58, 138, 964, 46);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px serif';
    ctx.fillText('◆ राष्ट्रीय 6-माह डिजिटल साहित्यिक सदस्यता पहचान पत्र ◆', 540, 168);

    // 3. User Avatar Photo (Prominent & Centered, Y = 198 to 330)
    const avatarY = 265;
    const avatarRadius = 68;

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
      ctx.arc(540, avatarY, avatarRadius + 5, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#0e2238';
      ctx.beginPath();
      ctx.arc(540, avatarY, avatarRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fde68a';
      ctx.font = 'bold 52px serif';
      ctx.fillText(userName.charAt(0) || 'क', 540, avatarY + 18);
    }

    // 4. Member Name & Username with Generous Spacing
    ctx.fillStyle = '#0e2238';
    ctx.font = 'bold 40px serif';
    ctx.fillText(userName, 540, 375);

    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 21px sans-serif';
    ctx.fillText(`@${cleanUsername}`, 540, 408);

    // Single-line Certification Tagline
    ctx.fillStyle = '#0e2238';
    ctx.font = 'bold 17px serif';
    ctx.fillText('बोलती कलम राष्ट्रीय डिजिटल मंच प्रमाणित करता है कि उपरोक्त रचनाकार हमारे अधिकृत 6-माह डिजिटल सदस्य हैं।', 540, 444);

    // Verified Badge Pill
    const badgeText = isExpired 
      ? '⚠️ सदस्यता समाप्त (EXPIRED — 6 माह पूर्ण)' 
      : '✔ 100% निःशुल्क आजीवन साहित्यिक सदस्य';
    ctx.font = 'bold 15.5px sans-serif';
    const badgeWidth = ctx.measureText(badgeText).width + 34;
    const badgeX = 540 - badgeWidth / 2;

    ctx.fillStyle = isExpired ? '#fee2e2' : '#f1f5f9';
    ctx.fillRect(badgeX, 466, badgeWidth, 32);
    ctx.strokeStyle = isExpired ? '#ef4444' : '#0e2238';
    ctx.lineWidth = 2;
    ctx.strokeRect(badgeX, 466, badgeWidth, 32);

    ctx.fillStyle = isExpired ? '#b91c1c' : '#0e2238';
    ctx.fillText(badgeText, 540, 488);

    // 5. Clean 2-Column Date & Validity Row (Y = 515 to 605, Height = 90)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(58, 515, 964, 90);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.strokeRect(58, 515, 964, 90);

    // Divider
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(540, 525);
    ctx.lineTo(540, 595);
    ctx.stroke();

    // Left Col: Issued Date
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 15.5px sans-serif';
    ctx.fillText('📅 सदस्यता जारी तिथि', 300, 548);
    ctx.fillStyle = '#0e2238';
    ctx.font = 'bold 24px serif';
    ctx.fillText(startDateStr, 300, 584);

    // Right Col: Validity
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 15.5px sans-serif';
    ctx.fillText('⏳ सदस्यता वैधता अवधि (6 माह)', 780, 548);
    ctx.fillStyle = isExpired ? '#dc2626' : '#d97706';
    ctx.font = 'bold 24px serif';
    ctx.fillText(`${endDateStr} (सक्रिय)`, 780, 584);

    // 6. Grand Navy Mission Box (Y = 622 to 862, Height = 240)
    ctx.fillStyle = '#0e2238';
    ctx.fillRect(58, 622, 964, 240);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(58, 622, 964, 240);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 24px serif';
    ctx.fillText('✦ बोलती कलम राष्ट्रीय डिजिटल साहित्यिक मंच ✦', 540, 662);

    if (logoImgObj) {
      ctx.drawImage(logoImgObj, 92, 688, 86, 86);
    } else {
      ctx.fillStyle = '#fef3c7';
      ctx.font = 'bold 40px serif';
      ctx.fillText('🪶', 135, 746);
    }

    ctx.textAlign = 'left';
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '19px serif';
    ctx.fillText('बोलती कलम एक राष्ट्रीय डिजिटल साहित्यिक मंच है, जो साहित्य प्रेमियों और नवोदित', 195, 706);
    ctx.fillText('रचनाकारों को एक साझा मंच पर लाकर शब्दों की शक्ति को नई पहचान प्रदान करता है।', 195, 738);

    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 19px serif';
    ctx.fillText('हमारा उद्देश्य हिंदी भाषा, साहित्य एवं नव-रचनात्मकता को नई ऊँचाइयों तक पहुँचाना है।', 195, 778);

    ctx.fillStyle = '#f1f5f9';
    ctx.font = '18px serif';
    ctx.fillText('आधिकारिक यूट्यूब चैनल (@bolateekalam) द्वारा विशेष काव्य गोष्ठियाँ एवं लाइव पाठ प्रसारित होते हैं।', 195, 818);

    // 7. Compact Authentic Digital Verification Seal Box (Y = 880 to 1175, Height = 295)
    ctx.fillStyle = '#fffbeb';
    ctx.fillRect(58, 880, 964, 295);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(58, 880, 964, 295);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#854d0e';
    ctx.font = 'bold 23px serif';
    ctx.fillText('🛡️ राष्ट्रीय डिजिटल सुरक्षा एवं प्रमाणन मुहर', 95, 930);

    ctx.fillStyle = '#713f12';
    ctx.font = '18px sans-serif';
    ctx.fillText('यह सदस्यता पहचान पत्र बोलती कलम साहित्यिक मंच द्वारा', 95, 970);
    ctx.fillText('पूर्णतः अधिकृत, पंजीकृत एवं डिजिटल रूप से सत्यापित है।', 95, 1002);

    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`सत्यापन लिंक: bolateeworld.in/profile/${cleanUsername}`, 95, 1056);
    ctx.fillText(`सुरक्षा टोकन: BK-SEC-${membershipId}-VERIFIED`, 95, 1092);

    // Center-Right Official Circular Stamp
    const stampCenterX = 820;
    const stampCenterY = 1025;
    const stampR = 85;

    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(stampCenterX, stampCenterY, stampR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.arc(stampCenterX, stampCenterY, stampR - 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(stampCenterX, stampCenterY, stampR - 14, 0, Math.PI * 2);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#b91c1c';
    ctx.font = 'bold 11.5px sans-serif';
    ctx.fillText('★ BOLATEE KALAM OFFICIAL SEAL ★', stampCenterX, stampCenterY - 42);

    ctx.font = 'bold 28px serif';
    ctx.fillText('🪶', stampCenterX, stampCenterY - 8);

    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(stampCenterX - 62, stampCenterY + 12, 124, 24);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12.5px sans-serif';
    ctx.fillText('VERIFIED 2026', stampCenterX, stampCenterY + 29);

    ctx.fillStyle = '#b91c1c';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('डिजिटल प्रमाणिक', stampCenterX, stampCenterY + 52);

    // 8. Signatures Footer (Y = 1192 to 1262, Height = 70)
    ctx.fillStyle = '#0e2238';
    ctx.fillRect(58, 1192, 964, 70);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 18.5px sans-serif';
    ctx.fillText('बोलती कलम (bolateeworld.in) — राष्ट्रीय साहित्यिक मंच', 90, 1234);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 19.5px serif';
    ctx.fillText('✍️ प्रमाणित: बोलती कलम आधिकारिक साहित्यिक मंडल', 985, 1234);

    return canvas;
  };

  const handleDownloadHD = async () => {
    setDownloading(true);
    try {
      // Primary Method: High-Resolution Native Canvas
      try {
        const canvas = await generateCanvasPNG();
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `BolateeKalam_Membership_${membershipId}.png`;
        link.href = dataUrl;
        link.click();
        return;
      } catch (canvasErr) {
        console.warn('Canvas generator fallback to html2canvas:', canvasErr);
      }

      // Secondary Method: DOM html2canvas fallback
      if (cardRef.current) {
        const domCanvas = await html2canvas(cardRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#fdfbf7'
        });
        const dataUrl = domCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `BolateeKalam_Membership_${membershipId}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (e) {
      console.error('Membership card download error:', e);
      alert('डाउनलोड में त्रुटि हुई। कृपया पुनः प्रयास करें।');
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
      <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-xl w-full p-3.5 sm:p-5 shadow-2xl space-y-4 my-auto max-h-[94vh] overflow-y-auto relative">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
              🎖️
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 font-rozha">
                राष्ट्रीय 6-माह डिजिटल साहित्यिक सदस्यता पत्र
              </h3>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 font-bold">
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

        {/* The Exact Visual Card Preview (Spacious, Elegant, Centered & Balanced) */}
        <div 
          ref={cardRef}
          className="relative rounded-2xl p-4 sm:p-6 bg-[#fdfbf7] text-slate-900 border-4 border-[#0e2238] shadow-2xl space-y-4 overflow-hidden"
        >
          
          {/* Card Top Header with Fixed Sized & Stabilized Logo */}
          <div className="flex items-center justify-between gap-3 border-b-2 border-amber-500/40 pb-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-full border-2 border-amber-500 shadow-sm bg-white p-1 flex items-center justify-center shrink-0">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-full h-full object-contain rounded-full" 
                />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-black font-rozha text-[#0e2238] leading-tight">बोलती कलम</h4>
                <p className="text-[11px] text-slate-600 font-bold">bolateeworld.in • राष्ट्रीय डिजिटल मंच</p>
              </div>
            </div>

            <div className="text-right">
              <div className="px-3 py-1 bg-[#0e2238] text-amber-300 rounded-xl border border-amber-500 text-xs font-bold font-mono shadow-sm">
                क्रमांक: {membershipId}
              </div>
              <span className="text-[10px] text-slate-500 font-serif italic block mt-0.5">“शब्दों से संवाद, विचारों से परिवर्तन”</span>
            </div>
          </div>

          {/* Ribbon Title */}
          <div className="py-2 px-3 bg-[#0e2238] text-white text-center rounded-xl font-bold text-xs sm:text-sm border border-amber-500 shadow-sm">
            ◆ राष्ट्रीय 6-माह डिजिटल साहित्यिक सदस्यता पहचान पत्र ◆
          </div>

          {/* Author Details (Centrally Aligned & Spacious) */}
          <div className="flex flex-col items-center text-center space-y-2 py-1">
            <div className="relative">
              <img 
                src={userAvatar} 
                alt={userName} 
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-[#0e2238] shadow-xl ring-4 ring-amber-500/80" 
              />
            </div>
            <div className="space-y-0.5 pt-1">
              <h5 className="text-2xl sm:text-3xl font-black font-rozha text-[#0e2238]">{userName}</h5>
              <p className="text-sm font-bold text-amber-700">@{cleanUsername}</p>
            </div>

            {/* Single-Line Certification Tagline */}
            <p className="text-xs sm:text-sm font-bold font-rozha text-[#0e2238] border-y border-amber-500/30 py-1.5 px-2 w-full max-w-lg">
              बोलती कलम राष्ट्रीय डिजिटल मंच प्रमाणित करता है कि उपरोक्त रचनाकार हमारे अधिकृत 6-माह डिजिटल सदस्य हैं।
            </p>

            <span className="px-4 py-0.5 rounded-full text-xs font-extrabold bg-slate-100 border-2 border-[#0e2238] text-[#0e2238] shadow-sm">
              {isExpired ? '⚠️ सदस्यता समाप्त (6 माह पूर्ण)' : '✔ 100% निःशुल्क आजीवन साहित्यिक सदस्य'}
            </span>
          </div>

          {/* Clean 2-Item Date & Validity Row */}
          <div className="grid grid-cols-2 gap-3 p-3 sm:p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center">
            <div className="border-r border-slate-200 pr-2">
              <span className="text-xs text-slate-500 font-bold block mb-0.5">📅 सदस्यता जारी तिथि</span>
              <span className="text-sm sm:text-base font-bold font-rozha text-slate-900 block">{startDateStr}</span>
            </div>
            <div className="pl-2">
              <span className="text-xs text-slate-500 font-bold block mb-0.5">⏳ सदस्यता वैधता (6 माह)</span>
              <span className="text-sm sm:text-base font-bold font-rozha text-amber-700 block">{endDateStr} (सक्रिय)</span>
            </div>
          </div>

          {/* Grand Navy Mission Box */}
          <div className="p-3.5 sm:p-4 bg-[#0e2238] text-white rounded-2xl border-2 border-amber-500 space-y-2 text-center shadow-lg">
            <h6 className="font-bold text-amber-300 font-rozha text-sm sm:text-base">✦ बोलती कलम राष्ट्रीय डिजिटल साहित्यिक मंच ✦</h6>
            <p className="text-xs text-slate-200 leading-relaxed font-serif">
              बोलती कलम एक राष्ट्रीय डिजिटल साहित्यिक मंच है, जो साहित्य प्रेमियों और रचनाकारों को एक साझा मंच पर लाकर रचनात्मक अभिव्यक्ति को नई पहचान देता है।
            </p>
            <p className="text-[11px] text-amber-200 font-medium pt-1 border-t border-amber-500/30">
              आधिकारिक यूट्यूब चैनल (<strong className="text-white">@bolateekalam</strong>) द्वारा विशेष काव्य गोष्ठियाँ प्रसारित की जाती हैं।
            </p>
          </div>

          {/* Compact Verified Seal & Stamp */}
          <div className="p-3.5 bg-amber-50/90 border-2 border-amber-400 rounded-2xl flex items-center justify-between flex-wrap gap-3 shadow-sm">
            <div className="space-y-0.5 max-w-xs text-left">
              <p className="font-bold text-[#0e2238] flex items-center gap-1 text-xs sm:text-sm font-rozha">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
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
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full border-4 border-dashed border-red-700 bg-red-50 flex flex-col items-center justify-center text-center p-1 shadow-inner shrink-0 rotate-[-6deg] mx-auto sm:mx-0">
              <span className="text-[8px] font-black uppercase text-red-800 tracking-tighter">BOLATEE KALAM</span>
              <span className="text-xs font-black text-red-700">🪶</span>
              <span className="text-[8px] font-black bg-red-700 text-white px-1.5 py-0.5 rounded mt-0.5">VERIFIED</span>
              <span className="text-[7px] text-red-800 font-bold mt-0.5">2026-27</span>
            </div>
          </div>

          {/* Signatures Footer */}
          <div className="flex items-center justify-between p-2.5 bg-[#0e2238] text-white rounded-xl text-xs flex-wrap gap-2">
            <span className="text-[11px] text-slate-300 font-medium">बोलती कलम (bolateeworld.in)</span>
            <span className="font-bold font-rozha text-amber-300 text-xs sm:text-sm">✍️ प्रमाणित: बोलती कलम आधिकारिक मंडल</span>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleDownloadHD}
            disabled={downloading}
            className="w-full py-3 px-4 bg-[#0e2238] hover:bg-slate-900 text-amber-300 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl border border-amber-500/40 transition active:scale-95 cursor-pointer disabled:opacity-50"
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
