import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import report from '../../dummy-data/report/final.json';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
    animation: {
        duration: 500,
    },
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

export function DonutChart(prop: any) {
    return <Doughnut options={options} data={prop.data} />;
}
