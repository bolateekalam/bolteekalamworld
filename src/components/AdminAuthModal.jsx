import React, { useState } from 'react';
import { ShieldCheck, Lock, Key, AlertCircle, X, CheckCircle2, ArrowRight } from 'lucide-react';

export const AdminAuthModal = ({ isOpen, onClose, onAdminLoginSuccess }) => {
  const [adminPassword, setAdminPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleAdminAuthSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanPass = adminPassword.trim();

    // 1. Super Admin Passcodes (Full platform control + Push Broadcast)
    const SUPER_ADMIN_PASSCODES = [
      'superadmin2026',
      'BolateeSuperAdmin@2026',
      'bolteekalam786',
      '786786'
    ];

    // 2. Sub-Admin / Jury Moderator Passcodes (Only Winners, YouTube Proofs & Birthday Cards)
    const MODERATOR_PASSCODES = [
      'jury2026',
      'mod2026',
      'bolatee2026',
      'admin12345',
      'admin'
    ];

    if (!cleanPass) {
      setErrorMsg('⚠️ कृपया एडमिन सुरक्षा पासवर्ड दर्ज करें।');
      return;
    }

    if (SUPER_ADMIN_PASSCODES.includes(cleanPass)) {
      setSuccessMsg('✓ सुपर एडमिन पहचान सत्यापित (Super Admin Full Access)!');
      setTimeout(() => {
        onAdminLoginSuccess('super_admin');
        onClose();
        setAdminPassword('');
        setSuccessMsg('');
      }, 500);
    } else if (MODERATOR_PASSCODES.includes(cleanPass)) {
      setSuccessMsg('✓ ज्यूरी मॉडरेटर पहचान सत्यापित (Jury & Tasks Access)!');
      setTimeout(() => {
        onAdminLoginSuccess('sub_admin');
        onClose();
        setAdminPassword('');
        setSuccessMsg('');
      }, 500);
    } else {
      setErrorMsg('❌ गलत एडमिन पासवर्ड! केवल अधिकृत टीम के सदस्य ही प्रवेश कर सकते हैं।');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md w-full relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-rose-900/30 ring-4 ring-rose-500/20">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-rozha text-slate-900 dark:text-slate-100">
            बोलती कलम एडमिन लॉगिन
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            यह क्षेत्र केवल बोलती कलम की आधिकारिक एडमिन टीम के लिए सुरक्षित है।
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                <span>एडमिन सुरक्षा पासवर्ड (Secret Key)</span>
              </span>
              <span className="text-[10px] text-rose-600 font-bold">* अनिवार्य</span>
            </label>
            
            <div className="relative">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="यहाँ अपना एडमिन पासवर्ड दर्ज करें..."
                autoFocus
                className="w-full px-4 py-3.5 text-sm rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 font-mono shadow-inner"
              />
              <Key className="w-4 h-4 text-slate-400 absolute right-4 top-4" />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2 animate-in shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 px-6 bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl transition active:scale-95"
          >
            <span>एडमिन पैनल खोलें</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800">
          <p className="text-[11px] text-slate-400 italic">
            * सामान्य यूज़र केवल नियमित प्रोफ़ाइल का उपयोग कर सकते हैं।
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminAuthModal;
