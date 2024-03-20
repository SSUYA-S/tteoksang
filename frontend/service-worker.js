// preload 활성화
const enableNavigationPreload = async () => {
    if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
    }
};

const addResourcesToCache = async (resources) => {
    const cache = await caches.open('v1');
    await cache.addAll(resources);
};

// install event
self.addEventListener('install', (e) => {
    console.log('[Service Worker] installed');
    e.waitUntil(
        addResourcesToCache([
            // '/',
            // '/index.html',
            // '/service-worker.js',
            '/src/assets/images/background/bg-main-morning.png',
            '/src/assets/images/background/bg-main-evening.png',
            '/src/assets/images/background/bg-main-night.png',
            '/src/assets/images/background/bg-start.png',
            '/src/assets/images/etc/text-start-content.png',
            '/src/assets/images/etc/text-start-title.png',
        ])
    );
});

/** 캐쉬삭제
const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  const cacheKeepList = ["v2"];
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};
self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches());
});
*/

// activate event
self.addEventListener('activate', (e) => {
    // console.log('[Service Worker] actived', e);
    e.waitUntil(enableNavigationPreload());
});

// 캐쉬에 저장
const putInCache = async (request, response) => {
    const cache = await caches.open('v1');
    await cache.put(request, response);
};

// 리소스가 있는지 없는지 확인
const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
    const cache = await caches.open('v1');
    const responseFromCache = await cache.match(request);
    if (responseFromCache) {
        // console.log('이미 있으므로 캐쉬에서 데이터를 반환합니다');
        return responseFromCache;
    }

    const preloadResponse = await preloadResponsePromise;
    if (preloadResponse) {
        console.info('using preload response', preloadResponse);
        putInCache(request, preloadResponse.clone());
        return preloadResponse;
    }

    //리소스가 없으면 네트워크로 요청을 보내고 캐쉬에 저장하기
    try {
        // console.log('캐쉬에 데이터가 없으므로 fetch 요청을 보냅니다');
        const responseFromNetwork = await fetch(request);
        // `/src/assets/images/` 경로에 있는 리소스에 대해서만 캐시에 저장
        if (request.url.includes('/src/assets/images/')) {
            await putInCache(request, responseFromNetwork.clone());
        }
        // 여기에 캐시 데이터 추가
        if (request.url.includes('/src/assets/images/')) {
            await putInCache(request, responseFromNetwork.clone());
        }
        return responseFromNetwork;
    } catch (error) {
        const fallbackResponse = await cache.match(fallbackUrl);
        if (fallbackResponse) {
            return fallbackResponse;
        }
        return new Response('Network error happened', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' },
        });
    }
};

// fetch event
self.addEventListener('fetch', (e) => {
    // console.log('[Service Worker] fetched resource ' + e.request.url);
    e.respondWith(
        cacheFirst({
            request: e.request,
            preloadResponsePromise: e.preloadResponse,
            // 여기서 fallbackUrl은 네트워크 요청이 실패했을 때 사용되는 백업 리소스의 URL을 의미합니다
            // 위의 경우 네트워크 요청이 실패 할 시 대체 이미지를 보여줌
            fallbackUrl: '/src/assets/images/frame1.png',
        })
    );
});
