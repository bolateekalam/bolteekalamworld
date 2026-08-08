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

  // Default sample poem prefilled so live preview is instantly stunning!
  const [title, setTitle] = useState('स्वतंत्रता के स्वर');
  const [content, setContent] = useState('विहंस रही आज स्वतंत्र क्षितिज पर,\nसत्य-अहिंसा की अमर अमरता।\nकोटि-कोटि कंठों से गूँजे,\nभारत माँ की पावन ममता।');

  const [selectedThemeId, setSelectedThemeId] = useState('parchment');
  const [selectedLayoutId, setSelectedLayoutId] = useState('side');
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [posting, setPosting] = useState(false);

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

  // Render 4:5 Poster Canvas with High Resolution & Crisp Typography
  const drawPosterCanvas = () => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');

      const { bg1, bg2, border: borderColor, title: titleColor, text: textColor, brand: brandColor } = currentTheme;

      // Outer Background Canvas
      ctx.save();
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
      gradient.addColorStop(0, bg1);
      gradient.addColorStop(1, bg2);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1350);

      // Decorative Outer Borders
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 14;
      ctx.strokeRect(36, 36, 1008, 1278);

      ctx.lineWidth = 3;
      ctx.strokeRect(52, 52, 976, 1246);

      // Render Title
      ctx.textAlign = 'center';
      ctx.fillStyle = titleColor;
      ctx.font = 'bold 54px serif';
      ctx.fillText(title.trim() || 'कविता का शीर्षक', 540, 150);

      // Title Divider Decorative Line
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(340, 180);
      ctx.lineTo(740, 180);
      ctx.stroke();

      // Render Poem Lines
      ctx.textAlign = 'center';
      ctx.fillStyle = textColor;
      ctx.font = '40px serif';
      
      let startY = 270;
      const lineHeight = 65;

      lines.forEach((lineText) => {
        if (lineText.trim()) {
          ctx.fillText(`✦ ${lineText} ✦`, 540, startY);
        }
        startY += lineHeight;
      });

      // Footer Author Signature Section
      const footerY = 1240;
      ctx.textAlign = 'left';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillStyle = brandColor;
      ctx.fillText(`✍️ ${fixedAuthorName}`, 90, footerY);

      ctx.textAlign = 'right';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillStyle = textColor;
      ctx.fillText(`bolateeworld.in`, 990, footerY);

      ctx.restore();
      resolve(canvas);
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
      const compressedUrl = canvas.toDataURL('image/jpeg', 0.88);

      if (onPublishPosterPost) {
        onPublishPosterPost({
          title: title.trim() || 'कवि इमेज़ पोस्टर',
          content: content.trim(),
          imageUrl: compressedUrl
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
      
      {/* Premium Studio Header Banner */}
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
            अपनी कविता और रचना को एक सुंदर HD इमेज़ पोस्टर में बदलें और 1-क्लिक में डाउनलोड करें।
          </p>
        </div>

        {/* Current Points Counter Badge */}
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 text-amber-200 text-center shrink-0 z-10 shadow-lg">
          <span className="text-[10px] text-amber-100 uppercase font-bold block">आपके कुल रिवॉर्ड पॉइंट्स</span>
          <span className="text-3xl font-black text-amber-300 drop-shadow">{userPoints} Pts</span>
          <span className="text-[10px] text-emerald-300 font-bold block mt-0.5">
            {HAS_25_POINTS ? '✓ 25 Pts उपलब्ध हैं' : `⚠️ 25 Pts आवश्यक (आपके पास ${userPoints})`}
          </span>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Palette className="w-5 h-5 text-orange-600" />
              <span>पोस्टर कस्टमाइज़ेशन</span>
            </h3>
            <span className="text-[10px] bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold px-2 py-0.5 rounded-full">
              HD Studio
            </span>
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>कविता का शीर्षक (Title) <span className="text-orange-600">*</span></span>
              <span className="text-[10px] text-slate-400 font-normal">आवश्यक</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="अपनी कविता का शीर्षक लिखें..."
              className="w-full px-4 py-2.5 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 font-bold shadow-inner"
            />
          </div>

          {/* Poem Content Input with Line Count Limit */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-extrabold">
              <label className="text-slate-800 dark:text-slate-200">
                कविता की पंक्तियाँ (Poem Content) <span className="text-orange-600">*</span>
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
              className="w-full p-4 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 font-tiro leading-relaxed shadow-inner"
            />

            {isTextTooLong && (
              <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>14 पंक्तियों से अधिक न लिखें ताकि अक्षर स्पष्ट रहें।</span>
              </p>
            )}
          </div>

          {/* Fixed Non-Editable Poet Info */}
          <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 space-y-1">
            <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase block">कवि पहचान (Fixed Account Info)</span>
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-900 dark:text-slate-100">{fixedAuthorName}</span>
              <span className="text-slate-500 font-medium">@{fixedAuthorUsername}</span>
            </div>
          </div>

          {/* Theme Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
              थीम व बैकग्राउंड स्टाइल चुनें (5 Themes)
            </label>
            <select
              value={selectedThemeId}
              onChange={(e) => setSelectedThemeId(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold cursor-pointer focus:ring-2 focus:ring-orange-500"
            >
              {THEMES.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Layout Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
              इमेज़ व टेक्स्ट लेआउट स्टाइल चुनें (5 Styles)
            </label>
            <select
              value={selectedLayoutId}
              onChange={(e) => setSelectedLayoutId(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold cursor-pointer focus:ring-2 focus:ring-orange-500"
            >
              {LAYOUTS.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          {/* Custom Photo Upload */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
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

            <label className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-orange-500/40 bg-orange-50/50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer hover:bg-orange-100/50 transition">
              <Upload className="w-4 h-4 text-orange-600" />
              <span>{uploadedPhotoUrl ? 'दूसरी फोटो बदलें' : 'अपनी फोटो अपलोड करें'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

        </div>

        {/* Right Live Preview Canvas Container (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center space-y-5">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between w-full border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-extrabold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-orange-600" />
              <span>तुरंत लाइव पोस्टर प्रिव्यू (Live HD Preview)</span>
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-orange-500 text-white font-black uppercase shadow-sm">
              HD PNG 4:5
            </span>
          </div>

          {/* Live Canvas Element (Directly Rendered First!) */}
          <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-orange-500/40 ring-4 ring-orange-500/20">
            <canvas 
              ref={canvasRef} 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Action Download & Direct Post Buttons Directly Below Live Preview */}
          <div className="w-full max-w-[420px] space-y-3 pt-1">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Download Option */}
              <button
                onClick={handleGenerateAndDownload}
                disabled={downloading || !HAS_25_POINTS || isTextTooLong || isFormInvalid}
                className="py-3.5 px-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xl transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {HAS_25_POINTS ? (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{downloading ? 'डाउनलोडिंग...' : 'इमेज़ डाउनलोड (-25 Pts)'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-200" />
                    <span>25 Pts आवश्यक</span>
                  </>
                )}
              </button>

              {/* Direct Post Option */}
              <button
                onClick={handlePublishDirectly}
                disabled={posting || !HAS_15_POINTS || isTextTooLong || isFormInvalid}
                className="py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xl transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {HAS_15_POINTS ? (
                  <>
                    <Send className="w-4 h-4 text-white" />
                    <span>{posting ? 'पोस्ट हो रहा...' : 'मंच पर पोस्ट करें (-15 Pts)'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-emerald-200" />
                    <span>15 Pts आवश्यक</span>
                  </>
                )}
              </button>
            </div>

            {isFormInvalid && (
              <p className="text-[10px] text-orange-600 dark:text-orange-400 font-bold text-center">
                * डाउनलोड या पोस्ट करने के लिए शीर्षक एवं पंक्तियाँ दर्ज करना आवश्यक है।
              </p>
            )}

            {!isFormInvalid && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center font-medium">
                * इमेज़ डाउनलोड करने पर 25 Pts कटेंगे। सीधे मंच पर पोस्ट करने पर केवल 15 Pts कटेंगे।
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default PosterStudioView;
