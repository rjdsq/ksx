const CACHE_NAME = 'ksx-v4';
const PRE_CACHE = [
    '/',
    '/index.html',
    '/logo/favicon.ico',
    '/js/樱花.js',
    '/js/雨落.js',
    '/js/分手时间.js',
    '/js/水波纹.js'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(PRE_CACHE))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
        )).then(() => self.clients.claim())
    );
});

async function handleRequest(req) {
    const cache = await caches.open(CACHE_NAME);

    if (req.headers.has('range')) {
        return fetch(req);
    }

    if (req.mode === 'navigate') {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        try {
            const networkRes = await fetch(req, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (networkRes.status === 200) cache.put(req, networkRes.clone());
            return networkRes;
        } catch (err) {
            return (await cache.match(req)) || cache.match('/index.html');
        }
    }

    const cachedRes = await cache.match(req);
    const fetchPromise = fetch(req).then(networkRes => {
        if (networkRes.status === 200) {
            cache.put(req, networkRes.clone());
        }
        return networkRes;
    }).catch(() => null);

    return cachedRes || fetchPromise;
}

self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
    e.respondWith(handleRequest(e.request));
});