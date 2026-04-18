<<<<<<< HEAD
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
=======
/* =============================================
   Tawwa (طوّع) — Service Worker
   Strategy:
     • App Shell (HTML/CSS/JS)  → Cache-first, fallback to network
     • Supabase API / CDN fonts → Network-first, fallback to cache
     • Everything else          → Network-first, no cache storage
   ============================================= */

const CACHE_VERSION = 'tawwa-v4';
const SHELL_CACHE   = `${CACHE_VERSION}-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

/** Core App Shell — cached on install, served instantly offline. */
const APP_SHELL = [
  '/',
  '/index.html',
  '/index.css',
  '/app.js',
  '/supabaseClient.js',
  '/points.js',
  '/live-data.js',
  '/i18n.js',
  '/ux-global.js',
  '/fallback-illustrations.js',
  '/manifest.json',
  '/default_avatar.png',
  '/fallback-education.png',
  '/fallback-elderly.png',
  '/fallback-environment.png',
];

/** Patterns that should always bypass the cache (live data). */
const NEVER_CACHE = [
  /supabase\.co\/functions/,
  /supabase\.co\/rest/,
  /supabase\.co\/auth/,
  /supabase\.co\/realtime/,
  /chrome-extension/,
];

/** Patterns that get a runtime cache with network-first. */
const RUNTIME_HOST_PATTERNS = [
  /fonts\.googleapis\.com/,
  /fonts\.gstatic\.com/,
  /lh3\.googleusercontent\.com/,
];

// ── Install: pre-cache App Shell ─────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()) // Activate immediately without waiting
  );
});

// ── Activate: prune stale caches ─────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== SHELL_CACHE && key !== RUNTIME_CACHE)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim()) // Take control of all open tabs
  );
});

// ── Fetch: routing strategy ───────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Non-GET requests → always pass through (POST, etc.)
  if (request.method !== 'GET') return;

  // 2. Supabase API calls → always bypass (live data must be fresh)
  if (NEVER_CACHE.some(re => re.test(request.url))) return;

  // 3. App Shell requests → Cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request, SHELL_CACHE));
    return;
  }

  // 4. External resources (fonts, images) → Network-first with runtime cache
  if (RUNTIME_HOST_PATTERNS.some(re => re.test(request.url))) {
    event.respondWith(networkFirst(request, RUNTIME_CACHE));
    return;
  }

  // 5. Everything else → network only
});

// ── Cache-first strategy ──────────────────────────────────────────────────────
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Offline and not in cache — return a minimal offline page for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      const fallback = await caches.match('/index.html');
      if (fallback) return fallback;
    }
    return new Response('Offline', { status: 503 });
  }
}

// ── Network-first strategy ────────────────────────────────────────────────────
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached ?? new Response('', { status: 503 });
  }
}
>>>>>>> 0491e48748a4e8a561a915951c263da89295a035
