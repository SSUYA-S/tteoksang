import { OfflineReportType, Product } from '../../type/types';
import offlineData from '../../dummy-data/report/offline.json';
import { useEffect, useState } from 'react';
import RentFeeModal from './RentFeeModal';
import { Client } from '@stomp/stompjs';

interface Prop {
    offReport: OfflineReportType | null;
    setIsOffReportAvail: React.Dispatch<React.SetStateAction<boolean>>;
    nowTurn: number;
    productList: Product[];
    webSocketId: string;
    webSocketClient: Client;
}

export default function OffReportModal(props: Prop) {
    //data load 부분(데이터 도착시 주석 처리 바람)
    const Off = offlineData;
    // const Off = props.offReport;

    const nowTurn = 125;
    // const nowTurn = props.nowTurn;

    //0: 임대료, 1: 보고서
    const [mode, setMode] = useState<number>(0);
    const [reportType, setReportType] = useState<number>(0);

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
            ) : (
                <></>
            )}
        </>
    );
}
