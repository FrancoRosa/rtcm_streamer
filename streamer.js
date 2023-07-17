const { receiver, server } = require("./settings");
const express = require("express");
const socket = require("socket.io");

const net = require("net");
const tcpServer = net.createServer();

const app = express();

const eXserver = app.listen(server.port, () => {
  console.log(`... socketio listening on ${server.port}`);
});

const io = socket(eXserver);
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
  return z.toLocaleString("sv");
};

setInterval(() => {
  if (error_count > error_limit) {
    console.error(timestamp(), "... restarting service");
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
  console.log("... tcp server listening on", receiver.port);
});

tcpServer.on("connection", (socket) => {
  console.log("... new client arrived");
  socket.on("data", (res) => {
    console.log(res.toString("utf8"));
    error_count = 0;
    io.sockets.emit("rtcm", res);
    fresh_data = true;
    payload = res;
  });
});

tcpServer.on("error", (err) => {
  console.log(err);
  console.error(timestamp(), err.toString());
});
