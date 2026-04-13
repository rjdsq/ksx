const CACHE_NAME = 'ksx-v5';
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
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRE_CACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

async function handleRequest(req) {
    const { hostname } = self.location;
    const isLocalEnv = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname)
        || hostname === 'localhost'
        || hostname === '[::1]'
        || !hostname.includes('.');

    if (isLocalEnv) return fetch(req);

    const cache = await caches.open(CACHE_NAME);

    // 分片请求直接放行
    if (req.headers.has('range')) return fetch(req);

    // 页面导航：网络优先，3s超时兜底缓存
    if (req.mode === 'navigate') {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 3000);
        try {
            const res = await fetch(req, { signal: controller.signal });
            clearTimeout(t);
            if (res.ok) cache.put(req, res.clone());
            return res;
        } catch {
            return (await cache.match(req)) ?? cache.match('/index.html');
        }
    }

    // 静态资源：缓存优先，后台更新
    const cached = await cache.match(req);
    const netFetch = fetch(req)
        .then(res => {
            if (res.ok) cache.put(req, res.clone());
            return res;
        })
        .catch(() => null);

    return cached ?? netFetch;
}

self.addEventListener('fetch', (e) => {
    const r = e.request;
    if (r.method !== 'GET' || !r.url.startsWith(self.location.origin)) return;
    e.respondWith(handleRequest(r));
});
