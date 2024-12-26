import React, { useEffect, useState } from "react";
import { deleteCookie, getCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";

export default function Header() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const pathname = usePathname(); // Lấy pathname hiện tại
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [providerId, setProviderId] = useState("");
  const router = useRouter();

  const menuItems = [
    { name: "Home", path: "/home" },
    { name: "My Gallery", path: "/home/galleries" },
  ];

  const { data: session } = useSession();
  const cookieToken = getCookie("token");

  useEffect(() => {
    if (session?.backendToken) {
      setToken(session.backendToken);
      setEmail(session?.user?.email);
      setProviderId(session?.user?.sub);
    } else if (cookieToken) {
      setToken(cookieToken);
    }
  }, [session, cookieToken]);

  const [formDataInfo, setFormDataInfo] = useState({
    email: "",
    provider: "",
    providerId: "",
  });

  useEffect(() => {
    setFormDataInfo({
      email: email,
      provider: providerId ? "GOOGLE" : "",
      providerId: providerId,
    });
  }, [email, providerId]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (formDataInfo.email && token) {
        try {
          const url = "http://localhost:8080/api/user/my-info";

          const response = await axios.post(url, formDataInfo, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = response.data.result.userProfile;

          localStorage.setItem("user", userData);
          setUserProfile(userData);
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu từ API:", error);
        }
      }
    };
    fetchUserData();
  }, [formDataInfo, token]);

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
    const collapseMenuUser = document.getElementById("collapseMenuUser");

    if (toggleProfile && collapseMenuUser) {
      const handleClick = () => {
        collapseMenuUser.style.display =
          collapseMenuUser.style.display === "block" ? "none" : "block";
      };
      const handleClickOutside = (event: MouseEvent) => {
        if (
          collapseMenuUser.style.display === "block" &&
          !collapseMenuUser.contains(event.target as Node) &&
          !toggleProfile.contains(event.target as Node)
        ) {
          // Đóng menu khi click bên ngoài
          collapseMenuUser.style.display = "none";
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
    <header className=" top-0 left-0  w-full py-3 bg-white font-[sans-serif] fixed  z-1000">
      <section className="py-2 bg-[#0066ff] text-white text-right px-10">
        <p className="text-sm">
          <strong className="mx-3">Address:</strong>HCM
          <strong className="mx-3">Contact No:</strong>1800333665
        </p>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 w-full px-12 pt-3">
        <a href="">
          <img
            src="https://readymadeui.com/readymadeui.svg"
            alt="logo"
            className="w-36"
          />
        </a>
        <div
          id="collapseMenu"
          className="max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50"
        >
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
          <ul className="list-none flex space-x-4">
            <li className="mb-6 hidden max-lg:block">
              <a href="">
                <img
                  src="https://readymadeui.com/readymadeui.svg"
                  alt="logo"
                  className="w-36"
                />
              </a>
            </li>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`px-3 py-2 rounded ${
                    pathname === item.path
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center max-lg:ml-auto space-x-5">
          <div className="flex items-center ml-auto ">
            {userProfile ? (
              <>
                <div>
                  <li
                    id="toggleProfile"
                    className="text-gray-500 bg-gray-100 px-4 py-2 rounded-full text-sm tracking-wide font-bold cursor-pointer flex items-center"
                  >
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
              <></>
            )}
            <ul className="flex space-x-4">
              <li className="relative px-1 after:absolute    after:block after:-bottom-2 after:left-0 after:transition-all after:duration-300">
                <div
                  id="collapseMenuUser"
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
                          href="/user/profile"
                          className="text-sm text-gray-500 hover:text-pink-500"
                        >
                          Profile
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
                          className="text-sm text-red-500"
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
          <button id="toggleOpen" className="lg:hidden !ml-7">
            <svg
              className="w-7 h-7"
              fill="#000"
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
    </header>
  );
}
