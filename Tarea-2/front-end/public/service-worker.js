// public/service-worker.js

const CACHE_NAME = 'videocall-shell-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/call.html',
  '/offline.html',
  '/manifest.json',
  '/src/main.js',
  '/AntonioOssa-192.png',
  '/AntonioOssa-512.png'
];

// Precacheo
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Limpieza de cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME)
            .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Cache‑first / offline fallback
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/offline.html'))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(c => c || fetch(event.request))
  );
});

// Push: escuchamos y mostramos notificación
self.addEventListener('push', event => {
  console.log('📨 Service Worker: push event recibido', event);
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    console.error('❌ Error parseando payload push:', e);
  }
  const { title, body, peerId } = data;
  event.waitUntil(
    self.registration.showNotification(title || '🛎️ Llamada entrante', {
      body:   body   || 'Tienes una llamada',
      icon:   '/AntonioOssa-192.png',
      badge:  '/AntonioOssa-192.png',
      data:   { peerId },
      actions: [
        { action: 'accept', title: '📞 Aceptar' },
        { action: 'reject', title: '❌ Rechazar' }
      ]
    })
  );
});

// Notification click: enviamos mensaje a todas las ventanas
self.addEventListener('notificationclick', event => {
  const { action } = event;
  const peerId = event.notification.data.peerId;
  console.log('🔔 notificationclick action=', action, 'peerId=', peerId);
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        if (clientList.length > 0) {
          clientList.forEach(client =>
            client.postMessage({
              type: 'incoming-call-response',
              action,
              peerId
            })
          );
        } else {
          self.clients.openWindow(`/call.html?action=${action}&peerId=${peerId}`);
        }
      })
  );
});
