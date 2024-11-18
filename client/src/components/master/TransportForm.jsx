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

  // Handle Excel Download
  const handleExcelDownload = () => {
    if (transport.length === 0) {
      toast.error("No transport data available to download!");
      return;
    }

    // Map transport data to an Excel-friendly format
    const data = transport.map((item) => ({
      Name: item.transport,
      Type: item.transportType,
      Contact: item.transportContact,
      Agency: item.transportAgency,
    }));

    // Create a new workbook and add data
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transport");

    // Generate Excel file and trigger download
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
                  onClick={() => handleDelete(item._id)}
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
        <Dialog
          open={editModalOpen}
          handler={() => setEditModalOpen(false)}
        >
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
    </div>
  );
};

export default TransportForm;
