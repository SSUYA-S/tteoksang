import {
    Product,
    Stat,
    AchievementReport,
    Achievement,
} from '../../../type/types';

interface Prop {
    productList: Product[];
    tteoksangStatistics: Stat;
    tteokrockStatistics: Stat;
    bestSellerStatistics: Stat;
    achievementInfo: Achievement[];
    achievementList: AchievementReport[];
}

export default function HalfPage4(props: Prop) {
    return (
        <>
            <div className="w-full h-full flex items-center">
                <div className="w-[50%] h-full flex flex-col p-[1vw]">
                    <div className="w-full h-[10%] text-[2vw] text-left color-text-subbold">
                        통계
                    </div>
                    {/* 이번 반기 최대 떡상/떡락 */}
                    <div className="w-full h-[10%] text-[1.5vw] text-left color-text-subbold">
                        이번 반기 최대 떡상/떡락
                    </div>
                    <div className="w-full h-[35%] flex justify-around">
                        <div className="w-[50%] h-full flex flex-col items-center">
                            <div
                                className={
                                    'w-[6vw] h-[6vw] bg-no-repeat mx-auto sprite-img-crop ' +
                                    `crop-img-${props.tteoksangStatistics.values[0].productId}`
                                }
                                style={{
                                    aspectRatio: 1 / 1,
                                }}
                            ></div>
                            <p className="text-[1vw]">최다 떡상</p>
                            <p className="text-[1.5vw]">
                                {`${
                                    props.productList[
                                        props.tteoksangStatistics.values[0]
                                            .productId
                                    ].productName
                                } : ${
                                    props.tteoksangStatistics.values[0].value
                                }%`}
                            </p>
                        </div>
                        <div className="w-[50%] h-full flex flex-col items-center">
                            <div
                                className={
                                    'w-[6vw] h-[6vw] bg-no-repeat mx-auto sprite-img-crop ' +
                                    `crop-img-${props.tteokrockStatistics.values[0].productId}`
                                }
                                style={{
                                    aspectRatio: 1 / 1,
                                }}
                            ></div>
                            <p className="text-[1vw]">최다 떡락</p>
                            <p className="text-[1.5vw]">
                                {`${
                                    props.productList[
                                        props.tteokrockStatistics.values[0]
                                            .productId
                                    ].productName
                                } : ${
                                    props.tteokrockStatistics.values[0].value
                                }%`}
                            </p>
                        </div>
                    </div>
                    {/* 최다, 최소 거래량 */}
                    <div className="w-full h-[10%] text-[1.5vw] text-left color-text-subbold">
                        이번 반기 최다 거래 작물
                    </div>
                    <div className="w-full h-[35%] flex justify-around">
                        <div className="w-[50%] h-full flex flex-col items-center">
                            <div
                                className={
                                    'w-[6vw] h-[6vw] bg-no-repeat mx-auto sprite-img-crop ' +
                                    `crop-img-${props.bestSellerStatistics.values[0].productId}`
                                }
                                style={{
                                    aspectRatio: 1 / 1,
                                }}
                            ></div>
                            <p className="text-[1vw]">최다 거래</p>
                            <p className="text-[1.5vw]">
                                {`${
                                    props.productList[
                                        props.bestSellerStatistics.values[0]
                                            .productId
                                    ].productName
                                } : ${props.bestSellerStatistics.values[0].value.toLocaleString()}`}
                            </p>
                        </div>
                        <div className="w-[50%] h-full flex flex-col items-center">
                            <div
                                className={
                                    'w-[6vw] h-[6vw] bg-no-repeat mx-auto sprite-img-crop ' +
                                    `crop-img-${
                                        props.bestSellerStatistics.values[
                                            props.bestSellerStatistics.values
                                                .length - 1
                                        ].productId
                                    }`
                                }
                                style={{
                                    aspectRatio: 1 / 1,
                                }}
                            ></div>
                            <p className="text-[1vw]">최소 거래</p>
                            <p className="text-[1.5vw]">
                                {`${
                                    props.productList[
                                        props.bestSellerStatistics.values[
                                            props.bestSellerStatistics.values
                                                .length - 1
                                        ].productId
                                    ].productName
                                } : ${props.bestSellerStatistics.values[
                                    props.bestSellerStatistics.values.length - 1
                                ].value.toLocaleString()}`}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-[0.2vw] h-[90%] color-bg-subbold"></div>
                <div className="w-[50%] h-full flex flex-col p-[1vw]">
                    <div className="w-full h-[15%] text-[2vw] text-left">
                        달성 도전과제
                    </div>
                    <div className="w-full h-[85%] flex flex-col overflow-y-auto">
                        {props.achievementList.map((achievement) => {
                            return (
                                <div className="w-[90%] h-[10vh] border-[0.3vw] color-border-subbold flex justify-start my-[1vh] p-[1vh] items-center">
                                    <img
                                        className="w-[4vw] h-[4vw] m-[0.8vw]"
                                        src={`/src/assets/images/profile/achivement (${achievement.achievementId}).png`}
                                        alt=""
                                        style={{
                                            aspectRatio: 1 / 1,
                                        }}
                                    />
                                    <div className="w-full h-[8vh] flex flex-col items-start justify-center ml-[0.5vw]">
                                        <p className="text-[3vh]">
                                            {
                                                props.achievementInfo[
                                                    achievement.achievementId -
                                                        1
                                                ].achievementName
                                            }
                                        </p>
                                        <p className="text-[2vh] text-gray-400">
                                            {
                                                props.achievementInfo[
                                                    achievement.achievementId -
                                                        1
                                                ].achievementDescription
                                            }
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
