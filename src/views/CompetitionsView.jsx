import React, { useState } from 'react';
import { Trophy, Award, Calendar, Users, ShieldCheck, Download, PlusCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const CompetitionsView = ({ competitions = [], onOpenCertificate, onOpenCreatePost }) => {
  const { t } = useLanguage();
  const [submittedIds, setSubmittedIds] = useState([]);

  const handleApply = (compId) => {
    setSubmittedIds([...submittedIds, compId]);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-600 via-rose-700 to-rose-900 text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-400/20 text-amber-300">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-rozha text-amber-100">
                {t('competition.title')}
              </h1>
              <p className="text-xs text-amber-100/90 mt-1 max-w-xl font-tiro">
                अपनी उत्कृष्ट रचनाएँ जमा करें, प्रतिष्ठित जज पैनल से रेटिंग प्राप्त करें और आधिकारिक डिजिटल सर्टिफिकेट व नकद पुरस्कार जीतें!
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCreatePost}
            className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>{t('competition.submitEntry')}</span>
          </button>
        </div>
      </div>

      {/* Competition Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {competitions.map((comp) => {
          const isSubmitted = submittedIds.includes(comp.id) || comp.userSubmitted;

          return (
            <div 
              key={comp.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition space-y-4 p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-44 rounded-2xl overflow-hidden relative">
                  <img src={comp.banner} alt={comp.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 text-amber-400 font-bold text-[10px] uppercase backdrop-blur-sm">
                    {comp.category}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>अंतिम तिथि: {comp.deadline}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{comp.entriesCount} प्रविष्टियाँ</span>
                  </span>
                </div>

                <h2 className="text-lg font-rozha text-slate-900 dark:text-slate-100">
                  {comp.title}
                </h2>

                <p className="text-xs text-slate-600 dark:text-slate-400 font-tiro leading-relaxed">
                  {comp.description}
                </p>

                {/* Prize Pool Badge */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-between">
                  <span>पुरस्कार राशि:</span>
                  <span className="font-outfit text-sm">{comp.prizePool}</span>
                </div>

                {/* Judges Panel */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">जज पैनल (Judges Panel):</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {comp.judges.map((j, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-rose-500" />
                        <span>{j.name} ({j.role})</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                {isSubmitted ? (
                  <div className="flex-1 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>प्रविष्टि सबमिट हो चुकी है</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleApply(comp.id)}
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-900/20 transition active:scale-95"
                  >
                    {t('competition.submitEntry')}
                  </button>
                )}

                <button
                  onClick={() => onOpenCertificate({
                    recipientName: 'आप (User)',
                    title: comp.title,
                    category: 'विजेता / प्रतिभागी',
                    type: 'Competition',
                    date: '02 अगस्त 2026',
                    certificateId: `BK-COMP-${comp.id}`
                  })}
                  className="px-3.5 py-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold flex items-center gap-1.5 transition"
                  title="सर्टिफिकेट डाउनलोड करें"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">सर्टिफिकेट</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default CompetitionsView;
