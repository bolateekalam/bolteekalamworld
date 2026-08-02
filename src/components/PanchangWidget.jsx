import React from 'react';
import { Calendar, Sun, Sparkles } from 'lucide-react';

export const PanchangWidget = () => {
  const panchangList = [
    {
      id: 'p1',
      title: 'प्रथम चातुर्मास का 8वाँ दिन',
      tag: '(आज)',
      date: 'अगस्त 2, 2026, रविवार',
      isToday: true,
      img: 'https://images.unsplash.com/photo-1545641203-7d072a14e3b2?auto=format&fit=crop&q=80&w=150'
    },
    {
      id: 'p2',
      title: 'मित्रता दिवस',
      tag: '(आज)',
      date: 'अगस्त 2, 2026, रविवार',
      isToday: true,
      img: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=150'
    },
    {
      id: 'p3',
      title: 'गजानन संकष्टी',
      tag: '(आज)',
      date: 'अगस्त 2, 2026, रविवार',
      isToday: true,
      img: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=150'
    },
    {
      id: 'p4',
      title: 'प्रथम श्रावण सोमवार व्रत',
      tag: '(1 दिन शेष)',
      date: 'अगस्त 3, 2026, सोमवार',
      isToday: false,
      img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=150'
    },
    {
      id: 'p5',
      title: 'आदि पेरुक्कू',
      tag: '(1 दिन शेष)',
      date: 'अगस्त 3, 2026, सोमवार',
      isToday: false,
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=150'
    },
    {
      id: 'p6',
      title: 'प्रथम मंगला गौरी व्रत',
      tag: '(2 दिन शेष)',
      date: 'अगस्त 4, 2026, मंगलवार',
      isToday: false,
      img: 'https://images.unsplash.com/photo-1609137144820-22c6c11d2797?auto=format&fit=crop&q=80&w=150'
    }
  ];

  return (
    <div className="rounded-3xl overflow-hidden border-2 border-amber-600/40 shadow-lg bg-amber-50 dark:bg-slate-900 font-tiro">
      
      {/* Header Bar (Matching Image 1 Terracotta Header) */}
      <div className="bg-gradient-to-r from-amber-700 via-rose-800 to-amber-800 text-white p-3.5 px-5 flex items-center justify-between">
        <h3 className="font-rozha text-base sm:text-lg flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-300" />
          <span>आगामी उपवास और त्यौहार</span>
        </h3>
        <span className="text-xs bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full font-bold font-sans">
          आज: 2 अगस्त 2026
        </span>
      </div>

      {/* List Items matching Image 1 */}
      <div className="divide-y divide-amber-200/60 dark:divide-slate-800">
        {panchangList.map((item) => (
          <div
            key={item.id}
            className={`p-3 px-4 flex items-center gap-3.5 transition ${
              item.isToday
                ? 'bg-rose-100/80 dark:bg-rose-950/50 text-rose-950 dark:text-rose-100'
                : 'bg-amber-50/60 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-amber-100/50'
            }`}
          >
            {/* Thumbnail */}
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-amber-400/50 shadow-sm">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
            </div>

            {/* Event Name & Date */}
            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                  {item.title}
                </h4>
                <span className={`text-[11px] font-bold ${item.isToday ? 'text-rose-600 dark:text-rose-400' : 'text-amber-700 dark:text-amber-400'}`}>
                  {item.tag}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                {item.date}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Authentic Source Footer Disclaimer */}
      <div className="p-2.5 bg-amber-100/70 dark:bg-slate-800/80 text-[10px] text-slate-600 dark:text-slate-400 text-center font-mono border-t border-amber-200 dark:border-slate-800">
        प्रामाणिक स्रोत: श्री काशी विद्वत परिषद एवं ड्रिक पंचांग (Drik Panchang Reference Engine)
      </div>

    </div>
  );
};

export default PanchangWidget;
