import { useState } from 'react';

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
        } else if (
            facilityType === 1 ||
            facilityType === 2 ||
            facilityType === 3
        ) {
            return (
                <section className="w-full h-full flex flex-col items-center justify-center ">
                    <div className="w-full h-[20%] text-4xl">
                        운송수단 업그레이드
                    </div>
                    <div className="relative w-[80%] h-[80%] flex items-end justify-around">
                        <div className="w-[33%] h-[50%]">
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
                        <div className="w-[34%] h-[50%] text-5xl">다음단계</div>
                        <div className="w-[33%] h-[50%]">
                            <p className="text-3xl">강한 트럭</p>
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
                        onClick={() => changeFailityType(0)}
                    >
                        <p className="text-4xl">업그레이드</p>
                        <p className="text-3xl mt-2">1000 G</p>
                    </div>
                </section>
            );
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
