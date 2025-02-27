import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";

export default function ConversationContent() {
  const [conversations, setConversations] = useState<any[]>([]);
  useEffect(() => {
    onValue(ref(db, "conversations"), (snap) => {
      if (snap.val()) {
        const items: any[] = [];

        snap.forEach((item) => {
          items.push({
            key: item.key,
            ...item.val(),
          });
        });
        setConversations(items);
      }
    });
  });
  return (
    <div>
      <ul>
        {conversations.map((conv) => (
          <li key={conv.key}>{conv.messages}</li>
        ))}
      </ul>
    </div>
  );
}
