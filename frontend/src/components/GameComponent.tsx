import { useEffect, useRef, useState } from 'react';
import TradeModal from './modal/TradeModal';
import InfoSeasonModal from './modal/InfoSeasonModal';
import InfoNotConnectModal from './modal/InfoNotConnectModal';
import InfoResultModal from './modal/InfoResultModal';
import SettingModal from './modal/SettingModal';
import { useDispatch, useSelector } from 'react-redux';
import CircularTimer from './section/CircularTimer';
import MyPageModal from './modal/MyPageModal';
import NewsModal from './modal/NewsModal';
import LottieRain from './lottie-animation/LottieRain';
import totalInfo from '../dummy-data/total-info.json';

import InventoryModal from './modal/InventoryModal';
import InfraModal from './modal/InfraModal';
import { goldState } from '../util/myproduct-slice';

//websocket
import Stomp from '@stomp/stompjs';
import { Client } from '@stomp/stompjs';
import { handshake, sendMessage } from '../util/websocket/client';

export default function GameComponent() {
    const [tradeFlag, setTradeFlag] = useState<boolean>(false);
    const [facilityFlag, setFacilityFlag] = useState<boolean>(false);
    const [infoSeasonFlag, setInfoSeasonFlag] = useState<boolean>(true);
    const [infoNotConnectFlag, setInfoNotConnectFlag] = useState<boolean>(true);
    const [infoResultFlag, setInfoResultFlag] = useState<boolean>(true);
    const [settingFlag, setSettingFlag] = useState<boolean>(false);
    const [mypageFlag, setMyPageFlag] = useState<boolean>(false);
    const [newsFlag, setNewsFlag] = useState<boolean>(false);
    const [inventoryFlag, setInventoryFlag] = useState<boolean>(false);

    //턴 시간
    const [duration, setDuration] = useState<number>(20);
    const [ingameTurn, setIngameTurn] = useState<number>(1);
    const [ingameTime, setIngameTime] = useState<string>('00:03:00');
    const [gameYear, setGameYear] = useState<number>(0);
    const [gameMonth, setGameMonth] = useState<number>(3);
    const [gameDay, setGameDay] = useState<number>(1);

    const [playing, setPlaying] = useState<boolean>(false);
    const [audio, setAudio] = useState(
        new Audio('/src/assets/bgm/main_theme_bgm.mp3')
    );
    const [theme, setTheme] = useState<string>();
    const [turnTimer, setTurnTimer] = useState<number>(-1);
    const [nowMoney, setNowMoney] = useState<number>(0);

    const [webSocketClient, setWebSocketClient] = useState<Stomp.Client>(
        new Client()
    );

    //게임 설정 정보 불러오기
    const bgmSetting = useSelector(
        (state: any) => state.reduxFlag.reduxSlice.bgmFlag
    );
    const themeSetting = useSelector(
        (state: any) => state.reduxFlag.reduxSlice.themeType
    );
    const profileTheme = useSelector(
        (state: any) => state.reduxFlag.reduxSlice.profileTheme
    );
    const profileIcon = useSelector(
        (state: any) => state.reduxFlag.reduxSlice.profileIcon
    );
    const profileFrame = useSelector(
        (state: any) => state.reduxFlag.reduxSlice.profileFrame
    );

    //게임 초기 정보 불러오기
    const goldNumber = useSelector(
        (state: any) => state.reduxFlag.myProductSlice.gold
    );

    const dispatch = useDispatch();

    /**초기정보 세팅 */
    useEffect(() => {
        //초기 정보 설정
        setNowMoney(goldNumber);
    }, [goldNumber]);

    //init
    useEffect(() => {
        setIngameTurn(totalInfo.turn);

        //websocket
        const client = handshake();
        setWebSocketClient(client);
    }, []);

    // 인게임 시간 설정
    useEffect(() => {
        const date = ingameTurn - 1;
        setGameDay((date % 30) + 1);
        setGameMonth(((Math.floor(date / 30) + 2) % 12) + 1);
        setGameYear(Math.floor((date + 60) / 360));
    }, [ingameTurn]);

    // 테마 설정
    useEffect(() => {
        if (themeSetting === 'auto') {
            if (turnTimer <= duration && turnTimer > duration / 2) {
                setTheme('morning');
            } else if (turnTimer <= duration / 2 && turnTimer > duration / 4) {
                setTheme('evening');
            } else if (turnTimer <= duration / 4 && turnTimer > 0) {
                setTheme('night');
            } else {
                setTheme('morning');
            }
        } else {
            setTheme(themeSetting);
        }
    }, [themeSetting, turnTimer]);
    // BGM 설정
    useEffect(() => {
        setPlaying(bgmSetting);
    }, [playing, bgmSetting]);
    useEffect(() => {
        playing ? audio.play() : audio.pause();
    }, [playing, audio]);
    useEffect(() => {
        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, [audio]);

    const openTradeElement = () => {
        setTradeFlag(true);
        setFacilityFlag(false);
    };
    const openFacilityElement = () => {
        setFacilityFlag(true);
        setTradeFlag(false);
    };
    const openNewsElement = () => {
        setNewsFlag(true);
    };
    const openSettingElement = () => {
        setSettingFlag(true);
    };
    const openMypageElement = () => {
        setMyPageFlag(true);
    };

    const openInventoryElement = () => {
        setInventoryFlag(true);
    };

    /**updateNowMoney(value)
     * 현재 nowMoney값을 value만큼 업데이트
     */
    const updateNowMoney = (value: number) => {
        // 돈 변화 애니메이션
        let originMoney = nowMoney;
        const num = nowMoney + value;
        let moneylength = 0;
        // 빼기면
        moneylength = Math.abs(originMoney - num).toString().length;
        console.log('자잔');
        console.log('돈 num : ' + num);
        console.log('돈 originMoney :' + originMoney);
        console.log(Math.abs(originMoney - num).toString());
        console.log(moneylength);

        let count = 0;

        if (moneylength == 1) {
            count = 1;
        } else {
            for (let i = 1; i <= moneylength - 1; i++) {
                count = count * 10 + (i % 10);
            }
        }

        // 빼기면
        if (originMoney > num) {
            const counting = setInterval(function () {
                originMoney - count;
                if (originMoney <= num) {
                    originMoney = num;
                    setNowMoney(originMoney);
                    clearInterval(counting);
                } else {
                    originMoney = originMoney - count;
                    setNowMoney(originMoney);
                }
            }, 20);
        } else if (originMoney < num) {
            const counting = setInterval(function () {
                originMoney - count;
                if (originMoney >= num) {
                    originMoney = num;
                    setNowMoney(originMoney);
                    clearInterval(counting);
                } else {
                    originMoney = originMoney + count;
                    setNowMoney(originMoney);
                }
            }, 20);
        }
        // 돈 변화 애니메이션

        //redux 반영
        dispatch(goldState(num));
    };

    return (
        <section className="mainBackground relative w-full h-full flex flex-col justify-center items-center">
            <img
                src={`/src/assets/images/background/bg-${profileTheme}-morning.png`}
                className="bg-image"
                style={{ opacity: theme === 'morning' ? '1' : '0' }}
            />
            <img
                src={`/src/assets/images/background/bg-${profileTheme}-evening.png`}
                className="bg-image"
                style={{ opacity: theme === 'evening' ? '1' : '0' }}
            />
            <img
                src={`/src/assets/images/background/bg-${profileTheme}-night.png`}
                className="bg-image"
                style={{ opacity: theme === 'night' ? '1' : '0' }}
            />
            <img
                src={`/src/assets/images/background/bg-${profileTheme}-morning.png`}
                className="bg-image -z-10"
            />
            <div className="absolute top-0 w-[60%] h-[100%]">
                {/* <LottieRain /> */}
            </div>

            {/* 좌측 상단 ui */}
            <div className="absolute w-[25%] h-[20%] top-[4%] left-[2%]">
                <div className="relative w-full h-full flex items-center justify-center color-bg-main  border-[0.2vw] color-border-subbold rounded-[0.4vw] p-[1%] cursor-pointer">
                    <div
                        className="relative w-full h-full flex"
                        onClick={() => openMypageElement()}
                    >
                        <div
                            className="relative w-[35%] m-0"
                            style={{ aspectRatio: 1 / 1 }}
                        >
                            <img
                                className="absolute w-full h-full cursor-pointer"
                                src={`/src/assets/images/profile/icon (${profileIcon}).png`}
                            />
                            <img
                                className="absolute w-full h-full cursor-pointer"
                                src={`/src/assets/images/profile/frame (${profileFrame}).png`}
                            />
                        </div>

                        <div className="relative w-[65%] flex flex-col items-center justify-center ps-[5%]">
                            <p className="w-full text-start mx-2 text-[1.5vw] text-green-500">
                                뿌리채소의 제왕
                            </p>
                            <p className="w-full text-start mx-2 my-[5%] text-[2vw] text-green-500">
                                제노 님
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 우측 상단 ui */}
            <div className="absolute w-[25%] h-[14%] top-[4%] right-[2%] flex items-center justify-center">
                <div className="relative w-[65%] h-full py-[0.2vw] flex flex-col items-center justify-around color-bg-main border-[0.2vw] color-border-subbold rounded-[1vw] color-text-textcolor left-[2vw] z-0">
                    <p className="text-[1.4vw]">
                        {gameYear}년 {gameMonth}월 {gameDay}일
                    </p>
                    <div className="flex items-center justify-start">
                        <img
                            className="absolute left-0 mx-[1vw] w-[12%]"
                            src="/src/assets/images/icon/ui-icon-coin.png"
                            alt=""
                        />
                        <p className="text-[1.6vw]">
                            {nowMoney.toLocaleString()}
                        </p>
                    </div>
                </div>
                <div
                    className="relative w-[35%] flex items-center justify-center rounded-full border-[0.4vw] color-border-subbold z-10"
                    style={{ aspectRatio: 1 / 1 }}
                >
                    <CircularTimer
                        duration={duration}
                        setTurnTimer={setTurnTimer}
                        setIngameTurn={setIngameTurn}
                    />
                    <div className="absolute w-full h-full rounded-full border-[0.4vw] border-white flex items-center justify-center">
                        <div
                            className="absolute w-full h-full"
                            style={{
                                backgroundImage:
                                    'url(/src/assets/images/icon/ui-icon-timeCircle.png)',
                                backgroundSize: 'contain ',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                            }}
                        ></div>
                        <div
                            className="absolute w-[60%] h-[60%] z-20 bg-no-repeat bg-center"
                            style={{
                                backgroundImage:
                                    'url(/src/assets/images/icon/ui-season-spring.png)',
                                backgroundSize: 'contain ',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* 좌측 하단 ui */}
            <div className="absolute w-[40%] h-[20%] bottom-[2%] left-[1%]">
                <div className="relative w-full h-full flex items-center justify-center">
                    <div
                        className="w-[19%] h-[100%] bg-no-repeat cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-trade.png)',
                            backgroundSize: 'contain ',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                        onClick={() => {
                            openTradeElement();
                        }}
                    />
                    <div
                        className="w-[19%] h-[100%] bg-no-repeat cursor-pointer mx-[0.4vw]"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-facility.png)',
                            backgroundSize: 'contain ',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                        onClick={() => {
                            openFacilityElement();
                        }}
                    />
                    <div
                        className="w-[19%] h-[100%] bg-no-repeat cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-inventory.png)',
                            backgroundSize: 'contain ',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                        onClick={() => {
                            openInventoryElement();
                        }}
                    />
                    <div
                        className="w-[19%] h-[100%] bg-no-repeat cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-newspaper.png)',
                            backgroundSize: 'contain ',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                        onClick={() => {
                            openNewsElement();
                        }}
                    />
                    <div
                        className="w-[19%] h-[100%] bg-no-repeat cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-accident.png)',
                            backgroundSize: 'contain ',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    />
                </div>
            </div>

            {/* 우측 하단 ui */}
            <div className="absolute w-[12%] h-[20%]  bottom-[2%] right-[1%]">
                <div className="relative w-full h-full flex items-center justify-center">
                    <div
                        className="w-[50%] h-[100%]  bg-no-repeat cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-setting.png)',
                            backgroundSize: 'contain ',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                        onClick={() => openSettingElement()}
                    />
                    <div
                        className="w-[50%] h-[100%]  bg-no-repeat cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-quit.png)',
                            backgroundSize: 'contain ',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    />
                </div>
            </div>

            {/* 포켓몬 */}
            {/* <div
                className="w-80 h-40 absolute bottom-[20%]"
                style={{
                    backgroundImage: 'url(/src/assets/images/etc/yadon.png)',
                }}
            ></div>
            {theme === 'morning' ? (
                <div
                    className="w-[50%] h-[70%] absolute bottom-[5%] left-[40%]"
                    style={{
                        transform: 'scale(0.6)',
                        backgroundImage: 'url(/src/assets/images/etc/egg.png)',
                    }}
                ></div>
            ) : (
                <></>
            )}

            {theme === 'night' ? (
                <div
                    className="w-[50%] h-[70%] absolute bottom-[25%] left-[58%]"
                    style={{
                        transform: 'scale(0.6)',
                        backgroundImage: 'url(/src/assets/images/etc/bird.png)',
                    }}
                ></div>
            ) : (
                <></>
            )}
            {theme === 'evening' ? (
                <div
                    className="w-[50%] h-[70%] absolute bottom-[13%] -left-[11%]"
                    style={{
                        transform: 'scale(0.6)',
                        backgroundImage:
                            'url(/src/assets/images/etc/mouse.png)',
                    }}
                ></div>
            ) : (
                <></>
            )} */}
            {/* 포켓몬 */}

            {tradeFlag ? (
                <TradeModal
                    setTradeFlag={setTradeFlag}
                    updateNowMoney={updateNowMoney}
                    nowMoney={nowMoney}
                />
            ) : (
                <></>
            )}
            {facilityFlag ? (
                <InfraModal
                    setFacilityFlag={setFacilityFlag}
                    updateNowMoney={updateNowMoney}
                />
            ) : (
                <></>
            )}
            {infoSeasonFlag ? (
                <InfoSeasonModal setInfoSeasonFlag={setInfoSeasonFlag} />
            ) : (
                <></>
            )}
            {infoNotConnectFlag ? (
                <InfoNotConnectModal
                    setInfoNotConnectFlag={setInfoNotConnectFlag}
                />
            ) : (
                <></>
            )}
            {infoResultFlag ? (
                <InfoResultModal setInfoResultFlag={setInfoResultFlag} />
            ) : (
                <></>
            )}
            {settingFlag ? (
                <SettingModal setSettingFlag={setSettingFlag} />
            ) : (
                <></>
            )}
            {mypageFlag ? <MyPageModal setMypageFlag={setMyPageFlag} /> : <></>}
            {newsFlag ? <NewsModal setNewsFlag={setNewsFlag} /> : <></>}
            {inventoryFlag ? (
                <InventoryModal setInventoryFlag={setInventoryFlag} />
            ) : (
                <></>
            )}
        </section>
    );
}
