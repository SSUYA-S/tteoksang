export default function TradeModal() {
    return (
        <section className="relative w-[80%] h-[80%] flex justify-center items-center border-8 color-border-sublight color-bg-main rounded-xl z-50">
            <div className="w-[12%] h-full">
                <div className="h-[15%]" />
                <div className="flex flex-col items-center ">
                    <div className="w-[70%] text-3xl my-2 py-4 text-white border-4 color-border-sublight color-bg-sublight rounded-xl">
                        구매
                    </div>
                    <div className="w-[70%] text-3xl my-2 py-4 bg-white color-text-textcolor border-4 color-border-sublight rounded-xl">
                        판매
                    </div>
                    <div className="w-[70%] text-3xl my-2 py-4 bg-white color-text-textcolor border-4 color-border-sublight rounded-xl">
                        시세
                    </div>
                </div>
            </div>
            <div className="w-[60%] h-full">
                <div className="h-[15%] flex justify-between items-end pb-4">
                    <p className="text-5xl color-text-textcolor">물품 구매</p>
                    <div className="w-[35%] flex justify-between text-3xl color-text-textcolor">
                        <p>예상 창고 용량</p>
                        <p>100/300</p>
                    </div>
                </div>
                <div className="flex h-[80%] m-4">
                    <div className="w-[50%] h-[50%] bg-white color-border-subbold border-4 rounded-xl">
                        <p className="w-full h-[15%] flex justify-center items-center text-center text-3xl color-bg-brown1 color-text-main rounded-ss-lg rounded-se-lg">
                            망고
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
                                    <div className="w-full flex justify-between text-2xl my-2">
                                        <p className="color-text-subbold">
                                            전일 대비
                                        </p>
                                        <p className="color-text-blue3">+20G</p>
                                    </div>
                                    <div className="w-full flex justify-between text-2xl">
                                        <p className="color-text-subbold">
                                            나의 평균 구매가
                                        </p>
                                        <p className="color-text-subbold">
                                            160G
                                        </p>
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
                </div>
            </div>
            <div className="w-[28%] h-full p-4">
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
                        <div className="w-full flex justify-between my-1">
                            <p className="w-[35%]">망고</p>
                            <p className="w-[30%]">1</p>
                            <p className="w-[35%]">1,200</p>
                        </div>
                        <div className="w-full flex justify-between my-1">
                            <p className="w-[35%]">청사과</p>
                            <p className="w-[30%]">6</p>
                            <p className="w-[35%]">1,200</p>
                        </div>
                    </div>
                    <div className="w-[90%] h-[25%] text-2xl">
                        <p>-------------------------------</p>
                        <div className="flex items-center justify-between">
                            <p>총 구매 가능</p>
                            <p>100 / 200</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p>총 결재 금액</p>
                            <p>800</p>
                        </div>
                        <div className="my-4 py-2 border-4 color-border-subbold">
                            구매
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
