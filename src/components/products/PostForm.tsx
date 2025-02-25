"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function PostForm() {
  const [status, setStatus] = useState("used");

  const [dataCategories, setDataCategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any | null>(
    null
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/categories"
        );
        setDataCategories(response.data);
      } catch (error) {
        setError("Không thể tải danh mục");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setCategories(dataCategories.filter((cat) => cat.parentCategory === null));
  }, [dataCategories]);

  useEffect(() => {
    if (selectedCategory) {
      setSubCategories(
        dataCategories.filter(
          (cat) => cat.parentCategory?.id === selectedCategory.id
        )
      );
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory, dataCategories]);

  //upload file
  const [images, setImages] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setImages((prevImages) => [...prevImages, ...selectedFiles]); // Append new images
      if (!coverImage && selectedFiles.length > 0) {
        setCoverImage(selectedFiles[0]); // Set first image as cover if none selected
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    if (images[index] === coverImage) {
      setCoverImage(images.length > 1 ? images[1] : null); // Set next image as cover
    }
  };

  const handleUpload = async () => {
    if (images.length === 0) {
      alert("Vui lòng chọn ít nhất một hình ảnh!");
      return;
    }

    const formData = new FormData();
    images.forEach((image) => {
      formData.append("files", image);
    });

    try {
      const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Tải lên thành công!");
        setImages([]); // Reset after upload
      } else {
        alert("Lỗi khi tải lên!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể tải lên ảnh.");
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Chọn danh mục sản phẩm</h2>

      {/* Parent Category Dropdown */}
      <div className="w-full max-w-sm mb-4">
        <select
          value={selectedCategory?.id || ""}
          onChange={(e) => {
            const selected = categories.find(
              (cat) => cat.id === parseInt(e.target.value, 10)
            );
            setSelectedCategory(selected || null);
          }}
          className="w-full border rounded-lg p-3 bg-white shadow-sm focus:ring focus:ring-blue-300"
        >
          <option value="" disabled>
            -- Chọn danh mục --
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <h2 className="text-xl font-bold mb-4">Chọn chi tiết danh mục</h2>
      <div className="w-full max-w-sm mb-4">
        <select
          value={selectedSubCategory?.id || ""}
          onChange={(e) => {
            const selected = subCategories.find(
              (cat) => cat.id === parseInt(e.target.value, 10)
            );
            setSelectedSubCategory(selected);
          }}
          className="w-full border rounded-lg p-3 bg-white shadow-sm focus:ring focus:ring-blue-300"
        >
          <option value="" disabled>
            -- Chọn chi tiết danh mục --
          </option>
          {subCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <h2 className="text-xl font-bold mt-6 mb-4">
        Hình ảnh và Video sản phẩm
      </h2>

      {/* Upload Area */}
      {images.length == 0 ? (
        <>
          <label
            htmlFor="uploadFile"
            className="bg-white text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto"
          >
            <input
              type="file"
              id="uploadFile"
              accept="image/png, image/jpeg, image/svg+xml, image/webp, image/gif"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-11 mb-2 fill-gray-500"
              viewBox="0 0 32 32"
            >
              <path
                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                data-original="#000000"
              />
              <path
                d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                data-original="#000000"
              />
            </svg>
            Chọn từ 1 đến 5 file
            <p className="text-xs font-medium text-gray-400 mt-2">
              PNG, JPG, SVG, WEBP, and GIF are Allowed.
            </p>
          </label>
        </>
      ) : (
        <>
          <label
            htmlFor="uploadFile"
            className="w-24 h-24 border-dashed border-2 border-orange-400 flex flex-col items-center justify-center cursor-pointer rounded-md"
          >
            <input
              type="file"
              id="uploadFile"
              accept="image/png, image/jpeg, image/svg+xml, image/webp, image/gif"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
            <span className="text-orange-500 text-3xl">+</span>
          </label>

          {/* Image Preview */}
          <div className="mt-4 flex gap-3">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-md border"
                />
                {/* Delete Button */}
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-black text-white text-xs p-1 rounded-full hover:bg-gray-800"
                >
                  ✕
                </button>
                {/* Cover Label */}
                {coverImage === image && (
                  <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white text-xs text-center py-1">
                    Hình bìa
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Product Information */}
      <h3 className="text-lg font-semibold mt-6 mb-2">Thông tin chi tiết</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Tình trạng *</label>
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 border rounded-lg ${
              status === "used" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setStatus("used")}
          >
            Đã sử dụng
          </button>
          <button
            className={`px-4 py-2 border rounded-lg ${
              status === "new" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setStatus("new")}
          >
            Mới
          </button>
        </div>
      </div>

      <input
        className="w-full border rounded-lg p-3 mb-3"
        placeholder="Loại sản phẩm *"
      />
      <input
        className="w-full border rounded-lg p-3 mb-3"
        placeholder="Chất liệu"
      />
      <input
        className="w-full border rounded-lg p-3 mb-3"
        placeholder="Xuất xứ"
      />

      <div className="flex items-center mb-3">
        <input type="checkbox" id="free" className="mr-2" />
        <label htmlFor="free" className="text-sm">
          Tôi muốn cho tặng miễn phí
        </label>
      </div>

      <input
        className="w-full border rounded-lg p-3 mb-3"
        placeholder="Giá bán *"
      />
      <h2 className="text-xl font-bold mb-4">Tiêu đề bài đăng:</h2>
      <input
        className="w-full border rounded-lg p-3 mb-3"
        placeholder="Tiêu đề *"
      />
      <h2 className="text-xl font-bold mb-4">Mô tả chi tiết:</h2>
      <textarea
        id="description"
        placeholder="Mô tả *"
        className="resize-none p-4 bg-white w-full block text-sm border border-gray-300 outline-blue-500 rounded focus:ring-2 focus:ring-blue-400"
        rows={8}
      ></textarea>

      <button className="w-full bg-blue-500 text-white p-3 rounded-lg mt-5">
        Đăng tin
      </button>
    </div>
  );
}
