"use client";

import axios from "axios";
import React, { useState } from "react";

export default function pageConfirm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [matchError, setMatchError] = useState("");

  // Hàm kiểm tra mật khẩu
  const validatePassword = (password) => {
    // Đảm bảo mật khẩu có ít nhất 8 ký tự, có ký tự hoa, số, và ký tự đặc biệt
    const minLength = /.{8,}/;
    const hasUpperCase = /[A-Z]/;
    const hasNumber = /[0-9]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (!minLength.test(password)) {
      return "Mật khẩu phải có ít nhất 8 ký tự";
    }
    if (!hasUpperCase.test(password)) {
      return "Mật khẩu phải có ít nhất 1 ký tự in hoa";
    }
    if (!hasNumber.test(password)) {
      return "Mật khẩu phải có ít nhất 1 số";
    }
    if (!hasSpecialChar.test(password)) {
      return "Mật khẩu phải có ít nhất 1 ký tự đặc biệt";
    }

    return ""; // Không có lỗi
  };

  // Xử lý sự kiện thay đổi mật khẩu
  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);

    const errorMsg = validatePassword(newPassword);
    setError(errorMsg); // Cập nhật lỗi nếu có
  };
  // Xử lý sự kiện thay đổi mật khẩu xác nhận
  const handleConfirmPasswordChange = (event) => {
    const confirmPasswordValue = event.target.value;
    setConfirmPassword(confirmPasswordValue);

    // Kiểm tra mật khẩu khớp
    if (password !== confirmPasswordValue) {
      setMatchError("Mật khẩu không khớp");
    } else {
      setMatchError("");
    }
  };

  const url = "http://localhost:8080/api/auth/reset-password";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault(); // Prevent the default form submission
    console.log("formData: ", formData);
    formData.email = "";
    formData.password = password;
    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log("email: ", response.data);
    } catch (error) {
      console.error("Register error:", error);
    }
  };
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative w-full max-w-lg p-6 mx-4 bg-white rounded-lg shadow-lg">
          {/* Modal content */}
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Reset your password
              </h1>
            </div>
            <div className="mt-5">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                    >
                      New password *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                        required
                      />
                      {error && <p style={{ color: "red" }}>{error}</p>}
                    </div>
                    <br />
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                    >
                      Confirm password *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="re-password"
                        name="re-password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                        required
                      />
                      {matchError && (
                        <p style={{ color: "red" }}>{matchError}</p>
                      )}
                      {!error &&
                        !matchError &&
                        password.length > 0 &&
                        confirmPassword.length > 0 && (
                          <p style={{ color: "green" }}>
                            Mật khẩu hợp lệ và khớp nhau!
                          </p>
                        )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                  >
                    Reset password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
