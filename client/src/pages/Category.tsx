import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { CategoryDropdownProps } from "../utils/types";
import axios from "axios";
import { API } from "../utils/API";

const dummyCategories = [
  { id: "1", name: "Technology" },
  { id: "2", name: "Science" },
  { id: "3", name: "Arts" },
  { id: "4", name: "Business" },
  { id: "5", name: "Education" },
];

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ state, city }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [categories, setCategories] = useState(dummyCategories);
  const [filteredCategories, setFilteredCategories] = useState(dummyCategories);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const fetchWarehouses = async () => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${API}/warehouse`,
        headers: {},
      };

      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchCategories = () => {
      setCategories(dummyCategories);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (inputValue) {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredCategories(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setFilteredCategories([]);
      setShowDropdown(false);
    }
  }, [inputValue, categories]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleCategorySelect = (category: { id: string; name: string }) => {
    setInputValue(category.name);
    setShowDropdown(false);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    let data = JSON.stringify({
      name: inputValue,
      location: {
        city: city,
        state: state,
      },
      organization: "64d22f5a8b3b9f47a3b0e7f1",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${API}/warehouse`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700">
            Select/Create Warehouse
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type warehouse..."
            className="border p-2 rounded mt-2"
          />
        </div>
        {showDropdown && filteredCategories.length > 0 && (
          <ul className="absolute border border-gray-300 bg-white w-[300px] mt-1 rounded shadow-lg z-10">
            {filteredCategories.map((category) => (
              <li
                key={category.id}
                onClick={() => handleCategorySelect(category)}
                className="p-2 cursor-pointer hover:bg-gray-200"
              >
                {category.name}
              </li>
            ))}
          </ul>
        )}
        <button
          type="submit"
          className="mt-2 p-2 bg-blue-500 text-white rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CategoryDropdown;
