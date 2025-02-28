"use client";
import React, { useEffect, useState } from "react";
import { db, auth } from "../../../lib/firebase";
import { ref, onValue } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";

export default function ChatList({ onSelectChat }) {
  const [chatRooms, setChatRooms] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) return;
    const chatRoomsRef = ref(db, "chats");

    const unsubscribe = onValue(chatRoomsRef, (snapshot) => {
      if (!snapshot.exists()) {
        setChatRooms([]);
        return;
      }
console.log()
      const rooms = Object.entries(snapshot.val()).map(([key, value]: any) => ({
        chatRoomId: key,
        participants: value.participants ? Object.keys(value.participants) : [],
      }));

      const filteredRooms = rooms.filter((room) =>
        room.participants.includes(user.uid)
      );

      setChatRooms(filteredRooms);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="w-1/3 bg-white border-r p-3">
      <h2 className="text-lg font-semibold mb-3">Danh sách hội thoại</h2>
      {chatRooms.length === 0 ? (
        <p className="text-gray-500">Không có hội thoại nào.</p>
      ) : (
        chatRooms.map((chat) => (
          <div
            key={chat.chatRoomId}
            className="p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
            onClick={() => {
              sessionStorage.setItem("currentChatRoom", chat.chatRoomId);
              onSelectChat(chat.chatRoomId);
            }}
          >
            Hội thoại: {chat.chatRoomId}
          </div>
        ))
      )}
    </div>
  );
}
