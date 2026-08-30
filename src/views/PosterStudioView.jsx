import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Download, Upload, Check, 
  Palette, Eye, X, Share2, Feather, 
  Camera, Layers, ChevronDown
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
  // Standard 1080x1350 High-Definition Canvas
  const width = 1080;
  const height = 1350;

  const [selectedPhotoLayout, setSelectedPhotoLayout] = useState('circleAvatar');
  const [selectedThemeId, setSelectedThemeId] = useState('darkVelvet');
  
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
  const [copiedCaption, setCopiedCaption] = useState(false);

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

  // 🌟 Anti-Stretch Center Cover Image Drawer
  const drawCoverImage = (ctx, img, dx, dy, dWidth, dHeight, radius = 0) => {
    if (!img || !img.width || !img.height) return;
    const imgRatio = img.width / img.height;
    const targetRatio = dWidth / dHeight;
    let sx, sy, sWidth, sHeight;

    if (imgRatio > targetRatio) {
      // Image is wider than target container -> crop horizontal sides
      sHeight = img.height;
      sWidth = img.height * targetRatio;
      sx = (img.width - sWidth) / 2;
      sy = 0;
    } else {
      // Image is taller than target container -> crop vertical top/bottom
      sWidth = img.width;
      sHeight = img.width / targetRatio;
      sx = 0;
      sy = (img.height - sHeight) / 2;
    }

    ctx.save();
    if (radius) {
      ctx.beginPath();
      if (Array.isArray(radius)) {
        ctx.roundRect(dx, dy, dWidth, dHeight, radius);
      } else if (typeof radius === 'number' && radius > 0) {
        ctx.roundRect(dx, dy, dWidth, dHeight, radius);
      }
      ctx.closePath();
      ctx.clip();
    }
    ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    ctx.restore();
  };

  // 🌟 Anti-Stretch Circular Avatar Drawer
  const drawCircularAvatar = (ctx, img, cx, cy, radius, strokeColor = '#fbbf24', strokeWidth = 4) => {
    if (!img || !img.width || !img.height) return;
    const size = Math.min(img.width, img.height);
    const sx = (img.width - size) / 2;
    const sy = (img.height - size) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, sx, sy, size, size, cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.restore();

    if (strokeColor && strokeWidth) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  // Draw HD Poster Canvas
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

    // 2. Borders & Ornaments
    ctx.strokeStyle = currentTheme.border;
    ctx.lineWidth = 8;
    ctx.strokeRect(32, 32, width - 64, height - 64);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(44, 44, width - 88, height - 88);

    // Load user photo safely
    const photoImg = await safeLoadImage(effectivePhotoUrl);

    // 3. Render According to Selected Photo Layout
    if (selectedPhotoLayout === 'circleAvatar') {
      // ⭕ LAYOUT 1: Circle Avatar
      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 32px serif';
      ctx.textAlign = 'center';
      ctx.fillText('बोलती कलम • bolateeworld.in', width / 2, 110);

      // Title
      const displayTitle = title.trim() || 'आपकी रचना का शीर्षक';
      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 50px serif';
      ctx.fillText(displayTitle, width / 2, 210);

      // Title Underline
      ctx.strokeStyle = currentTheme.border;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 160, 245);
      ctx.lineTo(width / 2 + 160, 245);
      ctx.stroke();

      // Poetry Lines
      const lines = (content.trim() || 'यहाँ आपकी कविता / शायरी की पंक्तियाँ प्रदर्शित होंगी।\nसुंदर भावों के साथ अपनी रचना लिखें।').split('\n');
      ctx.fillStyle = currentTheme.text;
      const isLarge = fontSizeRatio === 'large';
      ctx.font = isLarge ? '42px serif' : '36px serif';
      const lineGap = isLarge ? 80 : 70;

      let startY = 360;
      lines.forEach((line) => {
        if (line.trim()) {
          ctx.fillText(line, width / 2, startY);
          startY += lineGap;
        }
      });

      // Bottom Circle Avatar + Author Badge
      const footerY = height - 160;
      if (photoImg) {
        drawCircularAvatar(ctx, photoImg, width / 2, footerY - 40, 70, currentTheme.border, 4);
      }

      ctx.textAlign = 'center';
      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 36px serif';
      ctx.fillText('✍️ ' + fixedAuthorName, width / 2, footerY + 60);

      ctx.fillStyle = currentTheme.text;
      ctx.font = '22px sans-serif';
      ctx.fillText('@' + fixedAuthorUsername + ' • प्रमाणित साहित्यकार', width / 2, footerY + 95);

    } else if (selectedPhotoLayout === 'wideCard') {
      // 🔲 LAYOUT 2: Wide Card at Bottom
      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 32px serif';
      ctx.textAlign = 'center';
      ctx.fillText('बोलती कलम • राष्ट्रीय साहित्यिक मंच', width / 2, 110);

      // Title
      const displayTitle = title.trim() || 'आपकी रचना का शीर्षक';
      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 50px serif';
      ctx.fillText(displayTitle, width / 2, 210);

      ctx.strokeStyle = currentTheme.border;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 160, 245);
      ctx.lineTo(width / 2 + 160, 245);
      ctx.stroke();

      // Poetry Lines
      const lines = (content.trim() || 'यहाँ आपकी कविता / शायरी की पंक्तियाँ प्रदर्शित होंगी।\nसुंदर भावों के साथ अपनी रचना लिखें।').split('\n');
      ctx.fillStyle = currentTheme.text;
      const isLarge = fontSizeRatio === 'large';
      ctx.font = isLarge ? '42px serif' : '36px serif';
      const lineGap = isLarge ? 80 : 70;

      let startY = 350;
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
        drawCircularAvatar(ctx, photoImg, 170, cardY + 80, 55, currentTheme.border, 3);
      }

      ctx.textAlign = 'left';
      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 38px serif';
      ctx.fillText('✍️ ' + fixedAuthorName, 260, cardY + 70);

      ctx.fillStyle = currentTheme.text;
      ctx.font = '24px sans-serif';
      ctx.fillText('@' + fixedAuthorUsername + ' • bolateeworld.in', 260, cardY + 115);

    } else if (selectedPhotoLayout === 'leftSplit') {
      // ⬅️ LAYOUT 3: Left Split (Left Photo 38%, Right Poetry 62% - Perfectly Proportioned)
      const splitX = 420;
      const photoWidth = splitX - 120;
      const photoHeight = height - 160;

      // Draw Photo on Left with anti-stretch cover crop
      if (photoImg) {
        drawCoverImage(ctx, photoImg, 70, 80, photoWidth, photoHeight, 24);

        ctx.strokeStyle = currentTheme.border;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(70, 80, photoWidth, photoHeight, 24);
        ctx.stroke();
      }

      // Right Side Poetry Content
      const rightCenterX = splitX + (width - splitX) / 2 - 10;

      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 30px serif';
      ctx.textAlign = 'center';
      ctx.fillText('बोलती कलम', rightCenterX, 130);

      // Title
      const displayTitle = title.trim() || 'रचना का शीर्षक';
      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 46px serif';
      ctx.fillText(displayTitle, rightCenterX, 220);

      ctx.strokeStyle = currentTheme.border;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(rightCenterX - 140, 255);
      ctx.lineTo(rightCenterX + 140, 255);
      ctx.stroke();

      // Poetry Lines
      const lines = (content.trim() || 'यहाँ आपकी कविता\nकी पंक्तियाँ प्रदर्शित होंगी।\nसुंदर शब्दों में लिखें।').split('\n');
      ctx.fillStyle = currentTheme.text;
      ctx.font = '34px serif';
      let startY = 360;
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
      // ⬆️ LAYOUT 4: Top Hero Photo Cover (Top 42% Cover, Bottom 58% Poetry - Perfectly Proportioned)
      const topHeight = 480;

      // Draw Top Photo Cover with anti-stretch cover crop
      if (photoImg) {
        drawCoverImage(ctx, photoImg, 60, 60, width - 120, topHeight, [24, 24, 0, 0]);

        // Smooth Dark gradient overlay on bottom of image for text transition
        const fadeGrad = ctx.createLinearGradient(0, topHeight - 120, 0, topHeight + 60);
        fadeGrad.addColorStop(0, 'transparent');
        fadeGrad.addColorStop(1, currentTheme.bg1);
        ctx.fillStyle = fadeGrad;
        ctx.fillRect(60, topHeight - 120, width - 120, 180);
      }

      // Title Below Photo
      const displayTitle = title.trim() || 'रचना का शीर्षक';
      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 48px serif';
      ctx.textAlign = 'center';
      ctx.fillText(displayTitle, width / 2, topHeight + 120);

      // Poetry Lines
      const lines = (content.trim() || 'यहाँ आपकी कविता / शायरी की पंक्तियाँ प्रदर्शित होंगी।\nसुंदर भावों के साथ अपनी रचना लिखें।').split('\n');
      ctx.fillStyle = currentTheme.text;
      ctx.font = '36px serif';
      let startY = topHeight + 200;
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

  // Update Preview URL when parameters change
  useEffect(() => {
    let active = true;
    generatePosterCanvas().then(canvas => {
      if (active) {
        setPreviewUrl(canvas.toDataURL('image/png'));
      }
    });
    return () => { active = false; };
  }, [title, content, selectedPhotoLayout, selectedThemeId, effectivePhotoUrl, fontSizeRatio]);

  // Download Handler
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const canvas = await generatePosterCanvas();
      const link = document.createElement('a');
      link.download = 'BolateeKalam_Poster_' + (title.trim().slice(0, 15) || 'rachna') + '_' + Date.now() + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      if (onRewardPoints) onRewardPoints(5);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  // WhatsApp Share Handler
  const handleWhatsAppShare = async () => {
    setSharing(true);
    try {
      const captionText = 
        `✍️ रचनाकार: ${fixedAuthorName} (@${fixedAuthorUsername})\n` +
        `📖 साहित्यिक मंच: बोलती कलम (Bolatee Kalam)\n` +
        `🌐 पूरी रचना पढ़ें व अपनी कविताएं प्रकाशित करें:\n` +
        `👉 https://bolateeworld.in\n\n` +
        `🏷️ #बोलतीकलम #BolateeKalam #हिंदीकविता #HindiPoetry #Shayari #Sahitya #WritersOfIndia #PoetryCommunity #Kavita`;

      const shareText = `*${title || 'बोलती कलम काव्य'}*\n\n${content ? content.slice(0, 200) + '...' : ''}\n\n${captionText}`;
      window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(shareText), '_blank');
      
      if (onRewardPoints) onRewardPoints(5);
    } catch (err) {
      console.error('Share error:', err);
    } finally {
      setSharing(false);
    }
  };

  // Copy Caption Handler
  const handleCopyCaption = async () => {
    const captionText = 
      `✍️ रचनाकार: ${fixedAuthorName} (@${fixedAuthorUsername})\n` +
      `📖 साहित्यिक मंच: बोलती कलम (Bolatee Kalam)\n` +
      `🌐 पूरी रचना पढ़ें व अपनी कविताएं प्रकाशित करें:\n` +
      `👉 https://bolateeworld.in\n\n` +
      `🏷️ #बोलतीकलम #BolateeKalam #हिंदीकविता #HindiPoetry #Shayari #Sahitya #WritersOfIndia #PoetryCommunity #Kavita`;

    const fullCopy = `${title ? `✨ ${title} ✨\n\n` : ''}${content ? `${content}\n\n` : ''}${captionText}`;

    try {
      await navigator.clipboard.writeText(fullCopy);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 3000);
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.85 } });
    } catch (e) {
      console.error(e);
    }
  };

  // Publish to Feed Handler
  const handlePublishToFeed = async () => {
    if (requireAuth && !currentUser) {
      requireAuth();
      return;
    }
    try {
      const canvas = await generatePosterCanvas();
      const dataUrl = canvas.toDataURL('image/png');
      if (onPublishPosterPost) {
        onPublishPosterPost({
          title: title || 'कवि पोस्टर रचना',
          content: content,
          imageUrl: dataUrl,
          author: fixedAuthorName,
          authorUsername: fixedAuthorUsername,
          authorAvatar: effectivePhotoUrl,
          layout: selectedPhotoLayout,
          theme: selectedThemeId
        });
      }
      if (onRewardPoints) onRewardPoints(10);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      console.error('Publish error:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Studio Header Banner */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>कवि पोस्टर स्टूडियो</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black font-rozha text-amber-200">
            कवि इमेज़ पोस्टर बनाएँ
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-serif">
            अपनी फोटो और रचना के साथ आकर्षक HD पोस्टर तैयार करें।
          </p>
        </div>

        {/* User Points Badge */}
        <div className="p-3 px-5 rounded-2xl bg-white/10 backdrop-blur-md border border-amber-400/30 text-amber-300 text-center shrink-0 shadow-inner">
          <span className="text-[10px] text-slate-300 uppercase block font-bold">रिवॉर्ड वॉलेट</span>
          <span className="text-xl sm:text-2xl font-black">{userPoints} Pts</span>
        </div>
      </div>

      {/* Main Studio Form Card (Clean, Focused, 100% Responsive) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
        
        {/* 1. Photo Selection & Upload */}
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-3">
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

          <div className="flex items-center gap-3.5">
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

        {/* 2. Title Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <span>2. अपनी रचना का शीर्षक (Title) <span className="text-rose-600">*</span></span>
            {title.trim() && <span className="text-[10px] text-emerald-600 font-bold">✓ दर्ज हुआ</span>}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="रचना का शीर्षक दर्ज करें (जैसे: चाँदनी रात)..."
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* 3. Poetry Content Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <span>3. कविता / शायरी की पंक्तियाँ (Poetry Lines) <span className="text-rose-600">*</span></span>
            <span className="text-[10px] text-slate-400">Enter दबाकर लाइन बदलें</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            placeholder="यहाँ अपनी कविता / शायरी की पंक्तियाँ दर्ज करें..."
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-tiro text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* 4. Font Size */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">4. फॉन्ट साइज़ चुनें</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFontSizeRatio('medium')}
              className={'px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ' + (fontSizeRatio === 'medium' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600')}
            >
              मध्यम (Medium)
            </button>
            <button
              onClick={() => setFontSizeRatio('large')}
              className={'px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ' + (fontSizeRatio === 'large' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600')}
            >
              बड़ा (Large)
            </button>
          </div>
        </div>

        {/* 🌟 Single Clean Master Action Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setShowPreviewModal(true)}
            className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-rose-600 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-black rounded-2xl text-sm sm:text-base shadow-xl flex items-center justify-center gap-2.5 transition active:scale-98 cursor-pointer"
          >
            <Eye className="w-5 h-5 text-amber-200 shrink-0 animate-pulse" />
            <span>👁️ अपनी रचना का HD प्रिव्यू देखें</span>
          </button>
        </div>

      </div>

      {/* 🌟 HD Poster Preview & Layout Switcher Modal Popup */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[94vh] overflow-y-auto text-white">
            
            {/* Modal Header with Close Button */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold font-rozha text-amber-200">
                    HD पोस्टर प्रिव्यू & विकल्प
                  </h3>
                  <span className="text-[10px] text-slate-400">बोलती कलम डिजिटल स्टूडियो</span>
                </div>
              </div>

              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 🎛️ Dual Dropdowns / Selectors: Layout & Theme */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              
              {/* Dropdown 1: Layout Selection */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>लेआउट चुनें:</span>
                </label>
                <select
                  value={selectedPhotoLayout}
                  onChange={(e) => setSelectedPhotoLayout(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                >
                  {PHOTO_LAYOUTS.map(layout => (
                    <option key={layout.id} value={layout.id}>
                      {layout.icon} {layout.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown 2: Theme Selection */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>रंग व थीम:</span>
                </label>
                <select
                  value={selectedThemeId}
                  onChange={(e) => setSelectedThemeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                >
                  {THEMES.map(theme => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Modal Poster Canvas Display */}
            <div className="relative mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-950 flex items-center justify-center aspect-[4/5] max-h-[50vh] w-full">
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

            {/* 🌟 4 Action Buttons inside Modal */}
            <div className="space-y-2 pt-1">
              
              {/* Button 1: Download Poster */}
              <button
                onClick={() => {
                  handleDownload();
                  setShowPreviewModal(false);
                }}
                disabled={downloading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{downloading ? 'डाउनलोड हो रहा है...' : '📥 HD पोस्टर डाउनलोड करें'}</span>
              </button>

              {/* Button 2: WhatsApp Share */}
              <button
                onClick={() => {
                  handleWhatsAppShare();
                }}
                disabled={sharing}
                className="w-full py-3 px-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold rounded-2xl text-xs border border-emerald-500/40 shadow-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Share2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>🚀 WhatsApp पर शेयर करें</span>
              </button>

              {/* Button 3 & 4 Grid */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopyCaption}
                  className="w-full py-2.5 px-3 bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 font-bold rounded-2xl text-xs border border-amber-700 shadow-sm flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <Check className={'w-3.5 h-3.5 ' + (copiedCaption ? 'text-emerald-400' : 'text-amber-400')} />
                  <span>{copiedCaption ? '✓ लिंक कॉपी हुआ!' : '📋 कविता + लिंक कॉपी करें'}</span>
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
                  <span>🌟 मंच पर प्रकाशित करें</span>
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
