// src/components/PriceChart.js
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PriceChart = () => {
  const chartData = {
    labels: Array.from({ length: 31 }, (_, i) => `${i + 1} Oct`), // Days from 1st Oct to 31st Oct
    datasets: [
      {
        label: 'Vanaspati',
        data: [
          72, 84, 78, 90, 76, 110, 115, 86, 92, 80,
          105, 89, 94, 120, 98, 79, 101, 83, 91, 108,
          115, 87, 100, 74, 112, 94, 82, 118, 85, 96, 90
        ],
        backgroundColor: '#FF6384',
      },
      {
        label: 'Palm Oil',
        data: [
          95, 88, 76, 92, 110, 132, 85, 97, 111, 102,
          74, 118, 127, 90, 108, 84, 120, 75, 114, 135,
          82, 96, 105, 123, 89, 130, 115, 100, 78, 140, 112
        ],
        backgroundColor: '#36A2EB',
      },
      {
        label: 'Soybean Oil',
        data: [
          140, 130, 115, 125, 100, 120, 142, 110, 137, 125,
          105, 133, 128, 145, 115, 126, 138, 130, 112, 143,
          127, 135, 121, 108, 125, 140, 130, 119, 98, 132, 127
        ],
        backgroundColor: '#FFCE56',
      },
      {
        label: 'Sunflower Oil',
        data: [
          85, 102, 120, 115, 98, 137, 92, 105, 128, 140,
          80, 113, 97, 125, 134, 91, 122, 108, 95, 145,
          88, 106, 117, 135, 103, 128, 90, 120, 130, 112, 100
        ],
        backgroundColor: '#4BC0C0',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Edible Oil Prices Over October',
      },
    },
    scales: {
      x: { title: { display: true, text: 'Dates' } },
      y: { title: { display: true, text: 'Price (in USD)' } },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;
};

export default PriceChart;
