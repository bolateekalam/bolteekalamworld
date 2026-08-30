import React, { useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Sparkles, X, Download } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const MagazineViewerModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);

  if (!isOpen) return null;

  const totalPages = 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
            <BookOpen className="w-5 h-5" />
            <span>बोलती कलम डिजिटल पत्रिका (मासिक अंक — अगस्त 2026)</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Magazine Page Viewer */}
        <div className="w-full h-[520px] bg-amber-50 text-slate-900 rounded-2xl p-8 relative flex flex-col justify-between shadow-2xl font-tiro border-4 border-amber-600/30 overflow-hidden select-none">
          
          {/* Page 1: Cover */}
          {currentPage === 1 && (
            <div className="h-full flex flex-col items-center justify-between text-center py-6 bg-gradient-to-b from-amber-100 via-amber-50 to-rose-50 rounded-xl p-6 border border-amber-200">
              <span className="px-3 py-1 bg-rose-800 text-amber-100 text-xs font-bold rounded-full uppercase tracking-wider">
                संपादकीय विशेषांक • 01 अगस्त 2026
              </span>
              
              <div className="space-y-3">
                <h1 className="font-rozha text-4xl text-rose-900 font-bold">बोलती कलम E-MAGAZINE</h1>
                <p className="text-sm font-bold text-amber-900 italic">"साहित्य की नई भोर — भारत की सर्वश्रेष्ठ 10 रचनाएँ"</p>
              </div>

              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-amber-500 shadow-xl my-4">
                <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=400" alt="Magazine Cover" className="w-full h-full object-cover" />
              </div>

              <div className="text-xs text-slate-600 font-sans">
                संपादक: अनामिका अंबर | मुख्य संरक्षक: डॉ. कुमार विश्वास
              </div>
            </div>
          )}

          {/* Page 2: Editorial Pick Poem */}
          {currentPage === 2 && (
            <div className="h-full flex flex-col justify-between p-4">
              <div className="flex items-center justify-between border-b border-amber-300 pb-2">
                <span className="text-xs font-bold text-rose-800 uppercase">संपादकीय पसंद (Editorial Pick #1)</span>
                <span className="text-xs text-slate-500">पृष्ठ 02</span>
              </div>
              
              <div className="space-y-4 my-auto text-center">
                <h2 className="font-rozha text-2xl text-rose-900 font-bold">"कोई दीवाना कहता है..."</h2>
                <h4 className="text-sm font-bold text-amber-900 font-sans">— डॉ. कुमार विश्वास</h4>
                
                <p className="text-base text-slate-800 leading-relaxed font-tiro whitespace-pre-line">
                  कोई दीवाना कहता है, कोई पागल समझता है!
                  मगर धरती की बेचैनी को बस बादल समझता है!!
                  मैं तुझसे दूर कैसा हूँ, तू मुझसे दूर कैसी है!
                  ये मेरा दिल समझता है या तेरा दिल समझता है!!
                </p>
              </div>

              <div className="text-center text-[10px] text-slate-500">बोलती कलम मासिक पत्रिका • अगस्त 2026</div>
            </div>
          )}

          {/* Page 3: Ghazal Showcase */}
          {currentPage === 3 && (
            <div className="h-full flex flex-col justify-between p-4">
              <div className="flex items-center justify-between border-b border-amber-300 pb-2">
                <span className="text-xs font-bold text-rose-800 uppercase">ग़ज़ल का मुक़ाम</span>
                <span className="text-xs text-slate-500">पृष्ठ 03</span>
              </div>
              
              <div className="space-y-4 my-auto text-center">
                <h2 className="font-rozha text-2xl text-rose-900 font-bold">"सभी का ख़ून है शामि‍ल..."</h2>
                <h4 className="text-sm font-bold text-amber-900 font-sans">— राहत इंदौरी</h4>
                
                <p className="text-base text-slate-800 leading-relaxed font-tiro whitespace-pre-line">
                  सभी का ख़ून है शामि‍ल यहाँ की मि‍ट्टी में
                  किसी के बाप का हिंदुस्तान थोड़ी है!!
                  जो आज साहिबे-मसनद हैं कल नहीं होंगे
                  किराएदार हैं ज़ाती मकान थोड़ी है!!
                </p>
              </div>

              <div className="text-center text-[10px] text-slate-500">बोलती कलम मासिक पत्रिका • अगस्त 2026</div>
            </div>
          )}

          {/* Page 4: Certificate of E-Publishing */}
          {currentPage === 4 && (
            <div className="h-full flex flex-col justify-between text-center p-6 bg-rose-50/60 rounded-xl border border-amber-300">
              <div className="space-y-2 pt-4">
                <Sparkles className="w-8 h-8 text-amber-600 mx-auto" />
                <h3 className="font-rozha text-2xl text-rose-900 font-bold">ई-मैगज़ीन प्रकाशन प्रमाणपत्र</h3>
                <p className="text-xs text-slate-600">इस अंक में सम्मिलित सभी 10 रचनाकारों को डिजिटल ई-बुक और प्रिंट पब्लिकेशन के लिए सीधे अवसर प्रदान किया गया है।</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-amber-300 shadow-sm text-xs font-sans">
                <strong>Digital Publishing Application:</strong> आप भी अपनी ई-बुक या काव्य संग्रह प्रकाशित कराने हेतु आवेदन कर सकते हैं।
              </div>

              <div className="text-[10px] text-slate-500 font-mono">
                अंक कोड: BK-MAG-2026-AUG | Bolatee Kalam Digital Press
              </div>
            </div>
          )}

        </div>

        {/* Navigation Footer Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>पिछला पृष्ठ</span>
          </button>

          <span className="text-xs text-slate-400 font-bold">
            पृष्ठ {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1"
          >
            <span>अगला पृष्ठ</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default MagazineViewerModal;
