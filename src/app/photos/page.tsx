"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Photos() {
  const [posts, setPosts] = useState([]); // Khởi tạo state để lưu trữ dữ liệu
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái loading
  const [err, setError] = useState(null); // State để quản lý lỗi

  useEffect(() => {
    // Thực hiện yêu cầu API khi component được render
    axios
      .get("http://localhost:8080/api/storage/get-all-files")
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (err) {
    const error = err as any;

    return <div>Error: {error.message}</div>;
  }

  // Hiển thị danh sách các bài viết
  return (
   <></>
  );
}
