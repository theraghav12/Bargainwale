import React, { useState } from "react";
import CategoryDropdown from "./Category";

const Dashboard = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [states, setStates] = useState([
    // List of states and cities
    {
      name: "Andhra Pradesh",
      cities: ["Visakhapatnam", "Vijayawada", "Guntur"],
    },
    { name: "Assam", cities: ["Guwahati", "Silchar", "Dibrugarh"] },
    { name: "Bihar", cities: ["Patna", "Gaya", "Muzaffarpur"] },
    { name: "Chhattisgarh", cities: ["Raipur", "Bhilai", "Bilaspur"] },
    { name: "Goa", cities: ["Panaji", "Margao", "Vasco da Gama"] },
    { name: "Gujarat", cities: ["Ahmedabad", "Surat", "Vadodara"] },
    { name: "Haryana", cities: ["Chandigarh", "Faridabad", "Gurgaon"] },
    { name: "Himachal Pradesh", cities: ["Shimla", "Dharamshala", "Kullu"] },
    { name: "Jammu and Kashmir", cities: ["Srinagar", "Jammu", "Leh"] },
    { name: "Jharkhand", cities: ["Ranchi", "Jamshedpur", "Dhanbad"] },
    { name: "Karnataka", cities: ["Bengaluru", "Mysuru", "Mangaluru"] },
    { name: "Kerala", cities: ["Thiruvananthapuram", "Kochi", "Kozhikode"] },
    { name: "Madhya Pradesh", cities: ["Bhopal", "Indore", "Jabalpur"] },
    { name: "Maharashtra", cities: ["Mumbai", "Pune", "Nagpur"] },
    { name: "Manipur", cities: ["Imphal", "Thoubal", "Chandel"] },
    { name: "Meghalaya", cities: ["Shillong", "Tura", "Mawsynram"] },
    { name: "Mizoram", cities: ["Aizawl", "Lunglei", "Saiha"] },
    { name: "Nagaland", cities: ["Kohima", "Dimapur", "Mokokchung"] },
    { name: "Odisha", cities: ["Bhubaneswar", "Cuttack", "Rourkela"] },
    { name: "Punjab", cities: ["Chandigarh", "Ludhiana", "Amritsar"] },
    { name: "Rajasthan", cities: ["Jaipur", "Jodhpur", "Udaipur"] },
    { name: "Sikkim", cities: ["Gangtok", "Namchi", "Pelling"] },
    { name: "Tamil Nadu", cities: ["Chennai", "Coimbatore", "Madurai"] },
    { name: "Telangana", cities: ["Hyderabad", "Warangal", "Nizamabad"] },
    { name: "Tripura", cities: ["Agartala", "Dharmanagar", "Khowai"] },
    { name: "Uttarakhand", cities: ["Dehradun", "Haridwar", "Roorkee"] },
    { name: "Uttar Pradesh", cities: ["Lucknow", "Kanpur", "Agra"] },
    { name: "West Bengal", cities: ["Kolkata", "Howrah", "Asansol"] },
  ]);

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(event.target.value);
    setSelectedCity("");
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
  };

  const handleGoTo = () => {
    localStorage.setItem("state", selectedState);
    localStorage.setItem("city", selectedCity);
  };

  return (
    <div className="relative top-[70px] lg:ml-[7%] p-10">
      <h1 className="text-3xl font-bold text-gray-900">Company Name</h1>
      <div className="flex flex-col mt-6">
        <label className="block text-sm font-medium text-gray-700">
          Select State
        </label>
        <select
          value={selectedState}
          onChange={handleStateChange}
          className="mt-1 block w-full pl-3 py-2 text-base border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state.name} value={state.name}>
              {state.name}
            </option>
          ))}
        </select>
      </div>
      {selectedState && (
        <div className="flex flex-col mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Select City
          </label>
          <select
            value={selectedCity}
            onChange={handleCityChange}
            className="mt-1 block w-full pl-3 py-2 text-base border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select City</option>
            {states
              .find((state) => state.name === selectedState)
              ?.cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>
        </div>
      )}
      {
        selectedCity && (
          <CategoryDropdown state={selectedState} city={selectedCity} />
        )
        // : (
        //   <button
        //     onClick={handleGoTo}
        //     className="mt-6 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        //   >
        //     Go To About Page
        //   </button>
        // )
      }
    </div>
  );
};

export default Dashboard;
