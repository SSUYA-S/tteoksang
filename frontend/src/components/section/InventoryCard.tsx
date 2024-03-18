interface SellCardProps {
    myProduct: Product;
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
        myAvg = Math.floor(myAvg).toLocaleString();
    }

    const profit = Math.floor(productTodayCost - myAvg).toLocaleString();

    const productNumber = myProduct.productQuantity;
    const productCost = myProduct.productTotalCost;

    return (
        <div className="w-[50%] h-[50%] bg-white color-border-subbold border-4 rounded-xl">
            <p className="w-full h-[15%] flex justify-center items-center text-center text-3xl color-bg-brown1 color-text-main rounded-ss-lg rounded-se-lg">
                {productName}
            </p>
            <div className="w-full h-[60%] flex">
                <div className="w-[30%] h-full flex flex-col justify-between ">
                    <p className="h-[20%] text-3xl color-text-subbold pt-2 ">
                        {'x' + productNumber}
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
                        1개당 {productTodayCost}G
                    </p>
                </div>
                <div className="w-[70%] h-full flex flex-col justify-center">
                    <div className="h-[20%]"></div>
                    <div className="w-full h-[60%] flex flex-col items-center justify-center px-4">
                        <div className="w-full flex justify-between text-2xl my-1">
                            <p className="color-text-subbold">전일 대비</p>
                            <p className="color-text-blue3">
                                <p className="color-text-subbold">전일 대비</p>
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
                        <div className="w-full flex justify-between text-2xl">
                            <p className="color-text-subbold">
                                나의 평균 구매가
                            </p>
                            <p className="color-text-subbold">{myAvg}G</p>
                        </div>
                        <div className="w-full flex justify-between text-2xl mt-1 pb-6">
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
