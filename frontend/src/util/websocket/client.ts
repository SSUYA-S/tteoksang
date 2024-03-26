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
    });

    stompClient.activate();

    return stompClient;
};
