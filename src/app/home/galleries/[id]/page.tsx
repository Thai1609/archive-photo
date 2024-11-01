"use client";
import axios from "axios";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";

export default function Page({ params }) {
  const { id } = params;
  const url = `http://localhost:8080/api/gallery/${id}`;
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [isMyImage, setIsMyImage] = useState(false);
  useEffect(() => {
    // Retrieve user data from localStorage
    const userData = localStorage.getItem("user");

    if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchData = async () => {
      try {
        const cookieToken = getCookie("token");

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${cookieToken}`,
          },
        });

        setData(response.data.result);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (user && data) {
      if (user.id === data.user_id) setIsMyImage(true);
      console.error("Data", data);
    }
  }, [user, data]);

  // const checkMyImage = user.id === data.user.id ? true : false;

  return (
    <div className="font-sans bg-white">
      <div className="p-4 lg:max-w-8xl max-w-8xl mx-auto">
        {data ? (
          <>
            <div className="font-sans">
              <div className="p-4 lg:max-w-7xl max-w-5xl max-lg:mx-auto">
                <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-8 max-lg:gap-17">
                  <div className="w-full top-0 text-center">
                    <div className="lg:h-[500px]">
                      <img
                        src={data.urlImage}
                        alt=""
                        className="lg:w-11/12 w-full h-full rounded-md object-cover object-top"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-start gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          {data.nameImage}
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                          {data.nameTag}
                        </p>
                      </div>
                      <div className="ml-auto flex flex-wrap gap-4">
                        <button
                          type="button"
                          className="px-2.5 py-1.5 bg-pink-100 text-xs text-pink-600 rounded-md flex items-center"
                        >
                          <svg
                            className="w-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 14 13"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                          </svg>
                          4.8
                        </button>
                        <button
                          type="button"
                          className="px-2.5 py-1.5 bg-pink-100 text-xs text-pink-600 rounded-md flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12px"
                            fill="currentColor"
                            className="mr-1"
                            viewBox="0 0 64 64"
                          >
                            <path
                              d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
                              data-original="#000000"
                            />
                          </svg>
                          100
                        </button>
                      </div>

                      <ul className="space-y-3 list-disc mt-6 pl-4 text-sm text-gray-500">
                        <li>
                          A gray t-shirt is a wardrobe essential because it is
                          so versatile.
                        </li>
                        <li>
                          Available in a wide range of sizes, from extra small
                          to extra large, and even in tall and petite sizes.
                        </li>
                        <li>
                          This is easy to care for. They can usually be
                          machine-washed and dried on low heat.
                        </li>
                        <li>
                          You can add your own designs, paintings, or embroidery
                          to make it your own.
                        </li>
                      </ul>
                    </div>
                    <div className=" mt-8">
                      <h3 className="text-xl font-bold text-gray-800">
                        Description
                      </h3>
                      <p className="text-sm text-gray-500 mt-4">
                        {data.description}
                      </p>
                    </div>
                    {isMyImage ? (
                      <div className="flex flex-wrap gap-4 mt-8">
                        <button
                          type="button"
                          className="min-w-[200px] px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 fill-current mr-2"
                            viewBox="0 0 24 24"
                          >
                            <g fillRule="evenodd" clipRule="evenodd">
                              <path
                                d="M7 4a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-6a1 1 0 1 1 2 0v6a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5h6a1 1 0 1 1 0 2z"
                                data-original="#000000"
                              />
                              <path
                                d="M19.197 4a.803.803 0 0 0-.567.235l-7.877 7.877-.379 1.514 1.514-.379 7.877-7.877A.803.803 0 0 0 19.197 4zm-1.981-1.18a2.802 2.802 0 1 1 3.963 3.964l-8.073 8.073a1 1 0 0 1-.464.263l-3.4.85a1 1 0 0 1-1.212-1.213l.85-3.399a1 1 0 0 1 .263-.464z"
                                data-original="#000000"
                              />
                              <path
                                d="M15.293 5.293a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1-1.414 1.414l-2-2a1 1 0 0 1 0-1.414z"
                                data-original="#000000"
                              />
                            </g>
                          </svg>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="min-w-[200px] px-4 py-2.5 border border-blue-600 bg-transparent hover:bg-gray-50 text-gray-800 text-sm font-semibold rounded"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 fill-red-500 hover:fill-red-700"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                              data-original="#000000"
                            />
                            <path
                              d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                              data-original="#000000"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
