import { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuAsterisk } from "react-icons/lu";

interface OrderFormData {
  companyBargainDate: Date | null;
  item: {
    type: "oil" | "box" | "tin";
    category?: "box" | "tin";
    oilType?: "palmOil" | "vanaspatiOil" | "soybeanOil";
  };
  companyBargainNo: string;
  location: {
    state: string;
    city: string;
  };
  staticPrice: number;
  quantity: number;
  weightInMetrics: number;
  convertedWeightInGm: number;
  status: "created" | "billed" | "payment pending" | "completed";
  description?: string;
  createdAt: Date;
  billedAt?: Date;
  organization: string;
}

const Orders = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState<OrderFormData>({
    companyBargainDate: null,
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
    convertedWeightInGm: 0,
    status: "created",
    description: "",
    createdAt: new Date(),
    billedAt: undefined,
    organization: "",
  });

  const handleChange = (
    // e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    // const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      // [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic
    console.log(formData);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative top-[70px] lg:left-[7%] p-10">
        <h1 className="text-start">Orders</h1>
        <div className="w-full flex flex-col sm:flex-row gap-10">
          <div className="w-[280px] flex flex-col justify-between p-6 rounded-lg shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Place Your Order</h2>
              <p className="mb-6">Get started with a new order</p>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              type="submit"
              className="w-full bg-black text-white p-2 rounded-lg hover:bg-black/80"
            >
              Create An Order
            </button>
          </div>
          <div className="w-[280px] flex flex-col justify-between p-6 rounded-lg shadow-md">
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
          </div>
        </div>
      </div>

      {/* Create order form */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50`}
        >
          <div
            className={`p-4 w-full sm:w-fit overflow-y-auto hideScroller h-full`}
          >
            <div className="w-full relative bg-white rounded-lg shadow">
              <div className="flex flex-row items-center justify-between gap-8 border-b-2 px-10 py-4">
                <div className="flex flex-col">
                  <h1 className="text-[1.5rem] font-[500]">Create Order</h1>
                </div>
                <IoIosCloseCircleOutline
                  onClick={() => setIsOpen(false)}
                  className="text-[1.7rem] hover:cursor-pointer"
                />
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
                    <div className="flex flex-col gap-1 w-1/2">
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
                    <div className="flex flex-col gap-1 w-1/2">
                      <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                        Converted Weight in GM
                        <LuAsterisk className="text-sm text-[#C62828]" />
                      </label>
                      <input
                        type="number"
                        className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                        placeholder="Enter converted weight in grams"
                        name="convertedWeightInGm"
                        value={formData.convertedWeightInGm}
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
                      // onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-row gap-5 mt-3">
                    <button
                      type="button"
                      className="w-[50%] text-[1.1rem] rounded-[8px] border-2 font-bold text-richblack-900 px-[0.8rem] py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-[50%] bg-black text-[1.1rem] rounded-[8px] text-white font-bold text-richblack-900 px-[0.8rem] py-2 hover:bg-black/80"
                    >
                      {/* Uncomment and use loading state if needed */}
                      {/* {loading ? (
                                    <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                                ) : ( */}
                      <span>Save</span>
                      {/* )} */}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;
