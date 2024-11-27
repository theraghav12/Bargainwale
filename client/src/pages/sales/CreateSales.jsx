import {
  Button,
  Chip,
  IconButton,
  Spinner,
  Tooltip,
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import Select from "react-select";

// API services
import { getTransport } from "@/services/masterService";
import { getWarehouses } from "@/services/warehouseService";
import { getBookings } from "@/services/bookingService";
import { API_BASE_URL } from "@/services/api";

// Icons
import { LuAsterisk } from "react-icons/lu";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

const CreateSales = () => {
  const [loading, setLoading] = useState(false);
  const [selectTransportOptions, setSelectTransportOptions] = useState([]);
  const [selectWarehouseOptions, setSelectWarehouseOptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [openOrders, setOpenOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [quantityInputs, setQuantityInputs] = useState([]);
  const [salesIds, setSalesIds] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [form, setForm] = useState({
    warehouseId: "",
    transporterId: "",
    bookingIds: [],
    invoiceNumber: "",
    invoiceDate: "",
    items: [],
    organization: localStorage.getItem("organizationId"),
  });

  const fetchOrders = async () => {
    try {
      const response = await getBookings();
      const filteredOrders = response;
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
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransportOptions = async () => {
    try {
      const response = await getTransport();
      const formattedOptions = response.map((item) => ({
        value: item._id,
        label: item.transport,
      }));
      setSelectTransportOptions(formattedOptions);
    } catch (error) {
      toast.error("Error fetching transports!");
      console.error(error);
    }
  };

  const fetchWarehouseOptions = async () => {
    try {
      const response = await getWarehouses();
      const formattedOptions = response.map((item) => ({
        value: item._id,
        label: item.name,
      }));
      setSelectWarehouseOptions(formattedOptions);
    } catch (error) {
      toast.error("Error fetching warehouses!");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchTransportOptions();
    fetchWarehouseOptions();
  }, []);

  const handleFormChange = (fieldName, value) => {
    if (fieldName === "invoiceDate") {
      const formattedDate = value.split("T")[0];
      setForm((prevData) => ({
        ...prevData,
        [fieldName]: formattedDate,
      }));
    } else {
      if (fieldName === "warehouseId" || fieldName === "transporterId") {
        setForm((prevData) => ({
          ...prevData,
          [fieldName]: value.value,
        }));
      } else {
        setForm((prevData) => ({
          ...prevData,
          [fieldName]: value,
        }));
      }
    }
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
    setOpenOrders((prevOpenOrders) =>
      prevOpenOrders.includes(orderId)
        ? prevOpenOrders.filter((id) => id !== orderId)
        : [...prevOpenOrders, orderId]
    );
  };

  const handleOrderSelect = (orderId) => {
    const { warehouseId, invoiceNumber, invoiceDate, transporterId } = form;

    if (!warehouseId || !invoiceNumber || !invoiceDate || !transporterId) {
      toast.error(
        "Please fill in all the required fields: Warehouse, Invoice Number, Invoice Date, and Transporter."
      );
      return;
    }

    const allItemsHaveQuantity = quantityInputs.some(
      (booking) =>
        booking.bookingId === orderId &&
        booking.items.every((item) => item.quantity > 0)
    );

    if (!allItemsHaveQuantity) {
      toast.error("Please enter a quantity for all items in the booking.");
      return;
    }

    setSelectedOrder((prevSelected) => {
      if (prevSelected.includes(orderId)) {
        return prevSelected.filter((id) => id !== orderId);
      } else {
        handleCreateSale(
          orderId,
          orders.find((order) => order._id === orderId).buyer?._id,
          orders.find((order) => order._id === orderId).items
        );
        return [...prevSelected, orderId];
      }
    });
  };

  const handleCreateSale = async (bookingId, buyerId, orderItems) => {
    const {
      warehouseId,
      transporterId,
      organization,
      invoiceNumber,
      invoiceDate,
    } = form;

    const saleItems = orderItems.map((item) => ({
      itemId: item.item._id,
      quantity:
        quantityInputs
          .find((booking) => booking.bookingId === bookingId)
          ?.items.find((q) => q.itemId === item.item._id)?.quantity || 0,
      pickup: item.pickup,
    }));

    try {
      const saleResponse = await axios.post(`${API_BASE_URL}/sale`, {
        warehouseId,
        bookingId,
        transporterId,
        organization,
        buyerId,
        items: saleItems,
        invoiceNumber,
        invoiceDate,
      });
      const newSaleId = saleResponse.data.data?._id;
      setSalesIds((prevSales) => [...prevSales, newSaleId]);
      toast.success("Sale created successfully!");
    } catch (error) {
      console.error("Error creating sale:", error);
    }
  };

  const handleFinalizeSales = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (salesIds.length === 0) {
      toast.error("Please select a booking before submitting.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/totalsales`, {
        saleIds: salesIds,
        organization: form.organization,
        totalAmount: totalAmount,
      });
      setLoading(false);
      toast.success("All sales finalized successfully!");
    } catch (error) {
      console.error("Error finalizing sales:", error);
    }
  };

  const handleQuantityChange = (
    itemId,
    bookingId,
    newQuantity,
    taxpaidAmount
  ) => {
    setQuantityInputs((prevInputs) => {
      const existingBookingIndex = prevInputs.findIndex(
        (booking) => booking.bookingId === bookingId
      );

      if (existingBookingIndex !== -1) {
        const existingItemIndex = prevInputs[
          existingBookingIndex
        ].items.findIndex((item) => item.itemId === itemId);

        if (existingItemIndex !== -1) {
          return prevInputs.map((booking, bookingIndex) => {
            if (bookingIndex === existingBookingIndex) {
              return {
                ...booking,
                items: booking.items.map((item, itemIndex) => {
                  if (itemIndex === existingItemIndex) {
                    return { ...item, quantity: newQuantity };
                  }
                  return item;
                }),
              };
            }
            return booking;
          });
        } else {
          return prevInputs.map((booking, bookingIndex) => {
            if (bookingIndex === existingBookingIndex) {
              return {
                ...booking,
                items: [...booking.items, { itemId, quantity: newQuantity }],
              };
            }
            return booking;
          });
        }
      } else {
        return [
          ...prevInputs,
          {
            bookingId,
            items: [{ itemId, quantity: newQuantity }],
          },
        ];
      }
    });

    if (newQuantity === "") {
      setTotalAmount((prevAmount) => prevAmount * 0);
    } else {
      setTotalAmount(
        (prevAmount) => prevAmount + taxpaidAmount * Number(newQuantity)
      );
    }
  };

  return (
    <div className="w-full mt-8 mb-8 flex flex-col gap-12">
      <div className="px-7">
        <div className="flex flex-row justify-between">
          <div>{/* Additional buttons or actions can be added here */}</div>
        </div>

        <div className="w-full">
          <form
            onSubmit={handleFinalizeSales}
            className="flex flex-col gap-6 mt-4 mb-5 bg-white border-[2px] border-[#737373] p-6 rounded-lg shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="warehouseId"
                  className="flex text-[#38454A] text-[1rem] font-semibold"
                >
                  Warehouse
                  <LuAsterisk className="text-[#FF0000] text-[0.7rem] ml-1" />
                </label>
                <Select
                  className="relative"
                  options={selectWarehouseOptions}
                  value={
                    selectWarehouseOptions.find(
                      (option) => option.value === form.warehouseId
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    handleFormChange("warehouseId", selectedOption)
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="invoiceNumber"
                  className="flex text-[#38454A] text-[1rem] font-semibold"
                >
                  Invoice No.
                  <LuAsterisk className="text-[#FF0000] text-[0.7rem] ml-1" />
                </label>
                <input
                  name="invoiceNumber"
                  type="text"
                  value={form.invoiceNumber}
                  onChange={(e) =>
                    handleFormChange("invoiceNumber", e.target.value)
                  }
                  required
                  placeholder="Invoice No."
                  className="border-2 border-[#CBCDCE] px-3 py-2 rounded-md placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="invoiceDate"
                  className="flex text-[#38454A] text-[1rem] font-semibold"
                >
                  Invoice Date
                  <LuAsterisk className="text-[#FF0000] text-[0.7rem] ml-1" />
                </label>
                <input
                  name="invoiceDate"
                  type="date"
                  value={form.invoiceDate}
                  onChange={(e) =>
                    handleFormChange("invoiceDate", e.target.value)
                  }
                  required
                  className="border-2 border-[#CBCDCE] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="transporterId"
                  className="flex text-[#38454A] text-[1rem] font-semibold"
                >
                  Transport
                  <LuAsterisk className="text-[#FF0000] text-[0.7rem] ml-1" />
                </label>
                <Select
                  className="relative"
                  options={selectTransportOptions}
                  value={
                    selectTransportOptions.find(
                      (option) => option.value === form.transporterId
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    handleFormChange("transporterId", selectedOption)
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <Button
                color="blue"
                type="submit"
                className="w-fit flex items-center justify-center"
                disabled={loading}
              >
                {loading ? <Spinner /> : <span>Finalize Sales</span>}
              </Button>
            </div>
          </form>

          <div className="overflow-x-scroll px-0 pt-0 pb-2 mt-2">
            {orders.length > 0 ? (
              <div className="flex flex-col gap-4 mt-4 mb-5 bg-white border-[2px] border-[#737373] rounded-lg shadow-md">
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        {[
                          "Bargain No",
                          "Bargain Date",
                          "Buyer Name",
                          "Buyer Company",
                          "Buyer Contact",
                          "Status",
                          "Delivery Option",
                          "Actions",
                        ].map((el) => (
                          <th
                            key={el}
                            className="py-4 px-6 text-center w-[200px] font-semibold text-gray-700"
                          >
                            {el}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => {
                        const isOpen = openOrders.includes(order._id);
                        const isChecked = selectedOrder.includes(order._id);
                        const isSoldOut = order.status === "fully sold";
                        return (
                          <React.Fragment key={order._id}>
                            <tr className="border-t">
                              <td className="py-4 px-6 text-center">
                                {order.BargainNo}
                              </td>
                              <td className="py-4 px-6 text-center">
                                {formatDate(order.BargainDate)}
                              </td>
                              <td className="py-4 px-6 text-center">
                                {order.buyer?.buyer}
                              </td>
                              <td className="py-4 px-6 text-center">
                                {order.buyer?.buyerCompany}
                              </td>
                              <td className="py-4 px-6 text-center">
                                {order.buyer?.buyerContact}
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
                                      : order.status === "billed"
                                      ? "green"
                                      : "red"
                                  }
                                />
                              </td>
                              <td className="py-4 px-6 text-center">
                                {order.deliveryOption}
                              </td>
                              <td className="py-4 px-6 text-center">
                                <div className="flex justify-center items-center gap-4">
                                  <IconButton
                                    variant="text"
                                    onClick={() => handleToggleOrder(order._id)}
                                    className="bg-gray-300 hover:bg-gray-400"
                                  >
                                    {isOpen ? (
                                      <ChevronUpIcon className="h-5 w-5" />
                                    ) : (
                                      <ChevronDownIcon className="h-5 w-5" />
                                    )}
                                  </IconButton>
                                  <Tooltip
                                    content={
                                      isSoldOut
                                        ? "Booking fully sold"
                                        : "Select Booking"
                                    }
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() =>
                                        handleOrderSelect(order._id)
                                      }
                                      className="form-checkbox h-5 w-5 cursor-pointer"
                                      disabled={isSoldOut}
                                    />
                                  </Tooltip>
                                </div>
                              </td>
                            </tr>
                            {isOpen && (
                              <tr className="bg-gray-50">
                                <td colSpan="11">
                                  <div className="p-4">
                                    <table className="min-w-full table-auto border-collapse">
                                      <thead>
                                        <tr className="bg-gray-100">
                                          {[
                                            "Item Name",
                                            "Packaging",
                                            "Weight",
                                            "Static Price (Rs.)",
                                            "Booked Quantity",
                                            "Quantity to Sales",
                                          ].map((header) => (
                                            <th
                                              key={header}
                                              className="py-3 px-4 text-center font-semibold text-gray-700"
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
                                            className="border-t"
                                          >
                                            <td className="py-3 px-4 text-center">
                                              {item.item.materialdescription}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                              {item.item.packaging}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                              {item.item.netweight}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                              {item.item.staticPrice}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                              {item.quantity}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                              <input
                                                type="number"
                                                value={
                                                  quantityInputs
                                                    .find(
                                                      (booking) =>
                                                        booking.bookingId ===
                                                        order._id
                                                    )
                                                    ?.items.find(
                                                      (q) =>
                                                        q.itemId ===
                                                        item.item._id
                                                    )?.quantity || ""
                                                }
                                                onChange={(e) => {
                                                  const newQuantity =
                                                    e.target.value === ""
                                                      ? ""
                                                      : Number(e.target.value);
                                                  handleQuantityChange(
                                                    item.item._id,
                                                    order._id,
                                                    newQuantity,
                                                    item.taxpaidAmount
                                                  );
                                                }}
                                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter quantity"
                                              />
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
                No bookings found!
              </p>
            )}
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-[#E4E4E4] border-t-2 border-t-[#A6A6A6] shadow-md z-[10]">
            <div className="text-[1rem] flex justify-between items-center px-4 py-1">
              <p>2024 © Bargainwale</p>
              <p>Designed and Developed by Reduxcorporation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSales;
