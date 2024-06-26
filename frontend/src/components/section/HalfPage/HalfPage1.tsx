import { useEffect, useRef, useState } from 'react';
import { Title, Event, Product } from '../../../type/types';
import { useSelector } from 'react-redux';
import { Client } from '@stomp/stompjs';
import { loadEventImg } from '../../../util/loadEventImg';

interface Prop {
    turn: number;
    titleList: Title[];
    eventList: Event[];
    productList: Product[];
    webSocketId: string;
    webSocketClient: Client;
    halfIncome: number;
    halfOutcome: number;
    setMode: React.Dispatch<React.SetStateAction<number>>;
    inProductList: number[];
}

//반기 보고서 1페이지(분기 보고서)
export default function HalfPage1(props: Prop) {
    const [timeDuration1, setTimeDuration1] = useState<string>('');
    const [timeDuration2, setTimeDuration2] = useState<string>('');
    const [nowSeason, setNowSeason] = useState<string>('');

    const [eventHashMap, setEventHashMap] = useState<Map<string, Event[]>>(
        new Map()
    );
    const [eventDescription, setEventDescription] = useState<string>('');
    const [cropName, setCropName] = useState<string>('');
    const [cropSeason, setCropSeason] = useState<string>('');

    const eventDescRef = useRef<HTMLDivElement>(null);
    const cropDescRef = useRef<HTMLDivElement>(null);

    /**이벤트 이미지 호버링하면 출력 */
    const hoverEventImg = (eventName: string) => {
        setEventDescription(eventName);

        if (eventDescRef.current) {
            eventDescRef.current.style.opacity = '100';
            eventDescRef.current.style.transition = 'linear 0.5s';
            eventDescRef.current.style.zIndex = '30';
        }
    };

    /**이벤트 이미지 호버링 끝나면 출력 */
    const endHoverEvent = () => {
        if (eventDescRef.current) {
            eventDescRef.current.style.opacity = '0';
            eventDescRef.current.style.transition = 'linear 0.5s';
            eventDescRef.current.style.zIndex = '-20';
        }
    };

    /**작물 이미지 호버링 시 출력 */
    const hoverCropImg = (cropId: number) => {
        const crop: Product = props.productList[cropId];
        setCropName(crop.productName);
        switch (crop.productType) {
            case 'SPRING':
                setCropSeason('봄');
                break;
            case 'SUMMER':
                setCropSeason('여름');
                break;
            case 'FALL':
                setCropSeason('가을');
                break;
            case 'WINTER':
                setCropSeason('겨울');
                break;
            case 'ALL':
                setCropSeason('연중 내내');
                break;
        }
        if (cropDescRef.current) {
            cropDescRef.current.style.opacity = '100';
            cropDescRef.current.style.transition = 'linear 0.5s';
            cropDescRef.current.style.zIndex = '30';
        }
    };

    /**작물 이미지 호버링 끝나면 출력 */
    const endHoverCrop = () => {
        if (cropDescRef.current) {
            cropDescRef.current.style.opacity = '0';
            cropDescRef.current.style.transition = 'linear 0.5s';
            cropDescRef.current.style.zIndex = '-20';
        }
    };

    //title 가져오기
    const titleId = useSelector(
        (state: any) => state.reduxFlag.myProfileSlice.title
    );

    useEffect(() => {
        //시작 날짜 기준
        const turn = props.turn - 181;
        const year = Math.floor((turn + 60) / 360);
        const month: number = ((Math.floor(turn / 30) + 2) % 12) + 1;
        if (month === 3) {
            setTimeDuration1(`${year}년차 봄 ~ ${year}년차 여름`);
            setTimeDuration2(`(0${year}.03.01 ~ 0${year}.08.30)`);
            //가을이다
            setNowSeason(`현재 계절 : ${year}년차 가을`);
            //이벤트 해시맵으로 저장
            const filterRes = props.eventList.filter(
                (event) => event.eventType === 'FALL'
            );
            makeHashMap(filterRes);
        } else if (month === 9) {
            setTimeDuration1(`${year}년차 가을 ~ ${year}년차 겨울`);
            setTimeDuration2(`(0${year}.09.01 ~ 0${year + 1}.02.30)`);
            //봄이다
            setNowSeason(`현재 계절 : ${year + 1}년차 봄`);
            //이벤트 해시맵으로 저장
            const filterRes = props.eventList.filter(
                (event) => event.eventType === 'SPRING'
            );
            makeHashMap(filterRes);
        }
    }, []);

    const makeHashMap = (filterRes: Event[]) => {
        const map = new Map();
        filterRes.map((event) => {
            if (map.get(event.eventName)) {
                const temp = map.get(event.eventName);
                temp.push(event);
                map.set(event.eventName, temp);
            } else {
                map.set(event.eventName, [event]);
            }
        });
        setEventHashMap(map);
    };

    return (
        <>
            <div className="w-full h-full flex items-center">
                <div className="w-[50%] h-full flex flex-col items-center">
                    {/* 기간표시 */}
                    <div className="w-full h-[10%] text-[1.5vw] flex justify-center items-center">
                        <p>{timeDuration1}</p>
                    </div>
                    {/* 분기 정산 결과 */}
                    <div className="w-full h-[55%] text-[1.5vw] flex flex-col px-[3vw] py-[1vh] justify-between">
                        <div className="w-full">
                            <div className="w-full flex justify-between">
                                <div>수익</div>
                                <div>{props.halfIncome.toLocaleString()}</div>
                            </div>
                            <div className="w-full flex justify-between">
                                <div>지출</div>
                                <div>
                                    {(-1 * props.halfOutcome).toLocaleString()}
                                </div>
                            </div>
                            <div className="w-full text-left text-[1.5vw]">
                                {timeDuration2}
                            </div>
                        </div>
                        <div className="w-full flex flex-col items-center">
                            <div className="w-full h-[0.2vh]">
                                <div className="color-bg-subbold w-full h-full"></div>
                            </div>
                            <div className="w-full flex justify-between">
                                <div>반기 순이익</div>
                                <div>
                                    {(
                                        props.halfIncome - props.halfOutcome
                                    ).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 구분선 (정산 - 칭호) */}
                    <div className="w-[90%] h-[0.3vh] color-bg-subbold"></div>
                    {/* 칭호 */}
                    <div className="w-[90%] h-[35%] flex flex-col items-center">
                        <p className="w-[90%] h-[20%] text-left text-[1.5vw]">
                            현재 칭호
                        </p>
                        <div className="w-[90%] h-[80%] pb-[1vh] flex justify-between items-center">
                            <div className="w-[80%] h-full flex justify-start items-center">
                                {titleId !== 1 ? (
                                    <img
                                        className="w-[6vw] h-[6vw] m-[1vw] aspect-square object-cover rounded-full border-[0.4vw] color-border-subbold"
                                        src={`/src/assets/images/title/title (${titleId}).png`}
                                    ></img>
                                ) : (
                                    <div className="w-[6vw] h-[6vw] m-[1vw] aspect-square object-cover flex justify-center items-center">
                                        <p>칭호 없음</p>
                                    </div>
                                )}
                                <div className="text-[1.5vw]">
                                    {props.titleList[titleId - 1].titleName}
                                </div>
                            </div>
                            <div
                                className="border-[0.2vw] w-[20%] h-[40%] bg-white py-[0.2vw] text-[1.5vw] color-border-subbold text-center cursor-pointer rounded-[0.6vw] hover:color-bg-subbold hover:text-white flex justify-center items-center"
                                onClick={() => {
                                    props.setMode(2);
                                }}
                            >
                                변경
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-[50%] h-full flex flex-col justify-between">
                    <div className="w-full h-[10%] ml-[1vw] mt-[1vh]">
                        <div className="text-[1.5vw] text-left">
                            {nowSeason}
                        </div>
                    </div>
                    {/* 이벤트 요소 */}
                    <div className="relative w-[90%] h-[30%] ml-[1vw] my-[2vh]">
                        <p className="text-[1.5vw] text-left ml-[1vw]">
                            계절 이벤트
                        </p>
                        <div
                            className="overflow-x-auto h-[80%]"
                            style={{ scrollbarWidth: 'thin' }}
                        >
                            <div className="flex h-full">
                                {Array.from(eventHashMap).map((value) => {
                                    return (
                                        <img
                                            className="h-[80%] m-[1vw] rounded-[0.6vw] aspect-square object-cover flex-shrink-0"
                                            src={loadEventImg(value[0])}
                                            onMouseOver={() => {
                                                hoverEventImg(value[0]);
                                            }}
                                            onMouseLeave={endHoverEvent}
                                        ></img>
                                    );
                                })}
                                <div
                                    className="absolute w-full top-[10vw] bg-black opacity-0 text-white -z-20 text-[1.5vw] break-normal p-[0.5vw]"
                                    ref={eventDescRef}
                                >
                                    {eventDescription}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 작물 요소 */}
                    <div className="relative w-[90%] h-[60%] ml-[1vw] mt-[1vh]">
                        <p className="text-[1.5vw] text-left ml-[1vw]">
                            구매 가능 작물
                        </p>
                        <div
                            className="overflow-x-auto h-[60%]"
                            style={{ scrollbarWidth: 'thin' }}
                        >
                            <div className="flex h-full">
                                {props.inProductList.map((cropId) => {
                                    return (
                                        <div
                                            className={
                                                'h-[80%] bg-no-repeat mx-auto sprite-img-crop ' +
                                                `crop-img-${cropId}`
                                            }
                                            style={{
                                                aspectRatio: 1 / 1,
                                            }}
                                            onMouseOver={() =>
                                                hoverCropImg(cropId)
                                            }
                                            onMouseLeave={endHoverCrop}
                                        ></div>
                                    );
                                })}
                                <div
                                    className="absolute w-full h-[5.5vw] top-[10vw] px-[1vw] bg-black opacity-0 text-white -z-20"
                                    ref={cropDescRef}
                                >
                                    <p className="w-full text-left text-[1.5vw]">
                                        {cropName}
                                    </p>
                                    <p className="w-full text-left text-[1.5vw]">{`제철 : ${cropSeason}`}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
