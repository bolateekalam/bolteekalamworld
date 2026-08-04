import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Save, User, MapPin, FileText, CheckCircle2, Image as ImageIcon, Camera, Phone, Mail, BookOpen, Calendar, AtSign, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const EditProfileModal = ({ isOpen, onClose, userProfile, onSaveProfile }) => {
  const { t } = useLanguage();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(userProfile?.name || 'नया साहित्य साधक');
  const [username, setUsername] = useState((userProfile?.username || 'writer_user').replace(/^[@#]/, ''));
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [city, setCity] = useState(userProfile?.city || 'प्रयागराज');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [birthday, setBirthday] = useState(userProfile?.birthday || '03 अगस्त 2026');
  const [genre, setGenre] = useState(userProfile?.genre || 'कविता (Poetry)');
  const [avatar, setAvatar] = useState(userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300');
  
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  const reservedUsernames = ['sanjayrai_founder', 'sanjayrai', 'akash_cofounder', 'super_admin', 'bolteekalamworld'];

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setUsername((userProfile.username || 'writer').replace(/^[@#]/, ''));
      setPhone(userProfile.phone || '');
      setEmail(userProfile.email || '');
      setCity(userProfile.city || 'प्रयागराज');
      setBio(userProfile.bio || '');
      setBirthday(userProfile.birthday || '03 अगस्त 2026');
      setGenre(userProfile.genre || 'कविता (Poetry)');
      setAvatar(userProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300');
    }
  }, [userProfile, isOpen]);

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
  ];

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert('कृपया 15MB से कम की छवि चुनें!');
        return;
      }

      setIsCompressing(true);

      const reader = new FileReader();
      reader.onload = (event) => {
        const rawDataUrl = event.target.result;
        // 1. Instantly set preview so user sees new avatar right away!
        setAvatar(rawDataUrl);

        // 2. Compress via Canvas2D (~100KB) for permanent storage
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setAvatar(compressedDataUrl);
          setIsCompressing(false);
        };
        img.onerror = () => setIsCompressing(false);
        img.src = rawDataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsernameError('');

    let formattedUsername = username.trim().toLowerCase().replace(/^[@#]/, '');

    if (reservedUsernames.includes(formattedUsername) && userProfile?.username?.replace(/^[@#]/, '') !== formattedUsername) {
      setUsernameError(`यह यूज़रनेम (${formattedUsername}) पहले से सुरक्षित है! कृपया कोई अन्य यूनिक यूज़रनेम लिखें।`);
      return;
    }

    onSaveProfile({
      ...userProfile,
      name,
      username: formattedUsername,
      phone,
      email,
      city,
      bio,
      birthday,
      genre,
      avatar
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <User className="w-5 h-5 text-rose-600" />
            <span>प्रोफ़ाइल संपादित करें (Edit Profile)</span>
          </h3>
          <button 
            onClick={onClose}
            aria-label="प्रोफ़ाइल मॉडल बंद करें"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {savedSuccess ? (
          <div className="p-6 text-center text-emerald-600 font-bold space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto animate-bounce" />
            <p>आपकी प्रोफ़ाइल एवं नयी फ़ोटो सफलतापूर्वक अपडेट हो गई!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {usernameError && (
              <div className="p-3 bg-rose-500/10 text-rose-600 rounded-xl font-bold flex items-center gap-2 border border-rose-500/30">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{usernameError}</span>
              </div>
            )}

            {/* Avatar Photo Picker & Upload */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <label className="font-bold block text-slate-800 dark:text-slate-200 text-xs">
                प्रोफ़ाइल फ़ोटो / अवतार (Google फ़ोटो को बदलें):
              </label>

              <div className="flex items-center gap-4 flex-wrap">
                <div 
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="relative cursor-pointer group shrink-0"
                  title="नयी फ़ोटो चुनने के लिए क्लिक करें"
                >
                  <img 
                    src={avatar} 
                    alt={name} 
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-rose-500 shadow-md group-hover:opacity-80 transition" 
                  />
                  <div className="absolute inset-0 rounded-full bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="absolute bottom-0 right-0 p-1.5 bg-rose-600 text-white rounded-full shadow border-2 border-white">
                    <Camera className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="space-y-2 flex-1 min-w-[200px]">
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    className="w-full py-2 px-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isCompressing ? 'फ़ोटो प्रोसेस हो रही...' : '📁 मोबाइल / गैलरी से नयी फ़ोटो अपलोड करें'}</span>
                  </button>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    * नयी फ़ोटो चुनने पर गूगल की पुरानी फ़ोटो परमानेंट रिप्लेस हो जाएगी।
                  </p>
                </div>
              </div>

              {/* Preset Avatars */}
              <div className="pt-1 border-t border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-500 font-semibold block mb-1.5">या डिफ़ॉल्ट अवतारों में से चुनें:</span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {presetAvatars.map((av, idx) => (
                    <img
                      key={idx}
                      src={av}
                      alt="preset avatar"
                      onClick={() => setAvatar(av)}
                      className={`w-9 h-9 rounded-full object-cover cursor-pointer border-2 transition ${avatar === av ? 'border-rose-600 ring-2 ring-rose-500/40 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Name & Unique Username Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">आपका पूरा नाम:</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">यूनिक यूज़रनेम (Unique Username):</label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/^[@#]/, ''))}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    placeholder="उदा. kajal या sanjayrai"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">मोबाइल नंबर:</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    placeholder="10 अंकों का मोबाइल नंबर"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">ईमेल आईडी:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    placeholder="आपका ईमेल"
                  />
                </div>
              </div>
            </div>

            {/* Bio & Genre */}
            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">परिचय / बायो (Short Bio):</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                placeholder="अपनी साहित्यिक यात्रा व परिचय लिखें..."
              />
            </div>

            {/* Submit Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition"
              >
                <Save className="w-4 h-4" />
                <span>प्रोफ़ाइल व नयी फ़ोटो सेव करें</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-300 transition"
              >
                रद्द करें
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default EditProfileModal;
