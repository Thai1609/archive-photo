"use client";
import React from "react";
import ChatForm from "./ChatForm";
import { auth } from "../../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function ChatMessages() {
  const [user] = useAuthState(auth); // Get current user

  if (!user) {
    return <p>Loading...</p>; // Or redirect to login
  }

  return (
    <div>
      <h1>Chat Room</h1>
      <ChatForm />
    </div>
  );
}
