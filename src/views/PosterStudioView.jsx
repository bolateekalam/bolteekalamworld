import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Download, Upload, Check, 
  Palette, Send, Eye, X,
  LayoutGrid, BookOpen, Share2, Smartphone, 
  Monitor, Square, Flame, RefreshCw, Feather, CheckCircle2,
  Camera, Image as ImageIcon, UserCheck, Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

// 1. 4 Distinct Photo Layouts (4 Photo Design Options)
const PHOTO_LAYOUTS = [
  { 
    id: 'circleAvatar', 
    name: '⭕ गोल अवतार (Circle Ring)', 
    desc: 'गोल्डन रिंग में कवि का गोल फोटो, नीचे हस्ताक्षर व मुहर',
    icon: '⭕'
  },
  { 
    id: 'wideCard', 
    name: '🔲 चौड़ा कार्ड (Wide Banner)', 
    desc: 'बॉटम में चौड़ा कार्ड, बाईं ओर फोटो व दाईं ओर कवि का विवरण',
    icon: '🔲'
  },
  { 
    id: 'leftSplit', 
    name: '⬅️ बायाँ स्प्लिट (Left Photo)', 
    desc: 'बाईं ओर वर्टिकल फोटो पोर्ट्रेट, दाईं ओर सुंदर पंक्तियाँ',
    icon: '⬅️'
  },
  { 
    id: 'topHero', 
    name: '⬆️ टॉप फोटो (Top Cover)', 
    desc: 'ऊपर मुख्य फोटो कवर, नीचे सुरुचिपूर्ण कविता कार्ड',
    icon: '⬆️'
  }
];

// 2. Color Palettes
const THEMES = [
  { 
    id: 'darkVelvet', 
    name: '🖤 डार्क वेलवेट', 
    bg1: '#0f172a', 
    bg2: '#020617', 
    cardBg: 'rgba(15, 23, 42, 0.88)', 
    border: '#f59e0b', 
    title: '#fbbf24', 
    text: '#f8fafc' 
  },
  { 
    id: 'parchment', 
    name: '📜 पार्चमेंट रॉयल', 
    bg1: '#fffdf9', 
    bg2: '#fef3c7', 
    cardBg: 'rgba(255, 253, 249, 0.95)', 
    border: '#be123c', 
    title: '#881337', 
    text: '#1e293b' 
  },
  { 
    id: 'krishnaGold', 
    name: '🪈 कृष्ण नील & स्वर्ण', 
    bg1: '#071630', 
    bg2: '#0b2545', 
    cardBg: 'rgba(7, 22, 48, 0.9)', 
    border: '#f59e0b', 
    title: '#fbbf24', 
    text: '#f8fafc' 
  },
  { 
    id: 'purpleHindvi', 
    name: '💜 हिन्दवी पर्पल', 
    bg1: '#2e1065', 
    bg2: '#3b0764', 
    cardBg: 'rgba(46, 16, 101, 0.9)', 
    border: '#fbbf24', 
    title: '#ffffff', 
    text: '#f3e8ff' 
  },
  { 
    id: 'sunsetRose', 
    name: '🌅 सनसेट रोज़', 
    bg1: '#fff1f2', 
    bg2: '#ffe4e6', 
    cardBg: 'rgba(255, 241, 242, 0.95)', 
    border: '#e11d48', 
    title: '#9f1239', 
    text: '#4c0519' 
  },
  { 
    id: 'sageNature', 
    name: '🌿 सेज ग्रीन', 
    bg1: '#f0fdf4', 
    bg2: '#dcfce7', 
    cardBg: 'rgba(240, 253, 244, 0.95)', 
    border: '#15803d', 
    title: '#14532d', 
    text: '#1e293b' 
  }
];

