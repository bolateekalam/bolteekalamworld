// Bolatee Kalam Web Push & Inactivity Notification Service with Supabase Cloud Sync
import { supabase } from './supabase';

const LAST_ACTIVE_KEY = 'bolteekalam_last_active_timestamp';
const NOTIF_PERM_KEY = 'bolteekalam_notification_permission';
const INACTIVITY_NOTIF_SENT_KEY = 'bolteekalam_inactivity_notif_sent';
const GLOBAL_CLOUD_NOTIFS_KEY = 'bolteekalam_global_cloud_notifications_v2';

// 1. Request Notification Permission
export const requestNotificationPermission = async () => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Browser does not support notifications');
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    localStorage.setItem(NOTIF_PERM_KEY, permission);
    return permission;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return 'denied';
  }
};

// 2. Check current notification permission status
export const getNotificationPermission = () => {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission;
};

// 3. Send Local / Background Web Push Notification (Android PWA & Desktop Compatible)
export const sendBrowserNotification = async (title, options = {}) => {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;

  let perm = Notification.permission;
  if (perm !== 'granted') {
    perm = await requestNotificationPermission();
  }

  if (perm === 'granted') {
    const notifOptions = {
      icon: '/logo.png',
      badge: '/logo.png',
      vibrate: [200, 100, 200],
      tag: options.tag || `bolteekalam-notif-${Date.now()}`,
      body: options.body || 'बोलती कलम साहित्यिक मंच पर आपका स्वागत है।',
      data: options.data || { url: window.location.origin },
      actions: options.actions || [
        { action: 'open', title: 'ऐप खोलें 📲' }
      ],
      ...options
    };

    // 1. Primary method: Service Worker Registration (Required on Android / Chrome Mobile / PWA)
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration && typeof registration.showNotification === 'function') {
          await registration.showNotification(title, notifOptions);
          return true;
        } else if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'SHOW_NOTIFICATION',
            title,
            options: notifOptions
          });
          return true;
        }
      } catch (swErr) {
        console.warn('ServiceWorker showNotification notice:', swErr);
      }
    }

    // 2. Desktop Fallback: new Notification()
    try {
      const notif = new Notification(title, notifOptions);
      notif.onclick = function (event) {
        event.preventDefault();
        const targetUrl = options.data?.url || window.location.origin;
        window.focus();
        window.open(targetUrl, '_blank');
        notif.close();
      };
      return true;
    } catch (e) {
      console.warn('Fallback Notification constructor notice:', e);
      return false;
    }
  }
  return false;
};

