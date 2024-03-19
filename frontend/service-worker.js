self.addEventListener('fetch', function (event) {
    const { method, headers, url } = event.request;
    console.log('[SW] Fetch Method : ', method);
    console.log('[SW] Fetch Headers : ', headers);
    console.log('[SW] Fetch URL : ', url);
});
