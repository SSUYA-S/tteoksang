import { useState } from 'react';
import { sendMessage } from '../../util/websocket/client';

export default function ChattingModal() {
    const [message, setMessage] = useState<string>('');

    const updateMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const send = () => {
        sendMessage(message);
    };

    return (
        <div className="absolute bottom-1 left-[50%]">
            <input type="text" onChange={updateMessage} value={message}></input>
            <button className="color-bg-black text-white" onClick={send}>
                보내기
            </button>
        </div>
    );
}
