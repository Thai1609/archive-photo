"use client";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function DetailImagePage() {
  const params = useParams();
  const { id } = params;
  const [user, setUser] = useState(Object);

  const urlGallery = `http://localhost:8080/api/gallery/${id}`;
  const urlGalleryRelated = `http://localhost:8080/api/gallery/${id}/related`;

  const [dataGallery, setDataGallery] = useState<Image>();
  const [dataGalleryRelated, setDataGalleryRelated] = useState<Image[]>([]);

  const userData = localStorage.getItem("user");

  useEffect(() => {
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse tags from localStorage:", error);
      }
    }
  }, []);

  const cookieToken = getCookie("token");

  const [token, setToken] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.backendToken) {
      setToken(session.backendToken);
    } else if (cookieToken) {
      setToken(cookieToken);
    }
  }, [session, cookieToken]);

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const response = await axios.get(urlGallery, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("Data Galery:", response.data.result);
          setDataGallery(response.data.result);
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu từ API:", error);
        }
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const response = await axios.get(urlGalleryRelated, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { userId: user.id },
          });

          console.log("Data GalleryRelated:", response.data.result);
          setDataGalleryRelated(response.data.result);
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu từ API:", error);
        }
      }
    };
    fetchData();
  }, [user, token]);

  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const imagesPerPage = 4; // Số hình ảnh hiển thị mỗi trang
  const [currentMainImage, setCurrentMainImage] = useState<Image>();

  useEffect(() => {
    if (dataGallery) {
      setCurrentMainImage(dataGallery);
    }
  }, [dataGallery]);

  const handleNext = () => {
    if (currentStartIndex + imagesPerPage < dataGalleryRelated.length) {
      setCurrentStartIndex(currentStartIndex + imagesPerPage);
    }
  };
  const handlePrev = () => {
    if (currentStartIndex - imagesPerPage >= 0) {
      setCurrentStartIndex(currentStartIndex - imagesPerPage);
    }
  };

  const currentImages = dataGalleryRelated.slice(
    currentStartIndex,
    currentStartIndex + imagesPerPage
  );

  const handleImageClick = (index: number) => {
    const clickedImage = currentImages[index];
    setCurrentMainImage(clickedImage);
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      <main className="container mx-auto p-4">
        <div className="container mx-auto p-4">
          {/* Hình ảnh chính */}
          <div className="flex flex-col lg:flex-row lg:space-x-6">
            <div className="lg:w-2/3">
              <div className="mb-6">
                <img
                  src={currentMainImage?.urlImage}
                  alt={currentMainImage?.nameImage}
                  className="w-full h-64 rounded-lg shadow-md"
                />
              </div>
            </div>

            <div className="lg:w-1/3 mt-4 lg:mt-0">
              <h2 className="text-xl font-semibold mb-2 text-white">
                {currentMainImage?.nameImage}
              </h2>
              <p className="text-white"> {currentMainImage?.description}</p>
            </div>
          </div>

          {/* Các hình ảnh liên quan */}
          <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentImages.map((image, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg shadow-sm"
                >
                  <img
                    src={image.urlImage}
                    className="w-full h-32 object-cover transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => handleImageClick(index)}
                  />
                </div>
              ))}
            </div>

            {currentStartIndex > 0 && (
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none transition-colors duration-300"
              >
                &#8592;
              </button>
            )}

            {currentStartIndex + imagesPerPage < dataGalleryRelated.length && (
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none transition-colors duration-300"
              >
                &#8594;
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
