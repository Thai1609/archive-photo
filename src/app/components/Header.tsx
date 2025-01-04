import React, { useEffect, useState } from "react";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";

export default function Header() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [providerId, setProviderId] = useState("");

  const { data: session } = useSession();
  const cookieToken = getCookie("token");

  const router = useRouter();
  const { pathname } = router; // Current path

  const buttons = [
    { name: "Home", href: "/photos" },
    { name: "My Photos", href: "/photos/galleries" },
    { name: "Wishlist", href: "/photos/wishlist" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
  ];

  useEffect(() => {
    if (session?.backendToken) {
      setToken(session.backendToken);
      setEmail(session?.user?.email);
      setProviderId(session?.user?.sub);
    } else if (cookieToken) {
      setToken(cookieToken);
    }
  }, [session, cookieToken]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        const formDataInfo = {
          email: email,
          provider: providerId ? "GOOGLE" : "",
          providerId: providerId,
        };

        try {
          const url = "http://localhost:8080/api/user/my-info";

          const response = await axios.post(url, formDataInfo, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = response.data.result.userProfile;

          localStorage.setItem("user", JSON.stringify(userData));
          setUserProfile(userData);
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu từ API:", error);
        }
      }
    };
    fetchUserData();
  }, [token, email, providerId]);

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

  const handleLogout = async () => {
    try {
      if (!providerId) {
        deleteCookie("token");
        localStorage.removeItem("user"); // Clear user profile
        router.push("/auth/login");
      } else {
        signOut({
          redirect: true,
          callbackUrl: "/auth/login",
        });
      }
    } catch (error) {
      console.error("Error clearing cookie:", error);
    }
  };

  return (
    <>
      <header className=" top-0 left-0  w-full bg-white border-b py-3 sm:px-6 px-4 font-[sans-serif] min-h-[75px] tracking-wide fixed z-50">
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
                      <>
                        <div>
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
                            Hi, {userProfile.lastName}
                          </li>
                        </div>
                      </>
                    ) : (
                      <>
                        <button className="px-4 py-2 text-sm rounded-full text-white border-2 border-[#007bff] bg-[#007bff] hover:bg-[#004bff]">
                          Sign In
                        </button>
                      </>
                    )}
                  </div>
                </li>
                {buttons.map((button) => {
                  const isActive = pathname === button.href;

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
                })}
              </ul>
            </div>
            <div className="flex items-center gap-x-6 gap-y-4 ml-auto">
              <div className="bg-white text-black flex px-4 py-3 border-b border-[#333] focus-within:border-blue-500 overflow-hidden max-w-md mx-auto font-[sans-serif]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 192.904 192.904"
                  width="18px"
                  className="fill-gray-600 mr-3"
                >
                  <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Search Something..."
                  className="w-full outline-none text-sm"
                />
              </div>
              <div className="flex items-center sm:space-x-8 space-x-6">
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
                      0
                    </span>
                  </div>
                  <span className="text-[13px] font-semibold text-[#333]">
                    Wishlist
                  </span>
                </div>
                {userProfile ? (
                  <div className="max-lg:hidden">
                    <div className="flex items-center max-lg:ml-auto space-x-5">
                      <div className="flex items-center ml-auto ">
                        {userProfile ? (
                          <>
                            <div>
                              <li
                                id="toggleProfile"
                                className="text-gray-500 bg-gray-100 px-4 py-2 rounded-full text-sm tracking-wide font-bold cursor-pointer flex items-center"
                              >
                                <img
                                  src="https://readymadeui.com/team-3.webp"
                                  className="w-11 h-11 rounded-full border-2 border-blue-600 p-0.5 mx-auto"
                                />
                                Hi, {userProfile.lastName}
                              </li>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                        <ul className="flex space-x-4 relative">
                          <li className="relative px-1 after:absolute after:block after:-bottom-2 after:left-0 after:transition-all after:duration-300">
                            <div
                              id="collapseMenuProfile"
                              style={{ display: "none" }}
                              className="bg-white z-20  text-right shadow-lg py-6 px-6 sm:min-w-[200px] max-sm:min-w-[250px] max-sm:-right-32 absolute right-0 top-8"
                            >
                              <>
                                <h6 className="font-semibold text-sm">
                                  {userProfile?.firstName}.
                                  {userProfile?.lastName}
                                </h6>
                                <p className="text-sm text-gray-500 mt-1">
                                  {email}
                                </p>
                                <hr className="border-b-0 my-4" />
                                <ul className="space-y-1.5">
                                  <li className="hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                    <a
                                      href="/photos/galleries"
                                      className="text-sm text-gray-500 hover:text-pink-500"
                                    >
                                      My Gallery
                                    </a>
                                  </li>
                                  <li className="hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                    <a
                                      href="/user/profile"
                                      className="text-sm text-gray-500 hover:text-pink-500"
                                    >
                                      Profile
                                    </a>
                                  </li>
                                  <li className="hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                    <a
                                      href=""
                                      className="text-sm text-gray-500 hover:text-pink-500"
                                    >
                                      Wishlist
                                    </a>
                                  </li>
                                  <li className="hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                    <a
                                      href=""
                                      className="text-sm text-gray-500 hover:text-pink-500"
                                    >
                                      Gift Cards
                                    </a>
                                  </li>
                                </ul>
                                <hr className="border-b-0 my-4" />
                                <ul className="space-y-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                  <li>
                                    <a
                                      className="text-sm text-red-500 "
                                      onClick={handleLogout}
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
                    Sign In
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
    </>
  );
}
