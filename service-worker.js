/**
 * Creative Gallery Service Worker
 * Implements intelligent caching strategy for smooth offline experience
 * and faster repeat visits with cache versioning
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `creative-gallery-${CACHE_VERSION}`;

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/resources.json',
];

// Image cache configuration
const IMAGE_CACHE_NAME = `creative-gallery-images-${CACHE_VERSION}`;
const MAX_CACHE_SIZE = 50; // Maximum number of images to cache

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old versions of caches
            if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activation complete');
        return self.clients.claim();
      })
  );
});

/**
 * Fetch event - implement intelligent caching strategy
 * - Static assets: Cache first, fallback to network
 * - Images: Network first, fallback to cache with size management
 * - JSON data: Network first, fallback to cache
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and other non-http(s) protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle static assets (cache first strategy)
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            console.log('[Service Worker] Serving from cache:', url.pathname);
            return response;
          }

          return fetch(request)
            .then((response) => {
              // Don't cache non-successful responses
              if (!response || response.status !== 200) {
                return response;
              }

              // Clone and cache the response
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });

              return response;
            })
            .catch(() => {
              console.log('[Service Worker] Offline - returning cached or fallback');
              return caches.match(request);
            });
        })
    );
  }

  // Handle images (network first strategy with cache size management)
  if (isImage(url)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }

          const responseToCache = response.clone();
          
          // Cache the image with size management
          caches.open(IMAGE_CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseToCache);
              // Manage cache size
              manageCacheSize(IMAGE_CACHE_NAME, MAX_CACHE_SIZE);
            });

          return response;
        })
        .catch(() => {
          // Fallback to cached image if offline
          console.log('[Service Worker] Image offline - checking cache:', url.pathname);
          return caches.match(request)
            .then((response) => {
              if (response) {
                return response;
              }
              // Return a placeholder or error image
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#f0f0f0" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-family="sans-serif" font-size="14">Image unavailable</text></svg>',
                {
                  headers: { 'Content-Type': 'image/svg+xml' },
                  status: 200,
                }
              );
            });
        })
    );
  }

  // Handle JSON data (network first strategy)
  if (url.pathname.endsWith('.json')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseToCache);
            });

          return response;
        })
        .catch(() => {
          console.log('[Service Worker] JSON offline - checking cache:', url.pathname);
          return caches.match(request);
        })
    );
  }

  // Default: network first strategy
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

/**
 * Check if URL is a static asset
 */
function isStaticAsset(url) {
  const pathname = url.pathname;
  return pathname === '/' || 
         pathname.endsWith('.html') || 
         pathname.endsWith('.css') || 
         pathname.endsWith('.js') ||
         pathname.endsWith('.json') ||
         pathname.endsWith('.woff') ||
         pathname.endsWith('.woff2') ||
         pathname.endsWith('.ttf');
}

/**
 * Check if URL is an image
 */
function isImage(url) {
  const pathname = url.pathname;
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(pathname);
}

/**
 * Manage cache size to prevent storage overflow
 */
function manageCacheSize(cacheName, maxSize) {
  caches.open(cacheName)
    .then((cache) => {
      cache.keys()
        .then((keys) => {
          if (keys.length > maxSize) {
            // Delete oldest entries (first in, first out)
            const keysToDelete = keys.slice(0, keys.length - maxSize);
            keysToDelete.forEach((key) => {
              console.log('[Service Worker] Removing from cache:', key.url);
              cache.delete(key);
            });
          }
        });
    });
}

/**
 * Message handler for cache management from client
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('[Service Worker] Clearing cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        event.ports[0].postMessage({ success: true });
      });
  }
});
