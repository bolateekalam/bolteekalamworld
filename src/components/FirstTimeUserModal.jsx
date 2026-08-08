import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Sparkles, CheckCircle2, ShieldCheck, Camera, Calendar, BookOpen, Heart } from 'lucide-react';

export const FirstTimeUserModal = ({ isOpen, user, onCompleteProfile }) => {
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [city, setCity] = useState(user?.city || 'प्रयागराज');
  const [birthday, setBirthday] = useState('2000-08-15');
  const [genre, setGenre] = useState('कविता (Poetry)');
  const [bio, setBio] = useState('शब्दों के माध्यम से अंतर्मन की वेदना और समाज की चेतना को उजागर करने का प्रयास।');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200');
  
  const [error, setError] = useState('');

  // Sync state when user prop updates (e.g., from Google Login)
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.avatar) setSelectedAvatar(user.avatar);
      if (user.phone) setPhone(user.phone);
    }
  }, [user, isOpen]);

  // Calculate age dynamically from DOB
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const finalName = name.trim() || user?.name || 'साहित्य साधक';
    const finalEmail = email.trim() || user?.email || 'user@bolteekalam.com';

    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    const finalPhone = (cleanPhone && cleanPhone.length === 10) ? `+91 ${cleanPhone}` : (user?.phone || '+91 9812345678');

    onCompleteProfile({
      ...user,
      name: finalName,
      phone: finalPhone,
      email: finalEmail,
      city: city.trim() || 'प्रयागराज',
      birthday,
      age: calculateAge(birthday),
      genre,
      bio: bio.trim(),
      avatar: selectedAvatar,
      isVerified: true
    });
  };

  const handleCustomImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('फ़ाइल की साइज 2MB से कम रखें!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-in fade-in duration-300 select-none">
      <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/50 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header - NO CLOSE/CUT BUTTON */}
        <div className="text-center space-y-1 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold mx-auto shadow-lg shadow-emerald-900/30">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold font-rozha text-slate-900 dark:text-slate-100">
            बोलती कलम में आपका स्वागत है 🎉
          </h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            सुरक्षा एवं साहित्यिक पहचान हेतु जानकारी (Govt Audit Verified)
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 text-rose-600 rounded-xl text-xs font-bold text-center border border-rose-500/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {/* Avatar Choice */}
          <div className="space-y-1.5">
            <label className="font-bold block text-slate-700 dark:text-slate-300">साहित्यिक अवतार या अपनी फ़ोटो चुनें:</label>
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img src={selectedAvatar} alt="Selected Avatar" className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-500 shadow" />
                <label className="absolute bottom-0 right-0 p-1 bg-emerald-600 text-white rounded-full cursor-pointer shadow">
                  <Camera className="w-3.5 h-3.5" />
                  <input type="file" accept="image/*" onChange={handleCustomImageUpload} className="hidden" />
                </label>
              </div>

              <div className="flex-1 overflow-x-auto pb-1 scrollbar-none flex gap-1.5">
                {presetAvatars.map((av, idx) => (
                  <img
                    key={idx}
                    src={av}
                    alt="preset avatar"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-9 h-9 rounded-full object-cover cursor-pointer border-2 transition ${selectedAvatar === av ? 'border-emerald-600 ring-2 ring-emerald-500/40 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Name & Mobile Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">आपका नाम:</label>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> सत्यापित
                </span>
              </div>
              <div className="relative">
                <User className="w-4 h-4 text-emerald-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name || user?.name || ''}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="आपका पूरा नाम"
                  className="w-full pl-9 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-emerald-500/30 font-bold text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">मोबाइल नंबर (ऐच्छिक):</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="उदा. 9876543210 (ऐच्छिक)"
                  maxLength={10}
                  className="w-full pl-9 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Email & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Gmail / ईमेल पता:</label>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> सत्यापित
                </span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email || user?.email || ''}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@gmail.com"
                  className="w-full pl-9 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-emerald-500/30 text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">शहर (City / Location):</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="उदा. प्रयागराज"
                  className="w-full pl-9 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Birthday (DOB & Age) & Favorite Genre */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">जन्मतिथि (DOB):</label>
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

            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">मुख्य साहित्यिक विधा (Genre):</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
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
          </div>

          {/* Writer Bio */}
          <div>
            <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">साहित्यिक परिचय / बायो (Writer Bio):</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              placeholder="अपने बारे में 2 पंक्तियाँ लिखें..."
              className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-tiro text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition active:scale-95 mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>प्रोफ़ाइल सहेजें एवं आगे बढ़ें (+50 Welcome Pts)</span>
          </button>

        </form>

      </div>
    </div>
  );
};

export default FirstTimeUserModal;
