import { useDispatch, useSelector } from 'react-redux';
import { bgmState } from '../../util/counter-slice';
import { useEffect } from 'react';

type settingType = {
    setSettingFlag: React.Dispatch<React.SetStateAction<boolean>>;
    proceedLogout: () => void;
    proceedWithdrawal: () => void;
};

export default function BreakingSettingModal(props: settingType) {
    const bgmSetting = useSelector(
        (state: any) => state.reduxFlag.reduxSlice.bgmFlag
    );
    const dispatch = useDispatch();

    useEffect(() => {
        // ESC 키를 눌렀을 때 실행할 함수
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                props.setSettingFlag(false); // ESC 키가 눌리면 컴포넌트를 안 보이게 설정
            }
        };
        // 컴포넌트가 마운트될 때 keydown 이벤트 리스너 추가
        document.addEventListener('keydown', handleKeyDown);

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const onBgm = () => {
        dispatch(bgmState(true));
    };
    const offBgm = () => {
        dispatch(bgmState(false));
    };

    const closeResultModal = () => {
        props.setSettingFlag(false);
    };

    return (
        <>
            <div
                className="w-full h-full absolute top-0 left-0 opacity-0 z-30"
                onClick={closeResultModal}
            ></div>
            <div className="absolute w-[40%] h-[40%] left-[30%] top-[30%] flex items-center justify-start color-text-textcolor border-[0.4vw] color-border-brown1 color-bg-main z-40 rounded-[0.8vw] animation-modal ">
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
        </>
    );
}
