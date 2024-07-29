import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// import { toast } from "react-toastify";

//redux
// import { useDispatch, useSelector } from "react-redux";
// import { fetchRestaurantDetails } from "../../redux/restaurantData";
// import type { RootState, AppDispatch } from "../../redux/store";

//icons
import { RiDashboardFill } from "react-icons/ri";
import { FaConciergeBell } from "react-icons/fa";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { MdOutlinePerson3 } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { IoLogOutOutline } from "react-icons/io5";
import { HiChevronUpDown } from "react-icons/hi2";
import { FiPlus } from "react-icons/fi";
import { FaChevronRight } from "react-icons/fa";

// assets
// import right from "../../assets/right.png";

// components
import Frame from "./Frame";
import Navbar from "./Navbar";

const LeftNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // const handleLogout = () => {
  //   localStorage.removeItem("id");
  //   localStorage.removeItem("token");
  //   toast.error("Successfully Logged Out");
  //   navigate("/login");
  // };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const [outlet, setoutlet] = useState(false);

  const handleToggle1 = () => {
    setoutlet(!outlet);
  };

  const location = useLocation();

  const data1 = [
    {
      name: "Foodoos",
      id: "1234567",
    },
    {
      name: "Foodoos",
      id: "1234567",
    },
  ];

  // const useAppDispatch = () => useDispatch<AppDispatch>();
  // const dispatch = useAppDispatch();
  // const { data } = useSelector((state: RootState) => state.resturantdata);
  // console.log("restaurantData: ", data);

  // const id: string | null = localStorage.getItem("id");

  // useEffect(() => {
  //   if (id) {
  //     dispatch(fetchRestaurantDetails({ id }) as any);
  //   }
  //   if (!localStorage.getItem("token")) {
  //     navigate("/login");
  //   }
  // }, [dispatch, id]);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Navbar />
      <nav
        className={`fixed bg-white z-50 mt-[70px] h-[calc(100vh-70px)] border-r shadow-xl shadow-[#00000026] ${
          isOpen ? "lg:w-[15%] duration-100" : "lg:w-[7%] duration-100"
        }`}
      >
        {/* sidebar for small screens */}
        <div className="lg:hidden block fixed bottom-2 px-3 w-[100%] h-fit z-[900]">
          <div className="flex items-center justify-evenly gap-3 text-[#64748B] bg-white py-2 border rounded-md">
            <div>
              <Link
                className={`${
                  location.pathname === "/"
                    ? "text-[#004AAD] bg-slate-100  "
                    : "text-[#64748B]"
                } flex gap-2 text-nowrap items-center hover:text-[#004AAD] rounded-xl ${
                  isOpen ? "px-5 mx-3 py-2.5 " : " p-4 "
                } `}
                to="/"
              >
                <RiDashboardFill className="text-[2rem]" />
                <span
                  onClick={handleToggle}
                  className={` ${isOpen ? "block text-[.9rem]" : " hidden"}`}
                >
                  Dashboard <span className=" text-transparent ">_______</span>
                </span>
              </Link>
            </div>
            <div>
              <Link
                className={`${
                  location.pathname === "/menu"
                    ? "text-[#004AAD] bg-slate-100  "
                    : "text-[#64748B]"
                } flex gap-2 text-nowrap items-center hover:text-[#004AAD] rounded-xl ${
                  isOpen ? "px-5 mx-3 py-2.5  " : " p-4 "
                } `}
                to="/menu"
              >
                <FaConciergeBell className="text-[2rem]" />
                <span
                  onClick={handleToggle}
                  className={` ${isOpen ? "block text-[.9rem]" : " hidden"}`}
                >
                  Menu{" "}
                  <span className=" text-transparent">...__________..</span>
                </span>
              </Link>
            </div>
            <div>
              <Link
                className={`${
                  location.pathname === "/marketing"
                    ? "text-[#004AAD] bg-slate-100  "
                    : "text-[#64748B]"
                } flex gap-2 text-nowrap items-center hover:text-[#004AAD] rounded-xl ${
                  isOpen ? "px-5 mx-3 py-2.5  " : " p-4 "
                } `}
                to="/marketing"
              >
                <HiOutlineSpeakerphone className="text-[2rem]" />
                <span
                  onClick={handleToggle}
                  className={` ${isOpen ? "block text-[.9rem]" : " hidden"}`}
                >
                  Marketing <span className=" text-transparent ">_______</span>
                </span>
              </Link>
            </div>
            <div>
              <Link
                className={`${
                  location.pathname === "/customer"
                    ? "text-[#004AAD] bg-slate-100  "
                    : "text-[#64748B]"
                } flex gap-2 text-nowrap items-center hover:text-[#004AAD] rounded-xl ${
                  isOpen ? "px-5 mx-3 py-2.5 " : " p-4 "
                } `}
                to="/customer"
              >
                <MdOutlinePerson3 className="text-[2rem]" />
                <span
                  onClick={handleToggle}
                  className={` ${isOpen ? "block text-[.9rem]" : " hidden"}`}
                >
                  Customer <span className=" text-transparent ">______</span>
                </span>
              </Link>
            </div>
            <div>
              <Link
                className={`${
                  location.pathname === "/setting"
                    ? "text-[#004AAD] bg-slate-100  "
                    : "text-[#64748B]"
                } flex gap-2 text-nowrap  items-center hover:text-[#004AAD] rounded-xl ${
                  isOpen ? "px-5 mx-3 py-2.5  " : " p-4 "
                } `}
                to="/setting"
              >
                <CiSettings className="text-[2rem]" />
                <span
                  onClick={handleToggle}
                  className={` ${isOpen ? "block text-[.9rem]" : " hidden"}`}
                >
                  Setting <span className=" text-transparent ">_____</span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex relative w-full flex flex-col justify-evenly items-center">
          {/* <img
            onClick={handleToggle}
            className={`absolute top-5 size-14 cursor-pointer -right-7 ${
              isOpen ? " rotate-180" : " rotate-0"
            }`}
            src={right}
            alt=""
          /> */}
          <FaChevronRight
            onClick={handleToggle}
            className={`absolute top-5 text-[2rem] cursor-pointer -right-4 bg-gray-300 p-2 rounded-full ${
              isOpen ? " rotate-180" : " rotate-0"
            }`}
          />

          <div
            className={`absolute top-[5.55rem] border border-[#757474]    w-[80%] h-fit rounded-xl bg-white opacity-100 ${
              outlet ? "block" : "hidden"
            }  ${isOpen ? "block" : "hidden"}`}
          >
            {data1?.map((item, index) => (
              <div
                key={index}
                className="flex flex-col   justify-between w-full  border-b border-[#706e6e] "
              >
                <div className="px-4 p-1 ">
                  <p className="text-[#64748B] text-[.9rem]">{item.name}</p>
                  <p className="text-[#4E4E4E] text-[.8rem]">Id: {item.id}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-cente gap-2 px-3 font-semibold text-[.9rem] py-1.5 bg-slate-200 rounded-xl rounded-t-none">
              <FiPlus />
              <p>Add Outlet</p>
            </div>
          </div>

          <div
            className={`flex w-full items-center flex-col justify-between text-[#64748B] text-[1.1rem] gap-20 mt-14`}
          >
            <div className="flex flex-col  gap-1 ">
              <div>
                <Link
                  onClick={handleScrollToTop}
                  className={`${
                    location.pathname === "/"
                      ? "text-[#004AAD] bg-slate-100  "
                      : "text-[#64748B]"
                  } flex gap-2 text-nowrap  items-center hover:text-[#004AAD] rounded-xl ${
                    isOpen ? "px-5 mx-3 py-2.5 " : " p-4 "
                  } `}
                  to="/"
                >
                  <RiDashboardFill />
                  <span
                    onClick={handleToggle}
                    className={` ${isOpen ? "block text-[.9rem]" : " hidden"}`}
                  >
                    Dashboard{" "}
                    <span className=" text-transparent ">_______</span>
                  </span>
                </Link>
              </div>
              <div>
                <Link
                  onClick={handleScrollToTop}
                  className={`${
                    location.pathname === "/orders"
                      ? "text-[#004AAD] bg-slate-100  "
                      : "text-[#64748B]"
                  } flex gap-2 text-nowrap items-center hover:text-[#004AAD] rounded-xl ${
                    isOpen ? "px-5 mx-3 py-2.5  " : " p-4 "
                  } `}
                  to="/orders"
                >
                  <FaConciergeBell />
                  <span
                    onClick={handleToggle}
                    className={` ${isOpen ? "block text-[.9rem]" : " hidden"}`}
                  >
                    Orders{" "}
                    <span className=" text-transparent">...__________..</span>
                  </span>
                </Link>
              </div>

              <div>
                <Link
                  onClick={handleScrollToTop}
                  className={`${
                    location.pathname === "/users"
                      ? "text-[#004AAD] bg-slate-100  "
                      : "text-[#64748B]"
                  } flex gap-2 text-nowrap items-center hover:text-[#004AAD] rounded-xl ${
                    isOpen ? "px-5 mx-3 py-2.5 " : " p-4 "
                  } `}
                  to="/users"
                >
                  <MdOutlinePerson3 />
                  <span
                    onClick={handleToggle}
                    className={` ${isOpen ? "block text-[.9rem]" : " hidden"}`}
                  >
                    Users <span className=" text-transparent ">______</span>
                  </span>
                </Link>
              </div>
              <div>
                <Link
                  onClick={handleScrollToTop}
                  className={`${
                    location.pathname === "/marketing"
                      ? "text-[#004AAD] bg-slate-100  "
                      : "text-[#64748B]"
                  } flex gap-2 text-nowrap items-center hover:text-[#004AAD] rounded-xl ${
                    isOpen ? "px-5 mx-3 py-2.5  " : " p-4 "
                  } `}
                  to="/marketing"
                >
                  <HiOutlineSpeakerphone />
                  <span
                    onClick={handleToggle}
                    className={` ${isOpen ? "block text-[.9rem]" : " hidden"}`}
                  >
                    Marketing{" "}
                    <span className=" text-transparent ">_______</span>
                  </span>
                </Link>
              </div>
              <div>
                <Link
                  onClick={handleScrollToTop}
                  className={`${
                    location.pathname === "/setting"
                      ? "text-[#004AAD] bg-slate-100  "
                      : "text-[#64748B]"
                  } flex gap-2 text-nowrap  items-center hover:text-[#004AAD] rounded-xl ${
                    isOpen ? "px-5 mx-3 py-2.5" : " p-4 "
                  } `}
                  to="/setting"
                >
                  <CiSettings />{" "}
                  <span
                    onClick={handleToggle}
                    className={` ${isOpen ? "block text-[.9rem]" : " hidden"}`}
                  >
                    Setting <span className=" text-transparent ">_____</span>
                  </span>
                </Link>
              </div>
              <div className="hidden lg:block">
                <div
                  className={`flex items-center text-nowrap  gap-3 text-red-500 hover:cursor-pointer ${
                    isOpen ? "px-5 mx-3 py-2.5  " : " p-4 "
                  }`}
                  // onClick={handleLogout}
                >
                  <IoLogOutOutline />{" "}
                  <span
                    className={` ${
                      isOpen ? "block text-[.9rem] text-red-500" : " hidden"
                    }`}
                  >
                    Log Out
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <Frame />

      <Outlet />
    </>
  );
};

export default LeftNavbar;
