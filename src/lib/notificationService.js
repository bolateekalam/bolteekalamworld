// Bolti Kalam Web Push & Inactivity Notification Service

const LAST_ACTIVE_KEY = 'bolteekalam_last_active_timestamp';
const NOTIF_PERM_KEY = 'bolteekalam_notification_permission';
const INACTIVITY_NOTIF_SENT_KEY = 'bolteekalam_inactivity_notif_sent';

// 1. Request Notification Permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
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
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
};

// 3. Send Local Web Push Notification
export const sendBrowserNotification = (title, options = {}) => {
  if (!('Notification' in window)) return false;

  if (Notification.permission === 'granted') {
    try {
      const notif = new Notification(title, {
        icon: '/logo.png',
        badge: '/logo.png',
        vibrate: [200, 100, 200],
        tag: options.tag || 'bolteekalam-general',
        body: options.body || 'बोलती कलम साहित्यिक मंच पर आपका स्वागत है।',
        data: options.data || { url: window.location.origin },
        ...options
      });

      notif.onclick = function (event) {
        event.preventDefault();
        const targetUrl = options.data?.url || window.location.origin;
        window.focus();
        window.open(targetUrl, '_blank');
        notif.close();
      };

      return true;
    } catch (e) {
      console.warn('Push notification delivery warning:', e);
      return false;
    }
  }
  return false;
};

// 4. Track User Activity Heartbeat
export const logUserActiveHeartbeat = () => {
  try {
    const now = Date.now();
    localStorage.setItem(LAST_ACTIVE_KEY, now.toString());
    localStorage.removeItem(INACTIVITY_NOTIF_SENT_KEY);
  } catch (e) {}
};

// 5. Automatic Inactivity Check (e.g. 2 Days / 48h Inactivity Notification)
export const checkAndTriggerInactivityNotification = () => {
  try {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const lastActiveStr = localStorage.getItem(LAST_ACTIVE_KEY);
    if (!lastActiveStr) {
      logUserActiveHeartbeat();
      return;
    }

    const lastActiveTime = parseInt(lastActiveStr, 10);
    const now = Date.now();
    const twoDaysMs = 48 * 60 * 60 * 1000; // 48 Hours

    const alreadySent = localStorage.getItem(INACTIVITY_NOTIF_SENT_KEY);

    if (now - lastActiveTime > twoDaysMs && !alreadySent) {
      sendBrowserNotification('✍️ बोलती कलम: आपकी लेखनी की प्रतीक्षा है!', {
        body: 'आप 2 दिन से मंच पर नहीं आए हैं! आज का नया शब्द देखें, कविता लिखें और अपनी स्ट्रीक जारी रखें।',
        tag: 'bolteekalam-inactivity',
        data: { url: window.location.origin }
      });
      localStorage.setItem(INACTIVITY_NOTIF_SENT_KEY, 'true');
    }
  } catch (e) {}
};

// 6. Broadcast Admin Notification to Local Bus & Store
export const broadcastAdminNotification = (notifPayload) => {
  const { title, body, url = window.location.origin } = notifPayload;

  // 1. Show browser push notification
  sendBrowserNotification(title, {
    body,
    tag: `admin-broadcast-${Date.now()}`,
    data: { url }
  });

  // 2. Persist in notifications storage for in-app bell drawer
  try {
    const existingList = JSON.parse(localStorage.getItem('bolteekalam_inapp_notifications') || '[]');
    const newEntry = {
      id: `admin-notif-${Date.now()}`,
      title,
      description: body,
      time: 'अभी-अभी',
      unread: true,
      url,
      type: 'admin_broadcast'
    };
    const updated = [newEntry, ...existingList].slice(0, 30);
    localStorage.setItem('bolteekalam_inapp_notifications', JSON.stringify(updated));

    // Dispatch global event for in-app notification drawer
    window.dispatchEvent(new CustomEvent('bolteekalam_new_notification', { detail: newEntry }));
  } catch (e) {}
};
