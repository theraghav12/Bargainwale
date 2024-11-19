import {
  Button,
  Input,
  Spinner,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx"; // Import SheetJS library for Excel
import {
  createTransport,
  deleteTransport,
  getTransport,
  updateTransport,
} from "@/services/masterService";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

const TransportForm = () => {
  const [loading, setLoading] = useState(false);
  const [transport, setTransport] = useState([]);
  const [form, setForm] = useState({
    transport: "",
    transportType: "",
    transportContact: "",
    transportAgency: "",
    organization: localStorage.getItem("organizationId"),
  });
  const [editingTransport, setEditingTransport] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
<<<<<<< HEAD
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [transportToDelete, setTransportToDelete] = useState(null);
  const [confirmationName, setConfirmationName] = useState("");
=======
>>>>>>> d4bbbb806ef75a47bdbd8bd865857422cb735666

  useEffect(() => {
    fetchTransport();
  }, []);

  const fetchTransport = async () => {
    try {
      const response = await getTransport();
      setTransport(response || []);
    } catch (error) {
      toast.error("Error fetching transport data!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTransport(form);
      toast.success("Transport added successfully!");
      setForm({
        transport: "",
        transportType: "",
        transportContact: "",
        transportAgency: "",
        organization: localStorage.getItem("organizationId"),
      });
      fetchTransport();
      setAddModalOpen(false);
    } catch (error) {
      toast.error("Error adding transport!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    setLoading(true);
<<<<<<< HEAD
    try {
      await updateTransport(editingTransport, editingTransport._id);
      toast.success("Transport updated successfully!");
      fetchTransport();
      setEditModalOpen(false);
    } catch (error) {
      toast.error("Error updating transport!");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (transportItem) => {
    setTransportToDelete(transportItem);
    setConfirmationName("");
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteTransport(transportToDelete._id);
      toast.success("Transport deleted successfully!");
      setDeleteModalOpen(false);
      setTransportToDelete(null);
      setConfirmationName("");
      fetchTransport();
    } catch (error) {
      toast.error("Error deleting transport!");
    } finally {
      setLoading(false);
=======
    try {
      await updateTransport(editingTransport, editingTransport._id);
      toast.success("Transport updated successfully!");
      fetchTransport();
      setEditModalOpen(false);
    } catch (error) {
      toast.error("Error updating transport!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransport(id);
      toast.success("Transport deleted successfully!");
      fetchTransport();
    } catch (error) {
      toast.error("Error deleting transport!");
>>>>>>> d4bbbb806ef75a47bdbd8bd865857422cb735666
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openEditModal = (transportItem) => {
    setEditingTransport({ ...transportItem });
    setEditModalOpen(true);
  };

<<<<<<< HEAD
=======
  // Handle Excel Download
>>>>>>> d4bbbb806ef75a47bdbd8bd865857422cb735666
  const handleExcelDownload = () => {
    if (transport.length === 0) {
      toast.error("No transport data available to download!");
      return;
    }

<<<<<<< HEAD
=======
    // Map transport data to an Excel-friendly format
>>>>>>> d4bbbb806ef75a47bdbd8bd865857422cb735666
    const data = transport.map((item) => ({
      Name: item.transport,
      Type: item.transportType,
      Contact: item.transportContact,
      Agency: item.transportAgency,
    }));

<<<<<<< HEAD
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transport");
=======
    // Create a new workbook and add data
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transport");

    // Generate Excel file and trigger download
>>>>>>> d4bbbb806ef75a47bdbd8bd865857422cb735666
    XLSX.writeFile(workbook, "Transport_List.xlsx");
    toast.success("Transport list downloaded successfully!");
  };

  return (
    <div className="container mx-auto p-6">
      {/* Transport List */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="font-bold">
            Transport Management
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
              + Add Transport
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transport.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-md rounded-md p-4 border"
            >
              <Typography variant="h6" className="font-bold">
                {item.transport}
              </Typography>
              <Typography className="text-sm text-gray-600">
                Type: {item.transportType}
              </Typography>
              <Typography className="text-sm text-gray-600">
                Contact: {item.transportContact}
              </Typography>
              <Typography className="text-sm text-gray-600">
                Agency: {item.transportAgency}
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
<<<<<<< HEAD
                  onClick={() => openDeleteModal(item)}
=======
                  onClick={() => handleDelete(item._id)}
>>>>>>> d4bbbb806ef75a47bdbd8bd865857422cb735666
                  className="flex items-center gap-1"
                >
                  <AiOutlineDelete /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Transport Modal */}
      <Dialog open={addModalOpen} handler={() => setAddModalOpen(false)}>
        <DialogHeader>Add Transport</DialogHeader>
        <DialogBody divider>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Input
              name="transport"
              label="Transport Name"
              value={form.transport}
              onChange={handleInputChange}
              required
            />
            <Input
              name="transportType"
              label="Transport Type"
              value={form.transportType}
              onChange={handleInputChange}
              required
            />
            <Input
              name="transportContact"
              label="Contact"
              value={form.transportContact}
              onChange={handleInputChange}
              required
            />
            <Input
              name="transportAgency"
              label="Agency"
              value={form.transportAgency}
              onChange={handleInputChange}
              required
            />
          </form>
        </DialogBody>
        <DialogFooter>
          <Button color="blue" onClick={handleSubmit} disabled={loading}>
            {loading ? <Spinner /> : "Add Transport"}
          </Button>
          <Button color="gray" onClick={() => setAddModalOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit Transport Modal */}
      {editingTransport && (
<<<<<<< HEAD
        <Dialog open={editModalOpen} handler={() => setEditModalOpen(false)}>
=======
        <Dialog
          open={editModalOpen}
          handler={() => setEditModalOpen(false)}
        >
>>>>>>> d4bbbb806ef75a47bdbd8bd865857422cb735666
          <DialogHeader>Edit Transport</DialogHeader>
          <DialogBody divider>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="transport"
                label="Transport Name"
                value={editingTransport.transport}
                onChange={(e) =>
                  setEditingTransport((prev) => ({
                    ...prev,
                    transport: e.target.value,
                  }))
                }
                required
              />
              <Input
                name="transportType"
                label="Transport Type"
                value={editingTransport.transportType}
                onChange={(e) =>
                  setEditingTransport((prev) => ({
                    ...prev,
                    transportType: e.target.value,
                  }))
                }
                required
              />
              <Input
                name="transportContact"
                label="Contact"
                value={editingTransport.transportContact}
                onChange={(e) =>
                  setEditingTransport((prev) => ({
                    ...prev,
                    transportContact: e.target.value,
                  }))
                }
                required
              />
              <Input
                name="transportAgency"
                label="Agency"
                value={editingTransport.transportAgency}
                onChange={(e) =>
                  setEditingTransport((prev) => ({
                    ...prev,
                    transportAgency: e.target.value,
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
<<<<<<< HEAD

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} handler={() => setDeleteModalOpen(false)}>
        <DialogHeader className="text-red-500">Confirm Transport Deletion</DialogHeader>
        <DialogBody divider>
          <div className="space-y-4">
            <Typography className="text-gray-800 font-medium">
              Are you sure you want to delete this transport record?
            </Typography>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <Typography className="text-yellow-700 font-medium mb-2">
                Warning: The following data will be permanently deleted:
              </Typography>
              <ul className="list-disc list-inside text-yellow-700 space-y-1">
                <li>Transport profile and contact information</li>
                <li>Associated transport agency details</li>
                <li>Linked transport records</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <Typography className="text-gray-700 mb-2">
                To confirm deletion, please type the transport name:
                <span className="font-bold text-red-500"> {transportToDelete?.transport}</span>
              </Typography>
              <Input
                type="text"
                label="Type transport name to confirm"
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
            disabled={confirmationName !== transportToDelete?.transport}
            className="flex items-center gap-2"
          >
            {loading ? <Spinner /> : "Delete Permanently"}
          </Button>
          <Button
            color="gray"
            onClick={() => {
              setDeleteModalOpen(false);
              setTransportToDelete(null);
              setConfirmationName("");
            }}
          >
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>
=======
>>>>>>> d4bbbb806ef75a47bdbd8bd865857422cb735666
    </div>
  );
};

export default TransportForm;
