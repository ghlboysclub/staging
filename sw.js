/* STAGING shell service worker — caches only this page's own files. Bump VERSION to force an update. Rollback: open ?sw=off once, or delete this file + the registration block in index.html. */
var VERSION = 'stg-shell-2', FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-512.png', 'apple-touch-icon.png', 'favicon.svg'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k.indexOf('stg-shell') === 0 && k !== VERSION; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url); if (u.origin !== location.origin || e.request.method !== 'GET') return;   // never touch Google / the app
  e.respondWith(fetch(e.request).then(function (r) { var c = r.clone(); caches.open(VERSION).then(function (ch) { ch.put(e.request, c); }); return r; }).catch(function () { return caches.match(e.request).then(function (m) { return m || caches.match('index.html'); }); }));   // network first, cache when offline
});
