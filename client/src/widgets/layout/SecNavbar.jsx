import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";

function Dropdown({ label, links }) {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  const isActive = links.some((link) => link.to === location.pathname);

  // Determine if there are dropdown links
  const hasDropdownLinks = links.length > 1;

  return (
    <li
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* If there are dropdown links, use a span; otherwise, use NavLink */}
      {hasDropdownLinks ? (
        <span
          className={`text-[#38454A] text-md font-medium cursor-pointer ${
            isActive
              ? "text-black border-b-2 border-b-black"
              : "hover:text-black hover:border-b hover:border-b-2 hover:border-b-black"
          } transition-all transition-colors`}
        >
          {label}
        </span>
      ) : (
        <NavLink
          to={links[0].to}
          className={({ isActive: linkActive }) =>
            `text-[#38454A] text-md font-medium ${
              linkActive
                ? "text-black border-b-2 border-b-black"
                : "hover:text-black hover:border-b hover:border-b-2 hover:border-b-black"
            } transition-all transition-colors`
          }
        >
          {label}
        </NavLink>
      )}

      {/* Render the dropdown if there are multiple links */}
      {isHovered && hasDropdownLinks && (
        <ul className="absolute top-full bg-white shadow-lg rounded-md w-48 py-2">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.to}
                className={({ isActive: subLinkActive }) =>
                  `block px-4 py-2 text-gray-700 ${
                    subLinkActive
                      ? "text-blue-600 bg-gray-100"
                      : "hover:bg-gray-100 hover:text-blue-600"
                  }`
                }
              >
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
  const navItems = [
    { label: "Home", links: [{ name: "Home", to: "/dashboard/analytics" }] },
    { label: "Master", links: [{ name: "Master", to: "/dashboard/home" }] },
    {
      label: "Inventory",
      links: [{ name: "Inventory", to: "/dashboard/inventory" }],
    },
    {
      label: "Orders",
      links: [
        { name: "Create Order", to: "/dashboard/orders" },
        { name: "Order History", to: "/orders/history" },
      ],
    },
    {
      label: "Bookings",
      links: [
        { name: "Create Booking", to: "/dashboard/bookings" },
        { name: "Booking History", to: "/orders/history" },
      ],
    },
  ];

  return (
    <nav className="bg-white shadow-md border-b-[2px] border-b-black px-14 py-4 fixed top-16 w-full z-[101]">
      <ul className="flex justify-start gap-20 relative">
        {navItems.map((item) => (
          <Dropdown key={item.label} label={item.label} links={item.links} />
        ))}
      </ul>
    </nav>
  );
}

export default SecondNavbar;
