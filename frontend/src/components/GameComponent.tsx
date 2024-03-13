import { useEffect, useRef, useState } from 'react';
import TradeModal from './modal/TradeModal';
import FacilityModal from './modal/FacilityModal';
import InfoSeasonModal from './modal/InfoSeasonModal';
import InfoNotConnectModal from './modal/InfoNotConnectModal';
import InfoResultModal from './modal/InfoResultModal';
import SettingModal from './modal/SettingModal';
import { useDispatch, useSelector } from 'react-redux';
import CircularTimer from './section/CircularTimer';
import MyPageModal from './modal/MyPageModal';
import NewsModal from './modal/NewsModal';
import totalInfo from '../dummy-data/total-info.json';

export default function GameComponent() {
    const [tradeFlag, setTradeFlag] = useState<boolean>(false);
    const [facilityFlag, setFacilityFlag] = useState<boolean>(false);
    const [infoSeasonFlag, setInfoSeasonFlag] = useState<boolean>(true);
    const [infoNotConnectFlag, setInfoNotConnectFlag] = useState<boolean>(true);
    const [infoResultFlag, setInfoResultFlag] = useState<boolean>(true);
    const [settingFlag, setSettingFlag] = useState<boolean>(false);
    const [mypageFlag, setMyPageFlag] = useState<boolean>(false);
    const [newsFlag, setNewsFlag] = useState<boolean>(false);

    const [playing, setPlaying] = useState<boolean>(false);
    const [audio, setAudio] = useState(
        new Audio('/src/assets/bgm/main_theme_bgm.mp3')
    );
    const [theme, setTheme] = useState<String>();
    const [turnTimer, setTurnTimer] = useState<number>(-1);
    const [nowMoney, setNowMoney] = useState<number>(0);

    const bgmSetting = useSelector((state: any) => state.reduxFlag.bgmFlag);
    const themeSetting = useSelector((state: any) => state.reduxFlag.themeType);
    const profileTheme = useSelector(
        (state: any) => state.reduxFlag.profileTheme
    );
    const profileIcon = useSelector(
        (state: any) => state.reduxFlag.profileIcon
    );
    const profileFrame = useSelector(
        (state: any) => state.reduxFlag.profileFrame
    );

    /**초기정보 세팅 */
    useEffect(() => {
        setNowMoney(totalInfo.gold);
    }, []);

    // 테마 설정
    useEffect(() => {
        if (themeSetting === 'auto') {
            if (turnTimer <= 180 && turnTimer > 90) {
                setTheme('morning');
            } else if (turnTimer <= 90 && turnTimer > 45) {
                setTheme('evening');
            } else if (turnTimer <= 45 && turnTimer > 0) {
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

    /**updateNowMoney(value)
     * 현재 nowMoney값을 value만큼 업데이트
     */
    const updateNowMoney = (value: number) => {
        setNowMoney(nowMoney + value);
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
            {/* 좌측 상단 ui */}
            <div className="absolute top-[4%] left-[2%]">
                <div className="flex items-center justify-center">
                    <div
                        className="relative color-bg-main flex w-[480px] h-fit border-[5px] color-border-subbold rounded-xl py-2 cursor-pointer "
                        onClick={() => openMypageElement()}
                    >
                        <div className="relative w-40 h-40 m-4">
                            <img
                                src={`/src/assets/images/profile/icon (${profileIcon}).png`}
                            />
                            <img
                                className="absolute left-0 top-0"
                                src={`/src/assets/images/profile/frame (${profileFrame}).png`}
                            />
                        </div>

                        <div className=" flex flex-col items-center justify-center ps-4">
                            <p className="w-full text-start mx-8 text-3xl text-green-500">
                                뿌리채소의 제왕
                            </p>
                            <p className="w-full text-start mx-8 my-2 text-4xl text-green-500 mt-8">
                                제노 님
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 우측 상단 ui */}
            <div className="absolute top-[1%] right-[3%] flex items-center justify-center">
                <div className="relative w-[320px] h-[100px] py-2 flex flex-col items-center justify-around color-bg-main border-4 color-border-subbold rounded-xl color-text-textcolor left-12 z-0">
                    <p className="text-xl">2023년 4월 12일</p>
                    <div className="flex items-center justify-center">
                        <img
                            src="/src/assets/images/icon/ui-icon-coin.png"
                            alt=""
                        />
                        <p className="ml-2 text-3xl">
                            {nowMoney.toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-center rounded-full border-8 color-border-subbold z-10">
                    <CircularTimer duration={180} setTurnTimer={setTurnTimer} />
                    <div className="timerwrap flex items-center justify-center">
                        <div
                            className="w-full h-full z-20 bg-no-repeat bg-center"
                            style={{
                                backgroundImage:
                                    'url(/src/assets/images/icon/ui-season-spring.png)',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* 좌측 하단 ui */}
            <div className="absolute bottom-[2%] left-[1%]">
                <div className="flex items-center justify-center">
                    <div
                        className="w-28 h-36 bg-no-repeat cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-trade.png)',
                        }}
                        onClick={() => {
                            openTradeElement();
                        }}
                    />
                    <div
                        className="w-28 h-36 bg-no-repeat cursor-pointer mx-2"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-facility.png)',
                        }}
                        onClick={() => {
                            openFacilityElement();
                        }}
                    />
                    <div
                        className="w-28 h-36 bg-no-repeat cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-inventory.png)',
                        }}
                    />
                    <div
                        className="w-28 h-36 bg-no-repeat cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-newspaper.png)',
                        }}
                        onClick={() => {
                            openNewsElement();
                        }}
                    />
                    <div
                        className="w-28 h-36 bg-no-repeat cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-accident.png)',
                        }}
                    />
                </div>
            </div>

            {/* 우측 하단 ui */}
            <div className="absolute bottom-[2%] right-[1%]">
                <div className="flex items-center justify-center">
                    <div
                        className="w-28 h-40 bg-no-repeat cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-setting.png)',
                        }}
                        onClick={() => openSettingElement()}
                    />
                    <div
                        className="w-28 h-40 bg-no-repeat cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-quit.png)',
                        }}
                    />
                </div>
            </div>

            {/* 포켓몬 */}
            <div
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
            )}
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
                <FacilityModal setFacilityFlag={setFacilityFlag} />
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
        </section>
    );
}