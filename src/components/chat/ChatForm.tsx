"use client";
import { useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";
import { useSearchParams } from "next/navigation";

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp?: any;
}

export default function ChatPage() {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [sellerId, setSellerId] = useState("");

  const searchParams = useSearchParams();
  const mailSeller = searchParams?.get("mailSeller");

  useEffect(() => {

    if (!mailSeller) return;

    const getSellerByEmail = async () => {
      const usersRef = collection(db, "users");
      console.log("usersRef: ", usersRef);

      const q = query(usersRef, where("email", "==", mailSeller));
      
      const querySnapshot = await getDocs(q);
      console.log("querySnapshot:", querySnapshot);

      if (!querySnapshot.empty) {
        const sellerData = querySnapshot.docs[0].data();
        setSellerId(sellerData.uid);
        console.log("sellerData:", sellerData);

      }
    };

    getSellerByEmail();
  }, [mailSeller]);

  useEffect(() => {
    console.log("Chat ID:", sellerId);

    if (!user || !sellerId) return;

    const chatId =
      user.uid < sellerId
        ? `${user.uid}_${sellerId}`
        : `${sellerId}_${user.uid}`;
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    console.log("Chat ID:", chatId);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Message))
      );
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    });

    return () => unsubscribe();
  }, [user, sellerId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !sellerId) return;

    const chatId =
      user.uid < sellerId
        ? `${user.uid}_${sellerId}`
        : `${sellerId}_${user.uid}`;
    const chatRef = doc(db, "chats", chatId);
    const messagesRef = collection(chatRef, "messages");

    await setDoc(
      chatRef,
      {
        participants: [user.uid, sellerId],
        lastMessage: newMessage,
        lastTimestamp: serverTimestamp(),
      },
      { merge: true }
    );

    await addDoc(messagesRef, {
      text: newMessage,
      sender: user.uid,
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };

  if (!user) {
    return <p className="text-center mt-4">Please log in to chat.</p>;
  }

  return (
    <div className="flex flex-col min-h-[60vh] bg-gray-100 p-4 max-w-lg mx-auto shadow-lg rounded-lg">
      <div className="border-b p-4 bg-white rounded-t-lg">
        <h2 className="font-bold text-center">Chat with Seller {sellerId}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 h-96 bg-white rounded-b-lg">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg w-fit max-w-xs ${
              msg.sender === user.uid
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-300"
            }`}
          >
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={sendMessage}
        className="p-3 border-t bg-white flex rounded-b-lg"
      >
        <input
          type="text"
          className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
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
