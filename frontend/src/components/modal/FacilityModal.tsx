import { useState } from 'react';

import gameInfo from '../../dummy-data/game-info.json';
import warehouseInfo from '../../dummy-data/warehouse-info.json';

type facilityType = {
    setFacilityFlag: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function FacilityModal(props: facilityType) {
    const [facilityType, setFacilityType] = useState<Number>(0);
    const closeFacilityModal = () => {
        props.setFacilityFlag(false);
    };

    const changeFailityType = (prop: Number) => {
        setFacilityType(prop);
    };

    const facilityElement = () => {
        if (facilityType === 0) {
            return (
                <>
                    <div className="w-full h-[20%] flex items-center justify-center text-4xl">
                        업그레이드 하고 싶은 항목을 클릭하세요.
                    </div>
                    <div className="w-full h-[80%] flex items-end justify-around">
                        <div
                            className="w-[33%] h-[50%] cursor-pointer"
                            onClick={() => {
                                changeFailityType(1);
                            }}
                        >
                            <p className="text-3xl">운송수단</p>
                            <div
                                className="w-full h-full"
                                style={{
                                    backgroundImage:
                                        'url(/src/assets/images/etc/facility-transport-1.png)',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPositionX: 'center',
                                }}
                            ></div>
                        </div>
                        <div
                            className="w-[34%] h-[80%] cursor-pointer"
                            onClick={() => {
                                changeFailityType(2);
                            }}
                        >
                            <p className="text-3xl">창고</p>
                            <div
                                className="w-full h-full"
                                style={{
                                    backgroundImage:
                                        'url(/src/assets/images/etc/facility-warehouse-1.png)',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPositionX: 'center',
                                }}
                            ></div>
                        </div>
                        <div
                            className="w-[33%] h-[70%] cursor-pointer"
                            onClick={() => {
                                changeFailityType(3);
                            }}
                        >
                            <p className="text-3xl">중개소</p>
                            <div
                                className="w-full h-full"
                                style={{
                                    backgroundImage:
                                        'url(/src/assets/images/etc/facility-broker-1.png)',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPositionX: 'center',
                                }}
                            ></div>
                        </div>
                    </div>
                </>
            );
        } else if (facilityType === 1) {
            //운송수단 레벨 최대 아님
            if (warehouseInfo.vehicleLevel < gameInfo.vehicle.length - 1) {
                return (
                    <section className="w-full h-full flex flex-col items-center justify-center ">
                        <div className="w-full h-[20%] text-4xl">
                            운송수단 업그레이드
                        </div>
                        <div className="relative w-[80%] h-[80%] flex items-end justify-around">
                            <div className="w-[33%] h-[50%]">
                                <p className="text-3xl">
                                    {
                                        gameInfo.vehicle[
                                            warehouseInfo.vehicleLevel
                                        ].name
                                    }
                                </p>
                                <p className="text-3xl">
                                    {'탈 것 용량 : '}
                                    {
                                        gameInfo.vehicle[
                                            warehouseInfo.vehicleLevel
                                        ].size
                                    }
                                </p>
                                <div
                                    className="w-full h-full"
                                    style={{
                                        backgroundImage:
                                            'url(/src/assets/images/etc/facility-transport-1.png)',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPositionX: 'center',
                                    }}
                                ></div>
                            </div>
                            <div className="w-[34%] h-[50%] text-5xl">
                                다음단계
                            </div>
                            <div className="w-[33%] h-[50%]">
                                <p className="text-3xl">
                                    {
                                        gameInfo.vehicle[
                                            warehouseInfo.vehicleLevel + 1
                                        ].name
                                    }
                                </p>
                                <p className="text-3xl">
                                    {'탈 것 용량 : '}
                                    {
                                        gameInfo.vehicle[
                                            warehouseInfo.vehicleLevel + 1
                                        ].size
                                    }
                                </p>
                                <div
                                    className="w-full h-full"
                                    style={{
                                        backgroundImage:
                                            'url(/src/assets/images/etc/facility-transport-1.png)',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPositionX: 'center',
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div
                            className="absolute bottom-10 flex flex-col items-center justify-center py-3 px-28 color-bg-yellow2 color-border-yellow1 border-4 rounded-full cursor-pointer"
                            onClick={() => {
                                //업그레이드 명령 내리고 창 닫기
                                changeFailityType(0);
                            }}
                        >
                            <p className="text-4xl">업그레이드</p>
                            <p className="text-3xl mt-2">1000 G</p>
                        </div>
                    </section>
                );
            } else {
                //레벨 최대
                return (
                    <section className="w-full h-full flex flex-col items-center justify-center ">
                        <div className="w-full h-[20%] text-4xl">
                            운송수단 레벨이 최대치 입니다.
                        </div>
                        <div className="relative w-[80%] h-[80%] flex items-end justify-around">
                            <div className="w-[33%] h-[50%]">
                                <p className="text-3xl">
                                    {
                                        gameInfo.vehicle[
                                            warehouseInfo.vehicleLevel
                                        ].name
                                    }
                                </p>
                                <p className="text-3xl">
                                    창고 용량 :{' '}
                                    {
                                        gameInfo.vehicle[
                                            warehouseInfo.vehicleLevel
                                        ].size
                                    }
                                </p>
                                <div
                                    className="w-full h-full"
                                    style={{
                                        backgroundImage:
                                            'url(/src/assets/images/etc/facility-transport-1.png)',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPositionX: 'center',
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div
                            className="absolute bottom-10 flex flex-col items-center justify-center py-3 px-28 color-bg-yellow2 color-border-yellow1 border-4 rounded-full cursor-pointer"
                            onClick={() => {
                                //업그레이드 명령 내리고 창 닫기
                                changeFailityType(0);
                            }}
                        >
                            <p className="text-4xl">창닫기</p>
                        </div>
                    </section>
                );
            }
        } else if (facilityType === 2) {
            //창고 레벨 최대 아님
            if (warehouseInfo.warehouseLevel < gameInfo.warehouse.length - 1) {
                return (
                    <section className="w-full h-full flex flex-col items-center justify-center ">
                        <div className="w-full h-[20%] text-4xl">
                            창고 업그레이드
                        </div>
                        <div className="relative w-[80%] h-[80%] flex items-end justify-around">
                            <div className="w-[33%] h-[50%]">
                                <p className="text-3xl">
                                    {
                                        gameInfo.warehouse[
                                            warehouseInfo.warehouseLevel
                                        ].name
                                    }
                                </p>
                                <p className="text-3xl">
                                    {'창고 용량 : '}
                                    {
                                        gameInfo.warehouse[
                                            warehouseInfo.warehouseLevel
                                        ].size
                                    }
                                </p>
                                <div
                                    className="w-full h-full"
                                    style={{
                                        backgroundImage:
                                            'url(/src/assets/images/etc/facility-transport-1.png)',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPositionX: 'center',
                                    }}
                                ></div>
                            </div>
                            <div className="w-[34%] h-[50%] text-5xl">
                                다음단계
                            </div>
                            <div className="w-[33%] h-[50%]">
                                <p className="text-3xl">
                                    {
                                        gameInfo.warehouse[
                                            warehouseInfo.warehouseLevel + 1
                                        ].name
                                    }
                                </p>
                                <p className="text-3xl">
                                    {'창고 용량 : '}
                                    {
                                        gameInfo.warehouse[
                                            warehouseInfo.warehouseLevel + 1
                                        ].size
                                    }
                                </p>
                                <div
                                    className="w-full h-full"
                                    style={{
                                        backgroundImage:
                                            'url(/src/assets/images/etc/facility-transport-1.png)',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPositionX: 'center',
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div
                            className="absolute bottom-10 flex flex-col items-center justify-center py-3 px-28 color-bg-yellow2 color-border-yellow1 border-4 rounded-full cursor-pointer"
                            onClick={() => {
                                //업그레이드 명령 내리고 창 닫기
                                changeFailityType(0);
                            }}
                        >
                            <p className="text-4xl">업그레이드</p>
                            <p className="text-3xl mt-2">1000 G</p>
                        </div>
                    </section>
                );
            } else {
                //레벨 최대
                return (
                    <section className="w-full h-full flex flex-col items-center justify-center ">
                        <div className="w-full h-[20%] text-4xl">
                            창고 레벨이 최대치 입니다.
                        </div>
                        <div className="relative w-[80%] h-[80%] flex items-end justify-around">
                            <div className="w-[33%] h-[50%]">
                                <p className="text-3xl">
                                    {
                                        gameInfo.warehouse[
                                            warehouseInfo.warehouseLevel
                                        ].name
                                    }
                                </p>
                                <p className="text-3xl">
                                    창고 용량 :{' '}
                                    {
                                        gameInfo.warehouse[
                                            warehouseInfo.warehouseLevel
                                        ].size
                                    }
                                </p>
                                <div
                                    className="w-full h-full"
                                    style={{
                                        backgroundImage:
                                            'url(/src/assets/images/etc/facility-transport-1.png)',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPositionX: 'center',
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div
                            className="absolute bottom-10 flex flex-col items-center justify-center py-3 px-28 color-bg-yellow2 color-border-yellow1 border-4 rounded-full cursor-pointer"
                            onClick={() => {
                                //업그레이드 명령 내리고 창 닫기
                                changeFailityType(0);
                            }}
                        >
                            <p className="text-4xl">창닫기</p>
                        </div>
                    </section>
                );
            }
        } else {
            //중개소 레벨 최대 아님
            if (warehouseInfo.brokerLevel < gameInfo.broker.length - 1) {
                return (
                    <section className="w-full h-full flex flex-col items-center justify-center ">
                        <div className="w-full h-[20%] text-4xl">
                            중개소 업그레이드
                        </div>
                        <div className="relative w-[80%] h-[80%] flex items-end justify-around">
                            <div className="w-[33%] h-[50%]">
                                <p className="text-3xl">
                                    {
                                        gameInfo.broker[
                                            warehouseInfo.brokerLevel
                                        ].name
                                    }
                                </p>
                                <p className="text-3xl">
                                    {'수수료 : '}
                                    {Math.floor(
                                        gameInfo.broker[
                                            warehouseInfo.brokerLevel
                                        ].charge * 100
                                    )}
                                    {'%'}
                                </p>
                                <div
                                    className="w-full h-full"
                                    style={{
                                        backgroundImage:
                                            'url(/src/assets/images/etc/facility-transport-1.png)',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPositionX: 'center',
                                    }}
                                ></div>
                            </div>
                            <div className="w-[34%] h-[50%] text-5xl">
                                다음단계
                            </div>
                            <div className="w-[33%] h-[50%]">
                                <p className="text-3xl">
                                    {
                                        gameInfo.broker[
                                            warehouseInfo.brokerLevel + 1
                                        ].name
                                    }
                                </p>
                                <p className="text-3xl">
                                    {'수수료 : '}
                                    {Math.floor(
                                        gameInfo.broker[
                                            warehouseInfo.brokerLevel + 1
                                        ].charge * 100
                                    )}
                                    {'%'}
                                </p>
                                <div
                                    className="w-full h-full"
                                    style={{
                                        backgroundImage:
                                            'url(/src/assets/images/etc/facility-transport-1.png)',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPositionX: 'center',
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div
                            className="absolute bottom-10 flex flex-col items-center justify-center py-3 px-28 color-bg-yellow2 color-border-yellow1 border-4 rounded-full cursor-pointer"
                            onClick={() => {
                                //업그레이드 명령 내리고 창 닫기
                                changeFailityType(0);
                            }}
                        >
                            <p className="text-4xl">업그레이드</p>
                            <p className="text-3xl mt-2">1000 G</p>
                        </div>
                    </section>
                );
            } else {
                //레벨 최대
                return (
                    <section className="w-full h-full flex flex-col items-center justify-center ">
                        <div className="w-full h-[20%] text-4xl">
                            중개소 레벨이 최대치 입니다.
                        </div>
                        <div className="relative w-[80%] h-[80%] flex items-end justify-around">
                            <div className="w-[33%] h-[50%]">
                                <p className="text-3xl">
                                    {
                                        gameInfo.broker[
                                            warehouseInfo.brokerLevel
                                        ].name
                                    }
                                </p>
                                <p className="text-3xl">
                                    {'수수료: '}
                                    {Math.floor(
                                        gameInfo.broker[
                                            warehouseInfo.brokerLevel
                                        ].charge * 100
                                    )}
                                    {'%'}
                                </p>
                                <div
                                    className="w-full h-full"
                                    style={{
                                        backgroundImage:
                                            'url(/src/assets/images/etc/facility-transport-1.png)',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPositionX: 'center',
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div
                            className="absolute bottom-10 flex flex-col items-center justify-center py-3 px-28 color-bg-yellow2 color-border-yellow1 border-4 rounded-full cursor-pointer"
                            onClick={() => {
                                //업그레이드 명령 내리고 창 닫기
                                changeFailityType(0);
                            }}
                        >
                            <p className="text-4xl">창닫기</p>
                        </div>
                    </section>
                );
            }
        }
    };
    return (
        <section className="relative w-[80%] h-[80%] flex justify-center items-center border-8 color-border-sublight color-bg-main rounded-xl z-50">
            <div
                className="relative w-[94%] h-[90%]"
                style={{
                    backgroundImage:
                        'url(/src/assets/images/etc/facility-bg.png)',
                }}
            >
                {facilityElement()}
            </div>
            <div
                className="absolute text-3xl flex items-center justify-center text-white -top-8 -right-8 w-16 h-16 border-[6px] color-border-sublight color-bg-orange1 rounded-full cursor-pointer"
                onClick={() => {
                    closeFacilityModal();
                }}
            >
                X
            </div>
        </section>
    );
}
