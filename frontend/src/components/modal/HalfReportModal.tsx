import { useEffect, useRef, useState } from 'react';
import RentFeeModal from './RentFeeModal';
import { Title, Event, Product, HalfReportType } from '../../type/types';
import { useSelector } from 'react-redux';
import TitleChangeModal from './TitleChangeModal';
import { Client } from '@stomp/stompjs';

//dummy data(test 후 비활성화 필요)
import Half from '../../dummy-data/report/half.json';
import HalfPage1 from '../section/HalfPage/HalfPage1';

interface Prop {
    titleList: Title[];
    eventList: Event[];
    productList: Product[];
    setIsHlfReportAvail: React.Dispatch<React.SetStateAction<boolean>>;
    webSocketId: string;
    webSocketClient: Client;
    hlfReport: HalfReportType | null;
    setStartFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HalfReportModal(props: Prop) {
    const [mode, setMode] = useState<number>(0);
    const [page, setPage] = useState<number>(1);

    // n년차 n반기 용
    const [year, setYear] = useState<number>(0);
    const [whatHalf, setWhatHalf] = useState<string>('상');

    //test 종료 후 이거 풀어
    // const Half = props.hlfReport;

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

        //메인 화면으로 나가기
        props.setStartFlag(false);
    };

    return (
        <>
            <div className="absolute w-full h-full top-0 left-0 bg-black opacity-50 z-10 "></div>
            {mode === 0 ? (
                <RentFeeModal
                    rentFeeInfo={Half.rentFeeInfo}
                    startTurn={Half.turn - 91}
                    endTurn={Half.turn - 1}
                    showReport={showReport}
                    productList={props.productList}
                    endGame={endGame}
                />
            ) : mode === 1 ? (
                <>
                    {/* x버튼 */}
                    <div
                        className="w-[60%] h-[60%] absolute left-[20%] top-[20%] color-border-subbold border-[0.5vw] bg-white z-10 flex items-center color-text-subbold"
                        style={{ transform: 'rotate(-5deg)' }}
                    ></div>
                    <div className="w-[60%] h-[60%] absolute left-[20%] top-[20%] color-border-subbold border-[0.5vw] bg-white z-20 flex flex-col items-center color-text-subbold">
                        <div className="w-full h-[15%] px-[1vw] py-[1vh] flex justify-between items-center">
                            {page === 1 ? (
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
                            <p className="text-[2vw]">{`${year}년차 ${whatHalf}반기 결산`}</p>
                            {page === 4 ? (
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
                        <div className="w-full px-[1vw] h-[0.1vh]">
                            <div className="w-full h-full color-bg-subbold"></div>
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
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                        <div
                            className="absolute text-[2vw] flex items-center justify-center text-white -top-[1.6vw] -right-[2vw] w-[4vw] h-[4vw] border-[0.4vw] color-border-sublight color-bg-orange1 rounded-full cursor-pointer z-30"
                            onClick={() => {
                                props.setIsHlfReportAvail(false);
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
