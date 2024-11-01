"use client";
import AddGalleries from "@/app/components/ModalAddGallery";
import galleryReducer, { ACTIONS } from "@/app/reducers/galleryReducer";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useReducer, useState } from "react";

const initialState = {
  galleries: [],
  currentPage: 1,
  pageSize: 4,
  totalPages: 1,
  isLoading: false,
  isError: false,
};

export default function page() {
  const router = useRouter();

  // const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  // const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  // const pageSize = 4; // Số bản ghi trên mỗi trang

  const url = "http://localhost:8080/api/gallery/my-gallery";

  const [state, dispatch] = useReducer(galleryReducer, initialState);
  const { galleries, currentPage, pageSize, totalPages, isLoading, isError } =
    state;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: ACTIONS.FETCH_INIT });

      try {
        const cookieToken = getCookie("token");

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${cookieToken}`,
          },
          params: { userId: 1, page: currentPage - 1, size: pageSize }, // Sử dụng tham số page và size
        });

        // setData(response.data.content);
        // setTotalPages(response.data.totalPages); // Cập nhật totalPages từ API
        const { content, totalPages } = response.data;
        dispatch({
          type: ACTIONS.FETCH_SUCCESS,
          payload: { galleries: content, totalPages },
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
        dispatch({ type: ACTIONS.FETCH_ERROR });
      }
    };

    fetchData();
  }, [currentPage, pageSize]);

  console.log("data: ", galleries);
  console.log("totalPages: ", totalPages);
  // Hàm chuyển đến trang trước
  const handlePrevPage = () => {
    if (currentPage > 1) {
      // currentPage == currentPage - 1;
      dispatch({ type: ACTIONS.SET_PAGE, payload: currentPage - 1 });
    }
  };

  // Hàm chuyển đến trang kế tiếp
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      // currentPage == currentPage + 1;
      dispatch({ type: ACTIONS.SET_PAGE, payload: currentPage + 1 });
    }
  };

  // Hàm chuyển đến trang bất kỳ
  const handlePageClick = (pageNumber: number) => {
    currentPage == pageNumber;
    dispatch({ type: ACTIONS.SET_PAGE, payload: pageNumber });
  };

  // href={`/products/${product.id}`}
  const handleNextPageById = (index: number) => {
    router.push(`/home/galleries/${index}`);
  };

  return (
    <>
      <AddGalleries></AddGalleries>
      <div className="bg-white font-[sans-serif] my-4">
        <div className="max-w-6xl mx-auto">
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-16 max-lg:max-w-3xl max-md:max-w-md mx-auto">
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
                      {item.nameImage}
                    </h3>
                  </div>
                </div>
              ))
            ) : (
              <></>
            )}
          </div> */}

          <div className="overflow-x-auto font-[sans-serif]">
            <div className="font-sans py-4 mx-auto lg:max-w-6xl md:max-w-4xl max-sm:max-w-md">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-gray-800 inline-block relative after:absolute after:w-4/6 after:h-1 after:left-0 after:right-0 after:-bottom-4 after:mx-auto after:bg-pink-400 after:rounded-full">
                  LATEST BLOGS
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 gap-12">
                {Array.isArray(galleries) && galleries.length > 0 ? (
                  galleries.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleNextPageById(item.id)}
                      className="bg-gray-100 p-3 rounded-lg group overflow-hidden cursor-pointer relative z-50 hover:before:bg-black before:absolute before:inset-0 before:opacity-20 before:transition-all"
                    >
                      <div className="w-full h-[300px] overflow-hidden mx-auto aspect-w-16 aspect-h-8">
                        <img
                          src={item.urlImage}
                          alt="product1"
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="absolute mx-auto left-0 right-0 -bottom-80 group-hover:bottom-2 bg-white w-11/12 p-3 rounded-lg transition-all duration-300">
                        <div className="text-center">
                          <h3 className="text-base font-bold text-gray-800">
                            {item.nameImage}
                          </h3>
                          <h4 className="text-lg text-blue-600 font-bold mt-2">
                            $35.00
                          </h4>
                        </div>
                        <div className="flex justify-center space-x-1 mt-4">
                          <svg
                            className="w-4 fill-[#facc15]"
                            viewBox="0 0 14 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                          </svg>
                          <svg
                            className="w-4 fill-[#facc15]"
                            viewBox="0 0 14 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                          </svg>
                          <svg
                            className="w-4 fill-[#facc15]"
                            viewBox="0 0 14 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                          </svg>
                          <svg
                            className="w-4 fill-[#facc15]"
                            viewBox="0 0 14 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                          </svg>
                          <svg
                            className="w-4 fill-[#CED5D8]"
                            viewBox="0 0 14 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </div>
            </div>

            <div className="md:flex m-4">
              {/* <p className="text-sm text-gray-500 flex-1">
               </p> */}
              <div className="  items-center max-md:mt-4">
                <ul className="flex space-x-1 ml-4">
                  <li
                    onClick={handlePrevPage}
                    className={`flex items-center justify-center cursor-pointer bg-gray-200 w-8 h-8 rounded ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 fill-gray-500"
                      viewBox="0 0 55.753 55.753"
                    >
                      <path
                        d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
                        data-original="#000000"
                      />
                    </svg>
                  </li>

                  {[...Array(totalPages)].map((_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <li
                        key={pageNumber}
                        onClick={() => handlePageClick(pageNumber)}
                        className={`flex items-center justify-center cursor-pointer text-sm w-8 h-8 rounded ${
                          currentPage === pageNumber
                            ? "bg-blue-500 text-white border-2 border-blue-500"
                            : "hover:bg-gray-50 border-2 text-[#333]"
                        }`}
                      >
                        {pageNumber}
                      </li>
                    );
                  })}

                  <li
                    onClick={handleNextPage}
                    className={`flex items-center justify-center cursor-pointer bg-gray-200 w-8 h-8 rounded ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 fill-gray-500 rotate-180"
                      viewBox="0 0 55.753 55.753"
                    >
                      <path
                        d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
                        data-original="#000000"
                      />
                    </svg>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
