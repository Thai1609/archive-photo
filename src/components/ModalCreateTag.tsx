import axios from "axios";
import { useEffect, useMemo, useReducer, useState } from "react";
import tagReducer, {
  TAG_ACTIONS,
  initialTagState,
} from "../app/reducers/tagReducer/tagReducer";
import { useAuth } from "@/context/AuthProvider";
import { useSession } from "next-auth/react";

const TagModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, dispatch] = useReducer(tagReducer, initialTagState);

  const [nameTag, setNameTag] = useState("");
  const [tagDescription, setTagDescription] = useState("");

  const { data: session } = useSession();
  const token = useMemo(() => session?.backendToken || null, [session]);

  const { userProfile } = useAuth();

  const url = "http://localhost:8080/api/gallery/tag/create";

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("User tag input: ", userProfile?.id);

    if (!userProfile?.id || !token) return;

    const formDataTag = {
      name: nameTag,
      description: tagDescription,
      userId: userProfile?.id,
    };

    try {
      console.log("Data tag input: ", formDataTag);
      const response = await axios.post(url, formDataTag, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: TAG_ACTIONS.ADD_TAG, payload: response.data });
      window.location.reload();
      setIsModalOpen(false);
    } catch (error) {
      dispatch({ type: TAG_ACTIONS.ERROR, payload: "Failed to add tag" });
    }
  };

  // Hàm mở modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="font-sans bg-white">
      {/* Nút toggle modal */}
      <button
        type="button"
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={openModal}
      >
        <svg
          className="-me-1 -ms-1 w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {/* Main modal */}
      {isModalOpen && (
        <div
          id="crud-modal"
          aria-hidden="true"
          className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow-lg">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Tag
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={closeModal}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <div className="p-4 md:p-5">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    onChange={(e) => setNameTag(e.target.value)}
                    value={nameTag}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Type product name"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Tag Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    onChange={(e) => setTagDescription(e.target.value)}
                    value={tagDescription || ""}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write product description here"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  className="me-1 -ms-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add new tag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagModal;
