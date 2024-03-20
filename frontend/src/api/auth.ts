import localAxios from '../util/http-common';

const local = localAxios();

/**로그인 */
export async function login() {
    return await local.get(`/api/auth/login`);
}

/**로그아웃 */
export async function logout() {
    return await local.get(`/api/auth/logout`);
}
