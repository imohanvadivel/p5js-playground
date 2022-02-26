const version = "p5 v2.0";

const cacheFiles = [
  "./",
  "./dist/app.css",
  "./dist/style.css",
  "./dist/app.js",
  "./dist/editor.worker.js",
  "./dist/ts.worker.js",
  "./dist/codicon-4OFKM6SH.ttf",
  "./dist/favicon.ico",
];
let channel = null;

try {
  channel = new BroadcastChannel("p5-refresh");
} catch (err) {
  console.log("-");
}

addEventListener("install", (installEvent) => {
  skipWaiting();

  installEvent.waitUntil(
    caches.open(version).then((GlyphsCache) => {
      return GlyphsCache.addAll(cacheFiles);
    })
  );
});

addEventListener("activate", (activateEvent) => {
  activateEvent.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        let cacheNameAry = cacheNames.filter((e) => /p5/gi.test(e));

        return Promise.all(
          cacheNameAry.map((cacheName) => {
            if (cacheName !== version) {
              caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => clients.claim())
      .then(() => {
        if (channel) channel.postMessage(`refresh`);
      })
  );
});

addEventListener("fetch", (fetchEvent) => {
  const request = fetchEvent.request;
  fetchEvent.respondWith(
    caches.match(request).then((resFromCache) => {
      if (resFromCache) return resFromCache;
      return fetch(request);
    })
  );
});
