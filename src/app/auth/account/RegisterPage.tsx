/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const url = "http://localhost:8080/api/auth/signup";

  const [message, setMessage] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    provider: "credentials",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(url, formData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      setMessage(response.data?.result || "Registration successful!");
      router.push("/auth/account/login");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong! Please try again.";
      setMessage(errorMessage);
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label className="text-red-600 text-xs block mb-2">{message}</label>
        <div>
          <label className="text-gray-800 text-xs block mb-2">User Name</label>
          <div className="relative flex items-center">
            <input
              name="name"
              type="text"
              onChange={handleChange}
              required
              className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
              placeholder="Enter Username"
            />
          </div>
        </div>
        <div className="mt-5">
          <label className="text-gray-800 text-xs block mb-2">Email</label>
          <div className="relative flex items-center">
            <input
              name="email"
              type="email"
              onChange={handleChange}
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
                  strokeWidth={40}
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
              onChange={handleChange}
              required
              autoComplete="new-password"
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
        <div className="mt-5">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md"
            />
            <label
              htmlFor="remember-me"
              className="text-gray-800 ml-3 block text-sm"
            >
              I accept the
              <a
                href=" "
                className="text-blue-600 font-semibold hover:underline ml-1"
              >
                Terms and Conditions
              </a>
            </label>
          </div>
          <div className="mt-12">
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm tracking-wider rounded-md bg-blue-600 hover:bg-blue-700 text-white focus:outline-none"
            >
              Create Account
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
