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

export function Inventory() {
  const [currentWarehouse, setCurrentWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("virtual");
  const [transferQuantities, setTransferQuantities] = useState({});
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");

  useEffect(() => {
    fetchWarehouses();
    const storedWarehouseID = selectedWarehouse;
    const response = getWarehouseById(selectedWarehouse);
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
      console.log(response);
      setWarehouses(response);
    } catch (err) {
      console.log(err);
    }
  };

  const renderInventoryTable = (inventoryType) => {
    const inventory =
      inventoryType === "virtual"
        ? currentWarehouse.virtualInventory
        : currentWarehouse.billedInventory;
    const tableTitle =
      inventoryType === "virtual" ? "Virtual Inventory" : "Billed Inventory";

    return (
      <div className="bg-white rounded-lg shadow-md border-2 border-[#929292] mb-8">
        <h1 className="text-[1.1rem] text-[#636363] px-8 py-2 border-b-2 border-b-[#929292]">
          {tableTitle}
        </h1>
        {inventory.length > 0 ? (
          <div className="p-10 pt-5">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="grid grid-cols-3">
                    <th className="py-2 px-4 text-start">Item Name</th>
                    <th className="py-2 px-4 text-start">Weight (kg)</th>
                    <th className="py-2 px-4 text-start">Quantity</th>
                  </tr>
                </thead>
                <tbody className="flex flex-col gap-2">
                  {inventory.map((item, index) => (
                    <tr
                      key={index}
                      className="grid grid-cols-3 items-center border border-[#7F7F7F] rounded-md shadow-md"
                    >
                      <td className="px-4 py-2">{item.itemName}</td>
                      <td className="px-4 py-2">{item.weight}</td>
                      <td className="px-4 py-2">{item.quantity}</td>
                    </tr>
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
        <div className="w-full mt-12 mb-8">
          <Tabs value="virtual">
            <TabsHeader className="bg-[#7E8B90]">
              <Tab value="virtual" onClick={() => setSelectedTab("virtual")}>
                Virtual
              </Tab>
              <Tab value="billed" onClick={() => setSelectedTab("billed")}>
                Billed
              </Tab>
              <Tab
                value="order virtual"
                onClick={() => setSelectedTab("order virtual")}
              >
                Order Virtual
              </Tab>
              <Tab
                value="booking virtual"
                onClick={() => setSelectedTab("booking virtual")}
              >
                Booking Virtual
              </Tab>
            </TabsHeader>
          </Tabs>
        </div>

        <div>
          {currentWarehouse !== null ? (
            loading ? (
              <div className="flex justify-center items-center">
                <Spinner color="blue" size="lg" />
              </div>
            ) : currentWarehouse !== "" ? (
              selectedTab === "virtual" ? (
                renderInventoryTable("virtual")
              ) : (
                renderInventoryTable("billed")
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
