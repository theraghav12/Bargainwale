import PropTypes from "prop-types";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMaterialTailwindController } from "@/context";

export function MasterSidenav({ onSelect }) {
  const [controller] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  const sidenavData = [
    {
      heading: "Warehouse",
      links: [
        { title: "Warehouse available", link: "warehouse" },
        { title: "Create warehouse", link: "warehouse" },
      ],
    },
    {
      heading: "Items",
      links: [
        { title: "Items available", link: "addItems" },
        { title: "Add Item", link: "addItems" },
      ],
    },
    {
      heading: "Transportation",
      links: [
        { title: "Transport available", link: "addTransportation" },
        { title: "Add transport", link: "addTransportation" },
      ],
    },
    {
      heading: "Buyers",
      links: [
        { title: "Buyers available", link: "addBuyer" },
        { title: "Add buyer", link: "addBuyer" },
      ],
    },
    {
      heading: "Manufacturer",
      links: [
        { title: "Manufacturer available", link: "addManufacturer" },
        { title: "Add manufacturer", link: "addManufacturer" },
      ],
    },
    // Additional items if needed...
  ];

  return (
    <>
      <aside
        className={`${sidenavTypes[sidenavType]} flex flex-col w-full h-[70vh] rounded-md border border-blue-gray-200`}
      >
        <div className="my-4 text-center">
          <h1 className="text-[1.3rem] font-bold mt-2">Menu</h1>
        </div>
        <div className="flex-grow m-4 flex flex-col items-center overflow-y-auto">
          <ul className="mb-4 flex flex-col gap-5 list-disc text-[#38454A] text-[1.1rem]">
            {sidenavData.map((item) => (
              <li key={item.heading}>
                <p className="font-semibold mb-2">{item.heading}</p>
                <ul className="ml-5 flex flex-col gap-2 list-disc text-[#565656] text-[1rem]">
                  {item.links.map((subitem) => (
                    <li
                      key={subitem.title}
                      className="hover:underline transition-all"
                    >
                      <button onClick={() => onSelect(subitem.link)}>
                        {subitem.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
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

MasterSidenav.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

MasterSidenav.displayName = "/src/widgets/layout/sidenav.jsx";

export default MasterSidenav;
