// preload 활성화
const enableNavigationPreload = async () => {
    if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
    }
};

const addLocalResourcesToCache = async (resources) => {
    const cache = await caches.open('localImages');
    await cache.addAll(resources);
};
const addApiToCache = async (resources) => {
    const cache = await caches.open('api');
    await cache.addAll(resources);
};
const addNetworkResourcesToCache = async (resources) => {
    const cache = await caches.open('networkImages');
    await cache.addAll(resources);
};

// install event
self.addEventListener('install', (e) => {
    console.log('[Service Worker] installed');
    e.waitUntil(
        addLocalResourcesToCache([
            // '/',
            // '/index.html',
            // '/service-worker.js',
            '/src/assets/bgm/main_theme_bgm.mp3',
            '/src/assets/bgm/start_theme_bgm.mp3',
            '/src/assets/images/background/bg-1-morning.webp',
            '/src/assets/images/background/bg-1-evening.webp',
            '/src/assets/images/background/bg-1-night.webp',
            '/src/assets/images/background/bg-2-morning.webp',
            '/src/assets/images/background/bg-2-evening.webp',
            '/src/assets/images/background/bg-2-night.webp',
            '/src/assets/images/background/bg-3-morning.webp',
            '/src/assets/images/background/bg-3-evening.webp',
            '/src/assets/images/background/bg-3-night.webp',
            '/src/assets/images/background/bg-4-morning.webp',
            '/src/assets/images/background/bg-4-evening.webp',
            '/src/assets/images/background/bg-4-night.webp',
            '/src/assets/images/background/bg-5-morning.webp',
            '/src/assets/images/background/bg-5-evening.webp',
            '/src/assets/images/background/bg-5-night.webp',
            '/src/assets/images/background/bg-6-morning.webp',
            '/src/assets/images/background/bg-6-evening.webp',
            '/src/assets/images/background/bg-6-night.webp',
            '/src/assets/images/background/bg-7-morning.webp',
            '/src/assets/images/background/bg-7-evening.webp',
            '/src/assets/images/background/bg-7-night.webp',
            '/src/assets/images/background/bg-8-morning.webp',
            '/src/assets/images/background/bg-8-evening.webp',
            '/src/assets/images/background/bg-8-night.webp',
            '/src/assets/images/background/bg-9-morning.webp',
            '/src/assets/images/background/bg-9-evening.webp',
            '/src/assets/images/background/bg-9-night.webp',
            '/src/assets/images/background/bg-10-morning.webp',
            '/src/assets/images/background/bg-10-evening.webp',
            '/src/assets/images/background/bg-10-night.webp',
            '/src/assets/images/background/bg-start.png',
            '/src/assets/images/etc/text-start-content.png',
            '/src/assets/images/etc/text-start-title.png',
            '/src/assets/images/backgroundts/bg-1-morning-transparent.webp',
            '/src/assets/images/backgroundts/bg-1-evening-transparent.webp',
            '/src/assets/images/backgroundts/bg-1-night-transparent.webp',
            '/src/assets/images/backgroundts/bg-2-morning-transparent.webp',
            '/src/assets/images/backgroundts/bg-2-evening-transparent.webp',
            '/src/assets/images/backgroundts/bg-2-night-transparent.webp',
            '/src/assets/images/backgroundts/bg-3-morning-transparent.webp',
            '/src/assets/images/backgroundts/bg-3-evening-transparent.webp',
            '/src/assets/images/backgroundts/bg-3-night-transparent.webp',
            '/src/assets/images/backgroundts/bg-4-morning-transparent.webp',
            '/src/assets/images/backgroundts/bg-4-evening-transparent.webp',
            '/src/assets/images/backgroundts/bg-4-night-transparent.webp',
            '/src/assets/images/backgroundts/bg-5-morning-transparent.webp',
            '/src/assets/images/backgroundts/bg-5-evening-transparent.webp',
            '/src/assets/images/backgroundts/bg-5-night-transparent.webp',
            '/src/assets/images/backgroundts/bg-6-morning-transparent.webp',
            '/src/assets/images/backgroundts/bg-6-evening-transparent.webp',
            '/src/assets/images/backgroundts/bg-6-night-transparent.webp',
            '/src/assets/images/backgroundts/bg-7-morning-transparent.webp',
            '/src/assets/images/backgroundts/bg-7-evening-transparent.webp',
            '/src/assets/images/backgroundts/bg-7-night-transparent.webp',
            '/src/assets/images/backgroundts/bg-8-morning-transparent.webp',
            '/src/assets/images/backgroundts/bg-8-evening-transparent.webp',
            '/src/assets/images/backgroundts/bg-8-night-transparent.webp',
            '/src/assets/images/backgroundts/bg-9-morning-transparent.webp',
            '/src/assets/images/backgroundts/bg-9-evening-transparent.webp',
            '/src/assets/images/backgroundts/bg-9-night-transparent.webp',
            '/src/assets/images/backgroundts/bg-10-morning-transparent.webp',
            '/src/assets/images/backgroundts/bg-10-evening-transparent.webp',
            '/src/assets/images/backgroundts/bg-10-night-transparent.webp',
            '/src/assets/images/facility/broker (1).webp',
            '/src/assets/images/facility/broker (2).webp',
            '/src/assets/images/facility/broker (3).webp',
            '/src/assets/images/facility/broker (4).webp',
            '/src/assets/images/facility/broker (5).webp',
            '/src/assets/images/facility/broker (6).webp',
            '/src/assets/images/facility/broker (7).webp',
            '/src/assets/images/facility/broker (8).webp',
            '/src/assets/images/facility/broker (9).webp',
            '/src/assets/images/facility/transport (1).webp',
            '/src/assets/images/facility/transport (2).webp',
            '/src/assets/images/facility/transport (3).webp',
            '/src/assets/images/facility/transport (4).webp',
            '/src/assets/images/facility/transport (5).webp',
            '/src/assets/images/facility/transport (6).webp',
            '/src/assets/images/facility/transport (7).webp',
            '/src/assets/images/facility/transport (8).webp',
            '/src/assets/images/facility/transport (9).webp',
            '/src/assets/images/facility/warehouse (1).webp',
            '/src/assets/images/facility/warehouse (2).webp',
            '/src/assets/images/facility/warehouse (3).webp',
            '/src/assets/images/facility/warehouse (4).webp',
            '/src/assets/images/facility/warehouse (5).webp',
            '/src/assets/images/facility/warehouse (6).webp',
            '/src/assets/images/facility/warehouse (7).webp',
            '/src/assets/images/facility/warehouse (8).webp',
            '/src/assets/images/facility/warehouse (9).webp',
            '/src/assets/images/profile/frame (1).png',
            '/src/assets/images/profile/frame (2).png',
            '/src/assets/images/profile/frame (3).png',
            '/src/assets/images/profile/frame (4).png',
            '/src/assets/images/profile/frame (5).png',
            '/src/assets/images/profile/frame (6).png',
            '/src/assets/images/profile/frame (7).png',
            '/src/assets/images/profile/icon (1).png',
            '/src/assets/images/profile/icon (2).png',
            '/src/assets/images/profile/icon (3).png',
            '/src/assets/images/profile/icon (4).png',
            '/src/assets/images/profile/icon (5).png',
            '/src/assets/images/profile/icon (6).png',
            '/src/assets/images/profile/icon (7).png',
            '/src/assets/images/profile/icon (8).png',
            '/src/assets/images/profile/icon (9).png',
            '/src/assets/images/profile/icon (10).png',
            '/src/assets/images/profile/icon (11).png',
            '/src/assets/images/profile/icon (12).png',
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

//키 삭제
self.addEventListener('message', (event) => {
    const { action, type, key } = event.data;
    if (action === 'deleteKey') {
        caches.open(type).then((cache) => {
            cache.delete(key).then((response) => {
                if (response) {
                    console.log('특정 키가 성공적으로 삭제되었습니다.');
                } else {
                    console.log('삭제할 키를 찾지 못했습니다.');
                }
            });
        });
    }
});

// 캐쉬에 저장
const putInLocalImageCache = async (request, response) => {
    const cache = await caches.open('localImages');
    await cache.put(request, response);
};
const putInApiCache = async (request, response) => {
    const cache = await caches.open('api');
    await cache.put(request, response);
};
const putInNetworkImageCache = async (request, response) => {
    const cache = await caches.open('networkImages');
    await cache.put(request, response);
};

// 리소스가 있는지 없는지 확인
const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
    console.log('가로챔 진입');
    let cache;
    if (request.url.includes('/src/assets/images/')) {
        cache = await caches.open('localImages');
    } else if (request.url.includes('/api/resources')) {
        cache = await caches.open('api');
    } else if (request.url.includes('/api/s3')) {
        cache = await caches.open('networkImages');
    } else {
        cache = await caches.open('v1');
    }

    // console.log('하하');
    // console.log(request);

    const responseFromCache = await cache.match(request);
    if (responseFromCache) {
        // console.log('이미 있으므로 캐쉬에서 데이터를 반환합니다 :');
        // console.log(responseFromCache);
        return responseFromCache;
    }

    const preloadResponse = await preloadResponsePromise;
    if (preloadResponse) {
        console.info('using preload response', preloadResponse);
        putInLocalImageCache(request, preloadResponse.clone());
        return preloadResponse;
    }

    //리소스가 없으면 네트워크로 요청을 보내고 캐쉬에 저장하기
    try {
        // console.log('캐쉬에 데이터가 없으므로 fetch 요청을 보냅니다');
        const responseFromNetwork = await fetch(request, {
            redirect: 'follow',
        });
        // `/src/assets/images/` 경로에 있는 리소스에 대해서만 캐시에 저장
        if (request.url.includes('/src/assets/images/')) {
            await putInLocalImageCache(request, responseFromNetwork.clone());
        }
        // 여기에 checksum 데이터 추가
        else if (request.url.includes('/api/resources')) {
            if (
                !request.url.includes('/api/resources/checksum') &&
                !request.url.includes('.ts')
            ) {
                await putInApiCache(request, responseFromNetwork.clone());
            }
        } else if (request.url.includes('/api/s3')) {
            await putInNetworkImageCache(request, responseFromNetwork.clone());
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

self.addEventListener('fetch', (e) => {
    if (
        e.request.url.startsWith('https://accounts.google.com/o/oauth2/v2/auth')
    ) {
        // console.log('요청 account google');
        // console.log(e);
        // e.respondWith(fetch(e.request, { redirect: 'follow' }))
        //     .then(function (response) {
        //         return response;
        //     })
        //     .catch(function (error) {
        //         console.log(
        //             'Fetch failed; returning offline page instead.',
        //             error
        //         );
        //         return caches.match('/index.html');
        //     });
        return;
    } else if (e.request.headers.get('Accept').includes('text/html') !== -1) {
        // console.log('요청 Accep text/html');
        // console.log(e);
        e.respondWith(
            fetch(e.request, { redirect: 'follow' })
                .then(function (response) {
                    return response;
                })
                .catch(function (error) {
                    console.log(
                        'Fetch failed; returning offline page instead.',
                        error
                    );
                    return caches.match('/index.html');
                })
        );
    } else if (
        e.request.url.includes('auth') ||
        e.request.url.includes('/api/oauth2/authorization/google') ||
        e.request.url.includes('google')
    ) {
        console.log('요청 auth');
        console.log(e);
        e.respondWith(fetch(e.request, { redirect: 'follow' }))
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(
                    'Fetch failed; returning offline page instead.',
                    error
                );
                return caches.match('/index.html');
            });
    } else if (
        e.request.url.includes('/src/assets/images/') ||
        e.request.url.includes('/src/assets/bgm') ||
        e.request.url.includes('/api/resources') ||
        e.request.url.includes('/api/s3')
    ) {
        e.respondWith(
            cacheFirst({
                request: e.request,
                preloadResponsePromise: e.preloadResponse,
                fallbackUrl: '/src/assets/images/frame1.png',
            })
        );
    }
});
