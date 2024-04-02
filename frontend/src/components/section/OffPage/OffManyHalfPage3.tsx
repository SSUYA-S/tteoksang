import { useEffect, useState } from 'react';
import { RankReportType } from '../../../type/types';
import { useSelector } from 'react-redux';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

interface Prop {
    participantCount: number;
    rankInfoList: RankReportType[];
    recentRankInfoList: RankReportType[];
}

export default function OffManyHalfPage3(props: Prop) {
    //rankMode 0:판매왕, 1:부자, 2:큰손, 3:벼락부자, 4:떡상
    const [rankMode, setRankMode] = useState<number>(0);
    //isRecent
    const [isRecent, setIsRecent] = useState<boolean>(false);

    const [rankInfoList, setRankInfoList] = useState<RankReportType[]>(
        props.rankInfoList
    );

    useEffect(() => {
        if (isRecent) {
            setRankInfoList(props.recentRankInfoList);
        } else {
            setRankInfoList(props.rankInfoList);
        }
    }, [isRecent]);

    const userNickname = useSelector(
        (state: any) => state.reduxFlag.myProfileSlice.userNickname
    );

    const profileIcon = useSelector(
        (state: any) => state.reduxFlag.reduxSlice.profileIcon
    );
    const profileFrame = useSelector(
        (state: any) => state.reduxFlag.reduxSlice.profileFrame
    );

    const changeMode = (modeId: number) => {
        setRankMode(modeId);
    };

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

    const options = {
        indexAxis: 'y' as const,
        elements: {
            bar: {
                borderWidth: 1,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
                text: '1등과 나의 차이',
            },
        },
    };

    const labels = [''];

    const data = {
        labels,
        datasets: [
            {
                label: '1등',
                data: [rankInfoList[rankMode].theFirstRecord],
                backgroundColor: 'rgb(255, 0, 0)',
            },
            {
                label: `당신 (${
                    rankInfoList[rankMode].myRank <= 100
                        ? rankInfoList[rankMode].myRank + '등'
                        : '상위 ' +
                          Math.round(
                              (rankInfoList[rankMode].myRank /
                                  props.participantCount) *
                                  100
                          ) +
                          '%'
                })`,
                data: [rankInfoList[rankMode].myRecord],
                backgroundColor: 'rgb(0, 0, 255)',
            },
        ],
    };

    /**토글 이벤트 */
    const toggle = () => {
        setIsRecent((prev) => !prev);
    };

    return (
        <>
            <div className="w-full h-full p-[1.5vw] flex flex-col items-center">
                {/* 랭킹 라벨 */}
                <div className="w-full h-[10%] flex justify-between">
                    <p className="h-full text-[2vw]">랭킹</p>
                    <div
                        className={`relative w-[16%] h-full text-[1.5vw] color-border-subbold border-[0.1vw] flex justify-center items-center rounded-[5vh] cursor-pointer  ${
                            isRecent ? 'color-bg-subbold' : 'bg-white'
                        }`}
                        onClick={toggle}
                    >
                        <div
                            className={`absolute top-[50%] h-[90%] aspect-square color-border-subbold border-[0.1vw] rounded-[5vh] bg-white`}
                            style={{
                                left: isRecent ? '85%' : '15%',
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
                {/* 랭킹 버튼 */}
                <div className="w-full flex justify-start text-[1.5vw]">
                    {rankInfoList.map((rankInfo, index) => {
                        return (
                            <div
                                className={`w-[15%] cursor-pointer color-border-subbold border-[0.3vw] ${
                                    rankMode === index
                                        ? 'text-white color-bg-subbold'
                                        : ''
                                }`}
                                onClick={() => changeMode(index)}
                                key={index}
                            >
                                {rankInfo.rankName}
                            </div>
                        );
                    })}
                </div>
                {/* 1등과 나의 스코어 보기 */}
                <div className="w-full h-[40%] flex">
                    {/* 1등의 스코어 */}
                    <div className="w-[50%] h-full p-[0.5vw]">
                        <p className="w-full h-[20%] ml-[0.5vw] mb-[0.5vh] text-left text-[2vw]">
                            1등
                        </p>
                        <div className="w-full h-[80%] m-[0.5vw] border-[0.3vw] p-[0.3vw] color-border-subbold rounded-[0.6vw] flex">
                            <div
                                className="relative w-[30%] m-[0.5vw] rounded-[0.6vw]"
                                style={{ aspectRatio: 1 / 1 }}
                            >
                                <img
                                    className="absolute w-full h-full rounded-[0.6vw]"
                                    src={`/src/assets/images/profile/icon (${rankInfoList[rankMode].theFirstUserInfo.profileIconId}).png`}
                                />
                                <img
                                    className="absolute w-full h-full rounded-[0.6vw]"
                                    src={`/src/assets/images/profile/frame (${rankInfoList[rankMode].theFirstUserInfo.profileFrameId}).png`}
                                />
                            </div>
                            <div className="w-[65%] flex flex-col justify-around items-start">
                                <p className="text-[1.5vw] w-full text-left">
                                    {
                                        rankInfoList[rankMode].theFirstUserInfo
                                            .userNickname
                                    }
                                </p>
                                <p className="text-[1.5vw] w-full text-left">
                                    {rankInfoList[
                                        rankMode
                                    ].theFirstRecord.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* 나의 스코어 */}
                    <div className="w-[50%] h-full p-[0.5vw]">
                        <p className="w-full h-[20%] ml-[0.5vw] mb-[0.5vh] text-left text-[2vw]">
                            당신
                        </p>
                        <div className="w-full h-[80%] m-[0.5vw] border-[0.3vw] p-[0.3vw] color-border-subbold rounded-[0.6vw] flex">
                            <div
                                className="relative w-[30%] m-[0.5vw] rounded-[0.6vw]"
                                style={{ aspectRatio: 1 / 1 }}
                            >
                                <img
                                    className="absolute w-full h-full rounded-[0.6vw]"
                                    src={`/src/assets/images/profile/icon (${profileIcon}).png`}
                                />
                                <img
                                    className="absolute w-full h-full rounded-[0.6vw]"
                                    src={`/src/assets/images/profile/frame (${profileFrame}).png`}
                                />
                            </div>
                            <div className="w-[65%] flex flex-col justify-around items-start">
                                <p className="text-[1.5vw] w-full text-left">
                                    {userNickname}
                                </p>
                                <p className="text-[1.5vw] w-full text-left">
                                    {rankInfoList[
                                        rankMode
                                    ].myRecord.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 통계 자료 보여주기 */}
                <Bar options={options} data={data} height={'50%'} />
            </div>
        </>
    );
}
