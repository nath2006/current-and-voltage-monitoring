/**
 * untuk langsung ke dalam mqtt
 */

import { useEffect, useState } from "react";
import mqtt from "mqtt";

export default function useMqtt() {
  const [data, setData] = useState({
    voltage: 0,
    current: 0,
    power: 0,
    energy: 0,
    frequency: 0,
    pf: 0,
  });

  useEffect(() => {
    const client = mqtt.connect("ws://192.168.1.6:1883");

    client.on("connect", () => {
      console.log("✅ MQTT Connected");

      client.subscribe("pzem/data", (err) => {
        if (err) {
          console.error("Subscribe Error:", err);
        } else {
          console.log("Subscribed: pzem/data");
        }
      });
    });

    client.on("message", (topic, message) => {
      console.log("Topic:", topic);
      console.log("Raw:", message.toString());

      try {
        const payload = JSON.parse(message.toString());

        console.log("Parsed:", payload);

        setData(payload);
      } catch (err) {
        console.error("JSON Error:", err);
      }
    });

    client.on("error", (err) => {
      console.error("MQTT Error:", err);
    });

    client.on("close", () => {
      console.log("MQTT Disconnected");
    });

    return () => {
      client.end();
    };
  }, []);

  return data;
}
