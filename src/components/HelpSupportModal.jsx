import React from 'react';
import { X, HelpCircle, Phone, Mail, MessageCircle, Sparkles, ExternalLink, ShieldCheck, Video, Share2, Globe } from 'lucide-react';

const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

const YouTubeIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

export const HelpSupportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const socialLinks = [
    {
      id: 'whatsapp',
      name: 'WhatsApp सपोर्ट',
      desc: '+91 9812345678 (तुरंत मैसेज सहायता)',
      icon: WhatsAppIcon,
      color: 'bg-emerald-500 text-white shadow-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      link: 'https://wa.me/919812345678?text=नमस्ते%20बोलती%20कलम,%20मुझे%20सहायता%20चाहिए।'
    },
    {
      id: 'phone',
      name: '24x7 कॉलिंग हेल्पलाइन',
      desc: '+91 9812345678 (सुबह 9 से शाम 6 बजे)',
      icon: Phone,
      color: 'bg-blue-600 text-white shadow-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      link: 'tel:+919812345678'
    },
    {
      id: 'email',
      name: 'आधिकारिक ईमेल सपोर्ट',
      desc: 'support@bolteekalam.com',
      icon: Mail,
      color: 'bg-rose-600 text-white shadow-rose-900/20',
      textColor: 'text-rose-600 dark:text-rose-400',
      link: 'mailto:support@bolteekalam.com'
    },
    {
      id: 'youtube',
      name: 'बोलती कलम YouTube चैनल',
      desc: '@bolateekalam (वीडियो एवं काव्य गोष्ठी)',
      icon: YouTubeIcon,
      color: 'bg-red-600 text-white shadow-red-900/20',
      textColor: 'text-red-600 dark:text-red-400',
      link: 'https://www.youtube.com/@bolateekalam'
    },
    {
      id: 'instagram',
      name: 'Instagram अकाउंट',
      desc: '@bolateekalam (दैनिक शायरी व अपडेट्स)',
      icon: InstagramIcon,
      color: 'bg-gradient-to-tr from-amber-500 via-rose-600 to-purple-600 text-white shadow-rose-900/20',
      textColor: 'text-rose-500',
      link: 'https://www.instagram.com'
    },
    {
      id: 'facebook',
      name: 'Facebook पेज',
      desc: '@bolateekalamofficial (साहित्यिक समुदाय)',
      icon: FacebookIcon,
      color: 'bg-blue-700 text-white shadow-blue-900/20',
      textColor: 'text-blue-600',
      link: 'https://www.facebook.com'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center shadow-md">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>बोलती कलम सहायता केंद्र</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                हम आपकी सहायता के लिए सदैव तत्पर हैं।
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="सहायता केंद्र बंद करें"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Social & Contact Grid */}
        <div className="space-y-2.5 pt-1">
          {socialLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                      <span>{item.name}</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className={`p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition ${item.textColor}`}>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl text-xs shadow transition active:scale-95"
        >
          बंद करें (Close)
        </button>

      </div>
    </div>
  );
};

export default HelpSupportModal;
