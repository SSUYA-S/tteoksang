import { useState, useRef, useEffect } from 'react';
import { Chat } from '../../type/types';
import { Client } from '@stomp/stompjs';
import ChattingCard from '../section/ChattingCard';

interface Props {
    client: Client;
}

export default function ChattingModal(props: Props) {
    const [message, setMessage] = useState<string>('');
    //mode0: 일반보기 mode1: 자세히 보기 + 메시지 보기
    const [mode, setMode] = useState<number>(0);
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
        setMessage(event.target.value);
    };

    /** sendMessage()
     *  메시지 전송
     */
    const sendMessage = () => {
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
                className="absolute left-[40%] bottom-[5%] w-[30%] h-[15%] bg-white bg-opacity-90 z-10 text-3xl overflow-y-hidden break-all rounded"
                onClick={() => setMode(1)}
                ref={smallChatDivRef}
                onLoad={scrollDown}
            >
                {chattingList.map((chat, index) => {
                    return (
                        <p key={index}>
                            {chat.userNickname} : {chat.message}
                        </p>
                    );
                })}
            </div>
        );
    } else {
        renderingComponent = (
            <div className="absolute left-[5%] w-[30%] h-full bg-white bg-opacity-90 z-10 flex flex-col items-center">
                <div
                    className="w-full h-[90%] flex flex-col justify-start items-center overflow-scroll"
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
                        className="w-[90%] rounded m-[0.2vw] text-2xl"
                    ></input>
                    <button
                        className="w-[10%] color-bg-black text-white rounded m-[0.2vw] text-xl"
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
