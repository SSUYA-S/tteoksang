interface SellReceiptProps {
    sellableInfoList: SellInfo[];
    fee: number;
    updateNowMoney: (a: number) => void;
    sellProduct: (a: number) => void;
}

export default function TradeSellReceipt({
    sellableInfoList,
    fee,
    updateNowMoney,
    sellProduct,
}: SellReceiptProps) {
    let totalCost = 0;
    sellableInfoList.map((product) => {
        totalCost += product.sellingInfo.productTotalCost;
    });
    let totalFee = fee * totalCost;
    let totalProfit = totalCost - totalFee;

    return (
        <div className="w-full h-full flex flex-col items-center bg-white color-text-textcolor border-[6px] color-border-subbold">
            <p className="h-[15%] text-5xl flex items-center justify-center">
                판매 영수증
            </p>
            <div className="w-[90%] h-[53%] text-2xl">
                <div className="w-full flex justify-between">
                    <p className="w-[35%]">물품명</p>
                    <p className="w-[30%]">수량</p>
                    <p className="w-[35%]">가격</p>
                </div>
                <p>-------------------------------</p>
                {sellableInfoList.map((product) => {
                    if (product.sellingInfo.productQuantity !== 0) {
                        return (
                            <div className="w-full flex justify-between my-1">
                                <p className="w-[35%]">{product.productName}</p>
                                <p className="w-[30%]">
                                    {product.sellingInfo.productQuantity}
                                </p>
                                <p className="w-[35%]">
                                    {product.sellingInfo.productTotalCost.toLocaleString()}
                                </p>
                            </div>
                        );
                    }
                })}
            </div>
            <div className="w-[90%] h-[32%] text-2xl">
                <p>-------------------------------</p>
                <div className="flex items-center justify-between">
                    <p>수수료</p>
                    <p>{totalFee.toLocaleString()}</p>
                </div>
                <p>-------------------------------</p>
                <div className="flex items-center justify-between">
                    <p>총 판매 금액</p>
                    <p>{totalProfit.toLocaleString()}</p>
                </div>
                <div
                    className="my-4 py-2 border-4 color-border-subbold cursor-pointer"
                    onClick={() => sellProduct(totalProfit)}
                >
                    판매
                </div>
            </div>
        </div>
    );
}
