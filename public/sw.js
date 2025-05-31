// Service Worker for caching audio files and handling fetch errors

const CACHE_NAME = 'audio-cache-v1';

// Files to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event - precache static assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Intercept fetch requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only process audio files
  if (url.pathname.endsWith('.mp3')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response
          const clonedResponse = response.clone();
          
          // Open the cache
          caches.open(CACHE_NAME)
            .then(cache => {
              // Put the response in the cache
              cache.put(event.request, clonedResponse);
            });
          
          return response;
        })
        .catch(error => {
          // Try to get from cache if network fails
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              return new Response('Audio file not available', {
                status: 404,
                headers: { 'Content-Type': 'text/plain' }
              });
            });
        })
    );
  }
});
