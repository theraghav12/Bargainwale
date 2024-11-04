import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  FaHome,
  FaCogs,
  FaBox,
  FaShoppingCart,
  FaClipboardList,
  FaBook,
  FaChartLine,
  FaBell,
  FaPlus,
  FaHistory,
  FaChartBar,
} from "react-icons/fa";
import { RiDiscountPercentFill } from "react-icons/ri";

function Dropdown({ label, links, icon }) {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  const isActive = links.some((link) => link.to === location.pathname);
  const hasDropdownLinks = links.length > 1;

  return (
    <li
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {hasDropdownLinks ? (
        <span
          className={`flex items-center gap-2 text-md font-medium cursor-pointer ${
            isActive
              ? "text-blue-600 border-b-2 border-b-blue-600"
              : "text-[#38454A] hover:text-blue-600 hover:border-b hover:border-b-2 hover:border-b-blue-600"
          } transition-all transition-colors`}
        >
          {label}
          {icon}
        </span>
      ) : (
        <NavLink
          to={links[0].to}
          className={({ isActive: linkActive }) =>
            `flex items-center gap-2 text-md font-medium ${
              linkActive
                ? "text-blue-600 border-b-2 border-b-blue-600"
                : "text-[#38454A] hover:text-blue-600 hover:border-b hover:border-b-2 hover:border-b-blue-600"
            } transition-all transition-colors`
          }
        >
          {label}
          {icon}
        </NavLink>
      )}

      {isHovered && hasDropdownLinks && (
        <ul className="absolute top-full bg-white shadow-lg rounded-md w-48 py-2">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.to}
                className={({ isActive: subLinkActive }) =>
                  `flex items-center gap-2 px-4 py-2 ${
                    subLinkActive
                      ? "text-blue-600 bg-gray-100"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function SecondNavbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showDailyUpdate, setShowDailyUpdate] = useState(false);
  const drawerRef = useRef(null);

  const navItems = [
    {
      label: "Home",
      links: [{ name: "Home", to: "/dashboard" }],
      icon: <FaHome />,
    },
    {
      label: "Master",
      links: [{ name: "Master", to: "/master" }],
      icon: <FaCogs />,
    },
    {
      label: "Inventory",
      links: [{ name: "Inventory", to: "/inventory" }],
      icon: <FaBox />,
    },
    {
      label: "Orders",
      links: [
        { name: "Create Order", to: "/orders/create", icon: <FaPlus /> },
        { name: "Order History", to: "/orders/history", icon: <FaHistory /> },
        {
          name: "Order Analytics",
          to: "/orders/analytics",
          icon: <FaChartBar />,
        },
      ],
      icon: <FaClipboardList />,
    },
    {
      label: "Bookings",
      links: [
        { name: "Create Booking", to: "/bookings/create", icon: <FaPlus /> },
        {
          name: "Booking History",
          to: "/bookings/history",
          icon: <FaHistory />,
        },
        {
          name: "Booking Analytics",
          to: "/bookings/analytics",
          icon: <FaChartBar />,
        },
        {
          name: "Discount Approval",
          to: "/discount",
          icon: <RiDiscountPercentFill />,
        },
      ],
      icon: <FaBook />,
    },
    {
      label: "Purchase",
      links: [
        { name: "Create Purchase", to: "/purchase/create", icon: <FaPlus /> },
        {
          name: "Purchase History",
          to: "/purchase/history",
          icon: <FaHistory />,
        },
        {
          name: "Purchase Analytics",
          to: "/purchase/analytics",
          icon: <FaChartBar />,
        },
      ],
      icon: <FaShoppingCart />,
    },
    {
      label: "Sales",
      links: [
        { name: "Create Sales", to: "/sales/create", icon: <FaPlus /> },
        { name: "Sales History", to: "/sales/history", icon: <FaHistory /> },
        {
          name: "Sales Analytics",
          to: "/sales/analytics",
          icon: <FaChartBar />,
        },
      ],
      icon: <FaChartLine />,
    },
  ];

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsDrawerOpen(false);
      }
    };

    if (isDrawerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      if (hours === 9 && minutes === 30) {
        setShowDailyUpdate(true);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-white shadow-md border-b-[2px] border-y-light-blue-900 px-14 py-4 fixed top-16 w-full z-50">
      <ul className="flex justify-start gap-20 relative">
        {navItems.map((item) => (
          <Dropdown
            key={item.label}
            label={item.label}
            links={item.links}
            icon={item.icon}
          />
        ))}
        {/* Bell Icon for Notifications */}
        <li className="ml-auto">
          <button
            onClick={toggleDrawer}
            className="text-[#38454A] hover:text-blue-600"
          >
            <FaBell size={20} />
          </button>
        </li>
      </ul>

      {/* Dark Blur Overlay */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-[101]"
        ></div>
      )}

      {/* Sliding Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full bg-white shadow-lg p-4 transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        } w-80 z-[102]`}
      >
        <button onClick={toggleDrawer} className="text-gray-600 text-xl mb-4">
          Close
        </button>
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <p className="text-gray-600">No new notifications.</p>
      </div>

      {/* Daily Update Card */}
      {showDailyUpdate && (
        <div className="fixed bottom-10 right-10 bg-white p-4 shadow-lg rounded-lg border border-gray-200 w-72 z-[102]">
          <h3 className="text-lg font-semibold text-blue-600">Daily Update</h3>
          <p className="text-gray-700 mt-2">
            This is your update for today at 9:30 AM.
          </p>
          <button
            onClick={() => setShowDailyUpdate(false)}
            className="text-blue-600 mt-3 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </nav>
  );
}

export default SecondNavbar;
