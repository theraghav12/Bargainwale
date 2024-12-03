import React, { useState, useEffect } from "react";
import {
  Typography,
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
  const [openOrder, setOpenOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
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

      let filteredOrders =
        statusFilter === "All"
          ? ordersData
          : ordersData.filter((order) => order.status === statusFilter);

      const now = new Date();
      if (timePeriod === "last7Days") {
        const filterDate = new Date();
        filterDate.setDate(now.getDate() - 7);
        filteredOrders = filteredOrders.filter(
          (order) => new Date(order.companyBargainDate) >= filterDate
        );
      } else if (timePeriod === "last30Days") {
        const filterDate = new Date();
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

      filteredOrders.sort((a, b) => {
        const bargainDateComparison =
          new Date(b.companyBargainDate) - new Date(a.companyBargainDate);
        if (bargainDateComparison !== 0) {
          return bargainDateComparison;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

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

  function formatTimestamp(isoTimestamp) {
    const date = new Date(isoTimestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  const handleToggleOrder = (orderId) => {
    setOpenOrder(openOrder === orderId ? null : orderId);
  };

  const handleDownloadExcel = () => {
    const formattedOrders = orders.flatMap((order) =>
      order.items.map((item) => ({
        "Company Bargain No": order.companyBargainNo,
        "Company Bargain Date": formatDate(order.companyBargainDate),
        "Manufacturer Name": order.manufacturer?.manufacturer || "N/A",
        "Manufacturer Location": [
          order.manufacturer?.manufacturerdeliveryAddress?.addressLine1,
          order.manufacturer?.manufacturerdeliveryAddress?.addressLine2,
          order.manufacturer?.manufacturerdeliveryAddress?.city,
          order.manufacturer?.manufacturerdeliveryAddress?.state,
          order.manufacturer?.manufacturerdeliveryAddress?.pinCode,
        ]
          .filter(Boolean)
          .join(", "),
        "Manufacturer Contact":
          order.manufacturer?.manufacturerContact || "N/A",
        "Warehouse Name": order.warehouse?.name || "N/A",
        "Warehouse Location": [
          order.warehouse?.location?.addressLine1,
          order.warehouse?.location?.addressLine2,
          order.warehouse?.location?.city,
          order.warehouse?.location?.state,
          order.warehouse?.location?.pinCode,
        ]
          .filter(Boolean)
          .join(", "),
        Status: order.status,
        Inco: order.inco,
        "Bill Type": order.billType,
        Description: order.description || "N/A",
        "Item Flavor": item.item?.flavor || "N/A",
        "Item Material": item.item?.material || "N/A",
        "Item Description": item.item?.materialdescription || "",
        "Item Net Weight": item.item?.netweight || "N/A",
        "Item Gross Weight": item.item?.grossweight || "N/A",
        "Item Container Number": item.contNumber || "N/A",
        "Item Quantity": item.quantity || "N/A",
        "Purchase Quantity": item.purchaseQuantity || "N/A",
        "Pickup Location": item.pickup || "N/A",
        "Base Rate": item.baseRate || "N/A",
        "Taxable Amount": item.taxableAmount || "N/A",
        "Tax Paid Amount": item.taxpaidAmount || "N/A",
        GST: item.gst || "N/A",
        SGST: item.sgst || "N/A",
        CGST: item.cgst || "N/A",
        IGST: item.igst || "N/A",
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(formattedOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "Orders.xlsx");
    toast.success("Order history downloaded successfully!");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this order?"
    );
    if (!confirmDelete) return;

    try {
      await deleteOrder(id);
      fetchOrders();
      toast.error("Order Deleted");
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <div className="mt-8 mb-8 flex flex-col gap-12">
      <div className="px-7">
        <div className="flex flex-row justify-between items-center">
          <button
            onClick={handleDownloadExcel}
            className="flex items-center bg-[#185C37] text-white font-medium rounded-lg px-8 py-2 border-2 border-[#999999] hover:bg-[#14522e] transition-colors"
          >
            <img className="w-5 mr-2" src={excel} alt="Download Excel" />
            Download Excel
          </button>

          <div className="flex gap-4 items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border-2 border-[#737373] rounded px-3 py-2 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="created">Created</option>
              <option value="partially paid">Partially Paid</option>
              <option value="billed">Billed</option>
            </select>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="border-2 border-[#737373] rounded px-3 py-2 focus:outline-none"
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
                className="w-full max-w-xs"
              />
            )}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Bargain No."
              className="border-2 border-[#737373] px-3 py-2 rounded-md placeholder-gray-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          {loading ? (
            <Typography className="text-center text-gray-500">
              Loading...
            </Typography>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : orders.length > 0 ? (
            <div className="bg-white border-2 border-gray-300 shadow-md rounded-lg">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    {[
                      "Created At",
                      "Company Bargain No",
                      "Company Bargain Date",
                      "Manufacturer Name",
                      "Manufacturer Company",
                      "Manufacturer Contact",
                      "Status",
                      "Inco",
                      "Actions",
                    ].map((el) => (
                      <th
                        key={el}
                        className="py-4 px-6 text-center font-semibold text-gray-700 border-b"
                      >
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
                        <tr className="hover:bg-gray-50">
                          <td className="py-4 px-6 text-center min-w-[180px]">
                            {formatTimestamp(order.createdAt)}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {order.companyBargainNo}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {formatDate(order.companyBargainDate)}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {order.manufacturer?.manufacturer}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {order.manufacturer?.manufacturerCompany}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {order.manufacturer?.manufacturerContact}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <Chip
                              variant="ghost"
                              value={order.status}
                              color={
                                order.status === "created"
                                  ? "blue"
                                  : order.status === "partially paid"
                                  ? "yellow"
                                  : "green"
                              }
                              className="px-2 py-1 rounded-lg text-sm font-semibold"
                            />
                          </td>
                          <td className="py-4 px-6 text-center">
                            {order.inco}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex justify-center gap-4">
                              <IconButton
                                variant="text"
                                onClick={() => handleToggleOrder(order._id)}
                                className="bg-gray-200 hover:bg-gray-300 transition"
                              >
                                {isOpen ? (
                                  <ChevronUpIcon className="h-5 w-5 text-gray-600" />
                                ) : (
                                  <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                                )}
                              </IconButton>
                              {!hasFutureBookings(order, bookings) && (
                                <Tooltip content="Delete Order">
                                  <span className="w-fit h-fit">
                                    <MdDeleteOutline
                                      onClick={() => handleDelete(order._id)}
                                      className="text-red-700 text-[2.4rem] border-2 border-red-700 rounded-lg p-1 hover:bg-red-700 hover:text-white transition-all cursor-pointer"
                                    />
                                  </span>
                                </Tooltip>
                              )}
                            </div>
                          </td>
                        </tr>
                        {isOpen && (
                          <tr className="bg-gray-50">
                            <td colSpan="9">
                              <div className="p-4">
                                <table className="w-full">
                                  <thead className="bg-gray-200 rounded-md">
                                    <tr>
                                      {[
                                        "Item Name",
                                        "Packaging",
                                        "Weight",
                                        // "Cont. No.",
                                        "Pickup",
                                        "Quantity",
                                        "Base Price (₹)",
                                        "GST %",
                                        "Tax Paid Amt.",
                                      ].map((header) => (
                                        <th
                                          key={header}
                                          className="py-3 px-4 text-center font-semibold text-gray-600 border-b"
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
                                        className="hover:bg-gray-100"
                                      >
                                        <td className="py-3 px-4 text-center">
                                          {item.item?.materialdescription}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                          {String(item.item.packaging)
                                            ?.charAt(0)
                                            .toUpperCase() +
                                            String(item.item.packaging).slice(
                                              1
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                          {item.item.netweight}
                                        </td>
                                        {/* <td className="py-3 px-4 text-center">
                                          {item.contNumber}
                                        </td> */}
                                        <td className="py-3 px-4 text-center">
                                          {String(item.pickup)
                                            ?.charAt(0)
                                            .toUpperCase() +
                                            String(item.pickup).slice(1)}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                          {item.quantity}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                          ₹{item.baseRate?.toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                          {item.igst
                                            ? `${item.igst}% (IGST)`
                                            : `${item.cgst}% (CGST) + ${item.sgst}% (SGST)`}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                          ₹
                                          {item.taxpaidAmount?.toLocaleString()}
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
          ) : (
            <p className="text-center text-lg text-gray-500 mt-20">
              No orders found!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
