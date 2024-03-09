import { useState } from 'react';
import TradeModal from './modal/TradeModal';
import FacilityModal from './modal/FacilityModal';
import InfoSeasonModal from './modal/InfoSeasonModal';
import InfoNotConnectModal from './modal/InfoNotConnectModal';

export default function GameComponent() {
    const [tradeFlag, setTradeFlag] = useState<boolean>(false);
    const [facilityFlag, setFacilityFlag] = useState<boolean>(false);
    const [infoSeasonFlag, setInfoSeasonFlag] = useState<boolean>(true);
    const [infoNotConnectFlag, setInfoNotConnectFlag] = useState<boolean>(true);

    const openTradeElement = () => {
        setTradeFlag(true);
        setFacilityFlag(false);
    };
    const openFacilityElement = () => {
        setFacilityFlag(true);
        setTradeFlag(false);
    };

    return (
        <section
            className="relative w-full h-full flex flex-col justify-center items-center"
            style={{
                backgroundImage:
                    'url(/src/assets/images/background/bg-main-morning.png)',
            }}
        >
            {/* 좌측 상단 ui */}
            <div className="absolute top-[4%] left-[2%]">
                <div className="flex items-center justify-center">
                    <div className="w-44 h-44 border-[5px] color-border-subbold bg-white z-10">
                        <div
                            className="w-40 h-40 bg-no-repeat cursor-pointer"
                            style={{
                                backgroundImage:
                                    'url(/src/assets/images/etc/mypage-profile.png)',
                                backgroundSize: 'cover',
                            }}
                        ></div>
                    </div>
                    <div className="relative color-bg-main -left-4 w-[480px] h-fit border-[5px] color-border-subbold rounded-xl py-2">
                        <p className="text-start mx-8 text-2xl text-green-500">
                            뿌리채소의 제왕
                        </p>
                        <p className="text-start mx-8 my-2 text-3xl text-green-500">
                            제노 님
                        </p>
                        <p className="text-end mx-4 text-3xl">1,000,000</p>
                    </div>
                </div>
            </div>

            {/* 우측 상단 ui */}
            <div className="absolute top-[2%] right-[1%]">
                <div className="flex items-start justify-center">
                    <div
                        className="w-28 h-36 bg-no-repeat cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-season-winter.png)',
                        }}
                    />
                    <div
                        className="w-56 h-60 bg-no-repeat cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-time.png)',
                        }}
                    />
                </div>
            </div>

            {/* 좌측 하단 ui */}
            <div className="absolute bottom-[2%] left-[1%]">
                <div className="flex items-center justify-center">
                    <div
                        className="w-28 h-36 bg-no-repeat cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-trade.png)',
                        }}
                        onClick={() => {
                            openTradeElement();
                        }}
                    />
                    <div
                        className="w-28 h-36 bg-no-repeat cursor-pointer mx-2"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-facility.png)',
                        }}
                        onClick={() => {
                            openFacilityElement();
                        }}
                    />
                    <div
                        className="w-28 h-36 bg-no-repeat cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-inventory.png)',
                        }}
                    />
                    <div
                        className="w-28 h-36 bg-no-repeat cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-newspaper.png)',
                        }}
                    />
                    <div
                        className="w-28 h-36 bg-no-repeat cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-accident.png)',
                        }}
                    />
                </div>
            </div>

            {/* 우측 하단 ui */}
            <div className="absolute bottom-[2%] right-[1%]">
                <div className="flex items-center justify-center">
                    <div
                        className="w-28 h-36 bg-no-repeat cursor-pointer ms-4"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-closet.png)',
                        }}
                    />
                    <div
                        className="w-28 h-40 bg-no-repeat cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-setting.png)',
                        }}
                    />
                    <div
                        className="w-28 h-40 bg-no-repeat cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/icon/ui-icon-quit.png)',
                        }}
                    />
                </div>
            </div>
            <div
                className="w-80 h-40 absolute bottom-[20%]"
                style={{
                    backgroundImage: 'url(/src/assets/images/etc/yadon.png)',
                }}
            ></div>
            {tradeFlag ? <TradeModal setTradeFlag={setTradeFlag} /> : <></>}
            {facilityFlag ? (
                <FacilityModal setFacilityFlag={setFacilityFlag} />
            ) : (
                <></>
            )}
            {infoSeasonFlag ? (
                <InfoSeasonModal setInfoSeasonFlag={setInfoSeasonFlag} />
            ) : (
                <></>
            )}
            {infoNotConnectFlag ? (
                <InfoNotConnectModal
                    setInfoNotConnectFlag={setInfoNotConnectFlag}
                />
            ) : (
                <></>
            )}
        </section>
    );
}
