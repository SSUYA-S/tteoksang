import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    warehouseLevelState,
    vehicleLevelState,
    brokerLevelState,
} from '../../util/myproduct-slice';

import infraInfo from '../../dummy-data/resource/Infra.json';

type InfraType = {
    setFacilityFlag: React.Dispatch<React.SetStateAction<boolean>>;
    updateNowMoney: (a: number) => void;
};

export default function InfraModal(props: InfraType) {
    const [facilityType, setFacilityType] = useState<number>(0);
    const [nowLevel, setNowLevel] = useState<number>(0);
    const [urlFacilityName, setURLFacilityName] = useState<string>('');
    const closeFacilityModal = () => {
        props.setFacilityFlag(false);
    };

    const warehouseLevel = useSelector(
        (state: any) => state.reduxFlag.myProductSlice.warehouseLevel
    );
    const vehicleLevel = useSelector(
        (state: any) => state.reduxFlag.myProductSlice.vehicleLevel
    );
    const brokerLevel = useSelector(
        (state: any) => state.reduxFlag.myProductSlice.brokerLevel
    );

    useEffect(() => {}, [warehouseLevel, vehicleLevel, brokerLevel]);

    const dispatch = useDispatch();

    const changeFailityType = (prop: number) => {
        setFacilityType(prop);
        if (prop === 1) {
            setURLFacilityName('transport');
            setNowLevel(vehicleLevel);
        } else if (prop === 2) {
            setURLFacilityName('warehouse');
            setNowLevel(warehouseLevel);
        } else if (prop === 3) {
            setURLFacilityName('broker');
            setNowLevel(brokerLevel);
        }
    };

    const checkMaxLevel = () => {
        if (facilityType === 1) {
            return nowLevel < infraInfo.vehicleInfoList.length - 1;
        } else if (facilityType === 2) {
            return nowLevel < infraInfo.warehouseInfoList.length - 1;
        } else if (facilityType === 3) {
            return nowLevel < infraInfo.brokerInfoList.length - 1;
        }
    };

    const upgradeFacility = () => {
        let upgradeFee: number = 0;
        if (facilityType === 1) {
            upgradeFee =
                infraInfo.vehicleInfoList[nowLevel - 1].vehicleUpgradeFee;
            dispatch(vehicleLevelState(nowLevel + 1));
        } else if (facilityType === 2) {
            upgradeFee =
                infraInfo.warehouseInfoList[nowLevel - 1].warehouseUpgradeFee;
            dispatch(warehouseLevelState(nowLevel + 1));
        } else if (facilityType === 3) {
            upgradeFee =
                infraInfo.brokerInfoList[nowLevel - 1].brokerUpgradeFee;
            dispatch(brokerLevelState(nowLevel + 1));
        }
        props.updateNowMoney(-1 * upgradeFee);
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
                                    backgroundImage: `url(
                                        "/src/assets/images/facility/transport (${vehicleLevel}).png"
                                    )`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPositionX: 'center',
                                }}
                            ></div>
                        </div>
                        <div
                            className="w-[34%] h-[50%] cursor-pointer"
                            onClick={() => {
                                changeFailityType(2);
                            }}
                        >
                            <p className="text-3xl">창고</p>
                            <div
                                className="w-full h-full"
                                style={{
                                    backgroundImage: `url("/src/assets/images/facility/warehouse (${warehouseLevel}).png")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPositionX: 'center',
                                }}
                            ></div>
                        </div>
                        <div
                            className="w-[33%] h-[50%] cursor-pointer"
                            onClick={() => {
                                changeFailityType(3);
                            }}
                        >
                            <p className="text-3xl">중개소</p>
                            <div
                                className="w-full h-full"
                                style={{
                                    backgroundImage: `url("/src/assets/images/facility/broker (${brokerLevel}).png")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPositionX: 'center',
                                }}
                            ></div>
                        </div>
                    </div>
                </>
            );
        } else if (
            facilityType === 1 ||
            facilityType === 2 ||
            facilityType === 3
        ) {
            //운송수단 레벨 최대 아님
            if (checkMaxLevel()) {
                return (
                    <section className="w-full h-full flex flex-col items-center justify-center ">
                        <div className="w-full h-[20%] text-4xl flex items-center justify-center">
                            {facilityType === 1
                                ? '운송수단 업그레이드'
                                : facilityType === 2
                                ? '창고 업그레이드'
                                : '중개소 업그레이드'}
                        </div>
                        <div className="relative w-[80%] h-[80%] flex items-end justify-around">
                            <div className="w-[33%] h-[50%]">
                                <p className="text-3xl">
                                    {facilityType === 1
                                        ? infraInfo.vehicleInfoList[
                                              vehicleLevel - 1
                                          ].vehicleName
                                        : facilityType === 2
                                        ? infraInfo.warehouseInfoList[
                                              warehouseLevel - 1
                                          ].warehouseName
                                        : infraInfo.brokerInfoList[
                                              brokerLevel - 1
                                          ].brokerName}
                                </p>
                                <p className="text-3xl">
                                    {facilityType === 1
                                        ? '탈 것 용량 : ' +
                                          infraInfo.vehicleInfoList[
                                              vehicleLevel - 1
                                          ].maxPurchaseQuantity
                                        : facilityType === 2
                                        ? '창고 용량 : ' +
                                          infraInfo.warehouseInfoList[
                                              warehouseLevel - 1
                                          ].maxHoldingQuantity
                                        : '중개소 수수료 : ' +
                                          Math.round(
                                              +infraInfo.brokerInfoList[
                                                  brokerLevel - 1
                                              ].brokerFee * 100
                                          ) +
                                          '%'}
                                </p>
                                <div
                                    className="w-full h-full"
                                    style={{
                                        backgroundImage: `url("/src/assets/images/facility/${urlFacilityName} (${nowLevel}).png")`,
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
                                    {facilityType === 1
                                        ? infraInfo.vehicleInfoList[
                                              vehicleLevel
                                          ].vehicleName
                                        : facilityType === 2
                                        ? infraInfo.warehouseInfoList[
                                              warehouseLevel
                                          ].warehouseName
                                        : infraInfo.brokerInfoList[brokerLevel]
                                              .brokerName}
                                </p>
                                <p className="text-3xl">
                                    {facilityType === 1
                                        ? '탈 것 용량 : ' +
                                          infraInfo.vehicleInfoList[
                                              vehicleLevel
                                          ].maxPurchaseQuantity
                                        : facilityType === 2
                                        ? '창고 용량 : ' +
                                          infraInfo.warehouseInfoList[
                                              warehouseLevel
                                          ].maxHoldingQuantity
                                        : '중개소 수수료 : ' +
                                          Math.round(
                                              +infraInfo.brokerInfoList[
                                                  brokerLevel
                                              ].brokerFee * 100
                                          ) +
                                          '%'}
                                </p>
                                <div
                                    className="w-full h-full"
                                    style={{
                                        backgroundImage: `url("/src/assets/images/facility/${urlFacilityName} (${
                                            nowLevel + 1
                                        }).png")`,
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
                                upgradeFacility();
                                changeFailityType(0);
                            }}
                        >
                            <p className="text-4xl">업그레이드</p>
                            <p className="text-3xl mt-2">
                                {facilityType === 1
                                    ? infraInfo.vehicleInfoList[
                                          vehicleLevel - 1
                                      ].vehicleUpgradeFee
                                    : facilityType === 2
                                    ? infraInfo.warehouseInfoList[
                                          warehouseLevel - 1
                                      ].warehouseUpgradeFee
                                    : infraInfo.brokerInfoList[brokerLevel - 1]
                                          .brokerUpgradeFee}
                            </p>
                        </div>
                        <div
                            className="absolute top-10 left-3 flex flex-col py-3 px-28 color-bg-yellow2 color-border-yellow1 border-4 rounded-full cursor-pointer"
                            onClick={() => {
                                //업그레이드 명령 내리고 창 닫기
                                changeFailityType(0);
                            }}
                        >
                            <p className="text-4xl">취소</p>
                        </div>
                    </section>
                );
            } else {
                //레벨 최대
                return (
                    <section className="w-full h-full flex flex-col items-center justify-center ">
                        <div className="w-full h-[20%] text-4xl flex items-center justify-center">
                            {facilityType === 1
                                ? '운송수단 레벨이 최대치입니다.'
                                : facilityType === 2
                                ? '창고 레벨이 최대치입니다.'
                                : '중개소 레벨이 최대치입니다.'}
                        </div>
                        <div className="relative w-[80%] h-[80%] flex items-end justify-around">
                            <div className="w-[33%] h-[50%]">
                                <p className="text-3xl">
                                    {facilityType === 1
                                        ? infraInfo.vehicleInfoList[
                                              vehicleLevel - 1
                                          ].vehicleName
                                        : facilityType === 2
                                        ? infraInfo.warehouseInfoList[
                                              warehouseLevel - 1
                                          ].warehouseName
                                        : infraInfo.brokerInfoList[
                                              brokerLevel - 1
                                          ].brokerName}
                                </p>
                                <p className="text-3xl">
                                    {facilityType === 1
                                        ? '탈 것 용량 : ' +
                                          infraInfo.vehicleInfoList[
                                              vehicleLevel - 1
                                          ].maxPurchaseQuantity
                                        : facilityType === 2
                                        ? '창고 용량 : ' +
                                          infraInfo.warehouseInfoList[
                                              warehouseLevel - 1
                                          ].maxHoldingQuantity
                                        : '중개소 수수료 : ' +
                                          Math.round(
                                              +infraInfo.brokerInfoList[
                                                  brokerLevel - 1
                                              ].brokerFee * 100
                                          ) +
                                          '%'}
                                </p>
                                <div
                                    className="w-full h-full"
                                    style={{
                                        backgroundImage: `url("/src/assets/images/facility/${urlFacilityName} (${nowLevel}).png")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPositionX: 'center',
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div
                            className="absolute top-10 left-3 flex flex-col py-3 px-28 color-bg-yellow2 color-border-yellow1 border-4 rounded-full cursor-pointer"
                            onClick={() => {
                                //업그레이드 명령 내리고 창 닫기
                                changeFailityType(0);
                            }}
                        >
                            <p className="text-4xl">취소</p>
                        </div>
                        <div
                            className="absolute bottom-10 flex flex-col items-center justify-center py-3 px-28 color-bg-yellow2 color-border-yellow1 border-4 rounded-full cursor-pointer"
                            onClick={() => {
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
        <section className="relative w-[80%] h-[80%] flex justify-center items-center border-8 color-border-sublight color-bg-main rounded-xl z-50 animation-modal ">
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
