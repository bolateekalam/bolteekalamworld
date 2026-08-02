import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ReportModal = ({ isOpen, onClose, targetItem }) => {
  const { t } = useLanguage();
  const [selectedReason, setSelectedReason] = useState('spam');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const reportReasons = [
    { id: 'spam', label: t('report.spam') },
    { id: 'abusive', label: t('report.abusive') },
    { id: 'copied', label: t('report.copied') },
    { id: 'adult', label: t('report.adult') },
    { id: 'fakeProfile', label: t('report.fakeProfile') }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              रिपोर्ट दर्ज हो गई है
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              {t('report.reviewNotice')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {t('report.title')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {targetItem?.title || targetItem?.author ? `सामग्री: "${targetItem.title || 'टिप्पणी'}"` : 'सामग्री का चयन करें'}
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                रिपोर्ट का मुख्य कारण चुनें:
              </label>
              <div className="space-y-1.5">
                {reportReasons.map((reason) => (
                  <label
                    key={reason.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition ${
                      selectedReason === reason.id
                        ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason.id}
                      checked={selectedReason === reason.id}
                      onChange={() => setSelectedReason(reason.id)}
                      className="accent-rose-600"
                    />
                    <span>{reason.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                अतिरिक्त विवरण (Optional):
              </label>
              <textarea
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                placeholder="यदि कोई विशिष्ट जानकारी है तो यहाँ लिखें..."
                rows={2}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-900/20 transition active:scale-95"
            >
              {t('report.submit')}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default ReportModal;
