import React, { useEffect, useState } from "react";
import { Spinner, Switch, Typography } from "@material-tailwind/react";
import { toast } from "sonner";
import { useOrganization } from "@clerk/clerk-react";

// api services
import { getWarehouses } from "@/services/warehouseService";
import {
  getPricesByWarehouse,
  addPrice,
  getPrices,
} from "@/services/itemService";

// icons
import { TbTriangleInvertedFilled } from "react-icons/tb";

// components
import StatisticsCards from "@/components/home/StatisticsCards";
import PriceChart from "@/components/home/PriceChart";

export default function Home() {
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedHistoryWarehouse, setSelectedHistoryWarehouse] = useState("");
  const [historyItems, setHistoryItems] = useState([]);
  const [form, setForm] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedPrice, setEditedPrice] = useState(null);

  const { organization } = useOrganization();
  const isOrganizationLoaded = localStorage.getItem("organizationId");

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

  const fetchPricesForWarehouse = async (warehouseId) => {
    setLoading(true);
    try {
      const prices = await getPricesByWarehouse(warehouseId);
      setForm(prices.prices);
    } catch (error) {
      console.error("Error fetching prices:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPricesForHistory = async (warehouseId) => {
    try {
      const response = await getPrices();
      setHistoryItems(
        response.prices?.filter((item) => item.warehouse?._id === warehouseId)
      );
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };

  useEffect(() => {
    fetchWarehouseOptions();
  }, [isOrganizationLoaded]);

  useEffect(() => {
    if (selectedWarehouse) {
      fetchPricesForWarehouse(selectedWarehouse);
    }
  }, [selectedWarehouse, isOrganizationLoaded]);

  useEffect(() => {
    if (selectedHistoryWarehouse) {
      fetchPricesForHistory(selectedHistoryWarehouse);
    }
  }, [selectedHistoryWarehouse, isOrganizationLoaded]);

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
    setSubmitLoading(true);
    const itemsToSubmit = form?.filter((item) => !item.pricesUpdated);
    const eligibleItems = itemsToSubmit?.filter(
      (item) =>
        item.companyPrice &&
        String(item.companyPrice).trim() !== "" &&
        item.rackPrice &&
        String(item.rackPrice).trim() !== "" &&
        item.depoPrice &&
        String(item.depoPrice).trim() !== "" &&
        item.plantPrice &&
        String(item.plantPrice).trim() !== ""
    );
    if (itemsToSubmit?.length > 0) {
      if (eligibleItems.length === 0) {
        setSubmitLoading(false);
        toast.error("Fill all prices!");
        return;
      }
      try {
        const postData = {
          warehouseId: selectedWarehouse,
          prices: eligibleItems?.map((item) => ({
            itemId: item.item?._id,
            companyPrice: item.companyPrice,
            rackPrice: item.rackPrice,
            depoPrice: item.depoPrice,
            plantPrice: item.plantPrice,
            pricesUpdated: true,
          })),
          organization: localStorage.getItem("organizationId"),
        };
        await addPrice(postData);
        setSubmitLoading(false);
        toast.success("Prices updated successfully!");
        fetchPricesForWarehouse(selectedWarehouse);
      } catch (error) {
        console.error("Error updating prices:", error);
        setSubmitLoading(false);
        toast.error("Error updating prices!");
      }
    } else {
      setSubmitLoading(false);
      toast.error("All prices are already updated.");
    }
  };

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = currentDateTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  useEffect(() => {
    const isFirstLoad = localStorage.getItem("isFirstLoad");
    if (!isFirstLoad) {
      localStorage.setItem("isFirstLoad", "true");
      window.location.reload();
    }
  }, []);

  return (
    <div className="mt-8 px-12">
      <div className="flex justify-between items-center bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg p-6 text-white">
        <div>
          <h1 className="text-[1.5rem] font-bold">
            Welcome, {organization?.name && <span>{organization?.name}</span>}
          </h1>
          <p className="text-[1rem]">
            Here's what's happening with your organization today.
          </p>
          <div className="flex items-center gap-5 mt-3">
            <p className="text-[1.1rem]">Operations</p>
            <Switch color="green" />
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-semibold">{formattedDate}</span>
          <span className="text-xl">{formattedTime}</span>
        </div>
      </div>

      <br />
      <StatisticsCards />

      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
          <PriceChart />
        </div>

        <div className="flex flex-col bg-white rounded-lg shadow-lg border border-gray-300 p-6">
          <h1 className="text-xl font-semibold text-gray-700">
            Daily Item Price Update
          </h1>
          <div className="flex gap-5 items-center mt-3">
            <div className="relative w-full max-w-md">
              <select
                id="warehouseSelect"
                name="warehouseSelect"
                value={selectedWarehouse}
                onChange={handleWarehouseChange}
                className="appearance-none w-full bg-gray-100 border border-gray-400 text-gray-700 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <option value="">Select Warehouse</option>
                {warehouseOptions.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <TbTriangleInvertedFilled className="text-gray-500" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center mt-5">
              <p className="text-lg text-gray-500">Loading prices...</p>
            </div>
          ) : selectedWarehouse ? (
            <div className="mt-5">
              <table className="min-w-full bg-white border-t border-b border-gray-200 shadow">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">
                      Item Name
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">
                      Company Price
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">
                      Rack Price
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">
                      Depot Price
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">
                      Plant Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {form?.length > 0 &&
                    form?.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="px-4 py-2 border-t border-gray-200">
                          {item.item?.materialdescription || "Unknown Item"}
                        </td>
                        <td className="px-4 py-2 border-t border-gray-200">
                          <input
                            type="number"
                            name="companyPrice"
                            value={item.companyPrice}
                            onChange={(e) => handleInputChange(index, e)}
                            className="w-full bg-gray-50 px-2 py-1 rounded-lg border border-gray-300"
                            placeholder="Company Price"
                            disabled={item.pricesUpdated}
                          />
                        </td>
                        <td className="px-4 py-2 border-t border-gray-200">
                          <input
                            type="number"
                            name="rackPrice"
                            value={item.rackPrice}
                            onChange={(e) => handleInputChange(index, e)}
                            className="w-full bg-gray-50 px-2 py-1 rounded-lg border border-gray-300"
                            placeholder="Rack Price"
                            disabled={item.pricesUpdated}
                          />
                        </td>
                        <td className="px-4 py-2 border-t border-gray-200">
                          <input
                            type="number"
                            name="depoPrice"
                            value={item.depoPrice}
                            onChange={(e) => handleInputChange(index, e)}
                            className="w-full bg-gray-50 px-2 py-1 rounded-lg border border-gray-300"
                            placeholder="Depot Price"
                            disabled={item.pricesUpdated}
                          />
                        </td>
                        <td className="px-4 py-2 border-t border-gray-200">
                          <input
                            type="number"
                            name="plantPrice"
                            value={item.plantPrice}
                            onChange={(e) => handleInputChange(index, e)}
                            className="w-full bg-gray-50 px-2 py-1 rounded-lg border border-gray-300"
                            placeholder="Plant Price"
                            disabled={item.pricesUpdated}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <button
                onClick={handleSubmit}
                className="mt-5 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
              >
                {submitLoading ? <Spinner /> : "Save Prices"}
              </button>
            </div>
          ) : (
            <Typography className="text-center mt-6 text-lg text-gray-500">
              Select Warehouse!
            </Typography>
          )}
        </div>
      </div>

      {/* Price History Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-300 mt-8">
        <div className="flex items-center justify-between px-6 py-4 bg-gray-100 rounded-t-lg">
          <Typography className="text-lg font-semibold text-gray-700">
            Price History
          </Typography>
          <div className="relative w-full max-w-md">
            <select
              value={selectedHistoryWarehouse}
              onChange={(e) => setSelectedHistoryWarehouse(e.target.value)}
              className="appearance-none w-full bg-gray-100 border border-gray-400 text-gray-700 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="">Select Warehouse</option>
              {warehouseOptions.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <TbTriangleInvertedFilled className="text-gray-500" />
            </div>
          </div>
        </div>
        <div className="p-6 overflow-x-auto">
          {selectedHistoryWarehouse ? (
            historyItems?.length > 0 ? (
              <table className="w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 font-semibold">
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Item</th>
                    <th className="px-4 py-2">Company Price</th>
                    <th className="px-4 py-2">Rack Price</th>
                    <th className="px-4 py-2">Depot Price</th>
                    <th className="px-4 py-2">Plant Price</th>
                  </tr>
                </thead>
                <tbody>
                  {historyItems?.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{formatDate(item.date)}</td>
                      <td className="px-4 py-2">
                        {item.item?.materialdescription}
                      </td>
                      <td className="px-4 py-2">{item.companyPrice}</td>
                      <td className="px-4 py-2">{item.rackPrice}</td>
                      <td className="px-4 py-2">{item.depoPrice}</td>
                      <td className="px-4 py-2">{item.plantPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Typography className="text-center mt-6 text-lg text-gray-500">
                No Items Found!
              </Typography>
            )
          ) : (
            <Typography className="text-center mt-6 text-lg text-gray-500">
              Select Warehouse!
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
}
