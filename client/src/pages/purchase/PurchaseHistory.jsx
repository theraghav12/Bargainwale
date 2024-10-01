import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { updateBillTypePartWise } from "@/services/orderService";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import Datepicker from "react-tailwindcss-datepicker";
import * as XLSX from "xlsx";
import { deleteBooking, getBookings } from "@/services/bookingService";
import { EditOrderForm } from "@/components/orders/EditOrder";
import { MdDeleteOutline } from "react-icons/md";
import excel from "../../assets/excel.svg";
import { getPurchases } from "@/services/purchaseService";

export default function PurchaseHistory() {
  const [showPurchaseForm, setPurchaseForm] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showEditPurchaseForm, setEditPurchaseForm] = useState(false);
  const [openPurchase, setOpenPurchase] = useState(null);
  const [transferQuantities, setTransferQuantities] = useState({});
  const [quantityErrors, setQuantityErrors] = useState({});
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timePeriod, setTimePeriod] = useState("All");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const handleCreateBookingClick = () => {
    setBookingForm(true);
  };

  const fetchPurchases = async () => {
    try {
      const response = await getPurchases();
      const purchasesData = response.data;
      let filteredPurchases =
        statusFilter === "All"
          ? purchasesData
          : purchasesData.filter(
              (purchase) => purchase.status === statusFilter
            );

      const now = new Date();
      let filterDate;

      if (timePeriod === "last7Days") {
        filterDate = new Date();
        filterDate.setDate(now.getDate() - 7);
        filteredPurchases = filteredPurchases.filter(
          (purchase) => new Date(purchase.companyBargainDate) >= filterDate
        );
      } else if (timePeriod === "last30Days") {
        filterDate = new Date();
        filterDate.setDate(now.getDate() - 30);
        filteredPurchases = filteredPurchases.filter(
          (purchase) => new Date(purchase.companyBargainDate) >= filterDate
        );
      } else if (
        timePeriod === "custom" &&
        dateRange.startDate &&
        dateRange.endDate
      ) {
        const start = new Date(dateRange.startDate);
        const end = new Date(dateRange.endDate);
        filteredPurchases = filteredPurchases?.filter((purchase) => {
          const purchaseDate = new Date(purchase.invoiceDate);
          return purchaseDate >= start && purchaseDate <= end;
        });
      }

      // Sort purchases by invoiceDate in descending order
      filteredPurchases.sort(
        (a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate)
      );

      setPurchases(filteredPurchases);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [statusFilter, timePeriod, dateRange]);

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

  const handleTogglePurchase = (purchaseId) => {
    setOpenPurchase(openPurchase === purchaseId ? null : purchaseId);
  };

  console.log(purchases);

  const handleDownloadExcel = () => {
    const formattedbookings = bookings.map((booking) => ({
      "Company Bargain No": booking.BargainNo,
      // "Company Bargain Date": formatDate(booking.BargainDate),
      "Buyer Name": booking.buyer?.buyer,
      "Buyer Location": booking.buyer?.buyerLocation,
      "Buyer Contact": booking.buyer?.buyerContact,
      Status: booking.status,
      "Delivery Type": booking.deliveryOption,
      "Delivery Location":
        booking.deliveryAddress?.addressLine1 +
        ", " +
        booking.deliveryAddress?.addressLine2 +
        ", " +
        booking.deliveryAddress?.city +
        ", " +
        booking.deliveryAddress?.state +
        ", " +
        booking.deliveryAddress?.pinCode,
      "Bill Type": booking.billType,
      Description: booking.description,
      // "Created At": formatDate(booking.createdAt),
      // "Updated At": formatDate(booking.updatedAt),
      "Payment Days": booking.paymentDays,
      "Reminder Days": booking.reminderDays.join(", "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedbookings);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "bookings");
    XLSX.writeFile(workbook, "bookings.xlsx");
  };

  const handleDelete = async (id) => {
    try {
      await deleteBookin(id);
      fetchPurchases();
      toast.error("Booking Deleted");
    } catch (err) {
      console.log("Error:", err);
    }
  };

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
              <option value="billed">Billed</option>
              <option value="payment pending">Payment Pending</option>
              <option value="completed">Completed</option>
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
          </div>

          <div className="flex flex-row gap-4">
            <button className="w-fit bg-[#FF0000] text-white text-[1rem] font-medium rounded-lg px-8 flex flex-row items-center justify-center border-2 border-black gap-1">
              Delete
            </button>
            <button className="w-fit bg-[#38454A] text-white text-[1rem] font-medium rounded-lg px-8 flex flex-row items-center justify-center border-2 border-black gap-1">
              Edit
            </button>
            <button className="w-fit bg-[#DCDCDC] text-black text-[1rem] font-medium rounded-lg px-8 flex flex-row items-center justify-center border-2 border-black gap-1">
              PUBLISH
            </button>
          </div>
        </div>
        <div className="overflow-x-scroll px-0 pt-0 pb-2 mt-2">
          {loading ? (
            <Typography className="text-center text-blue-gray-600">
              Loading...
            </Typography>
          ) : error ? (
            <Typography className="text-center text-red-600">
              {error}
            </Typography>
          ) : purchases.length > 0 ? (
            <div className="flex flex-col gap-4 mt-4 mb-5 bg-white border-[2px] border-[#737373] shadow-md">
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr>
                      {[
                        "Invoice Date",
                        "Invoice Number",
                        "Order ID",
                        "Warehouse",
                        "Transporter",
                        "Pickup Type",
                        "Item Quantity",
                        "Actions",
                      ].map((el) => (
                        <th key={el} className="py-4 text-center w-[200px]">
                          {el}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((purchase) => {
                      const isOpen = openPurchase === purchase._id;
                      return (
                        <React.Fragment key={purchase._id}>
                          <tr className="border-t-2 border-t-[#898989]">
                            <td className="py-4 text-center">
                              {purchase.invoiceDate &&
                                formatDate(purchase?.invoiceDate)}
                            </td>
                            <td className="py-4 text-center">
                              {purchase?.invoiceNumber}
                            </td>
                            <td className="py-4 text-center">
                              {purchase?.orderId}
                            </td>
                            <td className="py-4 text-center">
                              {purchase?.warehouseId}
                            </td>
                            <td className="py-4 text-center">
                              {purchase?.transporterId}
                            </td>
                            <td className="py-4 text-center">
                              <div className="flex justify-center gap-4">
                                <IconButton
                                  variant="text"
                                  onClick={() =>
                                    handleTogglePurchase(purchase._id)
                                  }
                                  className="bg-gray-300"
                                >
                                  {isOpen ? (
                                    <ChevronUpIcon className="h-5 w-5" />
                                  ) : (
                                    <ChevronDownIcon className="h-5 w-5" />
                                  )}
                                </IconButton>
                                <Tooltip content="Delete Purchase">
                                  <span className="w-fit h-fit">
                                    <MdDeleteOutline
                                      onClick={() => handleDelete(purchase._id)}
                                      className="text-[2.4rem] text-red-700 border border-2 border-red-700 rounded-md hover:bg-red-700 hover:text-white transition-all cursor-pointer"
                                    />
                                  </span>
                                </Tooltip>
                              </div>
                            </td>
                          </tr>
                          {isOpen && (
                            <tr className="bg-gray-100">
                              <td colSpan="11">
                                <div className="p-4 border-t-2 border-gray-200">
                                  <Typography variant="h6" className="mb-4">
                                    Items
                                  </Typography>
                                  <table className="w-full table-auto">
                                    <thead>
                                      <tr>
                                        {[
                                          "Item Name",
                                          "Quantity",
                                          "Pickup",
                                        ].map((header) => (
                                          <th
                                            key={header}
                                            className="py-3 px-5 text-center"
                                          >
                                            <Typography
                                              variant="small"
                                              className="text-[11px] font-bold uppercase"
                                            >
                                              {header}
                                            </Typography>
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {purchase.items.map((item) => (
                                        <tr key={item._id}>
                                          <td className="py-3 px-5 text-center">
                                            {item.item?.materialdescription}
                                          </td>
                                          <td className="py-3 px-5 text-center">
                                            {item.quantity}
                                          </td>
                                          <td className="py-3 px-5 text-center">
                                            {item.pickup}
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
            <Typography className="text-center text-blue-gray-600 mt-8">
              No Purchase found
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
}
