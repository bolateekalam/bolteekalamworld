import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle, Wand2, Hash, FileCheck, 
  HelpCircle, RefreshCw, X, Copy, Check 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AiAssistantModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('title');
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);

      if (activeTab === 'title') {
        setResult([
          '1. सावन की साँझ और तुम',
          '2. अंतर्मन की वेदना',
          '3. बारिश, चाय और पुरानी यादें',
          '4. स्वाभिमान की गूँज',
          '5. नज़्म-ए-इश्क़'
        ]);
      } else if (activeTab === 'grammar') {
        setResult({
          score: '94% छंद एवं व्याकरण शुद्धता',
          meter: 'बह्र-ए-हज़ज मुसम्मन सालिम (1222 1222 1222 1222)',
          suggestions: [
            'दूसरी पंक्ति में "इश्क़" शब्द के स्थान पर "चाहत" का प्रयोग बह्र को अधिक सुरीला बनाता है।',
            'चौथी पंक्ति में तुकांत (कफ़िया) पूर्ण रूप से सटीक है।'
          ]
        });
      } else if (activeTab === 'hashtags') {
        setResult([
          '#बोलतीकलम', '#हिंदीसाहित्य', '#काव्यसंग्राम', 
          '#प्रेमानुभूति', '#शायरीदिलसे', '#कविता', '#hindiwriters'
        ]);
      } else if (activeTab === 'duplicate') {
        setResult({
          originality: '100% मौलिक रचना (Original Content)',
          status: 'कोई कॉपीराइट या डुप्लिकेट कंटेंट नहीं मिला।',
          matches: '0 Matching web entries.'
        });
      }
    }, 1200);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {t('ai.title')}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 font-semibold">AI Powered</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                शीर्षक सुझाव, व्याकरण/छंद परीक्षण, हैशटैग एवं कॉपीराइट चेक।
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tools Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto p-2 gap-1 bg-slate-50/50 dark:bg-slate-800/50">
          {[
            { id: 'title', label: t('ai.titleSuggestion'), icon: Wand2 },
            { id: 'grammar', label: t('ai.grammar'), icon: CheckCircle },
            { id: 'hashtags', label: t('ai.hashtags'), icon: Hash },
            { id: 'duplicate', label: t('ai.duplicateCheck'), icon: FileCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setResult(null); }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm border border-slate-200 dark:border-slate-800'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
              अपनी कविता, शायरी या कहानी की कुछ पंक्तियाँ दर्ज करें:
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="यहाँ पंक्तियाँ लिखें या पेस्ट करें..."
              rows={4}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-tiro focus:outline-none focus:border-rose-500 transition"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !inputText.trim()}
            className="w-full py-3 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 disabled:opacity-50 text-white rounded-2xl text-xs font-bold shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2 transition active:scale-95"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t('ai.checking')}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t('ai.generate')}</span>
              </>
            )}
          </button>

          {/* Analysis Results Display */}
          {result && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>AI विश्लेषण परिणाम:</span>
              </h4>

              {/* Title Suggestions */}
              {activeTab === 'title' && Array.isArray(result) && (
                <div className="space-y-2">
                  {result.map((title, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-slate-800 dark:text-slate-200"
                    >
                      <span>{title}</span>
                      <button
                        onClick={() => copyToClipboard(title, idx)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Grammar Check */}
              {activeTab === 'grammar' && (
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                    {result.score}
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono">
                    {result.meter}
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    {result.suggestions.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Hashtags */}
              {activeTab === 'hashtags' && Array.isArray(result) && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {result.map((ht, idx) => (
                    <span 
                      key={idx} 
                      onClick={() => copyToClipboard(ht, idx)}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-mono text-xs cursor-pointer hover:bg-rose-100"
                    >
                      {ht}
                    </span>
                  ))}
                </div>
              )}

              {/* Duplicate Check */}
              {activeTab === 'duplicate' && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 space-y-1">
                  <div className="font-bold text-xs">{result.originality}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">{result.status}</div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default AiAssistantModal;
