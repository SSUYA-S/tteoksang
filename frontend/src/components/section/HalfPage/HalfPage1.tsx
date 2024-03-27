import { useEffect, useRef, useState } from 'react';
import { Title, Event, Product, QuarterReportType } from '../../../type/types';
import { useSelector } from 'react-redux';
import { Client } from '@stomp/stompjs';

interface Prop {
    turn: number;
    titleList: Title[];
    eventList: Event[];
    productList: Product[];
    webSocketId: string;
    webSocketClient: Client;
}

//반기 보고서 1페이지(분기 보고서)
export default function HalfPage1(props: Prop) {
    const [timeDuration1, setTimeDuration1] = useState<string>('');

    useEffect(() => {
        //시작 날짜 기준
        const turn = props.turn - 181;
        const year = Math.floor((turn + 60) / 360);
        const month: number = ((Math.floor(turn / 30) + 2) % 12) + 1;
        if (month === 3) {
            setTimeDuration1(`${year}년차 봄 ~ ${year}년차 여름`);
        } else if (month === 9) {
            setTimeDuration1(`${year}년차 가을 ~ ${year}년차 겨울`);
        }
    }, [props.turn]);

    return (
        <div className="w-full h-full flex items-center">
            <div className="w-[50%] h-full flex flex-col items-center">
                {/* 기간표시 */}
                <div className="w-full h-[15%] text-[2vw] flex justify-center items-center">
                    <p>{timeDuration1}</p>
                </div>
                {/* 분기 정산 결과 */}
                <div className="w-full h-[55%] text-[2vw] flex flex-col px-[3vw] py-[1vh]">
                    <div className="w-full flex justify-between">
                        <div>수익</div>
                        <div>20,000</div>
                    </div>
                </div>
            </div>
            <div className="w-[0.2vw] h-[90%] color-bg-subbold"></div>
            <div className="w-[50%] h-full"></div>
        </div>
    );
}
