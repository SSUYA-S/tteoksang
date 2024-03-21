// 삭제할 키에 대한 메시지 보내기
export function deleteResourceAPICacheKey(key: String) {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            action: 'deleteKey',
            type: 'api',
            key: '/api/resource/' + key,
        });
    }
}
