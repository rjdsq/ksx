//更新网页代码或者数据把v1改成v2，本地缓存存储的版本号


const CACHE_NAME = 'ksx-v2';
const OFFLINE_URL = [
    './',
    './index.html',
    './logo/favicon.ico'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(OFFLINE_URL);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((k) => {
                if (k !== CACHE_NAME) return caches.delete(k);
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;

    e.respondWith(
        caches.match(e.request).then((res) => {
            if (res) return res;
            return fetch(e.request).then((netRes) => {
                const url = e.request.url.toLowerCase();
                const isResource = url.match(/\.(jpg|jpeg|png|gif|webp|mp3|ico|js|css|woff2)$/);
                
                if (netRes && (netRes.status === 200 || netRes.status === 0) && isResource) {
                    const resClone = netRes.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(e.request, resClone);
                    });
                }
                return netRes;
            }).catch(() => {
                return null;
            });
        })
    );
});