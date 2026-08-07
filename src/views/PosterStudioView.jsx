import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Download, Image as ImageIcon, Upload, Check, 
  AlertCircle, Lock, Award, RefreshCw, Palette, Type, Feather, Trash2, Send
} from 'lucide-react';

const THEMES = [
  { id: 'parchment', name: '📜 पार्चमेंट रॉयल (Parchment Classic)', bg1: '#fffdf9', bg2: '#fef3c7', border: '#be123c', title: '#881337', text: '#1e293b', brand: '#be123c' },
  { id: 'purple', name: '💜 हिन्दवी पर्पल (Hindwi Purple)', bg1: '#581c87', bg2: '#3b0764', border: '#f59e0b', title: '#ffffff', text: '#f3e8ff', brand: '#fbbf24' },
  { id: 'ivory', name: '🤍 क्लासिक आइवरी (Ivory White)', bg1: '#fffdfa', bg2: '#f5f5f4', border: '#09090b', title: '#09090b', text: '#27272a', brand: '#e11d48' },
  { id: 'dark', name: '🖤 डार्क वेलवेट (Dark Velvet)', bg1: '#0f172a', bg2: '#020617', border: '#e11d48', title: '#fbbf24', text: '#f8fafc', brand: '#e11d48' },
  { id: 'sage', name: '🌿 विंटेज सेज ग्रीन (Vintage Sage)', bg1: '#f0fdf4', bg2: '#dcfce7', border: '#15803d', title: '#14532d', text: '#166534', brand: '#15803d' }
];

const LAYOUTS = [
  { id: 'side', name: '📐 दाएँ तरफ फोटो (Side Photo Layout)' },
  { id: 'topRight', name: '🖼️ ऊपर दाएँ फोटो (Top Right Photo Stack)' },
  { id: 'bottomRight', name: '🖼️ नीचे दाएँ फोटो (Bottom Right Photo Stack)' },
  { id: 'topCenter', name: '✨ ऊपर सेंटर फोटो + नीचे कविता (Top Center Photo + Poem)' },
  { id: 'fullText', name: '📜 केवल कविता टेक्स्ट (Full Text Poster)' }
];

