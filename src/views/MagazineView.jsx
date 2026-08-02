import React from 'react';
import { BookOpen, Sparkles, Download, Eye, Calendar, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const MagazineView = ({ onOpenMagazine }) => {
  const { t } = useLanguage();

  const editions = [
    {
      id: 'mag-aug-2026',
      title: 'बोलती कलम - स्वतंत्रता एवं सावन विशेषांक 2026',
      month: 'अगस्त 2026',
      cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
      description: 'देशभक्ति रचनाएँ, सावन के गीत, प्रख्यात साहित्यकारों के साक्षात्कार एवं 50 नवोदित रचनाकारों की चुनिंदा कृतियाँ।',
      pages: 48,
      reads: 3420
    },
    {
      id: 'mag-july-2026',
      title: 'बोलती कलम - वर्षा ऋतु अंक',
      month: 'जुलाई 2026',
      cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=400',
      description: 'प्रकृति, वर्षा एवं अंतर्मन की अनुभूतियों पर आधारित उत्कृष्ट रचनाओं का संकलन।',
      pages: 44,
      reads: 5120
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Magazine Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-rose-950 to-slate-900 text-white shadow-xl flex items-center justify-between flex-wrap gap-4 border border-purple-900/40">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-rozha text-purple-100">बोलती कलम - डिजिटल पत्रिका</h1>
          </div>
          <p className="text-xs text-purple-200/90 font-tiro leading-relaxed">
            हर महीने प्रकाशित होने वाली हमारी आधिकारिक ई-पत्रिका, जिसमें देश-विदेश के विख्यात एवं नवोदित कवियों की रचनाएँ संकलित होती हैं।
          </p>
        </div>

        <button
          onClick={onOpenMagazine}
          className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-purple-950/60 active:scale-95 transition"
        >
          <Eye className="w-4 h-4" />
          <span>नवीनतम अंक पढ़ें (Read Latest Edition)</span>
        </button>
      </div>

      {/* Editions Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>सभी प्रकाशित पत्रिका अंक (Magazine Archives)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {editions.map((mag) => (
            <div 
              key={mag.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="relative h-48 bg-slate-950 overflow-hidden">
                <img src={mag.cover} alt={mag.title} className="w-full h-full object-cover opacity-80" />
                <span className="absolute top-3 right-3 px-2.5 py-1 bg-purple-600 text-white font-bold text-[10px] rounded-full shadow">
                  {mag.month}
                </span>
              </div>

              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-rozha text-base text-slate-900 dark:text-slate-100">{mag.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-tiro mt-1">{mag.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">📖 {mag.pages} पृष्ठ • {mag.reads} पाठकों ने पढ़ा</span>
                  <button
                    onClick={onOpenMagazine}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>ई-पत्रिका खोलें</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default MagazineView;
