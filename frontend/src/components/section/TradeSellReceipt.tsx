export default function TradeSellReceipt() {
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
            <div className="w-[90%] h-[32%] text-2xl">
                <p>-------------------------------</p>
                <div className="flex items-center justify-between">
                    <p>수수료</p>
                    <p>200</p>
                </div>
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
                    판매
                </div>
            </div>
        </div>
    );
}
