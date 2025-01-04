"use client";
import React, { useState } from "react";

export default function ProfilePage() {
  const mainImage = "https://via.placeholder.com/800x600.png?text=Main+Image";
  const relatedImages = [
    "https://via.placeholder.com/400x300.png?text=Related+1",
    "https://via.placeholder.com/400x300.png?text=Related+2",
    "https://via.placeholder.com/400x300.png?text=Related+3",
    "https://via.placeholder.com/400x300.png?text=Related+4",
    "https://via.placeholder.com/400x300.png?text=Related+5",
    "https://via.placeholder.com/400x300.png?text=Related+6",
    "https://via.placeholder.com/400x300.png?text=Related+7",
    "https://via.placeholder.com/400x300.png?text=Related+8",
  ];

  const altMain = "Hình ảnh chính";
  const altRelated = [
    "Hình ảnh liên quan 1",
    "Hình ảnh liên quan 2",
    "Hình ảnh liên quan 3",
    "Hình ảnh liên quan 4",
    "Hình ảnh liên quan 5",
    "Hình ảnh liên quan 6",
    "Hình ảnh liên quan 7",
    "Hình ảnh liên quan 8",
  ];
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const imagesPerPage = 4; // Số hình ảnh hiển thị mỗi trang
  const [currentMainImage, setCurrentMainImage] = useState(mainImage);
  const [currentAltMain, setCurrentAltMain] = useState(altMain);

  const handleNext = () => {
    if (currentStartIndex + imagesPerPage < relatedImages.length) {
      setCurrentStartIndex(currentStartIndex + imagesPerPage);
    }
  };

  const handlePrev = () => {
    if (currentStartIndex - imagesPerPage >= 0) {
      setCurrentStartIndex(currentStartIndex - imagesPerPage);
    }
  };

  const currentImages = relatedImages.slice(
    currentStartIndex,
    currentStartIndex + imagesPerPage
  );
  const currentAltTexts = altRelated.slice(
    currentStartIndex,
    currentStartIndex + imagesPerPage
  );

  const handleImageClick = (index: number) => {
    const clickedImage = currentImages[index];
    const clickedAlt = currentAltTexts[index];
    setCurrentMainImage(clickedImage);
    setCurrentAltMain(clickedAlt);
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold">Thư Viện Hình Ảnh</h1>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <div className="container mx-auto p-4">
          {/* Hình ảnh chính */}
          <div className="flex flex-col lg:flex-row lg:space-x-6">
            {/* Hình ảnh chính và chi tiết */}
            <div className="lg:w-2/3">
              <div className="mb-6">
                <img
                  src={currentMainImage}
                  alt={currentAltMain}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            </div>

            {/* Chi tiết bên phải hình ảnh chính */}
            <div className="lg:w-1/3 mt-4 lg:mt-0">
              <h2 className="text-xl font-semibold mb-2">Title</h2>
              <p className="text-gray-700"> description</p>
              {/* Bạn có thể thêm các thông tin khác như ngày đăng, tác giả, v.v. */}
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
                    src={image}
                    alt={currentAltTexts[index]}
                    className="w-full h-32 object-cover transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => handleImageClick(index)} // Thay đổi hình ảnh chính khi nhấp
                  />
                </div>
              ))}
            </div>

            {/* Nút Quay Lại */}
            {currentStartIndex > 0 && (
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none transition-colors duration-300"
              >
                &#8592;
              </button>
            )}

            {/* Nút Tiếp Theo */}
            {currentStartIndex + imagesPerPage < relatedImages.length && (
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
