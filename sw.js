
const CACHE_NAME = 'casetest-ngk-pwa-v3.1';
const urlsToCache = ["./", "./index.html", "./manifest.json", "./sw.js", "./3D_CH\u1ea2Y M\u00c1U \u0110\u01af\u1edcNG TI\u00caU H\u00d3A TR\u00caN.html", "./3D_CH\u1ea4N TH\u01af\u01a0NG - V\u1ebeT TH\u01af\u01a0NG NG\u1ef0C.html", "./3D_CH\u1ea4N TH\u01af\u01a0NG C\u1ed8T S\u1ed0NG.html", "./3D_CH\u1ea4N TH\u01af\u01a0NG TH\u1eacN.html", "./3D_CTBK-VTB.html", "./3D_CTSN.html", "./3D_D\u1eca T\u1eacT H\u1eacU M\u00d4N TR\u1ef0C TR\u00c0NG.html", "./3D_GI\u00c3N \u0110\u1ea0I TR\u00c0NG B\u1ea8M SINH.html", "./3D_G\u00c3Y C\u1ed4 X\u01af\u01a0NG \u0110\u00d9I.html", "./3D_G\u00c3Y H\u1ede 2 X\u01af\u01a0NG C\u1eb2NG CH\u00c2N.html", "./3D_G\u00c3Y TH\u00c2N X\u01af\u01a0NG \u0110\u00d9I.html", "./3D_G\u00c3Y TR\u00caN L\u1ed2I C\u1ea6U X\u01af\u01a0NG C\u00c1NH TAY \u1ede TR\u1eba.html", "./3D_H\u1ed8I CH\u1ee8NG CH\u00c8N \u00c9P KHOANG.html", "./3D_H\u1ed8I CH\u1ee8NG THI\u1ebeU M\u00c1U CHI C\u1ea4P.html", "./3D_L\u1ed2NG RU\u1ed8T C\u1ea4P T\u00cdNH \u1ede TR\u1eba C\u00d2N B\u00da.html", "./3D_S\u1eceI TI\u1ebeT NI\u1ec6U.html", "./3D_S\u1eceI \u0110\u01af\u1edcNG M\u1eacT CH\u00cdNH.html", "./3D_TR\u1eacT KH\u1edaP VAI.html", "./3D_T\u0102NG S\u1ea2N L\u00c0NH T\u00cdNH TI\u1ec0N LI\u1ec6T TUY\u1ebeN.html", "./3D_T\u1eaeC RU\u1ed8T S\u01a0 SINH.html", "./3D_T\u1eaeC RU\u1ed8T.html", "./3D_UNG TH\u01af GAN NGUY\u00caN PH\u00c1T.html", "./3D_UNG TH\u01af TH\u1eacN.html", "./3D_UNG TH\u01af TH\u1ef0C QU\u1ea2N.html", "./3D_UNG TH\u01af TR\u1ef0C TR\u00c0NG.html", "./3D_VI\u00caM PH\u00daC M\u1ea0C V\u00c0 C\u00c1C \u1ed4 \u00c1P XE \u1ed4 B\u1ee4NG.html", "./3D_VI\u00caM RU\u1ed8T TH\u1eeaA.html", "./3D_V\u1ebeT TH\u01af\u01a0NG B\u00c0N TAY.html"];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim();
});

// Chiến lược: Stale-While-Revalidate (Lấy cache trả về ngay, đồng thời ngầm tải bản mới)
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Fetch bản mới nhất từ mạng chạy ngầm
      const fetchPromise = fetch(event.request).then(networkResponse => {
        // Cập nhật lại cache nếu request thành công
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(err => {
        // Lỗi mạng (offline) thì không làm gì cả
      });
      
      // Trả về cache ngay lập tức để app mở cực nhanh (nếu có)
      // Nếu chưa có cache, nó sẽ đợi fetchPromise tải xong
      return cachedResponse || fetchPromise;
    })
  );
});
