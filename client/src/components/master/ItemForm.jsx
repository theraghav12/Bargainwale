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
import { toast } from "react-toastify";

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
    warehouse: "",
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
          name: itemToEdit.name,
          packaging: itemToEdit.packaging,
          type: itemToEdit.type,
          weight: itemToEdit.weight,
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
    try {
      console.log(form)
      const response = await createItem(form);
      console.log(response);
      toast.success("Item added successfully!");
      setForm({
        name: "",
        flavor: "",
        material: "",
        materialdescription: "",
        netweight: "",
        grossweight: "",
        gst: "",
        packaging: "",
        packsize: "",
        type: "",
        weight: "",
        staticPrice: "",
        warehouse: "",
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
                    <th className="py-2 px-4 text-start">Name</th>
                    <th className="py-2 px-4 text-start">Flavor</th>
                    <th className="py-2 px-4 text-start">Material</th>
                    <th className="py-2 px-4 text-start">Material Desc.</th>
                    <th className="py-2 px-4 text-start">Net Weight</th>
                    <th className="py-2 px-4 text-start">Gross Weight</th>
                    <th className="py-2 px-4 text-start">GST</th>
                    <th className="py-2 px-4 text-start">Packaging</th>
                    <th className="py-2 px-4 text-start">Pack Size</th>
                    <th className="py-2 px-4 text-start">Static Price</th>
                    <th className="py-2 px-4 text-start">Actions</th>
                  </tr>
                </thead>
                <tbody className="flex flex-col gap-2">
                  {items?.map((item) => (
                    <tr
                      key={item._id}
                      className="grid grid-cols-11 items-center border border-[#7F7F7F] rounded-md shadow-md"
                    >
                      <td className="py-2 px-4">
                        {item.isEditing ? (
                          <Input
                            name="name"
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(e, item._id)}
                          />
                        ) : (
                          <span>{item.name}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {item.isEditing ? (
                          <Input
                            name="flavor"
                            type="text"
                            value={item.flavor}
                            onChange={(e) => handleItemChange(e, item._id)}
                          />
                        ) : (
                          <span>{item.flavor}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {item.isEditing ? (
                          <Input
                            name="material"
                            type="text"
                            value={item.material}
                            onChange={(e) => handleItemChange(e, item._id)}
                          />
                        ) : (
                          <span>{item.material}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {item.isEditing ? (
                          <Input
                            name="materialdescription"
                            type="text"
                            value={item.materialdescription}
                            onChange={(e) => handleItemChange(e, item._id)}
                          />
                        ) : (
                          <span>{item.materialdescription}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {item.isEditing ? (
                          <Input
                            name="netweight"
                            type="text"
                            value={item.netweight}
                            onChange={(e) => handleItemChange(e, item._id)}
                          />
                        ) : (
                          <span>{item.netweight}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {item.isEditing ? (
                          <Input
                            name="grossweight"
                            type="text"
                            value={item.grossweight}
                            onChange={(e) => handleItemChange(e, item._id)}
                          />
                        ) : (
                          <span>{item.grossweight}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {item.isEditing ? (
                          <Input
                            name="gst"
                            type="text"
                            value={item.gst}
                            onChange={(e) => handleItemChange(e, item._id)}
                          />
                        ) : (
                          <span>{item.gst}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {item.isEditing ? (
                          <Select
                            name="packaging"
                            value={item.packaging}
                            onChange={(value) =>
                              handleItemChange(value, item._id, "packaging")
                            }
                          >
                            <Option value="box">Box</Option>
                            <Option value="tin">Tin</Option>
                            <Option value="jar">Jar</Option>
                          </Select>
                        ) : (
                          <span>{item.packaging}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {item.isEditing ? (
                          <Input
                            name="packsize"
                            type="text"
                            value={item.packsize}
                            onChange={(e) => handleItemChange(e, item._id)}
                          />
                        ) : (
                          <span>{item.packsize}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {item.isEditing ? (
                          <Input
                            name="staticPrice"
                            type="number"
                            value={item.staticPrice}
                            onChange={(e) => handleItemChange(e, item._id)}
                          />
                        ) : (
                          <span>{item.staticPrice}</span>
                        )}
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        {item.isEditing ? (
                          <IconButton
                            color="green"
                            onClick={() => toggleEditing(item._id)}
                          >
                            Save
                          </IconButton>
                        ) : (
                          <button
                            onClick={() => toggleEditing(item._id)}
                            className="flex items-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                          >
                            <AiOutlineEdit />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="flex items-center p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                        >
                          <AiOutlineDelete />
                        </button>
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
              <div className="relative w-[400px]">
                <Select
                  name="warehouse"
                  label="Warehouse"
                  value={form.warehouse}
                  onChange={(value) => handleChange(value, "warehouse")}
                >
                  <option value="">Select Warehouse</option>
                  {warehouseOptions.map((option) => (
                    <Option key={option._id} value={option._id}>
                      {option.name}
                    </Option>
                  ))}
                </Select>
              </div>

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
                type="text"
                value={form.netweight}
                onChange={handleChange}
                required
              />
              <Input
                name="grossweight"
                label="Gross Weight"
                type="text"
                value={form.grossweight}
                onChange={handleChange}
                required
              />
              <Input
                name="gst"
                label="GST"
                type="text"
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
                type="text"
                value={form.packsize}
                onChange={handleChange}
                required
              />
              <Input
                name="staticPrice"
                label="Static Price"
                type="number"
                value={form.staticPrice}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex">
              <Button color="blue" type="submit">
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
