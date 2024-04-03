import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//dummy data
// import totalInfo from '../dummy-data/total-info.json';

//.env

//Cookie
import { Cookies } from 'react-cookie';

//redux
// import {
//     brokerLevelState,
//     goldState,
//     myProductState,
//     purchasedQuantityState,
//     vehicleLevelState,
//     warehouseLevelState,
// } from '../util/myproduct-slice';
// import {
//     privateEventState,
//     specialEventState,
//     productInfoState,
//     buyableProductIdState,
// } from '../util/product-and-event';
import {
    Achievement,
    ProfileFrame,
    ProfileIcon,
    Theme,
    Title,
} from '../type/types';
import { checkMyPrevious, checkMyProfile, startNewGame } from '../api/user';
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
import WarningModal from './modal/WarningModal';
import MyPageModal from './modal/MyPageModal';

import logoutServiceWorker from '../util/logoutServiceWorker.ts';
import { logout } from '../api/auth.ts';
import { withdrawal } from '../api/user';

type startType = {
    setStartFlag: React.Dispatch<React.SetStateAction<boolean>>;
    achievementData: Achievement[];
    titleData: Title[];
    profileFrameData: ProfileFrame[];
    profileIconData: ProfileIcon[];
    startFlag: boolean;
    themeData: Theme[];
};
export default function GameStartComponent(props: startType) {
    const achievementData = props.achievementData;
    const titleData = props.titleData;
    const profileFrameData = props.profileFrameData;
    const profileIconData = props.profileIconData;
    const themeData = props.themeData;

    const [loginFlag, setLoginFlag] = useState<boolean>(false);
    const [playing, setPlaying] = useState<boolean>(false);
    const [audio, setAudio] = useState(
        new Audio('/src/assets/bgm/start_theme_bgm.mp3')
    );

    //마이페이지
    const [isMyPageOpen, setIsMyPageOpen] = useState<boolean>(false);

    //이전 기록이 존재하는가?
    const [isPreviousExist, setIsPreviousExist] = useState<boolean>(false);
    const [lastPlayTime, setLastPlayTime] = useState<string>('');

    const [isTrytoReset, setIsTryToReset] = useState<boolean>(false);

    const [isLogoutProceeding, setIsLogoutProceeding] =
        useState<boolean>(false);

    const [isWithdrawalProceeding, setIsWithdrawalProceeding] =
        useState<boolean>(false);

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

    /** handleLogOut()
     *  로그아웃
     */
    const handleLogOut = async () => {
        const res = await logout();
        if (res.status === httpStatusCode.OK) {
            logoutServiceWorker();
            setIsLogoutProceeding(false);

            // navigate('/');
            window.location.reload();
            props.setStartFlag(false);
            setIsMyPageOpen(false);
            setLoginFlag(false);
        } else {
            // console.log('Logout error');
        }
    };

    const proceedLogout = () => {
        setIsLogoutProceeding(true);
    };

    /** handleCloseErrorModal()
     * 로그아웃 모달 비활성화 */
    const handleCloseErrorModal = () => {
        setIsLogoutProceeding(false);
    };

    /** handleWithdrawal()
     *  회원 탈퇴를 진행한다.
     */
    const handleWithdrawal = async () => {
        const res = await withdrawal();
        if (res.status === httpStatusCode.OK) {
            logoutServiceWorker();
            props.setStartFlag(false);
            setIsWithdrawalProceeding(false);
            setLoginFlag(false);
            setIsMyPageOpen(false);
            window.location.reload();
        } else {
            // console.log('회원 탈퇴 불가');
        }
    };

    const proceedWithdrawal = () => {
        setIsWithdrawalProceeding(true);
    };

    const cancelWithdrawal = () => {
        setIsWithdrawalProceeding(false);
    };

    /**게임 시작 */
    const onReady = () => {
        audio.pause();
        props.setStartFlag(true);
        setIsTryToReset(false);
    };

    /**게임 초기화 후 시작 */
    const resetAndStart = async () => {
        //게임 포기 로직 추가
        startNewGame().then((res) => {
            if (res.status === httpStatusCode.OK) {
                onReady();
            }
        });
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
                    // console.log(err);
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
                            // console.log(data);
                        } else {
                            setIsPreviousExist(false);
                        }
                    }
                })
                .catch((err) => {
                    // console.log(err);
                });
        }
    }, [cookies]);

    //메인 화면 재 진입 시 이어하기 정보
    useEffect(() => {
        if (!props.startFlag && cookies.get('accessToken')) {
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
                            // console.log(data);
                        } else {
                            setIsPreviousExist(false);
                        }
                    }
                })
                .catch((err) => {
                    // console.log(err);
                });
        }
    }, [props.startFlag]);

    useEffect(() => {
        if (loginFlag) {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker
                    .register('/sw.js')
                    .then((registration) => {
                        // console.log(
                        //     'Service worker registered successfully',
                        //     registration
                        // );
                    })
                    .catch((error) => {
                        // console.log(
                        //     'Service worker registration failed',
                        //     error
                        // );
                    });
            } else {
                // console.log('Service workers are not supported.');
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
                                className="relative w-[40%] h-[55%] cursor-pointer btn-animation bg-[#FFE27B] border-black border-[0.5vw] flex flex-col justify-center items-center p-[0.5vw]"
                                onClick={() => {
                                    // loadGameData();
                                    onReady();
                                }}
                            >
                                <p className="text-[3vw]">이어하기</p>
                                <p className="text-[2vw]">{`마지막 플레이 시간 : ${lastPlayTime}`}</p>
                            </div>
                            <div className="h-[5%]"></div>
                            <div
                                className="relative w-[40%] h-[40%] cursor-pointer btn-animation bg-[#FFF6D6] border-black border-[0.5vw] flex justify-center items-center p-[0.5vw]"
                                onClick={() => {
                                    setIsTryToReset(true);
                                }}
                            >
                                <p className="text-[3vw]">새로 시작하기</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                className="relative w-[40%] h-[40%] cursor-pointer btn-animation bg-[#FFF6D6] border-black border-[0.5vw] flex justify-center items-center p-[0.5vw]"
                                onClick={() => {
                                    onReady();
                                }}
                            >
                                <p className="text-[3vw]">시작하기</p>
                            </div>
                        </>
                    )}
                </div>
            );
        } else {
            return (
                <>
                    <div
                        className=" rounded-full flex items-center justify-center my-[4vw] px-[1vw] py-[0.4vw] text-[2vw] font-bold cursor-pointer btn-animation"
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
            {isLogoutProceeding ? (
                <WarningModal
                    handleOK={handleLogOut}
                    handleCancel={handleCloseErrorModal}
                    message="로그아웃 하시겠습니까?"
                    cancelMessage="취소"
                    okMessage="로그아웃"
                />
            ) : (
                <></>
            )}
            {isWithdrawalProceeding ? (
                <WarningModal
                    handleOK={handleWithdrawal}
                    handleCancel={cancelWithdrawal}
                    message="정말로 회원탈퇴 하시겠습니까?"
                    cancelMessage="취소"
                    okMessage="회원탈퇴"
                />
            ) : (
                <></>
            )}
            {isMyPageOpen ? (
                <MyPageModal
                    setMypageFlag={setIsMyPageOpen}
                    titleInfo={titleData}
                    profileFrameInfo={profileFrameData}
                    themeInfo={themeData}
                    iconInfo={profileIconData}
                    achievementList={achievementData}
                    proceedLogout={proceedLogout}
                    proceedWithdrawal={proceedWithdrawal}
                />
            ) : (
                <></>
            )}
            {isTrytoReset ? (
                <WarningModal
                    handleOK={resetAndStart}
                    handleCancel={() => {
                        setIsTryToReset(false);
                    }}
                    message={`진행 상황이 초기화됩니다.\n정말 하시겠습니까?`}
                    cancelMessage="아니오"
                    okMessage="네"
                />
            ) : (
                <></>
            )}
            <div className="absolute w-[10%] h-[40%] flex flex-col justify-center items-center top-[4%] right-[0%] z-20">
                <div className="h-[5%]" />
                <div
                    className="w-[50%] h-[30%] cursor-pointer btn-animation z-10"
                    style={{
                        backgroundImage:
                            'url(/src/assets/images/icon/ui-icon-mypage.png)',
                        backgroundSize: 'contain ',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                    onClick={() => setIsMyPageOpen(true)}
                />
                <div className="h-[5%]" />
                {playing ? (
                    <div
                        className="w-[50%] h-[30%] cursor-pointer btn-animation"
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
                        className="w-[50%] h-[30%] cursor-pointer btn-animation"
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
