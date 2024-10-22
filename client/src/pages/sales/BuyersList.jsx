import { getBookings } from "@/services/bookingService";
import { getBuyer } from "@/services/masterService";
import { Option, Select, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Link } from "react-router-dom";

const BuyersList = () => {
  const [buyers, setBuyers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBuyers = async () => {
    try {
      const response = await getBuyer();
      console.log(response);
      setBuyers(response);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await getBookings();
      setBookings(response);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const getBookingCountForBuyer = (buyerId) => {
    return bookings.filter((booking) => booking.buyer?._id === buyerId).length;
  };

  useEffect(() => {
    fetchBookings();
    fetchBuyers();
  }, []);

  const filteredBuyers = buyers.filter((buyer) =>
    buyer.buyer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Search Bar */}
      <div className="w-full flex gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Buyer Name"
          className="border-[2px] border-[#737373] px-2 py-2 rounded-md placeholder-[#737373]"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md border-2 border-[#929292] mb-8 mt-4">
        <h1 className="text-[1.1rem] text-[#636363] px-8 py-2 border-b-2 border-b-[#929292]">
          EXISTING BUYERS
        </h1>

        <div className="px-10 pb-10">
          {/* Items Table */}
          <div className="w-full overflow-x-scroll mt-8">
            {filteredBuyers?.length > 0 ? (
              <table className="w-full bg-white">
                <thead>
                  <tr className="grid grid-cols-8">
                    <th className="py-2 px-4 text-start">Buyer</th>
                    <th className="py-2 px-4 text-start">Company</th>
                    <th className="py-2 px-4 text-start">Contact</th>
                    <th className="py-2 px-4 text-start">Email</th>
                    <th className="py-2 px-4 text-start">GST No.</th>
                    <th className="py-2 px-4 text-start">Google Maps Link</th>
                    <th className="py-2 px-4 text-start">Active Bookings</th>
                    <th className="py-2 px-4 text-start">Actions</th>
                  </tr>
                </thead>
                <tbody className="flex flex-col gap-2 mt-2">
                  {buyers?.map((buyer) => (
                    <tr
                      key={buyer._id}
                      className="grid grid-cols-8 py-2 items-center border border-[#7F7F7F] rounded-md shadow-xl"
                    >
                      <td className="py-2 px-4">
                        <span>{buyer.buyer}</span>
                      </td>
                      <td className="py-2 px-4">
                        <span>{buyer.buyerCompany}</span>
                      </td>
                      <td className="py-2 px-4">
                        <span>{buyer.buyerContact}</span>
                      </td>
                      <td className="py-2 px-4">
                        <span>{buyer.buyerEmail}</span>
                      </td>
                      <td className="py-2 px-4">
                        <span>{buyer.buyerGstno}</span>
                      </td>
                      <td className="py-2 px-4">
                        <span>{buyer.buyerGooglemaps}</span>
                      </td>
                      <td className="py-2 px-4">
                        <span>{getBookingCountForBuyer(buyer._id)}</span>
                      </td>
                      <td className="py-2 px-4">
                        <Link
                          to={`/sales/create/${buyer._id}`}
                          className="bg-[#CACACA] rounded-md px-4 py-1 cursor-pointer font-semibold"
                        >
                          Create Sales
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Typography className="text-xl text-center font-bold">
                No buyers!
              </Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyersList;
