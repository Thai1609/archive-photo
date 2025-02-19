import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useCategory } from "@/context/CategoryContext";

export default function Navbar() {
  const { category, setCategory } = useCategory();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSelect = (
    categorySelect: any,
    parentCategorySelect: any,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // Ngăn sự kiện lan truyền lên parent

    console.log(
      "categorySelect: ",
      categorySelect,
      "parentCategorySelect: ",
      parentCategorySelect
    );
    setCategory(categorySelect);
    setIsDropdownOpen(false); // Close dropdown when an option is clicked
    setOpenSubMenu(null);
  };

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const url = "http://localhost:8080/api/categories";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(url);
        setCategories(response.data);
        console.log("API Response:", response.data);
      } catch (error) {
        setError("Không thể tải danh mục");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // Chạy một lần khi component mount
  if (loading) return <p>Đang tải danh mục...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className="fixed top-[75px] left-0 bg-white w-full min-h-[50px] z-40">
      <div
        className="relative font-[sans-serif] w-max mx-auto p-2 float-left"
        ref={dropdownRef}
      >
        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="px-5 py-2.5 border border-gray-300 text-gray-800 text-sm outline-none bg-white hover:bg-gray-50 flex items-center"
        >
          Danh mục
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-3 fill-gray-500 inline ml-3 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
              clipRule="evenodd"
              data-original="#000000"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <ul className="absolute mt-1 shadow-lg bg-white py-2 z-[1000] min-w-[220px]  ">
            {categories
              .filter((category) => category.parentCategory === null) // Show only parent categories
              .map((category) => (
                <li
                  key={category.id}
                  className=" py-2 px-2 hover:bg-gray-50 text-gray-800 text-sm cursor-pointer h-full"
                  onMouseEnter={() => setOpenSubMenu(category.name)}
                  onMouseLeave={() => setOpenSubMenu(null)}
                  onClick={(event) => handleSelect(category.id, null, event)}
                >
                  {category.name}

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 fill-gray-500 inline transition-transform -rotate-90 float-right"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
                      clipRule="evenodd"
                      data-original="#000000"
                    />
                  </svg>

                  {openSubMenu === category.name && (
                    <ul
                      ref={submenuRef}
                      className="absolute left-full top-0 bg-white shadow-lg min-w-[400px] h-full p-2 "
                    >
                      {categories
                        .filter((sub) => sub.parentCategory?.id === category.id) // Show subcategories
                        .map((sub) => (
                          <li
                            key={sub.id}
                            className="py-2 px-4 hover:bg-gray-50 text-gray-800 text-sm cursor-pointer"
                            onClick={(event) =>
                              handleSelect(category.id, sub.id, event)
                            }
                          >
                            {sub.name}
                          </li>
                        ))}
                    </ul>
                  )}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
