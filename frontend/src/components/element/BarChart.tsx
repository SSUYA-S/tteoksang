import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import report from '../../dummy-data/report/final.json';
import { useEffect, useState } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    animation: {
        duration: 500,
    },
    responsive: true,
    maintainAspectRatio: false,
    categoryPercentage: 0.5,
    // scales: { x: { display: false } },
    plugins: {
        legend: {
            display: false,
            position: 'bottom' as const,
        },
        title: {
            display: false,
        },
        // tooltip 해야함
    },
    options: {
        scales: {
            x: {
                // x축 설정
                categoryPercentage: 0.8, // 카테고리 전체 폭 대비 바의 폭 비율
                barPercentage: 0.9, // 카테고리 내에서 바의 폭 비율
            },
            // y축 설정...
        },
    },
};

export function BarChart(prop: any) {
    return <Bar options={options} data={prop.data} />;
}
