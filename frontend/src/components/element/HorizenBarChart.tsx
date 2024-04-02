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
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom' as const,
        },
        title: {
            display: false,
        },
        // tooltip 해야함
    },
};

export function HorizenBarChart(prop: any) {
    return <Bar options={options} data={prop.data} />;
}
