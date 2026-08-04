import React, { useState, useEffect } from 'react';
import { X, Upload, Save, User, MapPin, FileText, CheckCircle2, Image, Camera, Phone, Mail, BookOpen, Calendar, AtSign, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const EditProfileModal = ({ isOpen, onClose, userProfile, onSaveProfile }) => {
  const { t } = useLanguage();

  const [name, setName] = useState(userProfile?.name || 'नया साहित्य साधक');
  const [username, setUsername] = useState(userProfile?.username || '@writer_user');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [city, setCity] = useState(userProfile?.city || 'प्रयागराज');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [birthday, setBirthday] = useState(userProfile?.birthday || '03 अगस्त 2026');
  const [genre, setGenre] = useState(userProfile?.genre || 'कविता (Poetry)');
  const [avatar, setAvatar] = useState(userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300');
  
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  // Existing registered usernames list for uniqueness check!
  const reservedUsernames = ['@sanjayrai_founder', '@akash_cofounder', '@super_admin', '@bolteekalamworld'];

  // Sync state whenever userProfile prop updates
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setUsername(userProfile.username || `@${userProfile.name?.toLowerCase().replace(/\s+/g, '_') || 'writer'}`);
      setPhone(userProfile.phone || '');
      setEmail(userProfile.email || '');
      setCity(userProfile.city || 'प्रयागराज');
      setBio(userProfile.bio || '');
      setBirthday(userProfile.birthday || '03 अगस्त 2026');
      setGenre(userProfile.genre || 'कविता (Poetry)');
      setAvatar(userProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300');
    }
  }, [userProfile, isOpen]);

  const calculateAge = (dobString) => {
    if (!dobString) return '';
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? `${age} वर्ष` : '';
  };

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
      if (file.size > 10 * 1024 * 1024) {
        alert('कृपया 10MB से कम की छवि चुनें!');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 400; // Resize to 400x400 for crisp avatar
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

          // Compress to JPEG 0.85 quality (~80-120KB) so custom avatar overwrites Google avatar permanently
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setAvatar(compressedDataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsernameError('');

    let formattedUsername = username.trim().toLowerCase();
    if (!formattedUsername.startsWith('@')) {
      formattedUsername = `@${formattedUsername}`;
    }

    // Strict Unique Username Enforcement Check
    if (reservedUsernames.includes(formattedUsername) && userProfile?.username !== formattedUsername) {
      setUsernameError(`यह यूज़रनेम (${formattedUsername}) पहले से ही किसी अन्य लेखक द्वारा लिया जा चुका है! कृपया कोई अन्य यूनिक यूज़रनेम लिखें।`);
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
      age: calculateAge(birthday),
      genre,
      avatar
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
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
            <p>आपकी प्रोफ़ाइल एवं यूनिक यूज़रनेम सफलतापूर्वक अपडेट हो गया!</p>
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
            <div className="space-y-2">
              <label className="font-bold block text-slate-700 dark:text-slate-300">
                प्रोफ़ाइल फ़ोटो / अवतार (Max 2MB Limit):
              </label>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={avatar} alt={name} className="w-16 h-16 rounded-full object-cover ring-2 ring-rose-500 shadow" />
                  <label className="absolute bottom-0 right-0 p-1 bg-rose-600 text-white rounded-full cursor-pointer shadow">
                    <Camera className="w-3.5 h-3.5" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>

                <div className="flex-1 space-y-1">
                  <span className="text-[11px] text-slate-500 font-semibold block">डिफ़ॉल्ट अवतारों में से चुनें:</span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {presetAvatars.map((av, idx) => (
                      <img
                        key={idx}
                        src={av}
                        alt="preset avatar"
                        onClick={() => setAvatar(av)}
                        className={`w-8 h-8 rounded-full object-cover cursor-pointer border-2 transition ${avatar === av ? 'border-rose-600 ring-2 ring-rose-500/40 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      />
                    ))}
                  </div>
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
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">यूनिक यूज़रनेम (@username): *</label>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-rose-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="@unique_name"
                    className="w-full pl-9 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold border border-rose-500/40 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">मोबाइल नंबर (10 अंक): *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full pl-9 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold border border-emerald-500/40 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">Gmail / ईमेल पता:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* City & Birthday */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">शहर (City):</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-9 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">जन्मदिन तिथि (DOB):</label>
                  {birthday && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      आयु: {calculateAge(birthday)}
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Genre & Bio */}
            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">मुख्य साहित्यिक विधा (Genre):</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                aria-label="मुख्य साहित्यिक विधा चुनें"
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold"
              >
                <option value="कविता (Poetry)">कविता (Poetry)</option>
                <option value="ग़ज़ल (Ghazal)">ग़ज़ल (Ghazal)</option>
                <option value="कहानी (Story)">कहानी (Story)</option>
                <option value="हास्य-व्यंग्य (Satire)">हास्य-व्यंग्य (Satire)</option>
                <option value="देशभक्ति (Patriotic)">देशभक्ति (Patriotic)</option>
                <option value="विचार व निबंध (Essays)">विचार व निबंध (Essays)</option>
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">साहित्यिक परिचय / बायो (Bio):</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-tiro text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              aria-label="प्रोफ़ाइल सहेजें"
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>प्रोफ़ाइल व यूज़रनेम सहेजें (Save Profile)</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default EditProfileModal;
