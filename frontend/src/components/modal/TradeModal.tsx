import { useState } from 'react';
import TradeBuyReceipt from '../section/TradeBuyReceipt';
import TradeBuyCard from '../section/TradeBuyCard';
import TradeSellCard from '../section/TradeSellCard';
import TradeSellReceipt from '../section/TradeSellReceipt';

type tradeType = {
    setTradeFlag: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TradeModal(props: tradeType) {
    const [tradeTab, setTradeTab] = useState<Number>(0);

    const changeTab = (prop: Number) => {
        setTradeTab(prop);
        console.log(tradeTab);
    };
    const closeTradeModal = () => {
        props.setTradeFlag(false);
    };

    const tradeElement = () => {
        if (tradeTab === 0) {
            return (
                <>
                    <div className="w-[60%] h-full">
                        <div className="h-[15%] flex justify-between items-end pb-4">
                            <p className="text-5xl color-text-textcolor">
                                물품 구매
                            </p>
                            <div className="w-[35%] flex justify-between text-3xl color-text-textcolor">
                                <p>예상 창고 용량</p>
                                <p>100/300</p>
                            </div>
                        </div>
                        <div className="flex h-[80%] m-4 flex-wrap">
                            <TradeBuyCard />
                            <TradeBuyCard />
                        </div>
                    </div>
                    <div className="w-[28%] h-full p-4">
                        <TradeBuyReceipt />
                    </div>
                </>
            );
        } else if (tradeTab === 1) {
            return (
                <>
                    <div className="w-[60%] h-full">
                        <div className="h-[15%] flex justify-between items-end pb-4">
                            <p className="text-5xl color-text-textcolor">
                                물품 판매
                            </p>
                            <div className="w-[35%] flex justify-between text-3xl color-text-textcolor">
                                <p>예상 창고 용량</p>
                                <p>100/300</p>
                            </div>
                        </div>
                        <div className="flex h-[80%] m-4 flex-wrap">
                            <TradeSellCard />
                            <TradeSellCard />
                        </div>
                    </div>
                    <div className="w-[28%] h-full p-4">
                        <TradeSellReceipt />
                    </div>
                </>
            );
        }
    };
    return (
        <section className="relative w-[80%] h-[80%] flex justify-center items-center border-8 color-border-sublight color-bg-main rounded-xl z-50 animation-modal ">
            <div className="w-[12%] h-full">
                <div className="h-[15%]" />
                <div className="flex flex-col items-center ">
                    <div
                        className="w-[70%] text-3xl my-2 py-4 bg-white color-text-textcolor border-4 color-border-sublight rounded-xl cursor-pointer"
                        onClick={() => {
                            changeTab(0);
                        }}
                        style={
                            tradeTab === 0
                                ? {
                                      backgroundColor: `var(--color-sublight)`,
                                      borderColor: `var(--color-sublight)`,
                                      color: '#ffffff',
                                  }
                                : {}
                        }
                    >
                        구매
                    </div>
                    <div
                        className="w-[70%] text-3xl my-2 py-4 bg-white color-text-textcolor border-4 color-border-sublight rounded-xl cursor-pointer"
                        onClick={() => {
                            changeTab(1);
                        }}
                        style={
                            tradeTab === 1
                                ? {
                                      backgroundColor: `var(--color-sublight)`,
                                      borderColor: `var(--color-sublight)`,
                                      color: '#ffffff',
                                  }
                                : {}
                        }
                    >
                        판매
                    </div>
                    <div
                        className="w-[70%] text-3xl my-2 py-4 bg-white color-text-textcolor border-4 color-border-sublight rounded-xl cursor-pointer"
                        onClick={() => {
                            changeTab(2);
                        }}
                        style={
                            tradeTab === 2
                                ? {
                                      backgroundColor: `var(--color-sublight)`,
                                      borderColor: `var(--color-sublight)`,
                                      color: '#ffffff',
                                  }
                                : {}
                        }
                    >
                        시세
                    </div>
                </div>
            </div>
            {tradeElement()}
            <div
                className="absolute text-3xl flex items-center justify-center text-white -top-8 -right-8 w-16 h-16 border-[6px] color-border-sublight color-bg-orange1 rounded-full cursor-pointer"
                onClick={() => {
                    closeTradeModal();
                }}
            >
                X
            </div>
        </section>
    );
}
