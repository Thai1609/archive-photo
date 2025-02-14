import React from "react";

const ModalDeleteTag = ({ show, onConfirm, onCancel, tagName }) => {
  if (!show) return null; // If show is false, don't render the modal.

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Are you sure you want to delete all images associated with this tag:
          <span className="font-bold"> {tagName}</span>?
        </h3>
        <div className="flex justify-between">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Yes, Delete
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDeleteTag;
