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
  createWarehouse,
  getWarehouses,
  updateWarehouse,
  deleteWarehouse,
} from "@/services/warehouseService";

// icons
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import mapsIcon from "../../assets/maps.svg";

const WarehouseForm = () => {
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    state: "",
    city: "",
    warehouseManager: "",
    googleMapsLink: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await getWarehouses();
      console.log(response);
      const warehousesWithEditingState = response.map((warehouse) => ({
        ...warehouse,
        isEditing: false,
      }));
      setWarehouses(warehousesWithEditingState);
    } catch (error) {
      toast.error("Error fetching warehouses!");
      console.error(error);
    }
  };

  const toggleEditing = async (id) => {
    const warehouseToEdit = warehouses.find(
      (warehouse) => warehouse._id === id
    );
    if (warehouseToEdit.isEditing) {
      try {
        const data = {
          name: warehouseToEdit.name,
          state: warehouseToEdit.location.state,
          city: warehouseToEdit.location.city,
          warehouseManager: warehouseToEdit.warehouseManager,
        };
        console.log(data);
        const response = await updateWarehouse(data, id);
        console.log(response);
        toast.success("Warehouse updated successfully!");
        fetchWarehouses();
      } catch (error) {
        toast.error("Error updating warehouse!");
        console.error(error);
      }
    } else {
      setWarehouses((prevWarehouses) =>
        prevWarehouses.map((warehouse) =>
          warehouse._id === id
            ? { ...warehouse, isEditing: !warehouse.isEditing }
            : warehouse
        )
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createWarehouse({
        name: form.name,
        location: {
          state: form.state,
          city: form.city,
        },
        warehouseManager: form.warehouseManager,
      });
      console.log(response);
      toast.success("Warehouse added successfully!");
      setForm({
        name: "",
        state: "",
        city: "",
        warehouseManager: "",
      });
      fetchWarehouses();
    } catch (error) {
      toast.error("Error adding warehouse!");
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

  const handleWarehouseChange = (e, id, fieldName) => {
    let name, value;

    if (e && e.target) {
      name = e.target.name;
      value = e.target.value;
    } else {
      name = fieldName;
      value = e;
    }

    setWarehouses((prevWarehouses) =>
      prevWarehouses.map((warehouse) =>
        warehouse._id === id
          ? {
              ...warehouse,
              location: {
                ...warehouse.location,
                [name]: value,
              },
              [name]: name === "state" || name === "city" ? undefined : value,
            }
          : warehouse
      )
    );
  };

  const handleDelete = async (id) => {
    try {
      await deleteWarehouse(id);
      toast.error("Warehouse deleted successfully!");
      fetchWarehouses();
    } catch (error) {
      toast.error("Error deleting warehouse!");
      console.error(error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border-2 border-[#929292] mb-8">
        <h1 className="text-[1.1rem] text-[#636363] px-8 py-2 border-b-2 border-b-[#929292]">
          Warehouse
          <span className="text-[1.5rem] text-black">/ Available</span>
        </h1>

        <div className="p-10">
          {/* Warehouses Table */}
          <div className="">
            {warehouses?.length > 0 ? (
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="grid grid-cols-5">
                    <th className="py-2 px-4 text-start">Name</th>
                    <th className="py-2 px-4 text-start">State</th>
                    <th className="py-2 px-4 text-start">City</th>
                    <th className="py-2 px-4 text-start">Manager</th>
                    <th className="py-2 px-4 text-start">Actions</th>
                  </tr>
                </thead>
                <tbody className="flex flex-col gap-2">
                  {warehouses?.map((warehouse) => (
                    <tr
                      key={warehouse._id}
                      className="grid grid-cols-5 items-center border border-[#7F7F7F] rounded-md shadow-md"
                    >
                      <td className="py-2 px-4">
                        {warehouse.isEditing ? (
                          <Input
                            name="name"
                            type="text"
                            value={warehouse.name}
                            onChange={(e) =>
                              handleWarehouseChange(e, warehouse._id)
                            }
                          />
                        ) : (
                          <span>{warehouse.name}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {warehouse.isEditing ? (
                          <Input
                            name="state"
                            type="text"
                            value={warehouse.location.state}
                            onChange={(e) =>
                              handleWarehouseChange(e, warehouse._id)
                            }
                          />
                        ) : (
                          <span>{warehouse.location.state}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {warehouse.isEditing ? (
                          <Input
                            name="city"
                            type="text"
                            value={warehouse.location.city}
                            onChange={(e) =>
                              handleWarehouseChange(e, warehouse._id)
                            }
                          />
                        ) : (
                          <span>{warehouse.location.city}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {warehouse.isEditing ? (
                          <Input
                            name="warehouseManager"
                            type="text"
                            value={warehouse.warehouseManager}
                            onChange={(e) =>
                              handleWarehouseChange(e, warehouse._id)
                            }
                          />
                        ) : (
                          <span>{warehouse.warehouseManager || "N/A"}</span>
                        )}
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        {warehouse.isEditing ? (
                          <IconButton
                            color="green"
                            onClick={() => toggleEditing(warehouse._id)}
                          >
                            Save
                          </IconButton>
                        ) : (
                          <button
                            onClick={() => toggleEditing(warehouse._id)}
                            className="flex items-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                          >
                            <AiOutlineEdit />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(warehouse._id)}
                          className="flex items-center p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                        >
                          <AiOutlineDelete />
                        </button>
                        {/* <IconButton
                          color="red"
                          onClick={() => handleDelete(warehouse._id)}
                        >
                          <FaTrashAlt />
                        </IconButton> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Typography className="text-xl text-center font-bold">
                No Warehouses!
              </Typography>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border-2 border-[#929292] mt-4 mb-8">
        <h1 className="text-[1.1rem] text-[#636363] px-8 py-2 border-b-2 border-b-[#929292]">
          Warehouse
          <span className="text-[1.5rem] text-black">/ Create</span>
        </h1>

        <div className="p-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex">
              <Input
                name="name"
                label="Warehouse Name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-row gap-4">
              <Input
                name="state"
                label="State"
                type="text"
                value={form.state}
                onChange={handleChange}
                required
              />
              <Input
                name="city"
                label="City"
                type="text"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-row">
              <Input
                name="warehouseManager"
                label="Warehouse Manager"
                type="text"
                value={form.warehouseManager}
                onChange={handleChange}
              />
            </div>
            <div className="relative flex items-center">
              <img
                src={mapsIcon}
                className="absolute left-3 w-5 h-5 pointer-events-none"
                alt="Map Icon"
              />
              <input
                name="googleMapsLink"
                type="text"
                value={form.googleMapsLink}
                onChange={handleChange}
                className="pl-10 h-[40px] border-2 border-gray-300 rounded-md"
                placeholder="Google Maps Link"
              />
            </div>
            <div>
              <Button color="blue" type="submit">
                {loading ? <Spinner /> : <span>Add Warehouse</span>}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default WarehouseForm;
