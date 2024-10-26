import React, { useState, useEffect } from "react";
import {
  Typography,
  Spinner,
  Tabs,
  TabsHeader,
  Tab,
} from "@material-tailwind/react";

// components
import InventorySidenav from "@/widgets/layout/InventorySidenav";

// api services
import { getWarehouseById, getWarehouses } from "@/services/warehouseService";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { getItemHistoryById } from "@/services/itemService";

export function Inventory() {
  const [currentWarehouse, setCurrentWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("virtual");
  const [transferQuantities, setTransferQuantities] = useState({});
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [pickupFilter, setPickupFilter] = useState("all");
  const [expandedItem, setExpandedItem] = useState(null);
  const [itemHistory, setItemHistory] = useState([]);

  useEffect(() => {
    fetchWarehouses();
    const storedWarehouseID = selectedWarehouse;
    if (storedWarehouseID) {
      getWarehouseById(storedWarehouseID).then((warehouse) => {
        setCurrentWarehouse(warehouse);
        setLoading(false);
      });
    }
  }, [selectedWarehouse]);

  const fetchWarehouses = async () => {
    try {
      const response = await getWarehouses();
      setWarehouses(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleItemClick = async (itemId) => {
    if (expandedItem === itemId) {
      setExpandedItem(null);
      setItemHistory([]);
    } else {
      setExpandedItem(itemId);
      try {
        const history = await getItemHistoryById(itemId);
        setItemHistory(history);
      } catch (error) {
        console.log("Failed to fetch item history", error);
      }
    }
  };

  const renderInventoryTable = (inventoryType) => {
    const inventory =
      inventoryType === "virtual"
        ? currentWarehouse.virtualInventory
        : inventoryType === "billed"
        ? currentWarehouse.billedInventory
        : currentWarehouse.soldInventory;

    const tableTitle =
      inventoryType === "virtual"
        ? "Virtual Inventory"
        : inventoryType === "billed"
        ? "Billed Inventory"
        : "Booked Items Inventory";

    // Filter inventory based on pickup options
    const filteredInventory =
      pickupFilter === "all"
        ? inventory
        : inventory.filter((item) => item.pickup === pickupFilter);

    return (
      <div className="bg-white rounded-lg shadow-md border-2 border-[#929292] mt-5 mb-8 ">
        <h1 className="text-[1.1rem] text-[#636363] px-8 py-2 border-b-2 border-b-[#929292]">
          {tableTitle}
        </h1>

        {filteredInventory.length > 0 ? (
          <div className="p-10 pt-5">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr
                    className={`grid grid-cols-${
                      inventoryType === "sold" ? "3" : "2"
                    }`}
                  >
                    <th className="py-2 px-4 text-start">Item Name</th>
                    <th className="py-2 px-4 text-start">Quantity</th>
                    {inventoryType === "sold" && (
                      <th className="py-2 px-4 text-start">Virtual Quantity</th>
                    )}
                  </tr>
                </thead>
                <tbody className="flex flex-col gap-2">
                  {filteredInventory.map((item, index) => (
                    <React.Fragment key={index}>
                      <tr
                        className={`grid grid-cols-${
                          inventoryType === "sold" ? "3" : "2"
                        } items-center border border-[#7F7F7F] rounded-md shadow-md cursor-pointer`}
                        onClick={() => handleItemClick(item._id)}
                      >
                        <td className="px-4 py-2">{item.item}</td>
                        <td className="px-4 py-2">{item.quantity}</td>
                        {inventoryType === "sold" && (
                          <td className="px-4 py-2">{item.virtualQuantity}</td>
                        )}
                      </tr>
                      {expandedItem === item.id && (
                        <tr className="bg-gray-100">
                          <td colSpan={inventoryType === "sold" ? 3 : 2}>
                            <div className="p-4">
                              <h3 className="font-semibold text-gray-600 mb-2">
                                Item History
                              </h3>
                              {itemHistory.length > 0 ? (
                                <ul>
                                  {itemHistory.map((history, idx) => (
                                    <li
                                      key={idx}
                                      className="flex justify-between mb-2"
                                    >
                                      <span>Quantity: {history.quantity}</span>
                                      <span>Source: {history.sourceName}</span>
                                      <span>
                                        Destination: {history.destinationName}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p>No history available for this item.</p>
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
          </div>
        ) : (
          <p className="p-5 text-[#717171]">
            No items in {tableTitle.toLowerCase()}.
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="flex">
      <div className="fixed w-[20%] p-5">
        <InventorySidenav
          warehouses={warehouses}
          selectedWarehouse={selectedWarehouse}
          setSelectedWarehouse={setSelectedWarehouse}
        />
      </div>

      <div className="w-full ml-[19%] px-5">
        <div className="w-full mt-12 mb-5">
          <Tabs value="virtual">
            <TabsHeader className="bg-[#7E8B90]">
              <Tab value="virtual" onClick={() => setSelectedTab("virtual")}>
                Virtual
              </Tab>
              <Tab value="billed" onClick={() => setSelectedTab("billed")}>
                Billed
              </Tab>
              <Tab value="sold" onClick={() => setSelectedTab("sold")}>
                Booked Items
              </Tab>
            </TabsHeader>
          </Tabs>
        </div>

        {/* Pickup filter options */}
        {selectedTab !== "billed" && (
          <div className="px-8 flex items-center justify-end">
            <label className="mr-2">Filter by Pickup:</label>
            <div className="relative w-[180px]">
              <select
                value={pickupFilter}
                onChange={(e) => setPickupFilter(e.target.value)}
                className="appearance-none w-full bg-white border-2 border-[#CBCDCE] text-[#38454A] px-4 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBCDCE] cursor-pointer"
              >
                <option value="all">All</option>
                <option value="rack">Rack</option>
                <option value="depot">Depot</option>
                <option value="plant">Plant</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <TbTriangleInvertedFilled className="text-[#5E5E5E]" />
              </div>
            </div>
          </div>
        )}

        <div>
          {currentWarehouse !== null ? (
            loading ? (
              <div className="flex justify-center items-center">
                <Spinner color="blue" size="lg" />
              </div>
            ) : currentWarehouse !== "" ? (
              selectedTab === "virtual" ? (
                renderInventoryTable("virtual")
              ) : selectedTab === "billed" ? (
                renderInventoryTable("billed")
              ) : (
                renderInventoryTable("sold")
              )
            ) : (
              <Typography variant="body2" className="mt-5 text-center">
                No warehouse selected.
              </Typography>
            )
          ) : (
            <Typography variant="body2" className="mt-5 text-center">
              No warehouse selected.
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
}

export default Inventory;
