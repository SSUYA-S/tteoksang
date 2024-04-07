import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { InfraList } from '../../type/types';
import { Client } from '@stomp/stompjs';

type InfraType = {
    setFacilityFlag: React.Dispatch<React.SetStateAction<boolean>>;
    updateNowMoney: (a: number) => void;
    infraInfo: InfraList;
    client: Client;
    webSocketId: string;
    nowMoney: number;
    alertError: (a: string) => void;
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
            if (
                props.nowMoney <
                props.infraInfo.vehicleInfoList[vehicleLevel - 1]
                    .vehicleUpgradeFee
            ) {
                props.alertError('금액이 부족합니다.');
                return;
            }
            typeMsg = 'UPGRADE_VEHICLE';
        } else if (facilityType === 2) {
            if (
                props.nowMoney <
                props.infraInfo.warehouseInfoList[warehouseLevel - 1]
                    .warehouseUpgradeFee
            ) {
                props.alertError('금액이 부족합니다.');
                return;
            }
            typeMsg = 'UPGRADE_WAREHOUSE';
        } else if (facilityType === 3) {
            if (
                props.infraInfo.brokerInfoList[brokerLevel - 1].brokerUpgradeFee
            ) {
                props.alertError('금액이 부족합니다.');
                return;
            }
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
                    <div className="w-[70%] h-[20%] mx-auto mt-[1vw] flex items-center justify-center text-[1.6vw] color-text-textcolor">
                        <img
                            className="w-[70%]"
                            src="/src/assets/images/facility/text-upgrade-select.webp"
                            alt=""
                        />
                    </div>
                    <div className="relative w-full h-[80%] flex items-end justify-around pb-[1vw]">
                        <div
                            className="relative w-[33%] h-[100%] cursor-pointer flex flex-col justify-end items-center"
                            onClick={() => {
                                changeFailityType(1);
                            }}
                        >
                            <p className="absolute w-[60%] mx-auto text-[1.4vw] bottom-[0.5vw] bg-white rounded-[0.6vw] border-[0.2vw] py-[0.2vw] color-border-subbold color-text-textcolor hover:color-bg-subbold hover:text-white btn-animation">
                                운송수단
                            </p>
                            <div
                                className="relative bottom-[4vw] w-full h-[80%]"
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
                            className="relative w-[34%] h-[100%] cursor-pointer flex flex-col justify-end items-center"
                            onClick={() => {
                                changeFailityType(2);
                            }}
                        >
                            <p className="absolute w-[60%] mx-auto text-[1.4vw] bottom-[0.5vw] bg-white rounded-[0.6vw] border-[0.2vw] py-[0.2vw] color-border-subbold color-text-textcolor hover:color-bg-subbold hover:text-white btn-animation">
                                창고
                            </p>
                            <div
                                className="relative bottom-[4vw] w-full h-[80%]"
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
                            className="relative w-[33%] h-[100%] cursor-pointer flex flex-col justify-end items-center"
                            onClick={() => {
                                changeFailityType(3);
                            }}
                        >
                            <p className="absolute w-[60%] mx-auto text-[1.4vw] bottom-[0.5vw] bg-white rounded-[0.6vw] border-[0.2vw] py-[0.2vw] color-border-subbold color-text-textcolor hover:color-bg-subbold hover:text-white btn-animation">
                                중개소
                            </p>
                            <div
                                className="relative bottom-[4vw] w-full h-[80%]"
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
                        <div className="w-[40%] h-[20%] mt-[1vw] flex items-center justify-center  text-[1.6vw] rounded-[1vw] color-text-textcolor">
                            {facilityType === 1 ? (
                                <img
                                    className="w-[70%]"
                                    src="/src/assets/images/facility/text-upgrade-transport.webp"
                                    alt=""
                                />
                            ) : facilityType === 2 ? (
                                <img
                                    className="w-[55%]"
                                    src="/src/assets/images/facility/text-upgrade-warehouse.webp"
                                    alt=""
                                />
                            ) : (
                                <img
                                    className="w-[60%]"
                                    src="/src/assets/images/facility/text-upgrade-broker.webp"
                                    alt=""
                                />
                            )}
                        </div>
                        <div className="relative w-[80%] h-[80%] flex items-end justify-around">
                            <div className="relative w-[33%] h-[85%] flex flex-col justify-end ">
                                <div className="absolute w-full top-[-2vw] rounded-[0.6vw] bg-white bg-opacity-70 z-10">
                                    <p className="text-[1.6vw]">
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
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="text-[1.6vw]">
                                            {facilityType === 1 ? (
                                                <div>
                                                    <p className="text-[1.2vw]">
                                                        일일 구매 한도 :
                                                    </p>
                                                    <p className="text-[2.2vw]">
                                                        {
                                                            props.infraInfo
                                                                .vehicleInfoList[
                                                                vehicleLevel - 1
                                                            ].vehicleCapacity
                                                        }
                                                    </p>
                                                </div>
                                            ) : facilityType === 2 ? (
                                                <div>
                                                    <p className="text-[1.2vw]">
                                                        창고 용량 :
                                                    </p>
                                                    <p className="text-[2.2vw]">
                                                        {
                                                            props.infraInfo
                                                                .warehouseInfoList[
                                                                warehouseLevel -
                                                                    1
                                                            ].warehouseCapacity
                                                        }
                                                    </p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="text-[1.2vw]">
                                                        중개소 수수료 :
                                                    </p>
                                                    <p className="text-[2.2vw]">
                                                        {props.infraInfo
                                                            .brokerInfoList[
                                                            brokerLevel - 1
                                                        ].brokerFeeRate + '%'}
                                                    </p>
                                                </div>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="relative w-full h-[80%] bottom-[2vw]"
                                    style={{
                                        backgroundImage: `url("/src/assets/images/facility/${urlFacilityName} (${nowLevel}).webp")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPositionX: 'center',
                                        backgroundPositionY: '100%',
                                        backgroundSize: 'contain ',
                                    }}
                                ></div>
                            </div>
                            <div className="w-[34%] h-[60%] text-[2.4vw] flex flex-col items-center">
                                <img
                                    className="w-[50%]"
                                    src="/src/assets/images/facility/text-next-level.webp"
                                    alt=""
                                />
                            </div>
                            <div className="relative w-[33%] h-[85%] flex flex-col justify-end">
                                <div className="absolute w-full top-[-2vw] rounded-[0.6vw] bg-white bg-opacity-70 z-10">
                                    <p className="text-[1.6vw]">
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
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="text-[1.6vw]">
                                            {facilityType === 1 ? (
                                                <div>
                                                    <p className="text-[1.2vw]">
                                                        일일 구매 한도 :
                                                    </p>
                                                    <p className="text-[2.2vw]">
                                                        {
                                                            props.infraInfo
                                                                .vehicleInfoList[
                                                                vehicleLevel
                                                            ].vehicleCapacity
                                                        }
                                                    </p>
                                                </div>
                                            ) : facilityType === 2 ? (
                                                <div>
                                                    <p className="text-[1.2vw]">
                                                        창고 용량 :
                                                    </p>
                                                    <p className="text-[2.2vw]">
                                                        {
                                                            props.infraInfo
                                                                .warehouseInfoList[
                                                                warehouseLevel
                                                            ].warehouseCapacity
                                                        }
                                                    </p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="text-[1.2vw]">
                                                        중개소 수수료 :
                                                    </p>
                                                    <p className="text-[2.2vw]">
                                                        {props.infraInfo
                                                            .brokerInfoList[
                                                            brokerLevel
                                                        ].brokerFeeRate + '%'}
                                                    </p>
                                                </div>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="relative w-full h-[80%] bottom-[2vw]"
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
                            className="absolute bottom-[2vw] flex flex-col items-center justify-center py-[0.4vw] px-[4vw] bg-white rounded-[1.4vw] border-[0.3vw] color-border-subbold text-black hover:color-bg-subbold hover:text-white cursor-pointer btn-animation"
                            onClick={() => {
                                //업그레이드 명령 내리고 창 닫기
                                upgradeFacility();
                            }}
                        >
                            <p className="text-[1.6vw] ">업그레이드</p>
                            <p className="text-[1.4vw] mt-[0.2vw]">
                                {facilityType === 1
                                    ? props.infraInfo.vehicleInfoList[
                                          vehicleLevel - 1
                                      ].vehicleUpgradeFee.toLocaleString() +
                                      ' (G)'
                                    : facilityType === 2
                                    ? props.infraInfo.warehouseInfoList[
                                          warehouseLevel - 1
                                      ].warehouseUpgradeFee.toLocaleString() +
                                      ' (G)'
                                    : props.infraInfo.brokerInfoList[
                                          brokerLevel - 1
                                      ].brokerUpgradeFee.toLocaleString() +
                                      ' (G)'}
                            </p>
                        </div>
                        <div
                            className="absolute top-[1vw] left-[0.4vw] flex flex-col py-[0.4vw] px-[4vw] bg-white rounded-[0.6vw] border-[0.2vw] color-border-subbold color-text-textcolor hover:color-bg-subbold hover:text-white cursor-pointer btn-animation"
                            onClick={() => {
                                changeFailityType(0);
                            }}
                        >
                            <p className="text-[1.6vw] hover:text-white">
                                뒤로
                            </p>
                        </div>
                    </section>
                );
            } else {
                //레벨 최대
                return (
                    <section className="w-full h-full flex flex-col items-center justify-center ">
                        <div className="w-[50%] mt-[1vw] h-[20%] text-[1.6vw] flex items-center justify-center color-text-textcolor">
                            {facilityType === 1 ? (
                                <img
                                    className="w-[80%]"
                                    src="/src/assets/images/facility/text-max-transport.webp"
                                    alt=""
                                />
                            ) : facilityType === 2 ? (
                                <img
                                    className="w-[65%]"
                                    src="/src/assets/images/facility/text-max-warehouse.webp"
                                    alt=""
                                />
                            ) : (
                                <img
                                    className="w-[70%]"
                                    src="/src/assets/images/facility/text-max-broker.webp"
                                    alt=""
                                />
                            )}
                        </div>
                        <div className="relative w-[80%] h-[80%] flex items-end justify-around">
                            <div className="relative w-[33%] h-[90%]">
                                <div className="absolute w-full bottom-[0vw] bg-white rounded-[0.6vw] border-[0.2vw] color-border-subbold">
                                    <p className="text-[1.4vw] color-text-textcolor ">
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
                                    <p className="text-[1.4vw] color-text-textcolor ">
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
                                </div>

                                <div
                                    className="relative w-full h-[80%] bottom-[0.2vw] "
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
                            className="absolute top-[1vw] left-[1vw] flex flex-col items-center justify-center py-[0.4vw] px-[4vw] bg-white rounded-[0.6vw] border-[0.2vw] color-border-subbold color-text-textcolor hover:color-bg-subbold hover:text-white cursor-pointer btn-animation"
                            onClick={() => {
                                //업그레이드 명령 내리고 창 닫기
                                changeFailityType(0);
                            }}
                        >
                            <p className="text-[1.6vw] hover:text-white">
                                뒤로
                            </p>
                        </div>
                        <div
                            className="absolute bottom-[1vw] right-[1vw] flex flex-col items-center justify-center py-[0.4vw] px-[4vw]  bg-white rounded-[0.6vw] border-[0.2vw] color-border-subbold color-text-textcolor hover:color-bg-subbold hover:text-white cursor-pointer btn-animation"
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
        <>
          <div
              className="w-full h-full absolute top-0 left-0 z-40 opacity-0"
              onClick={closeFacilityModal}
          ></div>
          <section
              className="relative w-[80%] h-[84%] flex justify-center items-center z-50 animation-modal ">
            <img
                src="/src/assets/images/etc/facility-bg.webp"
                className="absolute w-full h-full -z-10 object-contain"
                alt=""
            />

            <div className="relative w-[90%] h-[80%] rounded-[2vw]">
              {facilityElement()}
            </div>
            <div
                className="absolute flex items-center justify-center top-[-1vw] right-[-1vw] w-[6vw] h-[6vw] cursor-pointer btn-animation"
                onClick={() => {
                  closeFacilityModal();
                }}
            >
              <img
                  src="/src/assets/images/layout/ui-icon-closebtn.webp"
                  alt=""
              />
            </div>
          </section>
        </>
    );
}
