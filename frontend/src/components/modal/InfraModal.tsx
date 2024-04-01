import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    warehouseLevelState,
    vehicleLevelState,
    brokerLevelState,
} from '../../util/myproduct-slice';

import { InfraList } from '../../type/types';
import { Client } from '@stomp/stompjs';

type InfraType = {
    setFacilityFlag: React.Dispatch<React.SetStateAction<boolean>>;
    updateNowMoney: (a: number) => void;
    infraInfo: InfraList;
    client: Client;
    webSocketId: string;
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

    useEffect(() => {
        // ESC 키를 눌렀을 때 실행할 함수
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                props.setFacilityFlag(false); // ESC 키가 눌리면 컴포넌트를 안 보이게 설정
            }
        };
        // 컴포넌트가 마운트될 때 keydown 이벤트 리스너 추가
        document.addEventListener('keydown', handleKeyDown);

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        //facility level upgrade후 redux 변화 반영
        if (facilityType === 1) {
            setNowLevel(vehicleLevel);
        } else if (facilityType === 2) {
            setNowLevel(warehouseLevel);
        } else if (facilityType === 3) {
            setNowLevel(brokerLevel);
        }
    }, [warehouseLevel, vehicleLevel, brokerLevel]);

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
            return nowLevel < props.infraInfo.vehicleInfoList.length - 1;
        } else if (facilityType === 2) {
            return nowLevel < props.infraInfo.warehouseInfoList.length - 1;
        } else if (facilityType === 3) {
            return nowLevel < props.infraInfo.brokerInfoList.length - 1;
        }
    };

    const upgradeFacility = () => {
        //이게 찐
        let typeMsg: string = '';
        if (facilityType === 1) {
            typeMsg = 'UPGRADE_VEHICLE';
        } else if (facilityType === 2) {
            typeMsg = 'UPGRADE_WAREHOUSE';
        } else if (facilityType === 3) {
            typeMsg = 'UPGRADE_BROKER';
        }

        //msg 만들기
        const sendMsg = JSON.stringify({
            type: typeMsg,
            body: {},
        });

        //publish
        if (props.client.connected) {
            props.client.publish({
                destination: `/app/private/${props.webSocketId}`,
                body: sendMsg,
            });
        }
    };

    const facilityElement = () => {
        if (facilityType === 0) {
            return (
                <>
                    <div className="w-full h-[20%] flex items-center justify-center text-[2vw]">
                        업그레이드 하고 싶은 항목을 클릭하세요.
                    </div>
                    <div className="relative w-full h-[80%] flex items-end justify-around pb-[1vw]">
                        <div
                            className="w-[33%] h-[80%] cursor-pointer flex flex-col justify-end"
                            onClick={() => {
                                changeFailityType(1);
                            }}
                        >
                            <p className="text-[2vw] relative top-[1vw]">
                                운송수단
                            </p>
                            <div
                                className="w-full h-[80%]"
                                style={{
                                    backgroundImage: `url(
                                        "/src/assets/images/facility/transport (${vehicleLevel}).webp"
                                    )`,
                                    backgroundSize: 'contain ',
                                    backgroundPositionX: 'center',
                                    backgroundPositionY: '100%',
                                    backgroundRepeat: 'no-repeat',
                                }}
                            ></div>
                        </div>
                        <div
                            className="w-[34%] h-[100%] cursor-pointer flex flex-col justify-end"
                            onClick={() => {
                                changeFailityType(2);
                            }}
                        >
                            <p className="text-[2vw] relative top-[1vw]">
                                창고
                            </p>
                            <div
                                className="w-full h-[80%]"
                                style={{
                                    backgroundImage: `url("/src/assets/images/facility/warehouse (${warehouseLevel}).webp")`,
                                    backgroundSize: 'contain ',
                                    backgroundPositionX: 'center',
                                    backgroundPositionY: '100%',
                                    backgroundRepeat: 'no-repeat',
                                }}
                            ></div>
                        </div>
                        <div
                            className="w-[33%] h-[100%] cursor-pointer flex flex-col justify-end"
                            onClick={() => {
                                changeFailityType(3);
                            }}
                        >
                            <p className="text-[2vw] relative top-[1vw]">
                                중개소
                            </p>
                            <div
                                className="w-full h-[80%]"
                                style={{
                                    backgroundImage: `url("/src/assets/images/facility/broker (${brokerLevel}).webp")`,
                                    backgroundSize: 'contain ',
                                    backgroundPositionX: 'center',
                                    backgroundPositionY: '100%',
                                    backgroundRepeat: 'no-repeat',
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
                        <div className="w-full h-[20%] text-[1.6vw] flex items-center justify-center">
                            {facilityType === 1
                                ? '운송수단 업그레이드'
                                : facilityType === 2
                                ? '창고 업그레이드'
                                : '중개소 업그레이드'}
                        </div>
                        <div className="relative w-[80%] h-[80%] flex items-end justify-around">
                            <div className="w-[33%] h-[85%] flex flex-col justify-end">
                                <p className="text-[1.4vw]">
                                    {facilityType === 1
                                        ? props.infraInfo.vehicleInfoList[
                                              vehicleLevel - 1
                                          ].vehicleName
                                        : facilityType === 2
                                        ? props.infraInfo.warehouseInfoList[
                                              warehouseLevel - 1
                                          ].warehouseName
                                        : props.infraInfo.brokerInfoList[
                                              brokerLevel - 1
                                          ].brokerName}
                                </p>
                                <p className="text-[1.4vw]">
                                    {facilityType === 1
                                        ? '탈 것 용량 : ' +
                                          props.infraInfo.vehicleInfoList[
                                              vehicleLevel - 1
                                          ].vehicleCapacity
                                        : facilityType === 2
                                        ? '창고 용량 : ' +
                                          props.infraInfo.warehouseInfoList[
                                              warehouseLevel - 1
                                          ].warehouseCapacity
                                        : '중개소 수수료 : ' +
                                          props.infraInfo.brokerInfoList[
                                              brokerLevel - 1
                                          ].brokerFeeRate +
                                          '%'}
                                </p>
                                <div
                                    className="w-full h-[80%]"
                                    style={{
                                        backgroundImage: `url("/src/assets/images/facility/${urlFacilityName} (${nowLevel}).webp")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPositionX: 'center',
                                        backgroundPositionY: '100%',
                                        backgroundSize: 'contain ',
                                    }}
                                ></div>
                            </div>
                            <div className="w-[34%] h-[50%] text-[2.4vw]">
                                다음단계
                            </div>
                            <div className="w-[33%] h-[85%] flex flex-col justify-end">
                                <p className="text-[1.4vw]">
                                    {facilityType === 1
                                        ? props.infraInfo.vehicleInfoList[
                                              vehicleLevel
                                          ].vehicleName
                                        : facilityType === 2
                                        ? props.infraInfo.warehouseInfoList[
                                              warehouseLevel
                                          ].warehouseName
                                        : props.infraInfo.brokerInfoList[
                                              brokerLevel
                                          ].brokerName}
                                </p>
                                <p className="text-[1.4vw]">
                                    {facilityType === 1
                                        ? '탈 것 용량 : ' +
                                          props.infraInfo.vehicleInfoList[
                                              vehicleLevel
                                          ].vehicleCapacity
                                        : facilityType === 2
                                        ? '창고 용량 : ' +
                                          props.infraInfo.warehouseInfoList[
                                              warehouseLevel
                                          ].warehouseCapacity
                                        : '중개소 수수료 : ' +
                                          props.infraInfo.brokerInfoList[
                                              brokerLevel
                                          ].brokerFeeRate +
                                          '%'}
                                </p>
                                <div
                                    className="w-full h-[80%]"
                                    style={{
                                        backgroundImage: `url("/src/assets/images/facility/${urlFacilityName} (${
                                            nowLevel + 1
                                        }).webp")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPositionX: 'center',
                                        backgroundPositionY: '100%',
                                        backgroundSize: 'contain ',
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div
                            className="absolute bottom-[2vw] flex flex-col items-center justify-center py-[0.6vw] px-[6vw] color-bg-yellow2 color-border-yellow1 border-[0.4vw] rounded-full cursor-pointer"
                            onClick={() => {
                                //업그레이드 명령 내리고 창 닫기
                                upgradeFacility();
                            }}
                        >
                            <p className="text-[1.6vw]">업그레이드</p>
                            <p className="text-[1.4vw] mt-[0.2vw]">
                                {facilityType === 1
                                    ? props.infraInfo.vehicleInfoList[
                                          vehicleLevel - 1
                                      ].vehicleUpgradeFee
                                    : facilityType === 2
                                    ? props.infraInfo.warehouseInfoList[
                                          warehouseLevel - 1
                                      ].warehouseUpgradeFee
                                    : props.infraInfo.brokerInfoList[
                                          brokerLevel - 1
                                      ].brokerUpgradeFee}
                            </p>
                        </div>
                        <div
                            className="absolute top-[1vw] left-[0.4vw] flex flex-col py-[0.8vw] px-[6vw] color-bg-yellow2 color-border-yellow1 border-[0.4vw] rounded-full cursor-pointer"
                            onClick={() => {
                                changeFailityType(0);
                            }}
                        >
                            <p className="text-[1.6vw]">뒤로</p>
                        </div>
                    </section>
                );
            } else {
                //레벨 최대
                return (
                    <section className="w-full h-full flex flex-col items-center justify-center ">
                        <div className="w-full h-[20%] text-[1.6vw] flex items-center justify-center">
                            {facilityType === 1
                                ? '운송수단 레벨이 최대치입니다.'
                                : facilityType === 2
                                ? '창고 레벨이 최대치입니다.'
                                : '중개소 레벨이 최대치입니다.'}
                        </div>
                        <div className="relative w-[80%] h-[80%] flex items-end justify-around">
                            <div className="w-[33%] h-[90%]">
                                <p className="text-[1.4vw]">
                                    {facilityType === 1
                                        ? props.infraInfo.vehicleInfoList[
                                              vehicleLevel - 1
                                          ].vehicleName
                                        : facilityType === 2
                                        ? props.infraInfo.warehouseInfoList[
                                              warehouseLevel - 1
                                          ].warehouseName
                                        : props.infraInfo.brokerInfoList[
                                              brokerLevel - 1
                                          ].brokerName}
                                </p>
                                <p className="text-[1.4vw]">
                                    {facilityType === 1
                                        ? '탈 것 용량 : ' +
                                          props.infraInfo.vehicleInfoList[
                                              vehicleLevel - 1
                                          ].vehicleCapacity
                                        : facilityType === 2
                                        ? '창고 용량 : ' +
                                          props.infraInfo.warehouseInfoList[
                                              warehouseLevel - 1
                                          ].warehouseCapacity
                                        : '중개소 수수료 : ' +
                                          props.infraInfo.brokerInfoList[
                                              brokerLevel - 1
                                          ].brokerFeeRate +
                                          '%'}
                                </p>
                                <div
                                    className="w-full h-[80%]"
                                    style={{
                                        backgroundImage: `url("/src/assets/images/facility/${urlFacilityName} (${nowLevel}).webp")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPositionX: 'center',
                                        backgroundPositionY: '100%',
                                        backgroundSize: 'contain ',
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div
                            className="absolute top-[1vw] left-[1vw] flex flex-col items-center justify-center py-[1vw] px-[8vw] color-bg-yellow2 color-border-yellow1 border-[0.4vw] rounded-full cursor-pointer"
                            onClick={() => {
                                //업그레이드 명령 내리고 창 닫기
                                changeFailityType(0);
                            }}
                        >
                            <p className="text-[1.6vw]">뒤로</p>
                        </div>
                        <div
                            className="absolute bottom-[1vw] right-[1vw] flex flex-col items-center justify-center py-[1vw] px-[8vw] color-bg-yellow2 color-border-yellow1 border-[0.4vw] rounded-full cursor-pointer"
                            onClick={() => {
                                changeFailityType(0);
                            }}
                        >
                            <p className="text-[1.6vw]">창닫기</p>
                        </div>
                    </section>
                );
            }
        }
    };
    return (
        <section className="relative w-[80%] h-[84%] flex justify-center items-center z-50 animation-modal ">
            <img
                src="/src/assets/images/layout/ui-board.webp"
                className="absolute w-full h-full -z-10"
                alt=""
            />
            <div
                className="relative w-[90%] h-[80%] rounded-[2vw]"
                style={{
                    backgroundImage:
                        'url(/src/assets/images/etc/facility-bg.webp)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {facilityElement()}
            </div>
            <div
                className="absolute text-[1.6vw] flex items-center justify-center text-white -top-[2vw] -right-[2vw] w-[4vw] h-[4vw] border-[0.3vw] color-border-sublight color-bg-orange1 rounded-full cursor-pointer"
                onClick={() => {
                    closeFacilityModal();
                }}
            >
                X
            </div>
        </section>
    );
}
