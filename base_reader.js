const net = require("net");
const { base, base, receiver } = require("./settings");
const base = net.createConnection({ port: base.port, host: base.ip });
const server = net.createConnection({
  port: receiver.port,
  host: receiver.host,
});

base.on("connect", () => {
  console.log("... conected to base: ", base);
  base.on("data", (data) => {
    console.log(data.toString("utf8"));
    try {
      server.write(data);
    } catch (error) {
      console.log("server error!!");
    }
  });
});

base.on("disconect", () => {
  console.log(".. disconected");
});

server.on("connect", () => {
  console.log("... connected to receiver: ", base);

  server.on("data", (data) => {
    console.log(data.toString("utf8"));
  });
});
