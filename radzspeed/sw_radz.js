const CACHE_NAME = 'jwebapps-v222';
const ASSETS = [
  './',
  '.index.html',
  './site.webmanifest',
  './enadsys.json',
  './logo.png',
  './qrcode.png',
  './mainpic.png',
  './favicon/favicon.ico',
  './favicon/favicon-16x16.png',
  './favicon/favicon-32x32.png',
  './favicon/favicon-96x96.png',
  './favicon/favicon-192x192.png',
  '../zzz_main/app.js','../zzz_main/lib.js',
  '../zzz_main/img/msgr.png', '../zzz_main/img/telephone.png', '../zzz_main/img/sms.png'
];


self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(ASSETS.map(url =>
        cache.add(url).catch(err => console.warn("⚠️ Could not cache:", url, err))
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => new Response("", { status: 408 })))
  );
});
