import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Download, Image as ImageIcon, Upload, Check, 
  AlertCircle, Lock, Award, RefreshCw, Palette, Type, Feather, Trash2, Send, X, Eye
} from 'lucide-react';

const THEMES = [
  { id: 'independence', name: '🇮🇳 15 अगस्त स्वतंत्रता दिवस विशेषांक', colorBg: 'bg-gradient-to-br from-orange-500 via-white to-emerald-600 text-slate-900 border-amber-500', bg1: '#fffdf5', bg2: '#fef9c3', border: '#ff9933', title: '#991b1b', text: '#0f172a', brand: '#15803d' },
  { id: 'parchment', name: '📜 पार्चमेंट रॉयल', colorBg: 'bg-amber-100 text-amber-900 border-amber-400', bg1: '#fffdf9', bg2: '#fef3c7', border: '#be123c', title: '#881337', text: '#1e293b', brand: '#be123c' },
  { id: 'purple', name: '💜 हिन्दवी पर्पल', colorBg: 'bg-purple-900 text-amber-300 border-amber-400', bg1: '#581c87', bg2: '#3b0764', border: '#f59e0b', title: '#ffffff', text: '#f3e8ff', brand: '#fbbf24' },
  { id: 'ivory', name: '🤍 क्लासिक आइवरी', colorBg: 'bg-slate-100 text-slate-900 border-slate-400', bg1: '#fffdfa', bg2: '#f5f5f4', border: '#09090b', title: '#09090b', text: '#27272a', brand: '#e11d48' },
  { id: 'dark', name: '🖤 डार्क वेलवेट', colorBg: 'bg-slate-950 text-rose-400 border-rose-600', bg1: '#0f172a', bg2: '#020617', border: '#e11d48', title: '#fbbf24', text: '#f8fafc', brand: '#e11d48' },
  { id: 'sage', name: '🌿 विंटेज सेज', colorBg: 'bg-emerald-100 text-emerald-900 border-emerald-500', bg1: '#f0fdf4', bg2: '#dcfce7', border: '#15803d', title: '#14532d', text: '#166534', brand: '#15803d' }
];

