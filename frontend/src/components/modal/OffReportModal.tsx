import { Event, OfflineReportType, Product, Title } from '../../type/types';
import offlineData from '../../dummy-data/report/offline.json';
import { useEffect, useState } from 'react';
import RentFeeModal from './RentFeeModal';
import { Client } from '@stomp/stompjs';
import TitleChangeModal from './TitleChangeModal';
import OffQuarterPage1 from '../../components/section/OffPage/OffQuarterPage1.tsx';

interface Prop {
    offReport: OfflineReportType | null;
    setIsOffReportAvail: React.Dispatch<React.SetStateAction<boolean>>;
    nowTurn: number;
    productList: Product[];
    webSocketId: string;
    webSocketClient: Client;
    titleList: Title[];
    eventList: Event[];
}

export default function OffReportModal(props: Prop) {
    //data load 부분(데이터 도착시 주석 처리 바람)
    const Off = offlineData;
    // const Off = props.offReport;

    const nowTurn = 121;
    // const nowTurn = props.nowTurn;

    //0: 임대료, 1: 보고서
    const [mode, setMode] = useState<number>(0);
    //어떤 종류? 분기, 반기, 여러 반기
    const [reportType, setReportType] = useState<number>(0);
    //페이지
    const [page, setPage] = useState<number>(1);

    const showReport = () => {
        setMode(1);
    };

    useEffect(() => {
        //분기가 안 지난 경우는 아얘 정보가 오지 않으니 고려 안함.
        //몇개 반기, 분기가 지나갔는지 파악
        //1.각 turn수를 바탕으로 해당 분기가 몇 년 몇 월 시작인지 찾기
        //2. 이를 토대로 몇 개의 반기가 지나갔는지 계산하기
        //3. 2개이상 -> reportType 2, 1개 -> reportType 1, 0개 -> reportType 0
        //0개 분기가 지나간 경우는 서버에서 정보가 전해지지 않는다. 무조건 1개 분기에 대한 정보는 있으니, 그를 기준으로 하자

        //지난 턴의 분기 시작은?
        let lastYear = Math.floor((Off.lastGameTurn - 1 + 60) / 360);
        let lastMonth =
            ((Math.floor((Off.lastGameTurn - 1) / 30) + 2) % 12) + 1;
        if (lastMonth <= 2) {
            lastMonth = 12;
            lastYear -= 1;
        } else if (lastMonth <= 5) {
            lastMonth = 3;
        } else if (lastMonth <= 8) {
            lastMonth = 6;
        } else if (lastMonth <= 11) {
            lastMonth = 9;
        }
        //lastMonth === 12면 수정 불필요

        //이번 정산 턴 기준은?
        let nowYear = Math.floor((nowTurn - 1 + 60) / 360);
        let nowMonth = ((Math.floor((nowTurn - 1) / 30) + 2) % 12) + 1;
        if (nowMonth <= 2) {
            nowMonth = 12;
            nowYear -= 1;
        } else if (nowMonth <= 5) {
            nowMonth = 3;
        } else if (nowMonth <= 8) {
            nowMonth = 6;
        } else if (nowMonth <= 11) {
            nowMonth = 9;
        }

        const lastHlf = 2 * lastYear + Math.floor((lastMonth - 1) / 6);
        const nowHlf = 2 * nowYear + Math.floor((nowMonth - 1) / 6);
        if (nowHlf - lastHlf >= 2) {
            setReportType(2);
        } else if (nowHlf - lastHlf == 1) {
            setReportType(1);
        } else {
            setReportType(0);
        }
    }, []);

    /**파산 시 게임 종료 */
    const endGame = () => {
        const webSocketId = props.webSocketId;
        const client = props.webSocketClient;

        //게임 포기 요청 보내기(webSocket)
        client.publish({
            destination: `/app/private/${webSocketId}`,
            body: JSON.stringify({
                type: 'GIVEUP_GAME',
                body: {},
            }),
        });
    };

    return (
        <>
            <div className="absolute w-full h-full top-0 left-0 bg-black opacity-50 z-10 "></div>
            {mode === 0 ? (
                <RentFeeModal
                    rentFeeInfo={Off.rentFeeInfo}
                    startTurn={Off.lastGameTurn}
                    endTurn={nowTurn - 1}
                    showReport={showReport}
                    productList={props.productList}
                    endGame={endGame}
                />
            ) : mode === 1 ? (
                <>
                    {/* x버튼 */}
                    <div
                        className="w-[60%] h-[70%] absolute left-[20%] top-[15%] color-border-subbold border-[0.5vw] bg-white z-10 flex items-center color-text-subbold"
                        style={{ transform: 'rotate(-5deg)' }}
                    ></div>
                    <div className="w-[60%] h-[70%] absolute left-[20%] top-[15%] color-border-subbold border-[0.5vw] bg-white z-20 flex flex-col items-center color-text-subbold">
                        <div className="w-full h-[15%] px-[1vw] py-[1vh] flex justify-between items-center">
                            {reportType === 0 || page === 1 ? (
                                <div className="w-[10%] h-full mx-[1.2vw] my-[1vh]"></div>
                            ) : (
                                <div
                                    className="w-[10%] h-full mx-[1.2vw] my-[1vh] border-[0.3vw] color-border-subbold cursor-pointer flex justify-center items-center"
                                    onClick={() => {
                                        if (page > 1) {
                                            setPage((prev) => prev - 1);
                                        }
                                    }}
                                >
                                    <p className="text-[1.5vw]">이전</p>
                                </div>
                            )}
                            <p className="text-[2vw]">{`미접속 결산`}</p>
                            {reportType === 0 || page === 4 ? (
                                <div className="w-[10%] h-full mx-[1.2vw] my-[1vh]"></div>
                            ) : (
                                <div
                                    className="w-[10%] h-full mx-[1.2vw] my-[1vh] border-[0.3vw] color-border-subbold cursor-pointer flex justify-center items-center"
                                    onClick={() => {
                                        if (page < 4) {
                                            setPage((prev) => prev + 1);
                                        }
                                    }}
                                >
                                    <p className="text-[1.5vw]">다음</p>
                                </div>
                            )}
                        </div>
                        <div className="w-full px-[1vw] h-[0.3vh]">
                            <div className="w-full h-full color-bg-subbold"></div>
                        </div>
                        <div className="w-full h-[85%]">
                            {reportType === 0 ? (
                                <OffQuarterPage1
                                    turn={props.nowTurn}
                                    lastTurn={Off.lastGameTurn}
                                    titleList={props.titleList}
                                    eventList={props.eventList}
                                    productList={props.productList}
                                    webSocketClient={props.webSocketClient}
                                    webSocketId={props.webSocketId}
                                    halfIncome={Off.quarterReport.quarterProfit}
                                    halfOutcome={Off.quarterReport.rentFee}
                                    setMode={setMode}
                                    inProductList={
                                        Off.quarterReport.inProductList
                                    }
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                        <div
                            className="absolute text-[2vw] flex items-center justify-center text-white -top-[1.6vw] -right-[2vw] w-[4vw] h-[4vw] border-[0.4vw] color-border-sublight color-bg-orange1 rounded-full cursor-pointer z-30"
                            onClick={() => {
                                props.setIsOffReportAvail(false);
                            }}
                        >
                            X
                        </div>
                    </div>
                </>
            ) : (
                <TitleChangeModal
                    setMode={setMode}
                    titleList={props.titleList}
                    webSocketId={props.webSocketId}
                    webSocketClient={props.webSocketClient}
                />
            )}
        </>
    );
}
