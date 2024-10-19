"use client";
import AddGalleries from "@/app/components/ModalAddGallery";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function page() {
  const [data, setData] = useState([]);
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const pageSize = 6; // Số bản ghi trên mỗi trang

  const url = "http://localhost:8080/api/gallery/get-all";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cookieToken = getCookie("token");

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${cookieToken}`,
          },
          params: { page: currentPage - 1, size: pageSize }, // Sử dụng tham số page và size đúng
        });

        setData(response.data.content);
        setTotalPages(response.data.totalPages); // Cập nhật totalPages từ API
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      }
    };
    fetchData();
  }, [currentPage]);

  // Hàm chuyển đến trang trước
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Hàm chuyển đến trang kế tiếp
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Hàm chuyển đến trang bất kỳ
  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // href={`/products/${product.id}`}
  const handleNextPageById = (index) => {
    router.push(`/home/galleries/${index}`);
  };

  return (
    <>
      <AddGalleries></AddGalleries>
      <div className="bg-white font-[sans-serif] my-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-800 inline-block relative after:absolute after:w-4/6 after:h-1 after:left-0 after:right-0 after:-bottom-4 after:mx-auto after:bg-pink-400 after:rounded-full">
              LATEST BLOGS
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-16 max-lg:max-w-3xl max-md:max-w-md mx-auto">
            {Array.isArray(data) && data.length > 0 ? (
              data.map((item, index) => (
                <div
                  key={index}
                  className="bg-white cursor-pointer rounded overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative top-0 hover:-top-2 transition-all duration-300"
                  onClick={() => handleNextPageById(item.id)}
                >
                  <img
                    src={item.urlImage}
                    alt="Blog Post 1"
                    className="w-full h-60 object-cover"
                  />
                  <div className="p-6">
                    <span className="text-sm block text-gray-400 mb-2">
                      10 FEB 2023 | BY JOHN DOE
                    </span>
                    <h3 className="text-xl font-bold text-gray-800">
                      A Guide to Igniting Your Imagination
                    </h3>
                    <hr className="my-4" />
                    <p className="text-gray-400 text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Duis accumsan, nunc et tempus blandit, metus mi
                      consectetur felis turpis vitae ligula.
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      <ul className="flex space-x-4 justify-center mt-4">
        {/* Nút quay lại trang trước */}
        <li
          onClick={handlePrevPage}
          className={`flex items-center justify-center shrink-0 bg-gray-300 w-10 h-10 rounded-lg cursor-pointer ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 fill-gray-400"
            viewBox="0 0 55.753 55.753"
          >
            <path
              d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
              data-original="#000000"
            />
          </svg>
        </li>

        {/* Hiển thị số trang */}
        {[...Array(totalPages)].map((_, i) => {
          const pageNumber = i + 1;
          return (
            <li
              key={pageNumber}
              onClick={() => handlePageClick(pageNumber)}
              className={`flex items-center justify-center shrink-0 w-10 h-10 rounded-lg cursor-pointer text-base font-bold ${
                currentPage === pageNumber
                  ? "bg-blue-500 text-white border-2 border-blue-500"
                  : "hover:bg-gray-50 border-2 text-[#333]"
              }`}
            >
              {pageNumber}
            </li>
          );
        })}

        {/* Nút đến trang kế tiếp */}
        <li
          onClick={handleNextPage}
          className={`flex items-center justify-center shrink-0 bg-gray-300 w-10 h-10 rounded-lg cursor-pointer ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 fill-gray-400 rotate-180"
            viewBox="0 0 55.753 55.753"
          >
            <path
              d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
              data-original="#000000"
            />
          </svg>
        </li>
      </ul>
    </>
  );
}
