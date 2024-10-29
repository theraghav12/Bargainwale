import { Button, Spinner, Tooltip } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

// api services
import { getBuyer, getItems, getManufacturer } from "@/services/masterService";
import { getWarehouses } from "@/services/warehouseService";

// icons
import { FaPlus } from "react-icons/fa";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { LuAsterisk } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { createOrder } from "@/services/orderService";
import { createBooking } from "@/services/bookingService";
import { getPricesById } from "@/services/itemService";

const CreateBooking = () => {
  const [loading, setLoading] = useState(false);
  const [itemsOptions, setItemsOptions] = useState([]);
  const [buyerOptions, setBuyerOptions] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);

  const [form, setForm] = useState({
    items: [],
    BargainNo: "",
    BargainDate: "",
    buyer: "",
    description: "",
    warehouse: "",
    deliveryOption: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
    organization: localStorage.getItem("organizationId"),
  });

  useEffect(() => {
    fetchItemsOptions();
    fetchBuyerOptions();
    fetchWarehouseOptions();
  }, []);

  const fetchItemsOptions = async () => {
    try {
      const response = await getItems();
      console.log(response);
      setItemsOptions(response);
    } catch (error) {
      toast.error("Error fetching items!");
      console.error(error);
    }
  };

  const fetchBuyerOptions = async () => {
    try {
      const response = await getBuyer();
      setBuyerOptions(response);
    } catch (error) {
      toast.error("Error fetching manufacturers!");
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
      const paymentDays = calculateDaysDifference(
        form.companyBargainDate,
        form.paymentDays
      );

      const updatedForm = {
        items: form.items,
        BargainNo: form.BargainNo,
        BargainDate: form.BargainDate,
        buyer: form.buyer,
        description: form.description,
        warehouse: form.warehouse,
        deliveryOption: form.deliveryOption,
        deliveryAddress: {
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          state: form.state,
          pinCode: form.pinCode,
        },
        paymentDays,
        organization: form.organization,
      };

      console.log(updatedForm);
      const response = await createBooking(updatedForm);

      if (response.status === 201) {
        toast.success("Booking created successfully!");
      } else {
        toast.error(`Unexpected status code: ${response.status}`);
        console.error("Unexpected response:", response);
      } // setForm({
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
    } else if (fieldName === "BargainDate" || fieldName === "paymentDays") {
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
          item: "",
          quantity: null,
          pickup: "",
          baseRate: null,
          taxpaidAmount: null,
          taxableAmount: null,
          contNumber: null,
          gst: null,
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

  const handleItemChange = async (index, field, value) => {
    if (!form.warehouse) {
      toast.error("Please select a warehouse first");
      return;
    }

    const updatedItems = [...form.items];
    if (field === "quantity" || field === "baseRate") {
      value = Number(value) || null;
    }
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    try {
      if (
        updatedItems[index].item &&
        updatedItems[index].pickup &&
        form.warehouse
      ) {
        const response = await getPricesById(
          updatedItems[index].item,
          form.warehouse
        );
        if (response.status === 200) {
          if (updatedItems[index].pickup === "rack") {
            updatedItems[index].baseRate = response.data.rackPrice;
          } else if (updatedItems[index].pickup === "plant") {
            updatedItems[index].baseRate = response.data.plantPrice;
          } else {
            updatedItems[index].baseRate = response.data.depoPrice;
          }
        }
      }
    } catch (err) {
      if (err.response.status === 404) {
        toast.error("Item price not updated for selected warehouse");
      }
    }
    if (field === "item") {
      const selectedItem = itemsOptions?.find((option) => option._id === value);
      if (selectedItem) {
        const gst = selectedItem.gst;
        updatedItems[index].gst = gst;
      }
    }

    if (field === "quantity" || field === "baseRate") {
      console.log(updatedItems);
      const quantity = updatedItems[index].quantity || 0;
      const baseRate = updatedItems[index].baseRate || 0;
      updatedItems[index].taxpaidAmount = quantity * baseRate;
      updatedItems[index].taxableAmount =
        updatedItems[index].taxpaidAmount +
        (updatedItems[index].taxpaidAmount * updatedItems[index].gst) / 100;
    }
    setForm((prevData) => ({
      ...prevData,
      items: updatedItems,
    }));
  };

  const calculateTotalQuantity = () => {
    return form.items.reduce((total, item) => {
      return total + (Number(item.quantity) || 0);
    }, 0);
  };

  const calculateTotalAmount = () => {
    return form.items.reduce((total, item) => {
      return total + (Number(item.taxableAmount) || 0);
    }, 0);
  };

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
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 mt-4 mb-5 bg-white border-[2px] border-[#737373] p-5 bg-white shadow-md"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-x-16 gap-y-5">
                <div className="w-fit flex gap-5 items-center">
                  <label
                    htmlFor="BargainNo"
                    className="flex text-[#38454A] text-[1rem]"
                  >
                    Bargain No.
                    <LuAsterisk className="text-[#FF0000] text-[0.7rem]" />
                  </label>
                  <input
                    name="BargainNo"
                    type="text"
                    value={form.BargainNo}
                    onChange={(e) =>
                      handleFormChange(0, "BargainNo", e.target.value)
                    }
                    required
                    placeholder="Bargain No."
                    className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373]"
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="warehouse"
                    className="flex text-[#38454A] text-[1rem]"
                  >
                    Warehouse
                    <LuAsterisk className="text-[#FF0000] text-[0.7rem]" />
                  </label>
                  <div className="relative w-[180px]">
                    <select
                      id="warehouse"
                      name="warehouse"
                      value={form.warehouse}
                      onChange={(e) =>
                        handleFormChange(0, "warehouse", e.target.value)
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

                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="buyer"
                    className="flex text-[#38454A] text-[1rem]"
                  >
                    Buyer
                    <LuAsterisk className="text-[#FF0000] text-[0.7rem]" />
                  </label>
                  <div className="relative w-[200px]">
                    <select
                      id="buyer"
                      name="buyer"
                      value={form.buyer}
                      onChange={(e) =>
                        handleFormChange(0, "buyer", e.target.value)
                      }
                      className="appearance-none w-full bg-white border-2 border-[#CBCDCE] text-[#38454A] px-4 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBCDCE] cursor-pointer"
                      required
                    >
                      <option value="">Select Buyer</option>
                      {buyerOptions?.map((option) => (
                        <option key={option._id} value={option._id}>
                          {option.buyer}
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
                    htmlFor="BargainDate"
                    className="flex text-[#38454A] text-[1rem]"
                  >
                    Bargain Date
                    <LuAsterisk className="text-[#FF0000] text-[0.7rem]" />
                  </label>
                  <input
                    name="BargainDate"
                    type="date"
                    value={form.BargainDate}
                    onChange={(e) =>
                      handleFormChange(0, "BargainDate", e.target.value)
                    }
                    required
                    className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md"
                  />
                </div>

                <div className="w-fit flex gap-2 items-center">
                  <label
                    htmlFor="paymentDays"
                    className="flex text-[#38454A] text-[1rem]"
                  >
                    Payment Date
                    <LuAsterisk className="text-[#FF0000] text-[0.7rem]" />
                  </label>
                  <input
                    name="paymentDays"
                    type="date"
                    value={form.paymentDays}
                    onChange={(e) =>
                      handleFormChange(0, "paymentDays", e.target.value)
                    }
                    required
                    className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md"
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="deliveryOption"
                    className="flex text-[#38454A] text-[1rem]"
                  >
                    Delivery Option
                    <LuAsterisk className="text-[#FF0000] text-[0.7rem]" />
                  </label>
                  <div className="relative w-[200px]">
                    <select
                      id="deliveryOption"
                      name="deliveryOption"
                      value={form.deliveryOption}
                      onChange={(e) => {
                        handleFormChange(0, "deliveryOption", e.target.value);
                        if (form.deliveryOption === "Pickup") {
                          setForm((prev) => ({
                            ...prev,
                            deliveryAddress: {
                              addressLine1: "",
                              addressLine2: "",
                              city: "",
                              state: "",
                              pinCode: "",
                            },
                          }));
                        }
                      }}
                      className="appearance-none w-full bg-white border-2 border-[#CBCDCE] text-[#38454A] px-4 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBCDCE] cursor-pointer"
                      required
                    >
                      <option value="">Select Option</option>
                      <option value="Delivery">Delivery</option>
                      <option value="Pickup">Pickup</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <TbTriangleInvertedFilled className="text-[#5E5E5E]" />
                    </div>
                  </div>
                </div>

                <div className="w-fit flex gap-2 items-center">
                  <label
                    htmlFor="description"
                    className="text-[#38454A] text-[1rem]"
                  >
                    Description
                  </label>
                  <input
                    name="description"
                    type="text"
                    value={form.description}
                    onChange={(e) =>
                      handleFormChange(0, "description", e.target.value)
                    }
                    className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373]"
                    placeholder="Description"
                  />
                </div>
              </div>

              {/* Delivery Address Fields */}
              {form.deliveryOption === "Delivery" && (
                <div className="flex flex-col">
                  <p className="text-[1.1rem] text-[#38454A] font-semibold mt-4">
                    Delivery Address:
                  </p>
                  <div className="flex flex-wrap gap-x-16 gap-y-5 mt-2">
                    <div className="flex gap-2 items-center">
                      <label
                        htmlFor="addressLine1"
                        className="text-[#38454A] text-[1rem]"
                      >
                        Address Line 1
                      </label>
                      <input
                        name="addressLine1"
                        type="text"
                        value={form.addressLine1}
                        onChange={(e) =>
                          handleFormChange(0, "addressLine1", e.target.value)
                        }
                        className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373]"
                        placeholder="Address Line 1"
                      />
                    </div>

                    <div className="flex gap-2 items-center">
                      <label
                        htmlFor="addressLine2"
                        className="text-[#38454A] text-[1rem]"
                      >
                        Address Line 2
                      </label>
                      <input
                        name="addressLine2"
                        type="text"
                        value={form.addressLine2}
                        onChange={(e) =>
                          handleFormChange(0, "addressLine2", e.target.value)
                        }
                        className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373]"
                        placeholder="Address Line 2"
                      />
                    </div>

                    <div className="flex gap-2 items-center">
                      <label
                        htmlFor="city"
                        className="text-[#38454A] text-[1rem]"
                      >
                        City
                      </label>
                      <input
                        name="city"
                        type="text"
                        value={form.city}
                        onChange={(e) =>
                          handleFormChange(0, "city", e.target.value)
                        }
                        className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373]"
                        placeholder="City"
                      />
                    </div>

                    <div className="flex gap-2 items-center">
                      <label
                        htmlFor="state"
                        className="text-[#38454A] text-[1rem]"
                      >
                        State
                      </label>
                      <input
                        name="state"
                        type="text"
                        value={form.state}
                        onChange={(e) =>
                          handleFormChange(0, "state", e.target.value)
                        }
                        className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373]"
                        placeholder="State"
                      />
                    </div>

                    <div className="flex gap-2 items-center">
                      <label
                        htmlFor="pinCode"
                        className="text-[#38454A] text-[1rem]"
                      >
                        Pin Code
                      </label>
                      <input
                        name="pinCode"
                        type="text"
                        value={form.pinCode}
                        onChange={(e) =>
                          handleFormChange(0, "pinCode", e.target.value)
                        }
                        className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373]"
                        placeholder="Pin Code"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4">
                <Button
                  color="green"
                  type="button"
                  onClick={handleAddItem}
                  className="w-[140px] flex flex-row gap-2 items-center justify-center"
                >
                  <FaPlus /> Add Item
                </Button>

                <Button
                  color="blue"
                  type="submit"
                  className="w-[150px] flex items-center justify-center"
                >
                  {loading ? <Spinner /> : <span>Create Booking</span>}
                </Button>
              </div>
            </div>
          </form>

          <div className="fixed bottom-0 left-0 right-0 bg-[#E4E4E4] shadow-md z-[10]">
            <div className="flex justify-between items-center px-10 py-2">
              <div className="w-full flex flex-row justify-between text-[1rem] font-medium">
                <span>Total Qty: {calculateTotalQuantity()}</span>
                {/* <span>Total Gross Weight:</span>
                <span>Total Net Weight:</span> */}
                <span>Total Amount: {calculateTotalAmount()}</span>
              </div>
            </div>
            <div className="bg-white text-[1rem] flex justify-between items-center px-4 py-1">
              <p>2024 @ Bargainwale</p>
              <p>Design and Developed by Reduxcorporation</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-4 mb-5 bg-white border-[2px] border-[#737373] shadow-md">
            <div className="overflow-x-auto">
              <table className="max-w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="py-4 text-center w-[200px]">CBN</th>
                    <th className="py-4 text-center w-[200px]">CBD</th>
                    <th className="py-4 text-center w-[200px]">Item</th>
                    <th className="py-4 text-center w-[200px]">Quantity</th>
                    <th className="py-4 text-center w-[200px]">Pickup</th>
                    <th className="py-4 text-center w-[200px]">Cont. No.</th>
                    <th className="py-4 text-center w-[200px]">Base Rate</th>
                    <th className="py-4 text-center w-[200px]">
                      Tax Paid Amount
                    </th>
                    <th className="py-4 text-center w-[200px]">
                      Taxable Amount
                    </th>
                    <th className="py-4 text-center w-[200px]">Payment Date</th>
                    {/* <th className="py-4 text-center w-[200px]">Description</th> */}
                    <th className="py-4 text-center w-[200px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {form.items?.map((item, index) => (
                    <tr key={index} className="border-t-2 border-t-[#898989]">
                      <td className="py-4 text-center">{form.BargainNo}</td>
                      <td className="py-4 text-center">{form.BargainDate}</td>
                      <td className="py-4 text-center">
                        <div className="relative w-[150px]">
                          <select
                            id="item"
                            name="item"
                            value={item.item}
                            onChange={(e) =>
                              handleItemChange(index, "item", e.target.value)
                            }
                            className="appearance-none w-full bg-white border-2 border-[#CBCDCE] text-[#38454A] px-4 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBCDCE] cursor-pointer"
                            required
                          >
                            <option value="">Select Item</option>
                            {itemsOptions?.map((item) => (
                              <option key={item._id} value={item._id}>
                                {item.materialdescription}
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
                          className="w-[150px] border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373]"
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
                          className="w-[150px] border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373]"
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
                          disabled
                          required
                          placeholder="Base Rate"
                          className="w-[150px] bg-white text-center px-2 py-1 rounded-md placeholder-[#737373]"
                        />
                      </td>
                      <td className="py-4 text-center">{item.taxpaidAmount}</td>
                      <td className="py-4 text-center">{item.taxableAmount}</td>
                      <td className="py-4 text-center">{form.paymentDays}</td>
                      {/* <td className="py-4 text-center">{form.description}</td> */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBooking;
