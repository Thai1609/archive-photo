import axios from "axios";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import ModalCreateTag from "./ModalCreateTag";

export default function AddGalleries() {
  const [options, setOptions] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [user, setUser] = useState(Object);

  const cookieToken = getCookie("token");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files); // Convert FileList to an array
      setSelectedFiles(fileArray);
      // Create image previews for all selected files
      const previewArray: string[] = [];
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previewArray.push(reader.result as string);

          // Update the image previews state after all files are processed
          if (previewArray.length === fileArray.length) {
            setImagePreviews(previewArray);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const [filteredOptions, setFilteredOptions] = useState(options);

  const dropdownToggle = document.getElementById("dropdownToggle");
  const dropdownMenu = document.getElementById("dropdownMenu");
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // Update search term
  };

  useEffect(() => {
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [options, inputValue]); // Dependency on `options` and `inputValue`

  const userData = localStorage.getItem("user");
  const tags = localStorage.getItem("tags");

  useEffect(() => {
    if (userData && tags) {
      try {
        const parsedTags = JSON.parse(tags);
        const parsedUser = JSON.parse(userData);

        setUser(parsedUser);

        if (Array.isArray(parsedTags)) {
          const tagNames = parsedTags.map((tagItem) => tagItem.name);
          setOptions(tagNames);
        } else {
          console.error("Tags data is not an array:", parsedTags);
        }
      } catch (error) {
        console.error("Failed to parse tags from localStorage:", error);
      }
    }
  }, []);

  const handleOptionSelect = (nameTag: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      nameTag: nameTag,
      userId: user.id,
    }));

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
          handleOptionSelect("");
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

  const [formData, setFormData] = useState({
    nameImage: "",
    nameTag: "",
    userId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFiles) {
      alert("Please select a file first!");
      return;
    }

    const data = new FormData();

    selectedFiles.forEach((file) => {
      data.append("file", file); // Append the files under "file"
    });

    data.append(
      "request",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    ); // append JSON

    data.getAll("file").forEach((file) => console.log("File:", file));
    console.log("Request:", data.get("request"));

    try {
      const urlUpload = "http://localhost:8080/api/gallery/upload-image";

      const response = await axios.post(urlUpload, data, {
        withCredentials: true,

        headers: {
          Authorization: `Bearer ${cookieToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      window.location.reload();
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="font-sans bg-white">
      <div className="pt-20 p-4 lg:max-w-7xl max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="">
          <div className="grid items-start grid-cols-1 lg:grid-cols-5 gap-12 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] p-6 rounded-lg">
            <div className="lg:col-span-3 w-full   top-0 text-center">
              <div className="px-4 py-10 rounded-lg shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]  ">
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

                  <div className="mt-5">
                    {selectedFiles.length > 0 && (
                      <div className="mt-5">
                        <ul className="flex flex-wrap gap-20">
                          {selectedFiles.map((file, index) => (
                            <li
                              key={index}
                              className="flex flex-col items-center text-center"
                            >
                              <div className="mb-2.5">
                                <span>{file.name}</span>
                                <span>{Math.round(file.size / 1024)} KB</span>
                              </div>
                              <img
                                src={URL.createObjectURL(file)} // Create a URL for previewing the image
                                alt={file.name}
                                className="w-24 h-24 object-cover border-r-4 shadow-md mt-2.5"
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
              <div className="flex space-x-2 mt-4">
                <div className="flex flex-col justify-center max-w-lg ml-1  space-y-6 font-[sans-serif] text-[#333]">
                  <div>
                    <label className="mb-2 text-base block">Name Image</label>
                    <input
                      type="text"
                      placeholder="Name Image Input"
                      value={formData.nameImage}
                      onChange={(e) =>
                        setFormData({ ...formData, nameImage: e.target.value })
                      }
                      className="w-64 px-4 py-2 text-base rounded-md bg-white border border-gray-400  outline-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="w-64">
                <label className="mb-2 text-base block">Tag</label>
                <div className="flex items-center space-x-4">
                  <input
                    id="dropdownToggle"
                    type="text"
                    readOnly
                    value={formData.nameTag}
                    placeholder="Select Tag..."
                    className="px-4 py-2 w-full border border-gray-300 rounded"
                  />

                  <ModalCreateTag></ModalCreateTag>
                </div>
                <ul
                  id="dropdownMenu"
                  className="h-64 hidden left-0 right-0 mt-1 bg-white border border-gray-300 rounded max-h-60 overflow-auto z-10"
                >
                  <div>
                    <div className="p-3">
                      <div className="relative">
                        <div className="absolute  inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                          <svg
                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="input-group-search"
                          className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Search tag"
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <ul
                      className="h-48 px-3 pb-3  text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdownSearchButton"
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
                    </ul>
                  </div>
                </ul>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                  defaultValue={""}
                />
              </div>
              <div className="flex items-center">
                <input
                  defaultChecked
                  id="checked-checkbox"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="checked-checkbox"
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Is public
                </label>
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="me-1 -ms-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add new image
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
