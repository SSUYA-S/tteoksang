import Stomp from '@stomp/stompjs';
import { Client } from '@stomp/stompjs';

let stompClient: Stomp.Client;

export const handshake = () => {
    stompClient = new Client({
        brokerURL: `${import.meta.env.VITE_REACT_WEBSOCKET_URL}`,
        debug: function (str) {
            console.log(str);
        },
        reconnectDelay: 5000,
        onConnect: () => {
            stompClient.subscribe('/', (message) => {
                console.log(`Received: ${message.body}`);
            });
        },
    });

    stompClient.activate();

    return stompClient;
};

export const sendMessage = (msg: string) => {
    stompClient.publish({
        destination: '/',
        body: msg,
    });
};
