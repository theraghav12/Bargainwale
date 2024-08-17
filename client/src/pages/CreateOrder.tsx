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
      name:"",
      packaging:"",
      type:"",
      staticPrice:0,
      quantity:0,
      weight:0
    },
    companyBargainNo: "",
    sellerLocation: {
      state: "",
      city: "",
    },
    transportLocation:"",
    transportType:"",
    status: "created",
    description: "", 
    warehouse: warehouse,
    organization: "66ad2166736b9916dd42c23a",
  });
console.log(formData)
  const dispatch: AppThunkDispatch = useDispatch();

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
  
    setFormData((prevData) => {
      if (name === "state" || name === "city") {
        return {
          ...prevData,
          sellerLocation: {
            ...prevData.sellerLocation,
            [name]: value,
          },
        };
      }
  
      if (name === "name" || name === "packaging" || name === "type" || name === "staticPrice" || name === "quantity" || name === "weight") {
        return {
          ...prevData,
          item: {
            ...prevData.item,
            [name]: value,
          },
        };
      }

      return {
        ...prevData,
        [name]: value,
      };
    });
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
  console.log(config);
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        dispatch(fetchData({ id: "66ad2166736b9916dd42c23a" }));
        setFormData({
          companyBargainDate: "",
          item: {
            name:"",
            packaging:"",
            type:"",
            staticPrice:0,
            quantity:0,
            weight:0
          },
          companyBargainNo: "",
          sellerLocation: {
            state: "",
            city: "",
          },
          transportLocation:"",
          transportType:"",
          status: "created",
          description: "", 
          warehouse: warehouse,
          organization: "66ad2166736b9916dd42c23a",
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
                    name="state"
                    value={formData.sellerLocation.state}
                    onChange={handleChange}
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
                    name="city"
                    value={formData.sellerLocation.city}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="flex flex-row gap-4 mt-2">
                <div className="flex flex-col gap-1 w-1/2">
                  <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                    Item Name
                    <LuAsterisk className="text-sm text-[#C62828]" />
                  </label>
                  <input
                    type="string"
                    className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                    placeholder="Enter Item Name"
                    name="name"
                    value={formData.item.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                  <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                    Item Type
                    <LuAsterisk className="text-sm text-[#C62828]" />
                  </label>
                  <input
                    type="string"
                    className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                    placeholder="Enter item type"
                    name="type"
                    value={formData.item.type}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex flex-row gap-4 mt-2">
                <div className="flex flex-col gap-1 w-1/2">
                  <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                    Item Packaging
                    <LuAsterisk className="text-sm text-[#C62828]" />
                  </label>
                  <input
                    type="string"
                    className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                    placeholder="Enter item packaging"
                    name="packaging"
                    value={formData.item.packaging}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                  <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                    Item Weight
                    <LuAsterisk className="text-sm text-[#C62828]" />
                  </label>
                  <input
                    type="number"
                    className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                    placeholder="Enter item weight"
                    name="weight"
                    value={formData.item.weight}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex flex-row gap-4 mt-2">
                <div className="flex flex-col gap-1 w-1/2">
                  <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                    Item Static Price
                    <LuAsterisk className="text-sm text-[#C62828]" />
                  </label>
                  <input
                    type="number"
                    className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                    placeholder="Enter static price"
                    name="staticPrice"
                    value={formData.item.staticPrice}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                  <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                    Item Quantity
                    <LuAsterisk className="text-sm text-[#C62828]" />
                  </label>
                  <input
                    type="number"
                    className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                    placeholder="Enter quantity"
                    name="quantity"
                    value={formData.item.quantity}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex flex-row gap-4 mt-2">
                <div className="flex flex-col gap-1 w-full">
                  <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                    Weight in Metrics
                    {/* <LuAsterisk className="text-sm text-[#C62828]" /> */}
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
                    Transport Location
                    <LuAsterisk className="text-sm text-[#C62828]" />
                  </label>
                  <input
                    type="string"
                    className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                    placeholder="Enter transport location"
                    name="transportLocation"
                    value={formData.transportLocation}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex flex-row gap-4 mt-2">
                <div className="flex flex-col gap-1 w-full">
                  <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                    Transport Type
                    <LuAsterisk className="text-sm text-[#C62828]" />
                  </label>
                  <input
                    type="string"
                    className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                    placeholder="Enter transport type"
                    name="transportType"
                    value={formData.transportType}
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
