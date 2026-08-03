import React, { useRef, useState } from 'react';
import { Award, Download, Sparkles, X, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

export const CertificateGenerator = ({ isOpen, onClose, certificateData, userPoints = 4890, onOpenCreatePost }) => {
  const { t } = useLanguage();
  const certRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const data = certificateData || {
    recipientName: 'रचनाकार',
    title: 'साहित्य साधक सम्मान',
    category: 'काव्य एवं साहित्य प्रतियोगिता 2026',
    type: 'उत्कृष्टता प्रमाण-पत्र',
    date: '02 अगस्त 2026',
    certificateId: 'BK-CERT-8921',
    requiredPoints: 1000
  };

  const requiredPoints = data.requiredPoints || 1000;
  const isUnlocked = userPoints >= requiredPoints;

  const handleDownloadPDF = async () => {
    if (!certRef.current || !isUnlocked) return;
    setIsGenerating(true);

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });

    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'px', [canvas.width, canvas.height]);
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`BoltiKalam_Certificate_${data.certificateId}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {data.type || 'डिजिटल साहित्य प्रमाण-पत्र'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Container & Lock Overlay */}
        <div className="relative overflow-x-auto p-2">
          
          {!isUnlocked && (
            <div className="absolute inset-0 z-10 bg-slate-950/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-white p-6 text-center space-y-3">
              <div className="p-4 rounded-full bg-rose-600/20 text-rose-500 border border-rose-500/40">
                <Lock className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-amber-300 font-rozha">
                सर्टिफिकेट अनलॉक करने के लिए {requiredPoints.toLocaleString()} Points आवश्यक हैं!
              </h4>
              <p className="text-xs text-slate-300 max-w-md font-tiro">
                आपके वर्तमान पॉइंट्स: <strong>{userPoints.toLocaleString()} pts</strong>। नई रचनाएँ लिखकर, साप्ताहिक चुनौतियों और काव्य संग्राम में भाग लेकर पॉइंट्स अर्जित करें।
              </p>
              <button
                onClick={() => {
                  onClose();
                  if (onOpenCreatePost) onOpenCreatePost();
                }}
                className="mt-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>+ नई रचना लिखकर पॉइंट्स अर्जित करें (+10 Pts)</span>
              </button>
            </div>
          )}

          {/* Certificate Design Canvas */}
          <div 
            ref={certRef}
            className="w-[800px] h-[550px] mx-auto bg-white text-slate-900 p-10 rounded-2xl border-[12px] border-amber-600 shadow-2xl relative flex flex-col justify-between select-none font-tiro"
          >
            {/* Outer Royal Border */}
            <div className="absolute inset-3 border-2 border-amber-500/40 pointer-events-none" />

            {/* Top Brand & Header */}
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-2 text-rose-700 font-rozha text-2xl">
                <Sparkles className="w-6 h-6 text-amber-500" />
                <span>बोलती कलम साहित्य न्यास</span>
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-sans font-bold">
                BOLTI KALAM MULTILINGUAL LITERARY FOUNDATION
              </p>
              <div className="w-32 h-0.5 bg-amber-500 mx-auto mt-2" />
            </div>

            {/* Certificate Title */}
            <div className="text-center space-y-2">
              <h2 className="font-rozha text-3xl text-amber-700 tracking-wide">
                {data.title}
              </h2>
              <p className="text-xs text-slate-600 italic">
                यह प्रमाण-पत्र गर्व एवं सम्मान के साथ प्रदान किया जाता है
              </p>
            </div>

            {/* Recipient Name */}
            <div className="text-center space-y-1 my-2">
              <h1 className="font-rozha text-4xl text-slate-900 underline decoration-amber-500 decoration-2 underline-offset-8">
                {data.recipientName}
              </h1>
              <p className="text-xs text-slate-600 pt-3 max-w-xl mx-auto leading-relaxed">
                को साहित्य, काव्य-सृजन एवं बोलती कलम मंच पर उनके उत्कृष्ट योगदान हेतु <strong>"{data.category}"</strong> के अंतर्गत ससम्मान अलंकृत किया जाता है।
              </p>
            </div>

            {/* Bottom Signatures (Samjera Ji & Akash Kumar Singh) */}
            <div className="flex items-end justify-between border-t border-slate-200 pt-4 text-xs">
              <div className="text-center space-y-1">
                <div className="font-rozha text-sm text-slate-800 font-bold">समजेरा जी</div>
                <div className="text-[10px] text-slate-500 uppercase font-sans font-bold">संस्थापक, बोलती कलम</div>
              </div>

              {/* Gold Seal Center Badge */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-600 text-slate-950 flex flex-col items-center justify-center shadow-lg border-2 border-amber-300">
                <ShieldCheck className="w-7 h-7 text-slate-950" />
                <span className="text-[7px] font-bold font-sans">VERIFIED</span>
              </div>

              <div className="text-center space-y-1">
                <div className="font-rozha text-sm text-slate-800 font-bold">आकाश कुमार सिंह</div>
                <div className="text-[10px] text-slate-500 uppercase font-sans font-bold">प्रमुख, डिजिटल मीडिया</div>
              </div>
            </div>

            {/* Footer Certificate ID */}
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-t border-slate-100 pt-2">
              <span>जारी तिथि: {data.date}</span>
              <span>प्रमाण-पत्र आईडी: {data.certificateId}</span>
            </div>

          </div>

        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            बंद करें
          </button>

          {isUnlocked ? (
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'पीडीएफ तैयार हो रही है...' : 'सर्टिफिकेट डाउनलोड करें (PDF)'}</span>
            </button>
          ) : (
            <span className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-not-allowed">
              <Lock className="w-4 h-4" />
              <span>लॉक्ड (1,000 Points आवश्यक)</span>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

export default CertificateGenerator;
