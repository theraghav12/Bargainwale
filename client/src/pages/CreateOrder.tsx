import axios from "axios";
import { LuAsterisk } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { AppThunkDispatch, fetchData } from "../redux/userSlice";
import { API } from "../utils/API";
import { toast } from "react-toastify";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useState } from "react";
import { OrderFormData } from "../utils/types";

const CreateOrder = () => {
  const warehouse = localStorage.getItem("warehouse");
  const [formData, setFormData] = useState<OrderFormData>({
    companyBargainDate: "",
    item: {
      type: "oil",
    },
    companyBargainNo: "",
    location: {
      state: "",
      city: "",
    },
    staticPrice: 0,
    quantity: 0,
    weightInMetrics: 0,

    status: "created",
    description: "",
    createdAt: new Date(),
    billedAt: undefined,
    warehouse: warehouse,
    organization: "66ad2166736b9916dd42c23a",
  });

  const dispatch: AppThunkDispatch = useDispatch();

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${API}/order`,
      headers: {
        "Content-Type": "application/json",
      },
      data: formData,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        dispatch(fetchData({ id: "66ad2166736b9916dd42c23a" }));
        setFormData({
          companyBargainDate: "",
          item: {
            type: "oil",
          },
          companyBargainNo: "",
          location: {
            state: "",
            city: "",
          },
          staticPrice: 0,
          quantity: 0,
          weightInMetrics: 0,
          status: "created",
          description: "",
          createdAt: new Date(),
          billedAt: undefined,
          warehouse: "",
          organization: "66a756651625f0a41547a9db",
        });
        toast.success("Order Created");
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(formData);
  };

  return (
    <div className="relative top-[70px] lg:ml-[7%] sm:p-10">
      <div className={`p-4 w-full overflow-y-auto hideScroller h-full`}>
        <div className="w-full relative bg-white rounded-lg">
          <div className="flex flex-row items-center justify-between gap-8 px-10 py-4">
            <div className="flex flex-col">
              <h1 className="text-[1.5rem] font-[500]">Create Order</h1>
            </div>
          </div>
          <div className="flex flex-col mt-2 px-8 pb-5">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-2 justify-center"
            >
              <div className="flex flex-col gap-1">
                <label className="flex flex-row mt-2 items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                  Company Bargain Date
                  <LuAsterisk className="text-sm text-[#C62828]" />
                </label>
                <input
                  type="date"
                  className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                  name="companyBargainDate"
                  // value={formData.companyBargainDate}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                  Company Bargain No
                  <LuAsterisk className="text-sm text-[#C62828]" />
                </label>
                <input
                  type="text"
                  className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                  placeholder="Enter company bargain number"
                  name="companyBargainNo"
                  value={formData.companyBargainNo}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-row gap-4 mt-2">
                <div className="flex flex-col gap-1 w-1/2">
                  <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                    State
                    <LuAsterisk className="text-sm text-[#C62828]" />
                  </label>
                  <input
                    type="text"
                    className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                    placeholder="State"
                    name="locationState"
                    value={formData.location.state}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        location: {
                          ...prevData.location,
                          state: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                  <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                    City
                    <LuAsterisk className="text-sm text-[#C62828]" />
                  </label>
                  <input
                    type="text"
                    className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                    placeholder="City"
                    name="locationCity"
                    value={formData.location.city}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        location: {
                          ...prevData.location,
                          city: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex flex-row gap-4 mt-2">
                <div className="flex flex-col gap-1 w-1/2">
                  <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                    Static Price
                    <LuAsterisk className="text-sm text-[#C62828]" />
                  </label>
                  <input
                    type="number"
                    className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                    placeholder="Enter static price"
                    name="staticPrice"
                    value={formData.staticPrice}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                  <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                    Quantity
                    <LuAsterisk className="text-sm text-[#C62828]" />
                  </label>
                  <input
                    type="number"
                    className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                    placeholder="Enter quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex flex-row gap-4 mt-2">
                <div className="flex flex-col gap-1 w-full">
                  <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                    Weight in Metrics
                    <LuAsterisk className="text-sm text-[#C62828]" />
                  </label>
                  <input
                    type="number"
                    className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                    placeholder="Enter weight in metrics"
                    name="weightInMetrics"
                    value={formData.weightInMetrics}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex flex-row gap-4 mt-2">
                <div className="flex flex-col gap-1 w-full">
                  <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                    Warehouse
                    <LuAsterisk className="text-sm text-[#C62828]" />
                  </label>
                  <input
                    type="text"
                    className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                    placeholder="Enter weight in metrics"
                    name="warehouse"
                    value={formData.warehouse}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                  Status
                  <LuAsterisk className="text-sm text-[#C62828]" />
                </label>
                <select
                  className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="created">Created</option>
                  <option value="billed">Billed</option>
                  <option value="payment pending">Payment Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                  Description
                </label>
                <textarea
                  className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                  placeholder="Enter description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-row gap-5 mt-3">
                <button className="w-fit bg-black text-[1.1rem] rounded-[8px] text-white font-bold text-richblack-900 px-14 py-2 hover:bg-black/80">
                  {/* Uncomment and use loading state if needed */}
                  {/* {loading ? (
                                    <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                                ) : ( */}
                  <span>Submit</span>
                  {/* )} */}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
