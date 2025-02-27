"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ModalForgotPassword from "@/components/ModalForgotPassword";
import "react-toastify/dist/ReactToastify.css";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  //Open modal confirm email
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleForgotPassword = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    //Login with api
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false, // ✅ Không tự động chuyển hướng
    });

    if (response?.error) {
      setError(response.error);
    } else {
      router.push("/photos");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="text-red-600 text-xs block mb-2">{error}</label>
          <label className="text-gray-800 text-xs block mb-2">Email</label>
          <div className="relative flex items-center">
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
              placeholder="Enter email"
            />

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#bbb"
              stroke="#bbb"
              className="w-[18px] h-[18px] absolute right-2"
              viewBox="0 0 682.667 682.667"
            >
              <defs>
                <clipPath id="a" clipPathUnits="userSpaceOnUse">
                  <path d="M0 512h512V0H0Z" data-original="#000000" />
                </clipPath>
              </defs>
              <g
                clipPath="url(#a)"
                transform="matrix(1.33 0 0 -1.33 0 682.667)"
              >
                <path
                  fill="none"
                  strokeMiterlimit={10}
                  stroke-width={40}
                  d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                  data-original="#000000"
                />
                <path
                  d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                  data-original="#000000"
                />
              </g>
            </svg>
          </div>
        </div>
        <div className="mt-5">
          <label className="text-gray-800 text-xs block mb-2">Password</label>
          <div className="relative flex items-center">
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
              placeholder="Enter password"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#bbb"
              stroke="#bbb"
              className="w-[18px] h-[18px] absolute right-2 cursor-pointer"
              viewBox="0 0 128 128"
            >
              <path
                d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                data-original="#000000"
              />
            </svg>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-3 block text-sm text-gray-800"
            >
              Remember me
            </label>
          </div>
          <div>
            <a
              className="text-blue-600 font-semibold text-sm hover:underline"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </a>
          </div>
        </div>

        <div className="mt-12">
          <button
            type="submit"
            className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            Sign in
          </button>
        </div>
      </form>

      <ModalForgotPassword
        isOpen={isModalOpen}
        onClose={closeModal}
      ></ModalForgotPassword>
    </>
  );
}
