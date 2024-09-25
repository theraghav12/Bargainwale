import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import { getOrders } from "@/services/orderService";
import { getWarehouseById } from "@/services/warehouseService";
import { TbTriangleInvertedFilled } from "react-icons/tb";

export function Home() {
  const [orders, setOrders] = useState([]);
  const [statisticsCardsData, setStatisticsCardsData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders();
      const selectedWarehouseID = localStorage.getItem("warehouse");
      const data1 = await getWarehouseById(selectedWarehouseID);
      if (data) {
        setOrders(data);
        setStatisticsCardsData([
          {
            title: "Total Orders",
            value: data.length,
            footer: {
              color: "text-blue-500",
              value: `${data.length} orders`,
              label: "total",
            },
            icon: CheckCircleIcon,
          },
          // Add more cards based on the fetched data
        ]);
      }
    };
    fetchOrders();
  }, []);

  // Transform orders data if needed for your charts or statistics
  const orderStatistics = orders.map((order) => ({
    title: order.companyBargainNo,
    description: order.description,
  }));

  return (
    <div className="mt-12 px-12">
      {/* Heading */}
      <div>
        <h1 className="text-[1.2rem]">Welcome, Name</h1>
        <p className="text-[0.9rem] text-[#828282]">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Warehouse section */}
      <div className="bg-white border-2 border-[#E9E9E9] rounded-md">
        <h2 className="text-[0.9rem] text-[#929292]">
          Daily Item price update
        </h2>

        <div className="flex gap-5 items-center">
          <label htmlFor="iphoneSelect" className="text-[#38454A] text-[1rem]">
            Supplier
          </label>
          <div className="relative w-[180px]">
            <select
              id="iphoneSelect"
              name="iphoneSelect"
              // value={selectedValue}
              // onChange={(e) => handleSelectChange(e.target.value)}
              className="appearance-none w-full bg-[#F0F0F0] border-2 border-[#737373] text-[#38454A] px-4 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBCDCE] cursor-pointer"
            >
              <option value="">Choose an option</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <TbTriangleInvertedFilled className="text-[#5E5E5E]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
