import { HalfReceipt } from '../../../type/types';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    plugins,
    scales,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

interface Prop {
    receipt: HalfReceipt;
}

export default function HalfPage2(props: Prop) {
    const receipt = props.receipt;

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

    const options = {
        plugins: {
            title: {
                display: false,
                text: 'Graph for half annual income, outcome',
            },
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };

    const labels = ['수입', '지출'];

    const data = {
        labels,
        datasets: [
            {
                label: '작물 판매 비용',
                data: [receipt.totalProductIncome, 0],
                backgroundColor: '#FF9586',
            },
            {
                label: '작물 구매 비용',
                data: [0, receipt.totalProductOutcome],
                backgroundColor: '#FFC7C7',
            },
            {
                label: '시설 업그레이드 비용',
                data: [0, receipt.totalUpgradeFee],
                backgroundColor: '#9EFF9C',
            },
            {
                label: '임대료',
                data: [0, receipt.totalRentFee],
                backgroundColor: '#9E8FFF',
            },
            {
                label: '판매 수수료',
                data: [0, receipt.totalBrokerFee],
                backgroundColor: '#FD5F5F',
            },
        ],
    };

    if (receipt.eventBonus >= 0) {
        data.datasets.push({
            label: '이벤트 보너스',
            data: [receipt.eventBonus, 0],
            backgroundColor: '#FFD9A0',
        });
    } else {
        data.datasets.push({
            label: '이벤트 보너스',
            data: [0, -receipt.eventBonus],
            backgroundColor: '#FFD9A0',
        });
    }

    return (
        <>
            <div className="w-full h-full flex items-center">
                <div className="w-[50%] h-full flex flex-col items-center px-[2vw] py-[1vh]">
                    <p className="w-full text-left text-[2.5vw] my-[1vh]">
                        수익
                    </p>
                    <div className="w-full flex justify-between my-[1vh] text-[1.5vw]">
                        <p>작물 판매 비용</p>
                        <p>
                            {`+${receipt.totalProductIncome.toLocaleString()}G`}
                        </p>
                    </div>
                    {receipt.eventBonus >= 0 ? (
                        <div className="w-full flex justify-between my-[1vh] text-[1.5vw]">
                            <p>이벤트 보너스</p>
                            <p>{`+${receipt.eventBonus.toLocaleString()}G`}</p>
                        </div>
                    ) : (
                        <></>
                    )}
                    <p className="w-full text-left text-[2.5vw] mt-[1.5vh]">
                        지출
                    </p>
                    <div className="w-full flex justify-between my-[1vh] text-[1.5vw]">
                        <p>작물 구매 비용</p>
                        <p>
                            {`-${receipt.totalProductOutcome.toLocaleString()}G`}
                        </p>
                    </div>
                    <div className="w-full flex justify-between my-[1vh] text-[1.5vw]">
                        <p>시설 업그레이드 비용</p>
                        <p>{`-${receipt.totalUpgradeFee.toLocaleString()}G`}</p>
                    </div>
                    <div className="w-full flex justify-between my-[1vh] text-[1.5vw]">
                        <p>임대료</p>
                        <p>{`-${receipt.totalRentFee.toLocaleString()}G`}</p>
                    </div>
                    <div className="w-full flex justify-between my-[1vh] text-[1.5vw]">
                        <p>판매 수수료</p>
                        <p>{`-${receipt.totalBrokerFee.toLocaleString()}G`}</p>
                    </div>
                    {receipt.eventBonus < 0 ? (
                        <div className="w-full flex justify-between my-[1vh] text-[1.5vw]">
                            <p>이벤트 보너스</p>
                            <p>{`${receipt.eventBonus.toLocaleString()}G`}</p>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <div className="w-[0.2vw] h-[90%] color-bg-subbold"></div>
                <div className="w-[50%] h-full flex flex-col px-[2vw] py-[1vh]">
                    <div className="w-full flex justify-between text-[2vw] mt-[1vh]">
                        <p>총 수입</p>
                        <p>{`+${receipt.totalIncome}G`}</p>
                    </div>
                    <div className="w-full flex justify-between text-[2vw]">
                        <p>총 지출</p>
                        <p>{`-${receipt.totalOutcome}G`}</p>
                    </div>
                    <div className="w-full h-[0.2vh]">
                        <div className="w-full h-full color-bg-subbold"></div>
                    </div>
                    <div className="w-full flex justify-between text-[2vw] mb-[3vh]">
                        <p>총 결산</p>
                        <p>{`${
                            receipt.totalIncome - receipt.totalOutcome
                        }G`}</p>
                    </div>
                    <Bar options={options} data={data} height={'200%'} />
                </div>
            </div>
        </>
    );
}
