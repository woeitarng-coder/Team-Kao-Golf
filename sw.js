// 獨立前綴名稱，確保不同 App 不互相干擾
const CACHE_PREFIX = 'team-kao-golf-cache-';
const CACHE_VERSION = 'v1.0.1';
const CACHE_NAME = CACHE_PREFIX + CACHE_VERSION;

// 需要快取的靜態核心檔案
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// 安裝階段：立即接管並寫入快取
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 啟動階段：只清理「同前綴」且「非當前版本」的舊快取
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME) {
            console.log('[Service Worker] 刪除舊快取:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 攔截請求階段：優先讀取快取，若無則透過網路請求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
