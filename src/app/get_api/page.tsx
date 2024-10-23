"use client";
import axios from "axios";
import { getCookie } from "cookies-next";
import React, { useEffect, useReducer, useState } from "react";
import tagReducer, { ACTIONS } from "../reducers/tagReducer";

export default function Tag_API() {
  const initialState = {
    tags: [],
    isLoading: false,
    isError: false,
  };

  const [state, dispatch] = useReducer(tagReducer, initialState);
  const { tags, isLoading, isError } = state;

  const [tagName, setTagName] = useState("");
  const [tagPrice, setTagPrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlGetTag = "http://localhost:8080/api/gallery/tag/get-all";
        const cookieToken = getCookie("token");

        const response = await axios.get(urlGetTag, {
          headers: {
            Authorization: `Bearer ${cookieToken}`,
          },
        });

        console.log("data tag: ", response.data.result.map);

        dispatch({
          type: ACTIONS.FETCH_SUCCESS,
          payload: response.data.result,
        });
      } catch (error) {
        dispatch({ type: ACTIONS.FETCH_ERROR });
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {isError && <p>Error loading tags...</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {Array.isArray(tags) && tags.length > 0 ? (
            tags.map((tag) => (
              <li key={tag.id}>
                {tag.id} {tag.name} - {tag.description}
              </li>
            ))
          ) : (
            <p>No tags available</p>
          )}
        </ul>
      )}
    </div>
  );
}
