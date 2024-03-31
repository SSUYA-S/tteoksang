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
            '/src/assets/images/background/bg-main-morning.png',
            '/src/assets/images/background/bg-main-evening.png',
            '/src/assets/images/background/bg-main-night.png',
            '/src/assets/images/background/bg-main-morning.webp',
            '/src/assets/images/background/bg-main-evening.webp',
            '/src/assets/images/background/bg-main-night.webp',
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
        const responseFromNetwork = await fetch(request);
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
    if (e.request.headers.get('Accept').indexOf('text/html') !== -1) {
        let newRequest = new Request(e.request.url, {
            method: 'GET',
            headers: e.request.headers,
            mode: e.request.mode == 'navigate' ? 'cors' : e.request.mode,
            credentials: e.request.credentials,
            redirect: e.request.redirect,
        });
        console.log('Accept 진입 ');
        console.log(newRequest);
        e.respondWith(
            fetch(newRequest, { redirect: 'follow' })
                .then(function (response) {
                    return response;
                })
                .catch(function (error) {
                    console.log(
                        'Fetch failed; returning offline page instead.',
                        error
                    );
                    return caches.match('/offline.html');
                })
        );
        return;
    } else if (
        e.request.url.includes('/auth/') ||
        e.request.url.includes('/api/oauth2/authorization/google')
    ) {
        console.log('서비스 워커가 요청 가로챔 ' + e.request.url);
        console.log('구글 요청은 가로채지 않고 돌려보냄');
        e.respondWith(fetch(e.request));
        return;
    } else if (
        e.request.url.includes('/src/assets/images/') ||
        e.request.url.includes('/src/assets/bgm') ||
        e.request.url.includes('/api/resources') ||
        e.request.url.includes('/api/s3')
    ) {
        // console.log('서비스 워커가 요청 가로챔 ' + e.request.url);
        e.respondWith(
            cacheFirst({
                request: e.request,
                preloadResponsePromise: e.preloadResponse,
                // 여기서 fallbackUrl은 네트워크 요청이 실패했을 때 사용되는 백업 리소스의 URL을 의미합니다
                // 위의 경우 네트워크 요청이 실패 할 시 대체 이미지를 보여줌
                fallbackUrl: '/src/assets/images/frame1.png',
            })
        );
    } else {
        return;
    }
});
