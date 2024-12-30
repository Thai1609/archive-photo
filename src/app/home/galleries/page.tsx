"use client";
import AddGalleries from "@/app/components/ModalAddGallery";
import galleryReducer, {
  GALLERY_ACTIONS,
  initialGalleryState,
} from "@/app/reducers/galleryReducer/galleryReducer";

import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useReducer, useState } from "react";

export default function page() {
  const router = useRouter();
  const cookieToken = getCookie("token");

  const urlGalleries = "http://localhost:8080/api/gallery/my-gallery";

  const [user, setUser] = useState(Object);

  //Gallery
  const [stateGallery, dispatchGallery] = useReducer(
    galleryReducer,
    initialGalleryState
  );
  const { galleries, currentPage, pageSize, totalPages } = stateGallery;

  useEffect(() => {
    const userData = localStorage.getItem("user");

    let isMounted = true;
    const fetchData = async () => {
      dispatchGallery({ type: GALLERY_ACTIONS.FETCH_INIT });

      try {
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);

          const response = await axios.get(urlGalleries, {
            headers: {
              Authorization: `Bearer ${cookieToken}`,
            },
            params: {
              userId: parsedUser.id,
              page: currentPage - 1,
              size: pageSize,
            }, // Sử dụng tham số page và size
          });

          const { content, totalPages } = response.data;
          if (isMounted) {
            if (Array.isArray(content)) {
              dispatchGallery({
                type: GALLERY_ACTIONS.FETCH_SUCCESS,
                payload: { galleries: content, totalPages },
              });
            } else {
              console.warn("Unexpected API response format:", response.data);
              dispatchGallery({ type: GALLERY_ACTIONS.FETCH_ERROR });
            }
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
        if (isMounted) {
          dispatchGallery({ type: GALLERY_ACTIONS.FETCH_ERROR });
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false; // Cleanup to prevent state updates after unmounting
    };
  }, [currentPage, pageSize]);

  const urlTags = "http://localhost:8080/api/gallery/tag/get-all";

  //Tag
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(urlTags, {
          headers: {
            Authorization: `Bearer ${cookieToken}`,
          },
          params: { userId: user.id },
        });
        const tags = response.data.result;
        localStorage.setItem("tags", JSON.stringify(tags));
        
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      }
    };

    fetchData();
  }, [user]);
  const handlePrevPage = () => {
    if (currentPage > 1) {
      // currentPage == currentPage - 1;
      dispatchGallery({
        type: GALLERY_ACTIONS.SET_PAGE,
        payload: currentPage - 1,
      });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      // currentPage == currentPage + 1;
      dispatchGallery({
        type: GALLERY_ACTIONS.SET_PAGE,
        payload: currentPage + 1,
      });
    }
  };

  // next page with number
  const handlePageClick = (pageNumber: number) => {
    currentPage == pageNumber;
    dispatchGallery({ type: GALLERY_ACTIONS.SET_PAGE, payload: pageNumber });
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
          <div className="overflow-x-auto font-[sans-serif]">
            <div className="font-sans py-4 mx-auto lg:max-w-6xl md:max-w-4xl max-sm:max-w-md">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-gray-800 inline-block   ">
                  LATEST BLOGS
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {Array.isArray(galleries) && galleries.length > 0 ? (
                  galleries.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleNextPageById(item.id)}
                      className="bg-white flex flex-col rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                    >
                      {/* Image Container */}
                      <div className="relative">
                        <img
                          src={item.urlImage}
                          alt="Product"
                          className="w-full h-36 object-cover rounded-t-lg transition-transform duration-300 hover:scale-105"
                        />
                        {/* Icon Button */}
                        <div className="absolute top-2 right-2 bg-pink-100 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-pink-200 transition duration-300 shadow-md">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20px"
                            className="fill-pink-600 inline-block"
                            viewBox="0 0 64 64"
                          >
                            <path d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z" />
                          </svg>
                        </div>
                      </div>
                      {/* Content Below */}
                      <div className="p-4">
                        <p className="text-gray-700 font-medium truncate">
                          {item.nameImage}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mb-4 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m-7 4h8a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p>No items found</p>
                  </div>
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
