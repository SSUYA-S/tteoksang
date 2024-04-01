export default function RankingCard() {
    return (
        <div className="relative bg-red-50 w-full h-full flex flex-col items-center py-[1vw] border-[0.3vw] rounded-[0.8vw] color-border-subbold">
            <img
                className="w-[90%] z-10"
                src="/src/assets/images/profile/frame (1).png"
                alt=""
            />
            <img
                className="absolute w-[90%]"
                src="/src/assets/images/profile/icon (1).png"
                alt=""
            />
            <div className="h-[10%]"></div>
            <div className="color-text-textcolor h-full flex flex-col items-center justify-between">
                <div>
                    <p className="text-[2.2vw]">부자</p>
                    <p className="text-[1.4vw]">23억 3221만</p>
                </div>
                <div>
                    <p className="text-[1.2vw]">나 : 12억 1232만</p>
                    <p className="text-[1.2vw]">상위 12%</p>
                </div>
            </div>
            <div className="h-[20%]"></div>
        </div>
    );
}
