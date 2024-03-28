import { ProductBucket } from '../../type/types';

interface SellCardProps {
    myProduct: ProductBucket;
    productName: string;
    productTodayCost: number;
    productFluctuation: number;
}

export default function InventoryCard({
    myProduct,
    productName,
    productTodayCost,
    productFluctuation,
}: SellCardProps) {
    let myAvg = 0;
    if (myProduct.productQuantity !== 0) {
        myAvg = myProduct.productTotalCost / myProduct.productQuantity;
        myAvg = Math.floor(myAvg);
    }

    const profit = Math.floor(productTodayCost - myAvg);

    const productNumber = myProduct.productQuantity;

    return (
        <div className="w-[40%] h-[50%] bg-white color-border-subbold border-[0.2vw] rounded-[0.8vw]">
            <p className="w-full h-[15%] flex justify-center items-center text-center text-[1.4vw] color-bg-brown1 color-text-main rounded-ss-[0.4vw] rounded-se-[0.4vw]">
                {productName}
            </p>
            <div className="w-full h-[60%] flex">
                <div className="w-[30%] h-full flex flex-col justify-between ">
                    <p className="h-[20%] text-[1.4vw] color-text-subbold pt-[0.5vw]">
                        {'x' + productNumber}
                    </p>
                    <div
                        className={
                            'w-fit h-[60%] bg-no-repeat mx-auto sprite-img-crop ' +
                            `crop-img-${myProduct.productId - 1}`
                        }
                        style={{
                            aspectRatio: 1 / 1,
                        }}
                    ></div>
                    <p className="h-[20%] text-[1.1vw] color-text-darkgray">
                        1개당 {productTodayCost}G
                    </p>
                </div>
                <div className="w-[70%] h-full flex flex-col justify-center">
                    <div className="h-[20%]"></div>
                    <div className="w-full h-[60%] flex flex-col items-center justify-center px-[1.0vw]">
                        <div className="w-full flex justify-between text-[1.3vw] my-[0.8vh]">
                            <p className="color-text-subbold">전일 대비</p>
                            <p className="color-text-blue3">
                                {productFluctuation > 0 ? (
                                    <p className="color-text-blue3">
                                        {'+' + productFluctuation + 'G'}
                                    </p>
                                ) : productFluctuation === 0 ? (
                                    <p className="color-text-green1">
                                        {productFluctuation + 'G'}
                                    </p>
                                ) : (
                                    <p className="color-text-red1">
                                        {productFluctuation + 'G'}
                                    </p>
                                )}
                            </p>
                        </div>
                        <div className="w-full flex justify-between text-[1.3vw]">
                            <p className="color-text-subbold">
                                나의 평균 구매가
                            </p>
                            <p className="color-text-subbold">{myAvg}G</p>
                        </div>
                        <div className="w-full flex justify-between text-[1.3vw] my-[0.8vh] pb-[1vh]">
                            <p className="color-text-subbold">구매 대비 이익</p>
                            <p className="color-text-blue3">
                                {profit > 0 ? (
                                    <p className="color-text-blue3">
                                        {'+' + profit + 'G'}
                                    </p>
                                ) : profit === 0 ? (
                                    <p className="color-text-green1">
                                        {profit + 'G'}
                                    </p>
                                ) : (
                                    <p className="color-text-red1">
                                        {profit + 'G'}
                                    </p>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
