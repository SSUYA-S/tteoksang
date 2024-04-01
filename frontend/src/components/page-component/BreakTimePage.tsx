import { Client } from '@stomp/stompjs';
import ChattingModal from '../modal/ChattingModal';
import { useEffect, useState } from 'react';
import WarningModal from '../modal/WarningModal';

interface Prop {
    webSocketClient: Client;
    alertError: (message: string) => void;
    setStartFlag: React.Dispatch<React.SetStateAction<boolean>>;
    webSocketId: string;
}

export default function BreakTimePage(props: Prop) {
    const webSocketClient = props.webSocketClient;
    const alertError = props.alertError;

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

    //게임 나가기 관련
    const [isGetoutProceeding, setIsGetoutProceeding] =
        useState<boolean>(false);

    return (
        <>
            <div className="w-full h-full bg-black absolute top-0 left-0 flex flex-col items-center">
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
                <div className="text-[3vw] text-white">
                    지금은 휴식시간입니다.
                </div>
                <div className="text-[2vw] text-white">
                    대충 타이머 들어가는 위치
                </div>
                <ChattingModal
                    client={webSocketClient}
                    alertError={alertError}
                    defaultMode={1}
                />
                <div
                    className="absolute w-[10%] h-[10%] bottom-[17%] right-[2%] cursor-pointer"
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
        </>
    );
}
