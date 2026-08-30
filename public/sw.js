// Bolti Kalam PWA Service Worker with Zomato-style Background Push Notifications & Immediate Auto-Update
const CACHE_NAME = 'bolti-kalam-pwa-v5';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/logo.png',
  '/favicon.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('PWA Cache Assets notice:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 🚀 Network-First for HTML navigation and JS/CSS chunks to ensure desktop & mobile PWA app always gets fresh code
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.includes('/assets/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Stale-While-Revalidate for images / static assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request).then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkRes.clone()));
        }
        return networkRes;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

// 🔔 1. Handle Background Push Notifications (When App is Closed / In Background)
self.addEventListener('push', (event) => {
  let data = {
    title: 'बोलती कलम 🪶',
    body: 'आज का नया काव्य शब्द व दैनिक प्रतियोगिता शुरू हो चुकी है! ऐप खोलें 📲',
    icon: '/logo.png',
    badge: '/logo.png',
    url: '/'
  };

  try {
    if (event.data) {
      const payload = event.data.json();
      data = { ...data, ...payload };
    }
  } catch (e) {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/logo.png',
    badge: data.badge || '/logo.png',
    vibrate: [200, 100, 200, 100, 200],
    tag: data.tag || `bolteekalam-push-${Date.now()}`,
    renotify: true,
    data: {
      url: data.url || '/'
    },
    actions: [
      { action: 'open', title: 'ऐप खोलें 📲' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 🔔 2. Handle Notification Click (Focus open tab or Open App)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          if ('navigate' in client && targetUrl !== '/') {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// 🔔 3. Handle Direct Message from Web App to show notification via Service Worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    self.registration.showNotification(title || 'बोलती कलम 🪶', {
      body: options?.body || 'नई साहित्यिक सूचना!',
      icon: options?.icon || '/logo.png',
      badge: options?.badge || '/logo.png',
      vibrate: options?.vibrate || [200, 100, 200],
      tag: options?.tag || `bk-notif-${Date.now()}`,
      renotify: true,
      data: options?.data || { url: '/' },
      actions: options?.actions || [
        { action: 'open', title: 'ऐप खोलें 📲' }
      ],
      ...options
    });
  }
});


