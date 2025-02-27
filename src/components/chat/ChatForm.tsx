"use client";
import { useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { push, ref, serverTimestamp } from "firebase/database";
import { auth, db } from "../../../lib/firebase";
import ConversationContent from "./ConversationContent";

export default function ChatPage() {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState("");

  const [sellerId, setSellerId] = useState("");

  if (!user) {
    return <p className="text-center mt-4">Please log in to chat.</p>;
  }
  const handlerSendMessage = (event: any) => {
    event.preventDefault();

    if (!messages) {
      console.error("Vui long nhap noi dung!");
    }

    const data = {
      messages,
      from: "Michael", // Người gửi
      to: "uid_to", // ID người nhận
      createdAt: serverTimestamp(), // Timestamp hiện tại
      user1: "Michael", // Lưu username người gửi
      user2: "uid", // Lưu UID của người nhận
    };
    push(ref(db, "conversations"), data).then(() => {
      setMessages("");
      console.log("Send Ok");
    });
  };

  return (
    <div className="flex flex-col min-h-[60vh] bg-gray-100 p-4 max-w-lg mx-auto shadow-lg rounded-lg">
      <div className="border-b p-4 bg-white rounded-t-lg">
        <h2 className="font-bold text-center">Chat with Seller {sellerId}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 h-96 bg-white rounded-b-lg">
        <ConversationContent></ConversationContent>
      </div>

      <form
        onSubmit={handlerSendMessage}
        className="p-3 border-t bg-white flex rounded-b-lg"
      >
        <input
          type="text"
          className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={messages}
          onChange={(e) => setMessages(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-full ml-2 hover:bg-blue-600 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
