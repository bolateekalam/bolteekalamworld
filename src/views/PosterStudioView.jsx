import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Download, Upload, Check, 
  Palette, Send, Eye, X,
  LayoutGrid, BookOpen, Share2, Smartphone, 
  Monitor, Square, Flame, RefreshCw, Feather, CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

// 1. Aspect Ratio Formats
const ASPECT_RATIOS = [
  { id: '9:16', name: '📱 9:16 (व्हाट्सएप स्टेटस / स्टोरी)', width: 1080, height: 1920, icon: Smartphone, desc: 'WhatsApp Status & Story' },
  { id: '4:5', name: '📸 4:5 (इंस्टाग्राम / फ़ीड)', width: 1080, height: 1350, icon: Monitor, desc: 'Instagram & Facebook Feed' },
  { id: '1:1', name: '⏹️ 1:1 (स्क्वायर)', width: 1080, height: 1080, icon: Square, desc: 'Square Post & DP' }
];

// 2. 6 Distinct Poetic Layout Styles
const LAYOUT_STYLES = [
  { 
    id: 'royalParchment', 
    name: '📜 रॉयल विंटेज पार्चमेंट', 
    desc: 'शाही काव्य शैली, पारंपरिक डबल बॉर्डर, कलम-दवात मुहर' 
  },
  { 
    id: 'darkVelvet', 
    name: '🖤 डार्क वेलवेट शायरी', 
    desc: 'गहरे नीले/काले बैकग्राउंड पर गोल्डेन ट्रांसलूसेंट कार्ड' 
  },
  { 
    id: 'sunsetRose', 
    name: '🌅 सनसेट रोज़ / रोमैंटिक', 
    desc: 'गुलाबी-गोल्डन सॉफ्ट ग्रेडिएंट, मॉडर्न मिनिमल टाइपोग्राफी' 
  },
  { 
    id: 'krishnaGold', 
    name: '🪈 कृष्ण नील & स्वर्ण', 
    desc: 'मोरपंख, दिव्य स्वर्ण बॉर्डर और भक्ति रस वाइब्स' 
  },
  { 
    id: 'patriotic', 
    name: '🇮🇳 राष्ट्र गौरव / तिरंगा', 
    desc: 'केसरिया-श्वेत-हरा बॉर्डर, राष्ट्रभक्ति काव्य के लिए सर्वोत्तम' 
  },
  { 
    id: 'vintageSage', 
    name: '🌿 विंटेज सेज / प्रकृति', 
    desc: 'हरित सौम्य पृष्ठभूमि, प्रकृति व शांत रस छंदों के लिए उत्तम' 
  }
];

