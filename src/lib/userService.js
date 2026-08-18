import { supabase } from './supabase';

// 1. Verify Username Availability against Supabase DB & Reserved List
export const checkUsernameAvailability = async (candidateUsername, currentUserId = null, currentUserEmail = null) => {
  if (!candidateUsername) {
    return { available: false, message: 'कृपया यूज़रनेम दर्ज करें।' };
  }

  const clean = candidateUsername.trim().toLowerCase().replace(/^[@#]/, '').replace(/\s+/g, '_');
  
  if (clean.length < 3) {
    return { available: false, message: 'यूज़रनेम कम से कम 3 अक्षरों का होना चाहिए।' };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(clean)) {
    return { available: false, message: 'यूज़रनेम में केवल अंग्रेजी अक्षर (a-z), अंक (0-9) और अंडरस्कोर (_) मान्य हैं।' };
  }

  const reserved = ['admin', 'super_admin', 'sanjayrai', 'bolteekalam', 'official', 'support', 'help', 'bolateeworld'];
  if (reserved.includes(clean)) {
    return { available: false, message: 'यह यूज़रनेम सुरक्षित (Reserved) है। कृपया कोई अन्य नाम चुनें।' };
  }

  // A. Check in local storage cached profiles
  try {
    const savedProf = localStorage.getItem('bolteekalam_user_profile');
    if (savedProf) {
      const parsed = JSON.parse(savedProf);
      const myUser = parsed.username?.replace(/^[@#]/, '').toLowerCase();
      const myEmail = parsed.email?.toLowerCase();
      if (myUser === clean && (myEmail === currentUserEmail?.toLowerCase() || myUser === currentUserId)) {
        return { available: true, message: '✓ आपका वर्तमान यूज़रनेम' };
      }
    }
  } catch (e) {}

  // B. Check Supabase DB profiles table
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
        return { available: false, message: '❌ यह यूज़रनेम पहले से किसी अन्य लेखक द्वारा लिया जा चुका है।' };
      }
    }
  } catch (e) {
    console.warn('Supabase username check notice:', e);
  }

  return { available: true, message: '✓ यह यूज़रनेम उपलब्ध है!' };
};

// 2. Check if User can change username this month (Limit: 2 times per 30 days)
export const canChangeUsernameThisMonth = (userEmail) => {
  try {
    const key = `username_changes_${(userEmail || 'user').toLowerCase().trim()}`;
    const history = JSON.parse(localStorage.getItem(key) || '[]');
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentChanges = history.filter(ts => typeof ts === 'number' && ts > thirtyDaysAgo);
    
    const used = recentChanges.length;
    const remaining = Math.max(0, 2 - used);
    
    return {
      allowed: used < 2,
      remainingChanges: remaining,
      usedChanges: used,
      message: used >= 2 
        ? '⚠️ आप एक माह में केवल 2 बार ही यूज़रनेम बदल सकते हैं। इस महीने की सीमा समाप्त हो चुकी है।' 
        : `इस माह शेष बदलाव: ${remaining}/2`
    };
  } catch (e) {
    return { allowed: true, remainingChanges: 2, usedChanges: 0, message: 'इस माह शेष बदलाव: 2/2' };
  }
};

// 3. Record Username Change Event Timestamp
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
