import { Client } from '@stomp/stompjs';
import { Dispatch, SetStateAction, useEffect } from 'react';

import { handshake } from '../../util/websocket/client';
import { getWebSocketId } from '../../api/game';
import { httpStatusCode } from '../../util/http-status';
import { useDispatch } from 'react-redux';
import {
    buyableProductIdState,
    privateEventState,
    productInfoState,
    specialEventState,
} from '../../util/product-and-event';
import {
    Article,
    FinalReportType,
    HalfReportType,
    OfflineReportType,
    ProductBucket,
    QuarterReportType,
} from '../../type/types';
import { titleState } from '../../util/myprofile-slice';
import {
    brokerLevelState,
    goldState,
    myProductState,
    purchasedQuantityState,
    vehicleLevelState,
    warehouseLevelState,
} from '../../util/myproduct-slice';
import { profileThemeState } from '../../util/counter-slice';

interface Prop {
    setWebSocketId: Dispatch<SetStateAction<string>>;
    setWebSocketClient: Dispatch<SetStateAction<Client>>;
    setIngameTurn: React.Dispatch<React.SetStateAction<number>>;
    setIngameTime: React.Dispatch<React.SetStateAction<string>>;
    setTurnStartTime: React.Dispatch<React.SetStateAction<string>>;
    client: Client;
    webSocketId: string;
    newsReceived: (publishTurn: number, articleList: Article[]) => void;
    setStartFlag: React.Dispatch<React.SetStateAction<boolean>>;
    reportReceived: (
        type: string,
        body:
            | QuarterReportType
            | HalfReportType
            | OfflineReportType
            | FinalReportType
    ) => void;
}

