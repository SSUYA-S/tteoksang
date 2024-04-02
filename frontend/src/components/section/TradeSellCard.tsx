import { SellInfo } from '../../type/types';

interface SellCardProps {
    sellInfo: SellInfo;
    updateSellingList: (x: number, y: number, z: number) => void;
    maximumAlert: () => void;
    minimumAlert: () => void;
    productUnit: string;
}

export default function TradeSellCard({
    sellInfo,
    updateSellingList,
    maximumAlert,
    minimumAlert,
    productUnit,
}: SellCardProps) {
    let myAvg = 0;
    if (sellInfo.myProduct.productQuantity !== 0) {
        myAvg =
            sellInfo.myProduct.productTotalCost /
            sellInfo.myProduct.productQuantity;
        myAvg = Math.floor(myAvg);
    }

    const profit = Math.floor(sellInfo.productInfo.productCost - myAvg);
    const productId = sellInfo.sellingInfo.productId;
    const productNumber = sellInfo.sellingInfo.productQuantity;
    const productCost = sellInfo.sellingInfo.productTotalCost;

    /** changeProductNumber(changeValue)
     *  changeValue만큼 product의 수를 변동시킨다.
     * @param changeValue
     */
    const changeProductNumber = (changingValue: number) => {
        let changedValue = productNumber + changingValue;
        if (changedValue < 0) {
            minimumAlert();
            changedValue = 0;
        }
        if (changedValue > sellInfo.myProduct.productQuantity) {
            maximumAlert();
            changedValue = sellInfo.myProduct.productQuantity;
        }
        const changedCost = changedValue * sellInfo.productInfo.productCost;
        updateSellingList(
            sellInfo.productInfo.productId,
            changedValue,
            changedCost
        );
    };

    return (
        <div className="w-[48%] h-[48%] bg-white color-border-subbold border-[0.2vw] rounded-[0.8vw] mx-[0.2vw] my-[0.2vw]">
            <p className="w-full h-[15%] flex justify-center items-center text-center text-[1.4vw] color-bg-brown1 color-text-main rounded-ss-[0.4vw] rounded-se-[0.4vw]">
                {sellInfo.productName}
            </p>
            <div className="w-full h-[60%] flex">
                <div className="w-[30%] h-full flex flex-col justify-between ">
                    <p className="h-[20%] text-[1.4vw] color-text-subbold pt-[0.5vw] ">
                        {sellInfo.myProduct.productQuantity.toLocaleString() +
                            productUnit}
                    </p>
                    <p className="h-[20%] text-[1vw] color-text-subbold pt-[0.5vw] ">
                        {'구매 가능'}
                    </p>
                    <div
                        className={
                            'w-fit h-[60%] bg-no-repeat mx-auto sprite-img-crop ' +
                            `crop-img-${productId}`
                        }
                        style={{
                            aspectRatio: 1 / 1,
                        }}
                    ></div>
                    <p className="h-[20%] text-[1vw] color-text-darkgray">
                        {`${productUnit.trim()}당 ${productCost.toLocaleString()}G`}
                    </p>
                </div>
                <div className="w-[70%] h-full flex flex-col justify-center">
                    <div className="h-[0%]"></div>
                    <div className="w-full h-[80%] flex flex-col items-center justify-start px-[1.0vw]">
                        <div className="w-full flex justify-between text-[1.1vw] my-[0.4vh]">
                            <p className="color-text-subbold">전일 대비</p>
                            <p className="color-text-blue3">
                                {sellInfo.productInfo.productFluctuation > 0 ? (
                                    <p className="color-text-blue3">
                                        {'+' +
                                            sellInfo.productInfo.productFluctuation.toLocaleString() +
                                            'G'}
                                    </p>
                                ) : sellInfo.productInfo.productFluctuation ===
                                  0 ? (
                                    <p className="color-text-green1">
                                        {sellInfo.productInfo.productFluctuation.toLocaleString() +
                                            'G'}
                                    </p>
                                ) : (
                                    <p className="color-text-red1">
                                        {sellInfo.productInfo.productFluctuation.toLocaleString() +
                                            'G'}
                                    </p>
                                )}
                            </p>
                        </div>
                        <div className="w-full flex justify-between text-[1.1vw] ">
                            <p className="color-text-subbold">
                                나의 평균 구매가
                            </p>
                            <p className="color-text-subbold">
                                {myAvg.toLocaleString()}G
                            </p>
                        </div>
                        <div className="w-full flex justify-between text-[1.1vw] my-[0.4vh] pb-[1vh]">
                            <p className="color-text-subbold">구매 대비 이익</p>
                            <p className="color-text-blue3">
                                {profit > 0 ? (
                                    <p className="color-text-blue3">
                                        {'+' + profit.toLocaleString() + 'G'}
                                    </p>
                                ) : profit === 0 ? (
                                    <p className="color-text-green1">
                                        {profit.toLocaleString() + 'G'}
                                    </p>
                                ) : (
                                    <p className="color-text-red1">
                                        {profit.toLocaleString() + 'G'}
                                    </p>
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="w-full h-[20%] flex justify-center items-center mb-[0.8vh]">
                        <div
                            className="flex py-[0.2vw] px-[0.4vw] text-[1.1vw] mx-[0.2vw] color-text-orange1 rounded-[0.4vw] color-bg-yellow1 cursor-pointer"
                            onClick={() => changeProductNumber(-10)}
                        >
                            -10
                        </div>
                        <div
                            className="flex py-[0.2vw] px-[0.4vw] text-[1.1vw] mx-[0.2vw] color-text-orange1 rounded-[0.4vw] color-bg-yellow1 cursor-pointer"
                            onClick={() => changeProductNumber(-1)}
                        >
                            -1
                        </div>
                        <div className="py-[0.1vw] px-[1.2vw] mx-[0.4vw] text-[1.6vw] text-white color-bg-orange1 rounded-[0.4vw] cursor-default">
                            {productNumber.toLocaleString()}
                        </div>
                        <div
                            className="flex py-[0.2vw] px-[0.4vw] text-[1.1vw] mx-[0.2vw] color-text-orange1 rounded-[0.4vw] color-bg-yellow1 cursor-pointer"
                            onClick={() => changeProductNumber(1)}
                        >
                            +1
                        </div>
                        <div
                            className="flex py-[0.2vw] px-[0.4vw] text-[1.1vw] mx-[0.2vw] color-text-orange1 rounded-[0.4vw] color-bg-yellow1 cursor-pointer"
                            onClick={() => changeProductNumber(10)}
                        >
                            +10
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-[25%] flex items-center justify-center">
                <div
                    className="h-[70%] py-[0.2vw] px-[0.6vw] flex items-center text-[1.1vw] mx-[0.2vw] color-bg-orange1 rounded-[0.4vw] text-white cursor-pointer"
                    onClick={() => {
                        changeProductNumber(productNumber * -1);
                    }}
                >
                    최소
                </div>
                <div
                    className="h-[70%] py-[0.2vw] px-[0.6vw] flex items-center text-[1.1vw] mx-[0.2vw] color-bg-orange1 rounded-[0.4vw] text-white cursor-pointer"
                    onClick={() => {
                        console.log('Hello');
                        changeProductNumber(sellInfo.myProduct.productQuantity);
                    }}
                >
                    최대
                </div>
                <div className="w-[60%] h-[70%] py-[0.2vw] px-4 flex items-center justify-center text-[1.8vw] mx-[0.2vw] color-bg-orange1 rounded-[0.4vw] text-white cursor-default">
                    {productCost.toLocaleString() + '(G)'}
                </div>
            </div>
        </div>
    );
}
