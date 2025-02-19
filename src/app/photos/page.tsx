"use client";

import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useReducer, useState } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/context/AuthProvider";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  const router = useRouter();

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

  const url = `http://localhost:8080/api/products?page=${page}&size=10`;

  const fetchProductData = async (pageNumber = 0) => {
    try {
      const response = await axios.get(url, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
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
  }, []);

  const handleNextPageByOptions = (id: number) => {
    router.push(`/photos/products/${id}`);
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6">
              <div className="bg-white flex flex-col rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"></div>
              <h2>Danh sách sản phẩm</h2>
              <ul>
                {products.map((product) => (
                  <li key={product.id}>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>Giá: {product.price} VNĐ</p>
                    <p>Giảm giá: {product.discount}%</p>
                    <p>Kho: {product.stock}</p>
                  </li>
                ))}
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
              </ul>

              {/* <div className="col-span-full flex flex-col items-center justify-center text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 mb-4 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m-7 4h8a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p>No items found</p>
                      </div></>)} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
