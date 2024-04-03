import { Achievement } from '../../type/types';
import { loadAchievement } from '../../util/loadAchievement';

type AchievementCardType = {
    achievementId: number;
    achievementInfo: Achievement[];
};
export default function AchievementCard(props: AchievementCardType) {
    // console.log('업적입니다');
    // console.log(props.achievementId);
    const achievement: Achievement = loadAchievement(
        props.achievementId,
        props.achievementInfo
    );
    return (
        <section className="relative w-full flex rounded-[0.4vw] border-[0.2vw] color-border-sublight p-[0.2vw] my-[1vw]">
            <img
                className="w-[15%] h-full p-[0.4vw]"
                src={`/src/assets/images/profile/achivement (${achievement.achievementId}).png`}
                alt=""
            />
            <div className="w-full text-[1.1vw] text-start flex flex-col justify-around mx-[0.4vw]">
                <p>{achievement.achievementName}</p>
                <p>{achievement.achievementDescription}</p>
            </div>
        </section>
    );
}
