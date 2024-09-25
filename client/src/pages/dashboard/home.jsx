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
import { getWarehouseById, getWarehouses } from "@/services/warehouseService";
import { TbTriangleInvertedFilled } from "react-icons/tb";

export function Home() {
  const [orders, setOrders] = useState([]);
  const [statisticsCardsData, setStatisticsCardsData] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [form, setForm] = useState([
    {
      warehouse: "",
      item: "",
      companyPrice: "",
      rackPrice: "",
      depotPrice: "",
      plantPrice: "",
    },
  ]);

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
        ]);
      }
    };
    fetchOrders();
  }, []);

  const fetchWarehouseOptions = async () => {
    try {
      const response = await getWarehouses();
      setWarehouseOptions(response);
    } catch (error) {
      toast.error("Error fetching warehouses!");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWarehouseOptions();
  }, []);

  // Function to populate the form based on the given Postman data
  const setFormFromPostmanData = (postData) => {
    const { prices } = postData;
    const updatedForm = prices.map((price) => ({
      item: price.itemId, // Assuming you get the item name or id
      companyPrice: price.companyPrice,
      rackPrice: price.rackPrice,
      depotPrice: price.depoPrice,
      plantPrice: price.plantPrice,
    }));
    setForm(updatedForm);
  };

  // Example Postman data
  const postmanData = {
    warehouseId: "66d4b28d94374eea53e1cff3",
    prices: [
      {
        itemId: "66cf6907e6f852c6a630cecb",
        companyPrice: 100,
        rackPrice: 110,
        plantPrice: 120,
        depoPrice: 130,
      },
      {
        itemId: "66cf6938e6f852c6a630cece",
        companyPrice: 200,
        rackPrice: 210,
        plantPrice: 220,
        depoPrice: 230,
      },
    ],
  };

  // Populate form when the component mounts or when data is fetched
  useEffect(() => {
    setFormFromPostmanData(postmanData);
  }, []);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedForm = [...form];
    updatedForm[index][name] = value;
    setForm(updatedForm);
  };

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
          <div className="relative w-[400px]">
            <select
              id="iphoneSelect"
              name="iphoneSelect"
              className="appearance-none w-full bg-[#F0F0F0] border-2 border-[#737373] text-[#38454A] px-4 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBCDCE] cursor-pointer"
            >
              <option value="">Warehouse</option>
              {warehouseOptions?.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <TbTriangleInvertedFilled className="text-[#5E5E5E]" />
            </div>
          </div>
        </div>

        <div className="container mx-auto p-4">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Item Name</th>
                <th className="px-4 py-2 border">Company Price</th>
                <th className="px-4 py-2 border">Rack Price</th>
                <th className="px-4 py-2 border">Depot Price</th>
                <th className="px-4 py-2 border">Plant Price</th>
              </tr>
            </thead>
            <tbody>
              {form.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">
                    <input
                      type="text"
                      name="item"
                      value={item.item}
                      onChange={(event) => handleInputChange(index, event)}
                      className="border px-2 py-1 w-full"
                      placeholder="Enter item name"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <input
                      type="number"
                      name="companyPrice"
                      value={item.companyPrice}
                      onChange={(event) => handleInputChange(index, event)}
                      className="border px-2 py-1 w-full"
                      placeholder="Enter company price"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <input
                      type="number"
                      name="rackPrice"
                      value={item.rackPrice}
                      onChange={(event) => handleInputChange(index, event)}
                      className="border px-2 py-1 w-full"
                      placeholder="Enter rack price"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <input
                      type="number"
                      name="depotPrice"
                      value={item.depotPrice}
                      onChange={(event) => handleInputChange(index, event)}
                      className="border px-2 py-1 w-full"
                      placeholder="Enter depot price"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <input
                      type="number"
                      name="plantPrice"
                      value={item.plantPrice}
                      onChange={(event) => handleInputChange(index, event)}
                      className="border px-2 py-1 w-full"
                      placeholder="Enter plant price"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Row
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
