import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//dummy data
import totalInfo from '../dummy-data/total-info.json';

//.env

//Cookie
import { Cookies } from 'react-cookie';

//redux
import {
    brokerLevelState,
    goldState,
    myProductState,
    purchasedQuantityState,
    vehicleLevelState,
    warehouseLevelState,
} from '../util/myproduct-slice';
import {
    privateEventState,
    specialEventState,
    productInfoState,
    buyableProductIdState,
} from '../util/product-and-event';
import { Achievement, ProfileFrame, ProfileIcon, Title } from '../type/types';
import { checkMyPrevious, checkMyProfile } from '../api/user';
import { httpStatusCode } from '../util/http-status';
import { profileData } from '../type/types';
import {
    careerState,
    titleState,
    userNicknameState,
} from '../util/myprofile-slice';
import {
    profileFrameState,
    profileIconeState,
    profileThemeState,
} from '../util/counter-slice';

type startType = {
    setStartFlag: React.Dispatch<React.SetStateAction<boolean>>;
    achievementData: Achievement[];
    titleData: Title[];
    profileFrameData: ProfileFrame[];
    profileIconData: ProfileIcon[];
};
export default function GameStartComponent(props: startType) {
    const achievementData = props.achievementData;
    const titleData = props.titleData;
    const profileFrameData = props.profileFrameData;
    const profileIconData = props.profileIconData;
    const [loginFlag, setLoginFlag] = useState<boolean>(false);
    const [playing, setPlaying] = useState<boolean>(false);
    const [audio, setAudio] = useState(
        new Audio('/src/assets/bgm/start_theme_bgm.mp3')
    );

    //이전 기록이 존재하는가?
    const [isPreviousExist, setIsPreviousExist] = useState<boolean>(false);
    const [lastPlayTime, setLastPlayTime] = useState<string>('');

    const bgmSetting = useSelector((state: any) => state.reduxFlag.bgmFlag);

    const dispatch = useDispatch();

    const cookies = new Cookies();

    useEffect(() => {
        playing ? audio.play() : audio.pause();
    }, [playing, audio]);

    useEffect(() => {
        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, [audio]);

    const toggle = () => {
        if (playing) setPlaying(false);
        else {
            setPlaying(true);
        }
    };

    const onClickLogin = () => {
        //로그인 표시
        window.location.href = import.meta.env.VITE_REACT_GOOGLE_LOGIN_URL;
    };

    /**게임 시작 */
    const onReady = () => {
        audio.pause();
        props.setStartFlag(true);
    };

    useEffect(() => {
        //로그인 정보 있으면 자동 로그인
        if (cookies.get('accessToken')) {
            //초기 설정 불러와 설정
            checkMyProfile()
                .then((res) => {
                    if (res.status === httpStatusCode.OK) {
                        //프로필 테마와 게임 내 칭호, 닉네임 등 불러오기
                        const profile: profileData = res.data;
                        dispatch(careerState(profile.career));
                        dispatch(profileFrameState(profile.profileFrameId));
                        dispatch(profileIconeState(profile.profileIconId));
                        dispatch(profileThemeState(profile.themeId));
                        dispatch(titleState(profile.titleId));
                        dispatch(userNicknameState(profile.userNickname));
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

            setLoginFlag(true);

            //이전 기록 조회
            checkMyPrevious()
                .then((res) => {
                    if (res.status === httpStatusCode.OK) {
                        const data = res.data;
                        if (data.isExist) {
                            setIsPreviousExist(true);
                            setLastPlayTime(
                                data.previousPlayInfo.previousPlayDate.replace(
                                    'T',
                                    ' '
                                )
                            );
                            console.log(data);
                        } else {
                            setIsPreviousExist(false);
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [cookies]);

    useEffect(() => {
        if (loginFlag) {
            console.log('ㅈㅈㄷㅈㄷ');
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker
                    .register('/sw.js')
                    .then((registration) => {
                        console.log(
                            'Service worker registered successfully',
                            registration
                        );
                    })
                    .catch((error) => {
                        console.log(
                            'Service worker registration failed',
                            error
                        );
                    });
            } else {
                console.log('Service workers are not supported.');
            }
        }
    }, [loginFlag]);

    /** loadGameData()
     *  게임 정보를 불러옵니다.
     */
    // const loadGameData = () => {
    //     //dummy data로부터 정보 불러오기
    //     //totalInfo
    //     dispatch(goldState(totalInfo.gold));
    //     dispatch(privateEventState(totalInfo.privateEventId));
    //     dispatch(specialEventState(totalInfo.specialEventId));
    //     dispatch(myProductState(totalInfo.productList));
    //     dispatch(productInfoState(totalInfo.productInfoList));
    //     dispatch(buyableProductIdState(totalInfo.buyableProductIdList));
    //     dispatch(purchasedQuantityState(totalInfo.purchasedQuantity));
    //     dispatch(warehouseLevelState(totalInfo.warehouseLevel));
    //     dispatch(vehicleLevelState(totalInfo.vehicleLevel));
    //     dispatch(brokerLevelState(totalInfo.brokerLevel));
    // };

    const loginElement = () => {
        if (loginFlag) {
            return (
                <div className="w-full h-[40%] flex flex-col items-center justify-center">
                    {isPreviousExist ? (
                        <>
                            <div
                                className="relative w-[40%] h-[55%] cursor-pointer bg-[#FFE27B] border-black border-[0.5vw] flex flex-col justify-center items-center p-[0.5vw]"
                                onClick={() => {
                                    // loadGameData();
                                    onReady();
                                }}
                            >
                                <p className="text-[3vw]">이어하기</p>
                                <p className="text-[2vw]">{`마지막 플레이 시간 : ${lastPlayTime}`}</p>
                            </div>
                            <div className="h-[5%]"></div>
                        </>
                    ) : (
                        <></>
                    )}

                    <div
                        className="relative w-[40%] h-[40%] cursor-pointer bg-[#FFF6D6] border-black border-[0.5vw] flex justify-center items-center p-[0.5vw]"
                        onClick={() => {
                            //게임 포기 로직 추가
                            onReady();
                        }}
                    >
                        <p className="text-[3vw]">시작하기</p>
                    </div>
                </div>
            );
        } else {
            return (
                <>
                    <div
                        className=" rounded-full flex items-center justify-center my-[4vw] px-[1vw] py-[0.4vw] text-[2vw] font-bold cursor-pointer"
                        onClick={() => {
                            toggle();
                            onClickLogin();
                        }}
                    >
                        <img
                            className="w-[20vw]"
                            src="/src/assets/images/icon/login-google-icon.png"
                            alt=""
                        />
                    </div>
                </>
            );
        }
    };
    return (
        <section
            className="relative w-full h-full flex flex-col justify-center items-center"
            style={{
                backgroundImage:
                    'url(/src/assets/images/background/bg-start.webp)',
                backgroundSize: 'contain ',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="absolute w-[10%] h-[40%] flex flex-col justify-center items-center top-[4%] right-[0%] z-20">
                <div
                    className="w-[50%] h-[30%] cursor-pointer z-10"
                    style={{
                        backgroundImage:
                            'url(/src/assets/images/icon/ui-icon-ranking.png)',
                        backgroundSize: 'contain ',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                />
                <div className="h-[5%]" />
                <div
                    className="w-[50%] h-[30%] cursor-pointer z-10"
                    style={{
                        backgroundImage:
                            'url(/src/assets/images/icon/ui-icon-mypage.png)',
                        backgroundSize: 'contain ',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                />
                <div className="h-[5%]" />
                {playing ? (
                    <div
                        className="w-[50%] h-[30%] cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-volumeon.png)',
                            backgroundSize: 'contain ',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                        onClick={() => {
                            toggle();
                        }}
                    ></div>
                ) : (
                    <div
                        className="w-[50%] h-[30%] cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-volumeoff.png)',
                            backgroundSize: 'contain ',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                        onClick={() => {
                            toggle();
                        }}
                    ></div>
                )}
            </div>
            <div className="relative w-full h-[80%] flex flex-col justify-center items-center z-10">
                <div
                    className="w-[100%] h-[50%] animation-clockRotate"
                    style={{
                        backgroundImage:
                            'url(/src/assets/images/etc/text-start-title.png)',
                        backgroundSize: 'contain ',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                ></div>
                <div
                    className="w-[40%] h-[20%]"
                    style={{
                        backgroundImage:
                            'url(/src/assets/images/etc/text-start-content.png)',
                        backgroundSize: 'contain ',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                ></div>

                {loginElement()}
            </div>
            <img
                className="absolute top-0 w-[30%] animation-move-left-to-right"
                src="/src/assets/images/anim/cloud1.webp"
                alt=""
            />
            <img
                className="absolute top-[15%] w-[30%] -right-[25%] animation-move-right-to-left"
                src="/src/assets/images/anim/cloud2.webp"
                alt=""
                style={{ animationDelay: '10s' }}
            />
            <img
                className="absolute top-[40%] w-[30%] animation-move-right-to-left"
                src="/src/assets/images/anim/cloud3.webp"
                alt=""
            />
        </section>
    );
}
