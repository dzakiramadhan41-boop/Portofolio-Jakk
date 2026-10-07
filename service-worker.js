// ===========================
// SERVICE WORKER – Dzaki Pasha Portfolio PWA
// Cache-first strategy for static assets
// ===========================

const CACHE_NAME = 'dzaki-portfolio-v1';

// Assets to cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/about.html',
  '/project.html',
  '/penghargaan.html',
  '/contact.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/images/favicon.png',
  '/images/fotoku.jpg',
  '/images/hand tracking.png',
  '/images/finance tracker.png',
  '/images/kostku premium.png',
  '/images/absensi mahasiswa.png'
];

// ===== INSTALL =====
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// ===== ACTIVATE =====
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// ===== FETCH =====
// Cache-first for static assets, network-first for API calls
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET and cross-origin requests
  if (event.request.method !== 'GET') return;
  if (!url.origin.includes(self.location.origin) && !url.href.includes('fonts.googleapis') && !url.href.includes('fonts.gstatic')) return;

  // Network-first for GitHub API
  if (url.hostname === 'api.github.com') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cloned);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) return response;
        const cloned = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, cloned);
        });
        return response;
      });
    })
  );
});
