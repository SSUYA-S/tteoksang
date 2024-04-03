// import gameInfo from '../../dummy-data/game-info.json';
import { BuyInfo } from '../../type/types';

interface BuyReceiptProps {
    buyableInfoList: BuyInfo[];
    maximumBuyable: number;
    buyProduct: () => void;
}

export default function TradeBuyReceipt({
    buyableInfoList,
    maximumBuyable,
    buyProduct,
}: BuyReceiptProps) {
    let totalNumber = 0;
    let totalCost = 0;

    return (
        <div className="relative w-[90%] h-[85%] flex flex-col justify-between items-center color-text-textcolor rounded-[1vw]">
            <img
                src="/src/assets/images/layout/receipt.webp"
                className="absolute w-full h-full -z-10"
                alt=""
            />
            <p className="h-[15%] text-[2.4vw] flex items-center justify-center">
                구매 영수증
            </p>
            <div className="w-[90%] h-[60%] text-[1.2vw]">
                <div className="w-full flex justify-between">
                    <p className="w-[35%]">물품명</p>
                    <p className="w-[30%]">수량</p>
                    <p className="w-[35%]">가격</p>
                </div>
                <p>---------------------</p>
                {buyableInfoList.map((buyable) => {
                    const product = buyable.buyingInfo;
                    if (product.productQuantity !== 0) {
                        totalNumber += product.productQuantity;
                        totalCost += product.productTotalCost;
                        return (
                            <div
                                className="w-full flex justify-between my-[0.2vw]"
                                key={product.productId}
                            >
                                <p className="w-[35%]">{buyable.productName}</p>
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
            <div className="w-[80%] text-[1.2vw] pb-[1.2vw]">
                <p>---------------------</p>
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
                    className="w-[80%] text-center my-[0.4vw] mx-auto py-[0.4vw] border-[0.2vw] rounded-[1vw] color-border-subbold cursor-pointer hover:color-bg-subbold hover:text-white btn-animation "
                    onClick={buyProduct}
                >
                    구매
                </div>
            </div>
        </div>
    );
}