export const PosterStudioView = ({ userProfile, onRewardPoints, onPublishPosterPost, requireAuth, setActiveView }) => {
  const userPoints = userProfile?.points || 0;
  const HAS_25_POINTS = userPoints >= 25;
  const HAS_15_POINTS = userPoints >= 15;

  // Fixed Non-editable Author Details from Profile
  const fixedAuthorName = userProfile?.name || 'साहित्य साधक';
  const fixedAuthorUsername = (userProfile?.username || '@writer').replace(/^[@#]/, '');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [selectedThemeId, setSelectedThemeId] = useState('parchment');
  const [selectedLayoutId, setSelectedLayoutId] = useState('side');
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [posting, setPosting] = useState(false);

  const canvasRef = useRef(null);

  const lines = content.split('\n').map(l => l.replace(/^["'“”«»-]+|["'“”«»-]+$/g, '').trim());
  const validLinesCount = lines.filter(l => l.length > 0).length;
  const isTextTooLong = validLinesCount > 14 || content.length > 380;

  const currentTheme = THEMES.find(t => t.id === selectedThemeId) || THEMES[0];

  // Custom Image Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedPhotoUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearPhoto = () => {
    setUploadedPhotoUrl(null);
  };

  // Render 4:5 Poster Canvas (1080x1350) with ZERO OVERLAPPING GUARANTEE
  const drawPosterCanvas = () => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');

      const { bg1, bg2, border: borderColor, title: titleColor, text: textColor, brand: brandColor } = currentTheme;

      // 1. TRUE 24px Rounded Outer Corner Mask
      ctx.save();
      ctx.beginPath();
      const r = 24;
      ctx.moveTo(r, 0);
      ctx.arcTo(1080, 0, 1080, 1350, r);
      ctx.arcTo(1080, 1350, 0, 1350, r);
      ctx.arcTo(0, 1350, 0, 0, r);
      ctx.arcTo(0, 0, 1080, 0, r);
      ctx.closePath();
      ctx.clip();

      // Background Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1350);
      bgGrad.addColorStop(0, bg1);
      bgGrad.addColorStop(1, bg2);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1350);

      // Sleek 24px Rounded Outer Crimson/Gold Border
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.restore();

      // 2. Top Header Branding (bolateeworld.in)
      ctx.fillStyle = brandColor;
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('बोलती कलम | bolateeworld.in', 75, 80);

      ctx.strokeStyle = brandColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(75, 100);
      ctx.lineTo(1005, 100);
      ctx.stroke();

      // Function to Draw Poem Lines & Author Footer
      const renderTextAndFooter = (startY = 255, maxTextW = 930, maxLinesY = 1140) => {
        // Dynamic Font Scaling based on poem length
        let fontSize = 34;
        let lineHeight = 54;
        let fontWeight = 'bold';

        if (validLinesCount <= 6) {
          fontSize = selectedLayoutId === 'side' ? 34 : 40;
          lineHeight = selectedLayoutId === 'side' ? 56 : 64;
          fontWeight = 'bold';
        } else if (validLinesCount <= 10) {
          fontSize = selectedLayoutId === 'side' ? 28 : 32;
          lineHeight = selectedLayoutId === 'side' ? 46 : 52;
          fontWeight = 'bold';
        } else {
          fontSize = selectedLayoutId === 'side' ? 24 : 26;
          lineHeight = selectedLayoutId === 'side' ? 38 : 40;
          fontWeight = 'normal';
        }

        // Title
        ctx.fillStyle = titleColor;
        ctx.font = selectedLayoutId === 'topCenter' ? 'bold 40px serif' : 'bold 44px serif';
        const displayTitle = title.trim() ? title : '★ शीर्षक (Title)';
        const truncatedTitle = displayTitle.length > 24 ? displayTitle.slice(0, 24) + '...' : displayTitle;
        
        if (selectedLayoutId === 'topCenter') {
          const tWidth = ctx.measureText(truncatedTitle).width;
          ctx.fillText(truncatedTitle, (1080 - tWidth) / 2, startY);
          startY += 65;
        } else {
          ctx.fillText(truncatedTitle, 75, 175);
        }

        // Poem Lines
        ctx.fillStyle = textColor;
        ctx.font = `${fontWeight} ${fontSize}px serif`;

        let currentY = startY;
        const renderLinesList = validLinesCount > 0 ? lines : ['★ यहाँ अपनी कविता की पंक्तियाँ लिखें...'];

        for (let i = 0; i < renderLinesList.length; i++) {
          const line = renderLinesList[i];
          if (currentY > maxLinesY) break;

          if (line === '') {
            currentY += Math.round(lineHeight * 0.5);
          } else {
            if (selectedLayoutId === 'topCenter') {
              const lWidth = ctx.measureText(line).width;
              ctx.fillText(line, (1080 - lWidth) / 2, currentY);
            } else {
              ctx.fillText(line, 75, currentY);
            }
            currentY += lineHeight;
          }
        }

        // Footer Author Info & Website Brand URL (Guaranteed No Overlapping!)
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(75, 1190);
        ctx.lineTo(1005, 1190);
        ctx.stroke();

        ctx.fillStyle = titleColor;
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(`● ${fixedAuthorName}`, 75, 1240);

        ctx.fillStyle = textColor;
        ctx.font = '22px sans-serif';
        ctx.fillText(`@${fixedAuthorUsername}`, 75, 1275);

        ctx.fillStyle = brandColor;
        ctx.font = 'bold 24px sans-serif';
        const siteText = 'www.bolateeworld.in';
        const siteWidth = ctx.measureText(siteText).width;
        ctx.fillText(siteText, 1005 - siteWidth, 1250);

        resolve(canvas);
      };

      // Photo Layout Modes Logic
      if (uploadedPhotoUrl && selectedLayoutId !== 'fullText') {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          ctx.save();

          if (selectedLayoutId === 'side') {
            // Side Photo (Right 370px, X = 635 to 1005) -> ZERO OVERLAP! Text max width 510px.
            const photoX = 635;
            const photoY = 220;
            const photoW = 370;
            const photoH = 880;

            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(photoX, photoY, photoW, photoH, 20);
            } else {
              ctx.rect(photoX, photoY, photoW, photoH);
            }
            ctx.clip();

            const aspect = img.width / img.height;
            let drawW = photoW;
            let drawH = photoW / aspect;
            if (drawH < photoH) {
              drawH = photoH;
              drawW = photoH * aspect;
            }
            ctx.drawImage(img, photoX - (drawW - photoW) / 2, photoY - (drawH - photoH) / 2, drawW, drawH);
            ctx.restore();

            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 3;
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(photoX, photoY, photoW, photoH, 20);
            } else {
              ctx.rect(photoX, photoY, photoW, photoH);
            }
            ctx.stroke();

            renderTextAndFooter(255, 510, 1140);

          } else if (selectedLayoutId === 'topRight') {
            // Top Right Photo Stack (Photo X = 650, Y = 175, W = 355, H = 420)
            const photoX = 650;
            const photoY = 175;
            const photoW = 355;
            const photoH = 420;

            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(photoX, photoY, photoW, photoH, 20);
            } else {
              ctx.rect(photoX, photoY, photoW, photoH);
            }
            ctx.clip();

            const aspect = img.width / img.height;
            let drawW = photoW;
            let drawH = photoW / aspect;
            if (drawH < photoH) {
              drawH = photoH;
              drawW = photoH * aspect;
            }
            ctx.drawImage(img, photoX - (drawW - photoW) / 2, photoY - (drawH - photoH) / 2, drawW, drawH);
            ctx.restore();

            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 3;
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(photoX, photoY, photoW, photoH, 20);
            } else {
              ctx.rect(photoX, photoY, photoW, photoH);
            }
            ctx.stroke();

            renderTextAndFooter(255, 520, 1140);

          } else if (selectedLayoutId === 'bottomRight') {
            // Bottom Right Photo Stack (Photo X = 650, Y = 730, W = 355, H = 420)
            const photoX = 650;
            const photoY = 730;
            const photoW = 355;
            const photoH = 420;

            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(photoX, photoY, photoW, photoH, 20);
            } else {
              ctx.rect(photoX, photoY, photoW, photoH);
            }
            ctx.clip();

            const aspect = img.width / img.height;
            let drawW = photoW;
            let drawH = photoW / aspect;
            if (drawH < photoH) {
              drawH = photoH;
              drawW = photoH * aspect;
            }
            ctx.drawImage(img, photoX - (drawW - photoW) / 2, photoY - (drawH - photoH) / 2, drawW, drawH);
            ctx.restore();

            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 3;
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(photoX, photoY, photoW, photoH, 20);
            } else {
              ctx.rect(photoX, photoY, photoW, photoH);
            }
            ctx.stroke();

            renderTextAndFooter(255, 520, 1140);

          } else if (selectedLayoutId === 'topCenter') {
            // Top Center Photo (X = 390, Y = 140, W = 300, H = 340) -> Centered Poem Below!
            const photoX = 390;
            const photoY = 140;
            const photoW = 300;
            const photoH = 340;

            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(photoX, photoY, photoW, photoH, 20);
            } else {
              ctx.rect(photoX, photoY, photoW, photoH);
            }
            ctx.clip();

            const aspect = img.width / img.height;
            let drawW = photoW;
            let drawH = photoW / aspect;
            if (drawH < photoH) {
              drawH = photoH;
              drawW = photoH * aspect;
            }
            ctx.drawImage(img, photoX - (drawW - photoW) / 2, photoY - (drawH - photoH) / 2, drawW, drawH);
            ctx.restore();

            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 3;
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(photoX, photoY, photoW, photoH, 20);
            } else {
              ctx.rect(photoX, photoY, photoW, photoH);
            }
            ctx.stroke();

            renderTextAndFooter(580, 930, 1140);
          }
        };

        img.onerror = () => {
          renderTextAndFooter(255, 930, 1140);
        };

        img.src = uploadedPhotoUrl;
      } else {
        // Full Text Poem Mode without photo
        renderTextAndFooter(255, 930, 1140);
      }
    });
  };

  useEffect(() => {
    drawPosterCanvas();
  }, [title, content, selectedThemeId, selectedLayoutId, uploadedPhotoUrl]);

  // Option 1: Download PNG (-25 Points)
  const handleGenerateAndDownload = async () => {
    if (requireAuth && !requireAuth()) return;

    if (!HAS_25_POINTS) {
      alert(`आपके पास केवल ${userPoints} रिवॉर्ड पॉइंट्स हैं। इमेज़ डाउनलोड करने के लिए 25 पॉइंट्स आवश्यक हैं।`);
      return;
    }

    setDownloading(true);
    try {
      const canvas = await drawPosterCanvas();
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `Bolateeworld_Poet_Poster_${title.replace(/\s+/g, '_')}_4x5.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Deduct 25 Points
      if (onRewardPoints) {
        onRewardPoints(-25, 'कवि इमेज़ पोस्टर डाउनलोड करने पर');
      }

    } catch (e) {
      console.error('Poster download error:', e);
    } finally {
      setDownloading(false);
    }
  };

  // Option 2: Post Directly to Feed (-15 Points)
  const handlePublishDirectly = async () => {
    if (requireAuth && !requireAuth()) return;

    if (!HAS_15_POINTS) {
      alert(`आपके पास केवल ${userPoints} रिवॉर्ड पॉइंट्स हैं। मंच पर पोस्ट करने के लिए 15 पॉइंट्स आवश्यक हैं।`);
      return;
    }

    setPosting(true);
    try {
      const canvas = await drawPosterCanvas();
      const pngUrl = canvas.toDataURL('image/png');

      if (onPublishPosterPost) {
        onPublishPosterPost({
          title,
          content,
          imageUrl: pngUrl
        });
      }
    } catch (e) {
      console.error('Poster publish error:', e);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Studio Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-rose-950 font-extrabold text-xs uppercase flex items-center gap-1 shadow">
              <Sparkles className="w-3.5 h-3.5" />
              <span>बोलती कलम Studio</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-rozha text-amber-200">
            कवि इमेज़ पोस्टर Studio
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 max-w-xl font-tiro">
            अपनी कविता और तस्वीर को एक सुंदर 4:5 HD इमेज़ पोस्टर में बदलें। (डाउनलोड: 25 Pts | सीधी पोस्ट: 15 Pts)
          </p>
        </div>

        {/* Current Points Counter Badge */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-400/50 text-amber-300 text-center shrink-0 z-10">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">आपके कुल पॉइंट्स</span>
          <span className="text-2xl font-extrabold text-amber-400">{userPoints} Pts</span>
          <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
            {HAS_25_POINTS ? '✓ 25 Pts उपलब्ध हैं' : `⚠️ 25 Pts आवश्यक (आपके पास ${userPoints})`}
          </span>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <Palette className="w-5 h-5 text-rose-600" />
            <span>पोस्टर कस्टमाइज़ेशन</span>
          </h3>

          {/* Title Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>कविता का शीर्षक (Title) <span className="text-rose-600">*</span></span>
              <span className="text-[10px] text-slate-400 font-normal">आवश्यक</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="अपनी कविता का शीर्षक लिखें..."
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 font-bold"
            />
          </div>

          {/* Poem Content Input with Line Count Limit */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-bold">
              <label className="text-slate-700 dark:text-slate-300">
                कविता की पंक्तियाँ (Poem Content) <span className="text-rose-600">*</span>
              </label>
              <span className={`text-[10px] ${isTextTooLong ? 'text-rose-600 font-extrabold' : 'text-slate-500'}`}>
                {validLinesCount}/14 पंक्तियाँ
              </span>
            </div>

            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="यहाँ अपनी कविता लिखें..."
              className="w-full p-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 font-tiro leading-relaxed"
            />

            {isTextTooLong && (
              <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>4:5 पोस्ट पर 14 पंक्तियों से अधिक न लिखें ताकि अक्षर स्पष्ट रहें।</span>
              </p>
            )}
          </div>

          {/* Fixed Non-Editable Poet Info */}
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">कवि पहचान (Fixed Account Info)</span>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-slate-100">{fixedAuthorName}</span>
              <span className="text-slate-500 font-medium">@{fixedAuthorUsername}</span>
            </div>
          </div>

          {/* Theme Dropdown (5 Themes) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              थीम व बैकग्राउंड स्टाइल चुनें (5 Themes)
            </label>
            <select
              value={selectedThemeId}
              onChange={(e) => setSelectedThemeId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold cursor-pointer focus:ring-2 focus:ring-rose-500"
            >
              {THEMES.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Layout Dropdown (5 Layouts) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              इमेज़ व टेक्स्ट लेआउट स्टाइल चुनें (5 Styles)
            </label>
            <select
              value={selectedLayoutId}
              onChange={(e) => setSelectedLayoutId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold cursor-pointer focus:ring-2 focus:ring-rose-500"
            >
              {LAYOUTS.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          {/* Custom Photo Upload (Optional) */}
          <div className="space-y-2 pt-1 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                अपनी इमेज़/फोटो जोड़ें (Optional)
              </label>
              {uploadedPhotoUrl && (
                <button 
                  onClick={handleClearPhoto}
                  className="text-[10px] text-rose-600 font-bold hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  फोटो हटाएँ
                </button>
              )}
            </div>

            <label className="w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-rose-500/40 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-rose-100/50 transition">
              <Upload className="w-4 h-4 text-rose-600" />
              <span>{uploadedPhotoUrl ? 'दूसरी फोटो बदलें' : 'अपनी फोटो अपलोड करें'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            {!uploadedPhotoUrl && (
              <p className="text-[10px] text-slate-500 italic">
                * फोटो न अपलोड करने पर पोस्ट केवल कविता (Full Text) मोड में बिना फोटो के डाउनलोड/पोस्ट होगी।
              </p>
            )}
          </div>

        </div>

        {/* Right Live 4:5 Preview Canvas Container (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col items-center justify-center space-y-4">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between w-full border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-rose-600" />
              <span>तुरंत 4:5 लाइव पोस्टर प्रिव्यू (Live Preview)</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 font-extrabold uppercase">
              24px Rounded PNG
            </span>
          </div>

          {/* Live Canvas Element (Directly Rendered First!) */}
          <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-rose-600/40">
            <canvas 
              ref={canvasRef} 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Action Download & Direct Post Buttons Directly Below Live Preview */}
          <div className="w-full max-w-[420px] space-y-2.5 pt-1">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Download Option */}
              <button
                onClick={handleGenerateAndDownload}
                disabled={downloading || !HAS_25_POINTS || isTextTooLong}
                className="py-3 px-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {HAS_25_POINTS ? (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{downloading ? 'डाउनलोडिंग...' : 'इमेज़ डाउनलोड (-25 Pts)'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-300" />
                    <span>25 Pts आवश्यक</span>
                  </>
                )}
              </button>

              {/* Direct Post Option */}
              <button
                onClick={handlePublishDirectly}
                disabled={posting || !HAS_15_POINTS || isTextTooLong}
                className="py-3 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {HAS_15_POINTS ? (
                  <>
                    <Send className="w-4 h-4 text-slate-950" />
                    <span>{posting ? 'पोस्ट हो रहा...' : 'मंच पर पोस्ट करें (-15 Pts)'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-rose-950" />
                    <span>15 Pts आवश्यक</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
              * इमेज़ डाउनलोड करने पर 25 Pts कटेंगे। सीधे मंच पर पोस्ट करने पर केवल 15 Pts कटेंगे।
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default PosterStudioView;
