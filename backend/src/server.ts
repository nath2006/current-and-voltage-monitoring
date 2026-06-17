import "dotenv/config";

import express from "express";
import http from "http";
import cors from "cors";
import mqtt from "mqtt";

import pzemRoutes from "./routes/pzemRoutes.ts";
import { maybeRecordReading } from "./services/readingService.ts";
import { startScheduledJobs } from "./services/scheduler.ts";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// =====================
// STATE (live data, in-memory, untuk realtime polling)
// =====================
let latestData = {
  voltage: 0,
  current: 0,
  power: 0,
  energy: 0,
  frequency: 0,
  pf: 0,
  updatedAt: null,
};

let deviceStatus = {
  online: false,
  lastUpdate: null,
};

let offlineTimer = null;

// =====================
// MARK DEVICE ONLINE
// =====================
function markOnline() {
  deviceStatus.online = true;
  deviceStatus.lastUpdate = new Date().toISOString();

  if (offlineTimer) clearTimeout(offlineTimer);

  offlineTimer = setTimeout(() => {
    deviceStatus.online = false;
  }, 5000);
}

// =====================
// MQTT
// =====================
const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL || "mqtt://192.168.1.8:1883");

mqttClient.on("connect", () => {
  console.log("[MQTT] Connected");
  mqttClient.subscribe(process.env.MQTT_TOPIC || "pzem/data");
});

mqttClient.on("message", async (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    const now = new Date().toISOString();

    latestData = {
      voltage: payload.voltage,
      current: payload.current,
      power: payload.power,
      energy: payload.energy,
      frequency: payload.frequency,
      pf: payload.pf,
      updatedAt: now,
    };

    markOnline();

    // Downsampling: hanya tersimpan ke DB tiap interval tertentu (lihat readingService)
    const wasSaved = await maybeRecordReading(latestData);
    if (wasSaved) {
      console.log("[DB] Reading saved at", now);
    }

    console.log("[MQTT] Updated");
  } catch (err) {
    console.error("[MQTT] Parse Error:", err.message);
  }
});

mqttClient.on("error", (err) => {
  console.error("[MQTT] Connection error:", err.message);
});

// =====================
// REST API
// =====================

// Live data (real-time polling, tidak melalui DB)
app.get("/api/pzem/latest", (req, res) => {
  res.json({
    success: true,
    data: {
      telemetry: latestData,
      device: deviceStatus,
    },
  });
});

// Fitur history, heatmap, events, summary, cost (lihat src/routes/pzemRoutes.js)
app.use("/api/pzem", pzemRoutes);

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 3001;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[SERVER] Running on http://0.0.0.0:${PORT}`);
  startScheduledJobs();
});
