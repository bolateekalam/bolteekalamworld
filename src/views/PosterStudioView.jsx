import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Download, Image as ImageIcon, Upload, Check, 
  Palette, Send, Eye,
  LayoutGrid, BookOpen, User, RefreshCw
} from 'lucide-react';

const LAYOUT_ANGLES = [
  { id: 'topHeader', name: '📐 शैली 1: क्लासिक हेडर', desc: 'शीर्ष पर शीर्षक पट्टा, बीच में कविता व नीचे कवि प्रोफाइल' },
  { id: 'bottomCard', name: '📐 शैली 2: कवि कार्ड', desc: 'सेंटर में पंक्तियाँ और नीचे कवि का आधिकारिक पहचान कार्ड' },
  { id: 'royalFrame', name: '📐 शैली 3: रॉयल विंटेज', desc: 'पारंपरिक डबल बॉर्डर, कॉर्नर डिजाइन व शाही मुहर' },
  { id: 'modernDark', name: '📐 शैली 4: डार्क नाइट्स', desc: 'गहरे वेलवेट बैकग्राउंड पर ट्रांसलूसेंट कार्ड डिज़ाइन' }
];

const THEMES = [
  { id: 'parchment', name: '📜 पार्चमेंट रॉयल', bg1: '#fffdf9', bg2: '#fef3c7', border: '#be123c', title: '#881337', text: '#1e293b', brand: '#be123c' },
  { id: 'purple', name: '💜 हिन्दवी पर्पल', bg1: '#3b0764', bg2: '#581c87', border: '#f59e0b', title: '#ffffff', text: '#f3e8ff', brand: '#fbbf24' },
  { id: 'ivory', name: '🤍 क्लासिक आइवरी', bg1: '#fffdfa', bg2: '#f5f5f4', border: '#09090b', title: '#09090b', text: '#27272a', brand: '#e11d48' },
  { id: 'dark', name: '🖤 डार्क वेलवेट', bg1: '#0f172a', bg2: '#020617', border: '#e11d48', title: '#fbbf24', text: '#f8fafc', brand: '#e11d48' },
  { id: 'sage', name: '🌿 विंटेज सेज', bg1: '#f0fdf4', bg2: '#dcfce7', border: '#15803d', title: '#14532d', text: '#166534', brand: '#15803d' },
  { id: 'rose', name: '🌅 सनसेट रोज़', bg1: '#fff1f2', bg2: '#ffe4e6', border: '#e11d48', title: '#9f1239', text: '#4c0519', brand: '#be123c' }
];

const CLASSIC_PRESETS = [
  {
    name: '🍷 मधुशाला (हरिवंश राय बच्चन)',
    title: 'मधुशाला',
    content: 'मदिरालय जाने को घर से चलता है पीनेवाला,\nकिस पथ से जाऊँ? असमंजस में है वह भोलाभाला;\nअलग-अलग पथ बतलाते सब, पर मैं यह बतलाता हूँ—\nराह पकड़ तू एक चला चल, पा जाएगा मधुशाला।'
  },
  {
    name: '🌊 कोशिश करने वालों की कभी हार नहीं होती',
    title: 'कोशिश करने वालों की हार नहीं होती',
    content: 'लहरों से डर कर नौका पार नहीं होती,\nकोशिश करने वालों की कभी हार नहीं होती।\nनन्हीं चींटी जब दाना लेकर चलती है,\nचढ़ती दीवारों पर, सौ बार फिसलती है;\nमन का विश्वास रगों में साहस भरता है,\nचढ़कर गिरना, गिरकर चढ़ना न अखरता है।'
  },
  {
    name: '⚔️ रश्मिरथी (रामधारी सिंह दिनकर)',
    title: 'कृष्ण की चेतावनी',
    content: 'वर्षों तक वन में घूम-घूम,\nबाधा-विघ्नों को चूम-चूम,\nसह धूप-घाम, पानी-पत्थर,\nपांडव आये कुछ और निखर।\nसौभाग्य न सब दिन सोता है,\nदेखें, आगे क्या होता है।'
  }
];