export const PosterStudioView = ({ userProfile, onRewardPoints, onPublishPosterPost, requireAuth, setActiveView }) => {
  const userPoints = userProfile?.points || 0;
  const HAS_25_POINTS = userPoints >= 25;
  const HAS_15_POINTS = userPoints >= 15;

  const fixedAuthorName = userProfile?.name || 'साहित्य साधक';
  const fixedAuthorUsername = (userProfile?.username || '@writer').replace(/^[@#]/, '');

  // Initial empty state so user MUST type title & content before previewing/downloading/posting!
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [selectedThemeId, setSelectedThemeId] = useState('parchment');
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [posting, setPosting] = useState(false);

  // Live Preview Modal Popup State
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const canvasRef = useRef(null);

  const processLinesWithWordLimit = (rawText, maxWordsPerLine = 8) => {
    const rawLines = rawText.split('\n').map(l => l.replace(/^["'“”«»-]+|["'“”«»-]+$/g, '').trim());
    const finalLines = [];

    for (let l of rawLines) {
      if (l === '') {
        finalLines.push('');
        continue;
      }

      const words = l.split(/\s+/);
      if (words.length <= maxWordsPerLine) {
        finalLines.push(l);
      } else {
        for (let i = 0; i < words.length; i += maxWordsPerLine) {
          finalLines.push(words.slice(i, i + maxWordsPerLine).join(' '));
        }
      }
    }
    return finalLines;
  };

  const lines = processLinesWithWordLimit(content, 8);
  const validLinesCount = lines.filter(l => l.length > 0).length;
  const isTextTooLong = validLinesCount > 14 || content.length > 380;
  const isFormInvalid = !title.trim() || !content.trim();

  const currentTheme = THEMES.find(t => t.id === selectedThemeId) || THEMES[0];

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

  const drawPosterCanvas = () => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');

      const { bg1, bg2, border: borderColor, title: titleColor, text: textColor, brand: brandColor } = currentTheme;

      // 1. Background Fill
      ctx.save();
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
      gradient.addColorStop(0, bg1);
      gradient.addColorStop(1, bg2);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1350);

      // 2. 15th August Special Patriotic Theme Elements
      if (selectedThemeId === 'independence') {
        // Tiranga Tri-Color Top Header Stripes
        const headerY = 54;
        const stripeH = 32;
        
        // Saffron
        ctx.fillStyle = '#FF9933';
        ctx.fillRect(54, headerY, 972, stripeH);
        
        // White
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(54, headerY + stripeH, 972, stripeH);
        
        // Green
        ctx.fillStyle = '#138808';
        ctx.fillRect(54, headerY + (stripeH * 2), 972, stripeH);

        // Ashoka Chakra (24 Spokes) in Navy Blue on White Stripe
        const chakraX = 540;
        const chakraY = headerY + stripeH + (stripeH / 2);
        const chakraRadius = 13;

        ctx.strokeStyle = '#000080';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(chakraX, chakraY, chakraRadius, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.fillStyle = '#000080';
        ctx.beginPath();
        ctx.arc(chakraX, chakraY, 2.5, 0, 2 * Math.PI);
        ctx.fill();

        for (let i = 0; i < 24; i++) {
          const angle = (i * 15 * Math.PI) / 180;
          ctx.beginPath();
          ctx.moveTo(chakraX, chakraY);
          ctx.lineTo(
            chakraX + chakraRadius * Math.cos(angle),
            chakraY + chakraRadius * Math.sin(angle)
          );
          ctx.stroke();
        }

        // Patriotic Banner Ribbon
        ctx.textAlign = 'center';
        ctx.fillStyle = '#991b1b';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText('🇮🇳 15 अगस्त स्वतंत्रता दिवस विशेषांक 🇮🇳', 540, 185);
      }

      // 3. Royal Double Border
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 16;
      ctx.strokeRect(36, 36, 1008, 1278);

      ctx.lineWidth = 4;
      ctx.strokeRect(54, 54, 972, 1242);

      // 4. Render Poem Title
      const titleY = selectedThemeId === 'independence' ? 245 : 150;
      ctx.textAlign = 'center';
      ctx.fillStyle = title.trim() ? titleColor : 'rgba(150, 150, 150, 0.6)';
      ctx.font = 'bold 56px serif';
      ctx.fillText(title.trim() ? title.trim() : '★ शीर्षक (Title) ★', 540, titleY);

      // Title Divider Decorative Line
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(340, titleY + 30);
      ctx.lineTo(740, titleY + 30);
      ctx.stroke();

      // 5. Render Poem Lines
      ctx.textAlign = 'center';
      let startY = titleY + 110;
      const lineHeight = 70;

      if (lines.filter(l => l.trim().length > 0).length === 0) {
        ctx.fillStyle = 'rgba(160, 160, 160, 0.6)';
        ctx.font = 'italic 40px serif';
        ctx.fillText('✦ यहाँ अपनी कविता की पंक्तियाँ लिखें... ✦', 540, startY + 50);
      } else {
        ctx.fillStyle = textColor;
        ctx.font = '44px serif';

        lines.forEach((lineText) => {
          if (lineText.trim()) {
            ctx.fillText(`✦ ${lineText} ✦`, 540, startY);
          }
          startY += lineHeight;
        });
      }

      // Helper function to render footer & optional uploaded photo
      const finishDrawingWithPhoto = (photoImg) => {
        const footerY = 1240;

        // If uploaded photo exists, draw it in a framed box near author name
        if (photoImg) {
          ctx.save();
          const pSize = 130;
          const pX = 85;
          const pY = 1070;

          // Circular Mask
          ctx.beginPath();
          ctx.arc(pX + pSize / 2, pY + pSize / 2, pSize / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(photoImg, pX, pY, pSize, pSize);
          ctx.restore();

          // Border Ring around photo
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.arc(pX + pSize / 2, pY + pSize / 2, pSize / 2, 0, Math.PI * 2);
          ctx.stroke();

          // Author Signature shifted right of photo
          ctx.textAlign = 'left';
          ctx.font = 'bold 36px sans-serif';
          ctx.fillStyle = brandColor;
          ctx.fillText(`✍️ ${fixedAuthorName}`, 235, footerY);
        } else {
          // Standard Author Signature Line
          ctx.textAlign = 'left';
          ctx.font = 'bold 36px sans-serif';
          ctx.fillStyle = brandColor;
          ctx.fillText(`✍️ ${fixedAuthorName}`, 90, footerY);
        }

        ctx.textAlign = 'right';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillStyle = textColor;
        ctx.fillText(`bolateeworld.in`, 990, footerY);

        ctx.restore();
        resolve(canvas);
      };

      // Load uploaded photo if present
      if (uploadedPhotoUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => finishDrawingWithPhoto(img);
        img.onerror = () => finishDrawingWithPhoto(null);
        img.src = uploadedPhotoUrl;
      } else {
        finishDrawingWithPhoto(null);
      }
    });
  };

  useEffect(() => {
    drawPosterCanvas();
  }, [title, content, selectedThemeId, uploadedPhotoUrl, showPreviewModal]);

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

      if (onRewardPoints) {
        onRewardPoints(-25, 'कवि इमेज़ पोस्टर डाउनलोड करने पर');
      }

      setShowPreviewModal(false);

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
      const compressedUrl = canvas.toDataURL('image/jpeg', 0.88);

      if (onPublishPosterPost) {
        onPublishPosterPost({
          title: title.trim() || 'कवि इमेज़ पोस्टर',
          content: content.trim(),
          imageUrl: compressedUrl
        });
      }

      setShowPreviewModal(false);
    } catch (e) {
      console.error('Poster publish error:', e);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Studio Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-600 via-rose-700 to-amber-600 text-white shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 font-extrabold text-xs uppercase flex items-center gap-1.5 border border-white/30 shadow">
              <Sparkles className="w-3.5 h-3.5" />
              <span>बोलती कलम पोस्टर Studio</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-rozha text-amber-100 drop-shadow">
            कवि इमेज़ पोस्टर Studio
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/90 max-w-xl font-tiro leading-relaxed">
            अपनी कविता और रचना का शीर्षक व पंक्तियाँ दर्ज करें, फिर 'प्रिव्यू देखें' पर क्लिक करके अपना 4:5 HD इमेज़ पोस्टर डाउनलोड करें।
          </p>
        </div>

        {/* Current Points Counter Badge */}
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 text-amber-200 text-center shrink-0 z-10 shadow-lg w-full md:w-auto">
          <span className="text-[10px] text-amber-100 uppercase font-bold block">आपके कुल रिवॉर्ड पॉइंट्स</span>
          <span className="text-3xl font-black text-amber-300 drop-shadow">{userPoints} Pts</span>
          <span className="text-[10px] text-emerald-300 font-bold block mt-0.5">
            {HAS_25_POINTS ? '✓ 25 Pts उपलब्ध हैं' : `⚠️ 25 Pts आवश्यक (आपके पास ${userPoints})`}
          </span>
        </div>
      </div>

      {/* Main Form Customization Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 w-full">
        
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Palette className="w-5 h-5 text-orange-600" />
            <span>पोस्टर कस्टमाइज़ेशन फ़ॉर्म</span>
          </h3>
          <span className="text-xs bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold px-3 py-1 rounded-full">
            100% HD Quality
          </span>
        </div>

        {/* Title Input */}
        <div className="space-y-2 w-full">
          <label className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <span>कविता का शीर्षक (Title) <span className="text-orange-600">*</span></span>
            <span className="text-xs text-slate-400 font-normal">आवश्यक</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="अपनी कविता का शीर्षक लिखें..."
            className="w-full px-4 py-3.5 text-sm sm:text-base rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 font-extrabold shadow-inner transition-all"
          />
        </div>

        {/* Poem Content Input */}
        <div className="space-y-2 w-full">
          <div className="flex justify-between items-center text-xs sm:text-sm font-extrabold">
            <label className="text-slate-800 dark:text-slate-200">
              कविता की पंक्तियाँ (Poem Content) <span className="text-orange-600">*</span>
            </label>
            <span className={`text-xs ${isTextTooLong ? 'text-rose-600 font-extrabold' : 'text-slate-500'}`}>
              {validLinesCount}/14 पंक्तियाँ
            </span>
          </div>

          <textarea
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="यहाँ अपनी कविता की पंक्तियाँ लिखें..."
            className="w-full p-4 text-sm sm:text-base rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 font-tiro leading-relaxed shadow-inner transition-all"
          />

          {isTextTooLong && (
            <p className="text-xs text-rose-600 font-bold flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>14 पंक्तियों से अधिक न लिखें ताकि अक्षर स्पष्ट रहें।</span>
            </p>
          )}
        </div>

        {/* Fixed Non-Editable Poet Info */}
        <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 space-y-1">
          <span className="text-xs text-orange-600 dark:text-orange-400 font-bold uppercase block">कवि पहचान (Fixed Account Info)</span>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-extrabold text-slate-900 dark:text-slate-100">{fixedAuthorName}</span>
            <span className="text-slate-500 font-medium">@{fixedAuthorUsername}</span>
          </div>
        </div>

        {/* Visual Theme Selection Pills */}
        <div className="space-y-2 w-full">
          <label className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 block">
            थीम व बैकग्राउंड स्टाइल चुनें:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedThemeId(t.id)}
                className={`p-3 rounded-2xl text-xs sm:text-sm font-extrabold border-2 transition-all flex items-center justify-center gap-2 ${t.colorBg} ${
                  selectedThemeId === t.id ? 'ring-2 ring-orange-500 scale-[1.02] shadow-md' : 'opacity-80 hover:opacity-100'
                }`}
              >
                <span className="truncate">{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Photo Upload */}
        <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800 w-full">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">
              अपनी इमेज़/फोटो जोड़ें (Optional)
            </label>
            {uploadedPhotoUrl && (
              <button 
                onClick={handleClearPhoto}
                className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                फोटो हटाएँ
              </button>
            )}
          </div>

          <label className="w-full py-4 px-4 rounded-2xl border-2 border-dashed border-orange-500/40 bg-orange-50/50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer hover:bg-orange-100/50 transition">
            <Upload className="w-4 h-4 text-orange-600" />
            <span>{uploadedPhotoUrl ? 'दूसरी फोटो बदलें' : 'अपनी फोटो अपलोड करें'}</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>

        {/* 🚀 Main CTA Button to Trigger Modal Popup Preview */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <button
            onClick={() => {
              if (isFormInvalid) {
                alert('⚠️ प्रिव्यू देखने के लिए शीर्षक एवं कविता की पंक्तियाँ दर्ज करना आवश्यक है।');
                return;
              }
              setShowPreviewModal(true);
            }}
            disabled={isFormInvalid}
            className="w-full py-4 px-6 bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Eye className="w-5 h-5 text-amber-200" />
            <span>✨ HD इमेज़ पोस्टर प्रिव्यू देखें (Open Live Preview Modal)</span>
          </button>

          {isFormInvalid && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-extrabold text-center bg-rose-50 dark:bg-rose-950/50 p-3 rounded-2xl border border-rose-300 dark:border-rose-800 flex items-center justify-center gap-1.5 shadow-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>* प्रिव्यू, डाउनलोड या पोस्ट करने के लिए शीर्षक एवं पंक्तियाँ दर्ज करना अनिवार्य है। (कोई कॉइन/पॉइंट्स नहीं कटेंगे)</span>
            </p>
          )}
        </div>

      </div>

      {/* 🖼️ LIVE PREVIEW MODAL POPUP WINDOW */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-lg w-full relative space-y-5 text-center my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  लाइव HD पोस्टर प्रिव्यू
                </h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live HD Canvas Preview */}
            <div className="relative w-full max-w-[420px] aspect-[4/5] mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-orange-500/50 ring-4 ring-orange-500/20 bg-slate-100 dark:bg-slate-950">
              <canvas 
                ref={canvasRef} 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Action Buttons Inside Modal */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {/* Download Option */}
                <button
                  onClick={handleGenerateAndDownload}
                  disabled={downloading || !HAS_25_POINTS || isTextTooLong || isFormInvalid}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {HAS_25_POINTS ? (
                    <>
                      <Download className="w-4.5 h-4.5" />
                      <span>{downloading ? 'डाउनलोडिंग...' : 'इमेज़ डाउनलोड (-25 Pts)'}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4.5 h-4.5 text-amber-200" />
                      <span>25 Pts आवश्यक</span>
                    </>
                  )}
                </button>

                {/* Direct Post Option */}
                <button
                  onClick={handlePublishDirectly}
                  disabled={posting || !HAS_15_POINTS || isTextTooLong || isFormInvalid}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {HAS_15_POINTS ? (
                    <>
                      <Send className="w-4.5 h-4.5 text-white" />
                      <span>{posting ? 'पोस्ट हो रहा...' : 'मंच पर पोस्ट करें (-15 Pts)'}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4.5 h-4.5 text-emerald-200" />
                      <span>15 Pts आवश्यक</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 text-center font-medium">
                * इमेज़ डाउनलोड करने पर 25 Pts कटेंगे। सीधे मंच पर पोस्ट करने पर केवल 15 Pts कटेंगे।
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default PosterStudioView;
