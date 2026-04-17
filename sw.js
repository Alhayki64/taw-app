const CACHE_NAME = 'taw-app-v3';
const urlsToCache = [
  './',
  './index.html',
  './index.css',
  './app.js',
  './supabaseClient.js',
  './points.js',
  './live-data.js',
  './config.js',
  './i18n.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
