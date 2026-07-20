const CACHE_NAME = 'jwebapps-v22';
const ASSETS = [
  './',
  '.index.html',
  './site.webmanifest',
  './enadsys.json',
  './logo.png',
  './qrcode.png',
  './mainpic.png',
  '../zzz_main/app.js','../zzz_main/lib.js',
  '../zzz_main/img/msgr.png', '../zzz_main/img/telephone.png', '../zzz_main/img/sms.png'
];

// Install and cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .catch(err => console.log('Cache error:', err))
  );
});

// Remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

// Serve from cache or network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => cachedResponse || fetch(event.request))
  );
});