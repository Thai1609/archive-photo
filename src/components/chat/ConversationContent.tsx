import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../lib/firebase";

export default function ConversationContent({ messages }) {
  const [user] = useAuthState(auth);

  return (
    <ul className="space-y-2 min-h-[55vh]">
      {messages.map((msg, index) => (
        <li
          key={index}
          className={`p-3 rounded-lg break-words text-left ${
            msg.senderId === user?.uid
              ? "bg-blue-500 text-white self-end ml-auto max-w-[400px]"
              : "bg-gray-400 text-black self-start mr-auto  max-w-[400px]"
          }`}
        >
          {msg.text}
        </li>
      ))}
    </ul>
  );
}
