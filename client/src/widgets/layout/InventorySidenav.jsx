import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMaterialTailwindController } from "@/context";
import { getWarehouses } from "@/services/warehouseService";
import { Link } from "react-router-dom";

export function InventorySidenav({
  warehouses,
  selectedWarehouse,
  setSelectedWarehouse,
}) {
  const [controller] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };
  // const [warehouses, setWarehouses] = useState();

  // const fetchWarehouses = async () => {
  //   try {
  //     const response = await getWarehouses();
  //     setWarehouses(response);
  //   } catch (err) {
  //     console.log("Error:", err);
  //   }
  // };

  // useEffect(() => {
  //   fetchWarehouses();
  // }, []);

  useEffect(() => {
    if (warehouses?.length > 0 && !selectedWarehouse) {
      setSelectedWarehouse(warehouses[0]._id);
    }
  }, [warehouses, selectedWarehouse, setSelectedWarehouse]);

  return (
    <>
      <aside
        className={`${sidenavTypes[sidenavType]} flex flex-col w-full h-[70vh] rounded-md border border-blue-gray-200`}
      >
        <div className="my-4 text-center">
          <h1 className="text-[1.3rem] font-bold mt-2">Inventory</h1>
        </div>
        <div className="flex-grow m-4 flex flex-col items-center overflow-y-auto">
          <ul className="w-full mb-4 flex flex-col items-center gap-2 text-[#38454A] text-[1.1rem]">
            {warehouses?.map((item) => (
              <li
                key={item._id}
                className={`w-[90%] ${
                  item._id === selectedWarehouse
                    ? "bg-[#EAEAEA]"
                    : "bg-[#F9F9F9]"
                } rounded-md px-2 py-1 cursor-pointer`}
                onClick={() => setSelectedWarehouse(item._id)}
              >
                {item.name}
              </li>
            ))}
          </ul>
          <div className="w-[90%] mt-2 flex flex-col items-center gap-2">
            <p className="text-[#717171]">
              Would like to setup a new warehouse ?
            </p>
            <Link to="/dashboard/home" className="w-full bg-[#FF0000] text-white text-center rounded-md px-2 py-1">
              CREATE A WAREHOUSE
            </Link>
          </div>
        </div>
      </aside>
      <div
        className={`${sidenavTypes[sidenavType]} w-full p-4 mt-2 text-[#38454A] font-bold text-[1.1rem] text-center rounded-md border border-blue-gray-200`}
      >
        2024 @ Bargainwale
      </div>
    </>
  );
}

InventorySidenav.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

InventorySidenav.displayName = "/src/widgets/layout/sidenav.jsx";

export default InventorySidenav;
