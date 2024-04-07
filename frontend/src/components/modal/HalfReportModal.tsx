import { useEffect, useState } from 'react';
import RentFeeModal from './RentFeeModal';
import {
    Title,
    Event,
    Product,
    HalfReportType,
    HalfReceipt,
    Achievement,
} from '../../type/types';
import TitleChangeModal from './TitleChangeModal';
import { Client } from '@stomp/stompjs';
import { startNewGame } from '../../api/user';
import { httpStatusCode } from '../../util/http-status';

//dummy data(test 후 비활성화 필요)
// import Half from '../../dummy-data/report/half.json';
import HalfPage1 from '../section/HalfPage/HalfPage1';
import HalfPage2 from '../section/HalfPage/HalfPage2';
import HalfPage3 from '../section/HalfPage/HalfPage3';
import HalfPage4 from '../section/HalfPage/HalfPage4';

interface Prop {
    titleList: Title[];
    eventList: Event[];
    productList: Product[];
    setIsHlfReportAvail: React.Dispatch<React.SetStateAction<boolean>>;
    webSocketId: string;
    webSocketClient: Client;
    hlfReport: HalfReportType;
    setStartFlag: React.Dispatch<React.SetStateAction<boolean>>;
    achievementInfo: Achievement[];
}

export default function HalfReportModal(props: Prop) {
    const [mode, setMode] = useState<number>(0);
    const [page, setPage] = useState<number>(1);

    // n년차 n반기 용
    const [year, setYear] = useState<number>(0);
    const [whatHalf, setWhatHalf] = useState<string>('상');

    //반기 총 수익, 지출
    const [halfIncome, setHalfIncome] = useState<number>(0);
    const [halfOutcome, setHalfOutcome] = useState<number>(0);
    const [receipt, setReceipt] = useState<HalfReceipt>({
        totalProductIncome: 0,
        totalProductOutcome: 0,
        totalUpgradeFee: 0,
        totalBrokerFee: 0,
        totalRentFee: 0,
        eventBonus: 0,
        totalIncome: 0,
        totalOutcome: 0,
    });

    //test 종료 후 이거 풀어
    const Half = props.hlfReport;

    /**rentFeeModal에서 확인 누르면 보고서 보여지도록 만들기 */
    const showReport = () => {
        setMode(1);
    };

    useEffect(() => {
        /**날짜 계산 */

        //시작 날짜를 기준으로
        const turn = Half.turn - 181;
        setYear(Math.floor((turn + 60) / 360));
        const month: number = ((Math.floor(turn / 30) + 2) % 12) + 1;
        if (month === 3) {
            setWhatHalf('전');
        } else if (month === 9) {
            setWhatHalf('후');
        }

        //반기 수익 계산
        let income = Half.totalProductIncome;
        let outcome =
            Half.totalProductOutcome +
            Half.totalBrokerFee +
            Half.totalUpgradeFee +
            Half.totalRentFee;
        if (Half.eventBonus >= 0) {
            income += Half.eventBonus;
        } else {
            //event bonus가 음수로 들어왔으니 -를 해줘야 지출로 더해짐
            outcome += -Half.eventBonus;
        }
        setHalfIncome(income);
        setHalfOutcome(outcome);

        const newReceipt: HalfReceipt = {
            totalProductIncome: Half.totalProductIncome,
            totalProductOutcome: Half.totalProductOutcome,
            totalUpgradeFee: Half.totalUpgradeFee,
            totalBrokerFee: Half.totalBrokerFee,
            totalRentFee: Half.totalRentFee,
            eventBonus: Half.eventBonus,
            totalIncome: income,
            totalOutcome: outcome,
        };
        setReceipt(newReceipt);
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

        //웹소켓 통신 비활성화
        client.publish({
            destination: `/app/private/${webSocketId}`,
            body: JSON.stringify({
                type: 'QUIT_GAME',
                body: {},
            }),
        });
        client.deactivate();

        //api호출
        startNewGame()
            .then((res) => {
                if (res.status === httpStatusCode.OK) {
                    props.setStartFlag(false);
                } else {
                    // console.log('response error');
                }
            })
            .catch((err) => {
                // console.log(err);
            });
    };

    return (
        <>
            <div className="absolute w-full h-full top-0 left-0 bg-black opacity-50 z-10 "></div>
            {mode === 0 ? (
                <RentFeeModal
                    rentFeeInfo={Half.quarterReport.rentFeeInfo}
                    startTurn={Half.turn - 91}
                    endTurn={Half.turn - 1}
                    showReport={showReport}
                    productList={props.productList}
                    endGame={endGame}
                />
            ) : mode === 1 ? (
                <>
                    {/* x버튼 */}
                    <img
                        className="absolute z-20 w-[74%] h-[88%]"
                        src="/src/assets/images/layout/ui-bookwrap1.png"
                        alt=""
                    />
                    {/* <div
                        className="w-[60%] h-[70%] absolute left-[20%] top-[15%] color-border-subbold border-[0.5vw] bg-white z-10 flex items-center color-text-subbold"
                        style={{ transform: 'rotate(-5deg)' }}
                    ></div> */}

                    <div className="w-[60%] h-[70%] absolute left-[20%] top-[15%]  z-20 flex flex-col items-center color-text-subbold">
                        <div className="w-full h-[15%] py-[1vh] flex justify-start items-center">
                            {page === 1 ? (
                                <div className="w-[8%] h-[80%] mx-[1.2vw] my-[1vh] "></div>
                            ) : (
                                <div
                                    className="relative bottom-[6%] w-[8%] h-[80%] mx-[1.2vw] my-[1vh] cursor-pointer btn-animation"
                                    onClick={() => {
                                        if (page > 1) {
                                            setPage((prev) => prev - 1);
                                        }
                                    }}
                                >
                                    <img
                                        src="/src/assets/images/layout/ui-arrow-left.webp"
                                        alt=""
                                    />
                                </div>
                            )}
                            <p className="text-[1.8vw]">{`${year}년차 ${whatHalf}반기 결산`}</p>
                            {page === 4 ? (
                                <div className="w-[10%] h-full my-[1vh]"></div>
                            ) : (
                                <div
                                    className="relative bottom-[6%] w-[8%] h-[80%] mx-[1.2vw] my-[1vh] cursor-pointer btn-animation"
                                    onClick={() => {
                                        if (page < 4) {
                                            setPage((prev) => prev + 1);
                                        }
                                    }}
                                >
                                    <img
                                        src="/src/assets/images/layout/ui-arrow-right.webp"
                                        alt=""
                                    />
                                </div>
                            )}
                        </div>
                        <div className="w-full px-[1vw] h-[0.3vh]">
                            <div className="w-[48%] h-full color-bg-subbold"></div>
                        </div>
                        <div className="w-full h-[85%]">
                            {page === 1 ? (
                                <HalfPage1
                                    turn={Half.turn}
                                    titleList={props.titleList}
                                    eventList={props.eventList}
                                    productList={props.productList}
                                    webSocketClient={props.webSocketClient}
                                    webSocketId={props.webSocketId}
                                    halfIncome={halfIncome}
                                    halfOutcome={halfOutcome}
                                    setMode={setMode}
                                    inProductList={
                                        Half.quarterReport.inProductList
                                    }
                                />
                            ) : page === 2 ? (
                                <HalfPage2 receipt={receipt} />
                            ) : page === 3 ? (
                                <HalfPage3
                                    rankInfoList={Half.rankInfoList}
                                    participantCount={Half.participantCount}
                                />
                            ) : (
                                <HalfPage4
                                    productList={props.productList}
                                    tteoksangStatistics={
                                        Half.tteoksangStatistics
                                    }
                                    tteokrockStatistics={
                                        Half.tteokrockStatistics
                                    }
                                    bestSellerStatistics={
                                        Half.bestSellerStatistics
                                    }
                                    achievementInfo={props.achievementInfo}
                                    achievementList={Half.achievementList}
                                />
                            )}
                        </div>

                        <div
                            className="absolute flex items-center justify-center top-[-6vw] right-[-5vw] w-[6vw] h-[6vw] cursor-pointer btn-animation"
                            onClick={() => {
                                props.setIsHlfReportAvail(false);
                            }}
                        >
                            <img
                                src="/src/assets/images/layout/ui-icon-closebtn.webp"
                                alt=""
                            />
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