/** 웹소켓 핸드쉐이크 및 수신 정보 처리 담당(채팅 제외)*/
export default function WebSocket(props: Prop) {
    const dispatch = useDispatch();
    //websocket
    //websocketId 받아오기 -> handshake
    useEffect(() => {
        getWebSocketId()
            .then((res) => {
                if (res.status === httpStatusCode.OK) {
                    const id = res.data.webSocketId;
                    const client = handshake(id);
                    client.onConnect = () => {
                        //public subscribe
                        client.subscribe('/topic/public', (message) => {
                            const msg = JSON.parse(message.body);
                            switch (msg.type) {
                                case 'GET_PUBLIC_EVENT':
                                    //공통 이벤트 수신
                                    if (msg.isSuccess) {
                                        const info = msg.body;
                                        console.log(info);
                                        dispatch(
                                            productInfoState(
                                                info.productInfoList
                                            )
                                        );
                                        dispatch(
                                            buyableProductIdState(
                                                info.buyableProductList
                                            )
                                        );
                                        //더미데이터 수정할 것!!!
                                        // dispatch(
                                        //     buyableProductIdState([1, 2, 5, 6])
                                        // );
                                        dispatch(
                                            specialEventState(
                                                info.specialEventId
                                            )
                                        );
                                        //새 턴이 시작되었으니 이번 턴에 산 품목 개수는 0으로 초기화
                                        dispatch(purchasedQuantityState(0));

                                        props.setIngameTurn(info.turn);
                                        props.setIngameTime(info.inGameTime);
                                        props.setTurnStartTime(
                                            info.turnStartTime
                                        );

                                        //추가할 것)시간설정 로직
                                    } else {
                                        console.log(`ERROR ON ${msg.type}`);
                                    }
                                    break;
                                case 'GET_NEWSPAPER':
                                    //신문 발행
                                    if (msg.isSuccess) {
                                        const newspaper = msg.body;
                                        //뉴스 수신시 로직 수정
                                        if (newspaper) {
                                            props.newsReceived(
                                                newspaper.publishTurn,
                                                newspaper.articleList
                                            );
                                        }
                                    } else {
                                        console.log(`ERROR ON ${msg.type}`);
                                    }
                                    break;
                            }
                        });
                        //private channel 구독
                        client.subscribe(`/topic/private/${id}`, (message) => {
                            const msg = JSON.parse(message.body);
                            switch (msg.type) {
                                case 'CHANGE_TITLE':
                                    //칭호 변경 완료
                                    if (msg.isSuccess) {
                                        dispatch(titleState(msg.body.titleId));
                                    } else {
                                        console.log(`ERROR ON ${msg.type}`);
                                    }
                                    break;
                                case 'BUY_PRODUCT':
                                    //물품 구매 완료
                                    if (msg.isSuccess) {
                                        const res = msg.body;
                                        dispatch(goldState(res.gold));
                                        //개수가 0개인 것 제외
                                        const newProductList =
                                            res.productList.filter(
                                                (prod: ProductBucket) =>
                                                    prod.productQuantity !== 0
                                            );
                                        dispatch(
                                            myProductState(newProductList)
                                        );
                                        dispatch(
                                            purchasedQuantityState(
                                                res.purchasedQuantity
                                            )
                                        );
                                    } else {
                                        console.log(`ERROR ON ${msg.type}`);
                                    }
                                    break;
                                case 'SELL_PRODUCT':
                                    //물품 판매 완료
                                    if (msg.isSuccess) {
                                        const res = msg.body;
                                        dispatch(goldState(res.gold));
                                        //개수가 0개인 것 제외
                                        const newProductList =
                                            res.productList.filter(
                                                (prod: ProductBucket) =>
                                                    prod.productQuantity !== 0
                                            );
                                        dispatch(
                                            myProductState(newProductList)
                                        );
                                    } else {
                                        console.log(`ERROR ON ${msg.type}`);
                                    }
                                    break;
                                case 'UPGRADE_WAREHOUSE':
                                    //창고 업그레이드 완료
                                    if (msg.isSuccess) {
                                        const res = msg.body;
                                        dispatch(goldState(res.gold));
                                        dispatch(
                                            warehouseLevelState(
                                                res.warehouseLevel
                                            )
                                        );
                                    } else {
                                        console.log(`ERROR ON ${msg.type}`);
                                    }
                                    break;
                                case 'UPGRADE_BROKER':
                                    //중개소 업그레이드 완료
                                    if (msg.isSuccess) {
                                        const res = msg.body;
                                        dispatch(goldState(res.gold));
                                        dispatch(
                                            brokerLevelState(res.brokerLevel)
                                        );
                                    } else {
                                        console.log(`ERROR ON ${msg.type}`);
                                    }
                                    break;
                                case 'UPGRADE_VEHICLE':
                                    //탈 것 업그레이드 완료
                                    if (msg.isSuccess) {
                                        const res = msg.body;
                                        dispatch(goldState(res.gold));
                                        dispatch(
                                            vehicleLevelState(res.vehicleLevel)
                                        );
                                    } else {
                                        console.log(`ERROR ON ${msg.type}`);
                                    }
                                    break;
                                case 'GIVEUP_GAME':
                                    //게임 포기
                                    //다시 게임 시작 화면으로
                                    if (msg.isSuccess) {
                                        props.setStartFlag(false);
                                    } else {
                                        console.log(`ERROR ON ${msg.type}`);
                                    }
                                    break;
                                case 'GET_INGAME_TIME':
                                    //추가할 것) 시간 관련 로직
                                    break;
                                case 'GET_PRIVATE_EVENT':
                                    //개인 이벤트 발생
                                    if (msg.isSuccess) {
                                        const res = msg.body;
                                        dispatch(goldState(res.gold));
                                        dispatch(
                                            privateEventState(
                                                res.privateEventId
                                            )
                                        );
                                    } else {
                                        console.log(`ERROR ON ${msg.type}`);
                                    }
                                    break;
                                case 'GET_MY_GOLD':
                                    //내 보유 금액 조회
                                    if (msg.isSuccess) {
                                        const res = msg.body;
                                        dispatch(goldState(res.gold));
                                    } else {
                                        console.log(`ERROR ON ${msg.type}`);
                                    }
                                    break;
                                case 'GET_INFRA_LEVEL':
                                    //내 시설 레벨 조회
                                    if (msg.isSuccess) {
                                        const res = msg.body;
                                        dispatch(
                                            warehouseLevelState(
                                                res.warehouseLevel
                                            )
                                        );
                                        dispatch(
                                            vehicleLevelState(res.vehicleLevel)
                                        );
                                        dispatch(
                                            brokerLevelState(res.brokerLevel)
                                        );
                                    } else {
                                        console.log(`ERROR ON ${msg.type}`);
                                    }
                                    break;
                                case 'GET_WAREHOUSE_INFO':
                                    //창고 상황 조회
                                    if (msg.isSuccess) {
                                        const res = msg.body;
                                        dispatch(
                                            warehouseLevelState(
                                                res.warehouseLevel
                                            )
                                        );
                                        dispatch(
                                            vehicleLevelState(res.vehicleLevel)
                                        );
                                        dispatch(
                                            brokerLevelState(res.brokerLevel)
                                        );
                                        dispatch(
                                            myProductState(res.productList)
                                        );
                                    } else {
                                        console.log(`ERROR ON ${msg.type}`);
                                    }
                                    break;
                                case 'GET_TOTAL_INFO':
                                    //게임 초기 현재 상태 조회
                                    if (msg.isSuccess) {
                                        const res = msg.body;
                                        // console.log('getTotal : ');
                                        // console.log(res);
                                        dispatch(goldState(res.gold));
                                        dispatch(
                                            privateEventState(
                                                res.privateEventId
                                            )
                                        );
                                        dispatch(
                                            specialEventState(
                                                res.specialEventId
                                            )
                                        );
                                        dispatch(
                                            profileThemeState(res.themeId)
                                        );
                                        //재고가 존재할 때만 업데이트
                                        if (res.productList) {
                                            dispatch(
                                                myProductState(res.productList)
                                            );
                                        }
                                        dispatch(
                                            productInfoState(
                                                res.productInfoList
                                            )
                                        );
                                        dispatch(
                                            buyableProductIdState(
                                                res.buyableProductList
                                            )
                                        );
                                        dispatch(
                                            purchasedQuantityState(
                                                res.purchasedQuantity
                                            )
                                        );
                                        dispatch(
                                            warehouseLevelState(
                                                res.warehouseLevel
                                            )
                                        );
                                        dispatch(
                                            vehicleLevelState(res.vehicleLevel)
                                        );
                                        dispatch(
                                            brokerLevelState(res.brokerLevel)
                                        );
                                        //추가할 것)시간 관련 로직
                                        props.setIngameTurn(res.turn);
                                    } else {
                                        console.log(`ERROR ON ${msg.type}`);
                                    }
                                    break;
                                case 'ALERT_PLAYTIME':
                                    //장시간 접속 경고 알림
                                    //관련 로직 추가 필요
                                    break;
                                case 'GET_NEWSPAPER':
                                    //신문 발행
                                    if (msg.isSuccess) {
                                        const newspaper = msg.body;
                                        //뉴스 수신시 로직 수정
                                        if (newspaper) {
                                            props.newsReceived(
                                                newspaper.publishTurn,
                                                newspaper.articleList
                                            );
                                        }
                                    } else {
                                        console.log(`ERROR ON ${msg.type}`);
                                    }
                                    break;
                                case 'QUARTER_REPORT':
                                case 'HALF_REPORT':
                                case 'FINAL_REPORT':
                                case 'GET_OFFLINE_REPORT':
                                    //결산 리포트 왔을 때.
                                    if (msg.isSuccess) {
                                        props.reportReceived(
                                            msg.type,
                                            msg.body
                                        );
                                    }
                                    break;
                            }
                        });
                    };
                    client.activate();

                    props.setWebSocketId(id);
                    props.setWebSocketClient(client);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    //subscribe후 초기 정보 받아오기
    useEffect(() => {
        if (
            props.client &&
            props.client.connected &&
            props.webSocketId !== ''
        ) {
            //게임 초기정보 받아오기
            props.client.publish({
                destination: `/app/private/${props.webSocketId}`,
                body: JSON.stringify({
                    type: 'GET_TOTAL_INFO',
                    body: {},
                }),
            });
        }
    }, [props.client, props.client.connected, props.webSocketId]);
    return <div className="hidden"></div>;
}
