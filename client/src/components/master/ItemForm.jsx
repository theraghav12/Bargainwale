import {
  Button,
  Input,
  Spinner,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

// API services
import {
  createItem,
  deleteItem,
  getItems,
  updateItem,
} from "@/services/masterService";

// Icons
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

const ItemForm = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [confirmationName, setConfirmationName] = useState("");
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
    organization: localStorage.getItem("organizationId"),
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await getItems();
      setItems(response || []);
    } catch (error) {
      toast.error("Error fetching items!");
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createItem(form);
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
        organization: localStorage.getItem("organizationId"),
      });
      fetchItems();
      setAddModalOpen(false);
    } catch (error) {
      toast.error("Error adding item!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      await updateItem(editingItem, editingItem._id);
      toast.success("Item updated successfully!");
      setEditModalOpen(false);
      fetchItems();
    } catch (error) {
      toast.error("Error updating item!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setConfirmationName("");
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteItem(itemToDelete._id);
      toast.success("Item deleted successfully!");
      setDeleteModalOpen(false);
      setItemToDelete(null);
      setConfirmationName("");
      fetchItems();
    } catch (error) {
      toast.error("Error deleting item!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openEditModal = (item) => {
    setEditingItem({ ...item });
    setEditModalOpen(true);
  };

  const handleExcelDownload = () => {
    if (items.length === 0) {
      toast.error("No items available to download!");
      return;
    }

    const data = items.map((item) => ({
      "Item Name": item.materialdescription,
      Flavor: item.flavor,
      Material: item.material,
      "Net Weight": item.netweight,
      "Gross Weight": item.grossweight,
      "GST %": item.gst,
      Packaging: item.packaging,
      "Pack Size": item.packsize,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Items");
    XLSX.writeFile(workbook, "Items_List.xlsx");
    toast.success("Items list downloaded successfully!");
  };

  return (
    <div className="container mx-auto p-6">
      {/* Items List */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="font-bold">
            Items
          </Typography>
          <div className="flex gap-4">
            <Button
              color="green"
              onClick={handleExcelDownload}
              className="flex items-center gap-2"
            >
              Download Excel
            </Button>
            <Button
              color="blue"
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2"
            >
              + Add Item
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-md rounded-md p-4 border"
            >
              <Typography variant="h6" className="font-bold">
                {item.materialdescription}
              </Typography>
              <Typography className="text-sm text-gray-600">
                Flavor: {item.flavor}
              </Typography>
              <Typography className="text-sm text-gray-600">
                Material: {item.material}
              </Typography>
              <Typography className="text-sm text-gray-600">
                Net Weight: {item.netweight}
              </Typography>
              <Typography className="text-sm text-gray-600">
                Gross Weight: {item.grossweight}
              </Typography>
              <Typography className="text-sm text-gray-600">
                GST: {item.gst}%
              </Typography>
              <Typography className="text-sm text-gray-600">
                Packaging: {item.packaging}
              </Typography>
              <Typography className="text-sm text-gray-600">
                Pack Size: {item.packsize}
              </Typography>
              <div className="mt-4 flex gap-2">
                <Button
                  color="blue"
                  size="sm"
                  onClick={() => openEditModal(item)}
                  className="flex items-center gap-1"
                >
                  <AiOutlineEdit /> Edit
                </Button>
                <Button
                  color="red"
                  size="sm"
                  onClick={() => openDeleteModal(item)}
                  className="flex items-center gap-1"
                >
                  <AiOutlineDelete /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Item Modal */}
      <Dialog open={addModalOpen} handler={() => setAddModalOpen(false)}>
        <DialogHeader>Add Item</DialogHeader>
        <DialogBody divider>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Input
              name="materialdescription"
              label="Item Name"
              value={form.materialdescription}
              onChange={handleInputChange}
              required
            />
            <Input
              name="flavor"
              label="Flavor"
              value={form.flavor}
              onChange={handleInputChange}
              required
            />
            <Input
              name="material"
              label="Material"
              value={form.material}
              onChange={handleInputChange}
              required
            />
            <Input
              name="netweight"
              label="Net Weight"
              type="number"
              value={form.netweight}
              onChange={handleInputChange}
              required
            />
            <Input
              name="grossweight"
              label="Gross Weight"
              type="number"
              value={form.grossweight}
              onChange={handleInputChange}
              required
            />
            <Input
              name="gst"
              label="GST"
              type="number"
              value={form.gst}
              onChange={handleInputChange}
              required
            />
            <Select
              name="packaging"
              label="Packaging"
              value={form.packaging}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, packaging: value }))
              }
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
              onChange={handleInputChange}
              required
            />
          </form>
        </DialogBody>
        <DialogFooter>
          <Button color="blue" onClick={handleSubmit} disabled={loading}>
            {loading ? <Spinner /> : "Add Item"}
          </Button>
          <Button color="gray" onClick={() => setAddModalOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit Item Modal */}
      {editingItem && (
        <Dialog open={editModalOpen} handler={() => setEditModalOpen(false)}>
          <DialogHeader>Edit Item</DialogHeader>
          <DialogBody divider>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="materialdescription"
                label="Item Name"
                value={editingItem.materialdescription}
                onChange={(e) =>
                  setEditingItem((prev) => ({
                    ...prev,
                    materialdescription: e.target.value,
                  }))
                }
                required
              />
              <Input
                name="flavor"
                label="Flavor"
                value={editingItem.flavor}
                onChange={(e) =>
                  setEditingItem((prev) => ({
                    ...prev,
                    flavor: e.target.value,
                  }))
                }
                required
              />
              <Input
                name="material"
                label="Material"
                value={editingItem.material}
                onChange={(e) =>
                  setEditingItem((prev) => ({
                    ...prev,
                    material: e.target.value,
                  }))
                }
                required
              />
              <Input
                name="netweight"
                label="Net Weight"
                type="number"
                value={editingItem.netweight}
                onChange={(e) =>
                  setEditingItem((prev) => ({
                    ...prev,
                    netweight: e.target.value,
                  }))
                }
                required
              />
              <Input
                name="grossweight"
                label="Gross Weight"
                type="number"
                value={editingItem.grossweight}
                onChange={(e) =>
                  setEditingItem((prev) => ({
                    ...prev,
                    grossweight: e.target.value,
                  }))
                }
                required
              />
              <Input
                name="gst"
                label="GST"
                type="number"
                value={editingItem.gst}
                onChange={(e) =>
                  setEditingItem((prev) => ({
                    ...prev,
                    gst: e.target.value,
                  }))
                }
                required
              />
              <Select
                name="packaging"
                label="Packaging"
                value={editingItem.packaging}
                onChange={(value) =>
                  setEditingItem((prev) => ({ ...prev, packaging: value }))
                }
              >
                <Option value="box">Box</Option>
                <Option value="tin">Tin</Option>
                <Option value="jar">Jar</Option>
              </Select>
              <Input
                name="packsize"
                label="Pack Size"
                type="number"
                value={editingItem.packsize}
                onChange={(e) =>
                  setEditingItem((prev) => ({
                    ...prev,
                    packsize: e.target.value,
                  }))
                }
                required
              />
            </form>
          </DialogBody>
          <DialogFooter>
            <Button color="blue" onClick={handleEdit} disabled={loading}>
              {loading ? <Spinner /> : "Save Changes"}
            </Button>
            <Button color="gray" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} handler={() => setDeleteModalOpen(false)}>
        <DialogHeader className="text-red-500">Confirm Item Deletion</DialogHeader>
        <DialogBody divider>
          <div className="space-y-4">
            <Typography className="text-gray-800 font-medium">
              Are you sure you want to delete this item?
            </Typography>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <Typography className="text-yellow-700 font-medium mb-2">
                Warning: The following data will be permanently deleted:
              </Typography>
              <ul className="list-disc list-inside text-yellow-700 space-y-1">
                <li>Item profile and details</li>
                <li>Associated inventory records</li>
                <li>Linked transactions</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <Typography className="text-gray-700 mb-2">
                To confirm deletion, please type the item name:
                <span className="font-bold text-red-500"> {itemToDelete?.materialdescription}</span>
              </Typography>
              <Input
                type="text"
                label="Type item name to confirm"
                value={confirmationName}
                onChange={(e) => setConfirmationName(e.target.value)}
                className="mt-2"
                color="red"
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            color="red"
            onClick={handleDelete}
            disabled={confirmationName !== itemToDelete?.materialdescription}
            className="flex items-center gap-2"
          >
            {loading ? <Spinner /> : "Delete Permanently"}
          </Button>
          <Button
            color="gray"
            onClick={() => {
              setDeleteModalOpen(false);
              setItemToDelete(null);
              setConfirmationName("");
            }}
          >
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ItemForm;
