import { useEffect, useState } from 'react';
import { LineChart } from '../element/LineChart';
import finalreport from '../../dummy-data/report/final.json';
import { BarChart } from '../element/BarChart';
import { AchievementReport, privateProdRep } from '../../type/types';
import { HorizenBarChart } from '../element/HorizenBarChart';

type infoResultType = {
    setInfoResultFlag: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function InfoResultModal(props: infoResultType) {
    const [changeTitle, setChangeTitle] = useState<boolean>(false);

    //1페이지 수익 수출 관련
    const [priPurchaseFlag, setPriPurchaseFlag] = useState<boolean>(true);
    const [priSalseFlag, setPriSalseFlag] = useState<boolean>(true);
    const [priYearIncome, setPriYearIncome] = useState<number[]>([]);
    const [priYearOutcome, setPriYearOutcome] = useState<number[]>([]);
    const [priYearProfit, setPriYearProfit] = useState<number[]>([]);
    const [priTotalIncome, setPriTotalIncome] = useState<number>();
    const [priTotalOutcome, setPriTotalOutcome] = useState<number>();
    const [priTotalProfit, setPriTotalProfit] = useState<number>();
    // 작물별 거래량,금액
    const [priTotalProductInfo, setPriTotalProductInfo] = useState<
        privateProdRep[]
    >([]);
    // 수익
    const [priTotalProductIncome, setPriTotalProductIncome] = useState<
        number[]
    >([]);
    // 몇개를 팔았다
    const [priTotalProductSalseQuantity, setPriTotalProductSalseQuantity] =
        useState<number[]>([]);
    //수출
    const [priTotalProductOutcome, setPriTotalProductOutcome] = useState<
        number[]
    >([]);
    //몇개를 샀다
    const [
        priTotalProductPurchaseQuantity,
        setPriTotalProductPurchaseQuantity,
    ] = useState<number[]>([]);
    ////

    //// 시설 관련
    const [priWarehouseLevel, setPriWarehouseLevel] = useState<number>(1);
    const [priBrokerLevel, setPriBrokerLevel] = useState<number>(1);
    const [priVehicleLevel, setPriVehicleLevel] = useState<number>(1);
    //// 시설 관련

    //// 개인 정보
    const [priPlayTime, setPriPlayTime] = useState<number>();
    const [priAcievement, setPriAcievement] = useState<number[]>([]);
    //// 개인 정보
    const [priProductLabels, setPriProductLabels] = useState<string[]>([]);
    const [page, setPage] = useState<number>(0);
    let labels = [
        '1년차',
        '2년차',
        '3년차',
        '4년차',
        '5년차',
        '6년차',
        '7년차',
        '8년차',
        '9년차',
    ];
    useEffect(() => {
        const fetchPriTotalData = async () => {
            let totalIncome = 0;
            let totalOutcome = 0;
            let totalProfit = 0;

            ////// 시설관련
            setPriVehicleLevel(finalreport.vehicleLevel);
            setPriWarehouseLevel(finalreport.warehouseLevel);
            setPriBrokerLevel(finalreport.brokerLevel);
            setPriPlayTime(finalreport.privateAccPrivatePlayTime);
            setPriAcievement(finalreport.achievementList);
            // 연도별 작물 정보
            await finalreport.privateProductReportList.map((item) => {
                let incomeValue = 0;
                let outcomeValue = 0;
                let profit = 0;

                // 제품 map
                item.productList.map((data) => {
                    incomeValue += data.totalAccPrivateProductIncome;
                    outcomeValue += data.totalAccPrivateProductOutcome;
                    // console.log(data);
                    setPriTotalProductInfo((prevItems) => {
                        const itemIndex = prevItems.findIndex(
                            (item) => item.productId === data.productId
                        );
                        if (itemIndex !== -1) {
                            // 항목이 존재하면 업데이트
                            return prevItems.map((item) =>
                                item.productId === data.productId
                                    ? {
                                          ...item,
                                          totalAccPrivateProductPurchaseQuantity:
                                              item.totalAccPrivateProductPurchaseQuantity +
                                              data.totalAccPrivateProductPurchaseQuantity,
                                          totalAccPrivateProductIncome:
                                              item.totalAccPrivateProductIncome +
                                              data.totalAccPrivateProductIncome,
                                          totalAccPrivateProductOutcome:
                                              item.totalAccPrivateProductOutcome +
                                              data.totalAccPrivateProductOutcome,
                                          totalAccPrivateProductProfit:
                                              item.totalAccPrivateProductProfit +
                                              data.totalAccPrivateProductProfit,
                                          totalAccPrivateProductSalesQuantity:
                                              item.totalAccPrivateProductSalesQuantity +
                                              data.totalAccPrivateProductSalesQuantity,
                                          totalAccPrivateBrokerFee:
                                              item.totalAccPrivateBrokerFee +
                                              data.totalAccPrivateBrokerFee,
                                      }
                                    : item
                            );
                        } else {
                            // 항목이 존재하지 않으면 추가
                            return [...prevItems, data];
                        }
                    });
                });

                totalIncome += incomeValue;
                totalOutcome += outcomeValue;
                profit = incomeValue - outcomeValue;
                totalProfit += profit;
                setPriYearIncome((prev) => [...prev, incomeValue]);
                setPriYearOutcome((prev) => [...prev, outcomeValue]);
                setPriYearProfit((prev) => [...prev, profit]);
            });
            setPriTotalIncome(totalIncome);
            setPriTotalOutcome(totalOutcome);
            setPriTotalProfit(totalProfit);
        };
        fetchPriTotalData();
    }, []);
    labels = finalreport.privateProductReportList.map(
        (item) => item.year + '년차'
    );
    useEffect(() => {
        // 차트를 위해서 개당 작물에 대한 개수 정보 저장
        priTotalProductInfo.map((item, index) => {
            console.log(item);
            setPriTotalProductIncome((prev) => [
                ...prev,
                item.totalAccPrivateProductIncome,
            ]);
            setPriTotalProductOutcome((prev) => [
                ...prev,
                item.totalAccPrivateProductIncome,
            ]);
            setPriTotalProductPurchaseQuantity((prev) => [
                ...prev,
                item.totalAccPrivateProductOutcome,
            ]);
            setPriTotalProductSalseQuantity((prev) => [
                ...prev,
                item.totalAccPrivateProductSalesQuantity,
            ]);
            setPriProductLabels((prev) => [...prev, item.productId + '개']);
        });
    }, [priTotalProductInfo]);
    const priTotalData = {
        labels: labels,
        datasets: [
            {
                label: '수입',
                data: priYearIncome,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: '지출',
                data: priYearOutcome,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: '순수익',
                data: priYearProfit,
                borderColor: 'rgb(53, 235, 51)',
                backgroundColor: 'rgba(53, 235, 51, 0.5)',
            },
        ],
    };

    const priTotalProductIncomeData = {
        labels: priProductLabels,
        // priProductLabels,
        datasets: [
            {
                label: '판매금액',
                data: priTotalProductIncome,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };
    const priTotalProductOutcomeData = {
        labels: priProductLabels,
        // priProductLabels,
        datasets: [
            {
                label: '구매금액',
                data: priTotalProductOutcome,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };
    const priTotalProductPurchaseData = {
        labels: priProductLabels,
        // priProductLabels,
        datasets: [
            {
                label: '개수구매',
                data: priTotalProductPurchaseQuantity,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };
    const priTotalProductSalseData = {
        labels: priProductLabels,
        // priProductLabels,
        datasets: [
            {
                label: '개수판매',
                data: priTotalProductSalseQuantity,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    //// 시설 관련 ////
    const priInfraData = {
        labels: ['운송수단', '창고', '중개소'],
        // priProductLabels,
        datasets: [
            {
                label: '업그레이드',
                data: [priVehicleLevel, priWarehouseLevel, priBrokerLevel],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };
    //// 시설 관련 ////

    const changePage = (prop: number) => {
        setPage(prop);
    };

    const changePriPurchaseBtn = (prop: boolean) => {
        setPriPurchaseFlag(prop);
    };
    const changePriSalseBtn = (prop: boolean) => {
        setPriSalseFlag(prop);
    };

    const closeResultModal = () => {
        props.setInfoResultFlag(false);
    };

    const resultElement = () => {
        if (page === 0) {
            return (
                <>
                    <div className="w-full h-[25%] flex items-center justify-center">
                        <div className="w-[30%] h-full px-[2vw] flex flex-col justify-center items-center">
                            <p className="w-full text-start text-[2.4vw]">
                                전체 결산
                            </p>
                            <div className="w-full text-start text-[1.8vw] flex justify-start items-center">
                                <p>수입 및 지출 (1 / 2)</p>
                                <p
                                    className="border-[0.2vw] color-border-subbold mx-[1vw] px-[1vw] py-[0.2vw] cursor-pointer"
                                    onClick={() => {
                                        changePage(1);
                                    }}
                                >
                                    다음
                                </p>
                            </div>
                        </div>
                        <div className="w-[70%] h-full flex items-center px-[2vw]">
                            <div className="w-[30%] h-[60%] rounded-[0.8vw] border-[0.4vw] border-orange-300 flex flex-col items-center justify-center">
                                <p className="w-full h-[30%] text-[1.6vw] bg-orange-300 flex justify-center items-center text-white">
                                    총 수입
                                </p>
                                <p className="w-full bg-white h-[70%]  rounded-[0.8vw] text-[1.8vw] text-center flex items-center justify-center">
                                    {priTotalIncome?.toLocaleString()}
                                </p>
                            </div>
                            <div className="w-[5%]">
                                <p className="text-[2.4vw]">-</p>
                            </div>
                            <div className="w-[30%] h-[60%] rounded-[0.8vw] border-[0.4vw] border-orange-300 flex flex-col items-center justify-center">
                                <p className="w-full h-[30%] text-[1.6vw] bg-orange-300 flex justify-center items-center text-white">
                                    총 지출
                                </p>
                                <p className="w-full bg-white h-[70%]  rounded-[0.8vw] text-[1.8vw] text-center flex items-center justify-center">
                                    {priTotalOutcome?.toLocaleString()}
                                </p>
                            </div>
                            <div className="w-[5%]">
                                <p className="text-[2.4vw]">=</p>
                            </div>
                            <div className="w-[30%] h-[60%] rounded-[0.8vw] border-[0.4vw] border-orange-300 flex flex-col items-center justify-center">
                                <p className="w-full h-[30%] text-[1.6vw] bg-orange-300 flex justify-center items-center text-white">
                                    총 수입
                                </p>
                                <p className="w-full bg-white h-[70%]  rounded-[0.8vw] text-[1.8vw] text-center flex items-center justify-center">
                                    {priTotalProfit?.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[75%] flex items-center justify-center">
                        <div className="w-[55%] h-full flex items-center justify-center">
                            <LineChart data={priTotalData} />
                        </div>
                        <div className="w-[45%] h-full">
                            <div className="w-[90%] h-full flex flex-col justify-start items-center">
                                <div className="w-full h-[8%] flex justify-center items-center">
                                    <p className="w-1/4 text-center py-[0.6vw]"></p>
                                    <p className="w-1/4 text-center border-b-[0.2vw] color-border-subbold py-[0.6vw]">
                                        수익
                                    </p>
                                    <p className="w-1/4 text-center border-b-[0.2vw] color-border-subbold py-[0.6vw]">
                                        지출
                                    </p>
                                    <p className="w-1/4 text-center border-b-[0.2vw] color-border-subbold py-[0.6vw]">
                                        순수익
                                    </p>
                                </div>
                                {labels.map((item, index) => {
                                    return (
                                        <div className="w-full h-[8%] flex justify-center items-center">
                                            <p className="w-1/4 text-center py-[0.6vw]">
                                                {labels[index]}
                                            </p>
                                            <p className="w-1/4 text-center text-[1.2vw] border-b-[0.2vw] color-border-subbold py-[0.6vw]">
                                                {priYearIncome[
                                                    index
                                                ]?.toLocaleString()}
                                            </p>
                                            <p className="w-1/4 text-center text-[1.2vw] border-b-[0.2vw] color-border-subbold py-[0.6vw]">
                                                {priYearOutcome[
                                                    index
                                                ]?.toLocaleString()}
                                            </p>
                                            <p className="w-1/4 text-center text-[1.2vw] border-b-[0.2vw] color-border-subbold py-[0.6vw]">
                                                {priYearProfit[
                                                    index
                                                ]?.toLocaleString()}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </>
            );
        } else if (page === 1) {
            return (
                <>
                    <div className="w-full h-[25%] flex items-center justify-center">
                        <div className="w-[100%] h-full px-[2vw] flex flex-col justify-center items-center">
                            <p className="w-full text-start text-[2.4vw]">
                                전체 결산
                            </p>
                            <div className="w-full text-start text-[1.8vw] flex justify-between items-center">
                                <div className="flex justify-center items-center">
                                    <p>수입 및 지출 (2 / 2)</p>
                                    <p
                                        className="border-[0.2vw] color-border-subbold mx-[1vw] px-[1vw] py-[0.2vw] cursor-pointer"
                                        onClick={() => {
                                            changePage(0);
                                        }}
                                    >
                                        이전
                                    </p>
                                    <p
                                        className="border-[0.2vw] color-border-subbold mx-[1vw] px-[1vw] py-[0.2vw] cursor-pointer"
                                        onClick={() => {
                                            changePage(2);
                                        }}
                                    >
                                        다음
                                    </p>
                                </div>
                                <div>3년차</div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[75%] flex items-center justify-center">
                        <div className="w-[30%] h-full flex items-center justify-center bg-slate-400">
                            <div className="relative w-[90%] h-[90%] text-[2vw] p-[1vw] bg-white flex flex-col justify-between items-center border-[0.2vw] color-border-subbold rounded-[1vw]">
                                <p className="w-full text-start">
                                    구매 작물 TOP4
                                </p>
                                {priPurchaseFlag ? (
                                    <BarChart
                                        data={priTotalProductPurchaseData}
                                    />
                                ) : (
                                    <BarChart
                                        data={priTotalProductOutcomeData}
                                    />
                                )}
                                <div className="absolute top-[1vw] right-[1vw]">
                                    <p
                                        className="text-[1.2vw] p-[0.6vw] border-[0.2vw] color-border-subbold rounded-[1vw] cursor-pointer "
                                        onClick={() => {
                                            changePriPurchaseBtn(true);
                                        }}
                                        style={
                                            priPurchaseFlag
                                                ? {
                                                      backgroundColor:
                                                          '#7e5a39',
                                                      color: 'white',
                                                  }
                                                : {}
                                        }
                                    >
                                        구매금액
                                    </p>
                                    <p
                                        className="text-[1.2vw] p-[0.6vw] my-[0.4vw] border-[0.2vw] color-border-subbold rounded-[1vw] cursor-pointer "
                                        onClick={() => {
                                            changePriPurchaseBtn(false);
                                        }}
                                        style={
                                            !priPurchaseFlag
                                                ? {
                                                      backgroundColor:
                                                          '#7e5a39',
                                                      color: 'white',
                                                  }
                                                : {}
                                        }
                                    >
                                        구매량
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="w-[30%] h-full flex items-center justify-center">
                            <div className="relative w-[90%] h-[90%] text-[2vw] p-[1vw] bg-white flex flex-col justify-between items-center border-[0.2vw] color-border-subbold rounded-[1vw]">
                                <p className="w-full text-start">
                                    구매 작물 TOP4
                                </p>
                                {priSalseFlag ? (
                                    <BarChart data={priTotalProductSalseData} />
                                ) : (
                                    <BarChart
                                        data={priTotalProductIncomeData}
                                    />
                                )}
                                <div className="absolute top-[1vw] right-[1vw]">
                                    <p
                                        className="text-[1.2vw] p-[0.6vw] border-[0.2vw] color-border-subbold rounded-[1vw] cursor-pointer "
                                        onClick={() => {
                                            changePriSalseBtn(true);
                                        }}
                                        style={
                                            priSalseFlag
                                                ? {
                                                      backgroundColor:
                                                          '#7e5a39',
                                                      color: 'white',
                                                  }
                                                : {}
                                        }
                                    >
                                        판매금액
                                    </p>
                                    <p
                                        className="text-[1.2vw] p-[0.6vw] my-[0.4vw] border-[0.2vw] color-border-subbold rounded-[1vw] cursor-pointer "
                                        onClick={() => {
                                            changePriSalseBtn(false);
                                        }}
                                        style={
                                            !priSalseFlag
                                                ? {
                                                      backgroundColor:
                                                          '#7e5a39',
                                                      color: 'white',
                                                  }
                                                : {}
                                        }
                                    >
                                        판매량
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="w-[30%] hull flex flex-col items-center justify-center">
                            <LineChart data={priTotalData} />
                            <HorizenBarChart data={priInfraData} />
                        </div>
                    </div>
                </>
            );
        } else if (page === 2) {
            return (
                <>
                    <div className="w-full h-[25%] flex items-center justify-center">
                        <div className="w-[35%] h-full px-[2vw] flex flex-col justify-center items-center">
                            <p className="w-full text-start text-[2.4vw]">
                                전체 결산
                            </p>
                            <div className="w-full text-start text-[1.8vw] flex justify-start items-center">
                                <p>게임 통계 (1 / 2)</p>
                                <p
                                    className="border-[0.2vw] color-border-subbold mx-[1vw] px-[1vw] py-[0.2vw] cursor-pointer"
                                    onClick={() => {
                                        changePage(1);
                                    }}
                                >
                                    이전
                                </p>
                                <p
                                    className="border-[0.2vw] color-border-subbold mx-[1vw] px-[1vw] py-[0.2vw] cursor-pointer"
                                    onClick={() => {
                                        changePage(3);
                                    }}
                                >
                                    다음
                                </p>
                            </div>
                        </div>
                        <div className="w-[65%] h-full flex items-center px-[2vw]">
                            <div className="w-[30%] h-[60%] rounded-[0.8vw] border-[0.4vw] border-orange-300 flex flex-col items-center justify-center">
                                <p className="w-full h-[30%] text-[1.6vw] bg-orange-300 flex justify-center items-center text-white">
                                    플레이 시간
                                </p>
                                <p className="w-full bg-white h-[70%]  rounded-[0.8vw] text-[1.8vw] text-center flex items-center justify-center">
                                    {priPlayTime}
                                </p>
                            </div>
                            <div className="w-[5%]"></div>
                            <div className="w-[30%] h-[60%] rounded-[0.8vw] border-[0.4vw] border-orange-300 flex flex-col items-center justify-center">
                                <p className="w-full h-[30%] text-[1.6vw] bg-orange-300 flex justify-center items-center text-white">
                                    획득 도전과제
                                </p>
                                <p className="w-full bg-white h-[70%]  rounded-[0.8vw] text-[1.8vw] text-center flex items-center justify-center">
                                    {priAcievement.length}
                                </p>
                            </div>
                            <div className="w-[5%]"></div>
                            <div className="w-[30%] h-[60%] rounded-[0.8vw] border-[0.4vw] border-orange-300 flex flex-col items-center justify-center">
                                <p className="w-full h-[30%] text-[1.6vw] bg-orange-300 flex justify-center items-center text-white">
                                    거래 작물 수
                                </p>
                                <p className="w-full bg-white h-[70%]  rounded-[0.8vw] text-[1.8vw] text-center flex items-center justify-center">
                                    {priTotalProfit?.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[75%] flex items-center justify-center">
                        <div className="w-[60%] h-full flex items-center justify-center bg-slate-400">
                            <div className="relative w-[90%] h-[90%] text-[2vw] p-[1vw] bg-white flex flex-col justify-between items-center border-[0.2vw] color-border-subbold rounded-[1vw]">
                                <p className="w-full text-start">
                                    구매 작물 TOP4
                                </p>
                                {priPurchaseFlag ? (
                                    <BarChart
                                        data={priTotalProductPurchaseData}
                                    />
                                ) : (
                                    <BarChart
                                        data={priTotalProductOutcomeData}
                                    />
                                )}
                                <div className="absolute top-[1vw] right-[1vw]">
                                    <p
                                        className="text-[1.2vw] p-[0.6vw] border-[0.2vw] color-border-subbold rounded-[1vw] cursor-pointer "
                                        onClick={() => {
                                            changePriPurchaseBtn(true);
                                        }}
                                        style={
                                            priPurchaseFlag
                                                ? {
                                                      backgroundColor:
                                                          '#7e5a39',
                                                      color: 'white',
                                                  }
                                                : {}
                                        }
                                    >
                                        구매금액
                                    </p>
                                    <p
                                        className="text-[1.2vw] p-[0.6vw] my-[0.4vw] border-[0.2vw] color-border-subbold rounded-[1vw] cursor-pointer "
                                        onClick={() => {
                                            changePriPurchaseBtn(false);
                                        }}
                                        style={
                                            !priPurchaseFlag
                                                ? {
                                                      backgroundColor:
                                                          '#7e5a39',
                                                      color: 'white',
                                                  }
                                                : {}
                                        }
                                    >
                                        구매량
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="w-[30%] hull flex flex-col items-center justify-center">
                            <LineChart data={priTotalData} />
                            <HorizenBarChart data={priInfraData} />
                        </div>
                    </div>
                </>
            );
        }
    };
    return (
        <div className="absolute w-[98%] h-[95%] flex flex-col items-center justify-center color-text-textcolor border-[0.4vw] rounded-[1vw] color-border-brown1 bg-white z-50 animation-modal ">
            {resultElement()}
            <div
                className="absolute text-3xl flex items-center justify-center text-white -top-8 -right-8 w-16 h-16 border-[6px] color-border-sublight color-bg-orange1 rounded-full cursor-pointer"
                onClick={() => {
                    closeResultModal();
                }}
            >
                X
            </div>
        </div>
    );
}
