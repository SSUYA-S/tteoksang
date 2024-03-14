import { useEffect, useState } from 'react';
import TradeBuyReceipt from '../section/TradeBuyReceipt';
import TradeBuyCard from '../section/TradeBuyCard';
import TradeSellCard from '../section/TradeSellCard';
import TradeSellReceipt from '../section/TradeSellReceipt';

//import dummy datas
import gameInfo from '../../dummy-data/game-info.json';
import publicEvent from '../../dummy-data/public-event.json';
import warehouseInfo from '../../dummy-data/warehouse-info.json';
import totalInfo from '../../dummy-data/total-info.json';

import { myProductState } from '../../util/myproduct-slice';
import { useDispatch, useSelector } from 'react-redux';
import { BuyInfo, SellInfo, Product } from '../../type/types';

type tradeType = {
    setTradeFlag: React.Dispatch<React.SetStateAction<boolean>>;
    updateNowMoney: (a: number) => void;
    nowMoney: number;
};

export default function TradeModal(props: tradeType) {
    const [tradeTab, setTradeTab] = useState<number>(0);

    //구매, 판매 물품 리스트
    const [sellingProductList, setSellingProductList] = useState<SellInfo[]>(
        []
    );
    const [buyableProduct, setBuyableProduct] = useState<BuyInfo[]>([]);
    const [totalNumber, setTotalNumber] = useState<number>(0);

    //구매 가능 검증용 변수, 창고에 있는 재고 불러와 계산하는 로직 추가
    let maximumBuyableAmount = Math.min(
        gameInfo.warehouse[warehouseInfo.warehouseLevel].size,
        gameInfo.vehicle[warehouseInfo.vehicleLevel].size
    );
    maximumBuyableAmount -= totalInfo.purchasedQuantity; //나중에 고민해보자.(purchasedQuantity를 어떻게 관리할 지)

    //현재 창고 내 재고
    const [nowStock, setNowStock] = useState<number>(0);

    // myProduct
    const myProductList = useSelector(
        (state: any) => state.reduxFlag.myProductSlice.myProductList
    );

    const dispatch = useDispatch();

    /**초기 로딩 */
    useEffect(() => {
        //구매 품목 관련 로드
        const buyable: BuyInfo[] = [];
        publicEvent.buyableProductIdList.map((id: number) => {
            //내 보유 품목 조회
            const myProduct: Product = {
                productId: id,
                productQuantity: 0,
                productTotalCost: 0,
            };

            for (let i = 0; i < myProductList.length; i++) {
                const product = myProductList[i];
                if (product.productId === id) {
                    myProduct.productQuantity = product.productQuantity;
                    myProduct.productTotalCost = product.productTotalCost;
                    break;
                }
            }

            //살 정보 관련
            const buyingInfo: Product = {
                productId: id,
                productQuantity: 0,
                productTotalCost: 0,
            };

            //집어넣기
            const product: BuyInfo = {
                productName: gameInfo.product[id],
                productInfo: publicEvent.productInfoList[id],
                myProduct: myProduct,
                buyingInfo: buyingInfo,
            };
            buyable.push(product);
        });
        setBuyableProduct(buyable);

        //판매 품목 관련 로드
        let stock = 0; //현재 창고 내 재고 조사

        const myList: SellInfo[] = [];
        myProductList.map((product: Product) => {
            const id = product.productId;
            const productName = gameInfo.product[id];
            const productInfo = publicEvent.productInfoList[id];
            const sellingInfo: Product = {
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
        setSellingProductList(myList);
        setTotalNumber(stock);
        setNowStock(stock);
    }, [myProductList]);

    /** 구매, 판매 정보 초기화*/
    // useEffect(() => {
    //     if (loaded) {
    //         //새 구매 정보
    //         const newBuyList: BuyInfo[] = [];
    //         buyableProduct.map((product) => {
    //             const myProduct = {
    //                 productId: product.myProduct.productId,
    //                 productQuantity: product.myProduct.productQuantity,
    //                 productTotalCost: product.myProduct.productTotalCost,
    //             };
    //             const buyingInfo = {
    //                 productId: product.buyingInfo.productId,
    //                 productQuantity: 0,
    //                 productTotalCost: 0,
    //             };
    //             const prodId = product.productInfo.productId;

    //             //깊은 복사
    //             const newProductInfo: BuyInfo = {
    //                 productName: gameInfo.product[prodId],
    //                 productInfo: publicEvent.productInfoList[prodId],
    //                 myProduct: myProduct,
    //                 buyingInfo: buyingInfo,
    //             };
    //             newBuyList.push(newProductInfo);
    //         });
    //         setBuyableProduct(newBuyList);

    //         //새 판매 정보
    //         const newSellingList: SellInfo[] = [];
    //         sellingProductList.map((product) => {
    //             const myProduct = {
    //                 productId: product.myProduct.productId,
    //                 productQuantity: product.myProduct.productQuantity,
    //                 productTotalCost: product.myProduct.productTotalCost,
    //             };
    //             const sellingInfo = {
    //                 productId: product.sellingInfo.productId,
    //                 productQuantity: 0,
    //                 productTotalCost: 0,
    //             };
    //             const prodId = product.productInfo.productId;

    //             //깊은 복사
    //             const newProductInfo: SellInfo = {
    //                 productName: gameInfo.product[prodId],
    //                 productInfo: publicEvent.productInfoList[prodId],
    //                 myProduct: myProduct,
    //                 sellingInfo: sellingInfo,
    //             };

    //             newSellingList.push(newProductInfo);
    //         });
    //         setSellingProductList(newSellingList);

    //         setTotalNumber(nowStock);
    //     }
    // }, [tradeTab]);

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
                productName: gameInfo.product[prodId],
                productInfo: publicEvent.productInfoList[prodId],
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
        if (
            totalBuyNum > maximumBuyableAmount ||
            totalBuyCost > props.nowMoney
        ) {
            console.log('구매 가능 초과');
            return;
        }

        // 현재 창고 내 재고 반영
        totalBuyNum = nowStock + totalBuyNum;

        //용량 초과시 반영 안함
        if (
            totalBuyNum > gameInfo.warehouse[warehouseInfo.warehouseLevel].size
        ) {
            console.log('용량 초과!'); //모달로 대체
            return;
        } else {
            setTotalNumber(totalBuyNum);
            setBuyableProduct(newList);
        }
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
                productName: gameInfo.product[prodId],
                productInfo: publicEvent.productInfoList[prodId],
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

    const sellProduct = (value: number) => {
        //판매 금액 표시
        props.updateNowMoney(value);

        let total = 0;

        const newList: SellInfo[] = [];
        const myNewProductList: Product[] = [];
        sellingProductList.map((product) => {
            const avgCost =
                product.myProduct.productTotalCost /
                product.myProduct.productQuantity;

            const newQuantity =
                product.myProduct.productQuantity -
                product.sellingInfo.productQuantity;

            total += newQuantity;

            //없으면 추가 안함
            if (newQuantity !== 0) {
                const newSellInfo: SellInfo = {
                    productName: product.productName,
                    productInfo: product.productInfo,
                    myProduct: {
                        productId: product.myProduct.productId,
                        productQuantity: newQuantity,
                        productTotalCost: newQuantity * avgCost,
                    },
                    sellingInfo: {
                        productId: product.myProduct.productId,
                        productQuantity: 0,
                        productTotalCost: 0,
                    },
                };

                newList.push(newSellInfo);
                myNewProductList.push(newSellInfo.myProduct);
            }
        });
        setNowStock(total);
        setSellingProductList(newList);
        dispatch(myProductState(myNewProductList));
    };

    const buyProduct = (a: number) => {
        const myNewProductList: Product[] = [];

        //함수 복사
        myProductList.map((product: Product) => {
            myNewProductList.push({
                productId: product.productId,
                productQuantity: product.productQuantity,
                productTotalCost: product.productTotalCost,
            });
        });
        //재고 추가
        buyableProduct.map((product) => {
            //구매 상품이면
            if (product.buyingInfo.productQuantity !== 0) {
                //탐색
                let flag = true;
                for (let i = 0; i < myProductList.length; i++) {
                    if (
                        myNewProductList[i].productId ===
                        product.buyingInfo.productId
                    ) {
                        console.log(myNewProductList[i]);
                        myNewProductList[i].productQuantity +=
                            product.buyingInfo.productQuantity;
                        myNewProductList[i].productTotalCost +=
                            product.buyingInfo.productTotalCost;
                        flag = false;
                        break;
                    }
                }

                //못찾으면 추가
                if (flag) {
                    myNewProductList.push(product.buyingInfo);
                }
            }
        });
        console.log(myNewProductList);
        dispatch(myProductState(myNewProductList));
        props.updateNowMoney(a);
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
                    <div className="w-[60%] h-full">
                        <div className="h-[15%] flex justify-between items-end pb-4">
                            <p className="text-5xl color-text-textcolor">
                                물품 구매
                            </p>
                            <div className="w-[35%] flex justify-between text-3xl color-text-textcolor">
                                <p>예상 창고 용량</p>
                                <p>
                                    {totalNumber}/
                                    {
                                        gameInfo.warehouse[
                                            warehouseInfo.warehouseLevel
                                        ].size
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="flex h-[80%] m-4 flex-wrap overflow-y-auto">
                            {buyableProduct.map((product) => {
                                return (
                                    <TradeBuyCard
                                        key={product.productInfo.productId}
                                        buyableInfo={product}
                                        updateBuyingList={updateBuyingList}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <div className="w-[28%] h-full p-4">
                        <TradeBuyReceipt
                            buyableInfoList={buyableProduct}
                            maximumBuyable={maximumBuyableAmount}
                            buyProduct={buyProduct}
                        />
                    </div>
                </>
            );
        } else if (tradeTab === 1) {
            return (
                <>
                    <div className="w-[60%] h-full">
                        <div className="h-[15%] flex justify-between items-end pb-4">
                            <p className="text-5xl color-text-textcolor">
                                물품 판매
                            </p>
                            <div className="w-[35%] flex justify-between text-3xl color-text-textcolor">
                                <p>예상 창고 용량</p>
                                <p>
                                    {totalNumber}/
                                    {
                                        gameInfo.warehouse[
                                            warehouseInfo.warehouseLevel
                                        ].size
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="flex h-[80%] m-4 flex-wrap overflow-y-auto">
                            {sellingProductList.map((product) => {
                                return (
                                    <TradeSellCard
                                        key={product.productInfo.productId}
                                        sellInfo={product}
                                        updateSellingList={updateSellingList}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <div className="w-[28%] h-full p-4">
                        <TradeSellReceipt
                            sellableInfoList={sellingProductList}
                            fee={
                                gameInfo.broker[warehouseInfo.brokerLevel]
                                    .charge
                            }
                            updateNowMoney={props.updateNowMoney}
                            sellProduct={sellProduct}
                        />
                    </div>
                </>
            );
        } else if (tradeTab === 2) {
            return (
                <>
                    <div className="w-[80%] h-full">
                        <div className="h-[15%] flex justify-between items-end pb-4">
                            <p className="text-5xl color-text-textcolor">
                                오늘의 시세
                            </p>
                        </div>
                        <div className="flex h-[80%] m-4 flex-wrap bg-white rounded-xl border-4 border-black p-2">
                            <table className="w-[100%] h-[100%] text-4xl overflow-y-scroll table-auto">
                                <tr className="border-y-4 border-black">
                                    <th>품목</th>
                                    <th>개당가격</th>
                                    <th>보유개수</th>
                                    <th>등락폭</th>
                                </tr>
                                {publicEvent.productInfoList.map((product) => {
                                    if (product.productId !== 0) {
                                        return (
                                            <tr className="border-y-2 border-black">
                                                <td>
                                                    {
                                                        gameInfo.product[
                                                            product.productId
                                                        ]
                                                    }
                                                </td>
                                                <td>{product.productCost}</td>
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
                                })}
                            </table>
                        </div>
                    </div>
                </>
            );
        }
    };
    return (
        <section className="relative w-[80%] h-[80%] flex justify-center items-center border-8 color-border-sublight color-bg-main rounded-xl z-50 animation-modal mt-10">
            <div className="w-[12%] h-full">
                <div className="h-[15%]" />
                <div className="flex flex-col items-center ">
                    <div
                        className="w-[70%] text-3xl my-2 py-4 bg-white color-text-textcolor border-4 color-border-sublight rounded-xl cursor-pointer"
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
                        className="w-[70%] text-3xl my-2 py-4 bg-white color-text-textcolor border-4 color-border-sublight rounded-xl cursor-pointer"
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
                        className="w-[70%] text-3xl my-2 py-4 bg-white color-text-textcolor border-4 color-border-sublight rounded-xl cursor-pointer"
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
                className="absolute text-3xl flex items-center justify-center text-white -top-8 -right-8 w-16 h-16 border-[6px] color-border-sublight color-bg-orange1 rounded-full cursor-pointer"
                onClick={() => {
                    closeTradeModal();
                }}
            >
                X
            </div>
        </section>
    );
}
