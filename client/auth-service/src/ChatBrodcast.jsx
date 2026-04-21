import React, { useEffect, useRef, useState } from "react";
import { createSocket } from "./socket";

export default function ChatBrodcast() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socket = useRef(null);

  useEffect(() => {
    socket.current = createSocket();
    socket.current.connect();

    const handleMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.current.on("receiveMessage", handleMessage);

    return () => {
      socket.current.off("receiveMessage", handleMessage);
      socket.current.disconnect();
    };
  }, []); // ✅ fixed

  const sendMessage = () => {
    socket.current.emit("sendMessage", { message: input }); // ✅ fixed
    setInput("");
  };

  return (
    <div>
      <div>
        {messages.map((msg, i) => (
          <p key={i}>{msg.message}</p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>send</button>
    </div>
  );
}