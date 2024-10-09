import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { getOrders } from "@/services/orderService";
import { getWarehouses } from "@/services/warehouseService";
import {
  getPricesByWarehouse,
  addPrice,
  getPrices,
} from "@/services/itemService";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { toast } from "react-toastify";

export default function Home() {
  const [orders, setOrders] = useState([]);
  const [statisticsCardsData, setStatisticsCardsData] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedHistoryWarehouse, setSelectedHistoryWarehouse] = useState("");
  const [items, setItems] = useState([]);
  const [historyItems, setHistoryItems] = useState([]);
  const [form, setForm] = useState([]);
  const [pricesFound, setPricesFound] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders();
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
  }, [selectedWarehouse]);

  const fetchWarehouseOptions = async () => {
    try {
      const response = await getWarehouses();
      if (response.length > 0) {
        setSelectedWarehouse(response[0]._id);
        setSelectedHistoryWarehouse(response[0]._id);
      }
      setWarehouseOptions(response);
    } catch (error) {
      toast.error("Error fetching warehouses!");
      console.error(error);
    }
  };

  // Fetch prices for the selected warehouse
  const fetchPricesForWarehouse = async (warehouseId) => {
    setLoading(true);
    try {
      const prices = await getPricesByWarehouse(warehouseId);
      setForm(prices);
    } catch (error) {
      console.error("Error fetching prices:", error);
      setPricesFound(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchPricesForHistory = async (warehouseId) => {
    try {
      const response = await getPrices();
      setHistoryItems(
        response?.filter((item) => item.warehouse?._id === warehouseId)
      );
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };

  useEffect(() => {
    fetchWarehouseOptions();
  }, []);

  useEffect(() => {
    if (selectedWarehouse) {
      fetchPricesForWarehouse(selectedWarehouse);
    }
  }, [selectedWarehouse]);

  useEffect(() => {
    if (selectedHistoryWarehouse) {
      fetchPricesForHistory(selectedHistoryWarehouse);
    }
  }, [selectedHistoryWarehouse]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedForm = [...form];
    updatedForm[index][name] = value;
    setForm(updatedForm);
  };

  const handleWarehouseChange = (event) => {
    setSelectedWarehouse(event.target.value);
  };

  const handleSubmit = async () => {
    const itemsToSubmit = form?.filter((item) => !item.pricesUpdated);
    console.log(form);
    console.log(itemsToSubmit);
    if (itemsToSubmit.length > 0) {
      try {
        const postData = {
          warehouseId: selectedWarehouse,
          prices: itemsToSubmit.map((item) => ({
            itemId: item.item?._id,
            companyPrice: item.companyPrice,
            rackPrice: item.rackPrice,
            depoPrice: item.depotPrice,
            plantPrice: item.plantPrice,
          })),
        };
        console.log(postData);
        await addPrice(postData);
        toast.success("Prices updated successfully!");
        // Optionally, reset form and fetch prices again
        fetchPricesForWarehouse(selectedWarehouse);
      } catch (error) {
        console.error("Error updating prices:", error);
        toast.error("Error updating prices!");
      }
    } else {
      toast.error("All prices are already updated.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="mt-12 px-12">
      <div>
        <h1 className="text-[1.2rem]">Welcome, Name</h1>
        <p className="text-[0.9rem] text-[#828282]">
          Here's what's happening with your store today.
        </p>
      </div>

      <div className="flex flex-col bg-white rounded-lg shadow-md border-2 border-[#929292] p-4">
        <h1 className="text-[1rem] text-[#929292]">DAILY ITEM PRICE UPDATE</h1>
        <div className="flex gap-5 items-center mt-2">
          <div className="relative w-[400px]">
            <select
              id="warehouseSelect"
              name="warehouseSelect"
              value={selectedWarehouse}
              onChange={handleWarehouseChange}
              className="appearance-none w-full bg-[#F0F0F0] border-2 border-[#737373] text-[#38454A] px-4 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBCDCE] cursor-pointer"
            >
              <option value="">Select Warehouse</option>
              {warehouseOptions.map((option) => (
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

        {/* Price input form for items */}
        {loading ? (
          <div className="flex justify-center items-center">
            <p className="text-lg text-gray-500">Loading prices...</p>
          </div>
        ) : selectedWarehouse ? (
          <div className="mt-2 p-4">
            <table className="min-w-full bg-white border-b border-b-[2px] border-[#898484] text-[#7F7F7F]">
              <thead>
                <tr className="grid grid-cols-5">
                  <th className="px-4 py-2 border rounded-tr-md rounded-tl-md border-[2px] border-[#898484]">
                    Item Name
                  </th>
                  <th className="px-4 py-2 border rounded-tr-md rounded-tl-md border-[2px] border-[#898484]">
                    Company Price
                  </th>
                  <th className="px-4 py-2 border rounded-tr-md rounded-tl-md border-[2px] border-[#898484]">
                    Rack Price
                  </th>
                  <th className="px-4 py-2 border rounded-tr-md rounded-tl-md border-[2px] border-[#898484]">
                    Depot Price
                  </th>
                  <th className="px-4 py-2 border rounded-tr-md rounded-tl-md border-[2px] border-[#898484]">
                    Plant Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {form.map((item, index) => (
                  <tr key={index} className="grid grid-cols-5">
                    <td className="px-4 py-2 border-r border-l border-r-[2px] border-l-[2px] border-[#898484]">
                      {item.item?.materialdescription || "Unknown Item"}
                    </td>
                    <td className="px-4 py-2 border-r border-r-[2px] border-[#898484]">
                      <input
                        type="number"
                        name="companyPrice"
                        value={item.companyPrice}
                        onChange={(event) => handleInputChange(index, event)}
                        className="border px-2 py-1 w-full bg-[#E9E9E9] text-black rounded"
                        placeholder="Enter company price"
                        disabled={item.pricesUpdated}
                      />
                    </td>
                    <td className="px-4 py-2 border-r border-r-[2px] border-[#898484]">
                      <input
                        type="number"
                        name="rackPrice"
                        value={item.rackPrice}
                        onChange={(event) => handleInputChange(index, event)}
                        className="border px-2 py-1 w-full bg-[#E9E9E9] text-black rounded"
                        placeholder="Enter rack price"
                        disabled={item.pricesUpdated}
                      />
                    </td>
                    <td className="px-4 py-2 border-r border-r-[2px] border-[#898484]">
                      <input
                        type="number"
                        name="depotPrice"
                        value={item.depotPrice}
                        onChange={(event) => handleInputChange(index, event)}
                        className="border px-2 py-1 w-full bg-[#E9E9E9] text-black rounded"
                        placeholder="Enter depot price"
                        disabled={item.pricesUpdated}
                      />
                    </td>
                    <td className="px-4 py-2 border-r border-r-[2px] border-[#898484]">
                      <input
                        type="number"
                        name="plantPrice"
                        value={item.plantPrice}
                        onChange={(event) => handleInputChange(index, event)}
                        className="border px-2 py-1 w-full bg-[#E9E9E9] text-black rounded"
                        placeholder="Enter plant price"
                        disabled={item.pricesUpdated}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={handleSubmit}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save Prices
            </button>
            {/* {!pricesFound && (
          <p className="text-red-500">
            Prices not found for the selected warehouse. Please enter new
            prices.
          </p>
        )} */}
          </div>
        ) : (
          <Typography className="text-xl text-center font-bold my-5">
            Select Warehouse!
          </Typography>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md border-2 border-[#929292] my-8">
        <div className="flex items-center justify-between px-8 py-2 border-b-2 border-b-[#929292]">
          <h1 className="text-[1rem] text-[#636363]">PRICE HISTORY</h1>

          <div className="flex gap-5 items-center mt-2">
            <div className="relative w-[400px]">
              <select
                value={selectedHistoryWarehouse}
                onChange={(e) => setSelectedHistoryWarehouse(e.target.value)}
                className="appearance-none w-full bg-[#F0F0F0] border-2 border-[#737373] text-[#38454A] px-4 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBCDCE] cursor-pointer"
              >
                <option value="">Select Warehouse</option>
                {warehouseOptions.map((option) => (
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
        </div>

        <div className="p-10">
          {/* Items Table */}
          <div className="w-full overflow-x-scroll">
            {selectedHistoryWarehouse ? (
              historyItems?.length > 0 ? (
                <table className="w-full bg-white">
                  <thead>
                    <tr className="grid grid-cols-6">
                      <th className="py-2 px-4 text-start">Date</th>
                      <th className="py-2 px-4 text-start">Item</th>
                      <th className="py-2 px-4 text-start">Company Price</th>
                      <th className="py-2 px-4 text-start">Rack Price</th>
                      <th className="py-2 px-4 text-start">Depot Price</th>
                      <th className="py-2 px-4 text-start">Plant Price</th>
                    </tr>
                  </thead>
                  <tbody className="flex flex-col gap-2">
                    {historyItems?.map((item) => (
                      <tr
                        key={item._id}
                        className="grid grid-cols-6 items-center border border-[#7F7F7F] rounded-md shadow-md"
                      >
                        <td className="py-2 px-4">
                          <span>{formatDate(item.date)}</span>
                        </td>
                        <td className="py-2 px-4">
                          <span>{item.item?.materialdescription}</span>
                        </td>
                        <td className="py-2 px-4">
                          <span>{item.companyPrice}</span>
                        </td>
                        <td className="py-2 px-4">
                          <span>{item.rackPrice}</span>
                        </td>
                        <td className="py-2 px-4">
                          <span>{item.depoPrice}</span>
                        </td>
                        <td className="py-2 px-4">
                          <span>{item.plantPrice}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <Typography className="text-xl text-center font-bold">
                  No Items!
                </Typography>
              )
            ) : (
              <Typography className="text-xl text-center font-bold">
                Select Warehouse!
              </Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
