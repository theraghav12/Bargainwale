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
import { deleteBooking, getBookings } from "@/services/bookingService";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { MdDeleteOutline } from "react-icons/md";
import excel from "../../assets/excel.svg";

export function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openBooking, setOpenBooking] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [timePeriod, setTimePeriod] = useState("All");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getBookings();

        const filteredBookings = response.map((booking) => {
          const isDiscounted = booking.items?.some((item) => item.discount > 0);
          return { ...booking, isDiscountRequested: isDiscounted };
        });

        if (statusFilter !== "All") {
          filteredBookings = filteredBookings.filter(
            (b) => b.status === statusFilter
          );
        }
        if (timePeriod !== "All") {
          const now = new Date();
          let filterDate;

          if (timePeriod === "last7Days") {
            filterDate = new Date(now.setDate(now.getDate() - 7));
          } else if (timePeriod === "last30Days") {
            filterDate = new Date(now.setDate(now.getDate() - 30));
          } else if (
            timePeriod === "custom" &&
            dateRange.startDate &&
            dateRange.endDate
          ) {
            filterDate = new Date(dateRange.startDate);
          }
          filteredBookings = filteredBookings.filter(
            (b) => new Date(b.BargainDate) >= filterDate
          );
        }

        setBookings(
          filteredBookings.sort((a, b) => {
            const bargainDateComparison =
              new Date(b.BargainDate) - new Date(a.BargainDate);
            if (bargainDateComparison !== 0) {
              return bargainDateComparison;
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
          })
        );
      } catch {
        setError("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [statusFilter, timePeriod, dateRange]);

  const formatDate = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const handleDownloadExcel = () => {
    const formattedBookings = bookings.flatMap((b) =>
      b.items.map((item, index) => ({
        "Bargain No": b.BargainNo,
        "Bargain Date": formatDate(b.BargainDate),
        "Buyer Name": b.buyer?.buyer,
        "Buyer Company": b.buyer?.buyerCompany,
        "Buyer Location": [
          b.buyer?.buyerdeliveryAddress?.addressLine1,
          b.buyer?.buyerdeliveryAddress?.addressLine2,
          b.buyer?.buyerdeliveryAddress?.city,
          b.buyer?.buyerdeliveryAddress?.state,
          b.buyer?.buyerdeliveryAddress?.pinCode,
        ]
          .filter(Boolean)
          .join(", "),
        "Buyer Contact": b.buyer?.buyerContact,
        Status: b.status,
        "Delivery Type": b.deliveryOption,
        "Delivery Location": [
          b.buyer?.deliveryAddress?.addressLine1,
          b.buyer?.deliveryAddress?.addressLine2,
          b.buyer?.deliveryAddress?.city,
          b.buyer?.deliveryAddress?.state,
          b.buyer?.deliveryAddress?.pinCode,
        ]
          .filter(Boolean)
          .join(", "),
        Description: b.description,
        "Item Material": item.item?.material || "",
        "Item Description": item.item?.materialdescription || "",
        "Item Flavor": item.item?.flavor || "",
        "Item Quantity": item.quantity,
        "Sold Quantity": item.soldQuantity,
        "Pickup Location": item.pickup || "",
        "Base Price": item.basePrice,
        Discount: item.discount,
        GST: item.gst,
        "Taxable Amount": item.taxableAmount,
        "Tax Paid Amount": item.taxpaidAmount,
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(formattedBookings);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    XLSX.writeFile(workbook, "Bookings.xlsx");
    toast.success("Booking history downloaded successfully!");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (confirmed) {
      try {
        await deleteBooking(id);
        setBookings((prev) => prev.filter((b) => b._id !== id));
        toast.success("Booking Deleted");
      } catch {
        toast.error("Error deleting booking");
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50">
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={handleDownloadExcel}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          <img src={excel} alt="Download as Excel" className="w-5 mr-2" />
          Download Excel
        </button>
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="All">All Statuses</option>
            <option value="created">Created</option>
            <option value="partially sold">Partially Sold</option>
            <option value="fully sold">Fully Sold</option>
          </select>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="All">All Time</option>
            <option value="last7Days">Last 7 Days</option>
            <option value="last30Days">Last 30 Days</option>
            <option value="custom">Custom</option>
          </select>
          {timePeriod === "custom" && (
            <Datepicker
              value={dateRange}
              onChange={setDateRange}
              className="w-full max-w-xs"
            />
          )}
        </div>
      </div>

      {loading ? (
        <Typography className="text-center text-blue-gray-500">
          Loading...
        </Typography>
      ) : error ? (
        <Typography className="text-center text-red-500">{error}</Typography>
      ) : (
        <div className="shadow overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                {[
                  "Bargain Date",
                  "Bargain No",
                  "Buyer Name",
                  "Status",
                  "Delivery Type",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-2 border-b font-medium text-center"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const isOpen = openBooking === b._id;
                return (
                  <React.Fragment key={b._id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b text-center">
                        {formatDate(b.BargainDate)}
                      </td>
                      <td className="px-4 py-2 border-b text-center">
                        {b.BargainNo}
                      </td>
                      <td className="px-4 py-2 border-b text-center">
                        {b.buyer?.buyer}
                      </td>
                      <td className="py-2 border-b text-center flex justify-center gap-2">
                        {b.discountStatus === "pending" ? (
                          <Chip
                            className="w-fit"
                            value="Approval Pending"
                            color="red"
                          />
                        ) : (
                          <Chip
                            className="w-fit"
                            value={b.status}
                            color={b.status === "created" ? "blue" : "green"}
                          />
                        )}
                        {b.isDiscountRequested &&
                          b.discountStatus === "approved" && (
                            <Chip
                              className="w-fit"
                              value="Discount Approved"
                              color="green"
                            />
                          )}
                      </td>
                      <td className="px-4 py-2 border-b text-center">
                        {b.deliveryOption}
                      </td>
                      <td className="px-4 py-2 border-b text-center flex justify-center items-center gap-2">
                        <IconButton
                          variant="text"
                          onClick={() => setOpenBooking(isOpen ? null : b._id)}
                          className="bg-gray-200 hover:bg-gray-300 transition"
                        >
                          {isOpen ? (
                            <ChevronUpIcon className="h-5 w-5 text-gray-600" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                          )}
                        </IconButton>
                        {b.status === "created" && (
                          <Tooltip content="Delete Booking">
                            <MdDeleteOutline
                              onClick={() => handleDelete(b._id)}
                              className="text-red-700 text-[2.4rem] border-2 border-red-700 rounded-lg p-1 hover:bg-red-700 hover:text-white transition-all cursor-pointer"
                            />
                          </Tooltip>
                        )}
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-gray-100">
                        <td colSpan="6" className="p-4">
                          <table className="min-w-full bg-gray-50">
                            <thead>
                              <tr>
                                {[
                                  "Item Name",
                                  "Packaging",
                                  "Pickup",
                                  "Base Price",
                                  "Discount",
                                  "Weight",
                                  "Quantity",
                                ].map((header) => (
                                  <th
                                    key={header}
                                    className="px-2 py-1 font-semibold text-gray-700"
                                  >
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {b.items.map((item) => (
                                <tr key={item._id}>
                                  <td className="px-2 py-1 text-center">
                                    {item.item.materialdescription}
                                  </td>
                                  <td className="px-2 py-1 text-center">
                                    {String(item.item.packaging)
                                      ?.charAt(0)
                                      .toUpperCase() +
                                      String(item.item.packaging).slice(1)}
                                  </td>
                                  <td className="px-2 py-1 text-center">
                                    {String(item.pickup)
                                      ?.charAt(0)
                                      .toUpperCase() +
                                      String(item.pickup).slice(1)}
                                  </td>
                                  <td className="px-2 py-1 text-center">
                                    ₹{item.basePrice}
                                  </td>
                                  <td className="px-2 py-1 text-center">
                                    ₹{item.discount / 100}
                                  </td>
                                  <td className="px-2 py-1 text-center">
                                    {item.item.netweight}
                                  </td>
                                  <td className="px-2 py-1 text-center">
                                    {item.quantity || "0"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
