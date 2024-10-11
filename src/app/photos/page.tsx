"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getCookie } from "cookies-next";

export default function Photos() {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const userProfile = useSelector((state: RootState) => state.userProfile);

  useEffect(() => {
    // Kiểm tra nếu là client-side
    if (typeof window !== "undefined") {
      setLoaded(true); // Đảm bảo chỉ hiển thị dữ liệu sau khi render client-side
    }
  }, []);

  useEffect(() => {
    console.log("data: ", userProfile);
    const cookieToken = getCookie("token");

    if (cookieToken) {
      const url = "http://localhost:8080/api/gallery/get-all";

      const fetchData = async () => {
        try {
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${cookieToken}`,
            },
          });
          console.log("API Response:", response.data); // Log the data structure
          console.log("Length Response:", response.data.result.length); // Log the data structure

          setData(
            Array.isArray(response.data.result)
              ? response.data.result
              : response.data || []
          );
          // Set the response data to state
        } catch (error) {
          setError("Error fetching data");
          console.error("Error:", error);
        }
      };

      fetchData();
    }
  }, []);

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <>
      {/* <Navbar></Navbar> */}
      <div>
        {loaded ? (
          <>
            <Header></Header>

            <div className="mt-56 grid grid-cols-2 md:grid-cols-3 gap-4 mb-2">
              {Array.isArray(data) && data.length > 0 ? (
                data.map((item, index) => (
                  <div key={index}>
                    <img
                      className="h-auto max-w-full rounded-lg"
                      src={item.urlImage}
                      alt={`Image ${index}`}
                    />
                  </div>
                ))
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
