import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthProvider";

export default function Header() {
  const { userProfile, logout } = useAuth();

  // const { wishlist } = useWishlist();
  // const wishlistCount = Object.keys(wishlist).length;

  const pathname = usePathname();

  useEffect(() => {
    const toggleOpen = document.getElementById("toggleOpen");
    const toggleClose = document.getElementById("toggleClose");
    const collapseMenu = document.getElementById("collapseMenu");

    if (collapseMenu && toggleOpen && toggleClose) {
      const handleClick = () => {
        collapseMenu.style.display =
          collapseMenu.style.display === "block" ? "none" : "block";
      };
      toggleOpen.addEventListener("click", handleClick);
      toggleClose.addEventListener("click", handleClick);
      return () => {
        toggleClose.removeEventListener("click", handleClick);
        toggleOpen.removeEventListener("click", handleClick);
      };
    }
  });

  useEffect(() => {
    const toggleProfile = document.getElementById("toggleProfile");
    const collapseMenuProfile = document.getElementById("collapseMenuProfile");

    if (toggleProfile && collapseMenuProfile) {
      const handleClick = () => {
        collapseMenuProfile.style.display =
          collapseMenuProfile.style.display === "block" ? "none" : "block";
      };
      const handleClickOutside = (event: MouseEvent) => {
        if (
          collapseMenuProfile.style.display === "block" &&
          !collapseMenuProfile.contains(event.target as Node) &&
          !toggleProfile.contains(event.target as Node)
        ) {
          // Đóng menu khi click bên ngoài
          collapseMenuProfile.style.display = "none";
        }
      };

      toggleProfile.addEventListener("click", handleClick);
      document.addEventListener("click", handleClickOutside);

      return () => {
        toggleProfile.removeEventListener("click", handleClick);
        document.removeEventListener("click", handleClickOutside);
      };
    }
  });

  return (
    <header className="fixed top-0 left-0 w-full bg-orange-400 border-b py-3 sm:px-6 px-4 font-[sans-serif] min-h-[75px] tracking-wide z-50">
      <div className="flex max-w-screen-xl mx-auto w-full">
        <div className="flex flex-wrap items-center lg:gap-y-2 gap-4 w-full">
          <a href="/photos" className="max-sm:hidden">
            <img
              src="https://i.gyazo.com/311f11f797d6c8e0170a39cbc36f207b.png"
              alt="logo"
              className="w-36"
            />
          </a>

          <a href="/photos" className="hidden max-sm:block">
            <img
              src="https://i.gyazo.com/311f11f797d6c8e0170a39cbc36f207b.png"
              alt="logo"
              className="w-36"
            />
          </a>
          <div
            id="collapseMenu"
            className="lg:ml-6 max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50"
          >
            <button
              id="toggleClose"
              className="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white w-9 h-9 flex items-center justify-center border"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5 fill-black"
                viewBox="0 0 320.591 320.591"
              >
                <path
                  d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                  data-original="#000000"
                />
                <path
                  d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                  data-original="#000000"
                />
              </svg>
            </button>
            <ul className="lg:flex lg:gap-x-3 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
              <li className="mb-6 hidden max-lg:block">
                <div className="flex items-center justify-between gap-4">
                  <a href="/photos">
                    <img
                      src="https://i.gyazo.com/311f11f797d6c8e0170a39cbc36f207b.png"
                      alt="logo"
                      className="w-36"
                    />
                  </a>
                  {userProfile ? (
                    <ul>
                      <li className="text-gray-500 bg-gray-100 px-4 py-2 rounded-full text-sm tracking-wide font-bold cursor-pointer flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 fill-current mr-2"
                          viewBox="0 0 512 512"
                        >
                          <path
                            d="M437.02 74.98C388.668 26.63 324.379 0 256 0S123.332 26.629 74.98 74.98C26.63 123.332 0 187.621 0 256s26.629 132.668 74.98 181.02C123.332 485.37 187.621 512 256 512s132.668-26.629 181.02-74.98C485.37 388.668 512 324.379 512 256s-26.629-132.668-74.98-181.02zM111.105 429.297c8.454-72.735 70.989-128.89 144.895-128.89 38.96 0 75.598 15.179 103.156 42.734 23.281 23.285 37.965 53.687 41.742 86.152C361.641 462.172 311.094 482 256 482s-105.637-19.824-144.895-52.703zM256 269.507c-42.871 0-77.754-34.882-77.754-77.753C178.246 148.879 213.13 114 256 114s77.754 34.879 77.754 77.754c0 42.871-34.883 77.754-77.754 77.754zm170.719 134.427a175.9 175.9 0 0 0-46.352-82.004c-18.437-18.438-40.25-32.27-64.039-40.938 28.598-19.394 47.426-52.16 47.426-89.238C363.754 132.34 315.414 84 256 84s-107.754 48.34-107.754 107.754c0 37.098 18.844 69.875 47.465 89.266-21.887 7.976-42.14 20.308-59.566 36.542-25.235 23.5-42.758 53.465-50.883 86.348C50.852 364.242 30 312.512 30 256 30 131.383 131.383 30 256 30s226 101.383 226 226c0 56.523-20.86 108.266-55.281 147.934zm0 0"
                            data-original="#000000"
                          />
                        </svg>
                        Hi, {userProfile.fullName}
                      </li>
                    </ul>
                  ) : (
                    <button className="px-4 py-2 text-sm rounded-full text-white border-2 border-[#007bff] bg-[#007bff] hover:bg-[#004bff]">
                      Sign In
                    </button>
                  )}
                </div>
              </li>
              {/* {buttons.map((button) => {
                const isActive = true ? pathname === button.href : "";
                return (
                  <li key={button.name}>
                    <Link
                      href={button.href}
                      className={`px-4 py-2 rounded transition-colors duration-300 ${
                        isActive
                          ? "bg-black text-white"
                          : "text-black hover:bg-black hover:text-white"
                      }`}
                    >
                      {button.name}
                    </Link>
                  </li>
                );
              })} */}
            </ul>
          </div>
          <div className="flex items-center gap-x-6 gap-y-4 ml-auto">
            <div className="flex items-center sm:space-x-8 space-x-6">
              <div className="space-x-5 flex justify-center font-[sans-serif] ">
                <div className="flex flex-col items-center justify-center gap-0.5 cursor-pointer">
                  <div className="relative">
                    <svg
                      className="cursor-pointer dark:text-white inline w-6 h-6"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z"
                      />
                    </svg>
                    <span className="absolute left-auto -ml-1 top-0 rounded-full bg-red-500 px-1 py-0 text-xs text-white">
                      10
                    </span>
                  </div>
                  <span className="text-[13px] font-semibold text-[#333]">
                    Don hang
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center gap-0.5 cursor-pointer">
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="cursor-pointer fill-[#333] inline w-5 h-5"
                      viewBox="0 0 512 512"
                    >
                      <path
                        d="M438.957 19.477H73.043C32.766 19.477 0 52.244 0 92.52v246.961c0 40.276 32.766 73.043 73.043 73.043h28.663l.561 64.483a15.648 15.648 0 0 0 15.649 15.517 15.64 15.64 0 0 0 9.565-3.262l99.425-76.738h212.051c40.277 0 73.043-32.767 73.043-73.043V92.52c0-40.276-32.766-73.043-73.043-73.043zm41.739 320.005c0 23.015-18.724 41.739-41.739 41.739H221.569c-3.46 0-6.823 1.147-9.563 3.261l-78.711 60.75-.422-48.495c-.074-8.591-7.06-15.516-15.651-15.516H73.043c-23.015 0-41.739-18.724-41.739-41.739V92.52c0-23.015 18.724-41.739 41.739-41.739h365.915c23.015 0 41.739 18.724 41.739 41.739v246.962z"
                        data-original="#000000"
                      />
                    </svg>
                    <span className="absolute left-auto -ml-1 top-0 rounded-full bg-red-500 px-1 py-0 text-xs text-white">
                      10
                    </span>
                  </div>
                  <span className="text-[13px] font-semibold text-[#333]">
                    Message
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-0.5 cursor-pointer">
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="cursor-pointer fill-[#333] inline w-5 h-5"
                      viewBox="0 0 371.263 371.263"
                    >
                      <path
                        d="M305.402 234.794v-70.54c0-52.396-33.533-98.085-79.702-115.151.539-2.695.838-5.449.838-8.204C226.539 18.324 208.215 0 185.64 0s-40.899 18.324-40.899 40.899c0 2.695.299 5.389.778 7.964-15.868 5.629-30.539 14.551-43.054 26.647-23.593 22.755-36.587 53.354-36.587 86.169v73.115c0 2.575-2.096 4.731-4.731 4.731-22.096 0-40.959 16.647-42.995 37.845-1.138 11.797 2.755 23.533 10.719 32.276 7.904 8.683 19.222 13.713 31.018 13.713h72.217c2.994 26.887 25.869 47.905 53.534 47.905s50.54-21.018 53.534-47.905h72.217c11.797 0 23.114-5.03 31.018-13.713 7.904-8.743 11.797-20.479 10.719-32.276-2.036-21.198-20.958-37.845-42.995-37.845a4.704 4.704 0 0 1-4.731-4.731zM185.64 23.952c9.341 0 16.946 7.605 16.946 16.946 0 .778-.12 1.497-.24 2.275-4.072-.599-8.204-1.018-12.336-1.138-7.126-.24-14.132.24-21.078 1.198-.12-.778-.24-1.497-.24-2.275.002-9.401 7.607-17.006 16.948-17.006zm0 323.358c-14.431 0-26.527-10.3-29.342-23.952h58.683c-2.813 13.653-14.909 23.952-29.341 23.952zm143.655-67.665c.479 5.15-1.138 10.12-4.551 13.892-3.533 3.773-8.204 5.868-13.353 5.868H59.89c-5.15 0-9.82-2.096-13.294-5.868-3.473-3.772-5.09-8.743-4.611-13.892.838-9.042 9.282-16.168 19.162-16.168 15.809 0 28.683-12.874 28.683-28.683v-73.115c0-26.228 10.419-50.719 29.282-68.923 18.024-17.425 41.498-26.887 66.528-26.887 1.198 0 2.335 0 3.533.06 50.839 1.796 92.277 45.929 92.277 98.325v70.54c0 15.809 12.874 28.683 28.683 28.683 9.88 0 18.264 7.126 19.162 16.168z"
                        data-original="#000000"
                      />
                    </svg>
                    <span className="absolute left-auto -ml-1 top-0 rounded-full bg-red-500 px-1 py-0 text-xs text-white">
                      3
                    </span>
                  </div>
                  <span className="text-[13px] font-semibold text-[#333]">
                    Thong bao
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center gap-0.5 cursor-pointer">
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="cursor-pointer fill-[#333] inline w-5 h-5"
                      viewBox="0 0 64 64"
                    >
                      <path
                        d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
                        data-original="#000000"
                      />
                    </svg>
                    <span className="absolute left-auto -ml-1 top-0 rounded-full bg-red-500 px-1 py-0 text-xs text-white">
                      {/* {wishlistCount} */}
                    </span>
                  </div>
                  <span className="text-[13px] font-semibold text-[#333]">
                    Wishlist
                  </span>
                </div>
              </div>
              {userProfile ? (
                <div className="max-lg:hidden">
                  <div className="flex items-center max-lg:ml-auto space-x-5">
                    <div className="flex items-center ml-auto ">
                      {userProfile ? (
                        <div
                          id="toggleProfile"
                          className="flex flex-wrap items-center cursor-pointer border border-gray-300 rounded-lg w-max px-1.5 py-1 mx-auto "
                        >
                          <img
                            src={
                              userProfile.avatarUrl
                                ? userProfile.avatarUrl
                                : "https://readymadeui.com/team-1.webp"
                            }
                            className="w-10 h-10 rounded-lg"
                          />
                          <div className="mx-4">
                            <p className="text-sm text-gray-800 font-semibold">
                              Hi, {userProfile.fullName}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                      <ul className="flex space-x-4 relative z-50">
                        <li className="relative px-1 after:absolute after:block after:-bottom-2 after:left-0 after:transition-all after:duration-300">
                          <div
                            id="collapseMenuProfile"
                            style={{ display: "none" }}
                            className="bg-white z-18 shadow-lg py-6 px-1 sm:min-w-[150px] max-sm:min-w-[250px] max-sm:-right-32 absolute right-2 top-7"
                          >
                            <>
                              <ul className="space-y-1.5">
                                <li className="py-1 px-2 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer">
                                  <svg
                                    className="w-4 h-4 mr-3"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke="currentColor"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M10 12v1h4v-1m4 7H6a1 1 0 0 1-1-1V9h14v9a1 1 0 0 1-1 1ZM4 5h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                                    />
                                  </svg>

                                  <a
                                    href="/photos/galleries"
                                    className="text-sm text-gray-500 hover:text-pink-500"
                                  >
                                    My Photos
                                  </a>
                                </li>

                                <li className="py-1 px-2 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    className="w-4 h-4 mr-3"
                                    viewBox="0 0 512 512"
                                  >
                                    <path
                                      d="M337.711 241.3a16 16 0 0 0-11.461 3.988c-18.739 16.561-43.688 25.682-70.25 25.682s-51.511-9.121-70.25-25.683a16.007 16.007 0 0 0-11.461-3.988c-78.926 4.274-140.752 63.672-140.752 135.224v107.152C33.537 499.293 46.9 512 63.332 512h385.336c16.429 0 29.8-12.707 29.8-28.325V376.523c-.005-71.552-61.831-130.95-140.757-135.223zM446.463 480H65.537V376.523c0-52.739 45.359-96.888 104.351-102.8C193.75 292.63 224.055 302.97 256 302.97s62.25-10.34 86.112-29.245c58.992 5.91 104.351 50.059 104.351 102.8zM256 234.375a117.188 117.188 0 1 0-117.188-117.187A117.32 117.32 0 0 0 256 234.375zM256 32a85.188 85.188 0 1 1-85.188 85.188A85.284 85.284 0 0 1 256 32z"
                                      data-original="#000000"
                                    />
                                  </svg>
                                  <a
                                    href="/photos/user"
                                    className="text-sm text-gray-500 hover:text-pink-500"
                                  >
                                    View profile
                                  </a>
                                </li>
                              </ul>
                              <hr className="border-b-0 my-2" />
                              <ul className="space-y-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                <li className="py-1 px-2 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    className="w-4 h-4 mr-3"
                                    viewBox="0 0 6.35 6.35"
                                  >
                                    <path
                                      d="M3.172.53a.265.266 0 0 0-.262.268v2.127a.265.266 0 0 0 .53 0V.798A.265.266 0 0 0 3.172.53zm1.544.532a.265.266 0 0 0-.026 0 .265.266 0 0 0-.147.47c.459.391.749.973.749 1.626 0 1.18-.944 2.131-2.116 2.131A2.12 2.12 0 0 1 1.06 3.16c0-.65.286-1.228.74-1.62a.265.266 0 1 0-.344-.404A2.667 2.667 0 0 0 .53 3.158a2.66 2.66 0 0 0 2.647 2.663 2.657 2.657 0 0 0 2.645-2.663c0-.812-.363-1.542-.936-2.03a.265.266 0 0 0-.17-.066z"
                                      data-original="#000000"
                                    />
                                  </svg>
                                  <a
                                    className="text-sm text-red-500 "
                                    onClick={logout}
                                  >
                                    Logout
                                  </a>
                                </li>
                              </ul>
                            </>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <button className="max-lg:hidden px-4 py-2 text-sm rounded-full text-white border-2 border-[#007bff] bg-[#007bff] hover:bg-[#004bff]">
                  <a href="/auth/account/login"> Sign In</a>
                </button>
              )}

              <button id="toggleOpen" className="lg:hidden">
                <svg
                  className="w-7 h-7"
                  fill="#333"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
