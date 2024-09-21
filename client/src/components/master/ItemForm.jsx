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

const ItemForm = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    packaging: "",
    type: "",
    weight: "",
    staticPrice: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchItems();
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
      const response = await createItem(form);
      console.log(response);
      toast.success("Item added successfully!");
      setForm({
        name: "",
        packaging: "",
        type: "",
        weight: "",
        staticPrice: "",
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
                  <tr className="grid grid-cols-6">
                    <th className="py-2 px-4 text-start">Name</th>
                    <th className="py-2 px-4 text-start">Packaging</th>
                    <th className="py-2 px-4 text-start">Type</th>
                    <th className="py-2 px-4 text-start">Weight</th>
                    <th className="py-2 px-4 text-start">Static Price</th>
                    <th className="py-2 px-4 text-start">Actions</th>
                  </tr>
                </thead>
                <tbody className="flex flex-col gap-2">
                  {items?.map((item) => (
                    <tr
                      key={item._id}
                      className="grid grid-cols-6 items-center border border-[#7F7F7F] rounded-md shadow-md"
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
                          <Select
                            name="packaging"
                            value={item.packaging}
                            onChange={(value) =>
                              handleItemChange(value, item._id, "packaging")
                            }
                          >
                            <Option value="box">Box</Option>
                            <Option value="tin">Tin</Option>
                          </Select>
                        ) : (
                          <span>{item.packaging}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {item.isEditing ? (
                          <Input
                            name="type"
                            type="text"
                            value={item.type}
                            onChange={(e) => handleItemChange(e, item._id)}
                          />
                        ) : (
                          <span>{item.type}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {item.isEditing ? (
                          <Input
                            name="weight"
                            type="number"
                            value={item.weight}
                            onChange={(e) => handleItemChange(e, item._id)}
                          />
                        ) : (
                          <span>{item.weight}</span>
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
            <div className="flex">
              <Input
                name="name"
                label="Item Name"
                type="text"
                value={form.name}
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
              </Select>
              <Input
                name="type"
                label="Type"
                type="text"
                value={form.type}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex gap-4">
              <Input
                name="weight"
                label="Weight"
                type="number"
                value={form.weight}
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
