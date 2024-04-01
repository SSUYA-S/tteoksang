import localAxios from '../util/http-common';

const local = localAxios();

/**나의 적용 중인 상세 정보 조회 */
export async function checkMyProfile() {
    return await local.get(`/api/user`);
}

/**획득한 칭호 조회 */
export async function checkMyTitle() {
    return await local.get(`/api/user/title`);
}

/**달성한 도전과제 조회 */
export async function checkMyAchievements() {
    return await local.get(`/api/user/achievement`);
}

/**유저의 게임 히스토리 조회 */
export async function checkMyHistory() {
    return await local.get(`/api/user/history`);
}

/**이전 플레이 기록 조회 */
export async function checkMyPrevious() {
    return await local.get(`/api/user/previous`);
}

/**회원 탈퇴 */
export async function withdrawal() {
    return await local.delete(`/api/user`);
}

/**테마 변경 */
export async function changeProfileTheme(themeId: number) {
    const body = {
        themeId,
    };
    return await local.put(`/api/user/theme`, body, {});
}

/**프로필 아이콘 변경 */
export async function changeProfileIcon(profileIconId: number) {
    const body = {
        profileIconId,
    };
    return await local.put(`/api/user/profile-icon`, body, {});
}

/**프로필 프레임 변경 */
export async function changeProfileFrame(profileFrameId: number) {
    const body = {
        profileFrameId,
    };
    return await local.put(`/api/user/profile-frame`, body, {});
}

/**닉네임 변경 */
export async function changeNickname(userNickname: string) {
    const body = {
        userNickname,
    };
    return await local.put(`/api/user/nickname`, body, {});
}

/**새게임 시작하기 */
export async function startNewGame() {
    return await local.delete(`/api/user/new-game`);
}
