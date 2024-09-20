import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
} from "@material-tailwind/react";
import { MasterSidenav } from "@/widgets/layout";
import {
  createWarehouse,
  fetchWarehouse,
  getWarehouseById,
} from "@/services/warehouseService";
import { useNavigate } from "react-router-dom";
import statesAndCities from "@/data/statecities.json";
import { toast } from "react-toastify";
import ItemForm from "@/components/master/ItemForm";
import TransportForm from "@/components/master/TransportForm";
import WarehouseForm from "@/components/master/WarehouseForm";
import BuyerForm from "@/components/master/BuyerForm";
import ManufacturerForm from "@/components/master/ManufacturerForm";

export function WarehouseMaster() {
  const [selectedComponent, setSelectedComponent] = useState("warehouse");

  const data = [
    { label: "Warehouse", value: "warehouse" },
    { label: "Add Items", value: "addItems" },
    { label: "Add Transportation", value: "addTransportation" },
    { label: "Add Buyer", value: "addBuyer" },
    { label: "Add Manufacturer", value: "addManufacturer" },
  ];

  const renderComponent = () => {
    switch (selectedComponent) {
      case "warehouse":
        return <WarehouseForm />;
      case "addItems":
        return <ItemForm />;
      case "addTransportation":
        return <TransportForm />;
      case "addBuyer":
        return <BuyerForm />;
      case "addManufacturer":
        return <ManufacturerForm />;
      default:
        return null;
    }
  };

  const states = Object.keys(statesAndCities);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [warehouseName, setWarehouseName] = useState("");
  const [selectedWarehouseID, setSelectedWarehouseID] = useState("");
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [currentWarehouse, setCurrentWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedWarehouseID = localStorage.getItem("warehouse");
    if (storedWarehouseID) {
      getWarehouseById(storedWarehouseID).then((warehouse) => {
        setCurrentWarehouse(warehouse);
        setSelectedWarehouseID(storedWarehouseID);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setSelectedCity("");
    setFilteredWarehouses([]);
  }, [selectedState]);

  useEffect(() => {
    const fetchFilteredWarehouses = async () => {
      if (selectedCity && selectedState) {
        setLoading(true);
        const warehousesData = await fetchWarehouse(
          selectedState,
          selectedCity
        );
        setFilteredWarehouses(warehousesData?.warehouses);
        setLoading(false);
      } else {
        setFilteredWarehouses([]);
        setLoading(false);
      }
    };

    fetchFilteredWarehouses();
  }, [selectedCity]);

  const handleWarehouseSubmit = async () => {
    setLoading(true);
    if (selectedWarehouseID) {
      toast.success(
        "Existing warehouse selected. Proceeding with the selected warehouse."
      );
      const response = await getWarehouseById(selectedWarehouseID);
      localStorage.setItem("warehouse", response._id);
      navigate("/dashboard/orders");
    } else {
      toast.success("Proceeding with new warehouse creation!");
      const response = await createWarehouse({
        name: warehouseName,
        location: { state: selectedState, city: selectedCity },
      });
      localStorage.setItem("warehouse", response.warehouse._id);
      navigate("/orders");
    }
    setLoading(false);
  };

  const handleChangeWarehouse = () => {
    setCurrentWarehouse(null);
    setSelectedState("");
    setSelectedCity("");
    setWarehouseName("");
    setSelectedWarehouseID("");
    localStorage.removeItem("warehouse");
  };

  //  const getCurrentSectionTitle = () => {
  //    switch (selectedComponent) {
  //      case "warehouse":
  //        return "Warehouse ";
  //      case "addItems":
  //        return "Items ";
  //      case "addTransportation":
  //        return "Transportation ";
  //      case "addBuyer":
  //        return "Buyer ";
  //      case "addManufacturer":
  //        return "Manufacturer ";
  //      default:
  //        return "Warehouse ";
  //    }
  //  };

  return (
    <div className="flex">
      <div className="fixed w-[20%] p-5">
        <MasterSidenav onSelect={setSelectedComponent} />
      </div>

      <div className="w-full ml-[19%] px-5">
        {/* <div className="bg-white rounded-lg shadow-md border-2 border-[#929292] mt-12 mb-8">
          <h1 className="text-[1.1rem] text-[#636363] px-8 py-2 border-b-2 border-b-[#929292]">
            {getCurrentSectionTitle()}
            <span className="text-[1.5rem] text-black">/ Available</span>
          </h1> */}
          <div className="p-10">{renderComponent()}</div>
        {/* </div> */}
      </div>
    </div>
  );
}

export default WarehouseMaster;
