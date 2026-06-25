/**
 * Aggressive Creative Gallery Service Worker
 * Stores the site offline for a true app-like experience.
 */

const CACHE_VERSION = 'v2'; // Bumped version to force update
const CACHE_NAME = `creative-gallery-${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `creative-gallery-images-${CACHE_VERSION}`;

// To aggressively store the site immediately, you MUST list all critical 
// starting assets here. The service worker will download these in the background.
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/resources.json',
  // ADD your main CSS, JS, and hero images here to force-download them on install!
];

const MAX_IMAGE_CACHE_SIZE = 200; // Increased to allow storing a full gallery

/**
 * Install event - aggressively pre-cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Aggressive Cache...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
      .catch((error) => console.error('[Service Worker] Install failed:', error))
  );
});

/**
 * Activate event - aggressively clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating and cleaning old caches...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

/**
 * Fetch event - SINGLE routing block
 * Strategy: Aggressive Cache First, fallback to Network, then Cache the result.
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and non-HTTP protocols
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Use a single respondWith block to prevent the "already responded" crash
  event.respondWith(
    (async () => {
      // 1. Aggressive Cache First: Do we have it saved?
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2. Network Fallback: If not in cache, go to the internet
      try {
        const networkResponse = await fetch(request);
        
        // Don't cache bad responses or opaque responses from third parties
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();

        // 3. Cache the new file immediately based on its type
        if (isImage(url)) {
          const imageCache = await caches.open(IMAGE_CACHE_NAME);
          await imageCache.put(request, responseToCache);
          manageCacheSize(IMAGE_CACHE_NAME, MAX_IMAGE_CACHE_SIZE);
        } else {
          const mainCache = await caches.open(CACHE_NAME);
          await mainCache.put(request, responseToCache);
        }

        return networkResponse;

      } catch (error) {
        // 4. Offline Fallback Logic
        if (isImage(url)) {
          // Return an SVG placeholder if the image fails to load entirely
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#f0f0f0" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-family="sans-serif" font-size="14">Image unavailable</text></svg>',
            {
              headers: { 'Content-Type': 'image/svg+xml' },
              status: 200,
            }
          );
        }
        // If an HTML page fails, you could return an offline.html page here if you cached one!
        throw error;
      }
    })()
  );
});

// --- Helper Functions ---

function isImage(url) {
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url.pathname);
}

function manageCacheSize(cacheName, maxSize) {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > maxSize) {
        // Delete oldest entries first
        const keysToDelete = keys.slice(0, keys.length - maxSize);
        keysToDelete.forEach((key) => cache.delete(key));
      }
    });
  });
}

// Client message handler
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      Promise.all(cacheNames.map((name) => caches.delete(name)))
        .then(() => event.ports[0].postMessage({ success: true }));
    });
  }
});

