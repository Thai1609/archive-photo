import { useState } from "react";

const PriceFilter = ({ onApply }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100); // 100 triệu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleApply = () => {
    onApply({ minPrice, maxPrice });
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative inline-block">
      {/* Nút mở dropdown */}
      <button
        className="bg-orange-500 text-white px-4 py-2 rounded-full flex items-center"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        Đến {maxPrice.toLocaleString()} đ ▼
      </button>

      {/* Dropdown nội dung */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 z-50">
          {/* Thanh trượt giá */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max="100000000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>

          {/* Ô nhập giá */}
          <div className="flex justify-between items-center gap-2">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">Giá tối thiểu</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="border p-2 rounded-md text-center w-32"
              />
            </div>
            <span className="text-lg font-bold">-</span>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">Giá tối đa</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="border p-2 rounded-md text-center w-32"
              />
            </div>
          </div>

          {/* Nút "Xóa lọc" và "Áp dụng" */}
          <div className="flex justify-between mt-4">
            <button
              className="border px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setMinPrice(0);
                setMaxPrice(100000000);
              }}
            >
              Xóa lọc
            </button>
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
              onClick={handleApply}
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceFilter;
