import React, { useEffect, useState } from "react";
import { deleteCookie, getCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";

export default function Header() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [providerId, setProviderId] = useState("");
  const router = useRouter();

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
      if (token) {
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
    <header className=" top-0 left-0  w-full fixed  z-50  py-3 bg-white font-[sans-serif]">
      <section className="py-1 bg-[#7700ff] text-white text-right px-6">
        <p className="text-sm">
          <strong className="mx-3">Address:</strong>HCM
          <strong className="mx-3">Contact No:</strong>1800333665
        </p>
      </section>
      <div className="h-16 flex flex-wrap items-center justify-between  w-full px-12 pt-2">
        <a href="/home">
          <img
            src="https://readymadeui.com/readymadeui.svg"
            alt="logo"
            className="w-36"
          />
        </a>
        <div className="flex w-64 px-4 py-3 rounded-md border-2 border-blue-500 overflow-hidden max-w-md mx-auto font-[sans-serif]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 192.904 192.904"
            width="16px"
            className="fill-gray-600 mr-3 rotate-90"
          >
            <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
          </svg>
          <input
            type="text"
            placeholder="Search Something..."
            className="w-full outline-none bg-transparent text-gray-600 text-sm"
          />
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
            <ul className="flex space-x-4 relative">
              <li className="  relative px-1 after:absolute after:block after:-bottom-2 after:left-0 after:transition-all after:duration-300">
                <div
                  id="collapseMenuUser"
                  style={{ display: "none" }}
                  className="bg-white z-20 shadow-lg py-6 px-6 sm:min-w-[320px] max-sm:min-w-[250px] max-sm:-right-32 absolute right-0 top-8"
                >
                  <>
                    <h6 className="font-semibold text-sm">
                      {userProfile?.firstName}.{userProfile?.lastName}
                    </h6>
                    <p className="text-sm text-gray-500 mt-1">{email}</p>
                    <hr className="border-b-0 my-4" />
                    <ul className="space-y-1.5">
                      <li className="hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        <a
                          href="/home/galleries"
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
      <div className="py-1 bg-blue-400 text-white text-center px-6">
        <button className="bg-cyan-700 p-2">HI</button>
      </div>
    </header>
  );
}