export const PosterStudioView = ({ userProfile, onRewardPoints, onPublishPosterPost, requireAuth }) => {
  const userPoints = userProfile?.points || 0;
  const HAS_25_POINTS = userPoints >= 25;
  const HAS_15_POINTS = userPoints >= 15;

  const fixedAuthorName = userProfile?.name || 'साहित्य साधक';
  const fixedAuthorUsername = (userProfile?.username || '@writer').replace(/^[@#]/, '');
  const activeAvatar = userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
  const authorCity = userProfile?.city || 'प्रयागराज';

  // 1. Initial State MUST BE EMPTY by default
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedAngle, setSelectedAngle] = useState('topHeader');
  const [selectedThemeId, setSelectedThemeId] = useState('parchment');
  const [customPhotoUrl, setCustomPhotoUrl] = useState(null);

  const [downloading, setDownloading] = useState(false);
  const [posting, setPosting] = useState(false);

  const canvasRef = useRef(null);

  const currentTheme = THEMES.find(t => t.id === selectedThemeId) || THEMES[0];
  const effectivePhotoUrl = customPhotoUrl || activeAvatar;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomPhotoUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (e) => {
    const idx = e.target.value;
    if (idx !== '') {
      const preset = CLASSIC_PRESETS[parseInt(idx, 10)];
      if (preset) {
        setTitle(preset.title);
        setContent(preset.content);
      }
    }
  };

  // Canvas Renderer Engine
  const drawPosterCanvas = () => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');

      const { bg1, bg2, border: borderColor, title: titleColor, text: textColor, brand: brandColor } = currentTheme;

      // Fill Background
      ctx.save();
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
      gradient.addColorStop(0, bg1);
      gradient.addColorStop(1, bg2);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1350);

      // Process text
      const isTitleEmpty = !title.trim();
      const isContentEmpty = !content.trim();

      const displayTitle = isTitleEmpty ? '★ आपकी कविता का शीर्षक ★' : title.trim();

      let linesToDraw = [];
      if (isContentEmpty) {
        linesToDraw = [
          '✦ यहाँ अपनी कविता की पंक्तियाँ लिखें ✦',
          'जैसे ही आप बाएँ फ़ॉर्म में टाइप करेंगे,',
          'लाइव इमेज़ पोस्टर तुरंत तैयार हो जाएगा।'
        ];
      } else {
        linesToDraw = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      }

      // Render Photo Circle helper
      const renderPhotoCircle = (x, y, radius, imgObj) => {
        if (!imgObj) return;
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(imgObj, x - radius, y - radius, radius * 2, radius * 2);
        ctx.restore();

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
      };

      const finishCanvas = (userImgObj) => {
        if (selectedAngle === 'topHeader') {
          // ANGLE 1: TOP HEADER
          ctx.fillStyle = brandColor;
          ctx.fillRect(54, 54, 972, 130);

          ctx.textAlign = 'center';
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 50px serif';
          ctx.fillText(displayTitle, 540, 138);

          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 8;
          ctx.strokeRect(54, 54, 972, 1242);

          ctx.textAlign = 'center';
          ctx.fillStyle = isContentEmpty ? 'rgba(120, 120, 120, 0.5)' : textColor;
          ctx.font = isContentEmpty ? 'italic 38px serif' : '44px serif';

          let poemY = 330;
          linesToDraw.forEach(l => {
            ctx.fillText(isContentEmpty ? l : `✦  ${l}  ✦`, 540, poemY);
            poemY += 75;
          });

          const footerY = 1180;
          if (userImgObj) {
            renderPhotoCircle(150, footerY, 65, userImgObj);
            ctx.textAlign = 'left';
            ctx.fillStyle = titleColor;
            ctx.font = 'bold 40px sans-serif';
            ctx.fillText(`✍️ ${fixedAuthorName}`, 240, footerY - 10);
            ctx.fillStyle = textColor;
            ctx.font = '30px sans-serif';
            ctx.fillText(`@${fixedAuthorUsername} • ${authorCity}`, 240, footerY + 30);
          } else {
            ctx.textAlign = 'center';
            ctx.fillStyle = titleColor;
            ctx.font = 'bold 44px sans-serif';
            ctx.fillText(`✍️ ${fixedAuthorName} (@${fixedAuthorUsername})`, 540, footerY);
          }

          ctx.textAlign = 'center';
          ctx.fillStyle = brandColor;
          ctx.font = 'bold 28px sans-serif';
          ctx.fillText('bolateeworld.in — राष्ट्रीय डिजिटल साहित्यिक मंच', 540, 1260);

        } else if (selectedAngle === 'bottomCard') {
          // ANGLE 2: BOTTOM AUTHOR CARD
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 12;
          ctx.strokeRect(40, 40, 1000, 1270);

          ctx.textAlign = 'center';
          ctx.fillStyle = isTitleEmpty ? 'rgba(120, 120, 120, 0.5)' : titleColor;
          ctx.font = 'bold 58px serif';
          ctx.fillText(displayTitle, 540, 160);

          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(300, 200);
          ctx.lineTo(780, 200);
          ctx.stroke();

          ctx.textAlign = 'center';
          ctx.fillStyle = isContentEmpty ? 'rgba(120, 120, 120, 0.5)' : textColor;
          ctx.font = isContentEmpty ? 'italic 38px serif' : '46px serif';
          let poemY = 330;
          linesToDraw.forEach(l => {
            ctx.fillText(isContentEmpty ? l : `" ${l} "`, 540, poemY);
            poemY += 75;
          });

          const cardY = 1040;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fillRect(80, cardY, 920, 200);
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 3;
          ctx.strokeRect(80, cardY, 920, 200);

          if (userImgObj) {
            renderPhotoCircle(170, cardY + 100, 70, userImgObj);
            ctx.textAlign = 'left';
            ctx.fillStyle = titleColor;
            ctx.font = 'bold 42px sans-serif';
            ctx.fillText(fixedAuthorName, 270, cardY + 80);
            ctx.fillStyle = textColor;
            ctx.font = '28px sans-serif';
            ctx.fillText(`@${fixedAuthorUsername} • बोलती कलम प्रमाणित कवि`, 270, cardY + 125);
          } else {
            ctx.textAlign = 'center';
            ctx.fillStyle = titleColor;
            ctx.font = 'bold 44px sans-serif';
            ctx.fillText(`✍️ ${fixedAuthorName}`, 540, cardY + 90);
            ctx.fillStyle = textColor;
            ctx.font = '28px sans-serif';
            ctx.fillText(`@${fixedAuthorUsername} • bolateeworld.in`, 540, cardY + 135);
          }

        } else if (selectedAngle === 'royalFrame') {
          // ANGLE 3: ROYAL PARCHMENT FRAME
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 14;
          ctx.strokeRect(36, 36, 1008, 1278);

          ctx.lineWidth = 4;
          ctx.strokeRect(56, 56, 968, 1238);

          ctx.fillStyle = borderColor;
          ctx.fillRect(56, 56, 40, 40);
          ctx.fillRect(984, 56, 40, 40);
          ctx.fillRect(56, 1254, 40, 40);
          ctx.fillRect(984, 1254, 40, 40);

          ctx.textAlign = 'center';
          ctx.fillStyle = isTitleEmpty ? 'rgba(120, 120, 120, 0.5)' : titleColor;
          ctx.font = 'bold 60px serif';
          ctx.fillText(`❖ ${displayTitle} ❖`, 540, 180);

          ctx.textAlign = 'center';
          ctx.fillStyle = isContentEmpty ? 'rgba(120, 120, 120, 0.5)' : textColor;
          ctx.font = isContentEmpty ? 'italic 38px serif' : '46px serif';
          let poemY = 340;
          linesToDraw.forEach(l => {
            ctx.fillText(isContentEmpty ? l : `✦ ${l} ✦`, 540, poemY);
            poemY += 80;
          });

          const footerY = 1180;
          if (userImgObj) {
            renderPhotoCircle(880, footerY, 65, userImgObj);
          }

          ctx.textAlign = 'left';
          ctx.fillStyle = brandColor;
          ctx.font = 'bold 44px serif';
          ctx.fillText(`✍️ ${fixedAuthorName}`, 90, footerY - 10);
          ctx.fillStyle = textColor;
          ctx.font = '28px sans-serif';
          ctx.fillText(`@${fixedAuthorUsername} | bolateeworld.in`, 90, footerY + 30);

        } else {
          // ANGLE 4: MODERN DARK GLASS
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 6;
          ctx.strokeRect(40, 40, 1000, 1270);

          ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
          ctx.fillRect(70, 70, 940, 1210);

          ctx.textAlign = 'center';
          ctx.fillStyle = isTitleEmpty ? 'rgba(150, 150, 150, 0.5)' : titleColor;
          ctx.font = 'bold 56px sans-serif';
          ctx.fillText(displayTitle, 540, 170);

          ctx.textAlign = 'center';
          ctx.fillStyle = isContentEmpty ? 'rgba(150, 150, 150, 0.5)' : textColor;
          ctx.font = isContentEmpty ? 'italic 38px sans-serif' : '44px sans-serif';
          let poemY = 320;
          linesToDraw.forEach(l => {
            ctx.fillText(l, 540, poemY);
            poemY += 75;
          });

          const footerY = 1160;
          if (userImgObj) {
            renderPhotoCircle(200, footerY, 60, userImgObj);
            ctx.textAlign = 'left';
            ctx.fillStyle = titleColor;
            ctx.font = 'bold 40px sans-serif';
            ctx.fillText(fixedAuthorName, 280, footerY);
            ctx.fillStyle = textColor;
            ctx.font = '26px sans-serif';
            ctx.fillText(`@${fixedAuthorUsername} • bolateeworld.in`, 280, footerY + 35);
          } else {
            ctx.textAlign = 'center';
            ctx.fillStyle = titleColor;
            ctx.font = 'bold 40px sans-serif';
            ctx.fillText(`✍️ ${fixedAuthorName} (@${fixedAuthorUsername})`, 540, footerY);
          }
        }

        ctx.restore();
        resolve(canvas);
      };

      if (effectivePhotoUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => finishCanvas(img);
        img.onerror = () => finishCanvas(null);
        img.src = effectivePhotoUrl;
      } else {
        finishCanvas(null);
      }
    });
  };

  useEffect(() => {
    drawPosterCanvas();
  }, [title, content, selectedAngle, selectedThemeId, effectivePhotoUrl]);

  // Download Handler (-25 Points)
  const handleGenerateAndDownload = async () => {
    if (requireAuth && !requireAuth()) return;

    if (!title.trim() || !content.trim()) {
      alert('कृपया इमेज़ पोस्टर डाउनलोड करने से पहले शीर्षक और कविता की पंक्तियाँ दर्ज करें।');
      return;
    }

    if (!HAS_25_POINTS) {
      alert(`आपके पास केवल ${userPoints} रिवॉर्ड पॉइंट्स हैं। पोस्टर डाउनलोड करने के लिए 25 पॉइंट्स आवश्यक हैं।`);
      return;
    }

    setDownloading(true);
    try {
      const canvas = await drawPosterCanvas();
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `Bolteekalam_Poster_${title.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (onRewardPoints) {
        onRewardPoints(-25, 'कवि पोस्टर डाउनलोड करने पर');
      }

    } catch (e) {
      console.error('Poster download error:', e);
    } finally {
      setDownloading(false);
    }
  };

  // Publish Direct to Feed Handler (-15 Points)
  const handlePublishDirectly = async () => {
    if (requireAuth && !requireAuth()) return;

    if (!title.trim() || !content.trim()) {
      alert('कृपया मंच पर पोस्ट करने से पहले शीर्षक और कविता की पंक्तियाँ दर्ज करें।');
      return;
    }

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
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Studio Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-700 via-rose-800 to-amber-700 text-white shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 font-extrabold text-xs uppercase flex items-center gap-1.5 border border-white/30 shadow">
              <Sparkles className="w-3.5 h-3.5" />
              <span>बोलती कलम पोस्टर Studio 2.0</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-rozha text-amber-100 drop-shadow">
            कवि इमेज़ पोस्टर Studio
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/90 max-w-xl font-tiro leading-relaxed">
            अपनी कविता दर्ज करें और 4 आकर्षक डिज़ाइन शैलियों (Layout Styles) में अपना HD कवि पोस्टर बनाएँ।
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 text-amber-200 text-center shrink-0 z-10 shadow-lg w-full md:w-auto">
          <span className="text-[10px] text-amber-100 uppercase font-bold block">आपके कुल रिवॉर्ड पॉइंट्स</span>
          <span className="text-3xl font-black text-amber-300 drop-shadow">{userPoints} Pts</span>
          <span className="text-[10px] text-emerald-300 font-bold block mt-0.5">
            {HAS_25_POINTS ? '✓ 25 Pts उपलब्ध हैं' : `⚠️ 25 Pts आवश्यक (आपके पास ${userPoints})`}
          </span>
        </div>
      </div>

      {/* Main Grid: Responsive 1-Column on Mobile/Tablet, 2-Column on XL screens */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Controls & Form Inputs */}
        <div className="xl:col-span-7 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-6">
          
          {/* Form Header with Responsive Flex Wrap */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Palette className="w-5 h-5 text-rose-600 shrink-0" />
              <span>पोस्टर कस्टमाइज़ेशन फ़ॉर्म</span>
            </h3>

            {/* Optional Famous Poem Preset Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto max-w-full">
              <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
              <select
                onChange={handleSelectPreset}
                defaultValue=""
                className="w-full sm:w-auto max-w-[240px] truncate px-3 py-1.5 bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="" disabled>प्रसिद्ध कविता (Optional)...</option>
                {CLASSIC_PRESETS.map((p, idx) => (
                  <option key={idx} value={idx}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 1. SELECT LAYOUT ANGLE */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <LayoutGrid className="w-4 h-4 text-rose-600 shrink-0" />
              <span>1. डिज़ाइन शैली चुनें (Select Layout Style)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LAYOUT_ANGLES.map(angle => (
                <button
                  key={angle.id}
                  type="button"
                  onClick={() => setSelectedAngle(angle.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedAngle === angle.id
                      ? 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300 font-bold shadow-md ring-2 ring-rose-500/30'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  <div className="text-xs font-extrabold flex items-center justify-between">
                    <span className="truncate pr-1">{angle.name}</span>
                    {selectedAngle === angle.id && <Check className="w-4 h-4 text-rose-600 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium leading-tight">{angle.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. SELECT COLOR THEME PALETTE */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-rose-600 shrink-0" />
              <span>2. रंग एवं थीम पैलेट (Theme Palette)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedThemeId(t.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-between min-w-0 ${
                    selectedThemeId === t.id
                      ? 'border-rose-500 ring-2 ring-rose-500/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                  style={{ backgroundColor: t.bg2, color: t.title }}
                >
                  <span className="truncate pr-1">{t.name}</span>
                  {selectedThemeId === t.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* 3. TITLE INPUT */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>अपनी कविता का शीर्षक (Title)</span>
              {title.trim() && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">✓ दर्ज हुआ</span>}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="उदा. मेरी नई कविता या सावन का ख़त..."
              className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-extrabold focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* 4. POEM CONTENT TEXTAREA */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>काव्य पंक्तियाँ (Poem Lines)</span>
              {content.trim() && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">✓ दर्ज हुआ</span>}
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="यहाँ अपनी कविता की पंक्तियाँ दर्ज करें..."
              className="w-full p-4 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-tiro leading-relaxed focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* 5. AUTHOR PHOTO & PROFILE IDENTIFICATION */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">कवि प्रोफाइल पहचान</span>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 truncate">✍️ {fixedAuthorName} (@{fixedAuthorUsername})</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={effectivePhotoUrl} alt="Author Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-rose-500 shadow-sm shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{fixedAuthorName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{authorCity}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <label className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1 shadow-xs">
                  <Upload className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>दूसरी फोटो बदलें</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>

                {customPhotoUrl && (
                  <button
                    onClick={() => setCustomPhotoUrl(null)}
                    type="button"
                    className="px-2.5 py-1.5 bg-rose-500/10 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-500/20"
                  >
                    प्रोफाइल फोटो रीसेट करें
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Real-Time Interactive Live Preview */}
        <div className="xl:col-span-5 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4 xl:sticky xl:top-20">
          
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Eye className="w-5 h-5 text-rose-600 shrink-0" />
              <span>लाइव इमेज़ प्रिव्यू (Live Preview)</span>
            </h3>
            <span className="text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full shrink-0">
              1080 × 1350 HD
            </span>
          </div>

          {/* Interactive Live Canvas Holder with Proper Proportional Max Width */}
          <div className="w-full max-w-[420px] mx-auto flex justify-center items-center bg-slate-950/5 dark:bg-slate-950/60 p-2 sm:p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
            <canvas 
              ref={canvasRef} 
              className="w-full h-auto aspect-[4/5] object-contain rounded-xl shadow-lg border border-slate-300 dark:border-slate-700 transition-all duration-200"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleGenerateAndDownload}
              disabled={downloading}
              className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50 text-center leading-snug"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span className="truncate">{downloading ? 'पोस्टर जनरेट हो रहा है...' : 'HD इमेज़ पोस्टर डाउनलोड करें (-25 Pts)'}</span>
            </button>

            <button
              onClick={handlePublishDirectly}
              disabled={posting}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50 text-center leading-snug"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span className="truncate">{posting ? 'प्रकाशित हो रहा है...' : 'सीधे मंच (Feed) पर पोस्ट करें (-15 Pts)'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default PosterStudioView;
