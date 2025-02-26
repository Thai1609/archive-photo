"use client";

import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useReducer, useState } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/context/AuthProvider";
import Navbar from "@/components/display-web/Navbar";
import Image from "next/image";
import { useProductFilter } from "@/context/ProductFilterProvider";

export default function HomePage() {
  const router = useRouter();
  const { filters } = useProductFilter(); // Use filters from Context
  const [token, setToken] = useState("");
  const { data: session } = useSession();

  const cookieToken = getCookie("token");

  // ✅ Update token state after session or cookies change
  useEffect(() => {
    if (session?.backendToken) {
      setToken(session.backendToken);
    } else if (cookieToken) {
      setToken(cookieToken);
    }
  }, [session, cookieToken]);

  const [products, setProducts] = useState<any[]>([]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const url = "http://localhost:8080/api/products";
  const fetchProductData = async (pageNumber = 0) => {
    try {
      const response = await axios.get(url, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
        params: { ...filters, pageNumber },
      });
      console.log("Show product: ", response.data);

      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
      setPage(response.data.pageable.pageNumber);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ API:", error);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [filters]);

  const handleNextPageById = (
    category: string,
    subCategory: string,
    id: number
  ) => {
    router.push(`/photos/${category}/${subCategory}/${id}`);
  };

  const { userProfile } = useAuth();
  // const { wishlist, toggleWishlist } = useWishlist(); // Get wishlist state & function

  return (
    <>
      {/* navbar */}
      <Navbar></Navbar>
      {/*content */}
      <div className="bg-inherit font-[sans-serif] pt-[110px] max-w-7xl mx-auto p-4">
        <div className="overflow-x-auto font-[sans-serif]">
          <div className="font-sans py-2 mx-auto lg:max-w-6xl md:max-w-4xl max-sm:max-w-md">
            <div className="p-4 mx-auto lg:max-w-7xl md:max-w-4xl sm:max-w-xl max-sm:max-w-sm">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6 sm:mb-10">
                {filters.breadCrumb}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-xl:gap-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id} // Make sure to add a unique key
                    className="bg-white rounded p-4 cursor-pointer hover:-translate-y-1 transition-all relative"
                  >
                    <div
                      className="mb-4 bg-gray-100 rounded p-2"
                      onClick={() =>
                        handleNextPageById(
                          "filters.categoryId",
                          "filters.name",
                          product.id
                        )
                      }
                    >
                      <Image
                        src={product?.images[0]?.imageUrl}
                        alt={product.name}
                        width={300} // Điều chỉnh kích thước theo nhu cầu
                        height={320}
                        className="aspect-[33/35] w-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="flex gap-2">
                        <h5 className="text-base font-bold text-gray-800">
                          {product.name}
                        </h5>
                      </div>
                      <p className="text-base text-gray-800 font-bold ml-auto">
                        ${product.price}
                      </p>
                      <p className="text-gray-500 text-[13px] mt-2 line-clamp-2 overflow-hidden text-ellipsis min-h-[2.5rem]">
                        {product.description || "No description available."}
                      </p>

                      <div className="flex items-center gap-2 mt-4">
                        <div
                          className="bg-pink-100 hover:bg-pink-200 w-12 h-9 flex items-center justify-center rounded cursor-pointer"
                          title="Wishlist"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16px"
                            className="fill-pink-600 inline-block"
                            viewBox="0 0 64 64"
                          >
                            <path
                              d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
                              data-original="#000000"
                            />
                          </svg>
                        </div>
                        <button
                          type="button"
                          className="text-sm px-2 h-9 font-semibold w-full bg-blue-600 hover:bg-blue-700 text-white tracking-wide ml-auto outline-none border-none rounded"
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <button
                onClick={() => fetchProductData(page - 1)}
                disabled={page === 0}
              >
                Trước
              </button>
              <span>
                Trang {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => fetchProductData(page + 1)}
                disabled={page + 1 >= totalPages}
              >
                Tiếp
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
