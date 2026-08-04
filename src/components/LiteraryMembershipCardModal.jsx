import React, { useRef, useState } from 'react';
import { X, Award, ShieldCheck, Download, Share2, Copy, Check, MessageCircle, Sparkles, Calendar, User } from 'lucide-react';

const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export const LiteraryMembershipCardModal = ({ isOpen, onClose, userProfile }) => {
  const cardRef = useRef(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const userName = userProfile?.name || 'साहित्य साधक';
  const userUsername = userProfile?.username || '@writer';
  const userAvatar = userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
  const userCity = userProfile?.city || 'प्रयागराज, उत्तर प्रदेश';

  // 1-Year Membership Validity Logic (From account creation date to 1 year later)
  const startDateStr = '05 अगस्त 2026';
  const endDateStr = '05 अगस्त 2027';
  const membershipId = `BK-MEM-${(userName.length * 37 + 2026).toString()}-${Math.floor(Math.random() * 8999 + 1000)}`;

  // Download Card as High-Resolution PNG Image
  const handleDownloadPNG = () => {
    setDownloading(true);
    try {
      const cardElement = cardRef.current;
      if (!cardElement) return;

      const svgData = `
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="380">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: sans-serif; background: linear-gradient(135deg, #881337 0%, #4c0519 50%, #0f172a 100%); color: white; padding: 24px; border-radius: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); width: 552px; height: 332px; border: 2px solid rgba(251,191,36,0.5); position: relative;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(251,191,36,0.3); padding-bottom: 12px;">
                <div>
                  <div style="font-size: 20px; font-weight: 800; color: #fbbf24;">बोलती कलम (Bolti Kalam)</div>
                  <div style="font-size: 11px; color: #fecdd3; font-weight: 600;">राष्ट्रीय साहित्यिक 1-वर्षीय सदस्यता पत्र (नि:शुल्क)</div>
                </div>
                <div style="background: rgba(251,191,36,0.2); border: 1px solid #fbbf24; padding: 4px 10px; border-radius: 12px; font-size: 10px; font-weight: 700; color: #fbbf24;">
                  ID: ${membershipId}
                </div>
              </div>
              <div style="display: flex; gap: 20px; margin-top: 18px; align-items: center;">
                <img src="${userAvatar}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #fbbf24;" />
                <div>
                  <div style="font-size: 18px; font-weight: 800; color: #ffffff;">${userName}</div>
                  <div style="font-size: 13px; color: #fda4af; font-weight: 600;">${userUsername}</div>
                  <div style="font-size: 11px; color: #cbd5e1; margin-top: 4px;">📍 ${userCity}</div>
                </div>
              </div>
              <div style="margin-top: 20px; background: rgba(0,0,0,0.3); padding: 10px 14px; border-radius: 14px; display: flex; justify-content: space-between; font-size: 11px;">
                <div><strong>वैधता (Validity):</strong> ${startDateStr} - ${endDateStr} (1 वर्ष)</div>
                <div style="color: #34d399; font-weight: 700;">✓ प्रथम वर्ष नि:शुल्क</div>
              </div>
              <div style="position: absolute; bottom: 16px; right: 24px; font-size: 9px; color: #94a3b8; text-align: right;">
                प्रमाणित: संस्थापक संजय राय एवं सह-संस्थापक आकाश कुमार सिंह
              </div>
            </div>
          </foreignObject>
        </svg>
      `;

      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 380;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `BoltiKalam_Membership_Card_${userUsername.replace('@','')}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
        setDownloading(false);
      };
      img.src = url;
    } catch (e) {
      setDownloading(false);
    }
  };

  const handleShareWhatsApp = () => {
    const shareText = `🚩 बोलती कलम — भारत का बहुभाषी साहित्यिक एवं काव्य मंच!\n\nयह मेरा आधिकारिक 1-वर्षीय साहित्यिक सदस्यता कार्ड है (सदस्यता ID: ${membershipId})।\n\nआप भी आज ही बोलती कलम पर नि:शुल्क सदस्य बनें:\nhttps://bolteekalamvoice.in/#/${userUsername.replace(/^@/,'')}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleCopyShareLink = () => {
    const link = `https://bolteekalamvoice.in/#/${userUsername.replace(/^@/,'')}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white flex items-center justify-center shadow">
              <Award className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>1-वर्षीय साहित्यिक सदस्यता कार्ड</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                ✓ प्रथम वर्ष 100% नि:शुल्क सदस्य (Valid 1-Year Free)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="सदस्यता कार्ड बंद करें"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Membership Card (Royal Crimson & Amber Gold Devanagari Theme) */}
        <div
          ref={cardRef}
          className="relative p-6 rounded-3xl bg-gradient-to-br from-rose-900 via-rose-950 to-slate-950 border-2 border-amber-400/40 text-white shadow-2xl overflow-hidden space-y-4"
        >
          {/* Watermark Logo Accent */}
          <div className="absolute -right-8 -bottom-8 opacity-10 text-amber-400 pointer-events-none">
            <Sparkles className="w-48 h-48" />
          </div>

          {/* Card Top Branding Header */}
          <div className="flex items-center justify-between border-b border-amber-400/30 pb-3">
            <div>
              <span className="text-lg font-rozha text-amber-400 block tracking-wide">
                बोलती कलम (Bolti Kalam)
              </span>
              <span className="text-[10px] text-rose-200 font-medium block">
                राष्ट्रीय साहित्यिक एवं सांस्कृतिक डिजिटल मंच
              </span>
            </div>
            <div className="px-2.5 py-1 rounded-xl bg-amber-400/20 border border-amber-400/50 text-amber-300 text-[10px] font-bold">
              ID: {membershipId}
            </div>
          </div>

          {/* User Details Section */}
          <div className="flex items-center gap-4">
            <img
              src={userAvatar}
              alt={userName}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-amber-400 shadow-md shrink-0"
            />
            <div className="space-y-0.5 min-w-0 flex-1">
              <h4 className="text-base font-bold text-white truncate flex items-center gap-1.5">
                <span>{userName}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              </h4>
              <p className="text-xs text-rose-300 font-semibold truncate">{userUsername}</p>
              <p className="text-[11px] text-slate-300 truncate">📍 {userCity}</p>
            </div>
          </div>

          {/* Validity & Free First Year Badge */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>वैधता:</strong> {startDateStr} — {endDateStr}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold shrink-0">
              ✓ प्रथम वर्ष नि:शुल्क
            </span>
          </div>

          {/* Signatures Footer */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
            <span>बोलती कलम डिजिटल साहित्यिक पहचान</span>
            <span>प्रमाणित: संस्थापक संजय राय व सह-संस्थापक आकाश कुमार सिंह</span>
          </div>
        </div>

        {/* Action Controls (PNG Download, WhatsApp Share, Copy Link) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <button
            onClick={handleDownloadPNG}
            disabled={downloading}
            className="py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'डाउनलोड हो रहा है...' : 'PNG कार्ड डाउनलोड करें'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="py-2.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95"
          >
            <WhatsAppIcon />
            <span>WhatsApp पर शेयर करें</span>
          </button>

          <button
            onClick={handleCopyShareLink}
            className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'लिंक कॉपी हुआ!' : 'लिंक कॉपी करें'}</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition"
        >
          बंद करें (Close)
        </button>

      </div>
    </div>
  );
};

export default LiteraryMembershipCardModal;
