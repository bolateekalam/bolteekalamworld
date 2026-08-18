import React, { useRef, useState } from 'react';
import { Award, Download, Sparkles, X, ShieldCheck, CheckCircle2, Lock, Share2, Copy, Check, Calendar, MapPin, Feather } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

export const CertificateGenerator = ({ 
  isOpen, 
  onClose, 
  certificateData, 
  userPoints = 30, 
  userProfile,
  totalUserPosts = 1,
  onOpenCreatePost 
}) => {
  const { t } = useLanguage();
  const certCanvasRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const userName = certificateData?.recipientName || userProfile?.name || 'साहित्य साधक';
  const cleanUsername = (userProfile?.username || 'writer').replace(/^[@#]/, '');
  const userCity = userProfile?.city || certificateData?.city || 'प्रयागराज';
  const certType = certificateData?.type || 'प्रथम साहित्यिक पदार्पण सम्मान पत्र';
  const certTitle = certificateData?.title || 'बोलती कलम साहित्यिक सम्मान पत्र';
  const certId = certificateData?.certificateId || `BK-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const certDate = certificateData?.date || new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  // Milestone unlock requirements
  const requiredPosts = certificateData?.requiredPosts || 0;
  const requiredPoints = certificateData?.requiredPoints || 0;

  const isUnlocked = certificateData?.isUnlocked !== undefined 
    ? certificateData.isUnlocked 
    : (totalUserPosts >= requiredPosts && userPoints >= requiredPoints);

  // Generate 4:3 Aspect Ratio (1200x900) High-Resolution Royal Certificate Canvas PNG
  const generateCertificateCanvas = () => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 900;
      const ctx = canvas.getContext('2d');

      // 1. Soft Parchment Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1200, 900);

      // Light ivory paper gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 900);
      bgGrad.addColorStop(0, '#ffffff');
      bgGrad.addColorStop(0.5, '#fefbf6');
      bgGrad.addColorStop(1, '#fffdf9');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 900);

      // 2. Corner Multi-Color Geometric Border Accents (Image 2 style)
      // Top Left Corner
      ctx.fillStyle = '#f59e0b'; // Gold
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(80, 0);
      ctx.lineTo(0, 80);
      ctx.fill();

      ctx.fillStyle = '#be123c'; // Crimson
      ctx.beginPath();
      ctx.moveTo(0, 80);
      ctx.lineTo(80, 0);
      ctx.lineTo(110, 0);
      ctx.lineTo(0, 110);
      ctx.fill();

      ctx.fillStyle = '#6366f1'; // Indigo
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

      // Main Outer Frame
      ctx.strokeStyle = '#0e2238';
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 1140, 840);

      // Inner Fine Gold Line
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(38, 38, 1124, 824);

      // 3. Top Sun Mandala Badge with "बोलती कलम"
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(600, 110, 48, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0e2238';
      ctx.beginPath();
      ctx.arc(600, 110, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 15px serif';
      ctx.fillText('बोलती कलम', 566, 115);

      // 4. Main Heading
      ctx.fillStyle = '#0e2238';
      ctx.font = 'bold 44px serif';
      const mainHeader = 'बोलती कलम';
      const mhWidth = ctx.measureText(mainHeader).width;
      ctx.fillText(mainHeader, (1200 - mhWidth) / 2, 205);

      // Certificate Subtitle (e.g. साहित्यिक प्रश्नोत्तरी सम्मान पत्र / प्रथम साहित्यिक पदार्पण सम्मान पत्र)
      ctx.fillStyle = '#0e2238';
      ctx.font = 'bold 36px serif';
      const subHeader = certType;
      const shWidth = ctx.measureText(subHeader).width;
      ctx.fillText(subHeader, (1200 - shWidth) / 2, 260);

      // 5. Recipient Section
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 22px serif';
      const salutation = 'आदरणीय / आदरणीया';
      const salWidth = ctx.measureText(salutation).width;
      ctx.fillText(salutation, (1200 - salWidth) / 2, 315);

      // Recipient Name with Golden/Crimson Underline
      ctx.fillStyle = '#881337';
      ctx.font = 'bold 38px serif';
      const rNameWidth = ctx.measureText(userName).width;
      ctx.fillText(userName, (1200 - rNameWidth) / 2, 375);

      ctx.strokeStyle = '#0e2238';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(350, 395);
      ctx.lineTo(850, 395);
      ctx.stroke();

      // 6. Metadata Row: दिनांक & स्थान
      ctx.fillStyle = '#0e2238';
      ctx.font = 'bold 22px serif';
      ctx.fillText(`दिनांक:  ${certDate}`, 260, 445);
      ctx.fillText(`स्थान:  ${userCity}`, 740, 445);

      // 7. Citation Statement Text (Exact matching Image 2)
      ctx.fillStyle = '#1e293b';
      ctx.font = '20px serif';

      const line1 = 'ने बोलती कलम के राष्ट्रीय डिजिटल साहित्यिक मंच पर अपनी उत्कृष्ट रचनाओं और काव्य साधना से';
      const line2 = 'साहित्य जगत में विशिष्ट पहचान स्थापित की है। आपकी साहित्यिक निष्ठा, रचनात्मक सोच और शब्दों के';
      const line3 = 'प्रति प्रेम को उजागर करते हुए बोलती कलम गर्व के साथ आपको यह सम्मान पत्र प्रदान करता है। हम';
      const line4 = 'कामना करते हैं कि आप यूँ ही साहित्य की रोशनी फैलाते रहें।';

      ctx.fillText(line1, (1200 - ctx.measureText(line1).width) / 2, 510);
      ctx.fillText(line2, (1200 - ctx.measureText(line2).width) / 2, 545);
      ctx.fillText(line3, (1200 - ctx.measureText(line3).width) / 2, 580);
      ctx.fillText(line4, (1200 - ctx.measureText(line4).width) / 2, 615);

      // 8. 5 Signatures at Bottom (Exact matching Image 2)
      // Line separator for signatures
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, 680);
      ctx.lineTo(1120, 680);
      ctx.stroke();

      const signY = 740;
      const titleY = 770;
      const roleY = 795;

      // 1. Sanjay Rai (संस्थापक)
      ctx.fillStyle = '#0f172a';
      ctx.font = 'italic bold 22px serif';
      ctx.fillText('Sanjay Rai', 130, signY);
      ctx.font = 'bold 15px serif';
      ctx.fillText('संजय राय "साईं"', 130, titleY);
      ctx.fillStyle = '#64748b';
      ctx.font = '13px sans-serif';
      ctx.fillText('संस्थापक', 150, roleY);

      // 2. Sandeep Sharma (उपाध्यक्ष)
      ctx.fillStyle = '#0f172a';
      ctx.font = 'italic bold 22px serif';
      ctx.fillText('Sandeep Sharma', 330, signY);
      ctx.font = 'bold 15px serif';
      ctx.fillText('संदीप शर्मा "सरल"', 345, titleY);
      ctx.fillStyle = '#64748b';
      ctx.font = '13px sans-serif';
      ctx.fillText('उपाध्यक्ष', 370, roleY);

      // 3. R.D. Gautam (उपाध्यक्ष)
      ctx.fillStyle = '#0f172a';
      ctx.font = 'italic bold 22px serif';
      ctx.fillText('R. D. Gautam', 570, signY);
      ctx.font = 'bold 15px serif';
      ctx.fillText('आर.डी. गौतम विनम्र', 560, titleY);
      ctx.fillStyle = '#64748b';
      ctx.font = '13px sans-serif';
      ctx.fillText('उपाध्यक्ष', 590, roleY);

      // 4. Pushpa Pathak (संरक्षक, अध्यक्ष)
      ctx.fillStyle = '#0f172a';
      ctx.font = 'italic bold 22px serif';
      ctx.fillText('Pushpa Pathak', 770, signY);
      ctx.font = 'bold 15px serif';
      ctx.fillText('पुष्पा पाठक', 790, titleY);
      ctx.fillStyle = '#64748b';
      ctx.font = '13px sans-serif';
      ctx.fillText('संरक्षक, अध्यक्ष', 780, roleY);

      // 5. Akash Singh (प्रबंधक)
      ctx.fillStyle = '#0f172a';
      ctx.font = 'italic bold 22px serif';
      ctx.fillText('Akash Singh', 970, signY);
      ctx.font = 'bold 15px serif';
      ctx.fillText('आकाश सिंह', 985, titleY);
      ctx.fillStyle = '#64748b';
      ctx.font = '13px sans-serif';
      ctx.fillText('प्रबंधक', 995, roleY);

      // Verification Code Footer (Image 3 style)
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.fillText(`प्रमाणपत्र क्रमांक: ${certId} • बोलती कलम डिजिटल प्रमाणन (bolateeworld.in)`, 400, 845);

      resolve(canvas);
    });
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
      const canvas = await generateCertificateCanvas();
      const link = document.createElement('a');
      link.download = `BolteeKalam_Certificate_${certId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Certificate download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const shareText = `📜 मुझे 'बोलती कलम' (bolateeworld.in) द्वारा '${certType}' से सम्मानित किया गया है!\nरचनाकार: ${userName} (@${cleanUsername})\nप्रमाणपत्र क्रमांक: ${certId}\nदेखें: https://www.bolateeworld.in/profile/${cleanUsername}`;

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[95vh] overflow-y-auto relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 font-rozha">
                {certType}
              </h3>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                आधिकारिक डिजिटल सम्मान पत्र (bolateeworld.in)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Container with Locked State Overlay if not unlocked */}
        <div className="relative overflow-hidden rounded-2xl border-4 border-[#0e2238] bg-[#fdfbf7] p-4 sm:p-8 text-slate-900 shadow-2xl space-y-5">
          
          {!isUnlocked && (
            <div className="absolute inset-0 z-20 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 text-center space-y-3">
              <div className="p-4 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Lock className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-amber-300 font-rozha">
                यह सम्मान पत्र अभी लॉक है!
              </h4>
              <p className="text-xs text-slate-300 max-w-md font-tiro">
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
                  <span>+ नई कविता लिखकर अनलॉक करें</span>
                </button>
              )}
            </div>
          )}

          {/* Top Sun Mandala Badge */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-amber-500 text-[#0e2238] flex flex-col items-center justify-center shadow-md border-2 border-amber-300">
              <span className="text-lg">🪶</span>
              <span className="text-[8px] font-black font-rozha text-[#0e2238] leading-none">बोलती कलम</span>
            </div>
          </div>

          {/* Certificate Titles */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black font-rozha text-[#0e2238] tracking-wide">
              बोलती कलम
            </h1>
            <h2 className="text-xl sm:text-2xl font-bold font-rozha text-[#0e2238]">
              {certType}
            </h2>
          </div>

          {/* Recipient Section */}
          <div className="text-center space-y-1.5 py-1">
            <p className="text-sm font-serif font-bold text-slate-600">
              आदरणीय / आदरणीया
            </p>
            <h3 className="text-2xl sm:text-3xl font-black font-rozha text-rose-900">
              {userName}
            </h3>
            <div className="w-48 h-0.5 bg-[#0e2238] mx-auto" />
          </div>

          {/* Metadata Row: Date & City */}
          <div className="flex items-center justify-between text-xs sm:text-sm font-serif font-bold text-[#0e2238] px-4 sm:px-12">
            <span>दिनांक: <strong>{certDate}</strong></span>
            <span>स्थान: <strong>{userCity}</strong></span>
          </div>

          {/* Citation Body Text */}
          <div className="text-center text-xs sm:text-sm text-slate-800 leading-relaxed font-serif max-w-2xl mx-auto space-y-1 px-2">
            <p>
              ने बोलती कलम के राष्ट्रीय डिजिटल साहित्यिक मंच पर अपनी उत्कृष्ट रचनाओं और काव्य साधना से साहित्य जगत में विशिष्ट पहचान स्थापित की है।
            </p>
            <p>
              आपकी साहित्यिक समझ, रचनात्मक सोच और शब्दों के प्रति प्रेम को उजागर करते हुए बोलती कलम गर्व के साथ आपको यह सम्मान पत्र प्रदान करता है। हम कामना करते हैं कि आप यूँ ही साहित्य की रोशनी फैलाते रहें।
            </p>
          </div>

          {/* 5 Signatures Grid Matching Image 2 */}
          <div className="pt-4 border-t border-slate-300 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="space-y-0.5">
              <span className="font-serif italic font-bold text-slate-800 block text-xs">Sanjay Rai</span>
              <span className="font-bold text-slate-900 block text-[11px]">संजय राय "साईं"</span>
              <span className="text-[10px] text-slate-500 block">संस्थापक</span>
            </div>

            <div className="space-y-0.5">
              <span className="font-serif italic font-bold text-slate-800 block text-xs">Sandeep Sharma</span>
              <span className="font-bold text-slate-900 block text-[11px]">संदीप शर्मा "सरल"</span>
              <span className="text-[10px] text-slate-500 block">उपाध्यक्ष</span>
            </div>

            <div className="space-y-0.5">
              <span className="font-serif italic font-bold text-slate-800 block text-xs">R. D. Gautam</span>
              <span className="font-bold text-slate-900 block text-[11px]">आर.डी. गौतम विनम्र</span>
              <span className="text-[10px] text-slate-500 block">उपाध्यक्ष</span>
            </div>

            <div className="space-y-0.5">
              <span className="font-serif italic font-bold text-slate-800 block text-xs">Pushpa Pathak</span>
              <span className="font-bold text-slate-900 block text-[11px]">पुष्पा पाठक</span>
              <span className="text-[10px] text-slate-500 block">संरक्षक, अध्यक्ष</span>
            </div>

            <div className="space-y-0.5">
              <span className="font-serif italic font-bold text-slate-800 block text-xs">Akash Singh</span>
              <span className="font-bold text-slate-900 block text-[11px]">आकाश सिंह</span>
              <span className="text-[10px] text-slate-500 block">प्रबंधक</span>
            </div>
          </div>

          {/* Verification Code Footer */}
          <div className="text-center text-[10px] text-slate-500 pt-1">
            प्रमाणपत्र क्रमांक: <strong>{certId}</strong> • बोलती कलम डिजिटल प्रमाणन (bolateeworld.in)
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            onClick={handleDownloadCertificate}
            disabled={!isUnlocked || downloading}
            className="flex-1 py-3 bg-gradient-to-r from-[#0e2238] via-slate-900 to-[#0e2238] hover:brightness-110 text-white font-extrabold rounded-2xl text-xs shadow-xl flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 cursor-pointer border border-amber-500/40"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{downloading ? 'सर्टिफिकेट तैयार हो रहा है...' : '📥 हाई-रेजोल्यूशन (1200x900) सम्मान पत्र डाउनलोड करें (HD PNG)'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            disabled={!isUnlocked}
            className="py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp पर शेयर करें</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default CertificateGenerator;
