const { exec } = require("node:child_process");
const net = require("net");
const { station, receiver, restart } = require("./settings");

const station_socket = new net.Socket();
const receiver_socket = new net.Socket();

const timestamp = () => {
  z = new Date();
  return z.toLocaleString("sv");
};

////////////////// Station /////////////////////////
console.log("... Connecting to station", station);
station_socket.connect(station.port, station.ip, () => {
  console.log("... Connected to station", station);

  station_socket.on("data", (data) => {
    try {
      console.log("... data from station:", timestamp(), data.length);
      receiver_socket.write(data);
    } catch (error) {
      console.log("... error trying to upload to server");
    }
  });
});

// Handle errors
station_socket.on("error", (error) => {
  console.error("... Station error:", error);
});

// Handle connection close
station_socket.on("close", () => {
  console.log("... Station connection closed");
  console.log("######## restart app");
  setTimeout(() => {
    exec(restart);
  }, 10000);
});

////////////////// Receiver /////////////////////////

console.log("... Connecting to receiver", receiver);
receiver_socket.connect(receiver.port, receiver.ip, () => {
  console.log("... Connected to receiver", receiver);
});
// Handle errors
receiver_socket.on("error", (error) => {
  console.error("... receiver error:", error);
});

// Handle connection close
receiver_socket.on("close", () => {
  console.log("... receiver connection closed");
  console.log("######## restart app");
  setTimeout(() => {
    exec(restart);
  }, 10000);
});
