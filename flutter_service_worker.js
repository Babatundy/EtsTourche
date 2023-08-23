'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "de69fe939b2e65cee3ebd585ed07a6dd",
"assets/assets/images/barodag.jpg": "2a757a3032aac566c1456517e59c9fc4",
"assets/assets/images/construction.jpg": "49df3c14e714925e2b1adeedfcde1d72",
"assets/assets/images/email.png": "bdf8bb1a51c07d97354fa8cbdc2ff2d2",
"assets/assets/images/facades.png": "cfa1e56ca0484405949d388791894bc3",
"assets/assets/images/fb.png": "3520ceeb01cdfdf480f57edca9538066",
"assets/assets/images/fence.png": "21cc9ffaba91aeb866f8ab7e548bf25a",
"assets/assets/images/khaled_logo.png": "28d91823867f96c2151416ddd936a675",
"assets/assets/images/lestoitures.jpg": "b7fe11c968549f5c648c6ecf33fa79ed",
"assets/assets/images/logo.png": "3d0c2946c5e1fce21b3eae19ee964705",
"assets/assets/images/md10.png": "b7ad794ecbdcc54cdecb2b0c81f2347f",
"assets/assets/images/md100.png": "08f9efdefe45e183925ea5554380a346",
"assets/assets/images/md12.png": "05209caa54c498af85120e3c7c2c5dba",
"assets/assets/images/md15.png": "ec21ebfd0d8bc7e065c77abfefede557",
"assets/assets/images/md200.png": "cef558ed6c373ebfa419edb63a63eff6",
"assets/assets/images/md28.png": "6e752d90d0dccb608d7630d3558e7683",
"assets/assets/images/md50.png": "ae9058222ca886ae504faf44ee4a8843",
"assets/assets/images/md62.png": "142eea7531f92c78657cf090ffd32757",
"assets/assets/images/md6s.png": "567ff6a09a124740e8d1ce8052fb144a",
"assets/assets/images/md76.png": "cebf539e20b9c68e7d33ba96e26c0376",
"assets/assets/images/md8s.png": "e955a12bb2fcac18dab4a93064cb48b4",
"assets/assets/images/metal1.jpeg": "eb1e14c69512fee5caf9eca0f9f45657",
"assets/assets/images/metal_roll.png": "1f236be432fe651ed1ebfe5defcccff1",
"assets/assets/images/T120.png": "68a76ec09b51ca62947537dae9e65b3b",
"assets/assets/images/T120_04.png": "9d29e966a67bebe88c0852f7f8f3979a",
"assets/assets/images/T95.png": "2ce998e127e451ba2557c5fdd3717782",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/NOTICES": "b1c8c218ddc36785a5dab610a7c3f46b",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/fluttertoast/assets/toastify.css": "a85675050054f179444bc5ad70ffc635",
"assets/packages/fluttertoast/assets/toastify.js": "56e2c9cedd97f10e7e5f1cebd85d53e3",
"canvaskit/canvaskit.js": "97937cb4c2c2073c968525a3e08c86a3",
"canvaskit/canvaskit.wasm": "3de12d898ec208a5f31362cc00f09b9e",
"canvaskit/profiling/canvaskit.js": "c21852696bc1cc82e8894d851c01921a",
"canvaskit/profiling/canvaskit.wasm": "371bc4e204443b0d5e774d64a046eb99",
"favicon.ico": "f55fc14a5aacfc43e10d62eae5df16a6",
"flutter.js": "1cfe996e845b3a8a33f57607e8b09ee4",
"icons/icon-192.png": "10cb611203171b17d7a112813f8e4260",
"icons/icon-512.png": "be0be3ac9d719bed147c786242ebef4d",
"index.html": "1af27556a02bfae8d6712dbfdae611fe",
"/": "1af27556a02bfae8d6712dbfdae611fe",
"main.dart.js": "92db62245102c1f38fbc7b4a4eddb832",
"manifest.json": "8e115f92f307052a39ff202fd4aac01a",
"version.json": "009c9e65172e010890f7f65fde438006"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
