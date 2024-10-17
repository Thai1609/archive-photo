"use client";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function page() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const limit = 10; // Số lượng bản ghi trên mỗi trang
  const router = useRouter();
  useEffect(() => {
    const cookieToken = getCookie("token");
    if (cookieToken) {
      const url = "http://localhost:8080/api/gallery/get-all";

      const fetchData = async (page: number) => {
        try {
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${cookieToken}`,
            },
          });
          console.log("API Response:", response.data); // Log the data structure

          setData(
            Array.isArray(response.data.result)
              ? response.data.result
              : response.data || []
          );
          // Set the response data to state
        } catch (error) {
          console.error("Error:", error);
        }
      };

      fetchData(page);
    }
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  // href={`/products/${product.id}`}
  const handleNextPageById = (index) => {
    router.push(`/home/galleries/${index}`);
  };

  return (
    <>
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
    </>
  );
}
