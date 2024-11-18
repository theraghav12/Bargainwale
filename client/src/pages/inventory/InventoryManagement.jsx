import React, { useState, useEffect } from "react";
import { getWarehouseById, getWarehouses } from "@/services/warehouseService";
import { getItemHistoryById } from "@/services/itemService";
import { ChevronDown, Check } from "lucide-react";

const InventoryTable = ({ data, type, onItemClick, expandedItem, itemHistory }) => {
  // InventoryTable component remains exactly the same as before
  if (!data?.length) {
    return (
      <div className="text-gray-500 p-8 text-center">
        No items in {type} inventory.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            {type === "sold" && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Virtual Quantity
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <React.Fragment key={index}>
              <tr 
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onItemClick(item.item._id)}
              >
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-500">
                  {item.item._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.item.materialdescription}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.quantity}
                </td>
                {type === "sold" && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.virtualQuantity}
                  </td>
                )}
              </tr>
              {expandedItem === item.item?._id && (
                <tr>
                  <td colSpan={4} className="px-6 py-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Item History</h3>
                      {itemHistory?.length > 0 ? (
                        <div className="space-y-2">
                          {itemHistory.map((history, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                            >
                              <div className="flex items-center gap-2 text-sm">
                                <span>
                                  {history.sourceModel === "Manufacturer"
                                    ? `Manufacturer: ${history.source?.manufacturer}`
                                    : history.sourceModel === "Order"
                                    ? `Order: ${history.source?.order}`
                                    : `Warehouse: ${history.source?.warehouse}`}
                                </span>
                                <span className="text-gray-400">→</span>
                                <span>
                                  {history.destinationModel === "Warehouse"
                                    ? `Warehouse: ${history.destination?.name}`
                                    : `Buyer: ${history.destination?.buyer}`}
                                </span>
                              </div>
                              <span
                                className={`font-medium ${
                                  history.destinationModel === "Warehouse"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {history.destinationModel === "Warehouse" ? "+" : "-"} 
                                {history.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No history available for this item.
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export function Inventory() {
  const [currentWarehouse, setCurrentWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("virtual");
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [pickupFilter, setPickupFilter] = useState("all");
  const [expandedItem, setExpandedItem] = useState(null);
  const [itemHistory, setItemHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const warehousesData = await getWarehouses();
        setWarehouses(warehousesData);

        // Automatically select the first warehouse if available
        if (warehousesData.length > 0) {
          setSelectedWarehouse(warehousesData[0]._id);
          const warehouse = await getWarehouseById(warehousesData[0]._id);
          setCurrentWarehouse(warehouse);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchWarehouseData = async () => {
      if (selectedWarehouse) {
        try {
          const warehouse = await getWarehouseById(selectedWarehouse);
          setCurrentWarehouse(warehouse);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchWarehouseData();
  }, [selectedWarehouse]);

  const handleItemClick = async (itemId) => {
    if (expandedItem === itemId) {
      setExpandedItem(null);
      setItemHistory([]);
    } else {
      setExpandedItem(itemId);
      try {
        const history = await getItemHistoryById(itemId);
        setItemHistory(history.data);
      } catch (error) {
        console.error("Failed to fetch item history", error);
      }
    }
  };

  const getFilteredInventory = (type) => {
    if (!currentWarehouse) return [];

    const inventory =
      type === "virtual"
        ? currentWarehouse.virtualInventory
        : type === "billed"
        ? currentWarehouse.billedInventory
        : currentWarehouse.soldInventory;

    return pickupFilter === "all"
      ? inventory
      : inventory.filter((item) => item.pickup === pickupFilter);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 p-4 bg-white border-r border-gray-200">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Select warehouse</h2>
          <div className="space-y-2">
            {warehouses.map((warehouse) => (
              <button
                key={warehouse._id}
                onClick={() => setSelectedWarehouse(warehouse._id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-md transition-colors ${
                  selectedWarehouse === warehouse._id
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <span>{warehouse.name}</span>
                {selectedWarehouse === warehouse._id && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between px-4">
              <div className="flex space-x-4">
                {["virtual", "billed", "sold"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`py-4 px-4 text-sm font-medium border-b-2 ${
                      selectedTab === tab
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {selectedTab !== "billed" && (
                <div className="relative">
                  <select
                    value={pickupFilter}
                    onChange={(e) => setPickupFilter(e.target.value)}
                    className="appearance-none w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Pickups</option>
                    <option value="rack">Rack</option>
                    <option value="depot">Depot</option>
                    <option value="plant">Plant</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            ) : !currentWarehouse ? (
              <div className="text-center text-gray-500 py-12">
                Please select a warehouse to view inventory
              </div>
            ) : (
              <div className="overflow-hidden">
                <InventoryTable
                  data={getFilteredInventory(selectedTab)}
                  type={selectedTab}
                  onItemClick={handleItemClick}
                  expandedItem={expandedItem}
                  itemHistory={itemHistory}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
