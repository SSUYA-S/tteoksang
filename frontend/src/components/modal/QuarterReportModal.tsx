import { useEffect, useState } from 'react';
import RentFeeModal from './RentFeeModal';
import { Title, Event, Product, QuarterReportType } from '../../type/types';
import TitleChangeModal from './TitleChangeModal';
import { Client } from '@stomp/stompjs';

//dummy data(test 후 비활성화 필요)
// import Quarter from '../../dummy-data/report/quarter.json';
import QuarterPage1 from '../section/QuarterPage/QuarterPage1';
import { startNewGame } from '../../api/user';
import { httpStatusCode } from '../../util/http-status';

interface Prop {
    titleList: Title[];
    eventList: Event[];
    productList: Product[];
    setIsQtrReportAvail: React.Dispatch<React.SetStateAction<boolean>>;
    webSocketId: string;
    webSocketClient: Client;
    qtrReport: QuarterReportType;
    setStartFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function QuarterReportModal(props: Prop) {
    const [mode, setMode] = useState<number>(0);
    const [year, setYear] = useState<number>(0);
    const [season, setSeason] = useState<string>('봄');

    //test 종료 후 이거 풀어
    const Quarter = props.qtrReport;

    /**rentFeeModal에서 확인 누르면 보고서 보여지도록 만들기 */
    const showReport = () => {
        setMode(1);
    };

    useEffect(() => {
        /**날짜 계산 */
        const turn = Quarter.turn - 91;
        setYear(Math.floor((turn + 60) / 360));
        const month: number = ((Math.floor(turn / 30) + 2) % 12) + 1;
        if (month === 3) {
            setSeason('봄');
        } else if (month === 6) {
            setSeason('여름');
        } else if (month === 9) {
            setSeason('가을');
        } else {
            setSeason('겨울');
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
                    rentFeeInfo={Quarter.rentFeeInfo}
                    startTurn={Quarter.turn - 91}
                    endTurn={Quarter.turn - 1}
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
                    <div className="w-[60%] h-[70%] absolute left-[20%] top-[15%]  z-20 flex flex-col items-center color-text-subbold">
                        <div className="w-full h-[15%] py-[1vh] flex justify-start items-center">
                            <p className="text-[2vw] ps-[2vw]">{`${year}년차 ${season} 결산`}</p>
                        </div>
                        <div className="w-full px-[1vw] h-[0.3vh]">
                            <div className="w-[48%] h-full color-bg-subbold"></div>
                        </div>
                        <div className="w-full h-[85%]">
                            <QuarterPage1
                                turn={Quarter ? Quarter.turn - 1 : 0}
                                lastTurn={Quarter ? Quarter.turn - 90 : 0}
                                titleList={props.titleList}
                                eventList={props.eventList}
                                productList={props.productList}
                                webSocketId={props.webSocketId}
                                webSocketClient={props.webSocketClient}
                                setMode={setMode}
                                inProductList={
                                    Quarter ? Quarter.inProductList : []
                                }
                                qtrIncome={Quarter ? Quarter.quarterProfit : 0}
                                qtrOutcome={
                                    Quarter ? Quarter.rentFeeInfo.rentFee : 0
                                }
                            />
                        </div>
                        <div
                            className="absolute text-[2vw] flex items-center justify-center text-white -top-[1.6vw] -right-[2vw] w-[4vw] h-[4vw] border-[0.4vw] color-border-sublight color-bg-orange1 rounded-full cursor-pointer z-30"
                            onClick={() => {
                                props.setIsQtrReportAvail(false);
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
