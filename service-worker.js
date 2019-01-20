const CACHE = "resources-cache";

const getAndCache = request => {
  return caches.open(CACHE).then(cache => {
    return fetch(request).then(response => {
      cache.put(request, response);
      return response;
    });
  });
};

addEventListener("fetch", evt => {
  const request = evt.request;

  caches.open(CACHE).then(cache => {
    return cache.match(request).then(matching => {
      return matching;
    });
  }).then(cachedResponse => {
    if (cachedResponse) {
      evt.respondWith(cachedResponse);
      evt.waitUntil(getAndCache(request));
      return;
    }

    const response = getAndCache(request);
    evt.respondWith(response);
  });
});
