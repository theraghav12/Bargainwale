import { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuAsterisk } from "react-icons/lu";
import OrdersTable from "../components/OrdersTable";
import axios from "axios";
import { API } from "../utils/API";
import { useDispatch } from "react-redux";
import { AppThunkDispatch, fetchData } from "../redux/userSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Orders = () => {
  // const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div className="relative top-[70px] lg:ml-[7%] p-10">
        <h1 className="text-start text-[2rem] font-semibold">Orders</h1>
        <div className="w-full flex flex-col sm:flex-row gap-10 mt-2">
          <div className="w-[280px] flex flex-col justify-between p-6 rounded-lg shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Place Your Order</h2>
              <p className="mb-6">Get started with a new order</p>
            </div>
            <Link
              to="/orders/create"
              className="w-full text-center bg-black text-white p-2 rounded-lg hover:bg-black/80"
            >
              Create An Order
            </Link>
          </div>
          {/* <div className="w-[280px] flex flex-col justify-between p-6 rounded-lg shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Get Order History</h2>
              <p className="mb-6">Get History about the orders in past</p>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded-lg hover:bg-black/80"
            >
              Order History
            </button>
          </div> */}
        </div>
        <h1 className="text-start text-[1.5rem] font-semibold mt-7">
          Order History
        </h1>
        <OrdersTable />
      </div>

      {/* Create order form */}
    </>
  );
};

export default Orders;
