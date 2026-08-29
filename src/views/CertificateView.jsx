import React, { useState, useRef, useEffect } from 'react';
import { Award, Download, Share2, Copy, Check, ArrowLeft, Sparkles, ShieldCheck, Flame, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CertificateView = ({ 
  userProfile, 
  setActiveView,
  initialCertId = null,
  totalUserPosts = 1,
  userStreak = 3,
  userPoints = 50
}) => {
  const [downloading, setDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const certContainerRef = useRef(null);

  const userName = userProfile?.name || 'साहित्य साधक';
  const cleanUsername = (userProfile?.username || 'writer').replace(/^[@#]/, '');
  const userCity = userProfile?.city || 'प्रयागराज';

  // Available Certificates list
  const certificatesList = [
    {
      id: 'cert_welcome',
      title: 'प्रथम साहित्यिक पदार्पण सम्मान पत्र',
      badgeText: 'साहित्यिक पदार्पण',
      date: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
      certificateId: 'BK-PADARPAN-2026-001',
      citationType: 'welcome'
    },
    {
      id: 'cert_streak_3',
      title: '3-दिवसीय काव्य साधना सम्मान पत्र',
      badgeText: '3-दिवसीय स्ट्रीक',
      date: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
      certificateId: 'BK-STREAK3-2026-108',
      citationType: 'streak3'
    },
    {
      id: 'cert_streak_7',
      title: 'काव्य शिरोमणि सम्मान पत्र 2026',
      badgeText: '7-दिवसीय अखंड साधना',
      date: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
      certificateId: 'BK-SHIROMANI-2026-777',
      citationType: 'shiromani'
    },
    {
      id: 'cert_streak_30',
      title: 'मासिक काव्य साधना गौरव सम्मान',
      badgeText: '30-दिवसीय अखंड साधना',
      date: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
      certificateId: 'BK-RATNA-2026-300',
      citationType: 'streak30'
    },
    {
      id: 'cert_posts_50',
      title: 'अर्ध-शतक काव्य श्री सम्मान पत्र',
      badgeText: '50 रचनाएं पूर्ण',
      date: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
      certificateId: 'BK-ARDH-SHATAK-2026-50',
      citationType: 'posts50'
    }
  ];

  const [selectedCert, setSelectedCert] = useState(certificatesList[0]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `${selectedCert.title} — ${userName} | बोलती कलम`;
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  }, [selectedCert]);

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
    const subHeader = selectedCert.title;
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
    ctx.fillText(`दिनांक:  ${selectedCert.date}`, 260, 435);
    ctx.fillText(`स्थान:  ${userCity}`, 740, 435);

    // 7. Citation Statement Text
    ctx.fillStyle = '#1e293b';
    ctx.font = '20px serif';

    if (selectedCert.citationType === 'streak30') {
      const line1 = 'ने बोलती कलम (Bolti Kalam) मंच पर लगातार 30 दिन की अखंड दैनिक साहित्यिक उपस्थिति और';
      const line2 = 'काव्य साधना पूर्ण कर अनुपम निष्ठा का परिचय दिया है।';
      const line3 = 'आपकी इस निरंतर लगन व साधना को सम्मानित करते हुए बोलती कलम साहित्यिक परिषद गर्व के साथ यह सम्मान पत्र प्रदान करती है।';
      
      ctx.fillText(line1, (1200 - ctx.measureText(line1).width) / 2, 490);
      ctx.fillText(line2, (1200 - ctx.measureText(line2).width) / 2, 525);
      ctx.fillText(line3, (1200 - ctx.measureText(line3).width) / 2, 560);
    } else if (selectedCert.citationType === 'posts50') {
      const line1 = 'ने बोलती कलम (Bolti Kalam) मंच पर 50 उत्कृष्ट काव्य रचनाएँ प्रकाशित कर साहित्यिक साधना का अद्भुत परिचय दिया है।';
      const line2 = 'आपकी सृजनशीलता व शब्दों के प्रति अटूट निष्ठा को नमन करते हुए बोलती कलम परिषद गर्व के साथ आपको यह सम्मान पत्र प्रदान करती है।';
      
      ctx.fillText(line1, (1200 - ctx.measureText(line1).width) / 2, 500);
      ctx.fillText(line2, (1200 - ctx.measureText(line2).width) / 2, 540);
    } else if (selectedCert.citationType === 'shiromani') {
      const line1 = 'ने बोलती कलम (Bolti Kalam) मंच पर निरंतर 7 दिनों की अखंड काव्य सक्रियता व साधना पूर्ण कर';
      const line2 = 'साहित्य जगत में विशिष्ट कीर्तिमान स्थापित किया है।';
      const line3 = 'आपकी अनवरत निष्ठा व शब्दों के प्रति प्रेम को नमन करते हुए बोलती कलम साहित्यिक परिषद यह काव्य शिरोमणि सम्मान सादर समर्पित करती है।';
      
      ctx.fillText(line1, (1200 - ctx.measureText(line1).width) / 2, 490);
      ctx.fillText(line2, (1200 - ctx.measureText(line2).width) / 2, 525);
      ctx.fillText(line3, (1200 - ctx.measureText(line3).width) / 2, 560);
    } else {
      const line1 = 'बोलती कलम (Bolti Kalam) डिजिटल साहित्यिक मंच पर आपका हार्दिक स्वागत व अभिनंदन है।';
      const line2 = 'आपकी साहित्यिक यात्रा मंगलमय, प्रेरणादायी और सृजनात्मक उपलब्धियों से परिपूर्ण हो, इस हेतु';
      const line3 = 'बोलती कलम साहित्यिक परिषद द्वारा यह प्रथम पदार्पण सम्मान पत्र सादर समर्पित किया जाता है।';
      
      ctx.fillText(line1, (1200 - ctx.measureText(line1).width) / 2, 490);
      ctx.fillText(line2, (1200 - ctx.measureText(line2).width) / 2, 525);
      ctx.fillText(line3, (1200 - ctx.measureText(line3).width) / 2, 560);
    }

    // 8. Signatures Separator Line
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 620);
    ctx.lineTo(1100, 620);
    ctx.stroke();

    // 9. Signatures (5 Dignitaries)
    const signColX = [200, 400, 600, 800, 1000];
    const dignitaryData = [
      { eng: 'Sanjay Rai', hi: 'संजय राय', role: 'संस्थापक' },
      { eng: 'Sandeep Sharma', hi: 'संदीप शर्मा', role: 'उपाध्यक्ष' },
      { eng: 'R. D. Gautam', hi: 'आर.डी. गौतम', role: 'उपाध्यक्ष' },
      { eng: 'Pushpa Pathak', hi: 'पुष्पा पाठक', role: 'संरक्षक' },
      { eng: 'Akash Singh', hi: 'आकाश सिंह', role: 'प्रबंधक' }
    ];

    dignitaryData.forEach((d, idx) => {
      const x = signColX[idx];

      ctx.fillStyle = '#334155';
      ctx.font = 'italic 20px serif';
      const engW = ctx.measureText(d.eng).width;
      ctx.fillText(d.eng, x - (engW / 2), 675);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px serif';
      const hiW = ctx.measureText(d.hi).width;
      ctx.fillText(d.hi, x - (hiW / 2), 705);

      ctx.fillStyle = '#64748b';
      ctx.font = '14px sans-serif';
      const rW = ctx.measureText(d.role).width;
      ctx.fillText(d.role, x - (rW / 2), 728);
    });

    // 10. Seal & Verification Footer
    ctx.fillStyle = '#64748b';
    ctx.font = '15px sans-serif';
    const certFoot = `प्रमाणपत्र क्रमांक: ${selectedCert.certificateId} • बोलती कलम डिजिटल प्रमाणन (bolateeworld.in)`;
    const cfW = ctx.measureText(certFoot).width;
    ctx.fillText(certFoot, (1200 - cfW) / 2, 790);

    return canvas;
  };

  const handleDownloadCertificate = async () => {
    setDownloading(true);
    try {
      const canvas = await generateCertificateCanvas();
      const link = document.createElement('a');
      link.download = `BoltiKalam_Certificate_${selectedCert.certificateId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } catch (err) {
      console.error('Certificate download error:', err);
    }
    setDownloading(false);
  };

  const certShareUrl = `https://www.bolateeworld.in/${cleanUsername}/certificate`;

  const handleShareWhatsApp = () => {
    const shareText = encodeURIComponent(
      `📜 राष्ट्रीय डिजिटल साहित्यिक मंच *बोलती कलम (Bolti Kalam)* द्वारा मुझे **"${selectedCert.title}"** से सम्मानित किया गया है!\n\nलेखक: ${userName}\nप्रमाणपत्र क्रमांक: ${selectedCert.certificateId}\n\nसम्मान पत्र देखें: ${certShareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(certShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          {setActiveView && (
            <button
              onClick={() => setActiveView('feed')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="मुख्य पृष्ठ पर वापस जाएं"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">होम (Home)</span>
            </button>
          )}
          <div>
            <h1 className="text-lg sm:text-2xl font-black font-rozha text-[#0e2238] dark:text-amber-300 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500 shrink-0" />
              <span>साहित्यिक सम्मान पत्र (E-Certificate)</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-serif">
              लेखक: <strong className="text-slate-800 dark:text-slate-200">{userName}</strong> (@{cleanUsername}) • bolateeworld.in
            </p>
          </div>
        </div>

        {/* Certificate Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
          {certificatesList.map((cert) => (
            <button
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                selectedCert.id === cert.id
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>📜</span>
              <span>{cert.badgeText}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 📜 Pure High-Resolution Royal Certificate Canvas Card (Permanently on Screen) */}
      <div 
        ref={certContainerRef}
        className="relative overflow-hidden rounded-3xl border-4 border-[#0e2238] bg-[#fdfbf7] p-5 sm:p-10 text-slate-900 shadow-2xl space-y-4 max-w-4xl mx-auto"
      >
        
        {/* Top Logo Emblem */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-white text-[#0e2238] flex items-center justify-center shadow-md border-2 border-amber-400 p-1.5">
            <img src="/logo.png" alt="Bolti Kalam Logo" className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
            <span className="text-2xl font-bold">🪶</span>
          </div>
        </div>

        {/* Certificate Titles */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-4xl font-black font-rozha text-[#0e2238] tracking-wide">
            बोलती कलम
          </h2>
          <p className="text-xs sm:text-sm font-sans font-bold text-slate-600">
            राष्ट्रीय डिजिटल साहित्यिक मंच (bolateeworld.in)
          </p>
          <h3 className="text-lg sm:text-2xl font-bold font-rozha text-rose-900 pt-1">
            {selectedCert.title}
          </h3>
        </div>

        {/* Recipient Section */}
        <div className="text-center space-y-1 py-1">
          <p className="text-xs sm:text-sm font-serif font-bold text-slate-600">
            आदरणीय / आदरणीया
          </p>
          <h4 className="text-2xl sm:text-3xl font-black font-rozha text-[#0e2238]">
            {userName}
          </h4>
          <div className="w-48 sm:w-64 h-0.5 bg-[#0e2238] mx-auto" />
        </div>

        {/* Metadata Row: Date & City */}
        <div className="flex items-center justify-between text-xs sm:text-sm font-serif font-bold text-[#0e2238] px-2 sm:px-12">
          <span>दिनांक: <strong>{selectedCert.date}</strong></span>
          <span>स्थान: <strong>{userCity}</strong></span>
        </div>

        {/* Citation Body Text */}
        <div className="text-center text-xs sm:text-sm text-slate-800 leading-relaxed font-serif max-w-2xl mx-auto space-y-1.5 px-2 py-2">
          {selectedCert.citationType === 'streak30' ? (
            <>
              <p>
                ने <strong>बोलती कलम (Bolti Kalam)</strong> मंच पर लगातार 30 दिन की अखंड दैनिक साहित्यिक उपस्थिति और काव्य साधना पूर्ण कर अनुपम निष्ठा का परिचय दिया है।
              </p>
              <p>
                आपकी इस निरंतर लगन व साधना को सम्मानित करते हुए बोलती कलम साहित्यिक परिषद गर्व के साथ यह सम्मान पत्र प्रदान करती है। हम आपकी अनवरत साहित्यिक यात्रा की मंगलकामना करते हैं।
              </p>
            </>
          ) : selectedCert.citationType === 'posts50' ? (
            <>
              <p>
                ने <strong>बोलती कलम (Bolti Kalam)</strong> मंच पर 50 उत्कृष्ट काव्य रचनाएँ प्रकाशित कर साहित्यिक साधना का अद्भुत परिचय दिया है।
              </p>
              <p>
                आपकी सृजनशीलता व शब्दों के प्रति अटूट निष्ठा को नमन करते हुए बोलती कलम परिषद गर्व के साथ आपको यह सम्मान पत्र प्रदान करती है।
              </p>
            </>
          ) : selectedCert.citationType === 'shiromani' ? (
            <>
              <p>
                ने <strong>बोलती कलम (Bolti Kalam)</strong> मंच पर निरंतर 7 दिनों की अखंड काव्य सक्रियता व साधना पूर्ण कर साहित्य जगत में विशिष्ट कीर्तिमान स्थापित किया है।
              </p>
              <p>
                आपकी अनवरत निष्ठा व शब्दों के प्रति प्रेम को नमन करते हुए बोलती कलम साहित्यिक परिषद यह <strong>काव्य शिरोमणि सम्मान</strong> सादर समर्पित करती है।
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

        {/* 5 Signatures Grid */}
        <div className="pt-4 border-t border-slate-300 grid grid-cols-5 gap-1 text-center text-[10px] sm:text-xs">
          <div className="space-y-0.5">
            <span className="font-serif italic font-bold text-slate-800 block text-[11px] sm:text-xs truncate">Sanjay Rai</span>
            <span className="font-bold text-slate-900 block text-[10px] sm:text-xs truncate">संजय राय</span>
            <span className="text-[9px] text-slate-500 block truncate">संस्थापक</span>
          </div>

          <div className="space-y-0.5">
            <span className="font-serif italic font-bold text-slate-800 block text-[11px] sm:text-xs truncate">Sandeep Sharma</span>
            <span className="font-bold text-slate-900 block text-[10px] sm:text-xs truncate">संदीप शर्मा</span>
            <span className="text-[9px] text-slate-500 block truncate">उपाध्यक्ष</span>
          </div>

          <div className="space-y-0.5">
            <span className="font-serif italic font-bold text-slate-800 block text-[11px] sm:text-xs truncate">R. D. Gautam</span>
            <span className="font-bold text-slate-900 block text-[10px] sm:text-xs truncate">आर.डी. गौतम</span>
            <span className="text-[9px] text-slate-500 block truncate">उपाध्यक्ष</span>
          </div>

          <div className="space-y-0.5">
            <span className="font-serif italic font-bold text-slate-800 block text-[11px] sm:text-xs truncate">Pushpa Pathak</span>
            <span className="font-bold text-slate-900 block text-[10px] sm:text-xs truncate">पुष्पा पाठक</span>
            <span className="text-[9px] text-slate-500 block truncate">संरक्षक</span>
          </div>

          <div className="space-y-0.5">
            <span className="font-serif italic font-bold text-slate-800 block text-[11px] sm:text-xs truncate">Akash Singh</span>
            <span className="font-bold text-slate-900 block text-[10px] sm:text-xs truncate">आकाश सिंह</span>
            <span className="text-[9px] text-slate-500 block truncate">प्रबंधक</span>
          </div>
        </div>

        {/* Verification Code Footer */}
        <div className="text-center text-[11px] sm:text-xs text-slate-500 pt-1">
          प्रमाणपत्र क्रमांक: <strong>{selectedCert.certificateId}</strong> • बोलती कलम डिजिटल प्रमाणन (bolateeworld.in)
        </div>

      </div>

      {/* Action Buttons Bar */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleDownloadCertificate}
          disabled={downloading}
          className="flex-1 py-3.5 px-6 bg-gradient-to-r from-[#0e2238] via-slate-900 to-[#0e2238] hover:brightness-110 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 cursor-pointer border-2 border-amber-500/40"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>{downloading ? 'सर्टिफिकेट तैयार हो रहा है...' : '📥 HD सम्मान पत्र डाउनलोड करें (HD PNG)'}</span>
        </button>

        <button
          onClick={handleShareWhatsApp}
          className="py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>WhatsApp पर शेयर</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="py-3.5 px-5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-2xl text-xs sm:text-sm shadow flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
        >
          {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copiedLink ? 'कॉपी हुआ!' : 'सर्टिफिकेट URL कॉपी'}</span>
        </button>
      </div>

    </div>
  );
};

export default CertificateView;
