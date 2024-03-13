import { SetStateAction, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    profileFrameState,
    profileIconeState,
    profileThemeState,
} from '../../util/counter-slice';

type MyPageType = {
    setMypageFlag: React.Dispatch<SetStateAction<boolean>>;
};
export default function MyPageModal(props: MyPageType) {
    const [menu, setMenu] = useState<number>(0);
    const [littleMenu, setLittleMenu] = useState<number>(0);
    const dispatch = useDispatch();
    const profileTheme = useSelector(
        (state: any) => state.reduxFlag.profileTheme
    );
    const profileFrame = useSelector(
        (state: any) => state.reduxFlag.profileFrame
    );
    const profileIcon = useSelector(
        (state: any) => state.reduxFlag.profileIcon
    );

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

    const changeTheme = (prop: string) => {
        dispatch(profileThemeState(prop));
    };
    const changeIcon = (prop: number) => {
        dispatch(profileIconeState(prop));
    };
    const changeFrame = (prop: number) => {
        dispatch(profileFrameState(prop));
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
                    <div className="w-full h-[25%] flex justify-between items-center px-16">
                        <div className="flex text-3xl">
                            <p
                                className={
                                    'py-4 px-8 border-4 color-bg-main color-border-brown1 me-4 cursor-pointer ' +
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
                                    'py-4 px-8 border-4 color-bg-main color-border-brown1 mx-4 cursor-pointer ' +
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
                                    'py-4 px-8 border-4 color-bg-main color-border-brown1 ml-4 cursor-pointer ' +
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
                        <p className="py-4 px-8 border-4 color-bg-main color-border-brown1 text-3xl cursor-pointer">
                            자세히 보기
                        </p>
                    </div>
                    <div className="relative w-full h-[75%] p-4 overflow-auto">
                        <div className="w-full flex flex-wrap items-start ">
                            {/* 도전과제 전체보기 */}
                            {littleMenu === 0 ? (
                                <>
                                    <img
                                        className="w-40 h-40 m-4"
                                        src="/src/assets/images/icon/ui-icon-coin.png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                    />
                                    <img
                                        className="w-40 h-40 m-4"
                                        src="/src/assets/images/icon/ui-icon-coin.png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                    />
                                    <img
                                        className="w-40 h-40 m-4"
                                        src="/src/assets/images/icon/ui-icon-coin.png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                    />
                                    <img
                                        className="w-40 h-40 m-4"
                                        src="/src/assets/images/icon/ui-icon-coin.png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                    />
                                    <img
                                        className="w-40 h-40 m-4"
                                        src="/src/assets/images/icon/ui-icon-coin.png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                    />
                                    <img
                                        className="w-40 h-40 m-4"
                                        src="/src/assets/images/icon/ui-icon-coin.png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                    />
                                    <img
                                        className="w-40 h-40 m-4"
                                        src="/src/assets/images/icon/ui-icon-coin.png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                    />
                                </>
                            ) : (
                                <></>
                            )}
                            {/* 도전과제 보유중 보기 */}
                            {littleMenu === 1 ? (
                                <>
                                    <img
                                        className="w-40 h-40 m-4"
                                        src="/src/assets/images/icon/ui-icon-coin.png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                    />
                                    <img
                                        className="w-40 h-40 m-4"
                                        src="/src/assets/images/icon/ui-icon-coin.png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                    />
                                    <img
                                        className="w-40 h-40 m-4"
                                        src="/src/assets/images/icon/ui-icon-coin.png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                    />
                                    <img
                                        className="w-40 h-40 m-4"
                                        src="/src/assets/images/icon/ui-icon-coin.png"
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
                                        className="w-40 h-40 m-4"
                                        src="/src/assets/images/icon/ui-icon-coin.png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                    />
                                    <img
                                        className="w-40 h-40 m-4"
                                        src="/src/assets/images/icon/ui-icon-coin.png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                    />
                                    <img
                                        className="w-40 h-40 m-4"
                                        src="/src/assets/images/icon/ui-icon-coin.png"
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
                    <div className="w-full h-[25%] flex justify-between items-center px-16">
                        <div className="flex text-3xl">
                            <p
                                className={
                                    'py-4 px-8 border-4 color-bg-main color-border-brown1 me-4 cursor-pointer ' +
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
                                    'py-4 px-8 border-4 color-bg-main color-border-brown1 mx-4 cursor-pointer ' +
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
                        <p className="py-4 px-8 border-4 color-bg-main color-border-brown1 text-3xl cursor-pointer">
                            자세히 보기
                        </p>
                    </div>
                    <div className="relative w-full h-[75%] p-4 overflow-auto">
                        <div className="w-full flex flex-wrap items-start ">
                            <img
                                className="w-40 h-40 m-4"
                                src="/src/assets/images/etc/mypage-profile.png"
                                alt=""
                                style={{ aspectRatio: 1 / 1 }}
                            />
                            <img
                                className="w-40 h-40 m-4"
                                src="/src/assets/images/icon/ui-icon-coin.png"
                                alt=""
                                style={{ aspectRatio: 1 / 1 }}
                            />
                            <img
                                className="w-40 h-40 m-4"
                                src="/src/assets/images/icon/ui-icon-coin.png"
                                alt=""
                                style={{ aspectRatio: 1 / 1 }}
                            />
                            <img
                                className="w-40 h-40 m-4"
                                src="/src/assets/images/icon/ui-icon-coin.png"
                                alt=""
                                style={{ aspectRatio: 1 / 1 }}
                            />
                            <img
                                className="w-40 h-40 m-4"
                                src="/src/assets/images/icon/ui-icon-coin.png"
                                alt=""
                                style={{ aspectRatio: 1 / 1 }}
                            />
                            <img
                                className="w-40 h-40 m-4"
                                src="/src/assets/images/icon/ui-icon-coin.png"
                                alt=""
                                style={{ aspectRatio: 1 / 1 }}
                            />
                            <img
                                className="w-40 h-40 m-4"
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
                    <div className="w-full h-[25%] flex justify-between items-center px-16">
                        <div className="flex text-3xl">
                            <p
                                className={
                                    'py-4 px-8 border-4 color-bg-main color-border-brown1 me-4 cursor-pointer ' +
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
                                    'py-4 px-8 border-4 color-bg-main color-border-brown1 mx-4 cursor-pointer ' +
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
                                    'py-4 px-8 border-4 color-bg-main color-border-brown1 ml-4 cursor-pointer ' +
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
                    <div className="relative w-full h-[75%] p-4 overflow-auto">
                        <div className="w-full flex flex-wrap items-start ">
                            {/* 프레임 보기 */}
                            {littleMenu === 0 ? (
                                <>
                                    <img
                                        className={
                                            'w-40 h-40 m-4 cursor-pointer ' +
                                            (profileFrame === 1
                                                ? 'border-4 border-green-400'
                                                : '')
                                        }
                                        src="/src/assets/images/profile/frame (1).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                        onClick={() => {
                                            changeFrame(1);
                                        }}
                                    />
                                    <img
                                        className={
                                            'w-40 h-40 m-4 cursor-pointer ' +
                                            (profileFrame === 2
                                                ? 'border-4 border-green-400'
                                                : '')
                                        }
                                        src="/src/assets/images/profile/frame (2).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                        onClick={() => {
                                            changeFrame(2);
                                        }}
                                    />
                                    <img
                                        className={
                                            'w-40 h-40 m-4 cursor-pointer ' +
                                            (profileFrame === 3
                                                ? 'border-4 border-green-400'
                                                : '')
                                        }
                                        src="/src/assets/images/profile/frame (3).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                        onClick={() => {
                                            changeFrame(3);
                                        }}
                                    />
                                    <img
                                        className={
                                            'w-40 h-40 m-4 cursor-pointer ' +
                                            (profileFrame === 4
                                                ? 'border-4 border-green-400'
                                                : '')
                                        }
                                        src="/src/assets/images/profile/frame (4).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                        onClick={() => {
                                            changeFrame(4);
                                        }}
                                    />
                                    <img
                                        className={
                                            'w-40 h-40 m-4 cursor-pointer ' +
                                            (profileFrame === 5
                                                ? 'border-4 border-green-400'
                                                : '')
                                        }
                                        src="/src/assets/images/profile/frame (5).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                        onClick={() => {
                                            changeFrame(5);
                                        }}
                                    />
                                    <img
                                        className={
                                            'w-40 h-40 m-4 cursor-pointer ' +
                                            (profileFrame === 6
                                                ? 'border-4 border-green-400'
                                                : '')
                                        }
                                        src="/src/assets/images/profile/frame (6).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                        onClick={() => {
                                            changeFrame(6);
                                        }}
                                    />
                                    <img
                                        className={
                                            'w-40 h-40 m-4 cursor-pointer ' +
                                            (profileFrame === 7
                                                ? 'border-4 border-green-400'
                                                : '')
                                        }
                                        src="/src/assets/images/profile/frame (7).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                        onClick={() => {
                                            changeFrame(7);
                                        }}
                                    />
                                </>
                            ) : (
                                <></>
                            )}
                            {/* 아이콘 보기 */}
                            {littleMenu === 1 ? (
                                <>
                                    <img
                                        className={
                                            'w-40 h-40 m-4 cursor-pointer ' +
                                            (profileIcon === 1
                                                ? 'border-4 border-green-400'
                                                : '')
                                        }
                                        src="/src/assets/images/profile/icon (1).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                        onClick={() => {
                                            changeIcon(1);
                                        }}
                                    />
                                    <img
                                        className={
                                            'w-40 h-40 m-4 cursor-pointer ' +
                                            (profileIcon === 2
                                                ? 'border-4 border-green-400'
                                                : '')
                                        }
                                        src="/src/assets/images/profile/icon (2).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                        onClick={() => {
                                            changeIcon(2);
                                        }}
                                    />
                                    <img
                                        className={
                                            'w-40 h-40 m-4 cursor-pointer ' +
                                            (profileIcon === 3
                                                ? 'border-4 border-green-400'
                                                : '')
                                        }
                                        src="/src/assets/images/profile/icon (3).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                        onClick={() => {
                                            changeIcon(3);
                                        }}
                                    />
                                    <img
                                        className={
                                            'w-40 h-40 m-4 cursor-pointer ' +
                                            (profileIcon === 4
                                                ? 'border-4 border-green-400'
                                                : '')
                                        }
                                        src="/src/assets/images/profile/icon (4).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                        onClick={() => {
                                            changeIcon(4);
                                        }}
                                    />
                                    <img
                                        className={
                                            'w-40 h-40 m-4 cursor-pointer ' +
                                            (profileIcon === 5
                                                ? 'border-4 border-green-400'
                                                : '')
                                        }
                                        src="/src/assets/images/profile/icon (5).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                        onClick={() => {
                                            changeIcon(5);
                                        }}
                                    />
                                    <img
                                        className={
                                            'w-40 h-40 m-4 cursor-pointer ' +
                                            (profileIcon === 6
                                                ? 'border-4 border-green-400'
                                                : '')
                                        }
                                        src="/src/assets/images/profile/icon (6).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                        onClick={() => {
                                            changeIcon(6);
                                        }}
                                    />
                                    <img
                                        className={
                                            'w-40 h-40 m-4 cursor-pointer ' +
                                            (profileIcon === 7
                                                ? 'border-4 border-green-400'
                                                : '')
                                        }
                                        src="/src/assets/images/profile/icon (7).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                        onClick={() => {
                                            changeIcon(7);
                                        }}
                                    />
                                    <img
                                        className={
                                            'w-40 h-40 m-4 cursor-pointer ' +
                                            (profileIcon === 8
                                                ? 'border-4 border-green-400'
                                                : '')
                                        }
                                        src="/src/assets/images/profile/icon (8).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                        onClick={() => {
                                            changeIcon(8);
                                        }}
                                    />
                                    <img
                                        className={
                                            'w-40 h-40 m-4 cursor-pointer ' +
                                            (profileIcon === 9
                                                ? 'border-4 border-green-400'
                                                : '')
                                        }
                                        src="/src/assets/images/profile/icon (9).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                        onClick={() => {
                                            changeIcon(9);
                                        }}
                                    />
                                    <img
                                        className={
                                            'w-40 h-40 m-4 cursor-pointer ' +
                                            (profileIcon === 10
                                                ? 'border-4 border-green-400'
                                                : '')
                                        }
                                        src="/src/assets/images/profile/icon (10).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                        onClick={() => {
                                            changeIcon(10);
                                        }}
                                    />
                                    <img
                                        className={
                                            'w-40 h-40 m-4 cursor-pointer ' +
                                            (profileIcon === 11
                                                ? 'border-4 border-green-400'
                                                : '')
                                        }
                                        src="/src/assets/images/profile/icon (11).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                        onClick={() => {
                                            changeIcon(11);
                                        }}
                                    />
                                    <img
                                        className={
                                            'w-40 h-40 m-4 cursor-pointer ' +
                                            (profileIcon === 12
                                                ? 'border-4 border-green-400'
                                                : '')
                                        }
                                        src="/src/assets/images/profile/icon (12).png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                        onClick={() => {
                                            changeIcon(12);
                                        }}
                                    />
                                </>
                            ) : (
                                <></>
                            )}
                            {/* 테마 보기 */}
                            {littleMenu === 2 ? (
                                <>
                                    <img
                                        className={
                                            'w-80 h-40 m-4 cursor-pointer ' +
                                            (profileTheme === 'main'
                                                ? 'border-4 border-green-400'
                                                : '')
                                        }
                                        src="/src/assets/images/background/bg-main-morning.png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                        onClick={() => {
                                            changeTheme('main');
                                        }}
                                    />
                                    <img
                                        className={
                                            'w-80 h-40 m-4 cursor-pointer ' +
                                            (profileTheme === 'main2'
                                                ? 'border-4 border-green-400'
                                                : '')
                                        }
                                        src="/src/assets/images/background/bg-main2-morning.png"
                                        alt=""
                                        style={{ aspectRatio: 1 / 1 }}
                                        onClick={() => {
                                            changeTheme('main2');
                                        }}
                                    />
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
        <div className="absolute w-[90%] h-[95%] flex items-center justify-center color-text-textcolor border-8 color-border-brown1 color-bg-main z-50 animation-modal ">
            <div className="w-[32%] h-[85%] flex flex-col py-16 items-center bg-white border-4 color-border-brown1">
                <div
                    className="relative w-80 border-4"
                    style={{ aspectRatio: 1 / 1 }}
                >
                    <img
                        className="absolute w-full h-full object-cover "
                        src={`/src/assets/images/profile/icon (${profileIcon}).png`}
                        alt=""
                        style={{ aspectRatio: 1 / 1 }}
                    />
                    <img
                        className="absolute w-full h-full object-cover "
                        src={`/src/assets/images/profile/frame (${profileFrame}).png`}
                        alt=""
                        style={{ aspectRatio: 1 / 1 }}
                    />
                </div>
                <p className="text-4xl mt-10 text-green-500">뿌리채소의 제왕</p>
                <div className="flex my-6 text-5xl items-center justify-center">
                    <p>제노</p>
                    <p>ㅁ</p>
                </div>
                <p className="text-3xl">25년차</p>
                <div className="w-full flex items-center justify-center">
                    <div
                        className="relative w-[20%] bg-white border-2 border-black cursor-pointer"
                        style={{ aspectRatio: 1 / 1 }}
                        onClick={() => {
                            changeMenu(2);
                            changeLittleMenu(0);
                        }}
                    >
                        <img
                            className="w-full h-full object-cover "
                            src={`/src/assets/images/profile/frame (${profileFrame}).png`}
                            alt=""
                            style={{ aspectRatio: 1 / 1 }}
                        />
                    </div>
                    <div
                        className="relative w-[20%] bg-white border-2 border-black mx-4 my-8 cursor-pointer"
                        style={{ aspectRatio: 1 / 1 }}
                        onClick={() => {
                            changeMenu(2);
                            changeLittleMenu(1);
                        }}
                    >
                        <img
                            className="w-full h-full object-cover "
                            src={`/src/assets/images/profile/icon (${profileIcon}).png`}
                            alt=""
                            style={{ aspectRatio: 1 / 1 }}
                        />
                    </div>
                    <div
                        className="relative w-[20%] bg-white border-2 border-black cursor-pointer"
                        style={{ aspectRatio: 1 / 1 }}
                        onClick={() => {
                            changeMenu(2);
                            changeLittleMenu(2);
                        }}
                    >
                        <img
                            className="w-full h-full object-cover "
                            src={`/src/assets/images/background/bg-${profileTheme}-morning.png`}
                            alt=""
                            style={{ aspectRatio: 1 / 1 }}
                        />
                    </div>
                </div>
            </div>
            <div className="mx-1"></div>
            <div className="relative w-[64%] h-[85%] bg-white border-4 color-border-brown1">
                {menuElement()}

                <div className="absolute -top-12 left-[10%] flex">
                    <div
                        className={
                            'w-48  text-white bg-red-500 pt-2 text-4xl cursor-pointer ' +
                            (menu === 0 ? 'h-24' : 'h-12')
                        }
                        onClick={() => changeMenu(0)}
                    >
                        도전과제
                    </div>
                    <div
                        className={
                            'w-48  text-white bg-blue-500 pt-2 text-4xl mx-12 cursor-pointer ' +
                            (menu === 1 ? 'h-24' : 'h-12')
                        }
                        onClick={() => changeMenu(1)}
                    >
                        히스토리
                    </div>
                    <div
                        className={
                            'w-48  text-white bg-purple-500 pt-2 text-4xl cursor-pointer ' +
                            (menu === 2 ? 'h-24' : 'h-12')
                        }
                        onClick={() => changeMenu(2)}
                    >
                        꾸미기
                    </div>
                </div>
            </div>
            <div
                className="absolute text-3xl flex items-center justify-center text-white top-2 right-4 w-16 h-16 border-[6px] color-border-sublight color-bg-orange1 rounded-full cursor-pointer"
                onClick={() => {
                    closeMypageModal();
                }}
            >
                X
            </div>
        </div>
    );
}
