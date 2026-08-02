import React, { useRef, useState } from 'react';
import { Cake, Download, Sparkles, X, Heart, Award } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

export const BirthdayCardModal = ({ isOpen, onClose, birthdayUser }) => {
  const cardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const user = birthdayUser || {
    name: 'लोकेश शर्मा',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    city: 'जयपुर',
    date: '02 अगस्त 2026'
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 }
    });

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#4c0519',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [imgWidth, imgHeight]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`BoltiKalam_Birthday_Wish_${user.name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-base">
            <Cake className="w-5 h-5 animate-pulse text-amber-500" />
            <span>जन्मदिन शुभकामना पत्र (Birthday Card)</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Canvas Container */}
        <div className="flex justify-center p-1">
          <div 
            ref={cardRef}
            className="w-[360px] h-[520px] bg-gradient-to-b from-rose-900 via-rose-950 to-slate-950 text-white p-6 rounded-3xl border-4 border-amber-400 shadow-2xl relative flex flex-col justify-between text-center select-none overflow-hidden"
          >
            {/* Top Header Badge */}
            <div className="pt-1">
              <span className="px-3 py-1 bg-amber-400 text-slate-950 rounded-full font-bold text-[11px] uppercase tracking-wider shadow-md">
                बोलती कलम परिवार • शुभकामना संदेश
              </span>
            </div>

            {/* Profile Avatar & Greeting Text */}
            <div className="space-y-3 my-auto">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto ring-4 ring-amber-400 shadow-2xl">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>

              <h2 className="font-rozha text-2xl text-amber-200">{user.name}</h2>
              <p className="text-xs text-rose-200 font-semibold">{user.city} • {user.date}</p>

              <div className="w-20 h-0.5 bg-amber-400/80 mx-auto my-2" />

              <p className="font-tiro text-xs text-slate-100 leading-relaxed max-w-xs mx-auto italic px-2">
                "आपकी कलम से यूं ही साहित्य के अनमोल दीपक जलते रहें। बोलती कलम परिवार की ओर से आपको जन्मदिन की अनंत मंगलकामनाएं एवं ढेरों बधाइयां!"
              </p>
            </div>

            {/* Bottom Seal & Patron Signatures (Samjera Ji & Akash Kumar Singh) */}
            <div className="pt-3 border-t border-rose-800/80 flex items-center justify-between px-1 text-[9px] text-rose-200">
              <span className="font-semibold">संस्थापक: समजेरा जी</span>
              <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow shrink-0">
                <Cake className="w-3 h-3 text-slate-950" />
              </div>
              <span className="font-semibold">डिजिटल मीडिया: आकाश कुमार सिंह</span>
            </div>

          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleDownloadCard}
            disabled={isDownloading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>{isDownloading ? 'पीडीएफ तैयार हो रही है...' : 'कार्ड डाउनलोड करें (PDF/Image)'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default BirthdayCardModal;
