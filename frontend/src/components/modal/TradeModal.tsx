import { useEffect, useState } from 'react';
import TradeBuyReceipt from '../section/TradeBuyReceipt';
import TradeBuyCard from '../section/TradeBuyCard';
import TradeSellCard from '../section/TradeSellCard';
import TradeSellReceipt from '../section/TradeSellReceipt';

//import dummy datas
import gameInfo from '../../dummy-data/game-info.json';
import publicEvent from '../../dummy-data/public-event.json';
import warehouseInfo from '../../dummy-data/warehouse-info.json';

type tradeType = {
    setTradeFlag: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TradeModal(props: tradeType) {
    const [tradeTab, setTradeTab] = useState<Number>(0);

    //구매, 판매 물품 리스트
    const [sellingProductList, setSellingProductList] = useState<SellInfo[]>(
        []
    );
    const [buyableProduct, setBuyableProduct] = useState<BuyInfo[]>([]);
    const [totalNumber, setTotalNumber] = useState<number>(0);

    //구매 가능 검증용 변수, 창고에 있는 재고 불러와 계산하는 로직 추가 요함
    const maximumBuyableAmount = Math.min(
        gameInfo.warehouse[warehouseInfo.warehouseLevel].size,
        gameInfo.vehicle[warehouseInfo.vehicleLevel].size
    );

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

            for (let i = 0; i < warehouseInfo.productList.length; i++) {
                const product = warehouseInfo.productList[i];
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
        const myList: SellInfo[] = [];
        warehouseInfo.productList.map((product) => {
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
        });
        setSellingProductList(myList);
    }, []);

    const changeTab = (prop: Number) => {
        setTradeTab(prop);
        console.log(tradeTab);
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
        let total = 0;
        buyableProduct.map((product) => {
            const newProductInfo = { ...product };
            const buyingInfo = newProductInfo.buyingInfo;
            if (buyingInfo.productId === id) {
                buyingInfo.productQuantity = changedValue;
                buyingInfo.productTotalCost = changedCost;
            }
            total += buyingInfo.productQuantity;
            newList.push(newProductInfo);
        });

        //용량 초과시 반영 안함
        if (total > maximumBuyableAmount) {
            console.log('용량 초과!'); //모달로 대체
            return;
        }

        setTotalNumber(total);
        setBuyableProduct(newList);
    };

    const updateSellingList = (
        id: number,
        changedValue: number,
        changedCost: number
    ) => {
        const newList: SellInfo[] = [];
        let total = 0;
        sellingProductList.map((product) => {
            const newProductInfo = { ...product };
            const sellingInfo = newProductInfo.sellingInfo;
            if (sellingInfo.productId === id) {
                sellingInfo.productQuantity = changedValue;
                sellingInfo.productTotalCost = changedCost;
            }
            total += sellingInfo.productQuantity;
            newList.push(newProductInfo);
        });

        setTotalNumber(total);
        setSellingProductList(newList);
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
                        <div className="flex h-[80%] m-4 flex-wrap">
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
                        <div className="flex h-[80%] m-4 flex-wrap">
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
                        <TradeSellReceipt />
                    </div>
                </>
            );
        }
    };
    return (
        <section className="relative w-[80%] h-[80%] flex justify-center items-center border-8 color-border-sublight color-bg-main rounded-xl z-50">
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
