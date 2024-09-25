import {
  Button,
  Input,
  Spinner,
  IconButton,
  Select,
  Option,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

// api services
import { createOrder, getOrders } from "@/services/orderService";
import {
  getItems,
  getManufacturer,
  getTransport,
} from "@/services/masterService";
import { getWarehouses } from "@/services/warehouseService";

// icons
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { LuAsterisk } from "react-icons/lu";

const CreateOrderForm = ({ fetchOrdersData }) => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [itemsOptions, setItemsOptions] = useState([]);
  const [transportOptions, setTransportOptions] = useState([]);
  const [manufacturerOptions, setManufacturerOptions] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [form, setForm] = useState({
    items: [{ itemId: "", quantity: null }],
    transportCatigory: "",
    companyBargainNo: "",
    companyBargainDate: "",
    manufacturer: "",
    paymentDays: "",
    description: "",
    billType: "Virtual Billed",
    warehouse: "",
  });

  useEffect(() => {
    fetchOrders();
    fetchItemsOptions();
    fetchTransportOptions();
    fetchManufacturerOptions();
    fetchWarehouseOptions();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response);
    } catch (error) {
      toast.error("Error fetching orders!");
      console.error(error);
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
      toast.error("Error fetching transport options!");
      console.error(error);
    }
  };

  const fetchManufacturerOptions = async () => {
    try {
      const response = await getManufacturer();
      setManufacturerOptions(response);
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
        ...form,
        paymentDays,
        organization: "64d22f5a8b3b9f47a3b0e7f1",
      };
      console.log(updatedForm);

      // const response = await createOrder(updatedForm);
      // toast.success("Order added successfully!");
      // setForm({
      //   items: [{ itemId: "", quantity: 1 }],
      //   transportCatigory: "",
      //   companyBargainNo: "",
      //   companyBargainDate: "",
      //   manufacturer: "",
      //   paymentDays: null,
      //   description: "",
      //   warehouse: "",
      //   organization: "",
      // });
      // fetchOrdersData();
    } catch (error) {
      toast.error("Error adding order!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (index, fieldName, value) => {
    if (fieldName === "items") {
      // Update specific item in the items array
      const updatedItems = [...form.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [fieldName]: value, // Update the specific field in the item
      };
      setForm((prevData) => ({
        ...prevData,
        items: updatedItems, // Update items in form state
      }));
    } else if (
      fieldName === "companyBargainDate" ||
      fieldName === "paymentDays"
    ) {
      // For date fields, format them before updating
      const formattedDate = value.split("T")[0]; // Assuming the value is in ISO format
      setForm((prevData) => ({
        ...prevData,
        [fieldName]: formattedDate, // Dynamically update date fields
      }));
    } else {
      // Update other form fields
      setForm((prevData) => ({
        ...prevData,
        [fieldName]: value, // General form update for non-date, non-item fields
      }));
    }
  };

  const handleAddRow = () => {
    setForm((prevData) => ({
      ...prevData,
      items: [
        ...prevData.items,
        {
          itemId: "",
          quantity: null,
          packaging: "",
          costPrice: "",
          gst: "",
          transport: "",
          transportCost: "",
          netAmount: "",
        },
      ],
    }));
  };

  const handleAddItem = () => {
    setForm((prevData) => ({
      ...prevData,
      items: [...prevData.items, { itemId: "", quantity: null }],
    }));
  };

  const handleRemoveItem = (index) => {
    const updatedItems = form.items.filter((_, i) => i !== index);
    setForm((prevData) => ({
      ...prevData,
      items: updatedItems,
    }));
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 mt-4 mb-5 bg-white border-[2px] border-[#737373] p-5 bg-white shadow-md"
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            {/* {itemsOptions?.length > 0 && (
                <Select
                  name="itemId"
                  label={`Select Item ${index + 1}`}
                  value={item.itemId}
                  onChange={(value) =>
                    handleFormChange(index, "items", {
                      ...item,
                      itemId: value,
                    })
                  }
                  required
                >
                  {itemsOptions?.map((option) => (
                    <Option key={option._id} value={option._id}>
                      {option.name}
                    </Option>
                  ))}
                </Select>
              )} */}
            <div className="w-fit flex gap-5 items-center">
              <label
                htmlFor="companyBargainNo"
                className="flex text-[#38454A] text-[1rem]"
              >
                Company Bargain No.
                <LuAsterisk className="text-[#FF0000] text-[0.7rem]" />
              </label>
              <input
                name="companyBargainNo"
                type="text"
                value={form.companyBargainNo}
                onChange={(e) =>
                  handleFormChange(0, "companyBargainNo", e.target.value)
                }
                required
                placeholder="Company Bargain No."
                className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373]"
              />
            </div>

            <div className="flex gap-5 items-center">
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
                  {warehouseOptions.map((option) => (
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

            <div className="flex gap-5 items-center">
              <label
                htmlFor="manufacturer"
                className="flex text-[#38454A] text-[1rem]"
              >
                Manufacturer
                <LuAsterisk className="text-[#FF0000] text-[0.7rem]" />
              </label>
              <div className="relative w-[200px]">
                <select
                  id="manufacturer"
                  name="manufacturer"
                  value={form.manufacturer}
                  onChange={(e) =>
                    handleFormChange(0, "manufacturer", e.target.value)
                  }
                  className="appearance-none w-full bg-white border-2 border-[#CBCDCE] text-[#38454A] px-4 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBCDCE] cursor-pointer"
                  required
                >
                  <option value="">Select Manufacturer</option>
                  {manufacturerOptions.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.manufacturer}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <TbTriangleInvertedFilled className="text-[#5E5E5E]" />
                </div>
              </div>
            </div>

            <div className="w-fit flex gap-5 items-center">
              <label
                htmlFor="companyBargainDate"
                className="flex text-[#38454A] text-[1rem]"
              >
                Company Bargain Date
                <LuAsterisk className="text-[#FF0000] text-[0.7rem]" />
              </label>
              <input
                name="companyBargainDate"
                type="date"
                value={form.companyBargainDate}
                onChange={(e) =>
                  handleFormChange(0, "companyBargainDate", e.target.value)
                }
                required
                className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md"
              />
            </div>
          </div>

          <div className="flex gap-10">
            <div className="flex gap-5 items-center">
              <label
                htmlFor="transportCatigory"
                className="flex text-[#38454A] text-[1rem]"
              >
                Transport Category
                <LuAsterisk className="text-[#FF0000] text-[0.7rem]" />
              </label>
              <div className="relative w-[200px]">
                <select
                  id="transportCatigory"
                  name="transportCatigory"
                  value={form.transportCatigory}
                  onChange={(e) =>
                    handleFormChange(0, "transportCatigory", e.target.value)
                  }
                  className="appearance-none w-full bg-white border-2 border-[#CBCDCE] text-[#38454A] px-4 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBCDCE] cursor-pointer"
                  required
                >
                  <option value="">Select Transport</option>
                  <option value="Depo">Depo</option>
                  <option value="Rack">Rack</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <TbTriangleInvertedFilled className="text-[#5E5E5E]" />
                </div>
              </div>
            </div>

            <div className="w-fit flex gap-5 items-center">
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

            <div className="w-fit flex gap-5 items-center">
              <label htmlFor="quantity" className="text-[#38454A] text-[1rem]">
                Quantity
              </label>
              <input
                name="quantity"
                type="number"
                // value={item.quantity}
                onChange={(e) =>
                  handleFormChange(index, "items", {
                    ...item,
                    quantity: e.target.value,
                  })
                }
                min={1}
                required
                placeholder="Quantity"
                className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373]"
              />
              {/* {index > 0 && (
                  <IconButton
                    color="red"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <FaTrashAlt />
                  </IconButton>
                )} */}
            </div>

            <div className="w-fit flex gap-5 items-center">
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

          <Button
            color="green"
            type="button"
            onClick={handleAddItem}
            className="w-fit flex flex-row gap-2 items-center"
          >
            <FaPlus /> Add Another Item
          </Button>

          <div className="grid grid-cols-5 gap-2">
            <Button color="blue" type="submit">
              {loading ? <Spinner /> : <span>Add Order</span>}
            </Button>
          </div>
        </div>
      </form>
      <div className="flex flex-col gap-4 mt-4 mb-5 bg-white border-[2px] border-[#737373] shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="py-4 text-center w-[200px]">Item Code</th>
                <th className="py-4 text-center w-[200px]">Quantity</th>
                <th className="py-4 text-center w-[200px]">Packaging</th>
                <th className="py-4 text-center w-[200px]">Cost Price</th>
                <th className="py-4 text-center w-[200px]">GST</th>
                <th className="py-4 text-center w-[200px]">Transport</th>
                <th className="py-4 text-center w-[200px]">Transport Cost</th>
                <th className="py-4 text-center w-[200px]">Net Amount</th>
              </tr>
            </thead>
            <tbody>
              {form.items.map((item, index) => (
                <tr key={index} className="border-t-2 border-t-[#898989]">
                  <td className="py-4 text-center">{form.companyBargainNo}</td>
                  <td className="py-4 text-center">{item.quantity}</td>
                  <td className="py-4 text-center">{item.packaging}</td>
                  <td className="py-4 text-center">{item.costPrice}</td>
                  <td className="py-4 text-center">{item.gst}</td>
                  <td className="py-4 text-center">{form.transportCatigory}</td>
                  <td className="py-4 text-center">{form.transportCost}</td>
                  <td className="py-4 text-center">{item.netAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>{" "}
    </>
  );
};

export default CreateOrderForm;