// 3. Color Palettes
const THEMES = [
  { 
    id: 'darkVelvet', 
    name: '🖤 डार्क वेलवेट', 
    bg1: '#0f172a', 
    bg2: '#020617', 
    cardBg: 'rgba(15, 23, 42, 0.85)', 
    border: '#e11d48', 
    title: '#fbbf24', 
    text: '#f8fafc' 
  },
  { 
    id: 'parchment', 
    name: '📜 पार्चमेंट रॉयल', 
    bg1: '#fffdf9', 
    bg2: '#fef3c7', 
    cardBg: 'rgba(255, 253, 249, 0.9)', 
    border: '#be123c', 
    title: '#881337', 
    text: '#1e293b' 
  },
  { 
    id: 'krishnaGold', 
    name: '🪈 कृष्ण नील & स्वर्ण', 
    bg1: '#071630', 
    bg2: '#0b2545', 
    cardBg: 'rgba(7, 22, 48, 0.85)', 
    border: '#f59e0b', 
    title: '#fbbf24', 
    text: '#f8fafc' 
  },
  { 
    id: 'purpleHindvi', 
    name: '💜 हिन्दवी पर्पल', 
    bg1: '#2e1065', 
    bg2: '#3b0764', 
    cardBg: 'rgba(46, 16, 101, 0.85)', 
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

// 4. Sample Presets
const CLASSIC_PRESETS = [
  {
    name: '🪶 अज्ञेय — दुख सबको मांजता है',
    title: 'दुख सबको मांजता है',
    content: 'दुख सबको मांजता है\nऔर चाहे सबको मुक्ति देना न जाने\nकिन्तु जिनको मांजता है\nउन्हें यह सीख देता है\nकि सबको मुक्त रखें।'
  },
  {
    name: '💖 ग़ज़ल — हवाओं में बहक जाने की ख्वाहिश',
    title: 'ख्वाहिश',
    content: 'हवाओं में बहक जाने की ख्वाहिश अब नहीं रहती,\nतेरी महफ़िल से बेहतर कोई वीराना नहीं मिलता।\nजिन्हें हम ढूंढते थे शहर की तन्हा गलियों में,\nवो अफ़साने किताबों के सिवा कहीं नहीं मिलते।'
  },
  {
    name: '🇮🇳 दिनकर — कलम आज उनकी जय बोल',
    title: 'कलम, आज उनकी जय बोल',
    content: 'जला अस्थियाँ बारी-बारी\nचिटकाई जिनमें चिंगारी,\nजो चढ़ गये पुण्यवेदी पर\nलिए बिना गर्दन का मोल\nकलम, आज उनकी जय बोल!'
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
  const [aspectRatioId, setAspectRatioId] = useState('9:16');
  const [selectedStyle, setSelectedStyle] = useState('darkVelvet');
  const [selectedThemeId, setSelectedThemeId] = useState('darkVelvet');
  
  const [title, setTitle] = useState('चाँदनी रात का सन्नाटा');
  const [content, setContent] = useState('जब खामोशियों से बातें होने लगीं,\nतो समझ आया कि लफ्ज़ कितने बेबस थे।\nरात की ओस ने जब छुआ पत्तों को,\nसारे दर्द हवाओं में घुल गए।');
  
  const [userPhoto, setUserPhoto] = useState(null);
  const [includeAuthorPhoto, setIncludeAuthorPhoto] = useState(true);
  const [fontSizeRatio, setFontSizeRatio] = useState('medium');
  
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const liveCanvasRef = useRef(null);

  const fixedAuthorName = userProfile?.name || currentUser?.name || 'कवि साहित्य साधक';
  const fixedAuthorUsername = userProfile?.username || currentUser?.username || 'kavi';
  const authorAvatarUrl = userProfile?.avatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';

  const currentRatio = ASPECT_RATIOS.find(r => r.id === aspectRatioId) || ASPECT_RATIOS[0];
  const currentTheme = THEMES.find(t => t.id === selectedThemeId) || THEMES[0];

  // Draw Poster Function
  const generatePosterCanvas = () => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const width = currentRatio.width;
      const height = currentRatio.height;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // 1. Draw Background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, currentTheme.bg1);
      bgGrad.addColorStop(1, currentTheme.bg2);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Borders
      ctx.strokeStyle = currentTheme.border;
      ctx.lineWidth = 8;
      ctx.strokeRect(36, 36, width - 72, height - 72);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.strokeRect(48, 48, width - 96, height - 96);

      // 3. Brand Header
      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 36px serif';
      ctx.textAlign = 'center';
      ctx.fillText('बोलती कलम • bolateeworld.in', width / 2, 120);

      // 4. Title
      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 56px serif';
      ctx.fillText(title || 'शीर्षक', width / 2, 240);

      // Separator Line
      ctx.strokeStyle = currentTheme.border;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 180, 275);
      ctx.lineTo(width / 2 + 180, 275);
      ctx.stroke();

      // 5. Poetry Lines
      const lines = (content || '').split('\n');
      ctx.fillStyle = currentTheme.text;
      
      const isLargeFont = fontSizeRatio === 'large';
      ctx.font = isLargeFont ? '44px serif' : '38px serif';
      const lineGap = isLargeFont ? 80 : 70;
      
      let startY = 390;
      lines.forEach((line) => {
        if (line.trim()) {
          ctx.fillText(line, width / 2, startY);
          startY += lineGap;
        }
      });

      // 6. Poet Credentials Card
      const footerY = height - 180;
      ctx.fillStyle = currentTheme.cardBg;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 360, footerY - 60, 720, 130, 25);
      ctx.fill();
      ctx.strokeStyle = currentTheme.border;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = currentTheme.title;
      ctx.font = 'bold 36px serif';
      ctx.fillText('✍️ ' + fixedAuthorName, width / 2, footerY - 5);

      ctx.fillStyle = currentTheme.text;
      ctx.font = '22px sans-serif';
      ctx.fillText('@' + fixedAuthorUsername + ' • प्रमाणित डिजिटल साहित्यकार', width / 2, footerY + 35);

      resolve(canvas);
    });
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
  }, [aspectRatioId, selectedStyle, selectedThemeId, title, content, fontSizeRatio, includeAuthorPhoto, userPhoto]);

  // Handle HD Download
  const handleDownload = async () => {
    if (!title.trim() || !content.trim()) {
      alert('कृपया शीर्षक और पंक्तियाँ दर्ज करें!');
      return;
    }
    setDownloading(true);
    try {
      const canvas = await generatePosterCanvas();
      const link = document.createElement('a');
      link.download = 'BoltiKalam_Poster_' + Date.now() + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      try {
        confetti({
          particleCount: 60,
          spread: 70,
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
    setSharing(true);
    try {
      const canvas = await generatePosterCanvas();
      const shareText = '📜 bolateeworld.in पर मेरा नया कवि पोस्टर: "' + title + '" by ' + fixedAuthorName;
      
      canvas.toBlob(async (blob) => {
        if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], 'poster.png', { type: 'image/png' })] })) {
          try {
            await navigator.share({
              files: [new File([blob], 'poster.png', { type: 'image/png' })],
              title: title,
              text: shareText
            });
            setSharing(false);
            return;
          } catch (e) {}
        }
        window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(shareText + '\nhttps://bolateeworld.in'), '_blank');
        setSharing(false);
      }, 'image/png');
    } catch (e) {
      setSharing(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Studio Header Banner */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>कवि पोस्टर Studio 3.0</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black font-rozha text-amber-200">
            कवि इमेज़ पोस्टर बनाएं
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-serif">
            अपनी रचना को खूबसूरत HD पोस्टर में बदलें और WhatsApp स्टेटस या Instagram पर साझा करें।
          </p>
        </div>

        {/* 1-Click Preset Dropdown */}
        <div className="w-full sm:w-auto shrink-0">
          <select
            onChange={(e) => {
              const p = CLASSIC_PRESETS[e.target.value];
              if (p) {
                setTitle(p.title);
                setContent(p.content.replace(/\\n/g, '\n'));
              }
            }}
            defaultValue=""
            className="w-full sm:w-auto px-4 py-2.5 bg-indigo-900/60 border border-indigo-400/40 rounded-2xl text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
          >
            <option value="" disabled>✨ रेडीमेड प्रसिद्ध कविता चुनें...</option>
            {CLASSIC_PRESETS.map((p, idx) => (
              <option key={idx} value={idx}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2-Column Split Layout: Editor on Left, Live Canvas Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Form & Design Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
          
          {/* Ratio Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <LayoutGrid className="w-4 h-4 text-indigo-600" />
              <span>1. पोस्टर साइज़ चुनें (Aspect Ratio)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ASPECT_RATIOS.map(ratio => (
                <button
                  key={ratio.id}
                  onClick={() => setAspectRatioId(ratio.id)}
                  className={'p-2.5 rounded-2xl border text-center text-xs font-bold transition cursor-pointer ' + (
                    aspectRatioId === ratio.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                  )}
                >
                  <span className="block truncate">{ratio.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Palette */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-rose-600" />
              <span>2. रंग एवं थीम पैलेट (Theme Palette)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedThemeId(t.id)}
                  className={'p-2 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-between ' + (
                    selectedThemeId === t.id
                      ? 'border-amber-500 ring-2 ring-amber-500/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700'
                  )}
                  style={{ backgroundColor: t.bg2, color: t.title }}
                >
                  <span className="truncate pr-1">{t.name}</span>
                  {selectedThemeId === t.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
              रचना का शीर्षक (Title)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="अपनी रचना का शीर्षक..."
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Poetry Content Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>कविता / शायरी की पंक्तियाँ (Poetry Lines)</span>
              <span className="text-[10px] text-slate-400">लाइन ब्रेक (Enter) के साथ लिखें</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="यहाँ अपनी सुंदर पंक्तियाँ लिखें..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-tiro text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Font Size Toggle */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">फॉन्ट साइज़</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSizeRatio('medium')}
                className={'px-3 py-1 rounded-xl text-xs font-bold ' + (fontSizeRatio === 'medium' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600')}
              >
                मध्यम (Medium)
              </button>
              <button
                onClick={() => setFontSizeRatio('large')}
                className={'px-3 py-1 rounded-xl text-xs font-bold ' + (fontSizeRatio === 'large' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600')}
              >
                बड़ा (Large)
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Real-time Live Canvas Preview & Actions (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4 text-center">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-emerald-500" />
              <span>लाइव पोस्टर प्रिव्यू (Live Preview)</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">1080x{currentRatio.height}px HD</span>
          </div>

          {/* Preview Image Container */}
          <div className="relative mx-auto rounded-2xl overflow-hidden shadow-lg border border-slate-300 dark:border-slate-700 bg-slate-950 flex items-center justify-center max-h-[460px]">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Poster Preview" 
                className="w-auto h-auto max-h-[440px] object-contain rounded-xl"
              />
            ) : (
              <div className="p-12 text-slate-400 text-xs font-bold">
                पोस्टर तैयार हो रहा है...
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'डाउनलोड हो रहा है...' : '📥 HD पोस्टर डाउनलोड करें (Free PNG)'}</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              disabled={sharing}
              className="w-full py-2.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 font-bold rounded-2xl text-xs border border-emerald-300 dark:border-emerald-800/60 shadow-sm flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>📲 WhatsApp स्टेटस पर साझा करें</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default PosterStudioView;
