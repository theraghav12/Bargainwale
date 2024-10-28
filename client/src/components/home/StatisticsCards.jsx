// src/components/StatisticsCards.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StatisticsCards() {
  const [statisticsCardsData, setStatisticsCardsData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulated data fetching
    const data = [
      {
        title: "No of Active Orders",
        value: "2",
        percentage: "+16.24%",
        percentageColor: "text-green-500",
        footerLabel: "View Orders History",
        onClick: () => navigate("/orders/history"), // Set path for Orders History
      },
      {
        title: "No of Active Bookings",
        value: "67",
        percentage: "-3.57%",
        percentageColor: "text-red-500",
        footerLabel: "View all orders",
        onClick: () => navigate("/booking/history"), // Set path for Orders History
      },
      {
        title: "Total Order Value",
        value: "₹120.00k",
        percentage: "+29.08%",
        percentageColor: "text-green-500",
        footerLabel: "See details",
        onClick: () => navigate("/purchase/history"), // Set path for Orders History
      },
      {
        title: "Total Booking Value",
        value: "₹178.00k",
        percentage: "+0.00%",
        percentageColor: "text-gray-500",
        footerLabel: "View Details",
        onClick: () => navigate("/sales/history"), // Set path for Orders History
      },
    ];
    setStatisticsCardsData(data);
  }, [navigate]);

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {statisticsCardsData.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
          style={{ borderRadius: "10px" }}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-gray-600">{card.title}</h2>
            <span className={`${card.percentageColor} text-sm font-semibold`}>
              {card.percentage}
            </span>
          </div>
          <h3 className="text-2xl font-bold">{card.value}</h3>
          <p
            className="text-blue-500 text-sm cursor-pointer hover:underline"
            onClick={card.onClick} // Call onClick function if available
          >
            {card.footerLabel}
          </p>
        </div>
      ))}
    </div>
  );
}
