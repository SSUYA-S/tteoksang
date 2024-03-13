import { useDispatch, useSelector } from 'react-redux';
import { bgmState, themeState } from '../../util/counter-slice';
import { useState } from 'react';

type settingType = {
    setSettingFlag: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function SettingModal(props: settingType) {
    const bgmSetting = useSelector((state: any) => state.reduxFlag.bgmFlag);
    const themeSetting = useSelector((state: any) => state.reduxFlag.themeType);
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
    return (
        <div className="absolute w-[40%] h-[50%] flex items-center justify-start color-text-textcolor border-8 color-border-brown1 color-bg-main z-50 rounded-2xl animation-modal ">
            <div className="w-[100%] h-full flex flex-col items-center">
                <div className="w-[90%] h-[15%] flex flex-col justify-end items-start">
                    <p className="text-4xl">설정</p>
                </div>
                <div className="w-[90%] h-[85%] text-2xl flex flex-col items-start">
                    <p className="text-3xl my-3">소리 설정</p>
                    <div className="flex w-80 justify-between px-4 my-2">
                        <p className="w-40 text-left">BGM</p>
                        <p
                            className={
                                'w-20 py-1 px-2 rounded-2xl cursor-pointer text-white ' +
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
                                'w-20 py-1 px-2 ml-4 rounded-2xl cursor-pointer text-white ' +
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
                    <div className="flex w-80 justify-between px-4 my-2">
                        <p className="w-40 text-left">효과음</p>
                        <p
                            className={
                                'w-20 py-1 px-2 rounded-2xl cursor-pointer text-white color-bg-orange1'
                            }
                        >
                            ON
                        </p>
                        <p className="w-20 py-1 px-2 ml-4 rounded-2xl cursor-pointer text-white color-bg-gray">
                            OFF
                        </p>
                    </div>
                    <p className="text-3xl my-3">화면</p>
                    <div className="w-full flex justify-between my-2">
                        <p
                            className={
                                'w-[20%] py-1 border color-border-orange1 rounded-3xl cursor-pointer ' +
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
                                'w-[20%] py-1 border color-border-orange1 rounded-3xl cursor-pointer ' +
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
                                'w-[20%] py-1 border color-border-orange1 rounded-3xl  cursor-pointer ' +
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
                                'w-[20%] py-1 border color-border-orange1 rounded-3xl  cursor-pointer ' +
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
                    <p className="text-3xl my-3">게임 플레이</p>
                    <div className="w-full flex justify-between">
                        <p className="text-3xl border py-2 px-8 rounded-3xl color-border-orange1 color-text-orange1 bg-white cursor-pointer">
                            로그아웃
                        </p>
                        <p className="text-3xl border py-2 px-8 rounded-3xl border-white bg-red-600 text-white cursor-pointer">
                            회원탈퇴
                        </p>
                    </div>
                </div>
            </div>
            <div
                className="absolute text-3xl flex items-center justify-center text-white -top-8 -right-8 w-16 h-16 border-[6px] color-border-sublight color-bg-orange1 rounded-full cursor-pointer"
                onClick={() => {
                    closeResultModal();
                }}
            >
                X
            </div>
        </div>
    );
}