// 4. Fetch Global Cloud Broadcast Notifications (Ensures all mobile & desktop users have stored notifications)
export const fetchCloudBroadcastNotifications = async () => {
  let cloudList = [];

  // A. Fetch from Supabase PostgreSQL notifications table
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    if (!error && data && data.length > 0) {
      cloudList = data.map(n => ({
        id: n.id,
        title: n.title,
        desc: n.body || n.description || '',
        time: n.created_at ? new Date(n.created_at).toLocaleDateString('hi-IN') : 'हाल ही में',
        isUnread: true,
        url: n.url || window.location.origin,
        type: n.type || 'broadcast'
      }));

      // Cache locally
      try {
        localStorage.setItem(GLOBAL_CLOUD_NOTIFS_KEY, JSON.stringify(cloudList));
      } catch (e) {}

      return cloudList;
    }
  } catch (err) {
    console.warn('Supabase notifications fetch notice:', err);
  }

  // B. Fallback from shared local storage cache
  try {
    const cached = localStorage.getItem(GLOBAL_CLOUD_NOTIFS_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {}

  return [];
};

// 5. Send Instant Test Push Notification
export const sendTestNotification = async () => {
  const perm = await requestNotificationPermission();
  if (perm !== 'granted') {
    alert('कृपया ब्राउज़र में नोटिफिकेशन अनुमति (Allow Permission) प्रदान करें!');
    return false;
  }

  const title = '🔔 बोलती कलम: पुश नोटिफिकेशन सक्रिय!';
  const body = 'बधाई हो! अब आपको नए काव्य सत्र, दैनिक चुनौती, यूट्यूब लाइव और ज्यूरी परिणामों की सूचनाएं तुरंत मिलेंगी।';
  const url = window.location.origin;

  // 1. Send system browser push
  await sendBrowserNotification(title, {
    body,
    tag: 'bolteekalam-test-push',
    data: { url }
  });

  // 2. Persist in local storage & dispatch in-app notification event
  try {
    const newEntry = {
      id: `test-notif-${Date.now()}`,
      title,
      desc: body,
      time: 'अभी-अभी',
      isUnread: true,
      type: 'broadcast',
      url
    };

    const existingList = JSON.parse(localStorage.getItem('bolteekalam_notifications_v1') || '[]');
    const updated = [newEntry, ...existingList.filter(i => i.id !== newEntry.id)].slice(0, 30);
    localStorage.setItem('bolteekalam_notifications_v1', JSON.stringify(updated));

    window.dispatchEvent(new CustomEvent('bolteekalam_new_notification', { detail: newEntry }));
  } catch (e) {}

  return true;
};

// 6. Track User Activity Heartbeat
export const logUserActiveHeartbeat = () => {
  try {
    const now = Date.now();
    localStorage.setItem(LAST_ACTIVE_KEY, now.toString());
  } catch (e) {}
};

// 7. Zomato-Style Catchy Re-engagement & Inactivity Notification Engine
export const checkAndTriggerInactivityNotification = () => {
  try {
    if (typeof window === 'undefined') return;

    const perm = getNotificationPermission();
    if (perm !== 'granted') return;

    const lastActiveStr = localStorage.getItem(LAST_ACTIVE_KEY);
    if (!lastActiveStr) {
      logUserActiveHeartbeat();
      return;
    }

    const lastActiveTime = parseInt(lastActiveStr, 10);
    const now = Date.now();
    const diffHours = (now - lastActiveTime) / (1000 * 60 * 60);

    const lastNotifStage = localStorage.getItem('bolteekalam_last_inactivity_stage') || '0';

    // 1. Stage 1: 18 - 24 Hours Inactive (Daily Word & Writing Prompt)
    if (diffHours >= 18 && diffHours < 36 && lastNotifStage !== 'stage1') {
      sendBrowserNotification('✍️ आपकी कलम क्यों खामोश है? 🪶', {
        body: 'आज का दैनिक काव्य शब्द जारी हो चुका है! बोलती कलम खोलकर अपनी नई रचना लिखें और दाद पाएं।',
        tag: 'bolteekalam-zomato-stage1',
        data: { url: window.location.origin }
      });
      localStorage.setItem('bolteekalam_last_inactivity_stage', 'stage1');
      return;
    }

    // 2. Stage 2: 36 - 60 Hours Inactive (Streak & Habit Loss Warning)
    if (diffHours >= 36 && diffHours < 72 && lastNotifStage !== 'stage2') {
      sendBrowserNotification('🔥 अरे रे! आपकी काव्य स्ट्रीक टूटने वाली है!', {
        body: 'लगातार सक्रिय रहने की स्ट्रीक न खोएं ⏱️ सिर्फ 2 मिनट बोलती कलम ऐप खोलकर अपनी स्ट्रीक सुरक्षित करें।',
        tag: 'bolteekalam-zomato-stage2',
        data: { url: window.location.origin }
      });
      localStorage.setItem('bolteekalam_last_inactivity_stage', 'stage2');
      return;
    }

    // 3. Stage 3: 72+ Hours Inactive (Milestone Certificate & Literary Passbook)
    if (diffHours >= 72 && lastNotifStage !== 'stage3') {
      sendBrowserNotification('📜 आपका मानद सम्मान पत्र इंतज़ार में है! 🏆', {
        body: 'बोलती कलम राष्ट्रीय मंच पर आपका डिजिटल E-Certificate तैयार है! ऐप खोलें और सम्मान पत्र देखें।',
        tag: 'bolteekalam-zomato-stage3',
        data: { url: `${window.location.origin}/certificates` }
      });
      localStorage.setItem('bolteekalam_last_inactivity_stage', 'stage3');
      return;
    }
  } catch (e) {
    console.warn('Inactivity notification check notice:', e);
  }
};

// 8. Global Real-time Broadcast Channel for Live Mobile & Desktop Push
let globalBroadcastChannel = null;

export const subscribeToCloudNotifications = (onNotificationReceived) => {
  try {
    if (!globalBroadcastChannel) {
      globalBroadcastChannel = supabase.channel('bk_global_broadcast_channel');
      
      globalBroadcastChannel
        .on('broadcast', { event: 'push_notification' }, (payload) => {
          const notif = payload.payload;
          if (notif) {
            // Trigger Mobile Web Push Notification in system notification bar
            sendBrowserNotification(notif.title, {
              body: notif.desc || notif.body,
              url: notif.url || window.location.origin,
              tag: `broadcast-${notif.id || Date.now()}`
            });

            // Trigger In-App notification callback
            if (onNotificationReceived) {
              onNotificationReceived(notif);
            }
          }
        })
        .subscribe();
    }
  } catch (e) {
    console.warn('Realtime broadcast channel subscription notice:', e);
  }
};

// 9. Broadcast Admin Notification to ALL Connected Devices (Cloud DB + Realtime Channel + Local Storage)
export const broadcastAdminNotification = async (notifPayload) => {
  const { title, body, url = window.location.origin } = notifPayload;

  const newEntry = {
    id: `admin-notif-${Date.now()}`,
    title,
    desc: body,
    body,
    time: 'अभी-अभी',
    isUnread: true,
    url,
    type: 'broadcast'
  };

  // 1. Show browser push notification locally on admin device
  await sendBrowserNotification(title, {
    body,
    tag: `admin-broadcast-${Date.now()}`,
    data: { url }
  });

  // 2. Broadcast to all mobile & desktop users across the nation in real-time
  try {
    const channel = globalBroadcastChannel || supabase.channel('bk_global_broadcast_channel');
    await channel.send({
      type: 'broadcast',
      event: 'push_notification',
      payload: newEntry
    });
  } catch (err) {
    console.warn('Supabase Realtime broadcast send notice:', err);
  }

  // 3. Store in Supabase PostgreSQL Database (so new/offline mobile users get it on open)
  try {
    await supabase.from('notifications').insert([
      {
        title,
        body,
        url,
        type: 'broadcast',
        is_global: true
      }
    ]);
  } catch (dbErr) {
    console.warn('Supabase notifications table insert notice:', dbErr);
  }

  // 4. Store in Local & Global Cache Storage
  try {
    const existingList = JSON.parse(localStorage.getItem('bolteekalam_notifications_v1') || '[]');
    const updated = [newEntry, ...existingList.filter(i => i.id !== newEntry.id)].slice(0, 30);
    localStorage.setItem('bolteekalam_notifications_v1', JSON.stringify(updated));
    localStorage.setItem(GLOBAL_CLOUD_NOTIFS_KEY, JSON.stringify(updated));

    // Dispatch global event for in-app notification drawer
    window.dispatchEvent(new CustomEvent('bolteekalam_new_notification', { detail: newEntry }));
  } catch (e) {}
};

