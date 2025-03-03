"use client";
import { onChildAdded, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../lib/firebase";
import ConversationContent from "./ConversationContent";

export default function ChatForm({ chatRoomId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user] = useAuthState(auth);
  const [nameChatWith, setNameChatWith] = useState("");

  useEffect(() => {
    if (!chatRoomId) return;
    const messagesRef = ref(db, `chats/${chatRoomId}/messages`);

    const unsubscribe = onChildAdded(messagesRef, (snapshot) => {
      const newMessage = snapshot.val();
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => unsubscribe();
  }, [chatRoomId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const messagesRef = ref(db, `chats/${chatRoomId}/messages`);
    const newMessageRef = push(messagesRef);

    await set(newMessageRef, {
      senderId: user?.uid,
      senderName: user?.displayName,
      text: newMessage,
      createdAt: Date.now(),
    });

    setNewMessage("");
  };
  const chatWith  = sessionStorage.getItem("chatwith");

  return (
    <>
      <div className="w-2/3 bg-gray-50 flex flex-col min-h-[60vh]">
        <div className="bg-white p-4 border-b flex items-center">
          <img
            // src={user?.photoURL}
            alt="Avatar"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h1 className="text-lg font-semibold">{chatWith}</h1>
            <p className="text-sm text-gray-500">Hoạt động trước</p>
          </div>
        </div>

        <div className="overflow-y-auto p-4 space-y-3 max-h-[55vh]">
          <ConversationContent messages={messages} />
        </div>

        <div className="p-4 bg-white border-t flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 p-2 border rounded-lg"
            maxLength={500}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newMessage.trim()) {
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()} // Vô hiệu hóa nếu không có nội dung
            className={`ml-2 px-4 py-2 rounded-lg ${
              newMessage.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Gửi
          </button>
        </div>
        <div className="text-left text-sm text-gray-500 mx-5 mb-2">
          {500 - newMessage.length}/500
        </div>
      </div>
    </>
  );
}
