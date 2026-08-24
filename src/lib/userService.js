import { supabase } from './supabase';

// Known existing system & mock handles to avoid duplicates
const KNOWN_EXISTING_HANDLES = [
  'admin', 'super_admin', 'sanjayrai', 'sanjayrai_founder', 'bolteekalam', 
  'official', 'support', 'help', 'bolateeworld', 'akash_cofounder',
  'kajal', 'kajal_writer', 'kavita', 'writer', 'kaviraj', 'sahitya'
];

// Helper to sanitize username
export const sanitizeUsername = (val) => {
  if (!val) return '';
  return val.toString().trim().toLowerCase().replace(/^[@#]+/, '').replace(/[\s\-\.]+/g, '_').replace(/[^a-z0-9_]/g, '');
};

// 1. Verify Username Availability against Local Registered Users Map, Supabase DB & Reserved List
export const checkUsernameAvailability = async (candidateUsername, currentUserId = null, currentUserEmail = null) => {
  if (!candidateUsername) {
    return { available: false, message: 'कृपया यूज़रनेम दर्ज करें।' };
  }

  const clean = sanitizeUsername(candidateUsername);
  
  if (clean.length < 3) {
    return { available: false, message: 'यूज़रनेम कम से कम 3 अक्षरों का होना चाहिए।' };
  }

  if (!/^[a-z0-9_]+$/.test(clean)) {
    return { available: false, message: 'यूज़रनेम में केवल अंग्रेजी अक्षर (a-z), अंक (0-9) और अंडरस्कोर (_) मान्य हैं।' };
  }

  const reserved = ['admin', 'super_admin', 'sanjayrai', 'bolteekalam', 'official', 'support', 'help', 'bolateeworld'];
  if (reserved.includes(clean)) {
    return { available: false, message: 'यह यूज़रनेम सिस्टम द्वारा सुरक्षित (Reserved) है। कृपया कोई अन्य नाम चुनें।' };
  }

  // A. Check in local registered users map (All accounts registered on this browser/app)
  try {
    const rawMap = localStorage.getItem('bolteekalam_registered_users_map');
    if (rawMap) {
      const usersMap = JSON.parse(rawMap);
      for (const [userEmailKey, userObj] of Object.entries(usersMap)) {
        const existingHandle = sanitizeUsername(userObj?.username);
        if (existingHandle === clean) {
          const isCurrentUser = (currentUserEmail && userEmailKey.toLowerCase() === currentUserEmail.toLowerCase()) ||
                                (currentUserId && userObj?.id === currentUserId);
          if (!isCurrentUser) {
            return { 
              available: false, 
              message: `❌ '${clean}' यूज़रनेम पहले से किसी अन्य लेखक द्वारा लिया जा चुका है। कृपया दूसरा चुनें।` 
            };
          }
        }
      }
    }
  } catch (e) {}

  // B. Check in current active profile & active user in localStorage
  try {
    const savedProf = localStorage.getItem('bolteekalam_user_profile');
    if (savedProf) {
      const parsed = JSON.parse(savedProf);
      const myUser = sanitizeUsername(parsed.username);
      const myEmail = parsed.email?.toLowerCase();
      if (myUser === clean) {
        if (myEmail === currentUserEmail?.toLowerCase() || myUser === currentUserId) {
          return { available: true, message: '✓ आपका वर्तमान यूज़रनेम' };
        } else if (!currentUserEmail && !currentUserId) {
          return { 
            available: false, 
            message: `❌ '${clean}' यूज़रनेम पहले से पंजीकृत है। कृपया नया यूज़रनेम चुनें।` 
          };
        }
      }
    }
  } catch (e) {}

  // C. Check against known system & demo author handles
  if (KNOWN_EXISTING_HANDLES.includes(clean)) {
    if (currentUserEmail?.includes(clean) || currentUserId === clean) {
      return { available: true, message: '✓ आपका यूज़रनेम' };
    }
    return { 
      available: false, 
      message: `❌ '${clean}' यूज़रनेम पहले से मौजूद है। कृपया कोई अन्य विशिष्ट यूज़रनेम चुनें।` 
    };
  }

  // D. Check Supabase DB profiles table
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, email')
      .ilike('username', clean);

    if (!error && data && data.length > 0) {
      const isOwnedByMe = data.some(p => 
        (currentUserId && p.id === currentUserId) || 
        (currentUserEmail && p.email?.toLowerCase() === currentUserEmail.toLowerCase())
      );
      if (!isOwnedByMe) {
        return { 
          available: false, 
          message: `❌ '${clean}' यूज़रनेम डेटाबेस में पहले से मौजूद है।` 
        };
      }
    }
  } catch (e) {
    console.warn('Supabase username check notice:', e);
  }

  return { available: true, message: `✓ @${clean} उपलब्ध है!` };
};

// 2. Generate Smart Username Suggestions based on user's name
export const generateUsernameSuggestions = async (fullName) => {
  if (!fullName || typeof fullName !== 'string') return [];

  const cleanInput = fullName.replace(/[^\w\s\u0900-\u097F]/gi, '').trim();

  let baseParts = cleanInput
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map(p => p.replace(/[^a-z0-9]/g, ''))
    .filter(p => p.length >= 2);

  if (baseParts.length === 0) {
    const translitMap = {
      'आकाश': 'akash', 'कुमार': 'kumar', 'सिंह': 'singh', 'काजल': 'kajal',
      'संजय': 'sanjay', 'राय': 'rai', 'संदीप': 'sandeep', 'शर्मा': 'sharma',
      'अमित': 'amit', 'पूजा': 'pooja', 'विकास': 'vikas', 'अंजलि': 'anjali',
      'रोहित': 'rohit', 'नेहा': 'neha', 'प्रिया': 'priya', 'राहुल': 'rahul'
    };

    const words = cleanInput.split(/\s+/);
    baseParts = words.map(w => translitMap[w] || 'kavi');
  }

  const p1 = baseParts[0] || 'writer';
  const p2 = baseParts[1] || '';
  const p3 = baseParts[2] || '';

  const candidates = [];
  if (p1 && p2 && p3) {
    candidates.push(`${p1}_${p2}_${p3}`);
    candidates.push(`${p1}_${p3}`);
    candidates.push(`${p1}_${p2}`);
  } else if (p1 && p2) {
    candidates.push(`${p1}_${p2}`);
    candidates.push(`${p1}_${p2}_writer`);
    candidates.push(`${p1}${p2}`);
  } else if (p1) {
    candidates.push(`${p1}_writer`);
    candidates.push(`${p1}_kalam`);
    candidates.push(`${p1}_2026`);
  }

  candidates.push(`${p1}_${Math.floor(100 + Math.random() * 900)}`);

  const availableList = [];
  for (const cand of candidates) {
    const cleanCand = sanitizeUsername(cand);
    const res = await checkUsernameAvailability(cleanCand);
    if (res.available && !availableList.includes(cleanCand)) {
      availableList.push(cleanCand);
      if (availableList.length >= 3) break;
    }
  }

  return availableList;
};

// 3. Check if User can change username this month (Limit: 1 time per 30 days)
export const canChangeUsernameThisMonth = (userEmail) => {
  try {
    const key = `username_changes_${(userEmail || 'user').toLowerCase().trim()}`;
    const history = JSON.parse(localStorage.getItem(key) || '[]');
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentChanges = history.filter(ts => typeof ts === 'number' && ts > thirtyDaysAgo);
    
    const used = recentChanges.length;
    const remaining = Math.max(0, 1 - used);
    
    let daysLeft = 30;
    if (used > 0 && recentChanges[0]) {
      const msPassed = Date.now() - recentChanges[recentChanges.length - 1];
      const msRemaining = (30 * 24 * 60 * 60 * 1000) - msPassed;
      daysLeft = Math.ceil(msRemaining / (24 * 60 * 60 * 1000));
    }

    return {
      allowed: used < 1,
      remainingChanges: remaining,
      usedChanges: used,
      daysLeft: daysLeft,
      message: used >= 1 
        ? `⚠️ आप 30 दिन में केवल 1 बार ही यूज़रनेम बदल सकते हैं। अगला बदलाव ${daysLeft} दिन बाद संभव होगा।` 
        : `इस माह शेष बदलाव: 1/1`
    };
  } catch (e) {
    return { allowed: true, remainingChanges: 1, usedChanges: 0, daysLeft: 0, message: 'इस माह शेष बदलाव: 1/1' };
  }
};

// 4. Record Username Change Event Timestamp
export const recordUsernameChange = (userEmail) => {
  try {
    const key = `username_changes_${(userEmail || 'user').toLowerCase().trim()}`;
    const history = JSON.parse(localStorage.getItem(key) || '[]');
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentChanges = history.filter(ts => typeof ts === 'number' && ts > thirtyDaysAgo);
    recentChanges.push(Date.now());
    localStorage.setItem(key, JSON.stringify(recentChanges));
  } catch (e) {}
};
