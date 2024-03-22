import localAxios from '../util/http-common';

const local = localAxios();

export async function getWebSocketId() {
    return await local.get(`/api/web-socket`);
}
