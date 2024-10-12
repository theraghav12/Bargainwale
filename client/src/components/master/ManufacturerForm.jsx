import {
  Button,
  Input,
  Spinner,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

// api services
import {
  createManufacturer,
  deleteManufacturer,
  getManufacturer,
  updateManufacturer,
} from "@/services/masterService";

// icons
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

const ManufacturerForm = () => {
  const [loading, setLoading] = useState(false);
  const [manufacturer, setManufacturer] = useState([]);
  const [form, setForm] = useState({
    manufacturer: "",
    manufacturerCompany: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
    manufacturerContact: "",
    manufacturerEmail: "",
    manufacturerGstno: "",
    organization: localStorage.getItem("organizationId"),
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const fetchManufacturers = async () => {
    try {
      const response = await getManufacturer();
      const manufatcurersWithEditingState = response?.map((man) => ({
        ...man,
        isEditing: false,
      }));
      setManufacturer(manufatcurersWithEditingState);
    } catch (error) {
      toast.error("Error fetching manufacturers!");
      console.error(error);
    }
  };

  const toggleEditing = async (id) => {
    const manToEdit = manufacturer.find((man) => man._id === id);
    if (manToEdit.isEditing) {
      try {
        const data = {
          manufacturer: manToEdit.manufacturer,
          manufacturerCompany: manToEdit.manufacturerCompany,
          manufacturerdeliveryAddress: {
            addressLine1: manToEdit.addressLine1,
            addressLine2: manToEdit.addressLine2,
            city: manToEdit.city,
            state: manToEdit.state,
            pinCode: manToEdit.pinCode,
          },
          manufacturerContact: manToEdit.manufacturerContact,
          manufacturerEmail: manToEdit.manufacturerEmail,
          manufacturerGstno: manToEdit.manufacturerGstno,
        };
        await updateManufacturer(data, id);
        toast.success("Manufacturer updated successfully!");
        fetchManufacturers();
      } catch (error) {
        toast.error("Error updating manufacturer!");
        console.error(error);
      }
    } else {
      setManufacturer((prevManufacturer) =>
        prevManufacturer.map((man) =>
          man._id === id ? { ...man, isEditing: !man.isEditing } : man
        )
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createManufacturer({
        manufacturer: form.manufacturer,
        manufacturerCompany: form.manufacturerCompany,
        manufacturerdeliveryAddress: {
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          state: form.state,
          pinCode: form.pinCode,
        },
        manufacturerContact: form.manufacturerContact,
        manufacturerEmail: form.manufacturerEmail,
        manufacturerGstno: form.manufacturerGstno,
        organization: form.organization,
      });
      console.log(response);
      toast.success("Manufacturer added successfully!");
      setForm({
        manufacturer: "",
        manufacturerCompany: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pinCode: "",
        manufacturerContact: "",
        manufacturerEmail: "",
        manufacturerGstno: "",
      });
      fetchManufacturers();
    } catch (error) {
      toast.error("Error adding manufacturer!");
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
    setManufacturer((prevManufacturers) =>
      prevManufacturers.map((man) =>
        man._id === id
          ? {
              ...man,
              [name]: value,
            }
          : man
      )
    );
  };

  const handleDelete = async (id) => {
    try {
      await deleteManufacturer(id);
      toast.error("Manufacturer deleted successfully!");
      fetchManufacturers();
    } catch (error) {
      toast.error("Error deleting manufacturer!");
      console.error(error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border-2 border-[#929292] mb-8">
        <h1 className="text-[1.1rem] text-[#636363] px-8 py-2 border-b-2 border-b-[#929292]">
          Manufacturer
          <span className="text-[1.5rem] text-black">/ Available</span>
        </h1>

        <div className="p-10">
          {/* Manufacturers Table */}
          <div className="mt-8">
            {manufacturer?.length > 0 ? (
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="grid grid-cols-7">
                    <th className="py-2 px-4 text-start">Manufacturer Name</th>
                    <th className="py-2 px-4 text-start">Company</th>
                    <th className="py-2 px-4 text-start">Address</th>
                    <th className="py-2 px-4 text-start">Contact</th>
                    <th className="py-2 px-4 text-start">Email</th>
                    <th className="py-2 px-4 text-start">GST Number</th>
                    <th className="py-2 px-4 text-start">Actions</th>
                  </tr>
                </thead>
                <tbody className="flex flex-col gap-2">
                  {manufacturer?.map((man) => (
                    <tr
                      key={man._id}
                      className="grid grid-cols-7 items-center border border-[#7F7F7F] rounded-md shadow-md"
                    >
                      <td className="py-2 px-4">
                        {man.isEditing ? (
                          <input
                            name="manufacturer"
                            type="text"
                            placeholder="Manufacturer Name"
                            value={man.manufacturer}
                            className="border border-gray-400 px-2 py-1 rounded-[4px] w-[170px]"
                            onChange={(e) => handleItemChange(e, man._id)}
                          />
                        ) : (
                          <span>{man.manufacturer}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {man.isEditing ? (
                          <input
                            name="manufacturerCompany"
                            type="text"
                            placeholder="Manufacturer Company"
                            value={man.manufacturerCompany}
                            className="border border-gray-400 px-2 py-1 rounded-[4px] w-[170px]"
                            onChange={(e) => handleItemChange(e, man._id)}
                          />
                        ) : (
                          <span>{man.manufacturerCompany}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {man.isEditing ? (
                          <div className="flex flex-col gap-1">
                            <input
                              name="addressLine1"
                              type="text"
                              placeholder="Address Line 1"
                              value={
                                man.manufacturerdeliveryAddress?.addressLine1
                              }
                              className="border border-gray-400 px-2 py-1 rounded-[4px] w-[170px]"
                              onChange={(e) => handleItemChange(e, man._id)}
                            />
                            <input
                              name="addressLine2"
                              type="text"
                              placeholder="Address Line 2"
                              value={
                                man.manufacturerdeliveryAddress?.addressLine2
                              }
                              className="border border-gray-400 px-2 py-1 rounded-[4px] w-[170px]"
                              onChange={(e) => handleItemChange(e, man._id)}
                            />
                            <input
                              name="city"
                              type="text"
                              placeholder="City"
                              value={man.manufacturerdeliveryAddress?.city}
                              className="border border-gray-400 px-2 py-1 rounded-[4px] w-[170px]"
                              onChange={(e) => handleItemChange(e, man._id)}
                            />
                            <input
                              name="state"
                              type="text"
                              placeholder="State"
                              value={man.manufacturerdeliveryAddress?.state}
                              className="border border-gray-400 px-2 py-1 rounded-[4px] w-[170px]"
                              onChange={(e) => handleItemChange(e, man._id)}
                            />
                            <input
                              name="pinCode"
                              type="text"
                              placeholder="Pincode"
                              value={man.manufacturerdeliveryAddress?.pinCode}
                              className="border border-gray-400 px-2 py-1 rounded-[4px] w-[170px]"
                              onChange={(e) => handleItemChange(e, man._id)}
                            />
                          </div>
                        ) : (
                          <span>
                            {man.manufacturerdeliveryAddress?.addressLine1}{" "}
                            {man.manufacturerdeliveryAddress?.addressLine2}{" "}
                            {man.manufacturerdeliveryAddress?.city}{" "}
                            {man.manufacturerdeliveryAddress?.state}{" "}
                            {man.manufacturerdeliveryAddress?.pinCode}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {man.isEditing ? (
                          <input
                            name="manufacturerContact"
                            type="text"
                            placeholder="Manufacturer Contact'"
                            value={man.manufacturerContact}
                            className="border border-gray-400 px-2 py-1 rounded-[4px] w-[170px]"
                            onChange={(e) => handleItemChange(e, man._id)}
                          />
                        ) : (
                          <span>{man.manufacturerContact}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {man.isEditing ? (
                          <input
                            name="manufacturerEmail"
                            type="email"
                            placeholder="Manufacturer Email"
                            value={man.manufacturerEmail}
                            className="border border-gray-400 px-2 py-1 rounded-[4px] w-[170px]"
                            onChange={(e) => handleItemChange(e, man._id)}
                          />
                        ) : (
                          <span>{man.manufacturerEmail}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {man.isEditing ? (
                          <input
                            name="manufacturerGstno"
                            type="text"
                            placeholder="Manufacturer GST No."
                            value={man.manufacturerGstno}
                            className="border border-gray-400 px-2 py-1 rounded-[4px] w-[170px]"
                            onChange={(e) => handleItemChange(e, man._id)}
                          />
                        ) : (
                          <span>{man.manufacturerGstno}</span>
                        )}
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        {man.isEditing ? (
                          <IconButton
                            color="green"
                            onClick={() => toggleEditing(man._id)}
                          >
                            Save
                          </IconButton>
                        ) : (
                          <button
                            onClick={() => toggleEditing(man._id)}
                            className="flex items-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                          >
                            <AiOutlineEdit />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(man._id)}
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
                No Manufacturers!
              </Typography>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border-2 border-[#929292] mb-8">
        <h1 className="text-[1.1rem] text-[#636363] px-8 py-2 border-b-2 border-b-[#929292]">
          Manufacturer
          <span className="text-[1.5rem] text-black">/ Create</span>
        </h1>

        <div className="p-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Input
                name="manufacturer"
                label="Manufacturer Name"
                type="text"
                value={form.manufacturer}
                onChange={handleChange}
                required
              />
              <Input
                name="manufacturerCompany"
                label="Company Name"
                type="text"
                value={form.manufacturerCompany}
                onChange={handleChange}
                required
              />
              <Input
                name="addressLine1"
                label="Address Line 1"
                type="text"
                value={form.addressLine1}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex gap-4">
              <Input
                name="addressLine2"
                label="Address Line 2"
                type="text"
                value={form.addressLine2}
                onChange={handleChange}
              />
              <Input
                name="city"
                label="City"
                type="text"
                value={form.city}
                onChange={handleChange}
                required
              />
              <Input
                name="state"
                label="State"
                type="text"
                value={form.state}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex gap-4">
              <Input
                name="pinCode"
                label="Pin Code"
                type="text"
                value={form.pinCode}
                onChange={handleChange}
                required
              />
              <Input
                name="manufacturerContact"
                label="Contact Number"
                type="text"
                value={form.manufacturerContact}
                onChange={handleChange}
                required
              />
              <Input
                name="manufacturerEmail"
                label="Email"
                type="email"
                value={form.manufacturerEmail}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex gap-4">
              <Input
                name="manufacturerGstno"
                label="GST Number"
                type="text"
                value={form.manufacturerGstno}
                onChange={handleChange}
              />
            </div>
            <div className="flex gap-4">
              <Button
                color="blue"
                type="submit"
                className="flex items-center justify-center"
              >
                {loading ? <Spinner /> : <span>Add Manufacturer</span>}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ManufacturerForm;
