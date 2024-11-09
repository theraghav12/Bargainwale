import { Button, Spinner, Tooltip } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Select from "react-select";

// api services
import { getItems, getManufacturer } from "@/services/masterService";
import { getWarehouses } from "@/services/warehouseService";
import { createOrder } from "@/services/orderService";

// icons
import { FaPlus } from "react-icons/fa";
import { LuAsterisk } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";

const CreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [itemsOptions, setItemsOptions] = useState([]);
  const [selectItemsOptions, setSelectItemsOptions] = useState([]);
  const [manufacturerOptions, setManufacturerOptions] = useState([]);
  const [selectManufacturerOptions, setSelectManufacturerOptions] = useState(
    []
  );
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [selectWarehouseOptions, setSelectWarehouseOptions] = useState([]);

  const [form, setForm] = useState({
    items: [],
    inco: "",
    companyBargainNo: "",
    companyBargainDate: "",
    manufacturer: "",
    paymentDays: "",
    description: "",
    warehouse: "",
    organization: localStorage.getItem("organizationId"),
  });

  const fetchItemsOptions = async () => {
    try {
      const response = await getItems();
      setItemsOptions(response);
      const formattedOptions = response.map((item) => ({
        value: item._id,
        label: item.materialdescription,
      }));
      setSelectItemsOptions(formattedOptions);
    } catch (error) {
      toast.error("Error fetching items!");
      console.error(error);
    }
  };

  const fetchManufacturerOptions = async () => {
    try {
      const response = await getManufacturer();
      setManufacturerOptions(response);
      const formattedOptions = response.map((manufacturer) => ({
        value: manufacturer._id,
        label: manufacturer.manufacturer,
      }));
      setSelectManufacturerOptions(formattedOptions);
    } catch (error) {
      toast.error("Error fetching manufacturers!");
      console.error(error);
    }
  };

  const fetchWarehouseOptions = async () => {
    try {
      const response = await getWarehouses();
      setWarehouseOptions(response);
      const formattedOptions = response.map((warehouse) => ({
        value: warehouse._id,
        label: warehouse.name,
      }));
      setSelectWarehouseOptions(formattedOptions);
    } catch (error) {
      toast.error("Error fetching warehouses!");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchItemsOptions();
    fetchManufacturerOptions();
    fetchWarehouseOptions();
  }, []);

  const calculateDaysDifference = (date1, date2) => {
    const diffTime = Math.abs(new Date(date2) - new Date(date1));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.items.length === 0) {
      toast.error("Please add at least one item before creating the order!");
      setLoading(false);
      return;
    }

    try {
      const paymentDays = calculateDaysDifference(
        form.companyBargainDate,
        form.paymentDays
      );

      const updatedForm = {
        ...form,
        paymentDays,
      };

      const response = await createOrder(updatedForm);

      if (response?.status === 201) {
        toast.success("Order created successfully!");
      } else {
        toast.error(`Unexpected status code: ${response?.status}`);
        console.error("Unexpected response:", response);
      }
      setForm({
        items: [],
        inco: "",
        companyBargainNo: "",
        companyBargainDate: "",
        manufacturer: "",
        paymentDays: "",
        description: "",
        warehouse: "",
      });
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          toast.error(data.error?.message || data.message);
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
    } else if (
      fieldName === "warehouse" ||
      fieldName === "manufacturer" ||
      fieldName === "inco"
    ) {
      setForm((prevForm) => ({
        ...prevForm,
        [fieldName]: value.value || "",
      }));
    } else if (
      fieldName === "companyBargainDate" ||
      fieldName === "paymentDays"
    ) {
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
          taxableAmount: null,
          gstAmount: null,
          contNumber: null,
          gst: null,
          cgst: null,
          sgst: null,
          igst: null,
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
    if (field === "quantity" || field === "baseRate") {
      value = Number(value) || null;
    }

    if (field === "itemId" || field === "pickup") {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value.value || "",
      };
    } else {
      updatedItems[index] = { ...updatedItems[index], [field]: value };
    }

    // If the itemId is changed, update GST accordingly
    if (field === "itemId") {
      const selectedItem = itemsOptions?.find(
        (option) => option._id === value.value
      );
      if (selectedItem) {
        const gst = selectedItem.gst;
        const warehouseState = warehouseOptions?.find(
          (warehouse) => warehouse._id === form?.warehouse
        )?.state;
        const manufacturerState = manufacturerOptions?.find(
          (man) => man._id === form?.manufacturer
        )?.manufacturerdeliveryAddress.state;
        updatedItems[index].gst = gst;

        if (warehouseState === manufacturerState) {
          updatedItems[index].cgst = gst / 2;
          updatedItems[index].sgst = gst / 2;
          updatedItems[index].igst = null;
        } else {
          updatedItems[index].igst = gst;
          updatedItems[index].cgst = null;
          updatedItems[index].sgst = null;
        }
      }
    }

    // Calculate tax paid amount if needed
    if (field === "quantity" || field === "baseRate") {
      const quantity = updatedItems[index].quantity || 0;
      const baseRate = updatedItems[index].baseRate || 0;
      updatedItems[index].taxableAmount = quantity * baseRate;
      updatedItems[index].gstAmount =
        (baseRate * updatedItems[index].gst) / 100;
      updatedItems[index].taxpaidAmount =
        updatedItems[index].taxableAmount +
        (updatedItems[index].taxableAmount * updatedItems[index].gst) / 100;
    }

    // Update the form state
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

  const calculateTotalGrossWeight = () => {
    return form.items.reduce((total, item) => {
      return (
        total +
        (Number(
          itemsOptions.find((it) => it._id === item.itemId)?.grossweight
        ) || 0) *
          (Number(item.quantity) || 0)
      );
    }, 0);
  };

  return (
    <div className="w-[99vw] h-full mt-8 mb-8 flex flex-col gap-12 px-7">
      <div className="">
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
                <div className="w-fit flex gap-2 items-center">
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

                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="warehouse"
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
                        (option) => option.value === form.warehouse
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      handleFormChange(0, "warehouse", selectedOption)
                    }
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="manufacturer"
                    className="flex text-[#38454A] text-[1rem]"
                  >
                    Manufacturer
                    <LuAsterisk className="text-[#FF0000] text-[0.7rem]" />
                  </label>
                  <Select
                    className="relative w-[180px]"
                    options={selectManufacturerOptions}
                    value={
                      selectManufacturerOptions.find(
                        (option) => option.value === form.manufacturer
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      handleFormChange(0, "manufacturer", selectedOption)
                    }
                  />
                </div>

                <div className="w-fit flex gap-2 items-center">
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
                    htmlFor="inco"
                    className="flex text-[#38454A] text-[1rem]"
                  >
                    Inco
                    <LuAsterisk className="text-[#FF0000] text-[0.7rem]" />
                  </label>
                  <Select
                    className="relative w-[180px]"
                    options={[
                      { value: "EXW", label: "EXW" },
                      { value: "FOR", label: "FOR" },
                    ]}
                    value={
                      [
                        { value: "EXW", label: "EXW" },
                        { value: "FOR", label: "FOR" },
                      ].find((option) => option.value === form.inco) || null
                    }
                    onChange={(selectedOption) =>
                      handleFormChange(0, "inco", selectedOption)
                    }
                  />
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
                  className="w-[140px] flex items-center justify-center"
                >
                  {loading ? <Spinner /> : <span>Create Order</span>}
                </Button>
              </div>
            </div>
          </form>

          <div className="fixed bottom-0 left-0 right-0 bg-[#E4E4E4] shadow-md z-[10]">
            <div className="flex justify-between items-center px-10 py-2">
              <div className="w-full flex flex-row justify-between text-[1rem] font-medium">
                <span>Total Qty: {calculateTotalQuantity()}</span>
                <span>Total Gross Weight: {calculateTotalGrossWeight()}</span>
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
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="py-4 px-2 text-center min-w-[150px]">CBN</th>
                    <th className="py-4 px-2 text-center min-w-[150px]">CBD</th>
                    <th className="py-4 px-2 text-center min-w-[150px">Item</th>
                    <th className="py-4 px-2 text-center min-w-[150px]">
                      Pickup
                    </th>
                    <th className="py-4 px-2 text-center min-w-[150px]">
                      Cont. No.
                    </th>
                    <th className="py-4 px-2 text-center min-w-[150px]">
                      Quantity
                    </th>
                    <th className="py-4 px-2 text-center min-w-[150px]">
                      Base Rate
                    </th>
                    <th className="py-4 px-2 text-center min-w-[150px]">
                      Taxable Amount
                    </th>
                    <th className="py-4 px-2 text-center min-w-[200px]">
                      GST %
                    </th>
                    <th className="py-4 px-2 text-center min-w-[200px]">
                      GST Amount
                    </th>
                    <th className="py-4 px-2 text-center min-w-[150px]">
                      Amount (with tax)
                    </th>
                    <th className="py-4 px-2 text-center min-w-[200px]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {form.items?.map((item, index) => (
                    <tr key={index} className="border-t-2 border-t-[#898989]">
                      <td className="break-all py-4 px-2 text-center">
                        {form.companyBargainNo}
                      </td>
                      <td className="py-4 px-2 text-center">
                        {form.companyBargainDate}
                      </td>
                      <td className="py-4 px-2 text-center">
                        <div className="relative w-[150px]">
                          <Select
                            className="relative w-[150px]"
                            options={selectItemsOptions}
                            value={
                              selectItemsOptions.find(
                                (option) => option.value === item.itemId
                              ) || null
                            }
                            onChange={(selectedOption) =>
                              handleItemChange(index, "itemId", selectedOption)
                            }
                            menuPortalTarget={document.body}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 10 }),
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <div className="relative w-[150px]">
                          <Select
                            className="relative w-[150px]"
                            options={[
                              { value: "rack", label: "Rack" },
                              { value: "depot", label: "Depot" },
                              { value: "plant", label: "Plant" },
                            ]}
                            value={
                              [
                                { value: "rack", label: "Rack" },
                                { value: "depot", label: "Depot" },
                                { value: "plant", label: "Plant" },
                              ].find(
                                (option) => option.value === item.pickup
                              ) || null
                            }
                            onChange={(selectedOption) =>
                              handleItemChange(index, "pickup", selectedOption)
                            }
                            menuPortalTarget={document.body}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 10 }),
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <input
                          type="number"
                          name="contNumber"
                          value={item.contNumber}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value >= 0) {
                              handleItemChange(index, "contNumber", value);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (
                              e.key === "e" ||
                              e.key === "-" ||
                              e.key === "+" ||
                              e.key === "."
                            ) {
                              e.preventDefault();
                            }
                          }}
                          required
                          placeholder="Cont. No."
                          className="w-[150px] border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373]"
                        />
                      </td>
                      <td className="py-4 px-2 text-center">
                        <input
                          type="number"
                          name="quantity"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value >= 0) {
                              handleItemChange(index, "quantity", value);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (
                              e.key === "e" ||
                              e.key === "-" ||
                              e.key === "+" ||
                              e.key === "."
                            ) {
                              e.preventDefault();
                            }
                          }}
                          required
                          placeholder="Quantity"
                          className="w-[150px] border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373]"
                        />
                      </td>
                      <td className="py-4 px-2 text-center">
                        <input
                          type="number"
                          name="baseRate"
                          value={item.baseRate}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value >= 0) {
                              handleItemChange(index, "baseRate", value);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (
                              e.key === "e" ||
                              e.key === "-" ||
                              e.key === "+" ||
                              e.key === "."
                            ) {
                              e.preventDefault();
                            }
                          }}
                          required
                          placeholder="Base Rate"
                          className="w-[150px] border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373]"
                        />
                      </td>
                      <td className="py-4 px-2 text-center">
                        {item.taxableAmount}
                      </td>
                      <td className="py-4 px-2 text-center">
                        {warehouseOptions?.find(
                          (warehouse) => warehouse._id === form?.warehouse
                        )?.location?.state ===
                        manufacturerOptions?.find(
                          (man) => man._id === form?.manufacturer
                        )?.manufacturerdeliveryAddress.state ? (
                          <>
                            <span>
                              {itemsOptions?.find(
                                (option) => option._id === item?.itemId
                              )?.gst / 2 || "N/A"}
                              {"% "}
                              (CGST) +{" "}
                              {itemsOptions?.find(
                                (option) => option._id === item?.itemId
                              )?.gst / 2 || "N/A"}
                              {"% "}
                              (SGST)
                            </span>
                          </>
                        ) : (
                          <>
                            <span>
                              {itemsOptions?.find(
                                (option) => option._id === item?.itemId
                              )?.gst || "N/A"}
                              {"% "}
                              (IGST)
                            </span>
                          </>
                        )}
                      </td>
                      <td className="py-4 px-2 text-center">
                        {item.gstAmount}
                      </td>
                      <td className="py-4 px-2 text-center">
                        {item.taxpaidAmount}
                      </td>
                      <td className="py-4 px-2 flex justify-center">
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

export default CreateOrder;
