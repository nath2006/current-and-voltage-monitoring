import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useSocket() {
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io("http://192.168.1.6:3001");

    socket.on("connect", () => {
      console.log("Socket Connected");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket Disconnected");
      setConnected(false);
    });

    socket.on("pzem-data", (payload) => {
      setData(payload);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { data, connected };
}
