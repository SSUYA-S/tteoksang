export default function TradeSellCard() {
    return (
        <div className="w-[50%] h-[50%] bg-white color-border-subbold border-4 rounded-xl">
            <p className="w-full h-[15%] flex justify-center items-center text-center text-3xl color-bg-brown1 color-text-main rounded-ss-lg rounded-se-lg">
                망고2
            </p>
            <div className="w-full h-[60%] flex">
                <div className="w-[30%] h-full flex flex-col justify-between ">
                    <p className="h-[20%] text-3xl color-text-subbold pt-2 ">
                        x64
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
                        1개당 200G
                    </p>
                </div>
                <div className="w-[70%] h-full flex flex-col justify-center">
                    <div className="h-[20%]"></div>
                    <div className="w-full h-[60%] flex flex-col items-center justify-center px-4">
                        <div className="w-full flex justify-between text-2xl my-1">
                            <p className="color-text-subbold">전일 대비</p>
                            <p className="color-text-blue3">+20G</p>
                        </div>
                        <div className="w-full flex justify-between text-2xl">
                            <p className="color-text-subbold">
                                나의 평균 구매가
                            </p>
                            <p className="color-text-subbold">160G</p>
                        </div>
                        <div className="w-full flex justify-between text-2xl mt-1 pb-6">
                            <p className="color-text-subbold">구매 대비 이익</p>
                            <p className="color-text-blue3">+100G</p>
                        </div>
                    </div>
                    <div className="w-full h-[20%] flex justify-center items-center">
                        <div className="flex py-1 px-2 text-2xl mx-1 color-text-orange1 rounded-lg color-bg-yellow1">
                            ◀
                        </div>
                        <div className="flex py-1 px-2 text-2xl mx-1 color-text-orange1 rounded-lg color-bg-yellow1">
                            ◀
                        </div>
                        <div className="py-2 px-8 mx-2 text-3xl text-white color-bg-orange1 rounded-xl">
                            1
                        </div>
                        <div className="flex py-1 px-2 text-2xl mx-1 color-text-orange1 rounded-lg color-bg-yellow1">
                            ▶
                        </div>
                        <div className="flex py-1 px-2 text-2xl mx-1 color-text-orange1 rounded-lg color-bg-yellow1">
                            ▶
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-[25%] flex items-center justify-center">
                <div className="h-[70%] py-1 px-4 flex items-center text-2xl mx-1 color-bg-orange1 rounded-lg text-white">
                    최소
                </div>
                <div className="h-[70%] py-1 px-4 flex items-center text-2xl mx-1 color-bg-orange1 rounded-lg text-white">
                    최대
                </div>
                <div className="w-[60%] h-[70%] py-1 px-4 flex items-center justify-center text-5xl mx-1 color-bg-orange1 rounded-lg text-white">
                    200
                </div>
            </div>
        </div>
    );
}
