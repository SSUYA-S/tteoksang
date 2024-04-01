export default function logoutServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .getRegistrations()
            .then(function (registrations) {
                for (let registration of registrations) {
                    console.log('종료가 되었습니다');
                    registration.unregister();
                }
            })
            .catch(function (err) {
                console.log('서비스 워커 등록 해제 중 오류 발생:', err);
            });
    }
}
