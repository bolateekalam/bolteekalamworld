import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Download, Upload, Check, 
  Palette, Send, Eye, X,
  LayoutGrid, BookOpen, Share2, Smartphone, 
  Monitor, Square, Flame, RefreshCw, Feather
} from 'lucide-react';

// 1. Aspect Ratio Formats (Canva-like multi-format support)
const ASPECT_RATIOS = [
  { id: '4:5', name: '📸 4:5 (इंस्टाग्राम / फ़ीड)', width: 1080, height: 1350, icon: Monitor, desc: 'Instagram & Facebook Feed' },
  { id: '9:16', name: '📱 9:16 (व्हाट्सएप स्टेटस / स्टोरी)', width: 1080, height: 1920, icon: Smartphone, desc: 'WhatsApp Status & Insta Story' },
  { id: '1:1', name: '⏹️ 1:1 (क्लासिक स्क्वायर)', width: 1080, height: 1080, icon: Square, desc: 'Square Post & DP' }
];

// 2. 6 Distinct Poetic Layout Styles
const LAYOUT_STYLES = [
  { 
    id: 'janmashtami', 
    name: '🪈 जन्माष्टमी विशेषांक (28 अगस्त)', 
    badge: '🚩 28 अगस्त विशेषांक', 
    desc: 'मोरपंख, बांसुरी मुहर, दिव्य स्वर्ण बॉर्डर और भक्ति रस वाइब्स' 
  },
  { 
    id: 'royalParchment', 
    name: '📜 रॉयल विंटेज पार्चमेंट', 
    badge: 'शाही काव्य शैली', 
    desc: 'पारंपरिक डबल बॉर्डर, कॉर्नर नक्काशी, कलम-दवात मुहर' 
  },
  { 
    id: 'darkVelvet', 
    name: '🖤 डार्क वेलवेट शायरी', 
    badge: 'ग़ज़ल व शायरी', 
    desc: 'गहरे नीले/काले बैकग्राउंड पर गोल्डेन ट्रांसलूसेंट कार्ड' 
  },
  { 
    id: 'sunsetRose', 
    name: '🌅 सनसेट रोज़ / रोमैंटिक', 
    badge: 'भावुक व प्रेम', 
    desc: 'गुलाबी-गोल्डन सॉफ्ट ग्रेडिएंट, मॉडर्न मिनिमल टाइपोग्राफी' 
  },
  { 
    id: 'patriotic', 
    name: '🇮🇳 राष्ट्र गौरव / तिरंगा', 
    badge: 'देशभक्ति विशेष', 
    desc: 'केसरिया-श्वेत-हरा बॉर्डर, राष्ट्रभक्ति काव्य के लिए सर्वोत्तम' 
  },
  { 
    id: 'vintageSage', 
    name: '🌿 विंटेज सेज / सावन', 
    badge: 'सावन & प्रकृति', 
    desc: 'हरित सौम्य पृष्ठभूमि, प्रकृति व सावन छंदों के लिए उत्तम' 
  }
];

