const CACHE_NAME = "age-horoscope-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon.svg"
];

// Install Event - Pre-cache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching assets");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up stale caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Cleared old cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Hybrid strategy (Network-first for APIs, Stale-while-revalidate for static assets)
self.addEventListener("fetch", (event) => {
  const req = event.request;
  
  // Skip non-GET requests and browser extensions
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) {
    return;
  }

  const url = new URL(req.url);

  // API requests: Network-First with Cache fallback
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(req)
        .then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, copy);
            });
          }
          return response;
        })
        .catch(() => {
          // Retrieve from cache if offline
          return caches.match(req).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return new Response(
              JSON.stringify({ error: "offline_fallback" }),
              { headers: { "Content-Type": "application/json" } }
            );
          });
        })
    );
    return;
  }

  // Static Assets & Routes: Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, copy);
            });
          }
          return networkResponse;
        })
        .catch(() => null);

      return cachedResponse || fetchPromise || fetch(req);
    })
  );
});
