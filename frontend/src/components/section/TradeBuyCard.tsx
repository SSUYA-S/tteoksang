import { useState } from 'react';

interface BuyCardProps {
    buyableInfo: BuyInfo;
    updateBuyingList: (x: number, y: number, z: number) => void;
}

export default function TradeBuyCard({
    buyableInfo,
    updateBuyingList,
}: BuyCardProps) {
    const productNumber = buyableInfo.buyingInfo.productQuantity;
    const productTotalCost = buyableInfo.buyingInfo.productTotalCost;
    const productCost = buyableInfo.productInfo.productCost;

    /** changeProductNumber(changeValue)
     *  changeValue만큼 product의 수를 변동시킨다.
     * @param changeValue
     */
    const changeProductNumber = (changingValue: number) => {
        let changedValue = productNumber + changingValue;
        if (changedValue < 0) changedValue = 0;
        if (changedValue > buyableInfo.productInfo.productLimit)
            changedValue = buyableInfo.productInfo.productLimit;
        const changedCost = changedValue * productCost;
        updateBuyingList(
            buyableInfo.productInfo.productId,
            changedValue,
            changedCost
        );
    };

    return (
        <div className="w-[50%] h-[50%] bg-white color-border-subbold border-4 rounded-xl">
            <p className="w-full h-[15%] flex justify-center items-center text-center text-3xl color-bg-brown1 color-text-main rounded-ss-lg rounded-se-lg">
                {buyableInfo.productName}
            </p>
            <div className="w-full h-[60%] flex">
                <div className="w-[30%] h-full flex flex-col justify-between ">
                    <p className="h-[20%] text-3xl color-text-subbold pt-2 ">
                        {'x' + buyableInfo.productInfo.productLimit}
                    </p>
                    <div
                        className="h-[60%] bg-no-repeat"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/etc/crop-mango.png)',
                            backgroundPositionX: '15px',
                            backgroundPositionY: '-10px',
                        }}
                    ></div>
                    <p className="h-[20%] text-2xl color-text-darkgray">
                        {`1개당 ${productCost}G`}
                    </p>
                </div>
                <div className="w-[70%] h-full flex flex-col justify-center">
                    <div className="h-[20%]"></div>
                    <div className="w-full h-[60%] flex flex-col items-center justify-center px-4">
                        <div className="w-full flex justify-between text-2xl my-2">
                            <p className="color-text-subbold">전일 대비</p>
                            {buyableInfo.productInfo.productFluctuation > 0 ? (
                                <p className="color-text-blue3">
                                    {'+' +
                                        buyableInfo.productInfo
                                            .productFluctuation +
                                        'G'}
                                </p>
                            ) : buyableInfo.productInfo.productFluctuation ===
                              0 ? (
                                <p className="color-text-green1">
                                    {buyableInfo.productInfo
                                        .productFluctuation + 'G'}
                                </p>
                            ) : (
                                <p className="color-text-red1">
                                    {buyableInfo.productInfo
                                        .productFluctuation + 'G'}
                                </p>
                            )}
                        </div>
                        <div className="w-full flex justify-between text-2xl">
                            <p className="color-text-subbold">
                                나의 평균 구매가
                            </p>
                            <p className="color-text-subbold">
                                {buyableInfo.myProduct.productQuantity !== 0
                                    ? `${
                                          buyableInfo.myProduct
                                              .productTotalCost /
                                          buyableInfo.myProduct.productQuantity
                                      }G`
                                    : '미구매'}
                            </p>
                        </div>
                    </div>
                    <div className="w-full h-[20%] flex justify-center items-center">
                        <div
                            className="flex py-1 px-2 text-2xl mx-1 color-text-orange1 rounded-lg color-bg-yellow1 cursor-pointer"
                            onClick={() => changeProductNumber(-10)}
                        >
                            ◀
                        </div>
                        <div
                            className="flex py-1 px-2 text-2xl mx-1 color-text-orange1 rounded-lg color-bg-yellow1 cursor-pointer"
                            onClick={() => changeProductNumber(-1)}
                        >
                            ◀
                        </div>
                        <div className="py-2 px-8 mx-2 text-3xl text-white color-bg-orange1 rounded-xl cursor-default">
                            {productNumber}
                        </div>
                        <div
                            className="flex py-1 px-2 text-2xl mx-1 color-text-orange1 rounded-lg color-bg-yellow1 cursor-pointer"
                            onClick={() => changeProductNumber(1)}
                        >
                            ▶
                        </div>
                        <div
                            className="flex py-1 px-2 text-2xl mx-1 color-text-orange1 rounded-lg color-bg-yellow1 cursor-pointer"
                            onClick={() => changeProductNumber(10)}
                        >
                            ▶
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-[25%] flex items-center justify-center">
                <div
                    className="h-[70%] py-1 px-4 flex items-center text-2xl mx-1 color-bg-orange1 rounded-lg text-white cursor-pointer"
                    onClick={() => {
                        changeProductNumber(productNumber * -1);
                    }}
                >
                    최소
                </div>
                <div className="h-[70%] py-1 px-4 flex items-center text-2xl mx-1 color-bg-orange1 rounded-lg text-white cursor-pointer">
                    최대
                </div>
                <div className="w-[60%] h-[70%] py-1 px-4 flex items-center justify-center text-5xl mx-1 color-bg-orange1 rounded-lg text-white cursor-default">
                    {productTotalCost.toLocaleString()}
                </div>
            </div>
        </div>
    );
}
