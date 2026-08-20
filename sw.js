/* VitD-Kinetik Service Worker
   Strategie: network-first. Bei jedem Aufruf wird zuerst der Server gefragt;
   nur wenn das Netz fehlt, kommt die zuletzt gespeicherte Fassung aus dem Cache.
   Damit ist die App auf dem Home-Bildschirm immer aktuell und trotzdem offline nutzbar. */

const CACHE = 'vitd-kinetik';

self.addEventListener('install', function (e) {
  self.skipWaiting();                 // neue Fassung sofort übernehmen
});

self.addEventListener('activate', function (e) {
  e.waitUntil(self.clients.claim());  // sofort für alle offenen Fenster zuständig
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(function (resp) {
        var copy = resp.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        return resp;
      })
      .catch(function () {
        return caches.match(e.request);
      })
  );
});
