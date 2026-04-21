// socket.ts
import { io } from "socket.io-client";

export const createSocket = () => {
  console.log("🧠 socket factory called"); // debug
  return io("http://localhost:3000/chat", {
    autoConnect: false,
  });
};