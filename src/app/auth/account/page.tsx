"use client";
import { useState } from "react";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Page() {
  const [activeTab, setActiveTab] = useState("login"); // ✅ Track which tab is active

  const handleLoginWithGoogle = async () => {
    await signIn("google");
  };
  const handleLoginWithFacebook = async () => {
    await signIn("facebook");
  };
  return (
    <div className="font-sans bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto ">
        <h3 className="text-gray-800 text-7xl text-center mb-2">PHOTOS</h3>

        <div className="bg-white grid md:grid-cols-2 gap-12 w-full sm:p-8 p-6 shadow-md rounded-md overflow-hidden">
          <div className="max-md:order-1 space-y-6">
            <div className="md:mb-16 mb-8">
              <h3 className="text-gray-800 text-xl">Instant Access</h3>
            </div>
            <div className="space-y-4 min-h-[400px]">
              <button
                type="button"
                onClick={handleLoginWithFacebook}
                className="w-72 px-4 py-2.5 flex items-center justify-center rounded-md text-white text-sm tracking-wider border-none outline-none bg-blue-600 hover:bg-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22px"
                  fill="#fff"
                  className="inline shrink-0 mr-3"
                  viewBox="0 0 167.657 167.657"
                >
                  <path
                    d="M83.829.349C37.532.349 0 37.881 0 84.178c0 41.523 30.222 75.911 69.848 82.57v-65.081H49.626v-23.42h20.222V60.978c0-20.037 12.238-30.956 30.115-30.956 8.562 0 15.92.638 18.056.919v20.944l-12.399.006c-9.72 0-11.594 4.618-11.594 11.397v14.947h23.193l-3.025 23.42H94.026v65.653c41.476-5.048 73.631-40.312 73.631-83.154 0-46.273-37.532-83.805-83.828-83.805z"
                    data-original="#010002"
                  />
                </svg>
                Continue with Facebook
              </button>
              <button
                type="button"
                onClick={handleLoginWithGoogle}
                className="w-72 px-4 py-2.5 flex items-center justify-center rounded-md text-gray-800 text-sm tracking-wider border-none outline-none bg-gray-100 hover:bg-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22px"
                  fill="#fff"
                  className="inline shrink-0 mr-3"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#fbbd00"
                    d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                    data-original="#fbbd00"
                  />
                  <path
                    fill="#0f9d58"
                    d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                    data-original="#0f9d58"
                  />
                  <path
                    fill="#31aa52"
                    d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                    data-original="#31aa52"
                  />
                  <path
                    fill="#3c79e6"
                    d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                    data-original="#3c79e6"
                  />
                  <path
                    fill="#cf2d48"
                    d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                    data-original="#cf2d48"
                  />
                  <path
                    fill="#eb4132"
                    d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                    data-original="#eb4132"
                  />
                </svg>
                Continue with Google
              </button>
            </div>
          </div>
          <div className="w-full">
            <div className="space-y-4">
              <ul className="flex bg-white shadow-md">
                {[
                  { id: "login", label: "Login" },
                  { id: "register", label: "Register" },
                ].map((tab) => (
                  <li
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)} // ✅ Change active tab
                    className={`tab flex flex-col items-center justify-center w-full text-sm py-3 px-5 cursor-pointer transition-all 
            ${
              activeTab === tab.id ? "bg-gray-200 font-bold" : "text-gray-800"
            }`}
                  >
                    {tab.label}
                  </li>
                ))}
              </ul>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "login" && <LoginPage></LoginPage>}
                {activeTab === "register" && <RegisterPage></RegisterPage>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
