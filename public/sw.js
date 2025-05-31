// Service Worker for caching audio files and handling fetch errors

const CACHE_NAME = 'music-stream-cache-v1';
const AUDIO_CACHE_NAME = 'music-stream-audio-cache-v1';

// Files to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event - precache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, AUDIO_CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Helper function to determine if a request is for audio
function isAudioRequest(url) {
  return url.pathname.endsWith('.mp3');
}

// Fetch event - network first for audio, cache first for other assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Special handling for audio files
  if (isAudioRequest(url)) {
    event.respondWith(
      // Try network first
      fetch(event.request)
        .then((response) => {
          // Clone the response to store in cache
          const responseToCache = response.clone();
          
          caches.open(AUDIO_CACHE_NAME)
            .then((cache) => {
              // Store the successful response in cache
              cache.put(event.request, responseToCache);
            });
            
          return response;
        })
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If nothing in cache, return a 503 response
              return new Response(null, {
                status: 503,
                statusText: 'Service Unavailable'
              });
            });
        })
    );
  } else {
    // For non-audio assets, use cache-first strategy
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request)
            .then((networkResponse) => {
              // Cache successful responses for next time
              if (networkResponse.ok) {
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseToCache);
                  });
              }
              return networkResponse;
            });
        })
    );
  }
});
