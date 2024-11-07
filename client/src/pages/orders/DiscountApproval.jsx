import React, { useEffect, useState } from "react";
import { MdCheck, MdClose, MdInfoOutline } from "react-icons/md";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { getBookings } from "@/services/bookingService";
import { toast } from "sonner";

const DiscountApprovalPage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemApprovals, setItemApprovals] = useState([]);

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setItemApprovals(
      booking.items.map((item) => ({
        itemId: item.item._id,
        approved: null,
      }))
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setIsModalOpen(false);
    setItemApprovals([]);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      throw new Error("Invalid date");
    }
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchBookings = async () => {
    try {
      const response = await getBookings();
      console.log(response);
      setBookings(response);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleItemApproval = (itemId, approved) => {
    setItemApprovals((prevApprovals) =>
      prevApprovals.map((item) =>
        item.itemId === itemId ? { ...item, approved } : item
      )
    );
  };

  console.log(itemApprovals);

  const handleSubmit = async () => {
    if (!selectedBooking) return;

    const updatedItems = itemApprovals.map((item) => ({
      item: item.itemId,
      discount: item.approved
        ? selectedBooking.items?.find((i) => i.item?._id === item.itemId)
            ?.discount
        : 0,
    }));

    try {
      console.log(updatedItems);
      // await updateDiscount(selectedBooking._id, updatedItems);
      await fetchBookings();
      closeModal();
      toast.success("Discount approval completed");
    } catch (error) {
      console.error("Error updating discount:", error);
    }
  };

  console.log(selectedBooking);

  return (
    <div className="mt-8 mb-8 px-7">
      <h1 className="text-2xl font-bold mb-4">Discount Approval</h1>
      <div className="bg-white border-[2px] border-[#737373] shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              {[
                "Bargain Date",
                "Bargain No.",
                "Buyer Name",
                "Approval Status",
                "Delivery Type",
                "Request Date",
                "Actions",
              ].map((header) => (
                <th key={header} className="py-4 px-4 text-center">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking._id} className="border-t border-gray-300">
                  <td className="py-4 px-4 text-center">
                    {formatDate(booking.BargainDate)}
                  </td>
                  <td className="py-4 px-4 text-center">{booking.BargainNo}</td>
                  <td className="py-4 px-4 text-center">
                    {booking.buyer?.buyer}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {booking.discountStatus}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {booking.deliveryOption}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {formatDate(booking.createdAt)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openModal(booking)}
                        className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
                        title="View Details"
                      >
                        <MdInfoOutline className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => console.log("Approved", booking._id)}
                        className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600"
                        title="Approve"
                      >
                        <MdCheck className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => console.log("Rejected", booking._id)}
                        className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                        title="Reject"
                      >
                        <MdClose className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-blue-gray-600">
                  No bookings found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Discount Details */}
      {selectedBooking && (
        <Dialog open={isModalOpen} handler={closeModal}>
          <DialogHeader>Discount booking Details</DialogHeader>
          <DialogBody divider>
            <p>
              <strong>Company Name:</strong> {selectedBooking.buyer?.buyer}
            </p>
            <p>
              <strong>Bargain No:</strong> {selectedBooking.bargainNo}
            </p>
            <p>
              <strong>bookinged Discount:</strong>{" "}
              <span className="font-bold text-red-500">
                {selectedBooking.bookingedDiscount}%
              </span>
            </p>
            <p>
              <strong>Original Price:</strong> ₹{selectedBooking.originalPrice}
            </p>
            <p>
              <strong>Discounted Price:</strong> ₹
              {selectedBooking.discountedPrice}
            </p>
            <p>
              <strong>booking Date:</strong> {selectedBooking.bookingDate}
            </p>
            <p>
              <strong>Description:</strong> {selectedBooking.description}
            </p>

            {/* Item Details Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full border mt-4">
                <thead>
                  <tr>
                    <th className="border p-2 min-w-[80px]">Item Name</th>
                    <th className="border p-2 min-w-[80px]">Cont. Number</th>
                    <th className="border p-2 min-w-[80px]">GST</th>
                    <th className="border p-2 min-w-[80px]">Pickup</th>
                    <th className="border p-2 min-w-[80px]">Quantity</th>
                    <th className="border p-2 min-w-[80px]">Taxable Amount</th>
                    <th className="border p-2 min-w-[80px]">
                      Amount (with tax)
                    </th>
                    <th className="border p-2 min-w-[80px]">Base Rate</th>
                    <th className="border p-2 min-w-[80px]">
                      Discount Price Requested
                    </th>
                    <th className="border p-2 min-w-[80px]">Approve</th>
                    <th className="border p-2 min-w-[80px]">Reject</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBooking.items?.map((item, index) => (
                    <tr key={index} className="border">
                      <td className="border p-2">
                        {item.item?.materialdescription}
                      </td>
                      <td className="border p-2">{item.contNumber}</td>
                      <td className="border p-2">{item.item?.gst}</td>
                      <td className="border p-2">{item.pickup}</td>
                      <td className="border p-2">{item.quantity}</td>
                      <td className="border p-2">{item.taxableAmount}</td>
                      <td className="border p-2">{item.taxpaidAmount}</td>
                      <td className="border p-2">₹{item?.baseRate}</td>
                      <td className="border p-2">₹{item?.discount}</td>
                      <td className="border p-2 flex gap-2">
                        <button
                          onClick={() =>
                            handleItemApproval(item.item._id, true)
                          }
                          className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600"
                          title="Approve"
                        >
                          <MdCheck className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleItemApproval(item.item._id, false)
                          }
                          className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                          title="Reject"
                        >
                          <MdClose className="h-5 w-5" />
                        </button>
                      </td>
                      {/* <td className="border p-2 text-center">
                        <input
                          type="radio"
                          name={`approval-${item.item._id}`}
                          onChange={() =>
                            handleItemApproval(item.item._id, true)
                          }
                        />
                      </td>
                      <td className="border p-2 text-center">
                        <input
                          type="radio"
                          name={`approval-${item.item._id}`}
                          onChange={() =>
                            handleItemApproval(item.item._id, false)
                          }
                        />
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button color="green" onClick={handleSubmit} className="mr-2">
              Submit
            </Button>
            <Button color="red" onClick={closeModal}>
              Close
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
};

export default DiscountApprovalPage;
