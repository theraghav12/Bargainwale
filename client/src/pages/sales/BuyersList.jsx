import { useEffect, useState } from "react";
import { AiOutlineSearch, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Tooltip, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { getBookings } from "@/services/bookingService";
import { getBuyer } from "@/services/masterService";

const BuyersList = () => {
  const [buyers, setBuyers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [buyersPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBuyers = async () => {
    setIsLoading(true);
    try {
      const response = await getBuyer();
      setBuyers(response);
    } catch (err) {
      console.error("Error fetching buyers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await getBookings();
      setBookings(response);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const getBookingCountForBuyer = (buyerId) => {
    return bookings.filter((booking) => booking.buyer?._id === buyerId).length;
  };

  useEffect(() => {
    fetchBuyers();
    fetchBookings();
  }, []);

  const filteredBuyers = buyers.filter((buyer) =>
    buyer.buyer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBuyer = currentPage * buyersPerPage;
  const indexOfFirstBuyer = indexOfLastBuyer - buyersPerPage;
  const currentBuyers = filteredBuyers.slice(indexOfFirstBuyer, indexOfLastBuyer);

  const totalPages = Math.ceil(filteredBuyers.length / buyersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Buyers Management</h1>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-lg mb-6">
        <AiOutlineSearch className="absolute top-3 left-3 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search buyers by name..."
          className="w-full pl-10 pr-4 py-2 rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />
      </div>

      {/* Buyers List */}
      <div className="bg-white shadow rounded-lg p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 animate-pulse rounded-lg"
              ></div>
            ))}
          </div>
        ) : currentBuyers?.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentBuyers.map((buyer) => (
              <div
                key={buyer._id}
                className="border rounded-lg shadow-lg hover:shadow-xl transition p-4"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {buyer.buyer}
                </h2>
                <p className="text-sm">
                  <strong>Company:</strong> {buyer.buyerCompany || "N/A"}
                </p>
                <p className="text-sm">
                  <strong>Contact:</strong> {buyer.buyerContact || "N/A"}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {buyer.buyerEmail || "N/A"}
                </p>
                <p className="text-sm">
                  <strong>GST No.:</strong> {buyer.buyerGstno || "N/A"}
                </p>
                <p className="text-sm">
                  <strong>Bookings:</strong> {getBookingCountForBuyer(buyer._id)}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/sales/create/${buyer._id}`}
                    className="text-white bg-blue-500 hover:bg-blue-600 rounded-lg px-4 py-2 text-sm font-semibold transition"
                  >
                    Create Sales
                  </Link>
                  <div className="flex gap-2">
                    <Tooltip content="Edit Buyer" placement="top">
                      <button className="text-gray-500 hover:text-blue-500">
                        <AiOutlineEdit size={20} />
                      </button>
                    </Tooltip>
                    <Tooltip content="Delete Buyer" placement="top">
                      <button className="text-gray-500 hover:text-red-500">
                        <AiOutlineDelete size={20} />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Typography className="text-lg font-semibold">
              No buyers found!
            </Typography>
            <p className="mt-2">
              Try adjusting your search or{" "}
              <Link to="/add-buyer" className="text-blue-500 underline">
                add a new buyer.
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredBuyers.length > buyersPerPage && (
        <div className="flex justify-center mt-6">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 mx-1 rounded-lg ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyersList;
