"use client";
import React, { useState } from "react";
import ChatForm from "./ChatForm";
import ChatList from "./ChatList";

export default function ChatMessages() {
  const [selectedChat, setSelectedChat] = useState(
    sessionStorage.getItem("currentChatRoom") || null
  );

  return (
    <>
      <header className="bg-blue-600 text-white text-center h-9">
        <h1 className="text-lg font-semibold">Phòng Chat</h1>
      </header>
      <div className="flex min-h-[80vh] pb-5">
        <ChatList onSelectChat={setSelectedChat} />
        {selectedChat ? <ChatForm chatRoomId={selectedChat} /> : <p>Chọn hội thoại</p>}
      </div>
    </>
  );
}
