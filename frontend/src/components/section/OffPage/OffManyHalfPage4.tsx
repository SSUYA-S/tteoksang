import { useEffect, useState } from 'react';
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
    newTteoksang: Stat;
    newTteokrock: Stat;
    newBestSeller: Stat;
}

export default function OffManyHalfPage4(props: Prop) {
    const [isRecent, setIsRecent] = useState<boolean>(false);
    const [tteoksang, setTteoksang] = useState<Stat>(props.tteoksangStatistics);
    const [tteokrock, setTteokrock] = useState<Stat>(props.tteokrockStatistics);
    const [bestSeller, setBestSeller] = useState<Stat>(
        props.bestSellerStatistics
    );

    useEffect(() => {
        if (isRecent) {
            setTteoksang(props.tteoksangStatistics);
            setTteokrock(props.tteokrockStatistics);
            setBestSeller(props.bestSellerStatistics);
        } else {
            setTteoksang(props.newTteoksang);
            setTteokrock(props.newTteokrock);
            setBestSeller(props.newBestSeller);
        }
    }, [isRecent]);

    const toggle = () => {
        setIsRecent((prev) => !prev);
    };

    return (
        <>
            <div className="w-full h-full flex items-center">
                <div className="w-[50%] h-full flex flex-col p-[1vw]">
                    <div className="w-full h-[10%] text-[2vw] text-left color-text-subbold flex justify-between">
                        <p>통계</p>
                        <div
                            className={`relative w-[50%] h-full text-[1.5vw] color-border-subbold border-[0.1vw] flex justify-center items-center rounded-[5vh] cursor-pointer  ${
                                isRecent ? 'color-bg-subbold' : 'bg-white'
                            }`}
                            onClick={toggle}
                        >
                            <div
                                className={`absolute top-[50%] h-[90%] aspect-square color-border-subbold border-[0.1vw] rounded-[5vh] bg-white`}
                                style={{
                                    left: isRecent ? '90%' : '10%',
                                    transition: 'all linear 0.3s',
                                    transform: 'translate(-50%, -50%)',
                                }}
                            ></div>
                            {isRecent ? (
                                <p className="text-white">최신</p>
                            ) : (
                                <p className="">과거</p>
                            )}
                        </div>
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
                                    `crop-img-${tteoksang.values[0].productId}`
                                }
                                style={{
                                    aspectRatio: 1 / 1,
                                }}
                            ></div>
                            <p className="text-[1vw]">최다 떡상</p>
                            <p className="text-[1.5vw]">
                                {`${
                                    props.productList[
                                        tteoksang.values[0].productId
                                    ].productName
                                } : ${tteoksang.values[0].value}%`}
                            </p>
                        </div>
                        <div className="w-[50%] h-full flex flex-col items-center">
                            <div
                                className={
                                    'w-[6vw] h-[6vw] bg-no-repeat mx-auto sprite-img-crop ' +
                                    `crop-img-${tteokrock.values[0].productId}`
                                }
                                style={{
                                    aspectRatio: 1 / 1,
                                }}
                            ></div>
                            <p className="text-[1vw]">최다 떡락</p>
                            <p className="text-[1.5vw]">
                                {`${
                                    props.productList[
                                        tteokrock.values[0].productId
                                    ].productName
                                } : ${tteokrock.values[0].value}%`}
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
                                    `crop-img-${bestSeller.values[0].productId}`
                                }
                                style={{
                                    aspectRatio: 1 / 1,
                                }}
                            ></div>
                            <p className="text-[1vw]">최다 거래</p>
                            <p className="text-[1.5vw]">
                                {`${
                                    props.productList[
                                        bestSeller.values[0].productId
                                    ].productName
                                } : ${bestSeller.values[0].value.toLocaleString()}`}
                            </p>
                        </div>
                        <div className="w-[50%] h-full flex flex-col items-center">
                            <div
                                className={
                                    'w-[6vw] h-[6vw] bg-no-repeat mx-auto sprite-img-crop ' +
                                    `crop-img-${
                                        bestSeller.values[
                                            bestSeller.values.length - 1
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
                                        bestSeller.values[
                                            bestSeller.values.length - 1
                                        ].productId
                                    ].productName
                                } : ${bestSeller.values[
                                    bestSeller.values.length - 1
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
                                        className="w-[8vh] h-[8vh] object-contain"
                                        src="/그거"
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