// 3. Color Palettes
const THEMES = [
  { 
    id: 'krishnaGold', 
    name: '🪈 कृष्ण नील & स्वर्ण', 
    bg1: '#071630', 
    bg2: '#0b2545', 
    cardBg: 'rgba(7, 22, 48, 0.75)', 
    border: '#f59e0b', 
    title: '#fbbf24', 
    text: '#f8fafc', 
    brand: '#f59e0b',
    badgeBg: '#f59e0b',
    badgeText: '#0f172a'
  },
  { 
    id: 'parchment', 
    name: '📜 पार्चमेंट रॉयल', 
    bg1: '#fffdf9', 
    bg2: '#fef3c7', 
    cardBg: 'rgba(255, 253, 249, 0.85)', 
    border: '#be123c', 
    title: '#881337', 
    text: '#1e293b', 
    brand: '#be123c',
    badgeBg: '#be123c',
    badgeText: '#ffffff'
  },
  { 
    id: 'darkVelvet', 
    name: '🖤 डार्क वेलवेट', 
    bg1: '#0f172a', 
    bg2: '#020617', 
    cardBg: 'rgba(15, 23, 42, 0.8)', 
    border: '#e11d48', 
    title: '#fbbf24', 
    text: '#f8fafc', 
    brand: '#e11d48',
    badgeBg: '#e11d48',
    badgeText: '#ffffff'
  },
  { 
    id: 'purpleHindvi', 
    name: '💜 हिन्दवी पर्पल', 
    bg1: '#2e1065', 
    bg2: '#3b0764', 
    cardBg: 'rgba(46, 16, 101, 0.75)', 
    border: '#fbbf24', 
    title: '#ffffff', 
    text: '#f3e8ff', 
    brand: '#fbbf24',
    badgeBg: '#fbbf24',
    badgeText: '#2e1065'
  },
  { 
    id: 'sunsetRose', 
    name: '🌅 सनसेट रोज़', 
    bg1: '#fff1f2', 
    bg2: '#ffe4e6', 
    cardBg: 'rgba(255, 241, 242, 0.9)', 
    border: '#e11d48', 
    title: '#9f1239', 
    text: '#4c0519', 
    brand: '#be123c',
    badgeBg: '#be123c',
    badgeText: '#ffffff'
  },
  { 
    id: 'vintageSage', 
    name: '🌿 विंटेज सेज', 
    bg1: '#f0fdf4', 
    bg2: '#dcfce7', 
    cardBg: 'rgba(240, 253, 244, 0.85)', 
    border: '#15803d', 
    title: '#14532d', 
    text: '#166534', 
    brand: '#15803d',
    badgeBg: '#15803d',
    badgeText: '#ffffff'
  },
  { 
    id: 'tiranga', 
    name: '🇮🇳 राष्ट्र तिरंगा', 
    bg1: '#fff7ed', 
    bg2: '#f0fdf4', 
    cardBg: 'rgba(255, 255, 255, 0.92)', 
    border: '#ea580c', 
    title: '#c2410c', 
    text: '#0f172a', 
    brand: '#15803d',
    badgeBg: '#ea580c',
    badgeText: '#ffffff'
  }
];

