/**
 * UNTUK KONEKSI KE SOKET
 */

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useSocket() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const socket = io(
      "http://192.168.1.6:3001"
    );

    socket.on("connect", () => {
      console.log("Socket Connected");
    });

    socket.on("pzem-data", (payload) => {
      console.log(payload);

      setData(payload);
    });

    socket.on("disconnect", () => {
      console.log("Socket Disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return data;
}
