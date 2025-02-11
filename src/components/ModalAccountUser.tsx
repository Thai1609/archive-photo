import React, { useEffect, useState } from "react";

export default function ModalAccountUserPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [image, setImage] = useState("");
  const [user, setUser] = useState(Object);
  const [arrCountry, setArrCountry] = useState(["+1", "+83", "+51", "+91"]);
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");

  const userData = localStorage.getItem("user");
  useEffect(() => {
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        const phone = parsedUser.phoneNumber;

        if (phone) {
          const code = phone.split(" ");

          setCountryCode(code ? code[0] : ""); // Set the country code
          setPhoneNumber(code ? code[1] : ""); // Set the phone number
        }
      } catch (error) {
        console.error("Failed to parse tags from localStorage:", error);
      }
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") {
          setImage(result); // Update the image state with the new file URL (only if it's a string)
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const selectCountryCode = (code: string) => {
    setCountryCode(code);
    setIsDropdownOpen(false);
  };

  return (
    <div className="max-w-2xl bg-white rounded-lg p-8 ">
      <h2 className="text-2xl font-semibold text-left mb-6">View Account</h2>

      <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-4 md:space-y-0">
        {user.avatarUrl ? (
          <img
            src={image}
            alt="Avatar"
            className="w-24 h-24 rounded-full shadow-md object-cover"
          />
        ) : (
          <img
            src="https://readymadeui.com/profile_2.webp"
            alt="Avatar"
            className="w-24 h-24 rounded-full shadow-md object-cover"
          />
        )}

        <div className="flex flex-col space-y-4">
          <label
            htmlFor="uploadFile"
            className="flex items-center justify-center px-4 py-2 bg-white text-blue-500 border border-blue-500 rounded hover:bg-blue-500 hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Change
            <input
              onChange={handleFileChange}
              type="file"
              id="uploadFile"
              className="hidden"
            />
          </label>

          <button
            aria-label="Remove Profile Picture"
            className="flex items-center justify-center px-4 py-2 bg-white text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {/* SVG Icon */}
            Remove
          </button>
        </div>
        <div>
          <textarea
            id="description"
            placeholder="Description"
            defaultValue={user.description}
            className="resize-none p-4 bg-white w-[360px] block text-sm border border-gray-300 outline-blue-500 rounded focus:ring-2 focus:ring-blue-400"
            rows={4}
          ></textarea>
        </div>
      </div>

      <div className="flex flex-col mt-10 justify-center w-full px-4 space-y-6 font-sans text-gray-800">
        {/* Grid Layout for Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="mb-2 text-base block" htmlFor="firstName">
              First name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="First name"
              defaultValue={user.firstName}
              className="px-4 py-3 text-base rounded-md bg-white border border-gray-400 w-full outline-blue-500 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="mb-2 text-base block" htmlFor="lastName">
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Last name"
              defaultValue={user.lastName}
              className="px-4 py-3 text-base rounded-md bg-white border border-gray-400 w-full outline-blue-500 focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="mb-2 text-base block" htmlFor="address">
              Address
            </label>
            <input
              id="address"
              type="text"
              placeholder="Address"
              defaultValue={user.address}
              className="px-4 py-3 text-base rounded-md bg-white border border-gray-400 w-full outline-blue-500 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="relative">
            <label className="mb-2 text-base block" htmlFor="phone">
              Phone number
            </label>
            <div className="flex items-center border-2 border-gray-300 focus-within:border-black rounded-sm">
              <div className="relative">
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="px-4 py-2 text-sm text-black flex items-center focus:outline-none"
                >
                  {countryCode}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 ml-1 fill-black"
                    viewBox="0 0 451.847 451.847"
                  >
                    <path
                      d="M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z"
                      data-original="#000000"
                    />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <ul className="absolute bg-white shadow-lg min-w-[100px] top-full left-0 mt-1 rounded-md z-10">
                    {arrCountry.map((code) => (
                      <li
                        key={code}
                        className="cursor-pointer hover:bg-blue-50 px-4 py-2 text-sm text-black"
                        onClick={() => selectCountryCode(code)}
                      >
                        {code}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <input
                id="phone"
                type="tel"
                placeholder="586-666-889"
                defaultValue={phoneNumber}
                className="px-3 py-3 text-black w-full text-sm outline-none rounded-sm focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm mb-2 block" htmlFor="birthday">
              Birthday
            </label>
            <input
              id="birthday"
              type="date"
              defaultValue={user.dob}
              className="px-4 py-3 bg-[#f0f1f2] text-black w-full text-sm outline-[#007bff] rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-4">
          <button
            aria-label="Cancel changes"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>

          <button
            aria-label="Update account information"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
