import React, { useEffect } from "react";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import router from "next/router";
import { clearUserProfile } from "../redux/slices/user/userProfileSlice";

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();

  const userProfile = useSelector((state: RootState) => state.userProfile);
  // const username = userProfile.email?.split("@")[0];
  const username = userProfile.lastName;

  useEffect(() => {
    const toggleProfile = document.getElementById("toggleProfile");
    const collapseMenu = document.getElementById("collapseMenu");

    if (toggleProfile && collapseMenu) {
      const handleClick = () => {
        collapseMenu.style.display =
          collapseMenu.style.display === "block" ? "none" : "block";
      };
      const handleClickOutside = (event: MouseEvent) => {
        if (
          collapseMenu.style.display === "block" &&
          !collapseMenu.contains(event.target as Node) &&
          !toggleProfile.contains(event.target as Node)
        ) {
          // Đóng menu khi click bên ngoài
          collapseMenu.style.display = "none";
        }
      };

      toggleProfile.addEventListener("click", handleClick);
      document.addEventListener("click", handleClickOutside);

      return () => {
        toggleProfile.removeEventListener("click", handleClick);
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, []);

  const handleLogout = async () => {
    try {
      deleteCookie("token"); // Clear cookie
      dispatch(clearUserProfile());
      dispatch(clearUserProfile());
      router.push("/photos");

      console.log("Cookie cleared successfully");
    } catch (error) {
      console.error("Error clearing cookie:", error);
    }
  };
  return (
    <header className="  shadow-lg py-4 px-4 sm:px-10 bg-white font-[sans-serif] min-h-[70px] tracking-wide relative z-50">
      <section className="py-2 bg-[#0066ff] text-white text-right px-10">
        <p className="text-sm">
          <strong className="mx-3">Address:</strong>SWF New York 185669
          <strong className="mx-3">Contact No:</strong>1800333665
        </p>
      </section>
      <div className="w-full flex flex-wrap items-center lg:gap-y-4 gap-y-6 gap-x-4">
        <div className="flex flex-wrap items-center justify-between gap-4 px-10 py-4 bg-white min-h-[70px]">
          <a href="">
            <img
              src="https://readymadeui.com/readymadeui.svg"
              alt="logo"
              className="w-36"
            />
          </a>
          <div className="max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50">
            <button
              id="toggleClose"
              className="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white p-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 fill-black"
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
            <ul className="lg:flex lg:gap-x-5 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
              <li className="mb-6 hidden max-lg:block">
                <a href="">
                  <img
                    src="https://readymadeui.com/readymadeui.svg"
                    alt="logo"
                    className="w-36"
                  />
                </a>
              </li>
              <li className="max-lg:border-b max-lg:py-3 px-3">
                <a
                  href=""
                  className="hover:text-[#007bff] text-[#007bff] block font-bold text-[15px]"
                >
                  Home
                </a>
              </li>
              <li className="max-lg:border-b max-lg:py-3 px-3">
                <a
                  href=""
                  className="hover:text-[#007bff] text-[#333] block font-bold text-[15px]"
                >
                  Team
                </a>
              </li>
              <li className="max-lg:border-b max-lg:py-3 px-3">
                <a
                  href=""
                  className="hover:text-[#007bff] text-[#333] block font-bold text-[15px]"
                >
                  Feature
                </a>
              </li>
              <li className="max-lg:border-b max-lg:py-3 px-3">
                <a
                  href=""
                  className="hover:text-[#007bff] text-[#333] block font-bold text-[15px]"
                >
                  Blog
                </a>
              </li>
              <li className="max-lg:border-b max-lg:py-3 px-3">
                <a
                  href=""
                  className="hover:text-[#007bff] text-[#333] block font-bold text-[15px]"
                >
                  About
                </a>
              </li>
              <li className="max-lg:border-b max-lg:py-3 px-3">
                <a
                  href=""
                  className="hover:text-[#007bff] text-[#333] block font-bold text-[15px]"
                >
                  Contact
                </a>
              </li>
              <li className="max-lg:border-b max-lg:py-3 px-3">
                <a
                  href=""
                  className="hover:text-[#007bff] text-[#333] block font-bold text-[15px]"
                >
                  Source
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center ml-auto ">
          {username ? (
            <>
              <div className="flex space-x-4 mt-2">Hi, {username}</div>
            </>
          ) : (
            <>
              <button
                type="button"
                className="bg-transparent border border-gray-300 hover:border-pink-500 px-2 py-2 mt-1 text-sm text-pink-500 font-semibold"
              >
                <Link href="/auth/login"> LOGIN / SIGNUP</Link>
              </button>
            </>
          )}
          <ul className="flex space-x-4">
            <li className="relative px-1 after:absolute    after:block after:-bottom-2 after:left-0 after:transition-all after:duration-300">
              <div
                id="toggleProfile"
                className="flex flex-col justify-center items-center cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M337.711 241.3a16 16 0 0 0-11.461 3.988c-18.739 16.561-43.688 25.682-70.25 25.682s-51.511-9.121-70.25-25.683a16.007 16.007 0 0 0-11.461-3.988c-78.926 4.274-140.752 63.672-140.752 135.224v107.152C33.537 499.293 46.9 512 63.332 512h385.336c16.429 0 29.8-12.707 29.8-28.325V376.523c-.005-71.552-61.831-130.95-140.757-135.223zM446.463 480H65.537V376.523c0-52.739 45.359-96.888 104.351-102.8C193.75 292.63 224.055 302.97 256 302.97s62.25-10.34 86.112-29.245c58.992 5.91 104.351 50.059 104.351 102.8zM256 234.375a117.188 117.188 0 1 0-117.188-117.187A117.32 117.32 0 0 0 256 234.375zM256 32a85.188 85.188 0 1 1-85.188 85.188A85.284 85.284 0 0 1 256 32z"
                    data-original="#000000"
                  />
                </svg>
              </div>
              {username ? (
                <div
                  id="collapseMenu"
                  style={{ display: "none" }}
                  className="bg-white z-20 shadow-lg py-6 px-6 sm:min-w-[320px] max-sm:min-w-[250px] max-sm:-right-32 absolute right-0 top-8"
                >
                  <>
                    <h6 className="font-semibold text-sm">Welcome</h6>
                    <p className="text-sm text-gray-500 mt-1">
                      To access account and manage orders
                    </p>
                    <hr className="border-b-0 my-4" />
                    <ul className="space-y-1.5">
                      <li>
                        <a
                          href=""
                          className="text-sm text-gray-500 hover:text-pink-500"
                        >
                          Order
                        </a>
                      </li>
                      <li>
                        <a
                          href=""
                          className="text-sm text-gray-500 hover:text-pink-500"
                        >
                          Wishlist
                        </a>
                      </li>
                      <li>
                        <a
                          href=""
                          className="text-sm text-gray-500 hover:text-pink-500"
                        >
                          Gift Cards
                        </a>
                      </li>
                      <li>
                        <a
                          href=""
                          className="text-sm text-gray-500 hover:text-pink-500"
                        >
                          Contact Us
                        </a>
                      </li>
                    </ul>
                    <hr className="border-b-0 my-4" />
                    <ul className="space-y-1.5">
                      <li>
                        <a
                          href=""
                          className="text-sm text-red-500  onClick={handleLogout}"
                          onClick={handleLogout}
                        >
                          Logout
                        </a>
                      </li>
                    </ul>
                  </>
                </div>
              ) : (
                <></>
              )}
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
