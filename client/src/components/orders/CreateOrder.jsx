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

const CreateOrderForm = ({ fetchOrdersData }) => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [itemsOptions, setItemsOptions] = useState([]);
  const [transportOptions, setTransportOptions] = useState([]);
  const [manufacturerOptions, setManufacturerOptions] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [form, setForm] = useState({
    items: [{ itemId: "", quantity: 0 }],
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

      const response = await createOrder(updatedForm);
      toast.success("Order added successfully!");
      setForm({
        items: [{ itemId: "", quantity: 1 }],
        transportCatigory: "",
        companyBargainNo: "",
        companyBargainDate: "",
        manufacturer: "",
        paymentDays: null,
        description: "",
        warehouse: "",
        organization: "",
      });
      fetchOrdersData();
    } catch (error) {
      toast.error("Error adding order!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (index, fieldName, value) => {
    if (fieldName === "items") {
      const updatedItems = [...form.items];
      updatedItems[index] = value;
      setForm((prevData) => ({
        ...prevData,
        items: updatedItems,
      }));
    } else if (fieldName === "companyBargainDate") {
      const formattedDate = value.split("T")[0];
      setForm((prevData) => ({
        ...prevData,
        companyBargainDate: formattedDate,
      }));
    } else if (fieldName === "paymentDays") {
      const formattedDate = value.split("T")[0];
      setForm((prevData) => ({
        ...prevData,
        paymentDays: formattedDate,
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
      items: [...prevData.items, { itemId: "", quantity: 1 }],
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
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-5 bg-white shadow-md rounded-xl"
      >
        <div className="flex flex-col gap-4">
          {form.items.map((item, index) => (
            <div key={index} className="flex justify-between">
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
                  className="text-[#38454A] text-[1rem]"
                >
                  Company Bargain No.
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
                  htmlFor="iphoneSelect"
                  className="text-[#38454A] text-[1rem]"
                >
                  Supplier
                </label>
                <div className="relative w-[180px]">
                  <select
                    id="iphoneSelect"
                    name="iphoneSelect"
                    // value={selectedValue}
                    // onChange={(e) => handleSelectChange(e.target.value)}
                    className="appearance-none w-full bg-white border-2 border-[#CBCDCE] text-[#38454A] px-4 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBCDCE] cursor-pointer"
                  >
                    <option value="">Choose an option</option>
                    <option
                      value="option1"
                      className="bg-white hover:bg-gray-100"
                    >
                      Option 1
                    </option>
                    <option
                      value="option2"
                      className="bg-white hover:bg-gray-100"
                    >
                      Option 2
                    </option>
                    <option
                      value="option3"
                      className="bg-white hover:bg-gray-100"
                    >
                      Option 3
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <TbTriangleInvertedFilled className="text-[#5E5E5E]" />
                  </div>
                </div>
              </div>

              <div className="w-fit flex gap-5 items-center">
                <label
                  htmlFor="quantity"
                  className="text-[#38454A] text-[1rem]"
                >
                  Quantity
                </label>
                <input
                  name="quantity"
                  type="number"
                  value={item.quantity}
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
                {index > 0 && (
                  <IconButton
                    color="red"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <FaTrashAlt />
                  </IconButton>
                )}
              </div>
            </div>
          ))}

          <Button
            color="green"
            type="button"
            onClick={handleAddItem}
            className="w-fit flex flex-row gap-2 items-center"
          >
            <FaPlus /> Add Another Item
          </Button>

          <div className="grid grid-cols-4 gap-2">
            <Input
              name="companyBargainDate"
              label="Company Bargain Date"
              type="date"
              value={form.companyBargainDate}
              onChange={(e) =>
                handleFormChange(0, "companyBargainDate", e.target.value)
              }
              required
            />
            {warehouseOptions.length > 0 && (
              <Select
                name="manufacturer"
                label="Select Warehouse"
                value={form.warehouse}
                onChange={(value) => handleFormChange(0, "warehouse", value)}
                required
              >
                {warehouseOptions.map((option) => (
                  <Option key={option._id} value={option._id}>
                    {option.name}
                  </Option>
                ))}
              </Select>
            )}

            {manufacturerOptions.length > 0 && (
              <Select
                name="manufacturer"
                label="Select Manufacturer"
                value={form.manufacturer}
                onChange={(value) => handleFormChange(0, "manufacturer", value)}
                required
              >
                {manufacturerOptions.map((option) => (
                  <Option key={option._id} value={option._id}>
                    {option.manufacturer}
                  </Option>
                ))}
              </Select>
            )}

            {/* <Select
              name="billType"
              label="Select Bill Type"
              value={form.billType}
              onChange={(value) => handleFormChange(0, "billType", value)}
              required
            >
              <Option value="Virtual Billed">Virtual Billed</Option>
              <Option value="Billed">Billed</Option>
            </Select> */}
          </div>

          <div className="grid grid-cols-5 gap-2">
            <Select
              name="transportCatigory"
              label="Select Transport Category"
              value={form.transportCatigory}
              onChange={(value) =>
                handleFormChange(0, "transportCatigory", value)
              }
              required
            >
              <Option value="Depo">Depo</Option>
              <Option value="Rack">Rack</Option>
            </Select>

            <Input
              name="paymentDays"
              label="Payment Date"
              type="date"
              value={form.paymentDays}
              onChange={(e) =>
                handleFormChange(0, "paymentDays", e.target.value)
              }
              min={1}
              required
            />
            <Input
              name="description"
              label="Description"
              type="text"
              value={form.description}
              onChange={(e) =>
                handleFormChange(0, "description", e.target.value)
              }
            />
            <Button color="blue" type="submit">
              {loading ? <Spinner /> : <span>Add Order</span>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateOrderForm;
