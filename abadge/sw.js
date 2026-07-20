const CACHE_NAME = "messenger-pwa-v11";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./notification.mp3",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
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

self.addEventListener("message", e => {
  if (!e.data) return;
  if (e.data.type === "SET_BADGE" && self.registration.setAppBadge) {
    e.data.count > 0 ? self.registration.setAppBadge(e.data.count) : self.registration.clearAppBadge();
  }
  if (e.data.type === "SHOW_NOTIFICATION") {
    self.registration.showNotification(e.data.title, {
      body: e.data.body,
      icon: "./icons/icon-192.png",
      tag: "chat-message",
      data: { url: e.data.url }
    });
  }
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data.url || "./index.html"));
});