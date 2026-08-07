import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Download, Image as ImageIcon, Upload, Check, 
  AlertCircle, Lock, Award, RefreshCw, Palette, Type, Feather
} from 'lucide-react';

const defaultAuthorSketches = [
  { id: 'sketch1', name: 'क्लासिक कवि स्केच 1', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400' },
  { id: 'sketch2', name: 'क्लासिक कवि स्केच 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' },
  { id: 'sketch3', name: 'कवयित्री स्केच', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400' },
  { id: 'sketch4', name: 'साहित्य साधक स्केच', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400' }
];

export const PosterStudioView = ({ userProfile, onRewardPoints, requireAuth, setActiveView }) => {
  const userPoints = userProfile?.points || 0;
  const HAS_ENOUGH_POINTS = userPoints >= 25;

  const [title, setTitle] = useState('कलम की लौ');
  const [content, setContent] = useState(
    "शब्द अगर सच के हों, दीपक बन जाते हैं,\nअँधियारे रास्तों में भी, सूरज उग आते हैं।\n\nझुककर जो सीखता है, वही शिखर छूता है,\nअहंकार का महल तो, पल में ही टूटता है।"
  );
  const [authorName, setAuthorName] = useState(userProfile?.name || 'बोलती कलम लेखक');
  const [authorUsername, setAuthorUsername] = useState(userProfile?.username || '@writer');

  const [selectedTheme, setSelectedTheme] = useState('parchment'); // parchment, purple, ivory, dark
  const [highlightFirstStanza, setHighlightFirstStanza] = useState(true);
  const [authorImageUrl, setAuthorImageUrl] = useState(userProfile?.avatar || defaultAuthorSketches[0].url);
  const [downloading, setDownloading] = useState(false);

  const canvasRef = useRef(null);

  const cleanUsername = authorUsername.replace(/^[@#]/, '');
  const lines = content.split('\n').map(l => l.replace(/^["'“”«»-]+|["'“”«»-]+$/g, '').trim());
  const validLinesCount = lines.filter(l => l.length > 0).length;
  const isTextTooLong = validLinesCount > 14 || content.length > 380;

  // Custom Image Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAuthorImageUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Render 4:5 Poster Canvas (1080x1350)
  const drawPosterCanvas = () => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');

      // Theme Colors
      let bgColor1 = '#fffdf9';
      let bgColor2 = '#fef3c7';
      let borderColor = '#be123c';
      let titleColor = '#881337';
      let textColor = '#1e293b';
      let brandColor = '#be123c';
      let highlightBg = '#fef08a';
      let highlightText = '#854d0e';

      if (selectedTheme === 'purple') {
        bgColor1 = '#581c87';
        bgColor2 = '#3b0764';
        borderColor = '#f59e0b';
        titleColor = '#ffffff';
        textColor = '#f3e8ff';
        brandColor = '#fbbf24';
        highlightBg = '#a855f7';
        highlightText = '#ffffff';
      } else if (selectedTheme === 'ivory') {
        bgColor1 = '#fffdfa';
        bgColor2 = '#f5f5f4';
        borderColor = '#09090b';
        titleColor = '#09090b';
        textColor = '#27272a';
        brandColor = '#e11d48';
        highlightBg = '#fef08a';
        highlightText = '#713f12';
      } else if (selectedTheme === 'dark') {
        bgColor1 = '#0f172a';
        bgColor2 = '#020617';
        borderColor = '#e11d48';
        titleColor = '#fbbf24';
        textColor = '#f8fafc';
        brandColor = '#e11d48';
        highlightBg = '#b45309';
        highlightText = '#ffffff';
      }

      // 1. Clip Canvas with 24px Rounded Outer Corners
      ctx.save();
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(12, 12, 1056, 1326, 24);
      } else {
        ctx.rect(12, 12, 1056, 1326);
      }
      ctx.clip();

      // Background Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1350);
      bgGrad.addColorStop(0, bgColor1);
      bgGrad.addColorStop(1, bgColor2);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1350);

      // Sleek 24px Rounded Crimson/Gold Outer Border
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

      // 3. Poem Title (Left Aligned)
      ctx.fillStyle = titleColor;
      ctx.font = 'bold 44px serif';
      const truncatedTitle = title.length > 20 ? title.slice(0, 20) + '...' : title;
      ctx.fillText(truncatedTitle, 75, 180);

      // 4. Render Author Image / Portrait Sketch on Right Side
      const img = new Image();
      img.crossOrigin = 'anonymous';

      const renderTextAndFooter = () => {
        // Render Poem Lines on Left Side (Width = 560px)
        let fontSize = 34;
        let lineHeight = 54;
        let fontWeight = 'bold';

        if (validLinesCount <= 6) {
          fontSize = 40;
          lineHeight = 64;
          fontWeight = 'bold';
        } else if (validLinesCount <= 10) {
          fontSize = 32;
          lineHeight = 52;
          fontWeight = 'bold';
        } else {
          fontSize = 26;
          lineHeight = 42;
          fontWeight = 'normal';
        }

        let currentY = 265;
        let isFirstStanza = true;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (currentY > 1120) break;

          if (line === '') {
            currentY += Math.round(lineHeight * 0.6);
            isFirstStanza = false;
          } else {
            // Optional Yellow Highlight Pill Marker
            if (highlightFirstStanza && isFirstStanza && i < 4) {
              const textWidth = ctx.measureText(line).width;
              ctx.fillStyle = highlightBg;
              ctx.fillRect(70, currentY - fontSize + 6, Math.min(textWidth + 16, 540), fontSize + 8);
              ctx.fillStyle = highlightText;
            } else {
              ctx.fillStyle = textColor;
            }

            ctx.font = `${fontWeight} ${fontSize}px serif`;
            ctx.fillText(line, 75, currentY);
            currentY += lineHeight;
          }
        }

        // 5. Poet Name Footer at Bottom Left
        ctx.fillStyle = titleColor;
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(`● ${authorName}`, 75, 1220);

        ctx.fillStyle = textColor;
        ctx.font = '22px sans-serif';
        ctx.fillText(`@${cleanUsername}`, 75, 1255);

        // Bottom Right Branding
        ctx.fillStyle = brandColor;
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('www.bolateeworld.in', 740, 1240);

        resolve(canvas);
      };

      img.onload = () => {
        ctx.save();
        // Draw Author Portrait Image on Right (X = 600, Y = 220, W = 400, H = 880)
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(620, 220, 380, 880, 24);
        } else {
          ctx.rect(620, 220, 380, 880);
        }
        ctx.clip();

        // Draw Image object-cover
        const aspect = img.width / img.height;
        let drawW = 380;
        let drawH = 380 / aspect;
        if (drawH < 880) {
          drawH = 880;
          drawW = 880 * aspect;
        }

        ctx.drawImage(img, 620 - (drawW - 380) / 2, 220 - (drawH - 880) / 2, drawW, drawH);
        ctx.restore();

        // Subtle Border around Image
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(620, 220, 380, 880, 24);
        } else {
          ctx.rect(620, 220, 380, 880);
        }
        ctx.stroke();

        renderTextAndFooter();
      };

      img.onerror = () => {
        renderTextAndFooter();
      };

      img.src = authorImageUrl;
    });
  };

  useEffect(() => {
    drawPosterCanvas();
  }, [title, content, authorName, authorUsername, selectedTheme, highlightFirstStanza, authorImageUrl]);

  // Generate & Download PNG + Deduct 25 Points
  const handleGenerateAndDownload = async () => {
    if (requireAuth && !requireAuth()) return;

    if (!HAS_ENOUGH_POINTS) {
      alert(`आपके पास केवल ${userPoints} रिवॉर्ड पॉइंट्स हैं। 4:5 कवि पोस्टर जनरेट करने के लिए 25 पॉइंट्स की आवश्यकता है।`);
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
        onRewardPoints(-25, 'कवि इमेज़ पोस्टर जनरेट करने पर');
      }

    } catch (e) {
      console.error('Poster generation error:', e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Studio Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-rose-950 font-extrabold text-xs uppercase flex items-center gap-1 shadow">
              <Sparkles className="w-3.5 h-3.5" />
              <span>प्रीमियम फीचर</span>
            </span>
            <span className="text-xs text-rose-200 font-bold">
              1080 × 1350 (Instagram 4:5 Aspect Ratio)
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-rozha text-amber-200">
            कवि इमेज़ पोस्टर Studio
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 max-w-xl font-tiro">
            अपनी कविता और तस्वीर को एक सुंदर साहित्यिक 4:5 पोस्ट पोस्टर में बदलें। (लागत: 25 रिवॉर्ड पॉइंट्स)
          </p>
        </div>

        {/* Current Points Counter Badge */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-400/50 text-amber-300 text-center shrink-0 z-10">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">आपके कुल पॉइंट्स</span>
          <span className="text-2xl font-extrabold text-amber-400">{userPoints} Pts</span>
          <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
            {HAS_ENOUGH_POINTS ? '✓ 25 Pts उपलब्ध हैं' : '⚠️ 25 Pts की आवश्यकता है'}
          </span>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-lg space-y-5">
          
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <Palette className="w-5 h-5 text-rose-600" />
            <span>पोस्टर डिज़ाइन टूल</span>
          </h3>

          {/* Title Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              कविता का शीर्षक (Title)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="शीर्षक लिखें..."
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 font-bold"
            />
          </div>

          {/* Poem Content Input with Line Count Limit */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-bold">
              <label className="text-slate-700 dark:text-slate-300">
                कविता की पंक्तियाँ (Poem Content)
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

          {/* Poet Name & Handle */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">कवि का नाम</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">यूज़रनेम</label>
              <input
                type="text"
                value={authorUsername}
                onChange={(e) => setAuthorUsername(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold"
              />
            </div>
          </div>

          {/* Theme Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              थीम व बैकग्राउंड स्टाइल चुनें
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setSelectedTheme('parchment')}
                className={`p-2 rounded-xl text-[11px] font-bold border transition ${
                  selectedTheme === 'parchment' ? 'bg-amber-100 border-rose-600 text-rose-950 ring-2 ring-rose-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                📜 पार्चमेंट
              </button>

              <button
                onClick={() => setSelectedTheme('purple')}
                className={`p-2 rounded-xl text-[11px] font-bold border transition ${
                  selectedTheme === 'purple' ? 'bg-purple-900 border-amber-400 text-white ring-2 ring-purple-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                💜 पर्पल (Hindwi)
              </button>

              <button
                onClick={() => setSelectedTheme('ivory')}
                className={`p-2 rounded-xl text-[11px] font-bold border transition ${
                  selectedTheme === 'ivory' ? 'bg-stone-200 border-slate-900 text-slate-900 ring-2 ring-slate-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                🤍 आइवरी
              </button>

              <button
                onClick={() => setSelectedTheme('dark')}
                className={`p-2 rounded-xl text-[11px] font-bold border transition ${
                  selectedTheme === 'dark' ? 'bg-slate-950 border-rose-500 text-amber-400 ring-2 ring-rose-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                🖤 डार्क
              </button>
            </div>
          </div>

          {/* Highlight Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              येलो मार्कर हाइलाइट जोड़ें (First Stanza)
            </span>
            <input
              type="checkbox"
              checked={highlightFirstStanza}
              onChange={(e) => setHighlightFirstStanza(e.target.checked)}
              className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 cursor-pointer"
            />
          </div>

          {/* Author Image Selector / Custom Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>कवि स्केच या अपनी फोटो अपलोड करें</span>
              <label className="cursor-pointer text-[10px] px-2 py-0.5 rounded bg-rose-600 text-white font-bold hover:bg-rose-700 transition">
                <Upload className="w-3 h-3 inline mr-1" />
                अपलोड
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </label>

            <div className="grid grid-cols-4 gap-2">
              {defaultAuthorSketches.map((sk) => (
                <button
                  key={sk.id}
                  onClick={() => setAuthorImageUrl(sk.url)}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition ${
                    authorImageUrl === sk.url ? 'border-rose-600 ring-2 ring-rose-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={sk.url} alt={sk.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Action Download Button with Points Deduct Status */}
          <button
            onClick={handleGenerateAndDownload}
            disabled={downloading || !HAS_ENOUGH_POINTS || isTextTooLong}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xl transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {HAS_ENOUGH_POINTS ? (
              <>
                <Download className="w-4.5 h-4.5" />
                <span>{downloading ? 'पोस्टर जनरेट हो रहा...' : '4:5 HD इमेज़ डाउनलोड करें (-25 Pts)'}</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-amber-300" />
                <span>25 रिवॉर्ड पॉइंट्स आवश्यक (आपके पास {userPoints} Pts)</span>
              </>
            )}
          </button>

        </div>

        {/* Right Live 4:5 Preview Canvas Container (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col items-center justify-center space-y-4">
          
          <div className="flex items-center justify-between w-full border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-rose-600" />
              <span>लाइव 4:5 पोस्ट प्रिव्यू (Live Instagram 1080×1350)</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 font-extrabold uppercase">
              24px Rounded Frame
            </span>
          </div>

          {/* Canvas Render Element */}
          <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-rose-600/30">
            <canvas 
              ref={canvasRef} 
              className="w-full h-full object-contain"
            />
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center max-w-sm">
            यह पोस्टर 1080×1350 px उच्च गुणवत्ता (HD PNG) में 24px घुमावदार कॉर्नर्स के साथ डाउनलोड होगा।
          </p>

        </div>

      </div>

    </div>
  );
};

export default PosterStudioView;
