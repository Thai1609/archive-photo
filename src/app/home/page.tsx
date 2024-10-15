"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { getCookie } from "cookies-next";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
 

export default function Photos() {
  const [data, setData] = useState([]);
 

  useEffect(() => {
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
          console.error("Error:", error);
        }
      };

      fetchData();
    } 
  }, []);

  return (
    <>
      {/* <Navbar></Navbar> */}
      <Header></Header>
      {/* <div className="mt-56 grid grid-cols-2 md:grid-cols-3 gap-4 mb-2">
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
      </div> */}
    </>
  );
}
