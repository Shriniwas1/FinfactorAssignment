const CACHE_NAME = 'weather-static-v1';

const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/static/js/bundle.js',
    '/favicon.ico'
];

self.addEventListener('install', (evt) => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(PRECACHE_ASSETS).catch(() => {});
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (evt) => {
    const req = evt.request;
    const url = new URL(req.url);

    // Cache weather API response for offline fallback
    if (url.pathname === '/api/weather') {
        evt.respondWith(
            fetch(req)
                .then(networkResp => {
                    const copy = networkResp.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
                    return networkResp;
                })
                .catch(() => {
                    return caches.match(req).then(cached =>
                        cached ||
                        new Response(JSON.stringify({ ok: false, error: 'offline' }), {
                            headers: { 'Content-Type': 'application/json' }
                        })
                    );
                })
        );
        return;
    }

    // Cache-first for other requests
    evt.respondWith(
        caches.match(req).then(cached => cached || fetch(req).catch(() => cached))
    );
});
