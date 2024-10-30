import {
  Button,
  Input,
  Spinner,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// api services
import {
  createBuyer,
  deleteBuyer,
  getBuyer,
  updateBuyer,
} from "@/services/masterService";

// icons
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

const BuyerForm = () => {
  const [loading, setLoading] = useState(false);
  const [buyers, setBuyers] = useState([]);
  const [form, setForm] = useState({
    buyer: "",
    buyerCompany: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
    buyerContact: "",
    buyerEmail: "",
    buyerGstno: "",
    buyerGooglemaps: "",
    organization: localStorage.getItem("organizationId"),
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    try {
      const response = await getBuyer();
      const buyersWithEditingState = response?.map((buyer) => ({
        ...buyer,
        isEditing: false,
      }));
      setBuyers(buyersWithEditingState);
    } catch (error) {
      toast.error("Error fetching buyers!");
      console.error(error);
    }
  };

  const toggleEditing = async (id) => {
    const buyerToEdit = buyers.find((buyer) => buyer._id === id);
    if (buyerToEdit.isEditing) {
      try {
        const data = {
          buyer: buyerToEdit.buyer,
          buyerCompany: buyerToEdit.buyerCompany,
          buyerdeliveryAddress: {
            addressLine1: buyerToEdit.buyerdeliveryAddress?.addressLine1,
            addressLine2: buyerToEdit.buyerdeliveryAddress?.addressLine2,
            city: buyerToEdit.buyerdeliveryAddress?.city,
            state: buyerToEdit.buyerdeliveryAddress?.state,
            pinCode: buyerToEdit.buyerdeliveryAddress?.pinCode,
          },
          buyerContact: buyerToEdit.buyerContact,
          buyerEmail: buyerToEdit.buyerEmail,
          buyerGstno: buyerToEdit.buyerGstno,
          buyerGooglemaps: buyerToEdit.buyerGooglemaps,
        };
        await updateBuyer(data, id);
        toast.success("Buyer updated successfully!");
        fetchBuyers();
      } catch (error) {
        toast.error("Error updating buyer!");
        console.error(error);
      }
    } else {
      setBuyers((prevBuyers) =>
        prevBuyers.map((buyer) =>
          buyer._id === id ? { ...buyer, isEditing: !buyer.isEditing } : buyer
        )
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createBuyer({
        buyer: form.buyer,
        buyerCompany: form.buyerCompany,
        buyerdeliveryAddress: {
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          state: form.state,
          pinCode: form.pinCode,
        },
        buyerContact: form.buyerContact,
        buyerEmail: form.buyerEmail,
        buyerGstno: form.buyerGstno,
        buyerGooglemaps: form.buyerGooglemaps,
        organization: form.organization,
      });
      console.log(response);
      toast.success("Buyer added successfully!");
      setForm({
        buyer: "",
        buyerCompany: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pinCode: "",
        buyerContact: "",
        buyerEmail: "",
        buyerGstno: "",
        buyerGooglemaps: "",
        organization: localStorage.getItem("organizationId"),
      });
      fetchBuyers();
    } catch (error) {
      toast.error("Error adding buyer!");
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

  const handleItemChange = (e, id) => {
    const { name, value } = e.target;

    setBuyers((prevBuyers) =>
      prevBuyers.map((buyer) => {
        if (buyer._id === id) {
          if (name.startsWith("buyerdeliveryAddress.")) {
            const addressField = name.split(".")[1];
            return {
              ...buyer,
              buyerdeliveryAddress: {
                ...buyer.buyerdeliveryAddress,
                [addressField]: value,
              },
            };
          } else {
            return {
              ...buyer,
              [name]: value,
            };
          }
        }
        return buyer;
      })
    );
  };

  const handleDelete = async (id) => {
    try {
      await deleteBuyer(id);
      toast.error("Buyer deleted successfully!");
      fetchBuyers();
    } catch (error) {
      toast.error("Error deleting buyer!");
      console.error(error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border-2 border-[#929292] mb-8">
        <h1 className="text-[1.1rem] text-[#636363] px-8 py-2 border-b-2 border-b-[#929292]">
          Buyers
          <span className="text-[1.5rem] text-black">/ Available</span>
        </h1>

        <div className="p-10">
          {/* Buyers Table */}
          <div className="mt-8">
            {buyers?.length > 0 ? (
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="grid grid-cols-7">
                    <th className="py-2 px-2 text-start">Buyer Name</th>
                    <th className="py-2 px-2 text-start">Company</th>
                    <th className="py-2 px-2 text-start">Address</th>
                    <th className="py-2 px-2 text-start">Contact</th>
                    <th className="py-2 px-2 text-start">Email</th>
                    <th className="py-2 px-2 text-start">GST Number</th>
                    <th className="py-2 px-2 text-start">Actions</th>
                  </tr>
                </thead>
                <tbody className="flex flex-col gap-2">
                  {buyers?.map((buyer) => (
                    <tr
                      key={buyer._id}
                      className="grid grid-cols-7 items-center border border-[#7F7F7F] rounded-md shadow-md"
                    >
                      <td className="py-2 px-2">
                        {buyer.isEditing ? (
                          <input
                            name="buyer"
                            type="text"
                            placeholder="Buyer Name"
                            value={buyer.buyer}
                            className="border border-gray-400 px-2 py-1 rounded-[4px] w-full"
                            onChange={(e) => handleItemChange(e, buyer._id)}
                          />
                        ) : (
                          <span>{buyer.buyer}</span>
                        )}
                      </td>
                      <td className="py-2 px-2">
                        {buyer.isEditing ? (
                          <input
                            name="buyerCompany"
                            type="text"
                            placeholder="Buyer Company"
                            value={buyer.buyerCompany}
                            className="border border-gray-400 px-2 py-1 rounded-[4px] w-full"
                            onChange={(e) => handleItemChange(e, buyer._id)}
                          />
                        ) : (
                          <span>{buyer.buyerCompany}</span>
                        )}
                      </td>
                      <td className="py-2 px-2">
                        {buyer.isEditing ? (
                          <div className="flex flex-col gap-1">
                            <input
                              name="buyerdeliveryAddress.addressLine1"
                              type="text"
                              placeholder="Address Line 1"
                              value={buyer.buyerdeliveryAddress?.addressLine1}
                              className="border border-gray-400 px-2 py-1 rounded-[4px] w-full"
                              onChange={(e) => handleItemChange(e, buyer._id)}
                            />
                            <input
                              name="buyerdeliveryAddress.addressLine2"
                              type="text"
                              placeholder="Address Line 2"
                              value={buyer.buyerdeliveryAddress?.addressLine2}
                              className="border border-gray-400 px-2 py-1 rounded-[4px] w-full"
                              onChange={(e) => handleItemChange(e, buyer._id)}
                            />
                            <input
                              name="buyerdeliveryAddress.city"
                              type="text"
                              placeholder="City"
                              value={buyer.buyerdeliveryAddress?.city}
                              className="border border-gray-400 px-2 py-1 rounded-[4px] w-full"
                              onChange={(e) => handleItemChange(e, buyer._id)}
                            />
                            <input
                              name="buyerdeliveryAddress.state"
                              type="text"
                              placeholder="State"
                              value={buyer.buyerdeliveryAddress?.state}
                              className="border border-gray-400 px-2 py-1 rounded-[4px] w-full"
                              onChange={(e) => handleItemChange(e, buyer._id)}
                            />
                            <input
                              name="buyerdeliveryAddress.pinCode"
                              type="text"
                              placeholder="Pincode"
                              value={buyer.buyerdeliveryAddress?.pinCode}
                              className="border border-gray-400 px-2 py-1 rounded-[4px] w-full"
                              onChange={(e) => handleItemChange(e, buyer._id)}
                            />
                          </div>
                        ) : (
                          <span>
                            {buyer.buyerdeliveryAddress?.addressLine1}{" "}
                            {buyer.buyerdeliveryAddress?.addressLine2}{" "}
                            {buyer.buyerdeliveryAddress?.city}{" "}
                            {buyer.buyerdeliveryAddress?.state}{" "}
                            {buyer.buyerdeliveryAddress?.pinCode}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2">
                        {buyer.isEditing ? (
                          <input
                            name="buyerContact"
                            type="text"
                            placeholder="Buyer Contact'"
                            value={buyer.buyerContact}
                            className="border border-gray-400 px-2 py-1 rounded-[4px] w-full"
                            onChange={(e) => handleItemChange(e, buyer._id)}
                          />
                        ) : (
                          <span>{buyer.buyerContact}</span>
                        )}
                      </td>
                      <td className="py-2 px-2">
                        {buyer.isEditing ? (
                          <input
                            name="buyerEmail"
                            type="email"
                            placeholder="Buyer Email"
                            value={buyer.buyerEmail}
                            className="border border-gray-400 px-2 py-1 rounded-[4px] w-full"
                            onChange={(e) => handleItemChange(e, buyer._id)}
                          />
                        ) : (
                          <span className="break-words">
                            {buyer.buyerEmail}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2">
                        {buyer.isEditing ? (
                          <input
                            name="buyerGstno"
                            type="text"
                            placeholder="Buyer GST No."
                            value={buyer.buyerGstno}
                            className="border border-gray-400 px-2 py-1 rounded-[4px] w-full"
                            onChange={(e) => handleItemChange(e, buyer._id)}
                          />
                        ) : (
                          <span>{buyer.buyerGstno}</span>
                        )}
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        {buyer.isEditing ? (
                          <IconButton
                            color="green"
                            onClick={() => toggleEditing(buyer._id)}
                          >
                            Save
                          </IconButton>
                        ) : (
                          <button
                            onClick={() => toggleEditing(buyer._id)}
                            className="flex items-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                          >
                            <AiOutlineEdit />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(buyer._id)}
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
                No Buyers!
              </Typography>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border-2 border-[#929292] mb-8">
        <h1 className="text-[1.1rem] text-[#636363] px-8 py-2 border-b-2 border-b-[#929292]">
          Buyers
          <span className="text-[1.5rem] text-black">/ Create</span>
        </h1>

        <div className="p-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Input
                name="buyer"
                label="Buyer Name"
                type="text"
                value={form.buyer}
                onChange={handleChange}
                required
              />
              <Input
                name="buyerCompany"
                label="Company Name"
                type="text"
                value={form.buyerCompany}
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
                name="buyerContact"
                label="Contact Number"
                type="text"
                value={form.buyerContact}
                onChange={handleChange}
                required
              />
              <Input
                name="buyerEmail"
                label="Email"
                type="email"
                value={form.buyerEmail}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex gap-4">
              <Input
                name="buyerGstno"
                label="GST Number"
                type="text"
                value={form.buyerGstno}
                onChange={handleChange}
                required
              />
              <Input
                name="buyerGooglemaps"
                label="Google Maps Link"
                type="text"
                value={form.buyerGooglemaps}
                onChange={handleChange}
              />
            </div>
            <div className="flex gap-4">
              <Button
                color="blue"
                type="submit"
                className="flex items-center justify-center"
              >
                {loading ? <Spinner /> : <span>Add Buyer</span>}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BuyerForm;
