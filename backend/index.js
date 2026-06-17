const express = require("express");
const http = require("http");
const cors = require("cors");
const mqtt = require("mqtt");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// =====================
// STATE
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
const mqttClient = mqtt.connect("mqtt://192.168.1.103:1883");

mqttClient.on("connect", () => {
  console.log("[MQTT] Connected");
  mqttClient.subscribe("pzem/data");
});

mqttClient.on("message", (topic, message) => {
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

    console.log("[MQTT] Updated");
  } catch (err) {
    console.error("[MQTT] Parse Error:", err.message);
  }
});

// =====================
// REST API
// =====================
app.get("/api/pzem/latest", (req, res) => {
  res.json({
    success: true,
    data: {
      telemetry: latestData,
      device: deviceStatus,
    },
  });
});

// =====================
// START SERVER
// =====================
const PORT = 3001;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[SERVER] Running on http://192.168.1.6:${PORT}`);
});
