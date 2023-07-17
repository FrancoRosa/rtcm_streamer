const net = require("net");
const { base, receiver } = require("./settings");
const station = net.createConnection({ port: base.port, host: base.ip });
const server = net.createConnection({
  port: receiver.port,
  host: receiver.host,
});

station.on("connect", () => {
  console.log("... conected to base: ", base);
  station.on("data", (data) => {
    console.log(data.toString("utf8"));
    try {
      server.write(data);
    } catch (error) {
      console.log("server error!!");
    }
  });
});

station.on("disconect", () => {
  console.log(".. disconected");
});

server.on("connect", () => {
  console.log("... connected to receiver: ", receiver);

  server.on("data", (data) => {
    console.log(data.toString("utf8"));
  });
});
