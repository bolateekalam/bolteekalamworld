import React, { useState, useEffect } from 'react';
import { User, AtSign, Phone, Mail, MapPin, Sparkles, CheckCircle2, ShieldCheck, Camera, Calendar, BookOpen, Navigation, Loader2 } from 'lucide-react';

export const FirstTimeUserModal = ({ isOpen, user, onCompleteProfile }) => {
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(() => {
    if (user?.username) return user.username.replace(/^[@#]/, '');
    if (user?.name) return user.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    if (user?.email) return user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
    return 'writer';
  });
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [city, setCity] = useState(user?.city || 'प्रयागराज');
  const [birthday, setBirthday] = useState(user?.birthday || '2000-08-15');
  const [genre, setGenre] = useState('कविता (Poetry)');
  const [bio, setBio] = useState('शब्दों के माध्यम से अंतर्मन की वेदना और समाज की चेतना को उजागर करने का प्रयास।');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300');
  
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [error, setError] = useState('');

  // Sync state when user prop updates (e.g., from Google Login or Signup)
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.avatar) setSelectedAvatar(user.avatar);
      if (user.phone) setPhone(user.phone);
      if (user.city) setCity(user.city);
      if (user.username) {
        setUsername(user.username.replace(/^[@#]/, ''));
      } else if (user.name) {
        setUsername(user.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''));
      }
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

  // Auto-Detect Current User Location via Browser Geolocation API
  const handleAutoDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('आपके ब्राउज़र में लोकेशन डिटेक्शन समर्थित नहीं है। कृपया शहर का नाम स्वयं लिखें।');
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
          if (res.ok) {
            const data = await res.json();
            const detectedCity = data.address?.city || data.address?.state_district || data.address?.town || data.address?.state || 'प्रयागराज';
            setCity(detectedCity);
          } else {
            setCity('प्रयागराज');
          }
        } catch (e) {
          setCity('प्रयागराज');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (err) => {
        setIsDetectingLocation(false);
        alert('लोकेशन अनुमति नहीं मिली। कृपया अपने शहर का नाम नीचे टाइप करें।');
      },
      { timeout: 8000 }
    );
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

    // Username validation
    const cleanUser = (username.trim() || finalName.toLowerCase().replace(/\s+/g, '_')).replace(/^[@#]/, '').replace(/[^a-zA-Z0-9_]/g, '');
    const finalUsername = `@${cleanUser || 'writer'}`;

    // Phone number: optional! If not provided, save as empty / optional
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    const finalPhone = cleanPhone && cleanPhone.length === 10 ? `+91 ${cleanPhone}` : '';

    onCompleteProfile({
      ...user,
      name: finalName,
      username: finalUsername,
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
      if (file.size > 5 * 1024 * 1024) {
        alert('फ़ोटो 5MB से छोटी रखें!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setSelectedAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300 select-none">
      <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/50 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Header - Security & Verification Identity */}
        <div className="text-center space-y-1 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold mx-auto shadow-lg shadow-emerald-900/30">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold font-rozha text-slate-900 dark:text-slate-100">
            बोलती कलम साहित्यिक प्रोफ़ाइल सेट करें 🎉
          </h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            अपनी जानकारी सेट करें — यह आपकी सभी रचनाओं व 6-माह कार्ड पर दिखाई देगी
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 text-rose-600 rounded-xl text-xs font-bold text-center border border-rose-500/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {/* Avatar Choice & Immediate Preview */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 dark:text-slate-200">
                प्रोफ़ाइल फ़ोटो (Google या नई फ़ोटो अपलोड करें):
              </label>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                ✓ तुरंत अपडेट
              </span>
            </div>
            
            <div className="flex items-center gap-3 pt-1">
              <div className="relative shrink-0 group">
                <img 
                  src={selectedAvatar} 
                  alt="Selected Avatar" 
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-emerald-500 shadow-md" 
                />
                <label 
                  aria-label="फ़ोटो बदलें"
                  className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full cursor-pointer shadow-lg transition active:scale-95"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <input type="file" accept="image/*" onChange={handleCustomImageUpload} className="hidden" />
                </label>
              </div>

              <div className="flex-1 space-y-1">
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  गैलरी से नई फ़ोटो चुनें या नीचे से साहित्यिक अवतार चुनें:
                </p>
                <div className="overflow-x-auto pb-1 scrollbar-none flex gap-1.5">
                  {presetAvatars.map((av, idx) => (
                    <img
                      key={idx}
                      src={av}
                      alt="preset avatar"
                      onClick={() => setSelectedAvatar(av)}
                      className={`w-9 h-9 rounded-full object-cover cursor-pointer border-2 transition ${selectedAvatar === av ? 'border-emerald-600 ring-2 ring-emerald-500/50 scale-110' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Name & Custom Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">आपका नाम (Editable):</label>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> एडिट करें
                </span>
              </div>
              <div className="relative">
                <User className="w-4 h-4 text-emerald-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!username || username === 'writer') {
                      setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''));
                    }
                  }}
                  placeholder="आपका पूरा नाम"
                  required
                  className="w-full pl-9 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-emerald-500/40 font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">यूज़रनेम (@handle):</label>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  यूनिक पहचान
                </span>
              </div>
              <div className="relative">
                <AtSign className="w-4 h-4 text-emerald-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/^[@#]/, '').replace(/\s+/g, '_'))}
                  placeholder="उदा. kaviraj_singh"
                  required
                  className="w-full pl-9 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-emerald-500/40 font-bold text-emerald-700 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>
          </div>

          {/* Email & Phone Number (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Gmail / ईमेल:</label>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> सत्यापित
                </span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  readOnly
                  disabled
                  className="w-full pl-9 p-2.5 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">मोबाइल नंबर (ऐच्छिक):</label>
                <span className="text-[10px] text-slate-400 font-semibold">वैकल्पिक</span>
              </div>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX (ऐच्छिक)"
                  maxLength={13}
                  className="w-full pl-9 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* City / Place with Auto Location Detect Button */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 dark:text-slate-300">शहर / स्थान (City / Location):</label>
              <button
                type="button"
                onClick={handleAutoDetectLocation}
                disabled={isDetectingLocation}
                className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer bg-emerald-500/10 px-2 py-0.5 rounded-md"
              >
                {isDetectingLocation ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>डिटेक्ट हो रहा है...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-3 h-3 text-emerald-600" />
                    <span>📍 स्थान ऑटो-डिटेक्ट करें</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-emerald-500 absolute left-3 top-3" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="उदा. प्रयागराज, दिल्ली, लखनऊ..."
                className="w-full pl-9 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold"
              />
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
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">साहित्यिक विधा (Genre):</label>
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
            className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition active:scale-95 mt-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>प्रोफ़ाइल सहेजें एवं 6-माह कार्ड प्राप्त करें (+50 Welcome Pts)</span>
          </button>

        </form>

      </div>
    </div>
  );
};

export default FirstTimeUserModal;
