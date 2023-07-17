const connmanager = require("tcp-ip-connman");
const heartBeatFactory = require("heartbeatjs");

const { base } = require("./settings");

const heartBeat = heartBeatFactory();
heartBeat.setPing("Marco");
heartBeat.setPong("Polo");
heartBeat.setBeatInterval(50);
heartBeat.setBeatTimeout(150);

const client = connmanager(heartBeat);

client
  .connect({ host: base.ip, port: base.port })
  .then(() => console.log("success!"))
  .catch(console.log);

client.onOpen((online) => {
  console.log(`Connection established: ${online}`);
});

client.onClose((online) => {
  console.log(`Connection established: ${online}`);
});

client.onRead((data) => {
  console.log(`Data received: ${JSON.stringify(data)}`);
});

client.onRetry((error, num) => {
  console.log(`Retry number ${num} due to error ${JSON.stringify(error)}`);
});
