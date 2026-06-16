// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const mqtt = require("mqtt");
// const cors = require("cors");

// const app = express();

// app.use(cors());
// app.use(express.json());

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

// // =====================
// // STORE DATA TERAKHIR
// // =====================

// let latestPzemData = {
//   voltage: 0,
//   current: 0,
//   power: 0,
//   energy: 0,
//   frequency: 0,
//   pf: 0,
//   updatedAt: null,
// };

// // =====================
// // MQTT CONNECT
// // =====================

// const mqttClient = mqtt.connect(
//   "mqtt://192.168.1.6:1883"
// );

// mqttClient.on("connect", () => {
//   console.log("MQTT Connected");

//   mqttClient.subscribe("pzem/data");
// });

// mqttClient.on("message", (topic, message) => {
//   try {
//     const payload = JSON.parse(
//       message.toString()
//     );

//     latestPzemData = {
//       ...payload,
//       updatedAt: new Date(),
//     };

//     console.log(
//       "MQTT DATA:",
//       latestPzemData
//     );

//     io.emit(
//       "pzem-data",
//       latestPzemData
//     );
//   } catch (err) {
//     console.error(err);
//   }
// });

// // =====================
// // API
// // =====================

// app.get("/api/pzem/latest", (req, res) => {
//   res.json({
//     success: true,
//     data: latestPzemData,
//   });
// });

// // =====================
// // SOCKET
// // =====================

// io.on("connection", (socket) => {
//   console.log(" Client Connected");

//   // kirim data terakhir saat client connect
//   socket.emit(
//     "pzem-data",
//     latestPzemData
//   );

//   socket.on("disconnect", () => {
//     console.log("Client Disconnected");
//   });
// });

// // =====================
// // RUN SERVER
// // =====================

// server.listen(3001, "0.0.0.0", () => {
//   console.log(
//     " Server Running On Port 3001"
//   );
// });
const express = require("express");
const http = require("http");
const mqtt = require("mqtt");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

let latestData = {
  voltage: 0,
  current: 0,
  power: 0,
  energy: 0,
  frequency: 0,
  pf: 0,
};

const mqttClient = mqtt.connect(
  "mqtt://192.168.1.6:1883"
);

mqttClient.on("connect", () => {
  console.log("MQTT Connected");

  mqttClient.subscribe("pzem/data");
});

mqttClient.on("message", (topic, message) => {
  try {
    const payload = JSON.parse(
      message.toString()
    );

    latestData = payload;

    console.log(
      "Latest Data:",
      latestData
    );
  } catch (err) {
    console.error(err);
  }
});

app.get("/api/pzem/latest", (req, res) => {
  res.json({
    success: true,
    data: latestData,
  });
});

server.listen(3001, "0.0.0.0", () => {
  console.log(
    "API Running: http://192.168.1.6:3001"
  );
});
