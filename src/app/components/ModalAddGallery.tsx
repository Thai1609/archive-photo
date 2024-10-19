import axios from "axios";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";

export default function AddGalleries() {
  const [dataTag, setDataTag] = useState([]);
  const [options, setOptions] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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

        setDataTag(response.data.result);
        const tagNames = response.data.result.map(
          (tag: { name: any }) => tag.name
        );
        setOptions(tagNames);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (e.target.files) {
        setSelectedFiles(Array.from(e.target.files)); // Convert FileList to an array
      }

      // Create an image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFiles) {
      alert("Please select a file first!");
      return;
    }

    // Create a form data object to send the file to the server
    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("file", file); // Append the files under "file"
    });

    // POST the form data to your API route
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();
      alert(`File uploaded successfully: ${data.fileUrl}`);
    } catch (error) {
      console.error(error);
      alert("Failed to upload image");
    }
  };
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  const dropdownToggle = document.getElementById("dropdownToggle");
  const dropdownMenu = document.getElementById("dropdownMenu");

  useEffect(() => {
    // const filtered = options.filter((option) =>
    //   option.toLowerCase().includes(inputValue.toLowerCase())
    // );
    setFilteredOptions(options);
  }, [options, inputValue]); // Dependency on `options` and `inputValue`

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // Update search term
  };

  const handleOptionSelect = (option: string) => {
    setInputValue(option);

    if (dropdownToggle && dropdownMenu) {
      dropdownMenu.classList.add("hidden");
      dropdownMenu.classList.remove("block");
    }
  };

  useEffect(() => {
    if (dropdownToggle && dropdownMenu) {
      const handleClick = () => {
        if (dropdownMenu.className.includes("block")) {
          dropdownMenu.classList.add("hidden");
          dropdownMenu.classList.remove("block");
        } else {
          dropdownMenu.classList.add("block");
          dropdownMenu.classList.remove("hidden");
        }
      };

      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownMenu.className.includes("block") &&
          !dropdownMenu.contains(event.target as Node) &&
          !dropdownToggle.contains(event.target as Node)
        ) {
          dropdownMenu.classList.add("hidden");
          dropdownMenu.classList.remove("block");
        }
      };

      dropdownToggle.addEventListener("click", handleClick);
      document.addEventListener("click", handleClickOutside);

      return () => {
        dropdownToggle.removeEventListener("click", handleClick);
        document.removeEventListener("click", handleClickOutside);
      };
    }
  });

  return (
    <div className="font-sans bg-white">
      <div className="p-4 lg:max-w-7xl max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="">
          <div className="grid items-start grid-cols-1 lg:grid-cols-5 gap-12 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] p-6 rounded-lg">
            <div className="lg:col-span-3 w-full lg:sticky top-0 text-center">
              <div className="px-4 py-10 rounded-lg shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative">
                <div className="font-[sans-serif] max-w-md mx-auto">
                  <label className="text-base font-semibold text-gray-600 mb-2 block">
                    Upload files
                  </label>
                  <input
                    onChange={handleFileChange}
                    type="file"
                    multiple
                    accept="image/*"
                    className="  w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-2.5 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-600 rounded"
                  />
                  {/* <div className="mt-5 bg-gray-50 text-gray-600 text-base rounded w-auto h-auto flex flex-col items-center justify-center border-2 border-gray-300 border-dashed">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview as string}
                          alt="Selected Image"
                          style={{
                            width: "auto",
                            height: "auto",
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-12 mb-2 fill-gray-400"
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
                        <p className="text-base font-semibold text-gray-600">
                          Drag &amp; Drop files here
                        </p>
                      </>
                    )}
                  </div> */}
                  <div style={{ marginTop: "20px" }}>
                    {selectedFiles.length > 0 && (
                      <div>
                        <ul>
                          {selectedFiles.map((file, index) => (
                            <li key={index}>
                              {file.name} - {Math.round(file.size / 1024)} KB
                              <img
                                src={URL.createObjectURL(file)} // Create a URL for previewing the image
                                alt={file.name}
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                  margin: "10px",
                                }}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-extrabold text-gray-800">
                Acer Aspire Pro 12 | Laptop
              </h2>
              <div className="flex space-x-2 mt-4">
                <div className="flex flex-col justify-center max-w-lg ml-1  space-y-6 font-[sans-serif] text-[#333]">
                  <div>
                    <label className="mb-2 text-lg block">Large Input</label>
                    <input
                      type="text"
                      placeholder="Large Input"
                      className="px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 text-base block">Medium Input</label>
                    <input
                      type="text"
                      placeholder="Medium Input"
                      className="px-4 py-2 text-base rounded-md bg-white border border-gray-400 w-full outline-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="relative w-64">
                <label className="mb-2 text-base block">Tag</label>
                <input
                  id="dropdownToggle"
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange} // Xử lý khi giá trị input thay đổi
                  readOnly
                  placeholder="Select Tag..."
                  className="px-4 py-2 w-full border border-gray-300 rounded"
                />

                <ul
                  id="dropdownMenu"
                  className=" hidden absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded max-h-60 overflow-auto z-10"
                >
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option, index) => (
                      <li
                        key={index}
                        onClick={() => handleOptionSelect(option)} // Khi nhấn vào một tùy chọn
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      >
                        {option}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500">
                      No options found
                    </li>
                  )}
                  <li className="px-2 mt-6 sticky bottom-2">
                    <button
                      type="button"
                      className="px-6 py-2 rounded w-full text-white text-sm tracking-wider border-none outline-none bg-blue-600 hover:bg-blue-700 active:bg-blue-600"
                    >
                      Add Tag
                    </button>
                  </li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                <button
                  type="submit"
                  className="min-w-[200px] px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
