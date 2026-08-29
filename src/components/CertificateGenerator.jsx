import React, { useRef, useState } from 'react';
import { Award, Download, Sparkles, X, ShieldCheck, CheckCircle2, Lock, Share2, Copy, Check, Calendar, MapPin, Feather, Flame, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { useLanguage } from '../context/LanguageContext';

export const CertificateGenerator = ({ 
  isOpen, 
  onClose, 
  certificateData, 
  userPoints = 30, 
  userProfile,
  totalUserPosts = 1,
  userStreak = 3,
  onOpenCreatePost 
}) => {
  const { t } = useLanguage();
  const [downloading, setDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const certContainerRef = useRef(null);

  if (!isOpen) return null;

  const userName = certificateData?.recipientName || userProfile?.name || 'साहित्य साधक';
  const cleanUsername = (userProfile?.username || 'writer').replace(/^[@#]/, '');
  const userCity = userProfile?.city || certificateData?.city || 'प्रयागराज';
  const certType = certificateData?.type || certificateData?.title || 'प्रथम साहित्यिक पदार्पण सम्मान पत्र';
  const certId = certificateData?.certificateId || `BW-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const certDate = certificateData?.date || new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  // Milestone unlock requirements
  const requiredPosts = certificateData?.requiredPosts || 0;
  const requiredPoints = certificateData?.requiredPoints || 0;
  const requiredStreak = certificateData?.requiredStreak || 0;

  const isUnlocked = certificateData?.isUnlocked !== undefined 
    ? certificateData.isUnlocked 
    : (totalUserPosts >= requiredPosts && userPoints >= requiredPoints && userStreak >= requiredStreak);

  // Safe Image Loader Helper
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

  // Generate 4:3 Aspect Ratio (1200x900) High-Resolution Royal Certificate Canvas PNG
  const generateCertificateCanvas = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');

    // 1. Soft Parchment Ivory Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1200, 900);

    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 900);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(0.5, '#fdfbf7');
    bgGrad.addColorStop(1, '#fffdf9');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 900);

    // 2. Corner Multi-Color Geometric Border Accents
    // Top Left Corner
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(80, 0);
    ctx.lineTo(0, 80);
    ctx.fill();

    ctx.fillStyle = '#be123c';
    ctx.beginPath();
    ctx.moveTo(0, 80);
    ctx.lineTo(80, 0);
    ctx.lineTo(110, 0);
    ctx.lineTo(0, 110);
    ctx.fill();

    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.moveTo(0, 110);
    ctx.lineTo(110, 0);
    ctx.lineTo(140, 0);
    ctx.lineTo(0, 140);
    ctx.fill();

    // Top Right Corner
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(1200, 0);
    ctx.lineTo(1120, 0);
    ctx.lineTo(1200, 80);
    ctx.fill();

    ctx.fillStyle = '#be123c';
    ctx.beginPath();
    ctx.moveTo(1200, 80);
    ctx.lineTo(1120, 0);
    ctx.lineTo(1090, 0);
    ctx.lineTo(1200, 110);
    ctx.fill();

    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.moveTo(1200, 110);
    ctx.lineTo(1090, 0);
    ctx.lineTo(1060, 0);
    ctx.lineTo(1200, 140);
    ctx.fill();

    // Bottom Left Corner
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(0, 900);
    ctx.lineTo(80, 900);
    ctx.lineTo(0, 820);
    ctx.fill();

    ctx.fillStyle = '#be123c';
    ctx.beginPath();
    ctx.moveTo(0, 820);
    ctx.lineTo(80, 900);
    ctx.lineTo(110, 900);
    ctx.lineTo(0, 790);
    ctx.fill();

    // Bottom Right Corner
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(1200, 900);
    ctx.lineTo(1120, 900);
    ctx.lineTo(1200, 820);
    ctx.fill();

    ctx.fillStyle = '#be123c';
    ctx.beginPath();
    ctx.moveTo(1200, 820);
    ctx.lineTo(1120, 900);
    ctx.lineTo(1090, 900);
    ctx.lineTo(1200, 790);
    ctx.fill();

    // Main Outer Navy Frame
    ctx.strokeStyle = '#0e2238';
    ctx.lineWidth = 4.5;
    ctx.strokeRect(30, 30, 1140, 840);

    // Inner Fine Gold Line
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(38, 38, 1124, 824);

    const logoImg = await safeLoadImage('/logo.png');

    // 3. Top Emblem & Logo
    if (logoImg) {
      ctx.drawImage(logoImg, 560, 65, 80, 80);
    } else {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(600, 105, 42, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0e2238';
      ctx.beginPath();
      ctx.arc(600, 105, 36, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 13px serif';
      ctx.fillText('बोलती कलम', 568, 110);
    }

    // 4. Main Headings
    ctx.fillStyle = '#0e2238';
    ctx.font = 'bold 44px serif';
    const mainHeader = 'बोलती कलम';
    const mhWidth = ctx.measureText(mainHeader).width;
    ctx.fillText(mainHeader, (1200 - mhWidth) / 2, 195);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 16px sans-serif';
    const subSub = 'राष्ट्रीय डिजिटल साहित्यिक मंच (bolateeworld.in)';
    const ssWidth = ctx.measureText(subSub).width;
    ctx.fillText(subSub, (1200 - ssWidth) / 2, 222);

    // Certificate Specific Title
    ctx.fillStyle = '#881337';
    ctx.font = 'bold 34px serif';
    const subHeader = certType;
    const shWidth = ctx.measureText(subHeader).width;
    ctx.fillText(subHeader, (1200 - shWidth) / 2, 268);

    // 5. Recipient Section
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 20px serif';
    const salutation = 'आदरणीय / आदरणीया';
    const salWidth = ctx.measureText(salutation).width;
    ctx.fillText(salutation, (1200 - salWidth) / 2, 312);

    // Recipient Name
    ctx.fillStyle = '#0e2238';
    ctx.font = 'bold 36px serif';
    const rNameWidth = ctx.measureText(userName).width;
    ctx.fillText(userName, (1200 - rNameWidth) / 2, 365);

    ctx.strokeStyle = '#0e2238';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(350, 385);
    ctx.lineTo(850, 385);
    ctx.stroke();

    // 6. Metadata Row: दिनांक & स्थान
    ctx.fillStyle = '#0e2238';
    ctx.font = 'bold 21px serif';
    ctx.fillText(`दिनांक:  ${certDate}`, 260, 435);
    ctx.fillText(`स्थान:  ${userCity}`, 740, 435);

    // 7. Citation Statement Text based on certificate type
    ctx.fillStyle = '#1e293b';
    ctx.font = '20px serif';

    let line1 = 'बोलती कलम (Bolti Kalam) डिजिटल साहित्यिक मंच पर आपका हार्दिक स्वागत व अभिनंदन है।';
    let line2 = 'आपकी साहित्यिक यात्रा मंगलमय, प्रेरणादायी और सृजनात्मक उपलब्धियों से परिपूर्ण हो,';
    let line3 = 'इस हेतु बोलती कलम साहित्यिक परिषद द्वारा यह प्रथम पदार्पण सम्मान पत्र सादर समर्पित';
    let line4 = 'किया जाता है। हम कामना करते हैं कि आप यूँ ही साहित्य की रोशनी फैलाते रहें।';

    if (certType.includes('30 Days') || certType.includes('मासिक काव्य साधना')) {
      line1 = 'ने बोलती कलम (Bolti Kalam) मंच पर लगातार 30 दिन की अखंड दैनिक साहित्यिक उपस्थिति';
      line2 = 'और काव्य साधना पूर्ण कर अनुपम निष्ठा का परिचय दिया है। आपकी इस निरंतर लगन को सम्मानित';
      line3 = 'करते हुए बोलती कलम साहित्यिक परिषद गर्व के साथ यह सम्मान पत्र प्रदान करती है।';
      line4 = 'हम आपकी अनवरत साहित्यिक यात्रा की उज्ज्वल मंगलकामना करते हैं।';
    } else if (certType.includes('Streak') || certType.includes('साधना') || certType.includes('शिरोमणि') || certType.includes('मनीषी')) {
      line1 = `ने बोलती कलम (Bolti Kalam) मंच पर निरंतर ${requiredStreak || 60} दिनों की अटूट सक्रियता व काव्य साधना`;
      line2 = 'पूर्ण कर साहित्य जगत में विशिष्ट कीर्तिमान स्थापित किया है। आपकी अनवरत निष्ठा व शब्दों';
      line3 = 'के प्रति प्रेम को नमन करते हुए बोलती कलम साहित्यिक परिषद यह सम्मान पत्र सादर समर्पित करती है।';
      line4 = 'हम आपके यशस्वी एवं प्रेरणादायी साहित्यिक जीवन की मंगलकामना करते हैं।';
    } else if (certType.includes('अर्ध-शतक') || certType.includes('50')) {
      line1 = 'ने बोलती कलम (Bolti Kalam) मंच पर 50 उत्कृष्ट काव्य रचनाएँ प्रकाशित कर साहित्यिक साधना';
      line2 = 'का अद्भुत परिचय दिया है। आपकी सृजनशीलता व शब्दों के प्रति अटूट निष्ठा को नमन करते हुए';
      line3 = 'बोलती कलम साहित्यिक परिषद गर्व के साथ आपको यह सम्मान पत्र प्रदान करती है।';
      line4 = 'हम आपके उज्ज्वल एवं यशस्वी साहित्यिक भविष्य की मंगलकामना करते हैं।';
    }

    ctx.fillText(line1, (1200 - ctx.measureText(line1).width) / 2, 500);
    ctx.fillText(line2, (1200 - ctx.measureText(line2).width) / 2, 535);
    ctx.fillText(line3, (1200 - ctx.measureText(line3).width) / 2, 570);
    ctx.fillText(line4, (1200 - ctx.measureText(line4).width) / 2, 605);

    // 8. 5 Signatures at Bottom
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, 670);
    ctx.lineTo(1120, 670);
    ctx.stroke();

    const signY = 730;
    const titleY = 760;
    const roleY = 785;

    // 1. Sanjay Rai
    ctx.fillStyle = '#0f172a';
    ctx.font = 'italic bold 22px serif';
    ctx.fillText('Sanjay Rai', 130, signY);
    ctx.font = 'bold 15px serif';
    ctx.fillText('संजय राय "साईं"', 130, titleY);
    ctx.fillStyle = '#64748b';
    ctx.font = '13px sans-serif';
    ctx.fillText('संस्थापक', 150, roleY);

    // 2. Sandeep Sharma
    ctx.fillStyle = '#0f172a';
    ctx.font = 'italic bold 22px serif';
    ctx.fillText('Sandeep Sharma', 330, signY);
    ctx.font = 'bold 15px serif';
    ctx.fillText('संदीप शर्मा "सरल"', 345, titleY);
    ctx.fillStyle = '#64748b';
    ctx.font = '13px sans-serif';
    ctx.fillText('उपाध्यक्ष', 370, roleY);

    // 3. R.D. Gautam
    ctx.fillStyle = '#0f172a';
    ctx.font = 'italic bold 22px serif';
    ctx.fillText('R. D. Gautam', 570, signY);
    ctx.font = 'bold 15px serif';
    ctx.fillText('आर.डी. गौतम विनम्र', 560, titleY);
    ctx.fillStyle = '#64748b';
    ctx.font = '13px sans-serif';
    ctx.fillText('उपाध्यक्ष', 590, roleY);

    // 4. Pushpa Pathak
    ctx.fillStyle = '#0f172a';
    ctx.font = 'italic bold 22px serif';
    ctx.fillText('Pushpa Pathak', 770, signY);
    ctx.font = 'bold 15px serif';
    ctx.fillText('पुष्पा पाठक', 790, titleY);
    ctx.fillStyle = '#64748b';
    ctx.font = '13px sans-serif';
    ctx.fillText('संरक्षक, अध्यक्ष', 780, roleY);

    // 5. Akash Singh
    ctx.fillStyle = '#0f172a';
    ctx.font = 'italic bold 22px serif';
    ctx.fillText('Akash Singh', 970, signY);
    ctx.font = 'bold 15px serif';
    ctx.fillText('आकाश सिंह', 985, titleY);
    ctx.fillStyle = '#64748b';
    ctx.font = '13px sans-serif';
    ctx.fillText('प्रबंधक', 995, roleY);

    // Verification Footer
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText(`प्रमाणपत्र क्रमांक: ${certId} • बोलती कलम डिजिटल प्रमाणन (bolateeworld.in)`, 400, 835);

    return canvas;
  };

  const handleDownloadCertificate = async () => {
    if (!isUnlocked) return;
    setDownloading(true);

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    try {
      // Primary: Native Canvas Generator (1200x900 HD)
      try {
        const canvas = await generateCertificateCanvas();
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `BoltiKalam_Certificate_${certId}.png`;
        link.href = dataUrl;
        link.click();
        return;
      } catch (canvasErr) {
        console.warn('Canvas generator fallback to html2canvas:', canvasErr);
      }

      // Secondary: DOM html2canvas fallback
      if (certContainerRef.current) {
        const domCanvas = await html2canvas(certContainerRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#fdfbf7'
        });
        const dataUrl = domCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `BoltiKalam_Certificate_${certId}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Certificate download error:', err);
      alert('सर्टिफिकेट डाउनलोड में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setDownloading(false);
    }
  };

  const certShareUrl = `https://www.bolateeworld.in/${cleanUsername}/certificate`;
  const shareText = `📜 मुझे 'बोलती कलम' (bolateeworld.in) द्वारा '${certType}' से सम्मानित किया गया है!\nरचनाकार: ${userName} (@${cleanUsername})\nप्रमाणपत्र क्रमांक: ${certId}\nदेखें: ${certShareUrl}`;

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(certShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-4xl w-full p-3.5 sm:p-5 shadow-2xl space-y-4 max-h-[96vh] overflow-y-auto my-auto relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 font-rozha">
                {certType}
              </h3>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                बोलती कलम आधिकारिक डिजिटल सम्मान पत्र (bolateeworld.in)
              </p>
            </div>
          </div>
          <button onClick={onClose} aria-label="बंद करें" className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Container with Fixed Aspect Ratio & Responsive Scaling */}
        <div 
          ref={certContainerRef}
          className="relative overflow-hidden rounded-2xl border-4 border-[#0e2238] bg-[#fdfbf7] p-4 sm:p-7 text-slate-900 shadow-2xl space-y-3.5 max-w-full"
        >
          
          {!isUnlocked && (
            <div className="absolute inset-0 z-20 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 text-center space-y-3">
              <div className="p-4 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Lock className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-amber-300 font-rozha">
                यह सम्मान पत्र अभी लॉक है!
              </h4>
              <p className="text-xs text-slate-300 max-w-md font-tiro">
                {requiredStreak > 0 && `अनलॉक करने के लिए लगातार ${requiredStreak} दिन तक रोज़ाना 5 मिनट सक्रिय रहें। (वर्तमान स्ट्रीक: ${userStreak}/${requiredStreak} दिन)`}
                {requiredPosts > 0 && `अनलॉक करने के लिए कम से कम ${requiredPosts} कविताएं पोस्ट करें। (वर्तमान: ${totalUserPosts}/${requiredPosts})`}
                {requiredPoints > 0 && ` या ${requiredPoints} रिवॉर्ड पॉइंट्स अर्जित करें।`}
              </p>
              {onOpenCreatePost && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenCreatePost();
                  }}
                  className="mt-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-2 transition active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>+ नई रचना लिखकर सक्रिय रहें</span>
                </button>
              )}
            </div>
          )}

          {/* Top Logo Emblem */}
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-white text-[#0e2238] flex items-center justify-center shadow-md border-2 border-amber-400 p-1">
              <img src="/logo.png" alt="Bolti Kalam Logo" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Certificate Titles */}
          <div className="text-center space-y-0.5">
            <h1 className="text-xl sm:text-3xl font-black font-rozha text-[#0e2238] tracking-wide">
              बोलती कलम
            </h1>
            <p className="text-[10px] sm:text-xs font-sans font-bold text-slate-600">
              राष्ट्रीय डिजिटल साहित्यिक मंच (bolateeworld.in)
            </p>
            <h2 className="text-base sm:text-2xl font-bold font-rozha text-rose-900 pt-0.5">
              {certType}
            </h2>
          </div>

          {/* Recipient Section */}
          <div className="text-center space-y-0.5 py-0.5">
            <p className="text-xs font-serif font-bold text-slate-600">
              आदरणीय / आदरणीया
            </p>
            <h3 className="text-xl sm:text-2xl font-black font-rozha text-[#0e2238]">
              {userName}
            </h3>
            <div className="w-40 sm:w-48 h-0.5 bg-[#0e2238] mx-auto" />
          </div>

          {/* Metadata Row: Date & City */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-serif font-bold text-[#0e2238] px-2 sm:px-10">
            <span>दिनांक: <strong>{certDate}</strong></span>
            <span>स्थान: <strong>{userCity}</strong></span>
          </div>

          {/* Citation Body Text */}
          <div className="text-center text-[11px] sm:text-xs text-slate-800 leading-relaxed font-serif max-w-2xl mx-auto space-y-1 px-1">
            {certType.includes('30 Days') || certType.includes('मासिक काव्य साधना') ? (
              <>
                <p>
                  ने <strong>बोलती कलम (Bolti Kalam)</strong> मंच पर लगातार 30 दिन की अखंड दैनिक साहित्यिक उपस्थिति और काव्य साधना पूर्ण कर अनुपम निष्ठा का परिचय दिया है।
                </p>
                <p>
                  आपकी इस निरंतर लगन व साधना को सम्मानित करते हुए बोलती कलम साहित्यिक परिषद गर्व के साथ यह सम्मान पत्र प्रदान करती है। हम आपकी अनवरत साहित्यिक यात्रा की मंगलकामना करते हैं।
                </p>
              </>
            ) : certType.includes('Streak') || certType.includes('साधना') || certType.includes('शिरोमणि') || certType.includes('मनीषी') ? (
              <>
                <p>
                  ने <strong>बोलती कलम (Bolti Kalam)</strong> मंच पर निरंतर {requiredStreak} दिनों की अटूट सक्रियता व काव्य साधना पूर्ण कर साहित्य जगत में विशिष्ट कीर्तिमान स्थापित किया है।
                </p>
                <p>
                  आपकी अनवरत निष्ठा व शब्दों के प्रति प्रेम को नमन करते हुए बोलती कलम साहित्यिक परिषद यह सम्मान पत्र सादर समर्पित करती है।
                </p>
              </>
            ) : certType.includes('अर्ध-शतक') ? (
              <>
                <p>
                  ने <strong>बोलती कलम (Bolti Kalam)</strong> मंच पर 50 उत्कृष्ट काव्य रचनाएँ प्रकाशित कर साहित्यिक साधना का अद्भुत परिचय दिया है।
                </p>
                <p>
                  आपकी सृजनशीलता व शब्दों के प्रति अटूट निष्ठा को नमन करते हुए बोलती कलम साहित्यिक परिषद गर्व के साथ आपको यह सम्मान पत्र प्रदान करती है।
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>बोलती कलम (Bolti Kalam)</strong> डिजिटल साहित्यिक मंच पर आपका हार्दिक स्वागत व अभिनंदन है।
                </p>
                <p>
                  आपकी साहित्यिक यात्रा मंगलमय, प्रेरणादायी और सृजनात्मक उपलब्धियों से परिपूर्ण हो, इस हेतु बोलती कलम साहित्यिक परिषद द्वारा यह <strong>प्रथम पदार्पण सम्मान पत्र</strong> सादर समर्पित किया जाता है।
                </p>
              </>
            )}
          </div>

          {/* 5 Signatures Grid (Responsive & Balanced) */}
          <div className="pt-3 border-t border-slate-300 grid grid-cols-5 gap-1 text-center text-[10px]">
            <div className="space-y-0.5">
              <span className="font-serif italic font-bold text-slate-800 block text-[11px] truncate">Sanjay Rai</span>
              <span className="font-bold text-slate-900 block text-[10px] truncate">संजय राय</span>
              <span className="text-[9px] text-slate-500 block truncate">संस्थापक</span>
            </div>

            <div className="space-y-0.5">
              <span className="font-serif italic font-bold text-slate-800 block text-[11px] truncate">Sandeep Sharma</span>
              <span className="font-bold text-slate-900 block text-[10px] truncate">संदीप शर्मा</span>
              <span className="text-[9px] text-slate-500 block truncate">उपाध्यक्ष</span>
            </div>

            <div className="space-y-0.5">
              <span className="font-serif italic font-bold text-slate-800 block text-[11px] truncate">R. D. Gautam</span>
              <span className="font-bold text-slate-900 block text-[10px] truncate">आर.डी. गौतम</span>
              <span className="text-[9px] text-slate-500 block truncate">उपाध्यक्ष</span>
            </div>

            <div className="space-y-0.5">
              <span className="font-serif italic font-bold text-slate-800 block text-[11px] truncate">Pushpa Pathak</span>
              <span className="font-bold text-slate-900 block text-[10px] truncate">पुष्पा पाठक</span>
              <span className="text-[9px] text-slate-500 block truncate">संरक्षक</span>
            </div>

            <div className="space-y-0.5">
              <span className="font-serif italic font-bold text-slate-800 block text-[11px] truncate">Akash Singh</span>
              <span className="font-bold text-slate-900 block text-[10px] truncate">आकाश सिंह</span>
              <span className="text-[9px] text-slate-500 block truncate">प्रबंधक</span>
            </div>
          </div>

          {/* Verification Code Footer */}
          <div className="text-center text-[10px] text-slate-500 pt-0.5">
            प्रमाणपत्र क्रमांक: <strong>{certId}</strong> • बोलती कलम डिजिटल प्रमाणन (bolateeworld.in)
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            onClick={handleDownloadCertificate}
            disabled={!isUnlocked || downloading}
            className="flex-1 py-3 bg-gradient-to-r from-[#0e2238] via-slate-900 to-[#0e2238] hover:brightness-110 text-white font-extrabold rounded-2xl text-xs shadow-xl flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 cursor-pointer border border-amber-500/40"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{downloading ? 'सर्टिफिकेट तैयार हो रहा है...' : '📥 HD सम्मान पत्र डाउनलोड करें (HD PNG)'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            disabled={!isUnlocked}
            className="py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp पर शेयर</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-2xl text-xs shadow flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'कॉपी हुआ!' : 'URL कॉपी'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default CertificateGenerator;
