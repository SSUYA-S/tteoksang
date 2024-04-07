import { Client } from '@stomp/stompjs';
import ChattingModal from '../modal/ChattingModal';
import { useEffect, useState } from 'react';
import WarningModal from '../modal/WarningModal';
import BreakingSettingModal from '../modal/BreakingSettingModal';

interface Prop {
    webSocketClient: Client;
    alertError: (message: string) => void;
    setStartFlag: React.Dispatch<React.SetStateAction<boolean>>;
    webSocketId: string;
    proceedLogout: () => void;
    proceedWithdrawal: () => void;
    breakTime: string;
    timerStartTime: string;
}

export default function BreakTimePage(props: Prop) {
    const webSocketClient = props.webSocketClient;
    const alertError = props.alertError;

    //설정 모달 열고 닫기
    const [isSettingOpened, setIsSettingOpened] = useState<boolean>(false);

    const [hour, setHour] = useState<number>(0);
    const [min, setMin] = useState<number>(0);
    const [sec, setSec] = useState<number>(0);

    const [seconds, setSeconds] = useState<number>(0);

    useEffect(() => {
        const endTime = new Date(props.breakTime);
        const startTime = new Date(props.timerStartTime);

        //dummy code
        // const endTime = new Date('2024-04-01T23:12:00');
        // const startTime = new Date('2024-04-01T23:11:55');
        setSeconds((endTime.getTime() - startTime.getTime()) / 1000);
    }, []);

    useEffect(() => {
        //timer
        const timer = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        if (seconds <= 0) {
            clearInterval(timer);
        }

        setHour(Math.floor(seconds / (60 * 60)));
        setMin(Math.floor((seconds % (60 * 60)) / 60));
        setSec(Math.floor((seconds % (60 * 60)) % 60));

        return () => {
            clearInterval(timer);
        };
    }, [seconds]);

    /** handleGetOut()
     *  게임에서 나간다. 웹 소켓 닫고 메인 화면으로 이동
     */
    const handleGetOut = async () => {
        //websocket보내기
        const quitMsg = JSON.stringify({
            type: 'QUIT_GAME',
            body: {},
        });
        if (webSocketClient.connected) {
            webSocketClient.publish({
                destination: `/app/private/${props.webSocketId}`,
                body: quitMsg,
            });

            webSocketClient.deactivate();
        }
        //나가기
        props.setStartFlag(false);
    };

    /** handleCloseErrorModal()
     * 로그아웃 모달 비활성화 */
    const handleCloseErrorModal = () => {
        setIsGetoutProceeding(false);
    };

    /**설정 열기 */
    const openSettingElement = () => {
        setIsSettingOpened(true);
    };

    //게임 나가기 관련
    const [isGetoutProceeding, setIsGetoutProceeding] =
        useState<boolean>(false);

    return (
        <>
            <div className="w-full h-full bg-black absolute top-0 left-0 flex flex-col items-center">
                {isSettingOpened ? (
                    <BreakingSettingModal
                        setSettingFlag={setIsSettingOpened}
                        proceedLogout={props.proceedLogout}
                        proceedWithdrawal={props.proceedWithdrawal}
                    />
                ) : (
                    <></>
                )}
                {isGetoutProceeding ? (
                    <WarningModal
                        handleOK={handleGetOut}
                        handleCancel={handleCloseErrorModal}
                        message="메인화면으로 돌아가시겠습니까?"
                        cancelMessage="취소"
                        okMessage="나가기"
                    />
                ) : (
                    <></>
                )}
                <div className="text-[2vw] text-white">
                    지금은 결산시간입니다.
                </div>
                <div className="text-[1.5vw] text-white">
                    {`${hour > 9 ? hour : '0' + hour}시간 ${
                        min > 9 ? min : '0' + min
                    }분 ${sec > 9 ? sec : '0' + sec}초 남음`}
                </div>
                <ChattingModal
                    client={webSocketClient}
                    alertError={alertError}
                    defaultMode={1}
                />
                <div className="absolute w-[20%] h-[10%] bottom-[20%] right-[4%] flex">
                    <div
                        className="w-[50%] h-full cursor-pointer"
                        onClick={() => {
                            openSettingElement();
                        }}
                    >
                        <img
                            className="w-full"
                            src="/src/assets/images/icon/ui-icon-setting.webp"
                            alt=""
                            style={{ aspectRatio: 1 / 1 }}
                        />
                        <img
                            src="/src/assets/images/icon/ui-icon-setting-text.webp"
                            alt=""
                        />
                    </div>
                    <div
                        className="w-[50%] h-full cursor-pointer"
                        onClick={() => {
                            setIsGetoutProceeding(true);
                        }}
                    >
                        <img
                            className="w-full"
                            src="/src/assets/images/icon/ui-icon-quit.webp"
                            alt=""
                            style={{ aspectRatio: 1 / 1 }}
                        />
                        <img
                            src="/src/assets/images/icon/ui-icon-quit-text.webp"
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
