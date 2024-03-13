import gameInfo from '../../dummy-data/game-info.json';

interface BuyReceiptProps {
    buyableInfoList: BuyInfo[];
    maximumBuyable: number;
    updateNowMoney: (a: number) => void;
}

export default function TradeBuyReceipt({
    buyableInfoList,
    maximumBuyable,
    updateNowMoney,
}: BuyReceiptProps) {
    let totalNumber = 0;
    let totalCost = 0;

    return (
        <div className="w-full h-full flex flex-col items-center bg-white color-text-textcolor border-[6px] color-border-subbold">
            <p className="h-[15%] text-5xl flex items-center justify-center">
                구매 영수증
            </p>
            <div className="w-[90%] h-[60%] text-2xl">
                <div className="w-full flex justify-between">
                    <p className="w-[35%]">물품명</p>
                    <p className="w-[30%]">수량</p>
                    <p className="w-[35%]">가격</p>
                </div>
                <p>-------------------------------</p>
                {buyableInfoList.map((buyable) => {
                    const product = buyable.buyingInfo;
                    if (product.productQuantity !== 0) {
                        totalNumber += product.productQuantity;
                        totalCost += product.productTotalCost;
                        return (
                            <div
                                className="w-full flex justify-between my-1"
                                key={product.productId}
                            >
                                <p className="w-[35%]">
                                    {gameInfo.product[product.productId]}
                                </p>
                                <p className="w-[30%]">
                                    {product.productQuantity}
                                </p>
                                <p className="w-[35%]">
                                    {product.productTotalCost.toLocaleString()}
                                </p>
                            </div>
                        );
                    }
                })}
            </div>
            <div className="w-[90%] h-[25%] text-2xl">
                <p>-------------------------------</p>
                <div className="flex items-center justify-between">
                    <p>총 구매 가능</p>
                    <p>
                        {totalNumber} / {maximumBuyable}
                    </p>
                </div>
                <div className="flex items-center justify-between">
                    <p>총 결재 금액</p>
                    <p>{totalCost.toLocaleString()}</p>
                </div>
                <div
                    className="my-4 py-2 border-4 color-border-subbold cursor-pointer"
                    onClick={() => updateNowMoney(-1 * totalCost)}
                >
                    구매
                </div>
            </div>
        </div>
    );
}
