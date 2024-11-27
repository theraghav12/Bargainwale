import React, { useState, useEffect } from "react";
import {
  Typography,
  IconButton,
  Tooltip,
  Button,
} from "@material-tailwind/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";
import Datepicker from "react-tailwindcss-datepicker";
import * as XLSX from "xlsx";
import { MdDeleteOutline } from "react-icons/md";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import excel from "../../assets/excel.svg";
import { deleteBooking, getBookings } from "@/services/bookingService";
import { getSales } from "@/services/salesService";

export default function PurchaseHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSale, setOpenSale] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [warehouseFilter, setWarehouseFilter] = useState("All");
  const [transporterFilter, setTransporterFilter] = useState("All");
  const [itemFilter, setItemFilter] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const dayWithSuffix =
      day +
      ["th", "st", "nd", "rd"][
        day % 10 > 3 || ~~(day / 10) === 1 ? 0 : day % 10
      ];
    return `${dayWithSuffix} ${month} ${year}, ${formattedHours}:${minutes} ${ampm}`;
  };

  const fetchSales = async () => {
    try {
      const response = await getSales();
      const sortedData = response.data?.sort((a, b) => {
        const invoiceDateComparison =
          new Date(b.invoiceDate) - new Date(a.invoiceDate);
        if (invoiceDateComparison !== 0) {
          return invoiceDateComparison;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setSales(sortedData);
    } catch (error) {
      setError("Failed to fetch sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const warehouses = [
    "All",
    ...new Set(sales.map((sale) => sale.warehouseId?.name).filter(Boolean)),
  ];
  const transporters = [
    "All",
    ...new Set(
      sales.map((sale) => sale.transporterId?.transport).filter(Boolean)
    ),
  ];

  const filteredSales = sales.filter((sale) => {
    const matchesWarehouse =
      warehouseFilter === "All" || sale.warehouseId?.name === warehouseFilter;
    const matchesTransporter =
      transporterFilter === "All" ||
      sale.transporterId?.transport === transporterFilter;
    const matchesDateRange =
      (!dateRange.startDate ||
        new Date(sale.invoiceDate) >= new Date(dateRange.startDate)) &&
      (!dateRange.endDate ||
        new Date(sale.invoiceDate) <= new Date(dateRange.endDate));
    const matchesItem =
      !itemFilter ||
      sale.items.some((item) =>
        item.itemId?.materialdescription
          ?.toLowerCase()
          .includes(itemFilter.toLowerCase())
      );

    return (
      matchesWarehouse && matchesTransporter && matchesDateRange && matchesItem
    );
  });

  const handleDownloadExcel = () => {
    const formattedSales = filteredSales.map((sale) => ({
      "Invoice Date": formatDate(sale.invoiceDate),
      "Invoice Number": sale.invoiceNumber,
      "Buyer Name": sale.buyer?.name,
      Warehouse: sale.warehouseId?.name,
      Transporter: sale.transporterId?.transport,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedSales);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales History");
    XLSX.writeFile(workbook, "Sales_History.xlsx");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this sale?"
    );
    if (!confirmDelete) return;

    try {
      await deleteBooking(id);
      fetchSales();
      toast.error("Sale deleted");
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleToggleSale = (saleId) => {
    setOpenSale(openSale === saleId ? null : saleId);
  };

  return (
    <div className="mt-8 mb-8 flex flex-col gap-8 px-7">
      {/* Filter Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 shadow-md rounded-lg p-6 mb-6 border border-gray-300">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Filter Sales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="border-2 border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:ring focus:ring-blue-200"
          >
            {warehouses.map((warehouse) => (
              <option key={warehouse} value={warehouse}>
                {warehouse}
              </option>
            ))}
          </select>

          <select
            value={transporterFilter}
            onChange={(e) => setTransporterFilter(e.target.value)}
            className="border-2 border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:ring focus:ring-blue-200"
          >
            {transporters.map((transporter) => (
              <option key={transporter} value={transporter}>
                {transporter}
              </option>
            ))}
          </select>

          <Datepicker
            value={dateRange}
            onChange={(newValue) => setDateRange(newValue)}
            showShortcuts
            className="border-2 border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:ring focus:ring-blue-200"
          />

          <input
            type="text"
            placeholder="Search by Item Name"
            value={itemFilter}
            onChange={(e) => setItemFilter(e.target.value)}
            className="border-2 border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="mt-6">
          <Button
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white rounded-lg px-6 py-2 shadow-md"
          >
            <HiOutlineDocumentDownload className="w-5 h-5" />
            Download as Excel
          </Button>
        </div>
      </div>

      {/* Sales Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6 border border-gray-300">
        {loading ? (
          <Typography className="text-center text-blue-gray-600">
            Loading...
          </Typography>
        ) : error ? (
          <Typography className="text-center text-red-600">{error}</Typography>
        ) : filteredSales.length > 0 ? (
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-teal-100 to-blue-100">
                {[
                  "Invoice Date",
                  "Invoice Number",
                  "Booking ID",
                  "Warehouse",
                  "Transporter",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="py-3 px-5 text-gray-800 font-semibold text-center border-b border-gray-300"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => {
                const isOpen = openSale === sale._id;
                return (
                  <React.Fragment key={sale._id}>
                    <tr className="hover:bg-gray-50 transition border-b border-gray-200">
                      <td className="py-3 px-5 text-center">
                        {formatDate(sale.invoiceDate)}
                      </td>
                      <td className="py-3 px-5 text-center">
                        {sale.invoiceNumber}
                      </td>
                      <td className="py-3 px-5 text-center">
                        {sale.bookingId?._id}
                      </td>
                      <td className="py-3 px-5 text-center">
                        {sale.warehouseId?.name}
                      </td>
                      <td className="py-3 px-5 text-center">
                        {sale.transporterId?.transport}
                      </td>
                      <td className="py-3 px-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <IconButton
                            onClick={() => handleToggleSale(sale._id)}
                            className="bg-gray-200 hover:bg-teal-300 rounded-full p-2 transition"
                          >
                            {isOpen ? (
                              <ChevronUpIcon className="w-5 h-5 text-teal-700" />
                            ) : (
                              <ChevronDownIcon className="w-5 h-5 text-teal-700" />
                            )}
                          </IconButton>
                          <Tooltip content="Delete Sale">
                            <span>
                              <MdDeleteOutline
                                onClick={() => handleDelete(sale._id)}
                                className="text-2xl text-red-600 hover:text-white hover:bg-red-600 p-1 rounded transition"
                              />
                            </span>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>

                    {isOpen && (
                      <tr className="bg-gray-50">
                        <td colSpan="6">
                          <div className="p-4 border-t border-gray-200">
                            <Typography
                              variant="h6"
                              className="mb-4 text-gray-700"
                            >
                              Items
                            </Typography>
                            <table className="w-full text-sm text-gray-700">
                              <thead>
                                <tr>
                                  <th className="py-2 px-4 text-left font-semibold">
                                    Item Name
                                  </th>
                                  <th className="py-2 px-4 text-left font-semibold">
                                    Quantity
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {sale.items.map((item) => (
                                  <tr
                                    key={item._id}
                                    className="border-t border-gray-200"
                                  >
                                    <td className="py-2 px-4">
                                      {item.itemId?.materialdescription}
                                    </td>
                                    <td className="py-2 px-4">
                                      {item.quantity}
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
        ) : (
          <Typography className="text-center text-blue-gray-600 mt-8">
            No Sales found
          </Typography>
        )}
      </div>
    </div>
  );
}