export const PosterStudioView = ({ 
  userProfile, 
  currentUser, 
  userPoints = 50, 
  onRewardPoints,
  onPublishPosterPost,
  requireAuth
}) => {
  // Dedicated Standard 4:5 Aspect Ratio (1080x1350)
  const width = 1080;
  const height = 1350;

  const [selectedPhotoLayout, setSelectedPhotoLayout] = useState('circleAvatar');
  const [selectedThemeId, setSelectedThemeId] = useState('darkVelvet');
  
  // Clean initial inputs (no prefilled dummy text)
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // Custom or Profile Photo
  const profileAvatar = userProfile?.avatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState(null);
  const [fontSizeRatio, setFontSizeRatio] = useState('medium');
  
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const fileInputRef = useRef(null);

  const fixedAuthorName = userProfile?.name || currentUser?.name || 'कवि साहित्य साधक';
  const fixedAuthorUsername = userProfile?.username || currentUser?.username || 'kavi';

  const currentTheme = THEMES.find(t => t.id === selectedThemeId) || THEMES[0];
  const effectivePhotoUrl = uploadedPhotoUrl || profileAvatar;

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedPhotoUrl(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Safe Image Loader
  const safeLoadImage = (src) => {
    return new Promise((resolve) => {
      if (!src) return resolve(null);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      let done = false;

      img.onload = () => {
        if (!done) {
          done = true;
          resolve(img);
        }
      };
      img.onerror = () => {
        if (!done) {
          done = true;
          resolve(null);
        }
      };
      img.src = src;
      setTimeout(() => {
        if (!done) {
          done = true;
          resolve(null);
        }
      }, 2500);
    });
  };

  // Draw 4:5 Poster Canvas
  const generatePosterCanvas = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 1. Draw Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, currentTheme.bg1);
    bgGrad.addColorStop(1, currentTheme.bg2);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Borders
    ctx.strokeStyle = currentTheme.border;
    ctx.lineWidth = 8;
    ctx.strokeRect(32, 32, width - 64, height - 64);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(44, 44, width - 88, height - 88);

    // Load photo
    const photoImg = await safeLoadImage(effectivePhotoUrl);

    // 3. Render according to chosen Photo Layout Style
    if (selectedPhotoLayout === 'circleAvatar') {
      // ⭕ LAYOUT 1: Circle Avatar
      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 34px serif';
      ctx.textAlign = 'center';
      ctx.fillText('बोलती कलम • bolateeworld.in', width / 2, 110);

      // Title
      const displayTitle = title.trim() || 'आपकी रचना का शीर्षक';
      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 52px serif';
      ctx.fillText(displayTitle, width / 2, 210);

      ctx.strokeStyle = currentTheme.border;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 180, 245);
      ctx.lineTo(width / 2 + 180, 245);
      ctx.stroke();

      // Poetry Lines
      const lines = (content.trim() || 'यहाँ आपकी कविता / शायरी की पंक्तियाँ प्रदर्शित होंगी।\nसुंदर भावों के साथ अपनी रचना लिखें।').split('\n');
      ctx.fillStyle = currentTheme.text;
      const isLarge = fontSizeRatio === 'large';
      ctx.font = isLarge ? '42px serif' : '36px serif';
      const lineGap = isLarge ? 78 : 68;

      let startY = 350;
      lines.forEach((line) => {
        if (line.trim()) {
          ctx.fillText(line, width / 2, startY);
          startY += lineGap;
        }
      });

      // Bottom Circle Avatar + Author Badge
      const footerY = height - 160;
      if (photoImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, footerY - 40, 65, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(photoImg, width / 2 - 65, footerY - 105, 130, 130);
        ctx.restore();

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(width / 2, footerY - 40, 65, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.textAlign = 'center';
      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 36px serif';
      ctx.fillText('✍️ ' + fixedAuthorName, width / 2, footerY + 55);

      ctx.fillStyle = currentTheme.text;
      ctx.font = '22px sans-serif';
      ctx.fillText('@' + fixedAuthorUsername + ' • प्रमाणित साहित्यकार', width / 2, footerY + 90);

    } else if (selectedPhotoLayout === 'wideCard') {
      // 🔲 LAYOUT 2: Wide Card at Bottom
      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 34px serif';
      ctx.textAlign = 'center';
      ctx.fillText('बोलती कलम • राष्ट्रीय साहित्यिक मंच', width / 2, 110);

      // Title
      const displayTitle = title.trim() || 'आपकी रचना का शीर्षक';
      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 52px serif';
      ctx.fillText(displayTitle, width / 2, 220);

      // Poetry Lines
      const lines = (content.trim() || 'यहाँ आपकी कविता / शायरी की पंक्तियाँ प्रदर्शित होंगी।\nसुंदर भावों के साथ अपनी रचना लिखें।').split('\n');
      ctx.fillStyle = currentTheme.text;
      const isLarge = fontSizeRatio === 'large';
      ctx.font = isLarge ? '42px serif' : '36px serif';
      const lineGap = isLarge ? 78 : 68;

      let startY = 360;
      lines.forEach((line) => {
        if (line.trim()) {
          ctx.fillText(line, width / 2, startY);
          startY += lineGap;
        }
      });

      // Wide Bottom Card
      const cardY = height - 230;
      ctx.fillStyle = currentTheme.cardBg;
      ctx.beginPath();
      ctx.roundRect(80, cardY, width - 160, 160, 24);
      ctx.fill();
      ctx.strokeStyle = currentTheme.border;
      ctx.lineWidth = 2;
      ctx.stroke();

      if (photoImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(170, cardY + 80, 55, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(photoImg, 115, cardY + 25, 110, 110);
        ctx.restore();

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(170, cardY + 80, 55, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.textAlign = 'left';
      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 38px serif';
      ctx.fillText('✍️ ' + fixedAuthorName, 260, cardY + 70);

      ctx.fillStyle = currentTheme.text;
      ctx.font = '24px sans-serif';
      ctx.fillText('@' + fixedAuthorUsername + ' • bolateeworld.in', 260, cardY + 115);

    } else if (selectedPhotoLayout === 'leftSplit') {
      // ⬅️ LAYOUT 3: Left Split (Photo on Left 38%, Poetry on Right 62%)
      const splitX = 420;

      // Draw Photo on Left
      if (photoImg) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(60, 60, splitX - 80, height - 120, 24);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(photoImg, 60, 60, splitX - 80, height - 120);
        ctx.restore();

        ctx.strokeStyle = currentTheme.border;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(60, 60, splitX - 80, height - 120, 24);
        ctx.stroke();
      }

      // Right Side Poetry Box
      const rightCenterX = splitX + (width - splitX) / 2 - 20;

      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 30px serif';
      ctx.textAlign = 'center';
      ctx.fillText('बोलती कलम', rightCenterX, 130);

      // Title
      const displayTitle = title.trim() || 'रचना का शीर्षक';
      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 46px serif';
      ctx.fillText(displayTitle, rightCenterX, 230);

      ctx.strokeStyle = currentTheme.border;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(rightCenterX - 140, 265);
      ctx.lineTo(rightCenterX + 140, 265);
      ctx.stroke();

      // Poetry Lines
      const lines = (content.trim() || 'यहाँ आपकी कविता\nकी पंक्तियाँ प्रदर्शित होंगी।\nसुंदर शब्दों में लिखें।').split('\n');
      ctx.fillStyle = currentTheme.text;
      ctx.font = '34px serif';
      let startY = 370;
      lines.forEach((line) => {
        if (line.trim()) {
          ctx.fillText(line, rightCenterX, startY);
          startY += 65;
        }
      });

      // Author Details at Bottom Right
      const authorY = height - 150;
      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 34px serif';
      ctx.fillText('✍️ ' + fixedAuthorName, rightCenterX, authorY);

      ctx.fillStyle = currentTheme.text;
      ctx.font = '22px sans-serif';
      ctx.fillText('@' + fixedAuthorUsername + ' • bolateeworld.in', rightCenterX, authorY + 45);

    } else {
      // ⬆️ LAYOUT 4: Top Hero Photo (Top 42% Cover, Bottom 58% Poetry)
      const topHeight = 520;

      // Draw Top Photo Cover
      if (photoImg) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(60, 60, width - 120, topHeight, [24, 24, 0, 0]);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(photoImg, 60, 60, width - 120, topHeight);
        ctx.restore();

        // Dark overlay on bottom of image for transition
        const fadeGrad = ctx.createLinearGradient(0, topHeight - 120, 0, topHeight + 60);
        fadeGrad.addColorStop(0, 'transparent');
        fadeGrad.addColorStop(1, currentTheme.bg1);
        ctx.fillStyle = fadeGrad;
        ctx.fillRect(60, topHeight - 120, width - 120, 180);
      }

      // Title Below Photo
      const displayTitle = title.trim() || 'रचना का शीर्षक';
      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 50px serif';
      ctx.textAlign = 'center';
      ctx.fillText(displayTitle, width / 2, topHeight + 120);

      // Poetry Lines
      const lines = (content.trim() || 'यहाँ आपकी कविता / शायरी की पंक्तियाँ प्रदर्शित होंगी।\nसुंदर भावों के साथ अपनी रचना लिखें।').split('\n');
      ctx.fillStyle = currentTheme.text;
      ctx.font = '36px serif';
      let startY = topHeight + 210;
      lines.forEach((line) => {
        if (line.trim()) {
          ctx.fillText(line, width / 2, startY);
          startY += 65;
        }
      });

      // Author Signature
      const footerY = height - 120;
      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 34px serif';
      ctx.fillText('✍️ ' + fixedAuthorName + ' (@' + fixedAuthorUsername + ')', width / 2, footerY);

      ctx.fillStyle = currentTheme.text;
      ctx.font = '22px sans-serif';
      ctx.fillText('बोलती कलम • bolateeworld.in', width / 2, footerY + 40);
    }

    return canvas;
  };

  // Update Live Preview when inputs change
  useEffect(() => {
    let active = true;
    generatePosterCanvas().then(canvas => {
      if (active) {
        setPreviewUrl(canvas.toDataURL('image/png'));
      }
    });
    return () => { active = false; };
  }, [selectedPhotoLayout, selectedThemeId, title, content, fontSizeRatio, uploadedPhotoUrl]);

  // Handle HD Download
  const handleDownload = async () => {
    if (!title.trim() || !content.trim()) {
      alert('कृपया पोस्टर डाउनलोड करने से पहले शीर्षक (Title) और पंक्तियाँ अवश्य लिखें!');
      return;
    }
    setDownloading(true);
    try {
      const canvas = await generatePosterCanvas();
      const link = document.createElement('a');
      link.download = 'BolateeKalam_Poster_' + Date.now() + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      if (onRewardPoints) {
        onRewardPoints(-25, 'कवि पोस्टर डाउनलोड करने पर');
      }

      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } catch (e) {
      console.error(e);
    }
    setDownloading(false);
  };

  // Handle WhatsApp Share
  const handleWhatsAppShare = async () => {
    if (!title.trim() || !content.trim()) {
      alert('कृपया शीर्षक (Title) और पंक्तियाँ अवश्य लिखें!');
      return;
    }
    setSharing(true);
    try {
      const canvas = await generatePosterCanvas();
      const displayTitle = title.trim() || 'मेरी रचना';
      const displayContent = content.trim() || '';
      const shareText = '📜 *' + displayTitle + '*\n\n"' + displayContent + '"\n\n✍️ रचनाकार: ' + fixedAuthorName + ' (@' + fixedAuthorUsername + ')\n📖 साहित्यिक मंच: बोलती कलम\n🌐 पूरी रचना पढ़ें व अपनी कविताएं प्रकाशित करें:\n👉 https://bolateeworld.in\n\n#बोलतीकलम #कविता #हिंदीसाहित्य #BolateeKalam';
      
      canvas.toBlob(async (blob) => {
        if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], 'poster.png', { type: 'image/png' })] })) {
          try {
            await navigator.share({
              files: [new File([blob], 'poster.png', { type: 'image/png' })],
              title: displayTitle,
              text: shareText
            });
            setSharing(false);
            return;
          } catch (e) {}
        }
        window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(shareText), '_blank');
        setSharing(false);
      }, 'image/png');
    } catch (e) {
      setSharing(false);
    }
  };

  // Handle Copy Formatted Poem & Website Link Caption
  const handleCopyCaption = () => {
    const displayTitle = title.trim() || 'आपकी रचना का शीर्षक';
    const displayContent = content.trim() || 'यहाँ आपकी कविता / शायरी की पंक्तियाँ प्रदर्शित होंगी।';
    const captionText = '✨ *' + displayTitle + '* ✨\n\n' + displayContent + '\n\n✍️ रचनाकार: ' + fixedAuthorName + ' (@' + fixedAuthorUsername + ')\n📖 साहित्यिक मंच: बोलती कलम (Bolatee Kalam)\n🌐 पूरी रचना पढ़ें व अपनी कविताएं प्रकाशित करें:\n👉 https://bolateeworld.in\n\n#बोलतीकलम #कविता #हिंदीसाहित्य #BolateeKalam #HindiPoetry #Poetry #WritersCommunity';

    navigator.clipboard.writeText(captionText);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 3000);
  };

  // Handle Publish Directly to Feed
  const handlePublishToFeed = async () => {
    if (requireAuth && !requireAuth()) return;
    if (!title.trim() || !content.trim()) {
      alert('कृपया शीर्षक (Title) और पंक्तियाँ अवश्य लिखें!');
      return;
    }
    setDownloading(true);
    try {
      const canvas = await generatePosterCanvas();
      const imageUrl = canvas.toDataURL('image/jpeg', 0.9);

      if (onPublishPosterPost) {
        onPublishPosterPost({
          title: title.trim(),
          content: content.trim(),
          imageUrl: imageUrl
        });
      }
      alert('✨ आपका HD कवि पोस्टर मंच पर प्रकाशित हो गया है!');
    } catch (e) {
      console.error(e);
    }
    setDownloading(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6 animate-in fade-in duration-300">
      
      {/* Studio Header */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>कवि पोस्टर Studio (4:5 HD)</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black font-rozha text-amber-200">
            कवि इमेज़ पोस्टर बनाएँ
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-serif">
            अपनी फोटो और रचना के साथ 4 आकर्षक लेआउट में 4:5 HD पोस्टर तैयार करें।
          </p>
        </div>

        {/* User Points Badge */}
        <div className="p-3 px-5 rounded-2xl bg-white/10 backdrop-blur-md border border-amber-400/30 text-amber-300 text-center shrink-0 shadow-inner">
          <span className="text-[10px] text-slate-300 uppercase block font-bold">रिवॉर्ड वॉलेट</span>
          <span className="text-xl sm:text-2xl font-black">{userPoints} Pts</span>
        </div>
      </div>

      {/* 2-Column Studio Grid: Controls on Left, Live 4:5 Preview on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Controls (7 cols on XL screens, full width on laptop/tablet) */}
        <div className="xl:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-5">
          
          {/* 1. Photo Selection & Upload */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-indigo-600" />
                <span>1. कवि की फोटो (Photo Selection)</span>
              </span>
              {uploadedPhotoUrl ? (
                <button
                  onClick={() => setUploadedPhotoUrl(null)}
                  className="text-[10px] text-rose-600 font-bold hover:underline cursor-pointer"
                >
                  प्रोफ़ाइल फोटो पर रीसेट करें
                </button>
              ) : (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ प्रोफ़ाइल फोटो एक्टिव
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <img 
                src={effectivePhotoUrl} 
                alt="Author" 
                className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-400 shadow-sm shrink-0"
              />
              <div className="space-y-1">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>अपनी फोटो बदलें / अपलोड करें</span>
                </button>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  यदि आप नई फोटो नहीं चुनते, तो प्रोफ़ाइल फोटो स्वतः उपयोग होगी।
                </p>
              </div>
            </div>
          </div>

          {/* 2. 4 Photo Layout Styles with Visual Graphic Previews */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-500" />
                <span>2. फोटो लेआउट डिज़ाइन चुनें (4 क्रिएटिव विकल्प)</span>
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">4:5 साइज़</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PHOTO_LAYOUTS.map(layout => (
                <button
                  key={layout.id}
                  onClick={() => setSelectedPhotoLayout(layout.id)}
                  className={'p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center gap-3.5 shadow-sm ' + (
                    selectedPhotoLayout === layout.id
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-950 dark:text-amber-200 ring-2 ring-amber-400/50 font-bold shadow-md scale-[1.01]'
                      : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-slate-400 hover:scale-[1.01]'
                  )}
                >
                  {/* Miniature Visual Graphic Wireframe */}
                  {layout.id === 'circleAvatar' && (
                    <div className="w-10 h-13 bg-slate-900 border border-amber-400/50 rounded-lg p-1 flex flex-col justify-between items-center shrink-0 shadow-inner">
                      <div className="w-full space-y-0.5">
                        <div className="h-1 w-3/4 bg-amber-400/80 rounded-full mx-auto" />
                        <div className="h-0.5 w-full bg-slate-400/50 rounded-full" />
                        <div className="h-0.5 w-2/3 bg-slate-400/50 rounded-full mx-auto" />
                      </div>
                      <div className="w-4 h-4 rounded-full border border-amber-400 bg-amber-500/30 flex items-center justify-center text-[7px]">⭕</div>
                    </div>
                  )}

                  {layout.id === 'wideCard' && (
                    <div className="w-10 h-13 bg-slate-900 border border-indigo-400/50 rounded-lg p-1 flex flex-col justify-between shrink-0 shadow-inner">
                      <div className="space-y-0.5">
                        <div className="h-1 w-3/4 bg-indigo-300 rounded-full" />
                        <div className="h-0.5 w-full bg-slate-400/50 rounded-full" />
                        <div className="h-0.5 w-2/3 bg-slate-400/50 rounded-full" />
                      </div>
                      <div className="w-full h-3.5 bg-indigo-600/40 rounded border border-indigo-400/50 flex items-center px-0.5 gap-0.5">
                        <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                        <div className="h-0.5 w-full bg-white/80 rounded-full" />
                      </div>
                    </div>
                  )}

                  {layout.id === 'leftSplit' && (
                    <div className="w-10 h-13 bg-slate-900 border border-rose-400/50 rounded-lg p-0.5 flex gap-1 shrink-0 shadow-inner">
                      <div className="w-3.5 h-full bg-gradient-to-b from-rose-500/40 to-amber-500/40 rounded border border-rose-400/50" />
                      <div className="flex-1 py-1 space-y-1">
                        <div className="h-1 w-full bg-amber-300 rounded-full" />
                        <div className="h-0.5 w-full bg-slate-400/50 rounded-full" />
                        <div className="h-0.5 w-3/4 bg-slate-400/50 rounded-full" />
                      </div>
                    </div>
                  )}

                  {layout.id === 'topHero' && (
                    <div className="w-10 h-13 bg-slate-900 border border-emerald-400/50 rounded-lg p-0.5 flex flex-col gap-1 shrink-0 shadow-inner">
                      <div className="w-full h-4 bg-gradient-to-r from-emerald-500/40 to-teal-500/40 rounded border border-emerald-400/50" />
                      <div className="space-y-0.5 px-0.5">
                        <div className="h-1 w-3/4 bg-emerald-300 rounded-full mx-auto" />
                        <div className="h-0.5 w-full bg-slate-400/50 rounded-full" />
                      </div>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold flex items-center justify-between gap-1">
                      <span className="truncate">{layout.name}</span>
                      {selectedPhotoLayout === layout.id && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">{layout.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Color Palettes with Luxury Swatch Discs */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-rose-600" />
              <span>3. रंग एवं थीम पैलेट (6 लग्ज़री शैलियाँ)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedThemeId(t.id)}
                  className={'px-3 py-2.5 rounded-2xl border text-xs font-bold transition cursor-pointer flex items-center gap-2.5 shadow-sm text-left ' + (
                    selectedThemeId === t.id
                      ? 'border-amber-500 ring-2 ring-amber-500/50 shadow-md scale-[1.02]'
                      : 'border-slate-200 dark:border-slate-700 hover:scale-[1.02]'
                  )}
                  style={{ backgroundColor: t.bg2, color: t.title }}
                >
                  <div 
                    className="w-5 h-5 rounded-full border border-white/40 shadow-sm shrink-0 flex items-center justify-center text-[10px]"
                    style={{ background: `linear-gradient(135deg, ${t.bg1}, ${t.border})` }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-black block leading-snug truncate">{t.name}</span>
                  </div>
                  {selectedThemeId === t.id && <Check className="w-3.5 h-3.5 shrink-0 text-amber-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>अपनी रचना का शीर्षक (Title) <span className="text-rose-600">*</span></span>
              {title.trim() && <span className="text-[10px] text-emerald-600 font-bold">✓ दर्ज हुआ</span>}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="रचना का शीर्षक दर्ज करें (जैसे: चाँदनी रात)..."
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* 5. Poetry Content Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>कविता / शायरी की पंक्तियाँ (Poetry Lines) <span className="text-rose-600">*</span></span>
              <span className="text-[10px] text-slate-400">लाइन ब्रेक (Enter) के साथ लिखें</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="यहाँ अपनी कविता / शायरी की पंक्तियाँ दर्ज करें..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-tiro text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* 6. Font Size */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">फॉन्ट साइज़</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSizeRatio('medium')}
                className={'px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ' + (fontSizeRatio === 'medium' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600')}
              >
                मध्यम (Medium)
              </button>
              <button
                onClick={() => setFontSizeRatio('large')}
                className={'px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ' + (fontSizeRatio === 'large' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600')}
              >
                बड़ा (Large)
              </button>
            </div>
          </div>

        </div>

        {/* Right Live 4:5 Canvas Preview (5 cols on XL, sticky) */}
        <div className="xl:col-span-5 xl:sticky xl:top-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4 text-center">
          
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 whitespace-nowrap">
              <Eye className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>लाइव 4:5 पोस्टर प्रिव्यू</span>
            </span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-bold bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 whitespace-nowrap">
              1080x1350px HD
            </span>
          </div>

          {/* Preview Canvas Container (Click to Open Popup) */}
          <div 
            onClick={() => previewUrl && setShowPreviewModal(true)}
            className="group relative mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-950 flex items-center justify-center aspect-[4/5] max-w-[340px] sm:max-w-[380px] w-full cursor-pointer transition hover:scale-[1.01]"
            title="बड़ा HD प्रिव्यू देखने के लिए क्लिक करें"
          >
            {previewUrl ? (
              <>
                <img 
                  src={previewUrl} 
                  alt="Poster Preview" 
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1.5 text-white backdrop-blur-[2px]">
                  <Eye className="w-8 h-8 text-amber-300 animate-bounce" />
                  <span className="text-xs font-black bg-slate-950/80 px-3 py-1 rounded-full border border-amber-400">
                    🔍 बड़ा प्रिव्यू देखें (Popup)
                  </span>
                </div>
              </>
            ) : (
              <div className="p-8 text-slate-400 text-xs font-bold">
                पोस्टर तैयार हो रहा है...
              </div>
            )}
          </div>

          <button
            onClick={() => previewUrl && setShowPreviewModal(true)}
            className="w-full py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <Eye className="w-4 h-4 text-amber-500 shrink-0" />
            <span>बड़ा HD प्रिव्यू पॉपअप खोलें</span>
          </button>

          {/* Action Buttons (100% Padded & Responsive) */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{downloading ? 'डाउनलोड हो रहा है...' : 'HD पोस्टर डाउनलोड करें (Free PNG)'}</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              disabled={sharing}
              className="w-full py-3 px-4 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 font-bold rounded-2xl text-xs sm:text-sm border border-emerald-300 dark:border-emerald-800/60 shadow-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Share2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>WhatsApp पर शेयर करें</span>
            </button>

            <button
              onClick={handleCopyCaption}
              className="w-full py-3 px-4 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-900 dark:text-amber-200 font-bold rounded-2xl text-xs sm:text-sm border border-amber-300 dark:border-amber-800/60 shadow-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Check className={'w-4 h-4 ' + (copiedCaption ? 'text-emerald-600' : 'text-amber-600')} />
              <span>{copiedCaption ? '✓ कविता व वेबसाइट लिंक कॉपी हुआ!' : '📋 कविता + वेबसाइट लिंक कॉपी करें'}</span>
            </button>

            <button
              onClick={handlePublishToFeed}
              disabled={downloading}
              className="w-full py-3 px-4 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-800 dark:text-indigo-300 font-bold rounded-2xl text-xs sm:text-sm border border-indigo-300 dark:border-indigo-800/60 shadow-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Feather className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>मंच पर HD पोस्टर प्रकाशित करें</span>
            </button>
          </div>

        </div>

      </div>

      {/* Mobile Sticky Quick Preview Trigger */}
      <div className="xl:hidden sticky bottom-4 z-30 pt-2">
        <button
          onClick={() => previewUrl && setShowPreviewModal(true)}
          className="w-full py-3.5 px-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-600 text-white font-extrabold rounded-2xl text-xs shadow-2xl flex items-center justify-center gap-2 border border-white/20 active:scale-95 transition cursor-pointer"
        >
          <Eye className="w-4 h-4 text-amber-300" />
          <span>👁️ 4:5 पोस्टर प्रिव्यू & डाउनलोड पॉपअप देखें</span>
        </button>
      </div>

      {/* 🌟 Fullscreen / Large 4:5 Poster Preview Popup Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold font-rozha text-amber-200">
                    4:5 HD कवि पोस्टर प्रिव्यू
                  </h3>
                  <span className="text-[10px] text-slate-400">1080x1350px • बोलती कलम डिजिटल प्रमाणन</span>
                </div>
              </div>

              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Poster Image */}
            <div className="relative mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-950 flex items-center justify-center aspect-[4/5] max-h-[55vh] w-full">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Full HD Poster Preview" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="p-8 text-slate-400 text-xs font-bold">
                  पोस्टर लोड हो रहा है...
                </div>
              )}
            </div>

            {/* Modal Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  handleDownload();
                  setShowPreviewModal(false);
                }}
                disabled={downloading}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{downloading ? 'डाउनलोड हो रहा है...' : 'HD पोस्टर डाउनलोड करें (Free PNG)'}</span>
              </button>

              <button
                onClick={handleCopyCaption}
                className="w-full py-2.5 px-3 bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 font-bold rounded-2xl text-xs border border-amber-700 shadow-sm flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <Check className={'w-3.5 h-3.5 ' + (copiedCaption ? 'text-emerald-400' : 'text-amber-400')} />
                <span>{copiedCaption ? '✓ कविता व वेबसाइट लिंक कॉपी हुआ!' : '📋 कविता + वेबसाइट लिंक कॉपी करें'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    handleWhatsAppShare();
                  }}
                  disabled={sharing}
                  className="w-full py-2.5 px-3 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 font-bold rounded-2xl text-xs border border-emerald-700 shadow-sm flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>WhatsApp शेयर</span>
                </button>

                <button
                  onClick={() => {
                    handlePublishToFeed();
                    setShowPreviewModal(false);
                  }}
                  disabled={downloading}
                  className="w-full py-2.5 px-3 bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 font-bold rounded-2xl text-xs border border-indigo-700 shadow-sm flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Feather className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>मंच पर प्रकाशित</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default PosterStudioView;
