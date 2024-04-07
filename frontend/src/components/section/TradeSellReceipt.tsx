import { SellInfo } from '../../type/types';

interface SellReceiptProps {
    sellableInfoList: SellInfo[];
    fee: number;
    sellProduct: () => void;
}

export default function TradeSellReceipt({
    sellableInfoList,
    fee,
    sellProduct,
}: SellReceiptProps) {
    let totalCost = 0;
    sellableInfoList.map((product) => {
        totalCost += product.sellingInfo.productTotalCost;
    });
    //내림
    const totalFee = Math.floor((fee / 100) * totalCost);
    const totalProfit = totalCost - totalFee;

    return (
        <div className="relative w-[90%] h-[85%] flex flex-col justify-between items-center color-text-textcolor rounded-[1vw]">
            <img
                src="/src/assets/images/layout/receipt.webp"
                className="absolute w-full h-full -z-10"
                alt=""
            />
            <p className="h-[18%] text-[2.4vw] flex items-center justify-center">
                판매 영수증
            </p>
            <div className="w-[90%] h-[60%] text-[1.2vw]">
                <div className="w-full flex justify-between">
                    <p className="w-[35%]">물품명</p>
                    <p className="w-[30%]">수량</p>
                    <p className="w-[35%]">가격</p>
                </div>
                <p>---------------------</p>
                {sellableInfoList.map((product) => {
                    if (product.sellingInfo.productQuantity !== 0) {
                        return (
                            <div className="w-full flex justify-between my-[0.2vw]">
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
            <div className="w-[80%] text-[1.2vw] pb-[1.2vw]">
                <p>---------------------</p>
                <div className="flex items-center justify-between text-red-500">
                    <p>{`수수료 (${fee}%)`}</p>
                    {totalFee === 0 ? (
                        <p>{totalFee.toLocaleString()}</p>
                    ) : (
                        <p>- {totalFee.toLocaleString()}</p>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <p>총 판매 금액</p>
                    <p>{totalProfit.toLocaleString()}</p>
                </div>
                <div
                    className="w-[80%] text-center my-[0.4vw] mx-auto py-[0.4vw] border-[0.2vw] rounded-[1vw] color-border-subbold cursor-pointer hover:color-bg-subbold hover:text-white btn-animation"
                    onClick={sellProduct}
                >
                    판매
                </div>
            </div>
        </div>
    );
}
