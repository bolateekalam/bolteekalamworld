import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Download, Image as ImageIcon, Upload, Check, 
  AlertCircle, Award, Palette, Type, Feather, Trash2, Send, Eye,
  LayoutGrid, RefreshCw, UserCheck, MapPin
} from 'lucide-react';

const LAYOUT_ANGLES = [
  { id: 'topHeader', name: '📐 एंगल 1: क्लासिक टॉप हेडर', desc: 'ऊपर आकर्षक शीर्षक पट्टा, बीच में कविता और नीचे कवि प्रोफाइल' },
  { id: 'bottomCard', name: '📐 एंगल 2: बॉटम कवि कार्ड', desc: 'सेंटर में कविता पंक्तियाँ और नीचे आधिकारिक कवि पहचान कार्ड' },
  { id: 'royalFrame', name: '📐 एंगल 3: रॉयल विंटेज फ्रेम', desc: 'पारंपरिक डबल बॉर्डर, कॉर्नर डिजाइन और रॉयल मुहर' },
  { id: 'modernDark', name: '📐 एंगल 4: आधुनिक डार्क ग्लास', desc: 'गहरे डार्क बैकग्राउंड पर ट्रांसलूसेंट ग्लास कार्ड डिजाइन' }
];

const THEMES = [
  { id: 'parchment', name: '📜 पार्चमेंट रॉयल', bg1: '#fffdf9', bg2: '#fef3c7', border: '#be123c', title: '#881337', text: '#1e293b', brand: '#be123c', cardBg: 'rgba(254, 243, 199, 0.6)' },
  { id: 'purple', name: '💜 हिन्दवी पर्पल', bg1: '#3b0764', bg2: '#581c87', border: '#f59e0b', title: '#ffffff', text: '#f3e8ff', brand: '#fbbf24', cardBg: 'rgba(58, 7, 100, 0.7)' },
  { id: 'ivory', name: '🤍 क्लासिक आइवरी', bg1: '#fffdfa', bg2: '#f5f5f4', border: '#09090b', title: '#09090b', text: '#27272a', brand: '#e11d48', cardBg: 'rgba(245, 245, 244, 0.7)' },
  { id: 'dark', name: '🖤 डार्क वेलवेट', bg1: '#0f172a', bg2: '#020617', border: '#e11d48', title: '#fbbf24', text: '#f8fafc', brand: '#e11d48', cardBg: 'rgba(15, 23, 42, 0.8)' },
  { id: 'sage', name: '🌿 विंटेज सेज', bg1: '#f0fdf4', bg2: '#dcfce7', border: '#15803d', title: '#14532d', text: '#166534', brand: '#15803d', cardBg: 'rgba(220, 252, 231, 0.7)' },
  { id: 'rose', name: '🌅 सनसेट रोज़', bg1: '#fff1f2', bg2: '#ffe4e6', border: '#e11d48', title: '#9f1239', text: '#4c0519', brand: '#be123c', cardBg: 'rgba(255, 228, 230, 0.7)' }
];

const SAMPLE_POEMS = [
  {
    title: 'चलो फिर से मुस्कुराएँ',
    content: 'उदासियों की चादर को उतार फेंको आज,\nचलो फिर से खुशियों के साज़ छेड़ते हैं।\nजिंदगी का हर पल अनमोल है दोस्तों,\nआओ मिलकर उम्मीदों के चिराग़ जलाते हैं।'
  },
  {
    title: 'कलम की आवाज़',
    content: 'स्याही में घुलती हैं दिल की तरंगें,\nकागज़ पर उतरती हैं अधूरी उमंगें।\nशब्द जब बनते हैं भावना का दर्पण,\nतब निखरता है काव्य का सच्चा अर्पण।'
  }
];

