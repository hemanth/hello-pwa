var CACHE_NAME = 'sw-ex';
var CACHE_VERSION = 1;

self.oninstall = function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME + '-v' + CACHE_VERSION).then(function(cache) {
      return cache.addAll(['/', '/index.html', '/images/yeoman.png']);
    })
  );
};

self.onactivate = function(event) {
  var currentCacheName = CACHE_NAME + '-v' + CACHE_VERSION;
  caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.map(function(cacheName) {
        if (cacheName.indexOf(CACHE_NAME) == -1) {
          return;
        }

        if (cacheName != currentCacheName) {
          return caches.delete(cacheName);
        }
      })
    );
  });
};

self.onfetch = function(event) {
  var request = event.request;
  event.respondWith(
    caches.match(request).then(function(response) {
      if (response) {
        return response;
      }

      return fetch(request).then(function(response) {
        var responseToCache = response.clone();
        caches.open(CACHE_NAME + '-v' + CACHE_VERSION).then(
          function(cache) {
            cache.put(request, responseToCache).catch(function(err) {
              console.warn(request.url + ': ' + err.message);
            });
          });
        return response;
      });
    })
  );
};
