import { useEffect, useRef, useState } from 'react';
import TradeBuyReceipt from '../section/TradeBuyReceipt';
import TradeBuyCard from '../section/TradeBuyCard';
import TradeSellCard from '../section/TradeSellCard';
import TradeSellReceipt from '../section/TradeSellReceipt';
import { InfraList, Product, ProductInfo } from '../../type/types';

import { myProductState } from '../../util/myproduct-slice';
import { useDispatch, useSelector } from 'react-redux';
import { BuyInfo, SellInfo, ProductBucket } from '../../type/types';
import { productInfoAndEventState } from '../../util/product-and-event';
import { Client } from '@stomp/stompjs';

import { buyAndShow } from '../../util/product-and-event';

type tradeType = {
    setTradeFlag: React.Dispatch<React.SetStateAction<boolean>>;
    updateNowMoney: (a: number) => void;
    nowMoney: number;
    infraInfo: InfraList;
    productResource: Product[];
    client: Client;
    turn: number;
    webSocketId: string;
};

export default function TradeModal(props: tradeType) {
    const [tradeTab, setTradeTab] = useState<number>(0);

    //첫 시작 때는 작동 안하도록
    const [loaded, setLoaded] = useState<boolean>(false);

    //구매, 판매 물품 리스트
    const [sellingProductList, setSellingProductList] = useState<SellInfo[]>(
        []
    );
    const [buyableProduct, setBuyableProduct] = useState<BuyInfo[]>([]);

    //현재 장바구니 기준 재고, 돈
    const [totalNumber, setTotalNumber] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<number>(0);

    //useSelector
    const myProductInfo: myProductState = useSelector(
        (state: any) => state.reduxFlag.myProductSlice
    );
    // console.log(myProductInfo.myProductList);

    const productInfoAndEvent: productInfoAndEventState = useSelector(
        (state: any) => state.reduxFlag.productAndEventSlice
    );

    //물건 리스트
    const [productSortedList, setProductSortedList] = useState<ProductInfo[]>(
        []
    );
    //정렬 모드 (0:리셋(id순). 1, 2 : 개당 가격의 오름, 내림차순. 3, 4 : 보유 개수 기준 오름차순, 내림차순. 5,6 : 등락폭 오름차순 내림차순)
    const [sortMode, setSortMode] = useState<number>(0);
    const [isFilter, setIsFilter] = useState<boolean>(false);
    //물건 정렬 상태 초기화
    useEffect(() => {
        const newList: ProductInfo[] = [];
        //깊은 복사
        for (let i = 0; i < productInfoAndEvent.productInfoList.length; i++) {
            if (isFilter) {
                if (
                    getNumber(
                        productInfoAndEvent.productInfoList[i].productId
                    ) > 0
                ) {
                    //필터 있고 보유 중
                    newList[i] = productInfoAndEvent.productInfoList[i];
                }
            } else {
                //필터 없음
                newList[i] = productInfoAndEvent.productInfoList[i];
            }
        }

        switch (sortMode) {
            case 0:
                newList.sort((a, b) => a.productId - b.productId);
                break;
            case 1:
                newList.sort((a, b) => a.productCost - b.productCost);
                break;
            case 2:
                newList.sort((a, b) => b.productCost - a.productCost);
                break;
            case 3:
                newList.sort(
                    (a, b) => getNumber(a.productId) - getNumber(b.productId)
                );
                break;
            case 4:
                newList.sort(
                    (a, b) => getNumber(b.productId) - getNumber(a.productId)
                );
                break;
            case 5:
                newList.sort(
                    (a, b) => a.productFluctuation - b.productFluctuation
                );
                break;
            case 6:
                newList.sort(
                    (a, b) => b.productFluctuation - a.productFluctuation
                );
                break;
        }
        setProductSortedList(newList);
    }, [sortMode, productInfoAndEvent.productInfoList, isFilter]);

    const AlertRef = useRef<HTMLDivElement>(null);
    const [alertMessage, setAlertMessage] = useState<string>('');

    const myProductList = myProductInfo.myProductList;

    //최대 구매 가능 값 갱신
    const maximumBuyableAmount = useRef<number>(0);

    //현재 창고 내 재고
    const [nowStock, setNowStock] = useState<number>(0);

    useEffect(() => {
        maximumBuyableAmount.current = Math.min(
            props.infraInfo.warehouseInfoList[myProductInfo.warehouseLevel - 1]
                .warehouseCapacity - nowStock,
            props.infraInfo.vehicleInfoList[myProductInfo.vehicleLevel - 1]
                .vehicleCapacity - myProductInfo.purchasedQuantity
        );

        console.log(
            props.infraInfo.warehouseInfoList[myProductInfo.warehouseLevel - 1]
                .warehouseCapacity - nowStock
        );
        console.log(
            props.infraInfo.vehicleInfoList[myProductInfo.vehicleLevel - 1]
                .vehicleCapacity
        );
        console.log(myProductInfo.purchasedQuantity);
    }, [
        myProductInfo.purchasedQuantity,
        myProductInfo.warehouseLevel,
        myProductInfo.vehicleLevel,
        nowStock,
    ]);
    //구매 가능 검증용 변수, 창고에 있는 재고 불러와 계산하는 로직 추가

    //내 구매 수량 변동 시 nowStock 갱신
    useEffect(() => {
        let newStock = 0;
        myProductInfo.myProductList.map((product) => {
            newStock += product.productQuantity;
        });
        setNowStock(newStock);
    }, [myProductInfo.myProductList]);

    //턴 바뀌면 경고 띄워주기
    useEffect(() => {
        if (!loaded) {
            setLoaded(true);
        } else {
            turnchangeAlert();
        }
    }, [props.turn]);

    useEffect(() => {
        // ESC 키를 눌렀을 때 실행할 함수
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                props.setTradeFlag(false); // ESC 키가 눌리면 컴포넌트를 안 보이게 설정
            }
        };
        // 컴포넌트가 마운트될 때 keydown 이벤트 리스너 추가
        document.addEventListener('keydown', handleKeyDown);

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            setLoaded(false);
        };
    }, []);
    /**초기 로딩 */
    useEffect(() => {
        //구매 품목 관련 로드
        const buyable: BuyInfo[] = [];
        if (productInfoAndEvent.buyableProductIdList) {
            productInfoAndEvent.buyableProductIdList.map((id: number) => {
                //내 보유 품목 조회
                //평균 구매가 계산 위해
                const myProduct: ProductBucket = {
                    productId: id,
                    productQuantity: 0,
                    productTotalCost: 0,
                };
                //내가 가진 정보로부터 평균가 계산
                for (let i = 0; i < myProductList.length; i++) {
                    const product = myProductList[i];
                    if (product.productId === id) {
                        myProduct.productQuantity = product.productQuantity;
                        myProduct.productTotalCost = product.productTotalCost;
                        break;
                    }
                }

                //살 정보 관련
                const buyingInfo: ProductBucket = {
                    productId: id,
                    productQuantity: 0,
                    productTotalCost: 0,
                };

                //집어넣기
                const product: BuyInfo = {
                    productName: props.productResource[id].productName,
                    productInfo: productInfoAndEvent.productInfoList[id],
                    myProduct: myProduct,
                    buyingInfo: buyingInfo,
                };
                buyable.push(product);
            });
        }
        setBuyableProduct(buyable);

        //판매 품목 관련 로드
        let stock = 0; //현재 창고 내 재고 조사

        //판매 가능한 것 === 내가 보유한 것
        //고로, 해당 정보 바탕으로 로드
        const myList: SellInfo[] = [];
        //없으면 생략
        if (myProductList.length !== 0) {
            myProductList.map((product: ProductBucket) => {
                const id = product.productId;
                const productName = props.productResource[id].productName;
                const productInfo = productInfoAndEvent.productInfoList[id];
                const sellingInfo: ProductBucket = {
                    productId: id,
                    productQuantity: 0,
                    productTotalCost: 0,
                };

                const result: SellInfo = {
                    productName: productName,
                    productInfo: productInfo,
                    myProduct: product,
                    sellingInfo: sellingInfo,
                };
                myList.push(result);

                stock += product.productQuantity;
            });
        }
        //판매 정보 갱신
        setSellingProductList(myList);

        //내 현재 재고 갱신
        setTotalNumber(stock);
        setNowStock(stock);
    }, [
        myProductInfo,
        productInfoAndEvent,
        props.productResource,
        myProductList,
        tradeTab,
    ]);

    const changeTab = (prop: number) => {
        setTradeTab(prop);
        // console.log(tradeTab);
    };
    const closeTradeModal = () => {
        props.setTradeFlag(false);
    };

    /** updateBuyingList(id, changeValue, changedCost)
     *  물건의 id와 changeValue를 입력하면 buyingProductList를 업데이트한다.
     * @param id
     * @param changeValue
     */
    const updateBuyingList = (
        id: number,
        changedValue: number,
        changedCost: number
    ) => {
        const newList: BuyInfo[] = [];
        let totalBuyNum = 0;
        let totalBuyCost = 0;
        buyableProduct.map((product) => {
            const myProduct = {
                productId: product.myProduct.productId,
                productQuantity: product.myProduct.productQuantity,
                productTotalCost: product.myProduct.productTotalCost,
            };
            const buyingInfo = {
                productId: product.buyingInfo.productId,
                productQuantity: product.buyingInfo.productQuantity,
                productTotalCost: product.buyingInfo.productTotalCost,
            };
            const prodId = product.productInfo.productId;
            //깊은 복사
            const newProductInfo: BuyInfo = {
                productName: props.productResource[prodId].productName,
                productInfo: productInfoAndEvent.productInfoList[prodId],
                myProduct: myProduct,
                buyingInfo: buyingInfo,
            };
            if (buyingInfo.productId === id) {
                buyingInfo.productQuantity = changedValue;
                buyingInfo.productTotalCost = changedCost;
            }
            totalBuyNum += buyingInfo.productQuantity;
            totalBuyCost += buyingInfo.productTotalCost;
            newList.push(newProductInfo);
        });
        //구매 가능 수량 초과
        // console.log(maximumBuyableAmount.current);
        console.log(newList);
        if (
            totalBuyNum > maximumBuyableAmount.current ||
            totalBuyCost > props.nowMoney
        ) {
            // console.log('구매 가능 초과');
            return;
        }
        // 현재 창고 내 재고 반영
        totalBuyNum = nowStock + totalBuyNum;
        //용량 초과시 반영 안함
        if (
            totalBuyNum >
            props.infraInfo.warehouseInfoList[myProductInfo.warehouseLevel - 1]
                .warehouseCapacity
        ) {
            // console.log('창고 용량 초과!'); //모달로 대체
            return;
        } else {
            setTotalNumber(totalBuyNum);
            setTotalCost(totalBuyCost);
            setBuyableProduct(newList);
        }
    };

    /**최대값 계산 */
    const calculateMaximumValue = (id: number, nowValue: number) => {
        const productInfo = productInfoAndEvent.productInfoList[id];

        //일단 남은 최대 구매 가능량 기준으로 계산
        let maxAddValue =
            maximumBuyableAmount.current - (totalNumber - nowStock);
        //품목당 구매 가능 최대량을 초과하는가?
        if (maxAddValue + nowValue > productInfo.productMaxQuantity) {
            maxAddValue = productInfo.productMaxQuantity - nowValue;
        }

        //품목당 구매 가능 최대량을 초과하는가?
        if (maxAddValue * productInfo.productCost > props.nowMoney) {
            maxAddValue =
                (props.nowMoney - totalCost) / productInfo.productCost;
        }

        return maxAddValue;
    };

    /** udpateSellingList(id, changedValue, changedCost)
     *  물건 판매 모달
     * @param id
     * @param changedValue
     * @param changedCost
     */
    const updateSellingList = (
        id: number,
        changedValue: number,
        changedCost: number
    ) => {
        const newList: SellInfo[] = [];
        let totalSellNum = 0;
        sellingProductList.map((product) => {
            const myProduct = {
                productId: product.myProduct.productId,
                productQuantity: product.myProduct.productQuantity,
                productTotalCost: product.myProduct.productTotalCost,
            };
            const sellingInfo = {
                productId: product.sellingInfo.productId,
                productQuantity: product.sellingInfo.productQuantity,
                productTotalCost: product.sellingInfo.productTotalCost,
            };
            const prodId = product.productInfo.productId;
            //깊은 복사
            const newProductInfo: SellInfo = {
                productName: props.productResource[prodId].productName,
                productInfo: productInfoAndEvent.productInfoList[prodId],
                myProduct: myProduct,
                sellingInfo: sellingInfo,
            };
            if (sellingInfo.productId === id) {
                sellingInfo.productQuantity = changedValue;
                sellingInfo.productTotalCost = changedCost;
            }
            totalSellNum += sellingInfo.productQuantity;
            newList.push(newProductInfo);
        });
        const total = nowStock - totalSellNum;
        setTotalNumber(total);
        setSellingProductList(newList);
    };

    const sellProduct = () => {
        //판매 금액 표시

        //웹 소켓 통신
        const newSellList: any = {};
        sellingProductList.map((product) => {
            if (product.sellingInfo.productQuantity !== 0) {
                const key = product.sellingInfo.productId;
                newSellList[`${key}`] = {
                    productQuantity: product.sellingInfo.productQuantity,
                    productTotalCost: product.sellingInfo.productTotalCost,
                };
            }
        });

        const sellMsg = JSON.stringify({
            type: 'SELL_PRODUCT',
            body: {
                products: newSellList,
                currentTurn: props.turn,
            },
        });
        //메시지 전송
        if (props.client.connected) {
            props.client.publish({
                destination: `/app/private/${props.webSocketId}`,
                body: sellMsg,
            });
        }
    };

    const dispatch = useDispatch();

    const buyProduct = () => {
        //webSocket으로 대체 예정
        dispatch(buyAndShow(buyableProduct));
        //아래가 그 코드
        const newBuyList: any = {};
        buyableProduct.map((product) => {
            if (product.buyingInfo.productQuantity !== 0) {
                const key = product.buyingInfo.productId;
                newBuyList[`${key}`] = {
                    productQuantity: product.buyingInfo.productQuantity,
                    productTotalCost: product.buyingInfo.productTotalCost,
                };
            }
        });

        const buyMsg = JSON.stringify({
            type: 'BUY_PRODUCT',
            body: {
                products: newBuyList,
                currentTurn: props.turn,
            },
        });

        //전송
        if (props.client.connected) {
            props.client.publish({
                destination: `/app/private/${props.webSocketId}`,
                body: buyMsg,
            });
        }
    };

    /** getNumber(id)
     * 시세 조회 시 보유량 찾기
     * @param id
     * @returns
     */
    const getNumber = (id: number) => {
        let number = 0;
        for (let i = 0; i < myProductList.length; i++) {
            if (myProductList[i].productId === id) {
                number = myProductList[i].productQuantity;
                break;
            }
        }
        return number;
    };

    /**최대, 최소 경고 띄워주기 */
    const maximumAlert = () => {
        setAlertMessage('최대 수량입니다.');
        alertActivate();
    };

    const minimumAlert = () => {
        setAlertMessage('최소 수량입니다.');
        alertActivate();
    };

    const turnchangeAlert = () => {
        setAlertMessage('턴이 바뀌었습니다.');
        alertActivate();
    };

    const alertActivate = () => {
        if (AlertRef.current) {
            //애니메이션 적용
            AlertRef.current.style.animation = 'alert 1s 0s 1 linear';
            //끝나면 초기화
            AlertRef.current.onanimationend = () => {
                if (AlertRef.current) {
                    AlertRef.current.style.animation = '';
                }
            };
        }
    };

    /**렌더링 모달
     *
     * @returns
     */
    const tradeElement = () => {
        if (tradeTab === 0) {
            return (
                <>
                    <div className="w-[55%] h-full relative">
                        <div
                            className="absolute w-[40%] h-[5vh] left-[40%] top-[3vh] bg-black -z-10 rounded text-white opacity-0 flex justify-center items-center"
                            ref={AlertRef}
                        >
                            <p className="text-[1.5vw]">{alertMessage}</p>
                        </div>
                        <div className="h-[18%] flex justify-between items-end pb-[0.2vh]">
                            <p className="text-[3vw] color-text-textcolor">
                                물품 구매
                            </p>
                            <div className="w-[55%]">
                                <div className="w-full flex justify-between text-[1.4vw] color-text-textcolor me-[1vw]">
                                    <p>현재 소지 금액</p>
                                    <p>{props.nowMoney.toLocaleString()}</p>
                                </div>
                                <div className="w-full flex justify-between ">
                                    <div className="flex justify-between text-[1.1vw] color-text-textcolor">
                                        <p className="me-[0.4vw]">
                                            예상 창고 용량
                                        </p>
                                        <p>
                                            {totalNumber}/
                                            {
                                                props.infraInfo
                                                    .warehouseInfoList[
                                                    myProductInfo.warehouseLevel -
                                                        1
                                                ].warehouseCapacity
                                            }
                                        </p>
                                    </div>
                                    <div className="flex justify-between text-[1.1vw] color-text-textcolor">
                                        <p className="me-[0.4vw]">
                                            일일 구매 한도
                                        </p>
                                        <p>
                                            {myProductInfo.purchasedQuantity +
                                                (totalNumber - nowStock)}
                                            /
                                            {
                                                props.infraInfo.vehicleInfoList[
                                                    myProductInfo.vehicleLevel -
                                                        1
                                                ].vehicleCapacity
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex h-[75%] m-[0.4vw] flex-wrap overflow-y-auto">
                            {buyableProduct.map((product) => {
                                return (
                                    <TradeBuyCard
                                        key={product.productInfo.productId}
                                        buyableInfo={product}
                                        updateBuyingList={updateBuyingList}
                                        calculateMaximumValue={
                                            calculateMaximumValue
                                        }
                                        maximumAlert={maximumAlert}
                                        minimumAlert={minimumAlert}
                                        productUnit={
                                            props.productResource[
                                                product.productInfo.productId
                                            ].productUnit
                                        }
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <div className="w-[28%] h-full p-[0.4vw] flex items-center me-[2vw]">
                        <TradeBuyReceipt
                            buyableInfoList={buyableProduct}
                            maximumBuyable={maximumBuyableAmount.current}
                            buyProduct={buyProduct}
                        />
                    </div>
                </>
            );
        } else if (tradeTab === 1) {
            return (
                <>
                    <div className="w-[55%] h-full">
                        <div className="h-[18%] flex justify-between items-end pb-[0.2vh]">
                            <p className="text-[3vw] color-text-textcolor">
                                물품 판매
                            </p>
                            <div className="w-[55%]">
                                <div className="w-full flex justify-between text-[1.4vw] color-text-textcolor me-[1vw]">
                                    <p>현재 소지 금액</p>
                                    <p>{props.nowMoney.toLocaleString()}</p>
                                </div>

                                <div className="w-full flex justify-between ">
                                    <div className="flex justify-between text-[1.1vw] color-text-textcolor">
                                        <p className="me-[0.4vw]">
                                            예상 창고 용량
                                        </p>
                                        <p>
                                            {totalNumber}/
                                            {
                                                props.infraInfo
                                                    .warehouseInfoList[
                                                    myProductInfo.warehouseLevel -
                                                        1
                                                ].warehouseCapacity
                                            }
                                        </p>
                                    </div>
                                    <div className="flex justify-between text-[1.1vw] color-text-textcolor">
                                        <p className="me-[0.4vw]">
                                            일일 구매 한도
                                        </p>
                                        <p>
                                            {myProductInfo.purchasedQuantity}/
                                            {
                                                props.infraInfo.vehicleInfoList[
                                                    myProductInfo.vehicleLevel -
                                                        1
                                                ].vehicleCapacity
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex h-[75%] m-[0.4vw] flex-wrap overflow-y-auto">
                            {sellingProductList.map((product) => {
                                return (
                                    <>
                                        <TradeSellCard
                                            key={product.productInfo.productId}
                                            sellInfo={product}
                                            updateSellingList={
                                                updateSellingList
                                            }
                                            maximumAlert={maximumAlert}
                                            minimumAlert={minimumAlert}
                                            productUnit={
                                                props.productResource[
                                                    product.productInfo
                                                        .productId
                                                ].productUnit
                                            }
                                        />
                                    </>
                                );
                            })}
                        </div>
                    </div>
                    <div className="w-[28%] h-full p-[0.4vw] flex items-center me-[2vw]">
                        <TradeSellReceipt
                            sellableInfoList={sellingProductList}
                            fee={
                                props.infraInfo.brokerInfoList[
                                    myProductInfo.brokerLevel - 1
                                ].brokerFeeRate
                            }
                            sellProduct={sellProduct}
                        />
                    </div>
                </>
            );
        } else if (tradeTab === 2) {
            return (
                <>
                    <div className="w-[83%] h-full me-[2vw]">
                        <div className="w-[94%] h-[18%] flex justify-between items-end pb-[0.2vh]">
                            <p className="text-[3vw] color-text-textcolor">
                                오늘의 시세
                            </p>
                            <div className="w-[40%] justify-between flex pb-[0.2vh]">
                                <p
                                    className="text-[1.3vw] bg-white w-[40%] border-[0.2vw] rounded-[0.4vw] color-border-subbold color-text-textcolor cursor-pointer btn-animation hover:color-bg-subbold hover:color-text-main flex justify-center items-center"
                                    onClick={() => setIsFilter((prev) => !prev)}
                                >
                                    {isFilter ? '전체 보기' : '내 것만 보기'}
                                </p>
                                <p
                                    className="text-[1.3vw] bg-white w-[40%] border-[0.2vw] rounded-[0.4vw] color-border-subbold color-text-textcolor cursor-pointer btn-animation hover:color-bg-subbold hover:color-text-main flex justify-center items-center"
                                    onClick={() => {
                                        setIsFilter(false);
                                        setSortMode(0);
                                    }}
                                >
                                    초기화
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col w-[94%] h-[70%] m-[0.2vw] flex-wrap overflow-auto bg-white rounded-[1vw] border-[0.3vw] color-border-subbold p-[0.4vw]">
                            <table className="relative w-[100%] h-[100%] text-[1.4vw] table-fixed">
                                <thead>
                                    <tr className="relative border-b-[0.2vw] color-border-subbold">
                                        <th className="w-[25%]">작물</th>
                                        <th
                                            className="w-[25%] cursor-pointer btn-animation"
                                            onClick={() => {
                                                if (sortMode == 1) {
                                                    setSortMode(2);
                                                } else {
                                                    setSortMode(1);
                                                }
                                            }}
                                        >
                                            {`개당 가격(G)${
                                                sortMode === 1
                                                    ? ' ▲'
                                                    : sortMode === 2
                                                    ? ' ▼'
                                                    : ' -'
                                            }`}
                                        </th>
                                        <th
                                            className="w-[25%] cursor-pointer btn-animation"
                                            onClick={() => {
                                                if (sortMode == 3) {
                                                    setSortMode(4);
                                                } else {
                                                    setSortMode(3);
                                                }
                                            }}
                                        >{`보유개수${
                                            sortMode === 3
                                                ? ' ▲'
                                                : sortMode === 4
                                                ? ' ▼'
                                                : ' -'
                                        }`}</th>
                                        <th
                                            className="w-[25%] cursor-pointer btn-animation"
                                            onClick={() => {
                                                if (sortMode == 5) {
                                                    setSortMode(6);
                                                } else {
                                                    setSortMode(5);
                                                }
                                            }}
                                        >{`등락폭(G)${
                                            sortMode === 5
                                                ? ' ▲'
                                                : sortMode === 6
                                                ? ' ▼'
                                                : ' -'
                                        }`}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productSortedList.map((product) => {
                                        if (product.productId !== 0) {
                                            return (
                                                <tr
                                                    className="relative border-y-[0.2vw] border-black"
                                                    key={product.productId}
                                                >
                                                    <td className="py-[1vw] flex flex-grow-0 justify-center items-center text-[1.5vw] w-full h-full">
                                                        <div className="w-full h-full flex justify-center items-center">
                                                            <div
                                                                className={
                                                                    'w-[4vw] h-[4vw] aspect-square bg-no-repeat mx-[1vw] ' +
                                                                    `crop-img-${product.productId}`
                                                                }
                                                            ></div>
                                                            {
                                                                props
                                                                    .productResource[
                                                                    product
                                                                        .productId
                                                                ].productName
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="text-[1.5vw] ">
                                                        {product.productCost.toLocaleString()}
                                                    </td>
                                                    <td className="text-[1.5vw] ">
                                                        {getNumber(
                                                            product.productId
                                                        )}
                                                    </td>
                                                    <td className="text-[1.5vw] ">
                                                        {product.productFluctuation >
                                                        0 ? (
                                                            <p className="color-text-blue3">
                                                                {'+' +
                                                                    product.productFluctuation.toLocaleString()}
                                                            </p>
                                                        ) : product.productFluctuation ===
                                                          0 ? (
                                                            <p className="color-text-green1">
                                                                {product.productFluctuation.toLocaleString()}
                                                            </p>
                                                        ) : (
                                                            <p className="color-text-red1">
                                                                {product.productFluctuation.toLocaleString()}
                                                            </p>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            );
        }
    };
    return (
        <section className="relative w-[86%] h-[84%] flex justify-center items-center color-border-sublight z-50 animation-modal mt-[1vh]">
            <img
                src="/src/assets/images/layout/ui-board.webp"
                className="absolute w-full h-full -z-10"
                alt=""
            />
            <div className="w-[12%] h-full ms-[2vw]">
                <div className="h-[15%]" />
                <div className="flex flex-col items-center ">
                    <div
                        className="w-[70%] text-[1.4vw] my-[0.4vw] py-[0.8vw] bg-white color-text-textcolor border-[0.2vw] color-border-sublight rounded-[0.6vw] cursor-pointer btn-animation"
                        onClick={() => {
                            changeTab(0);
                        }}
                        style={
                            tradeTab === 0
                                ? {
                                      backgroundColor: `var(--color-sublight)`,
                                      borderColor: `var(--color-sublight)`,
                                      color: '#ffffff',
                                  }
                                : {}
                        }
                    >
                        구매
                    </div>
                    <div
                        className="w-[70%] text-[1.4vw] my-[0.4vw] py-[0.8vw] bg-white color-text-textcolor border-[0.2vw] color-border-sublight rounded-[0.6vw] cursor-pointer btn-animation"
                        onClick={() => {
                            changeTab(1);
                        }}
                        style={
                            tradeTab === 1
                                ? {
                                      backgroundColor: `var(--color-sublight)`,
                                      borderColor: `var(--color-sublight)`,
                                      color: '#ffffff',
                                  }
                                : {}
                        }
                    >
                        판매
                    </div>
                    <div
                        className="w-[70%] text-[1.4vw] my-[0.4vw] py-[0.8vw] bg-white color-text-textcolor border-[0.2vw] color-border-sublight rounded-[0.6vw] cursor-pointer btn-animation"
                        onClick={() => {
                            changeTab(2);
                        }}
                        style={
                            tradeTab === 2
                                ? {
                                      backgroundColor: `var(--color-sublight)`,
                                      borderColor: `var(--color-sublight)`,
                                      color: '#ffffff',
                                  }
                                : {}
                        }
                    >
                        시세
                    </div>
                </div>
            </div>
            {tradeElement()}
            <div
                className="absolute text-[2vw] flex items-center justify-center text-white top-[1vw] right-[1vw] w-[4vw] h-[4vw] border-[0.4vw] color-border-sublight color-bg-orange1 rounded-full cursor-pointer btn-animation"
                onClick={closeTradeModal}
            >
                X
            </div>
        </section>
    );
}
