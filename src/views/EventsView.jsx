import React, { useState } from 'react';
import { Calendar, Video, MapPin, Users, Ticket, Award, Sparkles, ExternalLink, CheckCircle2, Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const EventsView = ({ events = [], onOpenCertificate, onSubscribeYouTube }) => {
  const { t } = useLanguage();
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    // Open official Bolti Kalam YouTube Channel (https://www.youtube.com/@bolateekalam) in new tab!
    window.open('https://www.youtube.com/@bolateekalam', '_blank');
    setSubscribed(true);
    if (onSubscribeYouTube) {
      onSubscribeYouTube();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 🔴 Official Bolti Kalam YouTube Channel Showcase & Subscribe Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-700 via-rose-900 to-slate-950 text-white shadow-xl flex items-center justify-between flex-wrap gap-4 border border-red-600/40">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-950/60 shrink-0">
            <Video className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-rozha text-white">बोलती कलम (@bolateekalam)</h2>
              <span className="px-2 py-0.5 rounded bg-red-600 font-sans font-bold text-[10px] text-white">VERIFIED</span>
            </div>
            <p className="text-xs text-rose-200/90 font-tiro mt-0.5">
              ऑनलाइन कवि सम्मेलन, ओपन माइक प्रदर्शन और साहित्य चर्चाएँ देखें व सब्सक्राइब कर पाएँ **+100 बोनस पॉइंट्स**!
            </p>
          </div>
        </div>

        {subscribed ? (
          <div className="px-5 py-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold rounded-2xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>सब्सक्राइब किया गया (+100 Pts Reward Added!)</span>
          </div>
        ) : (
          <button
            onClick={handleSubscribe}
            className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-red-900/40 active:scale-95 transition"
          >
            <Video className="w-4 h-4" />
            <span>चैनल सब्सक्राइब करें (+100 Pts)</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>
        )}
      </div>

      {/* Embedded YouTube Performances Gallery */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Play className="w-4 h-4 text-red-600 fill-red-600" />
            <span>हालिया ऑनलाइन कवि सम्मेलन एवं ओपन माइक प्रदर्शन</span>
          </h3>
          <a 
            href="https://www.youtube.com/@bolateekalam" 
            target="_blank" 
            rel="noreferrer"
            className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
          >
            <span>सभी वीडियो देखें</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Video 1 */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800/50 space-y-2">
            <div className="relative aspect-video bg-slate-950 flex items-center justify-center group cursor-pointer" onClick={handleSubscribe}>
              <img 
                src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600" 
                alt="Online Kavi Sammelan" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
              />
              <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition absolute">
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </div>
            </div>
            <div className="p-3">
              <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                बोलती कलम: राष्ट्रीय ऑनलाइन कवि सम्मेलन 2026 (भाग 1)
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">बोलती कलम यूट्यूब चैनल (@bolateekalam) • 14k views</p>
            </div>
          </div>

          {/* Video 2 */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800/50 space-y-2">
            <div className="relative aspect-video bg-slate-950 flex items-center justify-center group cursor-pointer" onClick={handleSubscribe}>
              <img 
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600" 
                alt="Open Mic Evening" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
              />
              <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition absolute">
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </div>
            </div>
            <div className="p-3">
              <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                ओपन माइक शाम: युवा कवियों की बेहतरीन ग़ज़लें
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">बोलती कलम यूट्यूब चैनल (@bolateekalam) • 9.8k views</p>
            </div>
          </div>

        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-rose-600" />
          <span>आगामी साहित्यिक कार्यक्रम व ओपन माइक</span>
        </h3>

        {events.map((evt) => (
          <div 
            key={evt.id}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-between gap-4 flex-wrap text-xs"
          >
            <div className="space-y-1 max-w-lg">
              <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 font-bold text-[10px]">
                {evt.type}
              </span>
              <h4 className="font-rozha text-base text-slate-900 dark:text-slate-100">{evt.title}</h4>
              <p className="text-slate-600 dark:text-slate-400 font-tiro">{evt.description}</p>
              <div className="flex items-center gap-4 text-slate-500 text-[11px] pt-1">
                <span>📅 {evt.date} ({evt.time})</span>
                <span>📍 {evt.location}</span>
              </div>
            </div>

            <button
              onClick={() => onOpenCertificate({
                recipientName: 'साहित्य प्रेमी (Participant)',
                title: `${evt.title} पंजीयन प्रमाण-पत्र`,
                category: evt.type,
                type: 'Event Participation Certificate',
                date: evt.date,
                certificateId: `BK-EVT-${evt.id}`
              })}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow transition active:scale-95 shrink-0 flex items-center gap-1.5"
            >
              <Ticket className="w-4 h-4" />
              <span>पंजीयन करें (Register)</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default EventsView;
