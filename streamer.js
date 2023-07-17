const { receiver } = require("./settings");
const express = require("express");
const socket = require("socket.io");

const net = require("net");
const tcpServer = net.createServer();

const PORT = 5000;
const app = express();

const server = app.listen(PORT, () => {
  console.log(`...listening on ${PORT}`);
});

const io = socket(server);
let error_count = 0;
const error_limit = 3;
let clients_count = 0;
let fresh_data = false;
let payload = "";

io.on("connection", (socket) => {
  console.log(timestamp(), "... client connected");
  clients_count += 1;

  socket.on("disconnect", () => {
    console.log(timestamp(), "... client disconnected");
    clients_count -= 1;
  });
});

const timestamp = () => {
  z = new Date();
  return z.toLocaleString();
};

setInterval(() => {
  if (error_count > error_limit) {
    console.error(timestamp(), "... restarting service");
    exec("pm2 restart ntrip");
  }
  error_count += 1;
}, 5000);

setInterval(() => {
  if (fresh_data) {
    console.log(
      `${timestamp()}, clients: ${clients_count}, payload: ${payload.length}`
    );
    fresh_data = false;
    payload = "";
  }
}, 1000);

tcpServer.listen(receiver.port, "0.0.0.0", (sock) => {
  console.log("server listening on 5001");
});

tcpServer.on("connection", (socket) => {
  console.log("new client arrived");
  socket.on("data", (res) => {
    console.log(res);
    error_count = 0;
    io.sockets.emit("rtcm", data);
    fresh_data = true;
    payload = data;
  });
});

tcpServer.on("error", (socket) => {
  console.error(timestamp(), data.toString());
});
