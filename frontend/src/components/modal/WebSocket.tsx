import Stomp from '@stomp/stompjs';
import { Client } from '@stomp/stompjs';
import { useEffect, useState } from 'react';

import { getWebSocketId } from '../../api/game';
import { httpStatusCode } from '../../util/http-status';

let stompClient: Stomp.Client;

/** 웹소켓 수신 시 트리거용 컴포넌트
 *
 * @returns
 */
export default function WebSocket() {
    const sendMessage = (msg: string) => {
        const message = JSON.stringify({
            type: 'CHAT',
            body: {
                message: msg,
            },
        });

        stompClient.publish({
            destination: '/app/chat',
            body: message,
        });
    };

    return <div className="hidden"></div>;
}
