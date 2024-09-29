import {
  Button,
  Chip,
  IconButton,
  Spinner,
  Tooltip,
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

// api services
import {
  getItems,
  getManufacturer,
  getTransport,
} from "@/services/masterService";
import { getWarehouses } from "@/services/warehouseService";

// icons
import { FaPlus } from "react-icons/fa";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { LuAsterisk } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { createOrder, getOrders } from "@/services/orderService";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { createPurchase } from "@/services/purchaseService";

const CreatePurchase = () => {
  const [loading, setLoading] = useState(false);
  const [itemsOptions, setItemsOptions] = useState([]);
  const [transportOptions, setTransportOptions] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [timePeriod, setTimePeriod] = useState("All");
  const [openOrder, setOpenOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [quantityInputs, setQuantityInputs] = useState([]);

  const [form, setForm] = useState({
    warehouseId: "",
    transporterId: "",
    orderId: "",
    invoiceNumber: "",
    invoiceDate: "",
    items: [],
  });

  useEffect(() => {
    fetchOrders();
    fetchItemsOptions();
    fetchTransportOptions();
    fetchWarehouseOptions();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      const ordersData = response;

      let filteredOrders =
        statusFilter === "All"
          ? ordersData
          : ordersData.filter((order) => order.status === statusFilter);

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

  const fetchItemsOptions = async () => {
    try {
      const response = await getItems();
      setItemsOptions(response);
    } catch (error) {
      toast.error("Error fetching items!");
      console.error(error);
    }
  };

  const fetchTransportOptions = async () => {
    try {
      const response = await getTransport();
      setTransportOptions(response);
    } catch (error) {
      toast.error("Error fetching transports!");
      console.error(error);
    }
  };

  const fetchWarehouseOptions = async () => {
    try {
      const response = await getWarehouses();
      setWarehouseOptions(response);
    } catch (error) {
      toast.error("Error fetching warehouses!");
      console.error(error);
    }
  };

  const calculateDaysDifference = (date1, date2) => {
    const diffTime = Math.abs(new Date(date2) - new Date(date1));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!selectedOrder) {
        toast.error("Please select an order before submitting.");
        setLoading(false);
        return;
      }

      if (
        quantityInputs.length === 0 ||
        quantityInputs.some((input) => !input.quantity)
      ) {
        toast.error(
          "Please enter quantities for all items in the selected order."
        );
        setLoading(false);
        return;
      }

      const updatedForm = {
        ...form,
        orderId: selectedOrder,
        items: quantityInputs,
        organization: "64d22f5a8b3b9f47a3b0e7f1",
      };

      console.log(updatedForm);
      const response = await createPurchase(updatedForm);

      if (response.status === 201) {
        toast.success("Order created successfully!");
      } else {
        toast.error(`Unexpected status code: ${response.status}`);
        console.error("Unexpected response:", response);
      }

      // Reset the form after successful submission
      // setForm({
      //   items: [],
      //   inco: "",
      //   companyBargainNo: "",
      //   companyBargainDate: "",
      //   manufacturer: "",
      //   paymentDays: "",
      //   description: "",
      //   warehouse: "",
      // });
    } catch (error) {
      // Handle different types of errors (network/server-side/client-side)
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          toast.error("Bad request: Please check the form data.");
        } else if (status === 401) {
          toast.error("Unauthorized: Please log in again.");
        } else if (status === 500) {
          toast.error("Internal server error: Please try again later.");
        } else {
          toast.error(`Error: ${data?.message || "Something went wrong!"}`);
        }
        console.error("Server-side error:", error.response);
      } else if (error.request) {
        toast.error("Network error: Unable to reach the server.");
        console.error("Network error:", error.request);
      } else {
        toast.error("Error: Something went wrong!");
        console.error("Error:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

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
      setForm((prevData) => ({
        ...prevData,
        [fieldName]: value,
      }));
    }
  };

  const handleAddItem = () => {
    setForm((prevData) => ({
      ...prevData,
      items: [
        ...prevData.items,
        {
          itemId: "",
          quantity: null,
          pickup: "",
          baseRate: null,
          taxpaidAmount: null,
          contNumber: null,
        },
      ],
    }));
  };

  const handleRemoveItem = (index) => {
    const updatedItems = form.items.filter((_, i) => i !== index);
    setForm((prevData) => ({
      ...prevData,
      items: updatedItems,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    if (field === "quantity" || field === "baseRate") {
      const quantity = updatedItems[index].quantity || 0;
      const baseRate = updatedItems[index].baseRate || 0;
      updatedItems[index].taxpaidAmount = quantity * baseRate;
    }
    setForm((prevData) => ({
      ...prevData,
      items: updatedItems,
    }));
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

  const handleOrderSelect = (orderId) => {
    if (selectedOrder === orderId) {
      setSelectedOrder(null);
    } else {
      setSelectedOrder(orderId);
      setQuantityInputs([]);
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    setQuantityInputs((prevInputs) => {
      const existingItem = prevInputs.find((item) => item.itemId === itemId);

      if (existingItem) {
        return prevInputs.map((item) =>
          item.itemId === itemId ? { ...item, quantity: newQuantity } : item
        );
      } else {
        return [...prevInputs, { itemId, quantity: newQuantity }];
      }
    });
  };

  console.log(selectedOrder);
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
          <div className="flex flex-row gap-4">
            <button className="w-fit bg-[#FF0000] text-white text-[1rem] font-medium rounded-lg px-8 py-2 flex flex-row items-center justify-center border-2 border-black gap-1">
              Delete
            </button>
            <button className="w-fit bg-[#38454A] text-white text-[1rem] font-medium rounded-lg px-8 py-2 flex flex-row items-center justify-center border-2 border-black gap-1">
              Edit
            </button>
            <button className="w-fit bg-[#DCDCDC] text-black text-[1rem] font-medium rounded-lg px-8 py-2 flex flex-row items-center justify-center border-2 border-black gap-1">
              PUBLISH
            </button>
          </div>
        </div>

        <div className="w-full">
          <form
            onSubmit={handleSubmit}
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
                  <div className="relative w-[180px]">
                    <select
                      id="warehouse"
                      name="warehouse"
                      value={form.warehouseId}
                      onChange={(e) =>
                        handleFormChange(0, "warehouseId", e.target.value)
                      }
                      className="appearance-none w-full bg-white border-2 border-[#CBCDCE] text-[#38454A] px-4 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBCDCE] cursor-pointer"
                      required
                    >
                      <option value="">Select Warehouse</option>
                      {warehouseOptions?.map((option) => (
                        <option key={option._id} value={option._id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <TbTriangleInvertedFilled className="text-[#5E5E5E]" />
                    </div>
                  </div>
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
                    placeholder="Company Bargain No."
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
                  <div className="relative w-[200px]">
                    <select
                      id="transporterId"
                      name="transporterId"
                      value={form.transporterId}
                      onChange={(e) =>
                        handleFormChange(0, "transporterId", e.target.value)
                      }
                      className="appearance-none w-full bg-white border-2 border-[#CBCDCE] text-[#38454A] px-4 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBCDCE] cursor-pointer"
                      required
                    >
                      <option value="">Select Transport</option>
                      {transportOptions?.map((option) => (
                        <option key={option._id} value={option._id}>
                          {option.transport}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <TbTriangleInvertedFilled className="text-[#5E5E5E]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button color="blue" type="submit" className="w-fit">
                  {loading ? <Spinner /> : <span>Create Purchase</span>}
                </Button>
              </div>
            </div>
          </form>

          <div className="overflow-x-scroll px-0 pt-0 pb-2 mt-2">
            {orders.length > 0 ? (
              <div className="flex flex-col gap-4 mt-4 mb-5 bg-white border-[2px] border-[#737373] shadow-md">
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border-collapse">
                    <thead>
                      <tr>
                        {[
                          "Select",
                          "Company Bargain No",
                          "Company Bargain Date",
                          "Manufacturer Name",
                          "Manufacturer Company",
                          "Manufacturer Contact",
                          "Status",
                          "Transport Category",
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
                        const isOpen = selectedOrder === order._id;
                        const isChecked = selectedOrder === order._id;
                        console.log(order);
                        return (
                          <React.Fragment key={order._id}>
                            <tr className="border-t-2 border-t-[#898989]">
                              <td className="py-4 text-center">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleOrderSelect(order._id)}
                                  className="form-checkbox h-5 w-5"
                                />
                              </td>
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
                              <td className="py-4 text-center">
                                {order.transportCatigory}
                              </td>
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
                                  {/* <Button
                                    color="blue"
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setShowEditOrderForm(true);
                                    }}
                                  >
                                    Edit
                                  </Button> */}
                                  {/* {!hasFutureBookings(order, bookings) && (
                                    <Tooltip content="Delete Order">
                                      <span className="w-fit h-fit">
                                        <MdDeleteOutline
                                          onClick={() =>
                                            handleDelete(order._id)
                                          }
                                          className="text-[2rem] text-red-700 border border-2 border-red-700 rounded-md hover:bg-red-700 hover:text-white transition-all cursor-pointer"
                                        />
                                      </span>
                                    </Tooltip>
                                  )} */}
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
                                            "Ordered Quantity",
                                            "Quantity to Purchase",
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
                                              {item.item.name}
                                            </td>
                                            <td className="py-4 text-center">
                                              {item.item.packaging}
                                            </td>
                                            <td className="py-4 text-center">
                                              {item.item.weight}
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
                                                  quantityInputs.find(
                                                    (q) =>
                                                      q.itemId === item.item._id
                                                  )?.quantity || ""
                                                }
                                                onChange={(e) =>
                                                  handleQuantityChange(
                                                    item.item._id,
                                                    e.target.value
                                                  )
                                                }
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
                No orders found!
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

export default CreatePurchase;
