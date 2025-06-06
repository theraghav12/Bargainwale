import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";

const bookingData = [
  {
    id: "ORD001",
    customer: "John Doe",
    total: 235.4,
    status: "Delivered",
    date: "2023-07-01",
  },
  {
    id: "ORD002",
    customer: "Jane Smith",
    total: 412.0,
    status: "Processing",
    date: "2023-07-02",
  },
  {
    id: "ORD003",
    customer: "Bob Johnson",
    total: 162.5,
    status: "Shipped",
    date: "2023-07-03",
  },
  {
    id: "ORD004",
    customer: "Alice Brown",
    total: 750.2,
    status: "Pending",
    date: "2023-07-04",
  },
  {
    id: "ORD005",
    customer: "Charlie Wilson",
    total: 95.8,
    status: "Delivered",
    date: "2023-07-05",
  },
  {
    id: "ORD006",
    customer: "Eva Martinez",
    total: 310.75,
    status: "Processing",
    date: "2023-07-06",
  },
  {
    id: "ORD007",
    customer: "David Lee",
    total: 528.9,
    status: "Shipped",
    date: "2023-07-07",
  },
  {
    id: "ORD008",
    customer: "Grace Taylor",
    total: 189.6,
    status: "Delivered",
    date: "2023-07-08",
  },
];

const BookingsTable = ({ bookingData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBookings, setFilteredBookings] = useState(bookingData);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = bookingData.filter(
      (booking) =>
        booking.BargainNo.toLowerCase().includes(term) ||
        booking.customer.toLowerCase().includes(term)
    );
    setFilteredBookings(filtered);
  }, [searchTerm, bookingData]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      throw new Error("Invalid date");
    }
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <motion.div
      className="bg-[#173DBD] bg-opacity-100 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Booking List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search bookings..."
            className="bg-white text-black text-opacity-50 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Booking ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide divide-white">
            {filteredBookings.map((booking) => (
              <motion.tr
                key={booking.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {booking.BargainNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {booking.buyer.buyer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  ₹{booking.totalAmount?.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === "fully sold"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "partially sold"
                        ? "bg-yellow-100 text-yellow-800"
                        : booking.status === "created"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {formatDate(booking.BargainDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button className="text-white hover:text-indigo-300 mr-2">
                    <Eye size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default BookingsTable;
