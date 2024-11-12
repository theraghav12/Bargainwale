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

// api services
import { getTransport } from "@/services/masterService";
import { getWarehouses } from "@/services/warehouseService";
import { getBookings } from "@/services/bookingService";
import { API_BASE_URL } from "@/services/api";

// icons
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
  const [totalAmount, setTotalAmount] = useState(null);

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

      filteredOrders.sort(
        (a, b) =>
          new Date(b.companyBargainDate) - new Date(a.companyBargainDate)
      );

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

  const handleFormChange = (index, fieldName, value) => {
    if (fieldName === "items") {
      const updatedItems = [...form.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [fieldName]: value,
      };
      setForm((prevData) => ({
        ...prevData,
        items: updatedItems,
      }));
    } else if (fieldName === "invoiceDate") {
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
      return;
    }
    const allItemsHaveQuantity = quantityInputs.some(
      (booking) =>
        booking.bookingId === orderId &&
        booking.items.every((item) => item.quantity > 0)
    );

    if (!allItemsHaveQuantity) {
      return;
    }

    setSelectedOrder((prevSelected) => {
      if (prevSelected.includes(orderId)) {
        return prevSelected.filter((id) => id !== orderId);
      } else {
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

    if (!warehouseId || !invoiceNumber || !invoiceDate || !transporterId) {
      toast.error(
        "Please fill in all the required fields: Warehouse, Invoice Number, Invoice Date, and Transporter."
      );
      return;
    }

    const allItemsHaveQuantity = quantityInputs.some(
      (booking) =>
        booking.bookingId === bookingId &&
        booking.items.every((item) => item.quantity > 0)
    );

    if (!allItemsHaveQuantity) {
      toast.error("Please enter a quantity for all items in the booking.");
      return;
    }

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
      });
      const newSaleId = saleResponse.data.data?._id;
      setSalesIds((prevSales) => [...prevSales, newSaleId]);
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
      const response = await axios.post(`${API_BASE_URL}/totalsales`, {
        saleIds: salesIds,
        organization: form.organization,
        totalAmount: totalAmount,
      });
      setLoading(false);
      toast.success("Sale created successfully!");
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

  console.log(quantityInputs);

  return (
    <div className="w-full mt-8 mb-8 flex flex-col gap-12">
      <div className="px-7">
        <div className="flex flex-row justify-between">
          <div>
            {/* <button
              onClick={handleDownloadExcel}
              className="w-fit bg-[#185C37] py-2 text-white text-[1rem] font-medium rounded-lg px-8 flex flex-row items-center justify-center border-2 border-[#999999] gap-1"
            >
              <img className="w-5" src={excel} />
              Download as Excel
            </button> */}
          </div>
          {/* <div className="flex flex-row gap-4">
            <button className="w-fit bg-[#FF0000] text-white text-[1rem] font-medium rounded-lg px-8 py-2 flex flex-row items-center justify-center border-2 border-black gap-1">
              Delete
            </button>
            <button className="w-fit bg-[#38454A] text-white text-[1rem] font-medium rounded-lg px-8 py-2 flex flex-row items-center justify-center border-2 border-black gap-1">
              Edit
            </button>
            <button className="w-fit bg-[#DCDCDC] text-black text-[1rem] font-medium rounded-lg px-8 py-2 flex flex-row items-center justify-center border-2 border-black gap-1">
              PUBLISH
            </button>
          </div> */}
        </div>

        <div className="w-full">
          <form
            onSubmit={handleFinalizeSales}
            className="flex flex-col gap-4 mt-4 mb-5 bg-white border-[2px] border-[#737373] p-5 bg-white shadow-md"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-x-16 gap-y-5">
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="warehouseId"
                    className="flex text-[#38454A] text-[1rem]"
                  >
                    Warehouse
                    <LuAsterisk className="text-[#FF0000] text-[0.7rem]" />
                  </label>
                  <Select
                    className="relative w-[180px]"
                    options={selectWarehouseOptions}
                    value={
                      selectWarehouseOptions.find(
                        (option) => option.value === form.warehouseId
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      handleFormChange(0, "warehouseId", selectedOption)
                    }
                  />
                </div>

                <div className="w-fit flex gap-2 items-center">
                  <label
                    htmlFor="invoiceNumber"
                    className="flex text-[#38454A] text-[1rem]"
                  >
                    Invoice No.
                    <LuAsterisk className="text-[#FF0000] text-[0.7rem]" />
                  </label>
                  <input
                    name="invoiceNumber"
                    type="text"
                    value={form.invoiceNumber}
                    onChange={(e) =>
                      handleFormChange(0, "invoiceNumber", e.target.value)
                    }
                    required
                    placeholder="Invoice No."
                    className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373]"
                  />
                </div>

                <div className="w-fit flex gap-2 items-center">
                  <label
                    htmlFor="invoiceDate"
                    className="flex text-[#38454A] text-[1rem]"
                  >
                    Invoice Date
                    <LuAsterisk className="text-[#FF0000] text-[0.7rem]" />
                  </label>
                  <input
                    name="invoiceDate"
                    type="date"
                    value={form.invoiceDate}
                    onChange={(e) =>
                      handleFormChange(0, "invoiceDate", e.target.value)
                    }
                    required
                    className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md"
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="transporterId"
                    className="flex text-[#38454A] text-[1rem]"
                  >
                    Transport
                    <LuAsterisk className="text-[#FF0000] text-[0.7rem]" />
                  </label>
                  <Select
                    className="relative w-[180px]"
                    options={selectTransportOptions}
                    value={
                      selectTransportOptions.find(
                        (option) => option.value === form.transporterId
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      handleFormChange(0, "transporterId", selectedOption)
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  color="blue"
                  type="submit"
                  className="w-fit flex items-center justify-center"
                >
                  {loading ? <Spinner /> : <span>Create Sales</span>}
                </Button>
              </div>
            </div>
          </form>

          <div className="fixed bottom-0 left-0 right-0 bg-[#E4E4E4] border-t-2 border-t-[#A6A6A6] shadow-md z-[10]">
            <div className="text-[1rem] flex justify-between items-center px-4 py-1">
              <p>2024 @ Bargainwale</p>
              <p>Design and Developed by Reduxcorporation</p>
            </div>
          </div>

          <div className="overflow-x-scroll px-0 pt-0 pb-2 mt-2">
            {orders.length > 0 ? (
              <div className="flex flex-col gap-4 mt-4 mb-5 bg-white border-[2px] border-[#737373] shadow-md">
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border-collapse">
                    <thead>
                      <tr>
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
                          <th key={el} className="py-4 text-center w-[200px]">
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
                            <tr className="border-t-2 border-t-[#898989]">
                              <td className="py-4 text-center">
                                {order.BargainNo}
                              </td>
                              <td className="py-4 text-center">
                                {formatDate(order.BargainDate)}
                              </td>
                              <td className="py-4 text-center">
                                {order.buyer?.buyer}
                              </td>
                              <td className="py-4 text-center">
                                {order.buyer?.buyerCompany}
                              </td>
                              <td className="py-4 text-center">
                                {order.buyer?.buyerContact}
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
                              <td className="py-4 text-center">
                                {order.deliveryOption}
                              </td>
                              <td className="py-4 text-center">
                                <div className="flex justify-center items-center gap-4">
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
                                      onChange={() => {
                                        handleOrderSelect(order._id);
                                        handleCreateSale(
                                          order._id,
                                          order.buyer?._id,
                                          order.items
                                        );
                                      }}
                                      className="form-checkbox h-5 w-5 cursor-pointer"
                                      disabled={isSoldOut}
                                    />
                                  </Tooltip>
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
                                            "Static Price (Rs.)",
                                            "Booked Quantity",
                                            "Quantity to Sales",
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
                                              {item.item.materialdescription}
                                            </td>
                                            <td className="py-4 text-center">
                                              {item.item.packaging}
                                            </td>
                                            <td className="py-4 text-center">
                                              {item.item.netweight}
                                            </td>
                                            <td className="py-4 text-center">
                                              {item.item.staticPrice}
                                            </td>
                                            <td className="py-4 text-center">
                                              {item.quantity}
                                            </td>
                                            <td className="py-4 text-center">
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
                                                className="w-[150px] p-2 border rounded"
                                                placeholder="Enter new qty"
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

          {/* <div className="flex flex-col gap-4 mt-4 mb-5 bg-white border-[2px] border-[#737373] shadow-md">
            <div className="overflow-x-auto">
              <table className="max-w-full table-auto border-collapse">
                <thead>
                  <tr className="grid grid-cols-12">
                    <th className="py-4 text-center">CBN</th>
                    <th className="py-4 text-center">CBD</th>
                    <th className="py-4 text-center">Item</th>
                    <th className="py-4 text-center">Quantity</th>
                    <th className="py-4 text-center">Pickup</th>
                    <th className="py-4 text-center">Cont. No.</th>
                    <th className="py-4 text-center">Base Rate</th>
                    <th className="py-4 text-center">Tax Paid Amount</th>
                    <th className="py-4 text-center">Inco</th>
                    <th className="py-4 text-center">Payment Date</th>
                    <th className="py-4 text-center">Description</th>
                    <th className="py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {form.items?.map((item, index) => (
                    <tr
                      key={index}
                      className="grid grid-cols-12 border-t-2 border-t-[#898989]"
                    >
                      <td className="py-4 text-center">
                        {form.companyBargainNo}
                      </td>
                      <td className="py-4 text-center">
                        {form.companyBargainDate}
                      </td>
                      <td className="py-4 text-center">
                        <div className="relative w-[150px]">
                          <select
                            id="itemId"
                            name="itemId"
                            value={item.itemId}
                            onChange={(e) =>
                              handleItemChange(index, "itemId", e.target.value)
                            }
                            className="appearance-none w-full bg-white border-2 border-[#CBCDCE] text-[#38454A] px-4 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBCDCE] cursor-pointer"
                            required
                          >
                            <option value="">Select Item</option>
                            {itemsOptions?.map((item) => (
                              <option key={item._id} value={item._id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <TbTriangleInvertedFilled className="text-[#5E5E5E]" />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <input
                          type="number"
                          name="quantity"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", e.target.value)
                          }
                          required
                          placeholder="Quantity"
                          className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373]"
                        />
                      </td>
                      <td className="py-4 text-center">
                        <div className="relative w-[150px]">
                          <select
                            id="pickup"
                            name="pickup"
                            value={item.pickup}
                            onChange={(e) =>
                              handleItemChange(index, "pickup", e.target.value)
                            }
                            className="appearance-none w-full bg-white border-2 border-[#CBCDCE] text-[#38454A] px-4 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBCDCE] cursor-pointer"
                            required
                          >
                            <option value="">Select Pickup</option>
                            <option value="rack">Rack</option>
                            <option value="depot">Depot</option>
                            <option value="plant">Plant</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <TbTriangleInvertedFilled className="text-[#5E5E5E]" />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <input
                          type="number"
                          name="contNumber"
                          value={item.contNumber}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "contNumber",
                              e.target.value
                            )
                          }
                          required
                          placeholder="Cont. No."
                          className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373]"
                        />
                      </td>
                      <td className="py-4 text-center">
                        <input
                          type="number"
                          name="baseRate"
                          value={item.baseRate}
                          onChange={(e) =>
                            handleItemChange(index, "baseRate", e.target.value)
                          }
                          required
                          placeholder="Base Rate"
                          className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373]"
                        />
                      </td>
                      <td className="py-4 text-center">{item.taxpaidAmount}</td>
                      <td className="py-4 text-center">{form.inco}</td>
                      <td className="py-4 text-center">{form.paymentDays}</td>
                      <td className="py-4 text-center">{form.description}</td>
                      <td className="py-4 flex justify-center">
                        <Tooltip content="Remove Item">
                          <span className="w-fit h-fit">
                            <MdDeleteOutline
                              onClick={() => handleRemoveItem(index)}
                              className="text-[2rem] text-red-700 border border-2 border-red-700 rounded-md hover:bg-red-700 hover:text-white transition-all cursor-pointer"
                            />
                          </span>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CreateSales;
