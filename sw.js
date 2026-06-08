// sw.js — offline cache for Closet. Network-first so updates always reach the
// user when online, with a cached fallback when offline.
const CACHE = 'closet-v2';
const ASSETS = [
  'Closet.html', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon-180.png',
  'frames/ios-frame.jsx', 'screens/Figure.jsx', 'studio/image-slot.js',
  'studio/core.jsx', 'studio/data.jsx', 'studio/Home.jsx', 'studio/Closet.jsx',
  'studio/Builder.jsx', 'studio/ItemDetail.jsx', 'studio/AddItem.jsx', 'studio/Drops.jsx',
  'studio/Profile.jsx', 'studio/LogSheet.jsx', 'studio/WearLog.jsx', 'studio/Laundry.jsx',
  'studio/Discover.jsx', 'studio/Wishlist.jsx', 'studio/AvatarSheet.jsx', 'studio/App.jsx',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first: try the network (and refresh the cache), fall back to cache
// when offline; navigations fall back to the app shell.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || (req.mode === 'navigate' ? caches.match('Closet.html') : undefined)))
  );
});
