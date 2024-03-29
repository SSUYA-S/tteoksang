import { useEffect, useRef, useState } from 'react';
import TradeBuyReceipt from '../section/TradeBuyReceipt';
import TradeBuyCard from '../section/TradeBuyCard';
import TradeSellCard from '../section/TradeSellCard';
import TradeSellReceipt from '../section/TradeSellReceipt';
import { InfraList, Product } from '../../type/types';

import { myProductState } from '../../util/myproduct-slice';
import { useSelector } from 'react-redux';
import { BuyInfo, SellInfo, ProductBucket } from '../../type/types';
import { productInfoAndEventState } from '../../util/product-and-event';
import { Client } from '@stomp/stompjs';

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
    const productInfoAndEvent: productInfoAndEventState = useSelector(
        (state: any) => state.reduxFlag.productAndEventSlice
    );

    const myProductList = myProductInfo.myProductList;

    //최대 구매 가능 값 갱신
    const maximumBuyableAmount = useRef<number>(0);
    useEffect(() => {
        maximumBuyableAmount.current = Math.min(
            props.infraInfo.warehouseInfoList[myProductInfo.warehouseLevel - 1]
                .warehouseCapacity,
            props.infraInfo.vehicleInfoList[myProductInfo.vehicleLevel - 1]
                .vehicleCapacity
        );
        maximumBuyableAmount.current -= myProductInfo.purchasedQuantity;
    }, [
        myProductInfo.purchasedQuantity,
        myProductInfo.warehouseLevel,
        myProductInfo.vehicleLevel,
        props.infraInfo.warehouseInfoList,
        props.infraInfo.vehicleInfoList,
    ]);
    //구매 가능 검증용 변수, 창고에 있는 재고 불러와 계산하는 로직 추가

    //현재 창고 내 재고
    const [nowStock, setNowStock] = useState<number>(0);

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

    /** updateBuyingList(id, changeValue)
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
        if (
            totalBuyNum > maximumBuyableAmount.current ||
            totalBuyCost > props.nowMoney
        ) {
            console.log('구매 가능 초과');
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
            console.log('창고 용량 초과!'); //모달로 대체
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
        let maxAddValue = maximumBuyableAmount.current - totalNumber - nowValue;
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

    const buyProduct = () => {
        //webSocket으로 대체 예정
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

    /**렌더링 모달
     *
     * @returns
     */
    const tradeElement = () => {
        if (tradeTab === 0) {
            return (
                <>
                    <div className="w-[55%] h-full">
                        <div className="h-[18%] flex justify-between items-end pb-[0.2vh]">
                            <p className="text-[3vw] color-text-textcolor">
                                물품 구매
                            </p>
                            <div className="w-[40%] flex justify-between text-[1.6vw] color-text-textcolor me-[1vw]">
                                <p>예상 창고 용량</p>
                                <p>
                                    {totalNumber}/
                                    {
                                        props.infraInfo.warehouseInfoList[
                                            myProductInfo.warehouseLevel - 1
                                        ].warehouseCapacity
                                    }
                                </p>
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
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <div className="w-[28%] h-full p-[0.4vw] flex items-center">
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
                            <div className="w-[40%] flex justify-between text-[1.6vw] color-text-textcolor me-[1vw]">
                                <p>예상 창고 용량</p>
                                <p>
                                    {totalNumber}/
                                    {
                                        props.infraInfo.warehouseInfoList[
                                            myProductInfo.warehouseLevel - 1
                                        ].warehouseCapacity
                                    }
                                </p>
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
                                        />
                                    </>
                                );
                            })}
                        </div>
                    </div>
                    <div className="w-[28%] h-full p-[0.4vw] flex items-center">
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
                    <div className="w-[88%] h-full">
                        <div className="h-[18%] flex justify-between items-end pb-[0.2vh]">
                            <p className="text-[3vw] color-text-textcolor">
                                오늘의 시세
                            </p>
                        </div>
                        <div className="flex flex-col w-[94%] h-[70%] m-[0.2vw] flex-wrap overflow-auto bg-white rounded-[1vw] border-[0.3vw] color-border-subbold p-[0.4vw]">
                            <table className="relative w-[100%] h-[100%] text-[1.4vw] table-auto">
                                <tr className="relative border-b-[0.2vw] color-border-subbold">
                                    <th>작물</th>
                                    <th>품목</th>
                                    <th>개당가격</th>
                                    <th>보유개수</th>
                                    <th>등락폭</th>
                                </tr>
                                {productInfoAndEvent.productInfoList.map(
                                    (product) => {
                                        if (product.productId !== 0) {
                                            return (
                                                <tr
                                                    className="relative border-y-[0.2vw] border-black"
                                                    key={product.productId}
                                                >
                                                    <div
                                                        className={
                                                            'w-fit h-[60%] bg-no-repeat mx-auto sprite-img-crop ' +
                                                            `crop-img-${product.productId}`
                                                        }
                                                        style={{
                                                            aspectRatio: 1 / 1,
                                                        }}
                                                    ></div>
                                                    <td className="py-[1vw]">
                                                        {
                                                            props
                                                                .productResource[
                                                                product
                                                                    .productId
                                                            ].productName
                                                        }
                                                    </td>
                                                    <td>
                                                        {product.productCost}
                                                    </td>
                                                    <td>
                                                        {getNumber(
                                                            product.productId
                                                        )}
                                                    </td>
                                                    <td>
                                                        {product.productFluctuation >
                                                        0 ? (
                                                            <p className="color-text-blue3">
                                                                {'+' +
                                                                    product.productFluctuation +
                                                                    'G'}
                                                            </p>
                                                        ) : product.productFluctuation ===
                                                          0 ? (
                                                            <p className="color-text-green1">
                                                                {product.productFluctuation +
                                                                    'G'}
                                                            </p>
                                                        ) : (
                                                            <p className="color-text-red1">
                                                                {product.productFluctuation +
                                                                    'G'}
                                                            </p>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    }
                                )}
                            </table>
                        </div>
                    </div>
                </>
            );
        }
    };
    return (
        <section
            className="relative w-[80%] h-[86%] flex justify-center items-center color-border-sublight z-50 animation-modal mt-[1vh]"
            style={{
                background: 'url(/src/assets/images/layout/ui-board.webp)',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        >
            <div className="w-[12%] h-full ms-[2vw]">
                <div className="h-[15%]" />
                <div className="flex flex-col items-center ">
                    <div
                        className="w-[70%] text-[1.4vw] my-[0.4vw] py-[0.8vw] bg-white color-text-textcolor border-[0.2vw] color-border-sublight rounded-[0.6vw] cursor-pointer"
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
                        className="w-[70%] text-[1.4vw] my-[0.4vw] py-[0.8vw] bg-white color-text-textcolor border-[0.2vw] color-border-sublight rounded-[0.6vw] cursor-pointer"
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
                        className="w-[70%] text-[1.4vw] my-[0.4vw] py-[0.8vw] bg-white color-text-textcolor border-[0.2vw] color-border-sublight rounded-[0.6vw] cursor-pointer"
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
                className="absolute text-[2vw] flex items-center justify-center text-white -top-[1.6vw] -right-[2vw] w-[4vw] h-[4vw] border-[0.4vw] color-border-sublight color-bg-orange1 rounded-full cursor-pointer"
                onClick={closeTradeModal}
            >
                X
            </div>
        </section>
    );
}
