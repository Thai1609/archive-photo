"use client";
import Navbar from "./components/Navbar";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const url = "http://localhost:8080/api/gallery/get-all"; // Replace with your actual URL

      try {
        const response = await axios.get(url);
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
  }, []);

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <>
      <Navbar></Navbar>

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
  );
}
