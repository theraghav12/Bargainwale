import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { TbTriangleInvertedFilled } from "react-icons/tb";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PriceChart = ({ data }) => {
  const [timeRange, setTimeRange] = useState("30");
  const getFilteredData = () => {
    const now = new Date();
    let cutoffDate;

    switch (timeRange) {
      case "1":
        cutoffDate = new Date();
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case "7":
        cutoffDate = new Date();
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "30":
        cutoffDate = new Date();
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case "365":
        cutoffDate = new Date();
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return data;
    }

    return data.filter((item) => new Date(item.effectiveDate) >= cutoffDate);
  };

  const filteredData = getFilteredData();

  const labels = filteredData.map((item) => {
    const date = new Date(item.effectiveDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const amPm = date.getHours() >= 12 ? "PM" : "AM";
    return `${day}/${month}/${year} ${hours}:${minutes} ${amPm}`;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "Company Price",
        data: filteredData.map((item) => item.companyPrice),
        backgroundColor: "#FF6384",
      },
      {
        label: "Depo Price",
        data: filteredData.map((item) => item.depoPrice),
        backgroundColor: "#36A2EB",
      },
      {
        label: "Plant Price",
        data: filteredData.map((item) => item.plantPrice),
        backgroundColor: "#FFCE56",
      },
      {
        label: "Rack Price",
        data: filteredData.map((item) => item.rackPrice),
        backgroundColor: "#4BC0C0",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Price History with Date and Time",
      },
    },
    scales: {
      x: { title: { display: true, text: "Date and Time" } },
      y: { title: { display: true, text: "Price (in USD)" } },
    },
  };

  return (
    <div>
      <div className="flex items-center">
        <label htmlFor="timeRange" className="mr-2">
          Select Time Range:
        </label>
        <div className="relative w-full max-w-[200px]">
          <select
            id="timeRange"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none w-full bg-gray-100 border border-gray-400 text-gray-700 px-4 py-1 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="1">Last 1 Day</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="365">Last 1 Year</option>
            <option value="max">Maximum</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <TbTriangleInvertedFilled className="text-gray-500" />
          </div>
        </div>
      </div>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default PriceChart;
