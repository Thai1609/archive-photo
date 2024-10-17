import React from "react";
import { Button } from "reactstrap";

export default function AddGalleries() {
  return (
    <button
      type="button"
      className="px-5 py-2.5 flex items-center justify-center rounded text-white text-sm tracking-wider font-medium border-none outline-none bg-blue-600 hover:bg-blue-700 active:bg-blue-600"
    >
      ADD
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16px"
        fill="currentColor"
        className="ml-2 inline"
        viewBox="0 0 24 24"
      >
       
      </svg>
    </button>
  );
}
