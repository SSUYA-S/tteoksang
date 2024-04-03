import { useState, useRef, useEffect } from 'react';
import { Chat } from '../../type/types';
import { Client } from '@stomp/stompjs';
import ChattingCard from '../section/ChattingCard';

interface Props {
    client: Client;
    alertError: (message: string) => void;
    defaultMode: number;
}

export default function ChattingModal(props: Props) {
    const [message, setMessage] = useState<string>('');
    //mode0: 일반보기 mode1: 자세히 보기 + 메시지 보기
    const [mode, setMode] = useState<number>(props.defaultMode);
    const smallChatDivRef = useRef<HTMLDivElement>(null);
    const bigChatRef = useRef<HTMLDivElement>(null);
    const [chattingList, setChattingList] = useState<Chat[]>([]);

    useEffect(() => {
        if (props.client && props.client.connected) {
            props.client.subscribe(`/topic/chat`, (message) => {
                const msgBody = JSON.parse(message.body);
                if (msgBody.type === 'CHAT') {
                    setChattingList((prev) => {
                        return [...prev, msgBody.body];
                    });
                    scrollDown();
                }
            });
        }
    }, [props.client, props.client.connected]);

    /**updateMessage()
     * input 메시지 양방향 바인딩
     */
    const updateMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length <= 400) {
            setMessage(event.target.value);
        } else {
            props.alertError('글자수는 최대 400자로 제한되어 있습니다.');
        }
    };

    /** sendMessage()
     *  메시지 전송
     */
    const sendMessage = () => {
        if (message === '') {
            props.alertError('메시지가 없습니다. 보낼 메시지를 적어 주세요.');
            return;
        }
        if (message.length > 400) {
            props.alertError('글자수는 최대 400자로 제한되어 있습니다.');
            return;
        }

        const stompClient = props.client;

        const msg = JSON.stringify({
            type: 'CHAT',
            body: {
                message,
            },
        });

        stompClient.publish({
            destination: '/app/chat',
            body: msg,
        });

        setMessage('');
    };

    useEffect(() => {
        scrollDown();
    }, [chattingList, mode]);

    /**채팅 업로드시 스크롤 아래로 내리기 */
    const scrollDown = () => {
        if (smallChatDivRef.current) {
            smallChatDivRef.current.scrollTop =
                smallChatDivRef.current.scrollHeight;
        }
        if (bigChatRef.current) {
            bigChatRef.current.scrollTop = bigChatRef.current.scrollHeight;
        }
    };

    //rendering select
    let renderingComponent = <></>;

    if (mode === 0) {
        renderingComponent = (
            <div
                className="absolute left-[34%] bottom-[2%] w-[36%] h-[15%] border-[0.2vw] rounded-[1vw] color-border-subbold bg-white bg-opacity-80 z-10 text-[1.6vw] overflow-y-hidden break-all cursor-pointer"
                onClick={() => setMode(1)}
                ref={smallChatDivRef}
                onLoad={scrollDown}
            >
                {chattingList.map((chat, index) => {
                    if (index > chattingList.length - 4)
                        return (
                            <p
                                className="text-start text-[1.3vw] overflow-hidden text-ellipsis whitespace-nowrap my-[0.2vw] px-[1vw]"
                                key={index}
                            >
                                {chat.userNickname} : {chat.message}
                            </p>
                        );
                })}
            </div>
        );
    } else {
        renderingComponent = (
            <div className="absolute left-[34%] bottom-0 w-[32%] h-[90%] border-[0.4vw] color-border-subbold rounded-[1vw] bg-white bg-opacity-90 z-30 flex flex-col items-center">
                <div
                    className="w-full h-[90%] overflow-y-auto flex flex-col justify-start items-center overflow-scroll my-[1vw]"
                    ref={bigChatRef}
                >
                    {chattingList.map((chat, index) => {
                        return <ChattingCard key={index} chat={chat} />;
                    })}
                </div>
                <div className="flex w-full h-[10%]">
                    <input
                        type="text"
                        onChange={updateMessage}
                        value={message}
                        className="w-[85%] overflow-y-auto rounded m-[0.2vw] text-[1.4vw] p-[0.5vw]"
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                sendMessage();
                            }
                        }}
                    ></input>
                    <button
                        className="w-[15%] color-bg-subbold text-white rounded m-[0.2vw] text-[1vw]"
                        onClick={sendMessage}
                    >
                        보내기
                    </button>
                </div>
                <div
                    className="absolute text-[1.3vw] flex items-center justify-center text-white top-[0.2vw] right-[0.2vw] w-[3vw] h-[3vw] border-[0.2vw] color-border-sublight color-bg-orange1 rounded-full cursor-pointer"
                    onClick={() => {
                        setMode(0);
                    }}
                >
                    X
                </div>
            </div>
        );
    }

    return <>{renderingComponent}</>;
}
