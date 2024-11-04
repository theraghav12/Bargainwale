import React, { useState } from "react";
import { MdCheck, MdClose, MdInfoOutline } from "react-icons/md";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";

const DiscountApprovalPage = () => {
  const [requests] = useState([
    {
      id: 1,
      companyName: "ABC Manufacturing",
      bargainNo: "B123",
      requestedDiscount: "15%",
      originalPrice: "5000",
      discountedPrice: "4250",
      requestDate: "2024-10-20",
      description: "Bulk purchase discount for 500 units.",
    },
    {
      id: 2,
      companyName: "XYZ Corp",
      bargainNo: "B456",
      requestedDiscount: "10%",
      originalPrice: "3000",
      discountedPrice: "2700",
      requestDate: "2024-10-22",
      description: "Special offer for end-of-year sale.",
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setIsModalOpen(false);
  };

  return (
    <div className="mt-8 mb-8 px-7">
      <h1 className="text-2xl font-bold mb-4">Discount Approval</h1>
      <div className="bg-white border-[2px] border-[#737373] shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              {[
                "Company Name",
                "Bargain No.",
                "Requested Discount",
                "Original Price",
                "Discounted Price",
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
            {requests.length > 0 ? (
              requests.map((request) => (
                <tr key={request.id} className="border-t border-gray-300">
                  <td className="py-4 px-4 text-center">
                    {request.companyName}
                  </td>
                  <td className="py-4 px-4 text-center">{request.bargainNo}</td>
                  <td className="py-4 px-4 text-center">
                    {request.requestedDiscount}
                  </td>
                  <td className="py-4 px-4 text-center">
                    ₹{request.originalPrice}
                  </td>
                  <td className="py-4 px-4 text-center">
                    ₹{request.discountedPrice}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {request.requestDate}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openModal(request)}
                        className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
                        title="View Details"
                      >
                        <MdInfoOutline className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => console.log("Approved", request.id)}
                        className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600"
                        title="Approve"
                      >
                        <MdCheck className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => console.log("Rejected", request.id)}
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
                  No discount requests found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Discount Details */}
      {selectedRequest && (
        <Dialog open={isModalOpen} handler={closeModal}>
          <DialogHeader>Discount Request Details</DialogHeader>
          <DialogBody divider>
            <p>
              <strong>Company Name:</strong> {selectedRequest.companyName}
            </p>
            <p>
              <strong>Bargain No:</strong> {selectedRequest.bargainNo}
            </p>
            <p>
              <strong>Requested Discount:</strong>{" "}
              {selectedRequest.requestedDiscount}
            </p>
            <p>
              <strong>Original Price:</strong> ₹{selectedRequest.originalPrice}
            </p>
            <p>
              <strong>Discounted Price:</strong> ₹
              {selectedRequest.discountedPrice}
            </p>
            <p>
              <strong>Request Date:</strong> {selectedRequest.requestDate}
            </p>
            <p>
              <strong>Description:</strong> {selectedRequest.description}
            </p>
          </DialogBody>
          <DialogFooter>
            <Button color="green" onClick={closeModal} className="mr-2">
              Close
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
};

export default DiscountApprovalPage;
