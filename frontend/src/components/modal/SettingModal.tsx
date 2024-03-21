import { useDispatch, useSelector } from 'react-redux';
import { bgmState, themeState } from '../../util/counter-slice';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { logout } from '../../api/auth';
import { httpStatusCode } from '../../util/http-status';

type settingType = {
    setSettingFlag: React.Dispatch<React.SetStateAction<boolean>>;
    setStartFlag: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function SettingModal(props: settingType) {
    const bgmSetting = useSelector(
        (state: any) => state.reduxFlag.reduxSlice.bgmFlag
    );
    const themeSetting = useSelector(
        (state: any) => state.reduxFlag.reduxSlice.themeType
    );
    const dispatch = useDispatch();

    //animation 효과
    const [pushActive, setPushActive] = useState(false);
    const animationPush = () => {
        setPushActive(true);
        setTimeout(() => {
            setPushActive(false);
        }, 1000); // 1초 후에 애니메이션 상태를 비활성화합니다.
    };
    //animation 효과

    const onBgm = () => {
        dispatch(bgmState(true));
    };
    const offBgm = () => {
        dispatch(bgmState(false));
    };
    const settingTheme = (prop: string) => {
        dispatch(themeState(prop));
    };

    const closeResultModal = () => {
        props.setSettingFlag(false);
    };

    /** handleLogOut()
     *  로그아웃
     */
    const handleLogOut = async () => {
        const res = await logout();
        if (res.status === httpStatusCode.OK) {
            props.setStartFlag(false);
        } else {
            console.log('Logout error');
        }
    };

    return (
        <div className="absolute w-[40%] h-[50%] flex items-center justify-start color-text-textcolor border-[0.4vw] color-border-brown1 color-bg-main z-50 rounded-[0.8vw] animation-modal ">
            <div className="w-[100%] h-full flex flex-col items-center">
                <div className="w-[90%] h-[15%] flex flex-col justify-end items-start">
                    <p className="text-[1.6vw]">설정</p>
                </div>
                <div className="w-[90%] h-[85%] text-[1vw] flex flex-col items-start">
                    <p className="text-[1.3vw] my-[0.4vw]">소리 설정</p>
                    <div className="flex w-[18vw] justify-between px-[1vw] my-[0.2vw]">
                        <p className="w-[9vw] text-left">BGM</p>
                        <p
                            className={
                                'w-[4.5vw] py-[0.2vw] px-[0.4vw] rounded-[0.6vw] cursor-pointer text-white ' +
                                (bgmSetting
                                    ? 'color-bg-orange1'
                                    : 'color-bg-gray')
                            }
                            onClick={() => {
                                onBgm();
                            }}
                        >
                            ON
                        </p>
                        <p
                            className={
                                'w-[4.5vw] py-[0.2vw] px-[0.4vw] ml-[0.3vw] rounded-[0.6vw] cursor-pointer text-white ' +
                                (!bgmSetting
                                    ? 'color-bg-orange1'
                                    : 'color-bg-gray')
                            }
                            onClick={() => {
                                offBgm();
                            }}
                        >
                            OFF
                        </p>
                    </div>
                    <div className="flex w-[18vw] justify-between px-[1vw] my-[0.2vw]">
                        <p className="w-[9vw] text-left">효과음</p>
                        <p
                            className={
                                'w-[4.5vw] py-[0.2vw] px-[0.4vw] rounded-[0.6vw] cursor-pointer text-white color-bg-orange1'
                            }
                        >
                            ON
                        </p>
                        <p className="w-[4.5vw] py-[0.2vw] px-[0.4vw] ml-[0.3vw] rounded-[0.6vw] cursor-pointer text-white color-bg-gray">
                            OFF
                        </p>
                    </div>
                    <p className="text-[1.3vw] my-[0.2vw]">화면</p>
                    <div className="w-full flex justify-between my-[0.4vw]">
                        <p
                            className={
                                'w-[20%] py-[0.2vw] border-[0.1vw] color-border-orange1 rounded-[0.6vw] cursor-pointer ' +
                                (themeSetting === 'auto'
                                    ? 'color-bg-orange1 text-white'
                                    : 'bg-white color-text-orange1') +
                                (themeSetting === 'auto' && pushActive
                                    ? ' animation-push '
                                    : '    ')
                            }
                            onClick={() => {
                                animationPush();
                                settingTheme('auto');
                            }}
                        >
                            시간따라
                        </p>
                        <p
                            className={
                                'w-[20%] py-[0.2vw] border-[0.1vw] color-border-orange1 rounded-[0.6vw] cursor-pointer ' +
                                (themeSetting === 'morning'
                                    ? 'color-bg-orange1 text-white'
                                    : 'bg-white color-text-orange1') +
                                (themeSetting === 'morning' && pushActive
                                    ? ' animation-push '
                                    : '    ')
                            }
                            onClick={() => {
                                animationPush();
                                settingTheme('morning');
                            }}
                        >
                            낮
                        </p>
                        <p
                            className={
                                'w-[20%] py-[0.2vw] border-[0.1vw] color-border-orange1 rounded-[0.6vw]  cursor-pointer ' +
                                (themeSetting === 'evening'
                                    ? 'color-bg-orange1 text-white'
                                    : 'bg-white color-text-orange1') +
                                (themeSetting === 'evening' && pushActive
                                    ? ' animation-push '
                                    : '    ')
                            }
                            onClick={() => {
                                animationPush();
                                settingTheme('evening');
                            }}
                        >
                            저녁
                        </p>
                        <p
                            className={
                                'w-[20%] py-[0.2vw] border-[0.1vw] color-border-orange1 rounded-[0.6vw]  cursor-pointer ' +
                                (themeSetting === 'night'
                                    ? 'color-bg-orange1 text-white'
                                    : 'bg-white color-text-orange1') +
                                (themeSetting === 'night' && pushActive
                                    ? ' animation-push '
                                    : '    ')
                            }
                            onClick={() => {
                                animationPush();
                                settingTheme('night');
                            }}
                        >
                            밤
                        </p>
                    </div>
                    <p>시간에 따라 배경 화면이 변합니다.</p>
                    <p className="text-[1.3vw] my-[0.4vw]">게임 플레이</p>
                    <div className="w-full flex justify-between">
                        <p
                            className="text-[1.3vw] border-[0.1vw] py-[0.4vw] px-[1.6vw] rounded-[0.6vw] color-border-orange1 color-text-orange1 bg-white cursor-pointer"
                            onClick={handleLogOut}
                        >
                            로그아웃
                        </p>
                        <p className="text-[1.3vw] border-[0.1vw] py-[0.4vw] px-[1.6vw] rounded-[0.6vw] border-white bg-red-600 text-white cursor-pointer">
                            회원탈퇴
                        </p>
                    </div>
                </div>
            </div>
            <div
                className="absolute text-[1.6vw] flex items-center justify-center text-white -top-[1.6vw] -right-[2vw] w-[3.4vw] h-[3.4vw] border-[0.4vw] color-border-sublight color-bg-orange1 rounded-full cursor-pointer"
                onClick={() => {
                    closeResultModal();
                }}
            >
                X
            </div>
        </div>
    );
}
