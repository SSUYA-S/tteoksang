import Stomp from '@stomp/stompjs';
import { Client } from '@stomp/stompjs';

let stompClient: Stomp.Client;

export const handshake = (websocketId: string) => {
    stompClient = new Client({
        brokerURL: `${import.meta.env.VITE_REACT_WEBSOCKET_URL}`,
        debug: function (str) {
            console.log(str);
        },
        reconnectDelay: 5000,
        onConnect: () => {
            stompClient.subscribe('/topic/public', (message) => {
                console.log(`Received Public Message: ${message.body}`);
            });
            stompClient.subscribe(
                `/topic/private/${websocketId}`,
                (message) => {
                    console.log(`Received Private : ${message}`);
                }
            );
        },
    });

    stompClient.activate();

    return stompClient;
};

export const sendMessage = (msg: string) => {
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