// 4. Quick Presets (Including Janmashtami & Classic Hindi Sahitya)
const CLASSIC_PRESETS = [
  {
    name: '🪈 श्रीकृष्ण जन्माष्टमी विशेषांक (28 अगस्त)',
    title: 'कान्हा की मुरली',
    style: 'janmashtami',
    theme: 'krishnaGold',
    content: 'अधर धर मुरली बजावे कान्हा,\nनटखट यशोदा को नंदलाला;\nबंसी की धुन पे सब जग डोले,\nप्रेम रस बरसे मधुराई का प्याला।'
  },
  {
    name: '🪷 राधा-कृष्ण प्रेम (भक्ति रस)',
    title: 'प्रेम की पराकाष्ठा',
    style: 'janmashtami',
    theme: 'krishnaGold',
    content: 'राधा बिन कान्हा आधे,\nकान्हा बिन राधा सूनी;\nजिसने जाना प्रेम अलौकिक,\nउसकी भक्ति हो गई दूनी।'
  },
  {
    name: '⚔️ कृष्ण की चेतावनी (रामधारी सिंह दिनकर)',
    title: 'कृष्ण की चेतावनी',
    style: 'royalParchment',
    theme: 'parchment',
    content: 'वर्षों तक वन में घूम-घूम,\nबाधा-विघ्नों को चूम-चूम,\nसह धूप-घाम, पानी-पत्थर,\nपांडव आये कुछ और निखर।\nसौभाग्य न सब दिन सोता है,\nदेखें, आगे क्या होता है।'
  },
  {
    name: '🍷 मधुशाला (हरिवंश राय बच्चन)',
    title: 'मधुशाला',
    style: 'darkVelvet',
    theme: 'darkVelvet',
    content: 'मदिरालय जाने को घर से चलता है पीनेवाला,\nकिस पथ से जाऊँ? असमंजस में है वह भोलाभाला;\nअलग-अलग पथ बतलाते सब, पर मैं यह बतलाता हूँ—\nराह पकड़ तू एक चला चल, पा जाएगा मधुशाला।'
  },
  {
    name: '🌊 कोशिश करने वालों की कभी हार नहीं होती',
    title: 'कोशिश करने वालों की हार नहीं होती',
    style: 'royalParchment',
    theme: 'parchment',
    content: 'लहरों से डर कर नौका पार नहीं होती,\nकोशिश करने वालों की कभी हार नहीं होती।\nनन्हीं चींटी जब दाना लेकर चलती है,\nचढ़ती दीवारों पर, सौ बार फिसलती है;\nमन का विश्वास रगों में साहस भरता है,\nचढ़कर गिरना, गिरकर चढ़ना न अखरता है।'
  },
  {
    name: '🌧️ सावन की फुहार (मानसून काव्य)',
    title: 'सावन का ख़त',
    style: 'vintageSage',
    theme: 'vintageSage',
    content: 'सावन की पहली फुहार ने यादें जगा दीं,\nमिट्टी की सौंधी खुशबू ने बहारें लुटा दीं;\nदूर किसी कोने में बैठी वो याद तुम्हारी,\nभीगी आँखों में फिर से मुस्कान खिला दी।'
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

  // 1. Core State
  const [aspectRatioId, setAspectRatioId] = useState('4:5');
  const [selectedStyle, setSelectedStyle] = useState('janmashtami');
  const [selectedThemeId, setSelectedThemeId] = useState('krishnaGold');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [customPhotoUrl, setCustomPhotoUrl] = useState(null);

  // 2. Modals & Actions
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [sharing, setSharing] = useState(false);

  const canvasRef = useRef(null);

  const currentTheme = THEMES.find(t => t.id === selectedThemeId) || THEMES[0];
  const currentRatio = ASPECT_RATIOS.find(r => r.id === aspectRatioId) || ASPECT_RATIOS[0];
  const effectivePhotoUrl = customPhotoUrl || activeAvatar;

  // Auto-switch theme when style changes to provide best preset look
  const handleStyleSelect = (styleId) => {
    setSelectedStyle(styleId);
    if (styleId === 'janmashtami') setSelectedThemeId('krishnaGold');
    else if (styleId === 'royalParchment') setSelectedThemeId('parchment');
    else if (styleId === 'darkVelvet') setSelectedThemeId('darkVelvet');
    else if (styleId === 'sunsetRose') setSelectedThemeId('sunsetRose');
    else if (styleId === 'patriotic') setSelectedThemeId('tiranga');
    else if (styleId === 'vintageSage') setSelectedThemeId('vintageSage');
  };

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
        if (preset.style) setSelectedStyle(preset.style);
        if (preset.theme) setSelectedThemeId(preset.theme);
      }
    }
  };

  // Canvas Renderer Engine (Multi-Aspect Ratio & Rich Styling)
  const drawPosterCanvas = () => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current || document.createElement('canvas');
      const width = currentRatio.width;
      const height = currentRatio.height;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      const { bg1, bg2, border: borderColor, title: titleColor, text: textColor, brand: brandColor, badgeBg, badgeText } = currentTheme;

      // Fill Gradient Background
      ctx.save();
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, bg1);
      gradient.addColorStop(1, bg2);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const isTitleEmpty = !title.trim();
      const isContentEmpty = !content.trim();

      const displayTitle = isTitleEmpty ? '★ आपकी रचना का शीर्षक ★' : title.trim();

      let linesToDraw = [];
      if (isContentEmpty) {
        linesToDraw = [
          '✦ यहाँ अपनी कविता की पंक्तियाँ लिखें ✦',
          'फ़ॉर्म भरने के बाद प्रिव्यू देखें बटन दबाएँ,',
          'आपका HD इमेज़ पोस्टर तुरंत तैयार हो जाएगा।'
        ];
      } else {
        linesToDraw = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      }

      // Helper: Render Photo Circle
      const renderPhotoCircle = (x, y, radius, imgObj) => {
        if (!imgObj) return;
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(imgObj, x - radius, y - radius, radius * 2, radius * 2);
        ctx.restore();

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
      };

      // Helper: Draw Ornate Double Borders & Corner Flourishes
      const drawOrnateBorder = (margin = 40) => {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 10;
        ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

        ctx.lineWidth = 3;
        const innerMargin = margin + 14;
        ctx.strokeRect(innerMargin, innerMargin, width - innerMargin * 2, height - innerMargin * 2);

        // Corner square flourishes
        const cornerSize = 28;
        ctx.fillStyle = borderColor;
        ctx.fillRect(innerMargin, innerMargin, cornerSize, cornerSize);
        ctx.fillRect(width - innerMargin - cornerSize, innerMargin, cornerSize, cornerSize);
        ctx.fillRect(innerMargin, height - innerMargin - cornerSize, cornerSize, cornerSize);
        ctx.fillRect(width - innerMargin - cornerSize, height - innerMargin - cornerSize, cornerSize, cornerSize);
      };

      const finishCanvas = (userImgObj) => {
        const centerX = width / 2;
        const isTall = currentRatio.id === '9:16';
        const isSquare = currentRatio.id === '1:1';

        if (selectedStyle === 'janmashtami') {
          // STYLE 1: JANMASTHAMI SPECIAL
          drawOrnateBorder(36);

          // Top Janmashtami Special Badge
          const badgeY = isTall ? 120 : (isSquare ? 90 : 100);
          ctx.fillStyle = badgeBg || '#f59e0b';
          const badgeW = 620;
          const badgeH = 64;
          ctx.beginPath();
          ctx.roundRect(centerX - badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, 32);
          ctx.fill();
          ctx.fillStyle = badgeText || '#0f172a';
          ctx.font = 'bold 30px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🚩 श्रीकृष्ण जन्माष्टमी विशेषांक 2026 🪈', centerX, badgeY + 10);

          // Title
          const titleY = isTall ? 250 : (isSquare ? 190 : 210);
          ctx.fillStyle = titleColor;
          ctx.font = 'bold 56px serif';
          ctx.textAlign = 'center';
          ctx.fillText(`❖ ${displayTitle} ❖`, centerX, titleY);

          // Decorative divider line
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(centerX - 240, titleY + 30);
          ctx.lineTo(centerX + 240, titleY + 30);
          ctx.stroke();

          // Poem Content Lines
          let poemStartY = isTall ? 440 : (isSquare ? 320 : 360);
          const lineSpacing = isTall ? 85 : (isSquare ? 65 : 75);
          ctx.fillStyle = textColor;
          ctx.font = isContentEmpty ? 'italic 38px serif' : '44px serif';
          ctx.textAlign = 'center';

          linesToDraw.forEach(line => {
            ctx.fillText(isContentEmpty ? line : `✦ ${line} ✦`, centerX, poemStartY);
            poemStartY += lineSpacing;
          });

          // Footer & Author Badge
          const footerY = height - (isTall ? 220 : 160);
          if (userImgObj) {
            renderPhotoCircle(170, footerY, 65, userImgObj);
            ctx.textAlign = 'left';
            ctx.fillStyle = titleColor;
            ctx.font = 'bold 42px sans-serif';
            ctx.fillText(`✍️ ${fixedAuthorName}`, 260, footerY - 8);
            ctx.fillStyle = textColor;
            ctx.font = '28px sans-serif';
            ctx.fillText(`@${fixedAuthorUsername} • ${authorCity}`, 260, footerY + 32);
          } else {
            ctx.textAlign = 'center';
            ctx.fillStyle = titleColor;
            ctx.font = 'bold 44px sans-serif';
            ctx.fillText(`✍️ ${fixedAuthorName} (@${fixedAuthorUsername})`, centerX, footerY);
          }

          // Watermark URL
          ctx.textAlign = 'center';
          ctx.fillStyle = brandColor;
          ctx.font = 'bold 26px sans-serif';
          ctx.fillText('bolateeworld.in — राष्ट्रीय डिजिटल साहित्यिक मंच', centerX, height - (isTall ? 90 : 60));

        } else if (selectedStyle === 'royalParchment') {
          // STYLE 2: ROYAL PARCHMENT
          drawOrnateBorder(40);

          const titleY = isTall ? 220 : (isSquare ? 160 : 180);
          ctx.textAlign = 'center';
          ctx.fillStyle = titleColor;
          ctx.font = 'bold 58px serif';
          ctx.fillText(displayTitle, centerX, titleY);

          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(centerX - 200, titleY + 30);
          ctx.lineTo(centerX + 200, titleY + 30);
          ctx.stroke();

          let poemY = isTall ? 420 : (isSquare ? 300 : 340);
          const lineGap = isTall ? 85 : (isSquare ? 65 : 75);
          ctx.fillStyle = textColor;
          ctx.font = '44px serif';
          ctx.textAlign = 'center';
          linesToDraw.forEach(l => {
            ctx.fillText(`" ${l} "`, centerX, poemY);
            poemY += lineGap;
          });

          const footerY = height - (isTall ? 200 : 150);
          if (userImgObj) {
            renderPhotoCircle(centerX, footerY - 50, 60, userImgObj);
            ctx.textAlign = 'center';
            ctx.fillStyle = titleColor;
            ctx.font = 'bold 38px sans-serif';
            ctx.fillText(`✍️ ${fixedAuthorName}`, centerX, footerY + 35);
            ctx.fillStyle = textColor;
            ctx.font = '26px sans-serif';
            ctx.fillText(`@${fixedAuthorUsername} • bolateeworld.in`, centerX, footerY + 70);
          } else {
            ctx.textAlign = 'center';
            ctx.fillStyle = titleColor;
            ctx.font = 'bold 42px sans-serif';
            ctx.fillText(`✍️ ${fixedAuthorName} (@${fixedAuthorUsername})`, centerX, footerY);
            ctx.fillStyle = textColor;
            ctx.font = '26px sans-serif';
            ctx.fillText('bolateeworld.in — साहित्य साधक मंच', centerX, footerY + 45);
          }

        } else if (selectedStyle === 'darkVelvet') {
          // STYLE 3: DARK VELVET SHAYARI
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 6;
          ctx.strokeRect(40, 40, width - 80, height - 80);

          // Translucent Glass Card
          const cardMargin = 70;
          ctx.fillStyle = currentTheme.cardBg || 'rgba(15, 23, 42, 0.8)';
          ctx.beginPath();
          ctx.roundRect(cardMargin, cardMargin, width - cardMargin * 2, height - cardMargin * 2, 30);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 2;
          ctx.stroke();

          const titleY = isTall ? 230 : (isSquare ? 170 : 190);
          ctx.textAlign = 'center';
          ctx.fillStyle = titleColor;
          ctx.font = 'bold 54px sans-serif';
          ctx.fillText(`✨ ${displayTitle} ✨`, centerX, titleY);

          let poemY = isTall ? 440 : (isSquare ? 310 : 350);
          const lineGap = isTall ? 85 : (isSquare ? 65 : 75);
          ctx.fillStyle = textColor;
          ctx.font = '44px sans-serif';
          ctx.textAlign = 'center';
          linesToDraw.forEach(l => {
            ctx.fillText(l, centerX, poemY);
            poemY += lineGap;
          });

          const footerY = height - (isTall ? 210 : 160);
          if (userImgObj) {
            renderPhotoCircle(180, footerY, 65, userImgObj);
            ctx.textAlign = 'left';
            ctx.fillStyle = titleColor;
            ctx.font = 'bold 40px sans-serif';
            ctx.fillText(fixedAuthorName, 270, footerY - 5);
            ctx.fillStyle = textColor;
            ctx.font = '28px sans-serif';
            ctx.fillText(`@${fixedAuthorUsername} • बोलती कलम प्रमाणित`, 270, footerY + 35);
          } else {
            ctx.textAlign = 'center';
            ctx.fillStyle = titleColor;
            ctx.font = 'bold 42px sans-serif';
            ctx.fillText(`✍️ ${fixedAuthorName} (@${fixedAuthorUsername})`, centerX, footerY);
          }

        } else if (selectedStyle === 'patriotic') {
          // STYLE 4: PATRIOTIC TRICOLOR
          ctx.strokeStyle = '#ea580c';
          ctx.lineWidth = 12;
          ctx.strokeRect(36, 36, width - 72, height - 72);

          ctx.strokeStyle = '#15803d';
          ctx.lineWidth = 4;
          ctx.strokeRect(52, 52, width - 104, height - 104);

          // Top Tiranga Emblem
          const badgeY = isTall ? 120 : (isSquare ? 90 : 100);
          ctx.fillStyle = '#ea580c';
          ctx.beginPath();
          ctx.roundRect(centerX - 240, badgeY - 30, 480, 60, 30);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 28px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🇮🇳 राष्ट्र गौरव विशेषांक 🇮🇳', centerX, badgeY + 10);

          const titleY = isTall ? 250 : (isSquare ? 180 : 210);
          ctx.fillStyle = '#c2410c';
          ctx.font = 'bold 56px serif';
          ctx.fillText(displayTitle, centerX, titleY);

          let poemY = isTall ? 440 : (isSquare ? 310 : 360);
          ctx.fillStyle = textColor;
          ctx.font = '44px serif';
          linesToDraw.forEach(l => {
            ctx.fillText(`✦ ${l} ✦`, centerX, poemY);
            poemY += 75;
          });

          const footerY = height - (isTall ? 200 : 150);
          if (userImgObj) {
            renderPhotoCircle(170, footerY, 65, userImgObj);
            ctx.textAlign = 'left';
            ctx.fillStyle = '#c2410c';
            ctx.font = 'bold 40px sans-serif';
            ctx.fillText(`✍️ ${fixedAuthorName}`, 260, footerY - 5);
            ctx.fillStyle = '#15803d';
            ctx.font = '28px sans-serif';
            ctx.fillText(`@${fixedAuthorUsername} • bolateeworld.in`, 260, footerY + 35);
          } else {
            ctx.textAlign = 'center';
            ctx.fillStyle = '#c2410c';
            ctx.font = 'bold 42px sans-serif';
            ctx.fillText(`✍️ ${fixedAuthorName} (@${fixedAuthorUsername})`, centerX, footerY);
          }

        } else {
          // STYLE 5 & 6: SUNSET ROSE / VINTAGE SAGE
          drawOrnateBorder(40);

          const titleY = isTall ? 220 : (isSquare ? 160 : 180);
          ctx.textAlign = 'center';
          ctx.fillStyle = titleColor;
          ctx.font = 'bold 56px serif';
          ctx.fillText(displayTitle, centerX, titleY);

          let poemY = isTall ? 420 : (isSquare ? 300 : 340);
          ctx.fillStyle = textColor;
          ctx.font = '44px serif';
          linesToDraw.forEach(l => {
            ctx.fillText(l, centerX, poemY);
            poemY += 75;
          });

          const footerY = height - (isTall ? 200 : 150);
          if (userImgObj) {
            renderPhotoCircle(centerX, footerY - 45, 60, userImgObj);
            ctx.textAlign = 'center';
            ctx.fillStyle = titleColor;
            ctx.font = 'bold 38px sans-serif';
            ctx.fillText(fixedAuthorName, centerX, footerY + 40);
            ctx.fillStyle = textColor;
            ctx.font = '26px sans-serif';
            ctx.fillText(`@${fixedAuthorUsername} • bolateeworld.in`, centerX, footerY + 75);
          } else {
            ctx.textAlign = 'center';
            ctx.fillStyle = titleColor;
            ctx.font = 'bold 42px sans-serif';
            ctx.fillText(`✍️ ${fixedAuthorName} (@${fixedAuthorUsername})`, centerX, footerY);
            ctx.fillStyle = textColor;
            ctx.font = '26px sans-serif';
            ctx.fillText('bolateeworld.in', centerX, footerY + 45);
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
    if (showPreviewModal) {
      drawPosterCanvas();
    }
  }, [title, content, selectedStyle, selectedThemeId, aspectRatioId, effectivePhotoUrl, showPreviewModal]);

  const handleOpenPreview = async () => {
    if (!title.trim() || !content.trim()) {
      alert('कृपया इमेज़ पोस्टर का प्रिव्यू देखने से पहले शीर्षक और अपनी कविता की पंक्तियाँ दर्ज करें।');
      return;
    }
    setShowPreviewModal(true);
    setTimeout(() => {
      drawPosterCanvas();
    }, 100);
  };

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
      link.download = `Bolteekalam_${selectedStyle}_${title.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (onRewardPoints) {
        onRewardPoints(-25, 'कवि पोस्टर डाउनलोड करने पर');
      }

      setShowPreviewModal(false);
    } catch (e) {
      console.error('Poster download error:', e);
    } finally {
      setDownloading(false);
    }
  };

  // WhatsApp & Web Share Handler
  const handleShareToWhatsApp = async () => {
    setSharing(true);
    try {
      const canvas = await drawPosterCanvas();
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setSharing(false);
          return;
        }

        const file = new File([blob], `BoltiKalam_Poster.png`, { type: 'image/png' });
        const shareText = `✍️ "${title}" - ${fixedAuthorName}\n\nबोलती कलम (bolateeworld.in) पर मेरा यह कवि पोस्टर देखें और अपनी रचनाएँ साझा करें! 🌸`;

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: title || 'कवि पोस्टर',
              text: shareText
            });
            setSharing(false);
            return;
          } catch (err) {
            console.log('Share canceled or fallback to link share');
          }
        }

        // Direct WhatsApp Web Fallback
        const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\nhttps://bolateeworld.in')}`;
        window.open(waUrl, '_blank');
        setSharing(false);
      }, 'image/png');

    } catch (e) {
      console.error('Share error:', e);
      setSharing(false);
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

      setShowPreviewModal(false);
    } catch (e) {
      console.error('Poster publish error:', e);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Studio Banner (Janmashtami Highlight) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-amber-700 text-white shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>कवि पोस्टर Studio 3.0 (Canva Lite)</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-blue-600/80 backdrop-blur-md text-amber-200 font-bold text-[11px] border border-amber-300/40">
              🪈 28 अगस्त जन्माष्टमी स्पेशल
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-rozha text-amber-100 drop-shadow">
            कवि इमेज़ पोस्टर Studio
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/90 max-w-xl font-tiro leading-relaxed">
            10 सेकंड में जन्माष्टमी, ग़ज़ल, पार्चमेंट व तिरंगा शैलियों में अपना HD कवि पोस्टर बनाएँ व WhatsApp पर शेयर करें।
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

      {/* Main Studio Customizer Card */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-xl space-y-6">
        
        {/* Header & Quick Preset Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>पोस्टर डिज़ाइन व कस्टमाइज़ेशन</span>
          </h3>

          {/* Quick Presets (Janmashtami + Famous Hindi Poems) */}
          <div className="flex items-center gap-2 w-full sm:w-auto max-w-full">
            <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
            <select
              onChange={handleSelectPreset}
              defaultValue=""
              className="w-full sm:w-auto max-w-[260px] truncate px-3 py-2 bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="" disabled>✨ 1-क्लिक रेडीमेड कविता / छंद...</option>
              {CLASSIC_PRESETS.map((p, idx) => (
                <option key={idx} value={idx}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 1. ASPECT RATIO SELECTOR (Canva Multi-format) */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <LayoutGrid className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>1. पोस्टर का साइज़ / आकार चुनें (Select Aspect Ratio)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {ASPECT_RATIOS.map(ratio => {
              const IconComponent = ratio.icon;
              return (
                <button
                  key={ratio.id}
                  type="button"
                  onClick={() => setAspectRatioId(ratio.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    aspectRatioId === ratio.id
                      ? 'bg-indigo-500/10 border-indigo-600 text-indigo-700 dark:text-indigo-300 font-bold ring-2 ring-indigo-500/30 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${aspectRatioId === ratio.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-extrabold flex items-center justify-between">
                      <span className="truncate">{ratio.name}</span>
                      {aspectRatioId === ratio.id && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{ratio.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. SELECT DESIGN STYLE */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>2. लेआउट शैली चुनें (Select Poetic Style)</span>
            </span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">6 प्रीमियम शैलियाँ</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {LAYOUT_STYLES.map(style => (
              <button
                key={style.id}
                type="button"
                onClick={() => handleStyleSelect(style.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  selectedStyle === style.id
                    ? 'bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-300 font-bold shadow-md ring-2 ring-amber-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="text-xs font-extrabold flex items-center justify-between">
                  <span className="truncate pr-1">{style.name}</span>
                  {selectedStyle === style.id && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium leading-tight">{style.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 3. COLOR PALETTE */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-rose-600 shrink-0" />
            <span>3. रंग एवं थीम पैलेट (Theme Palette)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {THEMES.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedThemeId(t.id)}
                className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-between min-w-0 ${
                  selectedThemeId === t.id
                    ? 'border-indigo-500 ring-2 ring-indigo-500/40 shadow-sm'
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

        {/* 4. TITLE & CONTENT */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>अपनी रचना का शीर्षक (Title) <span className="text-rose-600">*</span></span>
              {title.trim() && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">✓ दर्ज हुआ</span>}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="उदा. कान्हा की मुरली या सावन की फुहार..."
              className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-extrabold focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>काव्य पंक्तियाँ (Poem Lines) <span className="text-rose-600">*</span></span>
              {content.trim() && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">✓ दर्ज हुआ</span>}
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="यहाँ अपनी कविता, ग़ज़ल या दोहा दर्ज करें..."
              className="w-full p-4 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-tiro leading-relaxed focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* 5. AUTHOR PHOTO & IDENTIFICATION */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">कवि प्रोफाइल & वॉटरमार्क</span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate">✍️ {fixedAuthorName} (@{fixedAuthorUsername})</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src={effectivePhotoUrl} alt="Author Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 shadow-sm shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{fixedAuthorName}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{authorCity} • bolateeworld.in</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <label className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1 shadow-xs">
                <Upload className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>दूसरी फोटो बदलें</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              {customPhotoUrl && (
                <button
                  onClick={() => setCustomPhotoUrl(null)}
                  type="button"
                  className="px-2.5 py-1.5 bg-rose-500/10 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-500/20"
                >
                  रीसेट करें
                </button>
              )}
            </div>
          </div>
        </div>

        {/* MAIN CTA BUTTON: Open HD Poster Preview */}
        <div className="pt-2">
          <button
            onClick={handleOpenPreview}
            type="button"
            className="w-full py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-amber-600 hover:from-blue-800 hover:to-amber-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-indigo-950/30 flex items-center justify-center gap-2 transition transform active:scale-98 cursor-pointer"
          >
            <Eye className="w-5 h-5 shrink-0" />
            <span>✨ तैयार HD पोस्टर का प्रिव्यू देखें (Preview Poster)</span>
          </button>
        </div>

      </div>

      {/* FULL-SCREEN / SLIDE-UP HD POSTER PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 my-auto relative max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                    आपका तैयार HD कवि पोस्टर
                  </h3>
                  <span className="text-[10px] text-slate-500 font-bold">{currentRatio.name}</span>
                </div>
              </div>
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* HD Canvas Render Box */}
            <div className="w-full flex justify-center items-center bg-slate-950/10 dark:bg-slate-950/60 p-2 sm:p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
              <canvas 
                ref={canvasRef} 
                className="w-full h-auto max-h-[480px] object-contain rounded-xl shadow-xl border border-slate-300 dark:border-slate-700"
              />
            </div>

            {/* Modal Actions: WhatsApp Share, Download & Post */}
            <div className="space-y-2.5 pt-1">
              
              {/* WhatsApp 1-Click Direct Share */}
              <button
                onClick={handleShareToWhatsApp}
                disabled={sharing}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer text-center"
              >
                <Share2 className="w-4 h-4 shrink-0" />
                <span>{sharing ? 'शेयर हो रहा है...' : '📲 WhatsApp पर सीधे शेयर करें (Direct Share)'}</span>
              </button>

              {/* HD Download Button */}
              <button
                onClick={handleGenerateAndDownload}
                disabled={downloading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50 text-center"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>{downloading ? 'पोस्टर डाउनलोड हो रहा है...' : '📥 HD इमेज डाउनलोड करें (-25 Pts)'}</span>
              </button>

              {/* Publish Directly to Bolti Kalam Feed */}
              <button
                onClick={handlePublishDirectly}
                disabled={posting}
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50 text-center"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>{posting ? 'प्रकाशित हो रहा है...' : '🚀 सीधे मंच (Feed) पर पोस्ट करें (-15 Pts)'}</span>
              </button>

              <button
                onClick={() => setShowPreviewModal(false)}
                type="button"
                className="w-full py-2 text-slate-600 dark:text-slate-400 font-bold text-xs hover:underline text-center cursor-pointer"
              >
                ✏️ वापस जाकर फ़ॉर्म संपादित करें
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default PosterStudioView;
