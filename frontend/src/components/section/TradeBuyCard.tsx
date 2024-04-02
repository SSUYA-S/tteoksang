import { BuyInfo } from '../../type/types';

interface BuyCardProps {
    buyableInfo: BuyInfo;
    updateBuyingList: (x: number, y: number, z: number) => void;
    calculateMaximumValue: (id: number, nowValue: number) => number;
    maximumAlert: () => void;
    minimumAlert: () => void;
    productUnit: string;
}

export default function TradeBuyCard({
    buyableInfo,
    updateBuyingList,
    calculateMaximumValue,
    maximumAlert,
    minimumAlert,
    productUnit,
}: BuyCardProps) {
    const productNumber = buyableInfo.buyingInfo.productQuantity;
    const productTotalCost = buyableInfo.buyingInfo.productTotalCost;
    const productId = buyableInfo.buyingInfo.productId;
    const productCost = buyableInfo.productInfo.productCost;

    /** changeProductNumber(changeValue)
     *  changeValue만큼 product의 수를 변동시킨다.
     * @param changeValue
     */

    const changeProductNumber = (changingValue: number) => {
        //최대로 더할 수 있는 수
        const maxAddValue = calculateMaximumValue(
            buyableInfo.productInfo.productId,
            productNumber
        );
        // console.log(maxAddValue);
        if (changingValue > maxAddValue) {
            changingValue = maxAddValue;
            maximumAlert();
        }
        let changedValue = productNumber + changingValue;
        //0보다 작은 경우 대비
        if (changedValue < 0) {
            changedValue = 0;
            minimumAlert();
        }
        //혹시나 싶은 큰 경우 대비
        if (changedValue > buyableInfo.productInfo.productMaxQuantity)
            changedValue = buyableInfo.productInfo.productMaxQuantity;
        const changedCost = changedValue * productCost;
        //리스트 변경, id의 개수가 changedValue로 변경
        updateBuyingList(
            buyableInfo.productInfo.productId,
            changedValue,
            changedCost
        );
    };

    const changeToMax = () => {
        const maxAddValue = calculateMaximumValue(
            buyableInfo.productInfo.productId,
            productNumber
        );
        changeProductNumber(maxAddValue);
    };

    return (
        <div
            className={`w-[48%] h-[48%] ${
                productNumber > 0
                    ? 'color-bg-main border-red-500'
                    : 'bg-white color-border-subbold'
            } border-[0.2vw] rounded-[0.8vw] mx-[0.2vw] my-[0.2vw]`}
        >
            <p className="w-full h-[15%] flex justify-center items-center text-center text-[1.4vw] color-bg-brown1 color-text-main rounded-ss-[0.4vw] rounded-se-[0.4vw]">
                {buyableInfo.productName}
            </p>
            <div className="w-full h-[60%] flex">
                <div className="w-[30%] h-full flex flex-col justify-between ">
                    <p className="h-[20%] text-[1.4vw] color-text-subbold pt-[0.5vw] ">
                        {buyableInfo.productInfo.productMaxQuantity.toLocaleString() +
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
                    <div className="h-[15%]"></div>
                    <div className="w-full h-[65%] flex flex-col items-center justify-start px-[1.0vw]">
                        <div className="w-full flex justify-between text-[1.1vw] my-[0.8vh]">
                            <p className="color-text-subbold">전일 대비</p>
                            {buyableInfo.productInfo.productFluctuation > 0 ? (
                                <p className="color-text-blue3">
                                    {'+' +
                                        buyableInfo.productInfo.productFluctuation.toLocaleString() +
                                        'G'}
                                </p>
                            ) : buyableInfo.productInfo.productFluctuation ===
                              0 ? (
                                <p className="color-text-green1">
                                    {buyableInfo.productInfo.productFluctuation.toLocaleString() +
                                        'G'}
                                </p>
                            ) : (
                                <p className="color-text-red1">
                                    {buyableInfo.productInfo.productFluctuation.toLocaleString() +
                                        'G'}
                                </p>
                            )}
                        </div>
                        <div className="w-full flex justify-between text-[1.1vw] ">
                            <p className="color-text-subbold">
                                나의 평균 구매가
                            </p>
                            <p className="color-text-subbold">
                                {buyableInfo.myProduct.productQuantity !== 0
                                    ? `${Math.floor(
                                          buyableInfo.myProduct
                                              .productTotalCost /
                                              buyableInfo.myProduct
                                                  .productQuantity
                                      ).toLocaleString()}G`
                                    : '미구매'}
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
                    onClick={changeToMax}
                >
                    최대
                </div>
                <div className="w-[60%] h-[70%] py-[0.2vw] px-4 flex items-center justify-center text-[1.8vw] mx-[0.2vw] color-bg-orange1 rounded-[0.4vw] text-white cursor-default">
                    {productTotalCost.toLocaleString() + '(G)'}
                </div>
            </div>
        </div>
    );
}
