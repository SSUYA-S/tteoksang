import localAxios from '../util/http-common';

const local = localAxios();

/**게임 리소스 checksum 조회 */
export async function resourceChecksum() {
    return await local.get(`/api/resource/checksum`);
}

/**도전과제 리스트 조회 */
export async function resourceAchievement() {
    return await local.get(`/api/resource/achievement`);
}

/**칭호 리소스 조회 */
export async function resourceTitle() {
    return await local.get(`/api/resource/title`);
}

/**테마 리소스 조회 */
export async function resourceTheme() {
    return await local.get(`/api/resource/theme`);
}

/**농산물 리소스 조회 */
export async function resourceProduct() {
    return await local.get(`/api/resource/product`);
}

/**이벤트 리소스 조회 */
export async function resourceEvent() {
    return await local.get(`/api/resource/event`);
}

/**시설물 리소스 조회 */
export async function resourceInfra() {
    return await local.get(`/api/resource/infra`);
}

/**메세지 타입 조회 */
export async function resourceMessageType() {
    return await local.get(`/api/resource/meesage-type`);
}

/**프로필 아이콘 조회 */
export async function resourceProfileIcon() {
    return await local.get(`/api/resource/profile-icon`);
}

/**프로필 프레임 조회 */
export async function resourceProfileFrame() {
    return await local.get(`/api/resource/profile-frame`);
}
