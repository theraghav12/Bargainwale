import {
  Button,
  Input,
  Spinner,
  IconButton,
  Select,
  Option,
  Typography,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// api services
import {
  createItem,
  deleteItem,
  getItems,
  updateItem,
} from "@/services/masterService";

// icons
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { getWarehouses } from "@/services/warehouseService";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { FaCheck } from "react-icons/fa6";

const ItemForm = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [form, setForm] = useState({
    flavor: "",
    material: "",
    materialdescription: "",
    netweight: "",
    grossweight: "",
    gst: "",
    packaging: "box",
    packsize: "",
    staticPrice: "",
    warehouses: [],
    organization: localStorage.getItem("organizationId"),
  });
  const [editingId, setEditingId] = useState(null);

  const fetchWarehouseOptions = async () => {
    try {
      const response = await getWarehouses();
      setWarehouseOptions(response);
    } catch (error) {
      toast.error("Error fetching warehouses!");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchWarehouseOptions();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await getItems();
      const itemsWithEditingState = response.map((item) => ({
        ...item,
        isEditing: false,
      }));
      setItems(itemsWithEditingState);
    } catch (error) {
      toast.error("Error fetching items!");
      console.error(error);
    }
  };

  const toggleEditing = async (id) => {
    const itemToEdit = items.find((item) => item._id === id);
    if (itemToEdit.isEditing) {
      try {
        const data = {
          flavor: itemToEdit.flavor,
          material: itemToEdit.material,
          materialdescription: itemToEdit.materialdescription,
          netweight: itemToEdit.netweight,
          grossweight: itemToEdit.grossweight,
          gst: itemToEdit.gst,
          packaging: itemToEdit.packaging,
          packsize: itemToEdit.packsize,
          staticPrice: itemToEdit.staticPrice,
        };
        await updateItem(data, id);
        toast.success("Item updated successfully!");
        fetchItems();
      } catch (error) {
        toast.error("Error updating item!");
        console.error(error);
      }
    } else {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === id ? { ...item, isEditing: !item.isEditing } : item
        )
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const warehouseIds = warehouseOptions.map((warehouse) => warehouse._id);
    try {
      const formData = {
        ...form,
        warehouses: warehouseIds,
      };
      const response = await createItem(formData);
      toast.success("Item added successfully!");
      setForm({
        flavor: "",
        material: "",
        materialdescription: "",
        netweight: "",
        grossweight: "",
        gst: "",
        packaging: "box",
        packsize: "",
        staticPrice: "",
        warehouses: [],
        organization: localStorage.getItem("organizationId"),
      });
      fetchItems();
    } catch (error) {
      toast.error("Error adding item!");
      console.error(error);
    } finally {
      setLoading(false);
      setEditingId(null);
    }
  };

  const handleChange = (e, fieldName) => {
    if (e && e.target) {
      const { name, value } = e.target;
      setForm((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setForm((prevData) => ({
        ...prevData,
        [fieldName]: e,
      }));
    }
  };

  const handleItemChange = (e, id, fieldName) => {
    let name, value;

    if (e && e.target) {
      name = e.target.name;
      value = e.target.value;
    } else {
      name = fieldName;
      value = e;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id
          ? {
              ...item,
              [name]: value,
            }
          : item
      )
    );
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      toast.error("Item deleted successfully!");
      fetchItems();
    } catch (error) {
      toast.error("Error deleting item!");
      console.error(error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border-2 border-[#929292] mb-8">
        <h1 className="text-[1.1rem] text-[#636363] px-8 py-2 border-b-2 border-b-[#929292]">
          Items
          <span className="text-[1.5rem] text-black">/ Available</span>
        </h1>

        <div className="p-10">
          {/* Items Table */}
          <div className="w-full overflow-x-scroll mt-8">
            {items?.length > 0 ? (
              <table className="w-full bg-white">
                <thead>
                  <tr className="grid grid-cols-11">
                    <th className="py-2 px-4 text-start">Item Id</th>
                    <th className="py-2 px-4 text-start">Name</th>
                    <th className="py-2 px-4 text-start">Flavor</th>
                    <th className="py-2 px-4 text-start">Material</th>
                    <th className="py-2 px-4 text-start">Material Desc.</th>
                    <th className="py-2 px-4 text-start">Net Weight</th>
                    <th className="py-2 px-4 text-start">Gross Weight</th>
                    <th className="py-2 px-4 text-start">GST</th>
                    <th className="py-2 px-4 text-start">Packaging</th>
                    <th className="py-2 px-4 text-start">Pack Size</th>
                    <th className="py-2 px-4 text-start">Actions</th>
                  </tr>
                </thead>
                <tbody className="flex flex-col gap-2">
                  {items?.map((item) => (
                    <tr
                      key={item._id}
                      className="grid grid-cols-11 items-center border border-[#7F7F7F] rounded-md shadow-md"
                    >
                      <td className="py-2 px-2">
                        {item.isEditing ? (
                          <input
                            name="staticPrice"
                            type="number"
                            value={item.staticPrice}
                            onChange={(e) => handleItemChange(e, item._id)}
                            required
                            placeholder="Static Price"
                            className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373] w-full"
                          />
                        ) : (
                          <span className="break-words">{item._id}</span>
                        )}
                      </td>
                      <td className="py-2 px-2">
                        {item.isEditing ? (
                          <input
                            name="name"
                            type="text"
                            value={item.materialdescription}
                            onChange={(e) => handleItemChange(e, item._id)}
                            required
                            placeholder="Material Description"
                            className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373] w-full"
                          />
                        ) : (
                          <span>{item.materialdescription}</span>
                        )}
                      </td>
                      <td className="py-2 px-2">
                        {item.isEditing ? (
                          <input
                            name="flavor"
                            type="text"
                            value={item.flavor}
                            onChange={(e) => handleItemChange(e, item._id)}
                            required
                            placeholder="Flavor"
                            className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373] w-full"
                          />
                        ) : (
                          <span>{item.flavor}</span>
                        )}
                      </td>
                      <td className="py-2 px-2">
                        {item.isEditing ? (
                          <input
                            name="material"
                            type="text"
                            value={item.material}
                            onChange={(e) => handleItemChange(e, item._id)}
                            required
                            placeholder="Material"
                            className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373] w-full"
                          />
                        ) : (
                          <span>{item.material}</span>
                        )}
                      </td>
                      <td className="py-2 px-2">
                        {item.isEditing ? (
                          <input
                            name="materialdescription"
                            type="text"
                            value={item.materialdescription}
                            onChange={(e) => handleItemChange(e, item._id)}
                            required
                            placeholder="Material Description"
                            className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373] w-full"
                          />
                        ) : (
                          <span>{item.materialdescription}</span>
                        )}
                      </td>
                      <td className="py-2 px-2">
                        {item.isEditing ? (
                          <input
                            name="netweight"
                            type="text"
                            value={item.netweight}
                            onChange={(e) => handleItemChange(e, item._id)}
                            required
                            placeholder="Net Weight"
                            className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373] w-full"
                          />
                        ) : (
                          <span>{item.netweight}</span>
                        )}
                      </td>
                      <td className="py-2 px-2">
                        {item.isEditing ? (
                          <input
                            name="grossweight"
                            type="text"
                            value={item.grossweight}
                            onChange={(e) => handleItemChange(e, item._id)}
                            required
                            placeholder="Gross Weight"
                            className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373] w-full"
                          />
                        ) : (
                          <span>{item.grossweight}</span>
                        )}
                      </td>
                      <td className="py-2 px-2">
                        {item.isEditing ? (
                          <input
                            name="gst"
                            type="text"
                            value={item.gst}
                            onChange={(e) => handleItemChange(e, item._id)}
                            required
                            placeholder="GST"
                            className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373] w-full"
                          />
                        ) : (
                          <span>{item.gst}%</span>
                        )}
                      </td>
                      <td className="py-2 px-2">
                        {item.isEditing ? (
                          <div className="relative w-full">
                            <select
                              name="packaging"
                              value={item.packaging}
                              onChange={(value) =>
                                handleItemChange(value, item._id, "packaging")
                              }
                              className="appearance-none w-full bg-white border-2 border-[#CBCDCE] text-[#38454A] px-4 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBCDCE] cursor-pointer"
                            >
                              <option value="box">Box</option>
                              <option value="tin">Tin</option>
                              <option value="jar">Jar</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                              <TbTriangleInvertedFilled className="text-[#5E5E5E]" />
                            </div>
                          </div>
                        ) : (
                          <span>{item.packaging}</span>
                        )}
                      </td>
                      <td className="py-2 px-2">
                        {item.isEditing ? (
                          <input
                            name="packsize"
                            type="text"
                            value={item.packsize}
                            onChange={(e) => handleItemChange(e, item._id)}
                            required
                            placeholder="Pack Size"
                            className="border-2 border-[#CBCDCE] px-2 py-1 rounded-md placeholder-[#737373] w-full"
                          />
                        ) : (
                          <span>{item.packsize}</span>
                        )}
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <div className="flex gap-1">
                          {item.isEditing ? (
                            <button
                              onClick={() => toggleEditing(item._id)}
                              className="flex items-center text-sm p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                            >
                              <FaCheck />
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleEditing(item._id)}
                              className="flex items-center p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                            >
                              <AiOutlineEdit />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="flex items-center p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                          >
                            <AiOutlineDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Typography className="text-xl text-center font-bold">
                No Items!
              </Typography>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border-2 border-[#929292] mb-8">
        <h1 className="text-[1.1rem] text-[#636363] px-8 py-2 border-b-2 border-b-[#929292]">
          Items
          <span className="text-[1.5rem] text-black">/ Create</span>
        </h1>

        <div className="p-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4">
              {/* <div className="relative w-[200px]">
                <select
                  id="warehouse"
                  name="warehouse"
                  value={form.warehouse}
                  onChange={(value) => handleChange(value, "warehouse")}
                  className="appearance-none w-[200px] bg-white border-2 border-[#CBCDCE] text-[#38454A] px-4 py-[6px] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBCDCE] cursor-pointer"
                  required
                >
                  <option value="">Select Warehouse</option>
                  {warehouseOptions?.map((option) => (
                    <option key={option?._id} value={option?._id}>
                      {option?.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <TbTriangleInvertedFilled className="text-[#5E5E5E]" />
                </div>
              </div> */}

              {/* <div className="relative w-[400px]">
                <Select
                  name="warehouse"
                  label="Warehouse"
                  value={form.warehouse}
                  onChange={(value) => handleChange(value, "warehouse")}
                >
                  <Option value="">Select Warehouse</Option>
                  {warehouseOptions?.map((option) => (
                    <Option key={option?._id} value={option?._id}>
                      {option?.name}
                    </Option>
                  ))}
                </Select>
              </div> */}

              <Input
                name="materialdescription"
                label="Item Name"
                type="text"
                value={form.materialdescription}
                onChange={handleChange}
                required
              />
              <Input
                name="flavor"
                label="Flavor"
                type="text"
                value={form.flavor}
                onChange={handleChange}
                required
              />
              <Input
                name="material"
                label="Material"
                type="text"
                value={form.material}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex gap-4">
              <Input
                name="netweight"
                label="Net Weight"
                type="number"
                value={form.netweight}
                onChange={handleChange}
                required
              />
              <Input
                name="grossweight"
                label="Gross Weight"
                type="number"
                value={form.grossweight}
                onChange={handleChange}
                required
              />
              <Input
                name="gst"
                label="GST"
                type="number"
                value={form.gst}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex gap-4">
              <Select
                name="packaging"
                label="Packaging"
                value={form.packaging}
                onChange={(value) => handleChange(value, "packaging")}
              >
                <Option value="box">Box</Option>
                <Option value="tin">Tin</Option>
                <Option value="jar">Jar</Option>
              </Select>
              <Input
                name="packsize"
                label="Pack Size"
                type="number"
                value={form.packsize}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex">
              <Button
                color="blue"
                type="submit"
                className="flex items-center justify-center"
              >
                {loading ? <Spinner /> : <span>Add Item</span>}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ItemForm;
