import PropTypes from "prop-types";
import { useMaterialTailwindController } from "@/context";
import { FiHome, FiBox, FiTruck, FiUsers, FiSettings } from "react-icons/fi";

export function MasterSidenav({ onSelect }) {
  const [controller] = useMaterialTailwindController();
  const { sidenavType } = controller;

  const sidenavTypes = {
    dark: "bg-gray-900 text-white border-gray-700",
    white: "bg-white text-gray-800 border-gray-300 shadow-lg",
    transparent: "bg-transparent text-gray-700 border-gray-300",
  };

  const sidenavData = [
    {
      heading: "Warehouse",
      icon: <FiHome />,
      links: [
        { title: "Warehouse available", link: "warehouse" },
        { title: "Create warehouse", link: "warehouse" },
      ],
    },
    {
      heading: "Items",
      icon: <FiBox />,
      links: [
        { title: "Items available", link: "addItems" },
        { title: "Add Item", link: "addItems" },
      ],
    },
    {
      heading: "Transportation",
      icon: <FiTruck />,
      links: [
        { title: "Transport available", link: "addTransportation" },
        { title: "Add transport", link: "addTransportation" },
      ],
    },
    {
      heading: "Buyers",
      icon: <FiUsers />,
      links: [
        { title: "Buyers available", link: "addBuyer" },
        { title: "Add buyer", link: "addBuyer" },
      ],
    },
    {
      heading: "Manufacturer",
      icon: <FiSettings />,
      links: [
        { title: "Manufacturer available", link: "addManufacturer" },
        { title: "Add manufacturer", link: "addManufacturer" },
      ],
    },
  ];

  return (
    <div
      className={`flex flex-col w-64 h-screen ${sidenavTypes[sidenavType]} border rounded-lg`}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h1 className="text-lg font-bold tracking-wide">BargainWala Menu</h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-grow overflow-y-auto px-4 py-6">
        {sidenavData.map((item) => (
          <div key={item.heading} className="mb-6">
            {/* Section Heading */}
            <div className="flex items-center mb-2">
              <div className="text-lg text-blue-500 mr-3">{item.icon}</div>
              <h2 className="text-base font-semibold">{item.heading}</h2>
            </div>

            {/* Links */}
            <ul className="pl-10 space-y-2">
              {item.links.map((subitem) => (
                <li key={subitem.title}>
                  <button
                    onClick={() => onSelect(subitem.link)}
                    className="text-sm text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    {subitem.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <footer className="px-6 py-4 border-t">
        <div className="text-center text-sm font-medium">
          <span className="block">© 2024 Bargainwale</span>
          <span className="text-gray-500">All rights reserved</span>
        </div>
      </footer>
    </div>
  );
}

MasterSidenav.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

MasterSidenav.displayName = "/src/widgets/layout/sidenav.jsx";

export default MasterSidenav;