export const PosterStudioView = ({ userProfile, onRewardPoints, onPublishPosterPost, requireAuth, setActiveView }) => {
  const userPoints = userProfile?.points || 0;
  const HAS_25_POINTS = userPoints >= 25;
  const HAS_15_POINTS = userPoints >= 15;

  const fixedAuthorName = userProfile?.name || 'साहित्य साधक';
  const fixedAuthorUsername = (userProfile?.username || '@writer').replace(/^[@#]/, '');
  const authorAvatar = userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
  const authorCity = userProfile?.city || 'प्रयागराज';

  const [title, setTitle] = useState(SAMPLE_POEMS[0].title);
  const [content, setContent] = useState(SAMPLE_POEMS[0].content);
  const [selectedAngle, setSelectedAngle] = useState('topHeader');
  const [selectedThemeId, setSelectedThemeId] = useState('parchment');
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState(authorAvatar);

  const [downloading, setDownloading] = useState(false);
  const [posting, setPosting] = useState(false);

  const canvasRef = useRef(null);

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

  const handleFillSample = () => {
    const randomPoem = SAMPLE_POEMS[Math.floor(Math.random() * SAMPLE_POEMS.length)];
    setTitle(randomPoem.title);
    setContent(randomPoem.content);
  };

  // Canvas Renderer Engine with 4 Angle Layout Engines
  const drawPosterCanvas = () => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');

      const { bg1, bg2, border: borderColor, title: titleColor, text: textColor, brand: brandColor } = currentTheme;

      // 1. Fill Background
      ctx.save();
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
      gradient.addColorStop(0, bg1);
      gradient.addColorStop(1, bg2);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1350);

      // Process lines
      const rawLines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      const linesToDraw = rawLines.length > 0 ? rawLines : ['यहाँ अपनी काव्य पंक्तियाँ लिखें...'];

      // Function to render photo
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
        // Render according to selected Angle Layout
        if (selectedAngle === 'topHeader') {
          // ANGLE 1: CLASSIC TOP HEADER
          ctx.fillStyle = brandColor;
          ctx.fillRect(54, 54, 972, 130);

          ctx.textAlign = 'center';
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 50px serif';
          ctx.fillText(title.trim() || '★ शीर्षक ★', 540, 138);

          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 8;
          ctx.strokeRect(54, 54, 972, 1242);

          ctx.textAlign = 'center';
          ctx.fillStyle = textColor;
          ctx.font = '44px serif';

          let poemY = 320;
          linesToDraw.forEach(l => {
            ctx.fillText(`✦  ${l}  ✦`, 540, poemY);
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
          ctx.fillStyle = titleColor;
          ctx.font = 'bold 58px serif';
          ctx.fillText(title.trim() || '★ काव्य रचना ★', 540, 160);

          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(300, 200);
          ctx.lineTo(780, 200);
          ctx.stroke();

          ctx.textAlign = 'center';
          ctx.fillStyle = textColor;
          ctx.font = '46px serif';
          let poemY = 320;
          linesToDraw.forEach(l => {
            ctx.fillText(`" ${l} "`, 540, poemY);
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
          ctx.fillStyle = titleColor;
          ctx.font = 'bold 60px serif';
          ctx.fillText(`❖ ${title.trim() || 'रचना'} ❖`, 540, 180);

          ctx.textAlign = 'center';
          ctx.fillStyle = textColor;
          ctx.font = '46px serif';
          let poemY = 330;
          linesToDraw.forEach(l => {
            ctx.fillText(`✦ ${l} ✦`, 540, poemY);
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
          ctx.fillStyle = titleColor;
          ctx.font = 'bold 56px sans-serif';
          ctx.fillText(title.trim() || 'कविता संग्रह', 540, 170);

          ctx.textAlign = 'center';
          ctx.fillStyle = textColor;
          ctx.font = '44px sans-serif';
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

      if (uploadedPhotoUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => finishCanvas(img);
        img.onerror = () => finishCanvas(null);
        img.src = uploadedPhotoUrl;
      } else {
        finishCanvas(null);
      }
    });
  };

  useEffect(() => {
    drawPosterCanvas();
  }, [title, content, selectedAngle, selectedThemeId, uploadedPhotoUrl]);

  const handleGenerateAndDownload = async () => {
    if (requireAuth && !requireAuth()) return;

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
            विभिन्न डिज़ाइन एंगल्स और थीम्स में अपनी कविता का खूबसूरत HD पोस्टर तैयार करें व डाउनलोड करें।
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

      {/* Main Grid: Left Controls, Right Live Interactive Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Controls & Form Inputs */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Palette className="w-5 h-5 text-rose-600" />
              <span>पोस्टर कस्टमाइज़ेशन फ़ॉर्म</span>
            </h3>
            <button
              onClick={handleFillSample}
              type="button"
              className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>नमूना कविता भरें</span>
            </button>
          </div>

          {/* 1. SELECT LAYOUT ANGLE */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <LayoutGrid className="w-4 h-4 text-rose-600" />
              <span>1. डिज़ाइन एंगल / लेआउट चुनें (Choose Layout Angle)</span>
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
                    <span>{angle.name}</span>
                    {selectedAngle === angle.id && <Check className="w-4 h-4 text-rose-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">{angle.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. SELECT COLOR THEME PALETTE */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-rose-600" />
              <span>2. रंग एवं थीम पैलेट (Theme Palette)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedThemeId(t.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                    selectedThemeId === t.id
                      ? 'border-rose-500 ring-2 ring-rose-500/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                  style={{ backgroundColor: t.bg2, color: t.title }}
                >
                  <span>{t.name}</span>
                  {selectedThemeId === t.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* 3. TITLE INPUT */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
              कविता / रचना का शीर्षक (Title)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="अपनी कविता का शीर्षक लिखें..."
              className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-extrabold focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* 4. POEM CONTENT TEXTAREA */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
              काव्य पंक्तियाँ (Poem Lines)
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="यहाँ अपनी कविता की पंक्तियाँ लिखें..."
              className="w-full p-4 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-tiro leading-relaxed focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* 5. AUTHOR PHOTO UPLOAD & CREATOR DETAILS */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>कवि फ़ोटो एवं प्रोफाइल पहचान</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">✍️ {fixedAuthorName}</span>
            </label>

            <div className="flex items-center gap-4 flex-wrap">
              {uploadedPhotoUrl ? (
                <div className="relative group">
                  <img src={uploadedPhotoUrl} alt="Poet Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-rose-500 shadow-sm" />
                  <button
                    onClick={() => setUploadedPhotoUrl(null)}
                    className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-0.5 shadow hover:scale-110 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-100 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-rose-600" />
                  <span>अपनी फ़ोटो अपलोड करें</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}

              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                शहर: <strong>{authorCity}</strong> | हैंडल: <strong>@{fixedAuthorUsername}</strong>
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Real-Time Interactive Live Preview */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 lg:sticky lg:top-20">
          
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Eye className="w-5 h-5 text-rose-600" />
              <span>लाइव इमेज़ प्रिव्यू (Live Preview)</span>
            </h3>
            <span className="text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full">
              1080 × 1350 HD
            </span>
          </div>

          {/* Interactive Live Canvas Holder */}
          <div className="w-full flex justify-center items-center bg-slate-950/5 dark:bg-slate-950/60 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
            <canvas 
              ref={canvasRef} 
              className="w-full h-auto max-h-[500px] object-contain rounded-xl shadow-lg border border-slate-300 dark:border-slate-700 transition-all duration-200"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleGenerateAndDownload}
              disabled={downloading}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'पोस्टर जनरेट हो रहा है...' : 'HD इमेज़ पोस्टर डाउनलोड करें (-25 Pts)'}</span>
            </button>

            <button
              onClick={handlePublishDirectly}
              disabled={posting}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-2xl shadow flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{posting ? 'प्रकाशित हो रहा है...' : 'सीधे मंच (Feed) पर पोस्ट करें (-15 Pts)'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default PosterStudioView;
