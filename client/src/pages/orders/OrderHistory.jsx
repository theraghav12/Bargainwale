import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { toast } from "sonner";
import Datepicker from "react-tailwindcss-datepicker";
import * as XLSX from "xlsx";

// services
import { deleteOrder, getOrders } from "@/services/orderService";
import { getBookings } from "@/services/bookingService";

// icons
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import excel from "../../assets/excel.svg";
import { MdDeleteOutline } from "react-icons/md";

export function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditOrderForm, setShowEditOrderForm] = useState(false);
  const [openOrder, setOpenOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timePeriod, setTimePeriod] = useState("All");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState();

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      const ordersData = response;

      // Filter orders based on status
      let filteredOrders =
        statusFilter === "All"
          ? ordersData
          : ordersData.filter((order) => order.status === statusFilter);

      // Filter orders based on time period
      const now = new Date();
      let filterDate;

      if (timePeriod === "last7Days") {
        filterDate = new Date();
        filterDate.setDate(now.getDate() - 7);
        filteredOrders = filteredOrders.filter(
          (order) => new Date(order.companyBargainDate) >= filterDate
        );
      } else if (timePeriod === "last30Days") {
        filterDate = new Date();
        filterDate.setDate(now.getDate() - 30);
        filteredOrders = filteredOrders.filter(
          (order) => new Date(order.companyBargainDate) >= filterDate
        );
      } else if (
        timePeriod === "custom" &&
        dateRange.startDate &&
        dateRange.endDate
      ) {
        const start = new Date(dateRange.startDate);
        const end = new Date(dateRange.endDate);
        filteredOrders = filteredOrders.filter((order) => {
          const orderDate = new Date(order.companyBargainDate);
          return orderDate >= start && orderDate <= end;
        });
      }

      if (searchQuery) {
        filteredOrders = filteredOrders.filter((order) =>
          order.companyBargainNo
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      }

      // Sort orders by companyBargainDate in descending order
      filteredOrders.sort(
        (a, b) =>
          new Date(b.companyBargainDate) - new Date(a.companyBargainDate)
      );

      setOrders(filteredOrders);
    } catch (error) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await getBookings();
      setBookings(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchBookings();
  }, [statusFilter, timePeriod, dateRange, searchQuery]);

  const hasFutureBookings = (order, bookings) => {
    return bookings?.some(
      (booking) => new Date(booking?.createdAt) > new Date(order?.createdAt)
    );
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

  const handleToggleOrder = (orderId) => {
    setOpenOrder(openOrder === orderId ? null : orderId);
  };

  console.log(orders);

  const handleDownloadExcel = () => {
    const formattedOrders = orders.map((order) => ({
      "Company Bargain No": order.companyBargainNo,
      "Company Bargain Date": formatDate(order.companyBargainDate),
      "Seller Name": order.sellerName,
      "Seller Location": order.sellerLocation,
      "Seller Contact": order.sellerContact,
      Status: order.status,
      "Transport Type": order.transportType,
      "Transport Location": order.transportLocation,
      "Bill Type": order.billType,
      Description: order.description,
      "Created At": formatDate(order.createdAt),
      "Updated At": formatDate(order.updatedAt),
      "Payment Days": order.paymentDays,
      "Reminder Days": order.reminderDays.join(", "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders.xlsx");
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      fetchOrders();
      toast.error("Order Deleted");
    } catch (err) {
      console.log("Error:", err);
    }
  };

  console.log(orders);

  return (
    <div className="mt-8 mb-8 flex flex-col gap-12">
      <div className="px-7">
        <div className="flex flex-row justify-between">
          <div>
            <button
              onClick={handleDownloadExcel}
              className="w-fit bg-[#185C37] py-2 text-white text-[1rem] font-medium rounded-lg px-8 flex flex-row items-center justify-center border-2 border-[#999999] gap-1"
            >
              <img className="w-5" src={excel} />
              Download as Excel
            </button>
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border-[2px] border-[#737373] rounded px-2 py-2"
            >
              <option value="All">All Statuses</option>
              <option value="created">Created</option>
              <option value="partially paid">Partially Paid</option>
              <option value="billed">Billed</option>
            </select>
            <select
              value={timePeriod}
              onChange={(e) => {
                setTimePeriod(e.target.value);
                if (e.target.value !== "custom") {
                  setStartDate("");
                  setEndDate("");
                }
              }}
              className="border-[2px] border-[#737373] rounded px-2 py-2"
            >
              <option value="All">All Time</option>
              <option value="last7Days">Last 7 Days</option>
              <option value="last30Days">Last 30 Days</option>
              <option value="custom">Custom</option>
            </select>
            {timePeriod === "custom" && (
              <Datepicker
                value={dateRange}
                onChange={(newValue) => setDateRange(newValue)}
                showShortcuts={true}
                className="w-full max-w-sm"
              />
            )}
            <input
              name="companyBargainNo"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Bargain No."
              className="border-[2px] border-[#737373] px-2 py-1 rounded-md placeholder-[#737373]"
              // className=" rounded px-2 py-2"
            />
            {/* <Input
                  type="text"
                  value={searchQuery}
                  label="Search by Bargain No"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border rounded px-2 py-2"
                /> */}
          </div>
          <div className="flex flex-row gap-4">
            {/* <button className="w-fit bg-[#FF0000] text-white text-[1rem] font-medium rounded-lg px-8 flex flex-row items-center justify-center border-2 border-black gap-1">
              Delete
            </button>
            <button className="w-fit bg-[#38454A] text-white text-[1rem] font-medium rounded-lg px-8 flex flex-row items-center justify-center border-2 border-black gap-1">
              Edit
            </button>
            <button className="w-fit bg-[#DCDCDC] text-black text-[1rem] font-medium rounded-lg px-8 flex flex-row items-center justify-center border-2 border-black gap-1">
              PUBLISH
            </button> */}
          </div>
        </div>
        <div className="overflow-x-scroll px-0 pt-0 pb-2 mt-2">
          {loading ? (
            <Typography className="text-center text-blue-gray-600">
              Loading...
            </Typography>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : orders.length > 0 ? (
            <div className="flex flex-col gap-4 mt-4 mb-5 bg-white border-[2px] border-[#737373] shadow-md">
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr>
                      {[
                        "Company Bargain No",
                        "Company Bargain Date",
                        "Manufacturer Name",
                        "Manufacturer Company",
                        "Manufacturer Contact",
                        "Status",
                        "Inco",
                        "Actions",
                      ].map((el) => (
                        <th key={el} className="py-4 text-center w-[200px]">
                          {el}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const isOpen = openOrder === order._id;
                      return (
                        <React.Fragment key={order._id}>
                          <tr className="border-t-2 border-t-[#898989]">
                            <td className="py-4 text-center">
                              {order.companyBargainNo}
                            </td>
                            <td className="py-4 text-center">
                              {formatDate(order.companyBargainDate)}
                            </td>
                            <td className="py-4 text-center">
                              {order.manufacturer?.manufacturer}
                            </td>
                            <td className="py-4 text-center">
                              {order.manufacturer?.manufacturerCompany}
                            </td>
                            <td className="py-4 text-center">
                              {order.manufacturer?.manufacturerContact}
                            </td>
                            <td className="py-4 text-center">
                              <Chip
                                variant="ghost"
                                value={order.status}
                                color={
                                  order.status === "created"
                                    ? "blue"
                                    : order.status === "partially paid"
                                    ? "yellow"
                                    : order.status === "billed"
                                    ? "green"
                                    : "red"
                                }
                              />
                            </td>
                            <td className="py-4 text-center">{order.inco}</td>
                            <td className="py-4 text-center">
                              <div className="flex justify-center gap-4">
                                <IconButton
                                  variant="text"
                                  onClick={() => handleToggleOrder(order._id)}
                                  className="bg-gray-300"
                                >
                                  {isOpen ? (
                                    <ChevronUpIcon className="h-5 w-5" />
                                  ) : (
                                    <ChevronDownIcon className="h-5 w-5" />
                                  )}
                                </IconButton>
                                {!hasFutureBookings(order, bookings) && (
                                  <Tooltip content="Delete Order">
                                    <span className="w-fit h-fit">
                                      <MdDeleteOutline
                                        onClick={() => handleDelete(order._id)}
                                        className="text-[2.4rem] text-red-700 border border-2 border-red-700 rounded-md hover:bg-red-700 hover:text-white transition-all cursor-pointer"
                                      />
                                    </span>
                                  </Tooltip>
                                )}
                              </div>
                            </td>
                          </tr>
                          {isOpen && (
                            <tr className="bg-gray-100 border-t-2 border-t-[#898989]">
                              <td colSpan="11">
                                <div className="p-4 border-t border-blue-gray-200">
                                  <table className="min-w-full table-auto border-collapse">
                                    <thead>
                                      <tr>
                                        {[
                                          "Item Name",
                                          "Packaging",
                                          "Weight",
                                          "Cont. No.",
                                          "Pickup",
                                          "Quantity",
                                          "Base Price (Rs.)",
                                          "GST %",
                                          "Tax Paid Amt.",
                                        ].map((header) => (
                                          <th
                                            key={header}
                                            className="py-4 text-center w-[200px]"
                                          >
                                            {header}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {order.items.map((item) => (
                                        <tr
                                          key={item._id}
                                          className="border-t-2 border-t-[#898989]"
                                        >
                                          <td className="py-4 text-center">
                                            {item.item?.materialdescription}
                                          </td>
                                          <td className="py-4 text-center">
                                            {item.item.packaging}
                                          </td>
                                          <td className="py-4 text-center">
                                            {item.item.netweight}
                                          </td>
                                          <td className="py-4 text-center">
                                            {item.contNumber}
                                          </td>
                                          <td className="py-4 text-center">
                                            {item.pickup}
                                          </td>
                                          <td className="py-4 text-center">
                                            {item.quantity}
                                          </td>
                                          <td className="py-4 text-center">
                                            {item.baseRate}
                                          </td>
                                          <td className="py-4 text-center">
                                            {item.igst ? (
                                              <span>{item.igst}% (IGST)</span>
                                            ) : (
                                              <span>
                                                {item.cgst}% (CGST) +{" "}
                                                {item.sgst}&
                                              </span>
                                            )}
                                          </td>
                                          <td className="py-4 text-center">
                                            {item.taxpaidAmount}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-center text-[1.2rem] text-blue-gray-600 mt-20">
              No orders found!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
