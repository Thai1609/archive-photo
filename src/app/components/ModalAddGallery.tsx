import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AddGalleries() {
  const [options, setOptions] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

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

  useEffect(() => {
    // const filtered = options.filter((option) =>
    //   option.toLowerCase().includes(inputValue.toLowerCase())
    // );
    setFilteredOptions(options);
  }, [options, inputValue]); // Dependency on `options` and `inputValue`

  // Handle input change
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setInputValue(e.target.value); // Update search term
  // };

  const handleOptionSelect = (intIdTag: string) => {
    // setInputValue(option);
    setFormData((prevFormData) => ({
      ...prevFormData, // Spread the existing form data
      tag: intIdTag, // Set the title to the selected option
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
    tag: "",
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
      const cookieToken = getCookie("token");

      const response = await axios.post(urlUpload, data, {
        withCredentials: true,

        headers: {
          Authorization: `Bearer ${cookieToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      window.location.reload();
      console.log("Response:", response.data);
      // router.push(`/auth/confirm?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };
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
                      className="w-64 px-4 py-2 text-base rounded-md bg-white border border-gray-400   outline-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="relative w-64">
                <label className="mb-2 text-base block">Tag</label>
                <input
                  id="dropdownToggle"
                  type="text"
                  value={formData.tag}
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
