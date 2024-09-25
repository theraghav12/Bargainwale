import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import {
  Button,
  Input,
  Spinner,
  IconButton,
  Select,
  Option,
} from "@material-tailwind/react";
import { getBuyer, getItems } from "@/services/masterService";
import { getWarehouses, getWarehouseById } from "@/services/warehouseService";
import { createBooking } from "@/services/bookingService";
import { LuAsterisk } from "react-icons/lu";
import { TbTriangleInvertedFilled } from "react-icons/tb";

// Add state for selected warehouse data
const CreateBooking = ({ fetchBookings }) => {
  const [loading, setLoading] = useState(false);
  const [itemsOptions, setItemsOptions] = useState([]);
  const [buyerOptions, setBuyerOptions] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [form, setForm] = useState({
    items: [{ item: "", quantity: 0, virtualQuantity: 0, billedQuantity: 0 }],
    BargainDate: "",
    BargainNo: "",
    validity: "",
    description: "",
    warehouse: "",
    deliveryOption: "",
    buyer: "",
    deliveryAddress: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pinCode: "",
    },
  });

  useEffect(() => {
    fetchItemsOptions();
    fetchWarehouseOptions();
    fetchBuyerOptions();
  }, []);

  const fetchItemsOptions = async () => {
    try {
      const response = await getItems();
      setItemsOptions(response);
    } catch (error) {
      toast.error("Error fetching items!");
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

  const fetchBuyerOptions = async () => {
    try {
      const response = await getBuyer();
      setBuyerOptions(response);
    } catch (error) {
      toast.error("Error fetching buyers!");
      console.error(error);
    }
  };

  const fetchWarehouseData = async (warehouseId) => {
    try {
      const response = await getWarehouseById(warehouseId);
      console.log(response);
      setSelectedWarehouse(response);
    } catch (error) {
      toast.error("Error fetching warehouse data!");
      console.error(error);
    }
  };

  useEffect(() => {
    if (form.warehouse) {
      fetchWarehouseData(form.warehouse);
    }
  }, [form.warehouse]);

  const calculateDaysDifference = (date1, date2) => {
    const diffTime = Math.abs(new Date(date2) - new Date(date1));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validity = calculateDaysDifference(form.BargainDate, form.validity);
      const updatedForm = {
        ...form,
        validity,
        organization: "66d56a1c8fd16e15f878ff6c",
      };
      console.log(updatedForm);

      const response = await createBooking(updatedForm);
      console.log(response);
      toast.success("Booking added successfully!");
      // setForm({
      //   items: [
      //     { item: "", quantity: 1, virtualQuantity: 0, billedQuantity: 0 },
      //   ],
      //   transportCatigory: "",
      //   BargainDate: "",
      //   BargainNo: "",
      //   manufacturer: "",
      //   validity: null,
      //   description: "",
      //   billType: "",
      //   warehouse: "",
      //   organization: "",
      // });
      fetchBookings();
    } catch (error) {
      toast.error("Error adding booking!");
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
    } else if (fieldName === "BargainDate") {
      const formattedDate = value.split("T")[0];
      setForm((prevData) => ({
        ...prevData,
        BargainDate: formattedDate,
      }));
    } else if (fieldName === "validity") {
      const formattedDate = value.split("T")[0];
      setForm((prevData) => ({
        ...prevData,
        validity: formattedDate,
      }));
    } else if (fieldName.includes("deliveryAddress")) {
      const addressField = fieldName.split(".")[1];
      setForm((prevData) => ({
        ...prevData,
        deliveryAddress: {
          ...prevData.deliveryAddress,
          [addressField]: value,
        },
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
        { item: "", quantity: 0, virtualQuantity: 0, billedQuantity: 0 },
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

  return (
    <div className="mt-8 mb-8 flex flex-col gap-12">
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
              <div className="flex justify-between">
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
                    htmlFor="transportCategory"
                    className="flex text-[#38454A] text-[1rem]"
                  >
                    Transport Category
                    <LuAsterisk className="text-[#FF0000] text-[0.7rem]" />
                  </label>
                  <div className="relative w-[200px]">
                    <select
                      id="transportCategory"
                      name="transportCategory"
                      value={form.transportCategory}
                      onChange={(e) =>
                        handleFormChange(0, "transportCategory", e.target.value)
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
                    <th className="py-4 text-center w-[200px]">
                      Transport Cost
                    </th>
                    <th className="py-4 text-center w-[200px]">Net Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {form.items.map((item, index) => (
                    <tr key={index} className="border-t-2 border-t-[#898989]">
                      <td className="py-4 text-center">
                        {form.companyBargainNo}
                      </td>
                      <td className="py-4 text-center">{item.quantity}</td>
                      <td className="py-4 text-center">{item.packaging}</td>
                      <td className="py-4 text-center">{item.costPrice}</td>
                      <td className="py-4 text-center">{item.gst}</td>
                      <td className="py-4 text-center">
                        {form.transportCatigory}
                      </td>
                      <td className="py-4 text-center">{form.transportCost}</td>
                      <td className="py-4 text-center">{item.netAmount}</td>
                    </tr>
                  ))} */}
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
