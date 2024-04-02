import { Achievement } from '../type/types';

export function loadAchievement(
    achievementId: number,
    allAchievement: Achievement[]
) {
    const data = allAchievement.filter(
        (item) => item.achievementId === achievementId
    );

    return data[0];
}
