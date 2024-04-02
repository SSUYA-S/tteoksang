import { SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    profileFrameState,
    profileIconeState,
    profileThemeState,
} from '../../util/counter-slice';

import {
    changeProfileFrame,
    changeProfileTheme,
    changeProfileIcon,
} from '../../api/user';
import { httpStatusCode } from '../../util/http-status';
import NicknameChangeModal from './NicknameChangeModal';
import {
    Title,
    ProfileFrame,
    Theme,
    ProfileIcon,
    Achievement,
} from '../../type/types';

type MyPageType = {
    setMypageFlag: React.Dispatch<SetStateAction<boolean>>;
    titleInfo: Title[];
    profileFrameInfo: ProfileFrame[];
    themeInfo: Theme[];
    iconInfo: ProfileIcon[];
    achievementList: Achievement[];
    proceedLogout: () => void;
    proceedWithdrawal: () => void;
};
export default function MyPageModal(props: MyPageType) {
    const [menu, setMenu] = useState<number>(0);
    const [littleMenu, setLittleMenu] = useState<number>(0);
    const dispatch = useDispatch();
    const profileTheme = useSelector(
        (state: any) => state.reduxFlag.reduxSlice.profileTheme
    );
    const profileIcon = useSelector(
        (state: any) => state.reduxFlag.reduxSlice.profileIcon
    );
    const profileFrame = useSelector(
        (state: any) => state.reduxFlag.reduxSlice.profileFrame
    );

    const userNickname = useSelector(
        (state: any) => state.reduxFlag.myProfileSlice.userNickname
    );
    const career = useSelector(
        (state: any) => state.reduxFlag.myProfileSlice.career
    );
    const titleId = useSelector(
        (state: any) => state.reduxFlag.myProfileSlice.title
    );

    //useState
    /**임시 프레임(미리보기) */
    const [tempFrame, setTempFrame] = useState<number>(0);
    /**임시 테마(미리보기) */
    const [tempTheme, setTempTheme] = useState<number>(0);
    /**임시 아이콘(미리보기) */
    const [tempIcon, setTempIcon] = useState<number>(0);

    const [isNicknameChanging, setIsNicknameChanging] =
        useState<boolean>(false);

    useEffect(() => {
        setTempFrame(profileFrame);
        setTempTheme(profileTheme);
        setTempIcon(profileIcon);

        // ESC 키를 눌렀을 때 실행할 함수
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                props.setMypageFlag(false); // ESC 키가 눌리면 컴포넌트를 안 보이게 설정
            }
        };
        // 컴포넌트가 마운트될 때 keydown 이벤트 리스너 추가
        document.addEventListener('keydown', handleKeyDown);

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const changeMenu = (prop: number) => {
        setMenu(prop);
        setLittleMenu(0);
    };
    const changeLittleMenu = (prop: number) => {
        setLittleMenu(prop);
    };

    const closeMypageModal = () => {
        props.setMypageFlag(false);
    };

    const changeTempTheme = (prop: number) => {
        setTempTheme(prop);
    };
    const changeTempIcon = (prop: number) => {
        setTempIcon(prop);
    };
    const changeTempFrame = (prop: number) => {
        setTempFrame(prop);
    };

    const saveSettings = () => {
        //프로필 변경 요청
        changeProfileFrame(tempFrame)
            .then((res) => {
                if (res.status === httpStatusCode.OK) {
                    dispatch(profileFrameState(tempFrame));
                    console.log('success');
                } else {
                    console.log('Fail');
                }
            })
            .catch((err) => {
                console.log(err);
            });
        //테마 변경 요청
        changeProfileTheme(tempTheme)
            .then((res) => {
                if (res.status === httpStatusCode.OK) {
                    dispatch(profileThemeState(tempTheme));
                    console.log('success');
                } else {
                    console.log('fail');
                }
            })
            .catch((err) => {
                console.log(err);
            });
        //아이콘 변경 요청
        changeProfileIcon(tempIcon)
            .then((res) => {
                if (res.status === httpStatusCode.OK) {
                    dispatch(profileIconeState(tempIcon));
                    console.log('Success');
                } else {
                    console.log('fail');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    /**닉네임 변경 모달 닫기 */
    const closeNicknameModal = () => {
        setIsNicknameChanging(false);
    };

    //animation 효과
    const [pushActive, setPushActive] = useState(false);
    const animationPush = () => {
        setPushActive(true);
        setTimeout(() => {
            setPushActive(false);
        }, 1000); // 1초 후에 애니메이션 상태를 비활성화합니다.
    };
    //animation 효과

    const menuElement = () => {
        if (menu === 0) {
            return (
                <>
                    <div className="w-full h-[25%] flex justify-between items-center px-[2.2vw] ">
                        <div className="flex text-[1.3vw]">
                            <p
                                className={
                                    'py-[0.8vw] px-[1.4vw] border-[0.2vw] color-bg-main color-border-brown1 me-[0.6vw] cursor-pointer rounded-[0.8vw] ' +
                                    (littleMenu === 0
                                        ? 'color-bg-subbold text-white'
                                        : '') +
                                    (littleMenu === 0 && pushActive
                                        ? ' animation-push '
                                        : '')
                                }
                                onClick={() => {
                                    animationPush();
                                    changeLittleMenu(0);
                                }}
                            >
                                전체보기
                            </p>
                            <p
                                className={
                                    'py-[0.8vw] px-[1.4vw] border-[0.2vw] color-bg-main color-border-brown1 mx-[0.8vw] cursor-pointer rounded-[0.8vw] ' +
                                    (littleMenu === 1
                                        ? 'color-bg-subbold text-white'
                                        : '') +
                                    (littleMenu === 1 && pushActive
                                        ? ' animation-push '
                                        : '')
                                }
                                onClick={() => {
                                    animationPush();
                                    changeLittleMenu(1);
                                }}
                            >
                                보유 중
                            </p>
                            <p
                                className={
                                    'py-[0.8vw] px-[1.4vw] border-[0.2vw] color-bg-main color-border-brown1 ml-[0.8vw] cursor-pointer rounded-[0.8vw] ' +
                                    (littleMenu === 2
                                        ? 'color-bg-subbold text-white'
                                        : '') +
                                    (littleMenu === 2 && pushActive
                                        ? ' animation-push '
                                        : '')
                                }
                                onClick={() => {
                                    animationPush();
                                    changeLittleMenu(2);
                                }}
                            >
                                미획득
                            </p>
                        </div>
                        <p className="py-[0.8vw] px-[1.4vw] border-[0.2vw] color-bg-main color-border-brown1 text-[1.3vw] cursor-pointer rounded-[0.8vw] ">
                            자세히 보기
                        </p>
                    </div>
                    <div className="relative w-full h-[75%] p-[0.8vw] overflow-auto">
                        <div className="w-full flex flex-wrap items-start ">
                            {/* 도전과제 전체보기 */}
                            {littleMenu === 0 ? (
                                <>
                                    {props.achievementList.map(
                                        (achievement) => {
                                            return (
                                                <img
                                                    className="w-[7vw] h-[7vw] m-[0.8vw]"
                                                    src={`/src/assets/images/profile/achivement (${achievement.achievementId}).png`}
                                                    alt=""
                                                    style={{
                                                        aspectRatio: 1 / 1,
                                                    }}
                                                />
                                            );
                                        }
                                    )}
                                </>
                            ) : (
                                <></>
                            )}
                            {/* 도전과제 보유중 보기 */}
                            {littleMenu === 1 ? (
                                <>
                                    <img
                                        className="w-[7vw] h-[7vw] m-[0.8vw]"
                                        src="/src/assets/images/profile/achivement (1).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                    />
                                    <img
                                        className="w-[7vw] h-[7vw] m-[0.8vw]"
                                        src="/src/assets/images/profile/achivement (2).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                    />
                                    <img
                                        className="w-[7vw] h-[7vw] m-[0.8vw]"
                                        src="/src/assets/images/profile/achivement (3).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                    />
                                    <img
                                        className="w-[7vw] h-[7vw] m-[0.8vw]"
                                        src="/src/assets/images/profile/achivement (4).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                    />
                                </>
                            ) : (
                                <></>
                            )}
                            {/* 도전과제 미획득 보기 */}
                            {littleMenu === 2 ? (
                                <>
                                    <img
                                        className="w-[7vw] h-[7vw] m-[0.8vw]"
                                        src="/src/assets/images/profile/achivement (5).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                    />
                                    <img
                                        className="w-[7vw] h-[7vw] m-[0.8vw]"
                                        src="/src/assets/images/profile/achivement (6).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                    />
                                    <img
                                        className="w-[7vw] h-[7vw] m-[0.8vw]"
                                        src="/src/assets/images/profile/achivement (7).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                    />
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </>
            );
        } else if (menu === 1) {
            return (
                <>
                    <div className="w-full h-[25%] flex justify-between items-center px-[2.2vw]">
                        <div className="flex text-[1.3vw]">
                            <p
                                className={
                                    'py-[0.8vw] px-[1.4vw] border-[0.2vw] color-bg-main color-border-brown1 me-[0.6vw] cursor-pointer rounded-[0.8vw]' +
                                    (littleMenu === 0
                                        ? 'color-bg-subbold text-white'
                                        : '') +
                                    (littleMenu === 0 && pushActive
                                        ? ' animation-push '
                                        : '')
                                }
                                onClick={() => {
                                    animationPush();
                                    changeLittleMenu(0);
                                }}
                            >
                                전체보기
                            </p>
                            <p
                                className={
                                    'py-[0.8vw] px-[1.4vw] border-[0.2vw] color-bg-main color-border-brown1 mx-[0.8vw] cursor-pointer rounded-[0.8vw]' +
                                    (littleMenu === 1
                                        ? 'color-bg-subbold text-white'
                                        : '') +
                                    (littleMenu === 1 && pushActive
                                        ? ' animation-push '
                                        : '')
                                }
                                onClick={() => {
                                    animationPush();
                                    changeLittleMenu(1);
                                }}
                            >
                                보유 중
                            </p>
                        </div>
                        <p className="py-[0.8vw] px-[1.4vw] border-[0.2vw] color-bg-main color-border-brown1 text-[1.3vw] cursor-pointer rounded-[0.8vw] ">
                            자세히 보기
                        </p>
                    </div>
                    <div className="relative w-full h-[75%] p-[0.8vw] overflow-auto">
                        <div className="w-full flex flex-wrap items-start ">
                            <img
                                className="w-[7vw] h-[7vw] m-[0.8vw]"
                                src="/src/assets/images/etc/mypage-profile.png"
                                alt=""
                                style={{ aspectRatio: 1 / 1 }}
                            />
                            <img
                                className="w-[7vw] h-[7vw] m-[0.8vw]"
                                src="/src/assets/images/icon/ui-icon-coin.png"
                                alt=""
                                style={{ aspectRatio: 1 / 1 }}
                            />
                            <img
                                className="w-[7vw] h-[7vw] m-[0.8vw]"
                                src="/src/assets/images/icon/ui-icon-coin.png"
                                alt=""
                                style={{ aspectRatio: 1 / 1 }}
                            />
                            <img
                                className="w-[7vw] h-[7vw] m-[0.8vw]"
                                src="/src/assets/images/icon/ui-icon-coin.png"
                                alt=""
                                style={{ aspectRatio: 1 / 1 }}
                            />
                            <img
                                className="w-[7vw] h-[7vw] m-[0.8vw]"
                                src="/src/assets/images/icon/ui-icon-coin.png"
                                alt=""
                                style={{ aspectRatio: 1 / 1 }}
                            />
                            <img
                                className="w-[7vw] h-[7vw] m-[0.8vw]"
                                src="/src/assets/images/icon/ui-icon-coin.png"
                                alt=""
                                style={{ aspectRatio: 1 / 1 }}
                            />
                            <img
                                className="w-[7vw] h-[7vw] m-[0.8vw]"
                                src="/src/assets/images/icon/ui-icon-coin.png"
                                alt=""
                                style={{ aspectRatio: 1 / 1 }}
                            />
                        </div>
                    </div>
                </>
            );
        } else if (menu === 2) {
            return (
                <>
                    <div className="w-full h-[25%] flex justify-between items-center px-[2.2vw]">
                        <div className="flex text-[1.3vw]">
                            <p
                                className={
                                    'py-[0.8vw] px-[1.4vw] border-[0.2vw] color-bg-main color-border-brown1 me-[0.6vw] cursor-pointer rounded-[0.8vw] ' +
                                    (littleMenu === 0
                                        ? 'color-bg-subbold text-white'
                                        : '') +
                                    (littleMenu === 0 && pushActive
                                        ? ' animation-push '
                                        : '')
                                }
                                onClick={() => {
                                    animationPush();
                                    changeLittleMenu(0);
                                }}
                            >
                                프레임
                            </p>
                            <p
                                className={
                                    'py-[0.8vw] px-[1.4vw] border-[0.2vw] color-bg-main color-border-brown1 mx-[0.8vw] cursor-pointer rounded-[0.8vw] ' +
                                    (littleMenu === 1
                                        ? 'color-bg-subbold text-white'
                                        : '') +
                                    (littleMenu === 1 && pushActive
                                        ? ' animation-push '
                                        : '')
                                }
                                onClick={() => {
                                    animationPush();
                                    changeLittleMenu(1);
                                }}
                            >
                                아이콘
                            </p>
                            <p
                                className={
                                    'py-[0.8vw] px-[1.4vw] border-[0.2vw] color-bg-main color-border-brown1 ml-[0.8vw] cursor-pointer rounded-[0.8vw] ' +
                                    (littleMenu === 2
                                        ? 'color-bg-subbold text-white'
                                        : '') +
                                    (littleMenu === 2 && pushActive
                                        ? ' animation-push '
                                        : '')
                                }
                                onClick={() => {
                                    animationPush();
                                    changeLittleMenu(2);
                                }}
                            >
                                테마
                            </p>
                        </div>
                        <p className=""></p>
                    </div>
                    <div className="relative w-full h-[75%] p-[0.8vw] overflow-auto">
                        <div className="w-full flex flex-wrap items-start ">
                            {/* 프레임 보기 */}
                            {littleMenu === 0 ? (
                                <>
                                    {props.profileFrameInfo.map((frame) => {
                                        return (
                                            <img
                                                key={frame.profileFrameId}
                                                className={
                                                    'w-[7vw] h-[7vw] m-[0.8vw] cursor-pointer ' +
                                                    (tempFrame ===
                                                    frame.profileFrameId
                                                        ? 'border-[0.2vw] border-green-400'
                                                        : '')
                                                }
                                                src={`/src/assets/images/profile/frame (${frame.profileFrameId}).png`}
                                                alt=""
                                                style={{
                                                    aspectRatio: 1 / 1,
                                                }}
                                                onClick={() => {
                                                    changeTempFrame(
                                                        frame.profileFrameId
                                                    );
                                                }}
                                            />
                                        );
                                    })}
                                </>
                            ) : (
                                <></>
                            )}
                            {/* 아이콘 보기 */}
                            {littleMenu === 1 ? (
                                <>
                                    {props.iconInfo.map((icon) => {
                                        return (
                                            <img
                                                key={icon.profileIconId}
                                                className={
                                                    'w-[7vw] h-[7vw] m-[0.8vw] cursor-pointer ' +
                                                    (tempIcon ===
                                                    icon.profileIconId
                                                        ? 'border-[0.2vw] border-green-400'
                                                        : '')
                                                }
                                                src={`/src/assets/images/profile/icon (${icon.profileIconId}).png`}
                                                alt=""
                                                style={{ aspectRatio: 1 / 1 }}
                                                onClick={() => {
                                                    changeTempIcon(
                                                        icon.profileIconId
                                                    );
                                                }}
                                            />
                                        );
                                    })}
                                </>
                            ) : (
                                <></>
                            )}
                            {/* 테마 보기 */}
                            {littleMenu === 2 ? (
                                <>
                                    {props.themeInfo.map((theme) => {
                                        return (
                                            <img
                                                key={theme.themeId}
                                                className={
                                                    'w-[15vw] h-[7vw] m-[0.8vw] cursor-pointer ' +
                                                    (tempTheme === theme.themeId
                                                        ? 'border-[0.2vw] border-green-400'
                                                        : '')
                                                }
                                                src={`/src/assets/images/background/bg-${theme.themeId}-morning.webp`}
                                                alt=""
                                                style={{ aspectRatio: 1 / 1 }}
                                                onClick={() => {
                                                    changeTempTheme(
                                                        theme.themeId
                                                    );
                                                }}
                                            />
                                        );
                                    })}
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </>
            );
        }
    };
    return (
        <div className="absolute w-[90%] h-[95%] flex items-center justify-center color-text-textcolor border-[0.2vw] color-border-brown1 color-bg-main z-50 animation-modal rounded-[1vw]">
            {isNicknameChanging ? (
                <NicknameChangeModal
                    closeModal={closeNicknameModal}
                    nickName={userNickname}
                />
            ) : (
                <></>
            )}
            <div className="w-[32%] h-[85%] flex flex-col py-[1vw] items-center bg-white border-[0.2vw] color-border-brown1 rounded-[1vw]">
                <div
                    className="relative w-[12vw] h-[35%] border-[0.2vw]"
                    style={{ aspectRatio: 1 / 1 }}
                >
                    <img
                        className="absolute w-full h-full object-cover "
                        src={`/src/assets/images/profile/icon (${tempIcon}).png`}
                        alt=""
                        style={{ aspectRatio: 1 / 1 }}
                    />
                    <img
                        className="absolute w-full h-full object-cover "
                        src={`/src/assets/images/profile/frame (${tempFrame}).png`}
                        alt=""
                        style={{ aspectRatio: 1 / 1 }}
                    />
                </div>
                <div className="flex flex-col w-[80%] h-[25%] ">
                    <div className="flex w-full justify-between items-center mt-[0.8vw]">
                        <p className="text-[1.5vw] text-green-500">칭호</p>
                        {titleId === 1 ? (
                            <p className="text-[1.2vw]  text-gray-400">
                                칭호 없음
                            </p>
                        ) : (
                            <p className="text-[1.2vw] text-green-500">
                                {props.titleInfo[titleId - 1].titleName}
                            </p>
                        )}
                    </div>
                    <div className="flex w-full justify-between items-center my-[0.6vw]">
                        <div
                            className="w-[30%] text-[1.5vw] cursor-pointer"
                            onClick={() => setIsNicknameChanging(true)}
                        >
                            닉네임
                        </div>
                        <div
                            className="text-[1.2vw] text-start cursor-pointer  overflow-hidden text-ellipsis whitespace-nowrap "
                            onClick={() => setIsNicknameChanging(true)}
                        >
                            {userNickname}
                        </div>
                        <div
                            className="w-[24%] flex justify-center text-[1.2vw] text-center cursor-pointer border-[0.2vw] rounded-[0.8vw] color-border-subbold hover:color-bg-subbold hover:text-white"
                            onClick={() => setIsNicknameChanging(true)}
                        >
                            수정
                        </div>
                    </div>
                    <div className="flex w-full justify-between items-center">
                        <p className="text-[1.3vw]">경력</p>
                        <p className="text-[1.3vw]">{`${career}년차`}</p>
                    </div>
                </div>
                <div className="w-[80%] h-[30%]  flex flex-col color-border-subbold border-[0.2vw] mt-[1vw] px-[0.5vw]">
                    <div className="pt-[0.2vw] text-[1vw] text-left pl-[1vw]">
                        현재 착용 중인 아이템
                    </div>
                    <div className="w-full flex items-center justify-center">
                        <div
                            className="relative w-[30%] bg-white border-[0.1vw] border-black cursor-pointer"
                            style={{ aspectRatio: 1 / 1 }}
                            onClick={() => {
                                changeMenu(2);
                                changeLittleMenu(0);
                            }}
                        >
                            <img
                                className="w-full h-full object-cover "
                                src={`/src/assets/images/profile/frame (${tempFrame}).png`}
                                alt=""
                                style={{ aspectRatio: 1 / 1 }}
                            />
                        </div>
                        <div
                            className="relative w-[30%] bg-white border-[0.1vw] border-black mx-[0.8vw] my-[1.2vw] cursor-pointer"
                            style={{ aspectRatio: 1 / 1 }}
                            onClick={() => {
                                changeMenu(2);
                                changeLittleMenu(1);
                            }}
                        >
                            <img
                                className="w-full h-full object-cover "
                                src={`/src/assets/images/profile/icon (${tempIcon}).png`}
                                alt=""
                                style={{ aspectRatio: 1 / 1 }}
                            />
                        </div>
                        <div
                            className="relative w-[30%] bg-white border-[0.1vw] border-black cursor-pointer"
                            style={{ aspectRatio: 1 / 1 }}
                            onClick={() => {
                                changeMenu(2);
                                changeLittleMenu(2);
                            }}
                        >
                            <img
                                className="w-full h-full object-cover "
                                src={`/src/assets/images/background/bg-${tempTheme}-morning.webp`}
                                alt=""
                                style={{ aspectRatio: 1 / 1 }}
                            />
                        </div>
                    </div>
                </div>
                <div className="w-[80%] h-[10%]  flex items-center justify-between mt-[0.4vw]">
                    <p
                        className="h-fit text-[1.3vw] border-[0.1vw] py-[0.4vw] px-[1.6vw] rounded-[0.6vw] color-border-orange1 color-text-orange1 bg-white cursor-pointer"
                        onClick={props.proceedLogout}
                    >
                        로그아웃
                    </p>
                    <p
                        className="h-fit text-[1.3vw] border-[0.1vw] py-[0.4vw] px-[1.6vw] rounded-[0.6vw] border-white bg-red-600 text-white cursor-pointer"
                        onClick={props.proceedWithdrawal}
                    >
                        회원탈퇴
                    </p>
                </div>
            </div>
            <div className="w-[1%]"></div>
            <div className="relative w-[64%] h-[85%] bg-white border-[0.2vw] color-border-brown1 rounded-[1vw] ">
                {menuElement()}

                <div className="absolute -top-[2.1vw] left-[10%] flex">
                    <div
                        className={
                            'w-[9vw]  text-white bg-red-500 pt-[0.2vw] text-[1.4vw] cursor-pointer rounded-t-[1vw] ' +
                            (menu === 0 ? 'h-[4.2vw]' : 'h-[2.1vw]')
                        }
                        onClick={() => changeMenu(0)}
                    >
                        도전과제
                    </div>
                    {/* <div
                        className={
                            'w-[9vw]  text-white bg-blue-500 pt-[0.2vw] text-[1.4vw] mx-[2vw] cursor-pointer rounded-t-[1vw] ' +
                            (menu === 1 ? 'h-[4.2vw]' : 'h-[2.1vw]')
                        }
                        onClick={() => changeMenu(1)}
                    >
                        히스토리
                    </div> */}
                    <div
                        className={
                            'w-[9vw]  text-white bg-purple-500 pt-[0.2vw] ms-[2vw] text-[1.4vw] cursor-pointer rounded-t-[1vw] ' +
                            (menu === 2 ? 'h-[4.2vw]' : 'h-[2.1vw]')
                        }
                        onClick={() => changeMenu(2)}
                    >
                        꾸미기
                    </div>
                </div>
                <div
                    className={
                        'absolute right-[5%] bottom-[5%] w-[9vw]  text-white color-bg-subbold p-[0.2vw] text-[1.4vw] cursor-pointer rounded-[0.8vw] '
                    }
                    onClick={() => saveSettings()}
                >
                    적용하기
                </div>
            </div>
            <div
                className="absolute text-[1.3vw] flex items-center justify-center text-white top-[0.2vw] right-[0.2vw] w-[3vw] h-[3vw] border-[0.2vw] color-border-sublight color-bg-orange1 rounded-full cursor-pointer"
                onClick={() => {
                    closeMypageModal();
                }}
            >
                X
            </div>
        </div>
    );
}
