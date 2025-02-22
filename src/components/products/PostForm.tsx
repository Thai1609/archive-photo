"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function PostForm() {
  const [status, setStatus] = useState("used");

  const [dataCategories, setDataCategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any | null>(
    null
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/categories"
        );
        setDataCategories(response.data);
      } catch (error) {
        setError("Không thể tải danh mục");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setCategories(dataCategories.filter((cat) => cat.parentCategory === null));
  }, [dataCategories]);

  useEffect(() => {
    if (selectedCategory) {
      setSubCategories(
        dataCategories.filter(
          (cat) => cat.parentCategory?.id === selectedCategory.id
        )
      );
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory, dataCategories]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Chọn danh mục sản phẩm</h2>

      {/* Parent Category Dropdown */}
      <div className="w-full max-w-sm mb-4">
        <select
          value={selectedCategory?.id || ""}
          onChange={(e) => {
            const selected = categories.find(
              (cat) => cat.id === parseInt(e.target.value, 10)
            );
            setSelectedCategory(selected || null);
          }}
          className="w-full border rounded-lg p-3 bg-white shadow-sm focus:ring focus:ring-blue-300"
        >
          <option value="" disabled>
            -- Chọn danh mục --
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <h2 className="text-xl font-bold mb-4">Chọn chi tiết danh mục</h2>
      <div className="w-full max-w-sm mb-4">
        <select
          value={selectedSubCategory?.id || ""}
          onChange={(e) => {
            const selected = subCategories.find(
              (cat) => cat.id === parseInt(e.target.value, 10)
            );
            setSelectedSubCategory(selected);
          }}
          className="w-full border rounded-lg p-3 bg-white shadow-sm focus:ring focus:ring-blue-300"
        >
          <option value="" disabled>
            -- Chọn chi tiết danh mục --
          </option>
          {subCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <h2 className="text-xl font-bold mt-6 mb-4">
        Hình ảnh và Video sản phẩm
      </h2>

      {/* Upload Image */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border-dashed border-2 p-6 flex flex-col items-center justify-center rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 mb-2 fill-gray-400"
            viewBox="0 0 32 32"
          >
            <path
              d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
              data-original="#000000"
            />
            <path
              d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
              data-original="#000000"
            />
          </svg>
          <p className="text-base font-semibold text-gray-600">
            <span className="text-gray-500">📷 Đăng từ 01 đến 05 hình</span>
          </p>
        </div>
      </div>

      {/* Product Information */}
      <h3 className="text-lg font-semibold mt-6 mb-2">Thông tin chi tiết</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Tình trạng *</label>
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 border rounded-lg ${
              status === "used" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setStatus("used")}
          >
            Đã sử dụng
          </button>
          <button
            className={`px-4 py-2 border rounded-lg ${
              status === "new" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setStatus("new")}
          >
            Mới
          </button>
        </div>
      </div>

      <input
        className="w-full border rounded-lg p-3 mb-3"
        placeholder="Loại sản phẩm *"
      />
      <input
        className="w-full border rounded-lg p-3 mb-3"
        placeholder="Chất liệu"
      />
      <input
        className="w-full border rounded-lg p-3 mb-3"
        placeholder="Xuất xứ"
      />

      <div className="flex items-center mb-3">
        <input type="checkbox" id="free" className="mr-2" />
        <label htmlFor="free" className="text-sm">
          Tôi muốn cho tặng miễn phí
        </label>
      </div>

      <input
        className="w-full border rounded-lg p-3 mb-3"
        placeholder="Giá bán *"
      />

      <button className="w-full bg-blue-500 text-white p-3 rounded-lg">
        Đăng tin
      </button>
    </div>
  );
}
