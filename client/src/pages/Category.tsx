import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";

// Dummy data simulating categories fetched from the backend
const dummyCategories = [
  { id: "1", name: "Technology" },
  { id: "2", name: "Science" },
  { id: "3", name: "Arts" },
  { id: "4", name: "Business" },
  { id: "5", name: "Education" },
];

const CategoryDropdown: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [categories, setCategories] = useState(dummyCategories);
  const [filteredCategories, setFilteredCategories] = useState(dummyCategories);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  useEffect(() => {
    // Simulate fetching categories from the "backend"
    const fetchCategories = () => {
      setCategories(dummyCategories);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Filter categories based on the input value
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
    // Handle form submission logic here
    console.log("Submitted value:", inputValue);
    // Process the inputValue as needed
  };

  return (
    <div className="relative top-[70px] lg:ml-[7%] p-10">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type a category..."
          className="border p-2 rounded"
        />
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
