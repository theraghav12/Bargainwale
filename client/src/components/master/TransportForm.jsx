import {
  Button,
  Input,
  Spinner,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
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
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTransport();
  }, []);

  const fetchTransport = async () => {
    try {
      const response = await getTransport();
      const transportsWithEditingState = response.map((item) => ({
        ...item,
        isEditing: false,
      }));
      setTransport(transportsWithEditingState);
    } catch (error) {
      toast.error("Error fetching transports!");
      console.error(error);
    }
  };

  const toggleEditing = async (id) => {
    const transportToEdit = transport.find((item) => item._id === id);
    if (transportToEdit.isEditing) {
      try {
        const data = {
          name: transportToEdit.name,
          packaging: transportToEdit.packaging,
          type: transportToEdit.type,
          weight: transportToEdit.weight,
          staticPrice: transportToEdit.staticPrice,
        };
        await updateTransport(data, id);
        toast.success("Transport updated successfully!");
        fetchTransport();
      } catch (error) {
        toast.error("Error updating transport!");
        console.error(error);
      }
    } else {
      setTransport((prevItems) =>
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
      const response = await createTransport(form);
      console.log(response);
      toast.success("Transport added successfully!");
      setForm({
        transport: "",
        transportType: "",
        transportContact: "",
        transportAgency: "",
      });
      fetchTransport();
    } catch (error) {
      toast.error("Error adding transport!");
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

  const handleUpdateChange = (e, id, fieldName) => {
    let name, value;

    if (e && e.target) {
      name = e.target.name;
      value = e.target.value;
    } else {
      name = fieldName;
      value = e;
    }
    setTransport((prevItems) =>
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
      await deleteTransport(id);
      toast.error("Transport deleted successfully!");
      fetchTransport();
    } catch (error) {
      toast.error("Error deleting transport!");
      console.error(error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border-2 border-[#929292] mb-8">
        <h1 className="text-[1.1rem] text-[#636363] px-8 py-2 border-b-2 border-b-[#929292]">
          Transportation
          <span className="text-[1.5rem] text-black">/ Available</span>
        </h1>

        <div className="p-10">
          {/* Transport Table */}
          <div className="mt-8">
            {transport?.length > 0 ? (
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="grid grid-cols-5">
                    <th className="py-2 px-4 text-start">Transport</th>
                    <th className="py-2 px-4 text-start">Type</th>
                    <th className="py-2 px-4 text-start">Contact</th>
                    <th className="py-2 px-4 text-start">Agency</th>
                    <th className="py-2 px-4 text-start">Actions</th>
                  </tr>
                </thead>
                <tbody className="flex flex-col gap-2">
                  {transport?.map((item) => (
                    <tr
                      key={item._id}
                      className="grid grid-cols-5 items-center border border-[#7F7F7F] rounded-md shadow-md"
                    >
                      <td className="py-2 px-4">
                        {item.isEditing ? (
                          <Input
                            name="transport"
                            type="text"
                            value={item.transport}
                            onChange={(e) => handleUpdateChange(e, item._id)}
                          />
                        ) : (
                          <span>{item.transport}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {item.isEditing ? (
                          <Input
                            name="transportType"
                            type="text"
                            value={item.transportType}
                            onChange={(e) => handleUpdateChange(e, item._id)}
                          />
                        ) : (
                          <span>{item.transportType}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {item.isEditing ? (
                          <Input
                            name="transportContact"
                            type="tel"
                            value={item.transportContact}
                            onChange={(e) => handleUpdateChange(e, item._id)}
                          />
                        ) : (
                          <span>{item.transportContact}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {item.isEditing ? (
                          <Input
                            name="transportAgency"
                            type="text"
                            value={item.transportAgency}
                            onChange={(e) => handleUpdateChange(e, item._id)}
                          />
                        ) : (
                          <span>{item.transportAgency}</span>
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
                No Transport!
              </Typography>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border-2 border-[#929292] mb-8">
        <h1 className="text-[1.1rem] text-[#636363] px-8 py-2 border-b-2 border-b-[#929292]">
          Transportation
          <span className="text-[1.5rem] text-black">/ Create</span>
        </h1>

        <div className="p-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex">
              <Input
                name="transport"
                label="Transport Name"
                type="text"
                value={form.transport}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex gap-4">
              <Input
                name="transportType"
                label="Transport Type"
                type="text"
                value={form.transportType}
                onChange={handleChange}
                required
              />
              <Input
                name="transportContact"
                label="Transport Contact"
                type="tel"
                value={form.transportContact}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex">
              <Input
                name="transportAgency"
                label="Transport Agency"
                type="text"
                value={form.transportAgency}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex">
              <Button color="blue" type="submit">
                {loading ? <Spinner /> : <span>Add Transport</span>}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TransportForm;
