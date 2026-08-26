import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Key, AlertCircle, X, CheckCircle2, ArrowRight, Crown, Shield } from 'lucide-react';

export const AdminAuthModal = ({ isOpen, onClose, onAdminLoginSuccess }) => {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (!isOpen) return null;

  const handleAdminAuthSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = adminEmail.trim().toLowerCase();
    const cleanPass = adminPassword.trim();

    if (!cleanEmail || !cleanPass) {
      setErrorMsg('⚠️ कृपया एडमिन ईमेल आईडी और पासवर्ड दोनों दर्ज करें।');
      return;
    }

    setIsAuthenticating(true);

    // 1. Authorized Super Admin Accounts (Full Control + Push Broadcaster + Theme Engine)
    const SUPER_ADMIN_EMAILS = [
      'admin@bolteekalam.com',
      'sanjayrai@gmail.com',
      'akashsingh@gmail.com',
      'bolateeworld@gmail.com',
      'admin@bolateeworld.in',
      'superadmin'
    ];
    const SUPER_ADMIN_PASSWORDS = [
      'BolateeSuperAdmin@2026',
      'bolteekalam786',
      'superadmin2026',
      '786786'
    ];

    // 2. Authorized Sub-Admin / Jury Moderator Accounts (Only Winners, YouTube Proofs & Birthday Cards)
    // Also checks dynamically created moderators from local/cloud storage
    let customModerators = [];
    try {
      const storedMods = localStorage.getItem('bolteekalam_authorized_moderators_list');
      if (storedMods) customModerators = JSON.parse(storedMods);
    } catch (err) {}

    const MODERATOR_EMAILS = [
      'jury@bolteekalam.com',
      'mod@bolteekalam.com',
      'jury1@bolteekalam.com',
      'moderator@bolteekalam.com',
      'jury',
      'mod',
      ...customModerators.map(m => m.email.toLowerCase())
    ];
    const MODERATOR_PASSWORDS = [
      'jury2026',
      'mod2026',
      'bolatee2026',
      'admin12345',
      'admin',
      ...customModerators.map(m => m.password)
    ];

    const isSuperAdminEmail = SUPER_ADMIN_EMAILS.includes(cleanEmail);
    const isSuperAdminPass = SUPER_ADMIN_PASSWORDS.includes(cleanPass);

    const isModEmail = MODERATOR_EMAILS.includes(cleanEmail);
    const isModPass = MODERATOR_PASSWORDS.includes(cleanPass);

    setTimeout(() => {
      setIsAuthenticating(false);

      if (isSuperAdminEmail && isSuperAdminPass) {
        setSuccessMsg('✓ सुपर एडमिन पहचान सत्यापित! पूर्ण नियंत्रण डैशबोर्ड खोला जा रहा है...');
        setTimeout(() => {
          onAdminLoginSuccess('super_admin');
          onClose();
          setAdminEmail('');
          setAdminPassword('');
        }, 500);
      } else if (isModEmail && isModPass) {
        setSuccessMsg('✓ ज्यूरी मॉडरेटर पहचान सत्यापित! ज्यूरी व टास्क डैशबोर्ड खोला जा रहा है...');
        setTimeout(() => {
          onAdminLoginSuccess('sub_admin');
          onClose();
          setAdminEmail('');
          setAdminPassword('');
        }, 500);
      } else if (cleanPass === 'BolateeSuperAdmin@2026' || cleanPass === 'bolteekalam786' || cleanPass === 'superadmin2026') {
        // Direct Super Admin Secret Key fallback
        setSuccessMsg('✓ सुपर एडमिन सीक्रेट की सत्यापित!');
        setTimeout(() => {
          onAdminLoginSuccess('super_admin');
          onClose();
        }, 500);
      } else if (cleanPass === 'jury2026' || cleanPass === 'mod2026') {
        // Direct Moderator Key fallback
        setSuccessMsg('✓ ज्यूरी मॉडरेटर सीक्रेट की सत्यापित!');
        setTimeout(() => {
          onAdminLoginSuccess('sub_admin');
          onClose();
        }, 500);
      } else {
        setErrorMsg('❌ अनाधिकृत प्रवेश (Access Denied)! यह ईमेल व पासवर्ड एडमिन पैनल के लिए मान्य नहीं है।');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border-2 border-rose-900/40 dark:border-rose-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md w-full relative space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-700 via-rose-600 to-amber-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-rose-900/30 ring-4 ring-rose-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-rozha text-slate-900 dark:text-slate-100">
            बोलती कलम एडमिन सुरक्षा गेट
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-serif">
            यह क्षेत्र केवल अधिकृत एडमिन व ज्यूरी सदस्यों के लिए सुरक्षित है।
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAdminAuthSubmit} className="space-y-3.5 text-xs">
          
          {/* Email ID Field */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-rose-600" />
              <span>एडमिन ईमेल आईडी (Admin ID):</span>
            </label>
            <input
              type="text"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="उदा. admin@bolteekalam.com या jury@bolteekalam.com"
              autoFocus
              className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 font-mono"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-600" />
              <span>एडमिन सुरक्षा पासवर्ड (Password):</span>
            </label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 font-mono"
              required
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-[11px] font-bold flex items-center gap-2 animate-in shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition active:scale-95 cursor-pointer mt-2"
          >
            <span>{isAuthenticating ? 'पहचान जांची जा रही है...' : 'सुरक्षित एडमिन पैनल खोलें'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800">
          <p className="text-[11px] text-slate-400">
            * सामान्य यूज़र्स के लिए प्रवेश वर्जित है।
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminAuthModal;
