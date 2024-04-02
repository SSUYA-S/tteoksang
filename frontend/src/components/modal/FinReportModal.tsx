import { BaseSyntheticEvent, ChangeEvent, useEffect, useState } from 'react';
import { LineChart } from '../element/LineChart';
import { BarChart } from '../element/BarChart';
import {
    Achievement,
    AchievementReport,
    AnnualSpecialEvent,
    FinalReportType,
    Product,
    ProductValue,
    Top4ProductValue,
    privateProdRep,
    privateYearProdRep,
    publicProdRep,
} from '../../type/types';
import { HorizenBarChart } from '../element/HorizenBarChart';

//dummuy data
import RankingCard from '../section/RankingCard';
import { loadProduct } from '../../util/loadProduct';
import AchievementCard from '../section/AchievementCard';

type infoResultType = {
    setIsFinReportAvail: React.Dispatch<React.SetStateAction<boolean>>;
    productList: Product[];
    finReport: FinalReportType | null;
    achievementInfo: Achievement[];
};
export default function FinReportModal({
    setIsFinReportAvail,
    productList,
    finReport,
    achievementInfo,
}: infoResultType) {
    const [changeTitle, setChangeTitle] = useState<boolean>(false);

    //1페이지 수익 수출 관련
    const [priPurchaseFlag, setPriPurchaseFlag] = useState<boolean>(true);
    const [pubPurchaseMode, setPubPurchaseMode] = useState<number>(0);
    const [priSalseFlag, setPriSalseFlag] = useState<boolean>(true);
    const [priYearIncome, setPriYearIncome] = useState<number[]>([]);
    const [priYearOutcome, setPriYearOutcome] = useState<number[]>([]);
    const [priYearProfit, setPriYearProfit] = useState<number[]>([]);
    const [priTotalIncome, setPriTotalIncome] = useState<number>();
    const [priTotalOutcome, setPriTotalOutcome] = useState<number>();
    const [priTotalProfit, setPriTotalProfit] = useState<number>();

    // 년도별 정보
    const [yearProductSelected, setYearProductSelected] = useState<number>(0);

    // 작물별 총 거래량 (년마다)
    const [priYearProductInfo, setPriYearProductInfo] = useState<
        privateYearProdRep[]
    >([]);
    // 작물별 총 거래량,금액
    const [priTotalProductInfo, setPriTotalProductInfo] = useState<
        privateProdRep[]
    >([]);
    const [pubTotalProductInfo, setPubTotalProductInfo] = useState<
        publicProdRep[]
    >([]);

    const [top4IncomeProduct, setTop4IncomeProduct] = useState<
        Top4ProductValue[]
    >([]);
    const [top4OutcomeProduct, setTop4OutcomeProduct] = useState<
        Top4ProductValue[]
    >([]);
    const [top4QuantityProduct, setTop4QuantityProduct] = useState<
        Top4ProductValue[]
    >([]);
    // 수익
    const [priTotalProductIncome, setPriTotalProductIncome] = useState<
        number[]
    >([]);

    //수출
    const [priTotalProductOutcome, setPriTotalProductOutcome] = useState<
        number[]
    >([]);
    //스페셜 이벤트 누적 발생 횟수
    const [annualSpecialEvent, setAnnualSpecialEvent] = useState<
        AnnualSpecialEvent[]
    >([]);

    //몇개를 샀다
    const [
        priTotalProductPurchaseQuantity,
        setPriTotalProductPurchaseQuantity,
    ] = useState<number[]>([]);
    //// 연도별 개인 작물 차트값
    const [priProductIncomeChartValue, setPriProductIncomeChartValue] =
        useState<number[]>([]);
    const [priProductOutcomeChartValue, setPriProductOutcomeChartValue] =
        useState<number[]>([]);
    const [priProductQuantityChartValue, setPriProductQuantityChartValue] =
        useState<number[]>([]);
    //// 전체 서버 작물 통계
    const [pubProductIncomeChartValue, setPubProductIncomeChartValue] =
        useState<number[]>([]);
    const [pubProductOutcomeChartValue, setPubProductOutcomeChartValue] =
        useState<number[]>([]);
    const [pubProductQuantityChartValue, setPubProductQuantityChartValue] =
        useState<number[]>([]);

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
    //// 연도별 개인 작물 라벨
    const [priProductIncomeLabels, setPriProductIncomeLabels] = useState<
        string[]
    >([]);
    const [priProductOutcomeLabels, setPriProductOutcomeLabels] = useState<
        string[]
    >([]);
    const [priProductQuantityLabels, setPriProductQuantityLabels] = useState<
        string[]
    >([]);
    //// 전체 서버 작물 라벨
    const [pubProductIncomeLabels, setPubProductIncomeLabels] = useState<
        string[]
    >([]);
    const [pubProductOutcomeLabels, setPubProductOutcomeLabels] = useState<
        string[]
    >([]);
    const [pubProductQuantityLabels, setPubProductQuantityLabels] = useState<
        string[]
    >([]);
    //// 스페셜 이벤트 라벨, 차트값
    const [anuSpecialEventChartValue, setAnuSpecialEventChartValue] = useState<
        number[]
    >([]);
    const [anuSpecialEventLabels, setAnuSpecialEventLabels] = useState<
        string[]
    >([]);
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
        console.log(finReport);
        const fetchPriTotalData = async () => {
            let totalIncome = 0;
            let totalOutcome = 0;
            let totalProfit = 0;

            ////// 시설관련
            setPriVehicleLevel(finReport!.vehicleLevel);
            setPriWarehouseLevel(finReport!.warehouseLevel);
            setPriBrokerLevel(finReport!.brokerLevel);
            setPriPlayTime(finReport!.privateAccPrivatePlayTime);
            setPriAcievement(finReport!.achievementList);
            setAnnualSpecialEvent(finReport!.specialEventReportList);
            // 연도별 작물 정보
            await finReport!.privateProductReportList.map((item) => {
                let incomeValue = 0;
                let outcomeValue = 0;
                let profit = 0;
                // 제품 map
                //여기서 item은 1년 2년 3년을 나타냄. item.year로 확인 가능.
                let yearProductList: privateYearProdRep = {
                    year: 0,
                    totalYearProduct: [],
                };

                //판매이익 Top4 뽑기
                const sortedByOutcome: ProductValue[] = item.productList
                    .sort(
                        (a, b) =>
                            a.totalAccPrivateProductOutcome -
                            b.totalAccPrivateProductOutcome
                    )
                    .slice(0, 4)
                    .map((pd) => ({
                        productId: pd.productId,
                        productValue: pd.totalAccPrivateProductOutcome,
                    }));
                setTop4OutcomeProduct((prev) => [
                    ...prev,
                    { year: item.year, totalProduct: sortedByOutcome },
                ]);
                //구매이익 Top4 뽑기
                const sortedByIncome: ProductValue[] = item.productList
                    .sort(
                        (a, b) =>
                            a.totalAccPrivateProductIncome -
                            b.totalAccPrivateProductIncome
                    )
                    .slice(0, 4)
                    .map((pd) => ({
                        productId: pd.productId,
                        productValue: pd.totalAccPrivateProductIncome,
                    }));
                setTop4IncomeProduct((prev) => [
                    ...prev,
                    { year: item.year, totalProduct: sortedByIncome },
                ]);
                //판매량 Top4 뽑기
                const sortedByQuantity: ProductValue[] = item.productList
                    .sort(
                        (a, b) =>
                            a.totalAccPrivateProductPurchaseQuantity -
                            b.totalAccPrivateProductPurchaseQuantity
                    )
                    .slice(0, 4)
                    .map((pd) => ({
                        productId: pd.productId,
                        productValue: pd.totalAccPrivateProductPurchaseQuantity,
                    }));
                setTop4QuantityProduct((prev) => [
                    ...prev,
                    { year: item.year, totalProduct: sortedByQuantity },
                ]);

                item.productList.map((data) => {
                    incomeValue += data.totalAccPrivateProductIncome;
                    outcomeValue += data.totalAccPrivateProductOutcome;
                    yearProductList.year = item.year;

                    console.log('결산데이터');

                    //연도별 개인 작물 전체년 통계
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

                setPriYearProductInfo((prev) => {
                    const isYearExist = prev.some(
                        (data) => data.year === item.year
                    );
                    if (!isYearExist) {
                        return [...prev, yearProductList];
                    }
                    return prev;
                });

                totalIncome += incomeValue;
                totalOutcome += outcomeValue;
                profit = incomeValue - outcomeValue;
                totalProfit += profit;
                setPriYearIncome((prev) => [...prev, incomeValue]);
                setPriYearOutcome((prev) => [...prev, outcomeValue]);
                setPriYearProfit((prev) => [...prev, profit]);
            });

            // 서버 전체 작물 통계
            await finReport!.publicProductReportList.map((item) => {
                item.productList.map((data) => {
                    console.log('결산데이터');

                    //연도별 개인 작물 전체년 통계
                    setPubTotalProductInfo((prevItems) => {
                        const itemIndex = prevItems.findIndex(
                            (item) => item.productId === data.productId
                        );
                        if (itemIndex !== -1) {
                            // 항목이 존재하면 업데이트
                            return prevItems.map((item) =>
                                item.productId === data.productId
                                    ? {
                                          ...item,
                                          totalAccProductPurchaseQuantity:
                                              item.totalAccProductPurchaseQuantity +
                                              data.totalAccProductPurchaseQuantity,
                                          totalAccProductIncome:
                                              item.totalAccProductIncome +
                                              data.totalAccProductIncome,
                                          totalAccProductOutcome:
                                              item.totalAccProductOutcome +
                                              data.totalAccProductOutcome,
                                          totalAccProductProfit:
                                              item.totalAccProductProfit +
                                              data.totalAccProductProfit,
                                          totalAccProductSalesQuantity:
                                              item.totalAccProductSalesQuantity +
                                              data.totalAccProductSalesQuantity,
                                          totalAccBrokerFee:
                                              item.totalAccBrokerFee +
                                              data.totalAccBrokerFee,
                                      }
                                    : item
                            );
                        } else {
                            // 항목이 존재하지 않으면 추가
                            return [...prevItems, data];
                        }
                    });
                });
            });
            setPriTotalIncome(totalIncome);
            setPriTotalOutcome(totalOutcome);
            setPriTotalProfit(totalProfit);
        };
        fetchPriTotalData();
    }, []);
    labels = finReport!.privateProductReportList.map(
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
            setPriProductLabels((prev) => [...prev, item.productId + '개']);
        });
    }, [priTotalProductInfo]);

    useEffect(() => {
        console.log('연간 구매 개수');
        console.log(priYearProductInfo);
    }, [priYearProductInfo]);

    // 연차별 개인 통계 정보
    useEffect(() => {
        let incomeLabel: string[] = [];
        let incomeValue: number[] = [];
        let outcomeLabel: string[] = [];
        let outcomeValue: number[] = [];
        let quantityLabel: string[] = [];
        let quantityValue: number[] = [];
        console.log(priTotalProductInfo);
        // 전체 작물 통계 정보
        if (yearProductSelected == 0) {
            //판매이익 Top4 뽑기
            const sortedByOutcome: ProductValue[] = priTotalProductInfo
                .sort(
                    (a, b) =>
                        a.totalAccPrivateProductOutcome -
                        b.totalAccPrivateProductOutcome
                )
                .slice(0, 4)
                .map((pd) => ({
                    productId: pd.productId,
                    productValue: pd.totalAccPrivateProductOutcome,
                }));

            //구매이익 Top4 뽑기
            const sortedByIncome: ProductValue[] = priTotalProductInfo
                .sort(
                    (a, b) =>
                        a.totalAccPrivateProductIncome -
                        b.totalAccPrivateProductIncome
                )
                .slice(0, 4)
                .map((pd) => ({
                    productId: pd.productId,
                    productValue: pd.totalAccPrivateProductIncome,
                }));

            //판매량 Top4 뽑기
            const sortedByQuantity: ProductValue[] = priTotalProductInfo
                .sort(
                    (a, b) =>
                        a.totalAccPrivateProductPurchaseQuantity -
                        b.totalAccPrivateProductPurchaseQuantity
                )
                .slice(0, 4)
                .map((pd) => ({
                    productId: pd.productId,
                    productValue: pd.totalAccPrivateProductPurchaseQuantity,
                }));
            sortedByIncome.map((item) => {
                incomeLabel.push(loadProduct(item.productId, productList));
                incomeValue.push(item.productValue);
            });
            sortedByOutcome.map((item) => {
                outcomeLabel.push(loadProduct(item.productId, productList));
                outcomeValue.push(item.productValue);
            });
            sortedByQuantity.map((item) => {
                quantityLabel.push(loadProduct(item.productId, productList));
                quantityValue.push(item.productValue);
            });
        }
        // 연차별 작물 통계 정보
        else {
            top4IncomeProduct[yearProductSelected - 1].totalProduct.map(
                (item) => {
                    incomeLabel.push(loadProduct(item.productId, productList));
                    incomeValue.push(item.productValue);
                }
            );
            top4OutcomeProduct[yearProductSelected - 1].totalProduct.map(
                (item) => {
                    outcomeLabel.push(loadProduct(item.productId, productList));
                    outcomeValue.push(item.productValue);
                }
            );
            top4QuantityProduct[yearProductSelected - 1].totalProduct.map(
                (item) => {
                    quantityLabel.push(
                        loadProduct(item.productId, productList)
                    );
                    quantityValue.push(item.productValue);
                }
            );
        }
        setPriProductIncomeLabels(incomeLabel);
        setPriProductIncomeChartValue(incomeValue);
        setPriProductOutcomeLabels(outcomeLabel);
        setPriProductOutcomeChartValue(outcomeValue);
        setPriProductQuantityLabels(quantityLabel);
        setPriProductQuantityChartValue(quantityValue);
    }, [yearProductSelected, priTotalProductInfo]);

    useEffect(() => {
        let eventLabel: string[] = [];
        let eventValue: number[] = [];
        annualSpecialEvent.map((item) => {
            eventLabel.push(item.specialEventName);
            eventValue.push(item.totalAccSpecialEventOccurCount);
        });
        setAnuSpecialEventLabels(eventLabel);
        setAnuSpecialEventChartValue(eventValue);
    }, [annualSpecialEvent]);

    // 연차별 전체 통계 정보
    useEffect(() => {
        let incomeLabel: string[] = [];
        let incomeValue: number[] = [];
        let outcomeLabel: string[] = [];
        let outcomeValue: number[] = [];
        let quantityLabel: string[] = [];
        let quantityValue: number[] = [];
        const sortedByOutcome: ProductValue[] = pubTotalProductInfo
            .sort((a, b) => a.totalAccProductOutcome - b.totalAccProductOutcome)
            .slice(0, 10)
            .map((pd) => ({
                productId: pd.productId,
                productValue: pd.totalAccProductOutcome,
            }));

        //구매이익 Top10 뽑기
        const sortedByIncome: ProductValue[] = pubTotalProductInfo
            .sort((a, b) => a.totalAccProductIncome - b.totalAccProductIncome)
            .slice(0, 10)
            .map((pd) => ({
                productId: pd.productId,
                productValue: pd.totalAccProductIncome,
            }));

        //판매량 Top10 뽑기
        const sortedByQuantity: ProductValue[] = pubTotalProductInfo
            .sort(
                (a, b) =>
                    a.totalAccProductPurchaseQuantity -
                    b.totalAccProductPurchaseQuantity
            )
            .slice(0, 10)
            .map((pd) => ({
                productId: pd.productId,
                productValue: pd.totalAccProductPurchaseQuantity,
            }));
        sortedByIncome.map((item) => {
            incomeLabel.push(loadProduct(item.productId, productList));
            incomeValue.push(item.productValue);
        });
        sortedByOutcome.map((item) => {
            outcomeLabel.push(loadProduct(item.productId, productList));
            outcomeValue.push(item.productValue);
        });
        sortedByQuantity.map((item) => {
            quantityLabel.push(loadProduct(item.productId, productList));
            quantityValue.push(item.productValue);
        });
        setPubProductIncomeLabels(incomeLabel);
        setPubProductIncomeChartValue(incomeValue);
        setPubProductOutcomeLabels(outcomeLabel);
        setPubProductOutcomeChartValue(outcomeValue);
        setPubProductQuantityLabels(quantityLabel);
        setPubProductQuantityChartValue(quantityValue);
    }, [pubTotalProductInfo]);

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

    const priYearProductIncomeData = {
        labels: priProductIncomeLabels,
        // priProductLabels,
        datasets: [
            {
                label: '구매금액',
                data: priProductIncomeChartValue,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: ['#F48080', '#F4B880', '#90F480', '#80AEF4'],
            },
        ],
    };
    const priYearProductOutcomeData = {
        labels: priProductOutcomeLabels,
        // priProductLabels,
        datasets: [
            {
                label: '판매금액',
                data: priProductOutcomeChartValue,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: ['#F48080', '#F4B880', '#90F480', '#80AEF4'],
            },
        ],
    };
    const priYearProductPurchaseData = {
        labels: priProductQuantityLabels,
        // priProductLabels,
        datasets: [
            {
                label: '거래량',
                data: priProductQuantityChartValue,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: ['#F48080', '#F4B880', '#90F480', '#80AEF4'],
            },
        ],
    };
    const pubProductIncomeData = {
        labels: pubProductIncomeLabels,
        // priProductLabels,
        datasets: [
            {
                label: '구매금액',
                data: pubProductIncomeChartValue,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };
    const pubProductOutcomeData = {
        labels: priProductOutcomeLabels,
        // priProductLabels,
        datasets: [
            {
                label: '판매금액',
                data: pubProductOutcomeChartValue,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };
    const pubProductPurchaseData = {
        labels: priProductQuantityLabels,
        // priProductLabels,
        datasets: [
            {
                label: '거래량',
                data: pubProductQuantityChartValue,
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
                backgroundColor: ['#F48080', '#F4E280', '#80A7F4'],
            },
        ],
    };
    //// 시설 관련 ////

    //// 시설 관련 ////
    const anuEventData = {
        labels: anuSpecialEventLabels,
        // priProductLabels,
        datasets: [
            {
                label: '이벤트 발생 횟수',
                data: anuSpecialEventChartValue,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: ['#F48080', '#F4E280', '#80A7F4'],
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
    const changePubPurchaseBtn = (prop: number) => {
        setPubPurchaseMode(prop);
    };
    const changePriSalseBtn = (prop: boolean) => {
        setPriSalseFlag(prop);
    };

    const closeResultModal = () => {
        setIsFinReportAvail(false);
    };
    const handleYearProduct = (e: BaseSyntheticEvent) => {
        setYearProductSelected(e.target.value);
    };

    const pubProductElement = () => {
        if (pubPurchaseMode === 0) {
            return (
                <div className="w-full h-[100%]">
                    <BarChart data={pubProductIncomeData} />
                </div>
            );
        } else if (pubPurchaseMode === 1) {
            return (
                <div className="w-full h-[100%]">
                    <BarChart data={pubProductOutcomeData} />
                </div>
            );
        } else {
            return (
                <div className="w-full h-[100%]">
                    <BarChart data={pubProductPurchaseData} />
                </div>
            );
        }
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

                                <select
                                    className="text-[1.6vw] py-[0.2vw] px-[0.8vw] text-center border-[0.2vw] rounded-[0.4vw] color-border-subbold"
                                    onChange={handleYearProduct}
                                    value={yearProductSelected}
                                >
                                    <option value="0" selected>
                                        전체
                                    </option>
                                    {priYearProductInfo.map((item, index) => {
                                        return (
                                            <option
                                                value={index + 1}
                                                key={
                                                    'product year key ' + index
                                                }
                                            >
                                                {index + 1}년차
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[75%] flex items-center justify-center">
                        <div className="w-[40%] h-full flex items-center justify-center ">
                            <div className="relative w-[90%] h-[90%] text-[2vw] p-[1vw] bg-white flex flex-col justify-between items-center border-[0.2vw] color-border-subbold rounded-[1vw]">
                                <p className="w-full text-start">
                                    구매 작물 TOP4
                                </p>
                                <div className="w-full h-[100%]">
                                    {priPurchaseFlag ? (
                                        <BarChart
                                            data={priYearProductIncomeData}
                                        />
                                    ) : (
                                        <BarChart
                                            data={priYearProductOutcomeData}
                                        />
                                    )}
                                </div>

                                <div className="absolute top-[1vw] right-[1vw]">
                                    <p
                                        className="text-[1.2vw] p-[0.6vw] border-[0.2vw] color-border-subbold rounded-[1vw] cursor-pointer bg-white "
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
                                        className="text-[1.2vw] p-[0.6vw] my-[0.4vw] border-[0.2vw] color-border-subbold rounded-[1vw] cursor-pointer bg-white "
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
                                        판매금액
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="w-[40%] h-full flex items-center justify-center">
                            <div className="relative w-[90%] h-[90%] text-[2vw] p-[1vw] bg-white flex flex-col justify-between items-center border-[0.2vw] color-border-subbold rounded-[1vw]">
                                <p className="w-full text-start">
                                    구매 작물 TOP4
                                </p>
                                <div className="w-full h-[100%]">
                                    <BarChart
                                        data={priYearProductPurchaseData}
                                    />
                                </div>
                                <div className="absolute top-[1vw] right-[1vw]">
                                    <p
                                        className="text-[1.2vw] p-[0.6vw] border-[0.2vw] color-border-subbold rounded-[1vw] cursor-pointer bg-white "
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
                                        거래량
                                    </p>
                                </div>
                            </div>
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
                        <div className="w-[65%] h-full flex items-center px-[2vw]"></div>
                    </div>
                    <div className="w-full h-[75%] flex items-center justify-center">
                        <div className="w-[60%] h-full flex items-center justify-center ">
                            <div className="relative w-[90%] h-[90%] text-[2vw] p-[1vw] bg-white flex flex-col justify-between items-center border-[0.2vw] color-border-subbold rounded-[1vw]">
                                <p className="w-full text-start">
                                    서버 거래 작물 TOP10
                                </p>
                                {pubProductElement()}
                                <div className="absolute top-[1vw] right-[1vw]">
                                    <p
                                        className="text-[1.2vw] p-[0.6vw] border-[0.2vw] bg-white color-border-subbold rounded-[1vw] cursor-pointer "
                                        onClick={() => {
                                            changePubPurchaseBtn(0);
                                        }}
                                        style={
                                            pubPurchaseMode === 0
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
                                        className="text-[1.2vw] p-[0.6vw] my-[0.4vw] border-[0.2vw] bg-white color-border-subbold rounded-[1vw] cursor-pointer "
                                        onClick={() => {
                                            changePubPurchaseBtn(1);
                                        }}
                                        style={
                                            pubPurchaseMode === 1
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
                                        className="text-[1.2vw] p-[0.6vw] my-[0.4vw] border-[0.2vw] bg-white color-border-subbold rounded-[1vw] cursor-pointer "
                                        onClick={() => {
                                            changePubPurchaseBtn(2);
                                        }}
                                        style={
                                            pubPurchaseMode === 2
                                                ? {
                                                      backgroundColor:
                                                          '#7e5a39',
                                                      color: 'white',
                                                  }
                                                : {}
                                        }
                                    >
                                        거래량
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="w-[30%] h-full flex flex-col items-center justify-center">
                            <div className="w-full h-[100%]">
                                <HorizenBarChart data={anuEventData} />
                            </div>
                        </div>
                    </div>
                </>
            );
        } else if (page === 3) {
            return (
                <>
                    <div className="w-full h-[25%] flex items-center justify-center">
                        <div className="w-[35%] h-full px-[2vw] flex flex-col justify-center items-center">
                            <p className="w-full text-start text-[2.4vw]">
                                전체 결산
                            </p>
                            <div className="w-full text-start text-[1.8vw] flex justify-start items-center">
                                <p>게임 통계 (2 / 2)</p>
                                <p
                                    className="border-[0.2vw] color-border-subbold mx-[1vw] px-[1vw] py-[0.2vw] cursor-pointer"
                                    onClick={() => {
                                        changePage(2);
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
                        <ul className="w-[35%] h-full flex flex-col items-center ps-[1vw] pe-[0.2vw] mx-[0.4vw] overflow-y-auto">
                            {finReport?.rankInfoList.map((item) => {
                                return (
                                    <li className="w-full my-[0.2vw]">
                                        <RankingCard
                                            rankName={item.rankName}
                                            rankDescription={
                                                item.rankDescription
                                            }
                                            myRank={item.myRank}
                                            myRecord={item.myRecord}
                                            theFirstRecord={item.theFirstRecord}
                                            theFirstUserInfo={
                                                item.theFirstUserInfo
                                            }
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="w-[35%] h-full flex-col items-center justify-center  me-[0.6vw] ">
                            <div className="relative h-[55%] border-[0.2vw] rounded-[0.6vw] color-border-subbold p-[1vw] overflow-y-auto">
                                <p className=" w-full text-start text-[1.4vw]">
                                    획득 도전과제
                                </p>
                                <ul className="h-full flex flex-col">
                                    {finReport?.achievementList.map((item) => {
                                        console.log(item);
                                        return (
                                            <li className="h-[30%]">
                                                <AchievementCard
                                                    achievementId={item}
                                                    achievementInfo={
                                                        achievementInfo
                                                    }
                                                />
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <div className="h-[2%]"></div>
                            <div className="h-[40%] border-[0.2vw] rounded-[0.6vw] color-border-subbold p-[0.2vw]">
                                <div className="w-[94%] h-[94%]">
                                    <HorizenBarChart data={priInfraData} />
                                </div>
                            </div>
                        </div>
                        <div className="w-[35%] h-full flex flex-col items-center justify-center color-text-textcolor">
                            <div className="w-full h-[65%] border-[0.2vw] color-border-subbold rounded-[1vw] p-[1vw]">
                                <p className="w-full h-[14%] text-[2vw] text-start">
                                    게임 획득 골드
                                </p>
                                <div className="h-[86%] flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between my-[0.4vw]">
                                            <p className="text-[1.6vw]">
                                                현재 보유 금액
                                            </p>
                                            <p className="text-[1.6vw]">
                                                10,000,000
                                            </p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="text-[1.6vw]">
                                                전체 보유 금액
                                            </p>
                                            <p className="text-[1.6vw]">
                                                110,000,000
                                            </p>
                                        </div>
                                    </div>

                                    <div className="">
                                        <p className="w-full h-[0.2vw] color-bg-subbold my-[0.4vw]"></p>
                                        <p className="w-full text-start text-[1.6vw]">
                                            다음 게임 획득 골드
                                        </p>
                                        <p className="w-full text-end text-[1.6vw]">
                                            10,000,000
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full h-[35%] flex justify-end items-center">
                                <div
                                    className="text-white mx-[1vw] px-[2vw] py-[0.8vw] rounded-[0.6vw] border-[0.2vw] color-border-sublight color-bg-sublight text-[1.4vw] cursor-pointer hover:bg-white hover:color-text-sublight"
                                    onClick={() => {
                                        setIsFinReportAvail(false);
                                    }}
                                >
                                    보상 받기
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        }
    };
    return (
        <div className="absolute w-[98%] h-[95%] flex flex-col items-center justify-center color-text-textcolor border-[0.4vw] rounded-[1vw] color-border-brown1 bg-white z-50 animation-modal ">
            {resultElement()}
        </div>
    );
}
