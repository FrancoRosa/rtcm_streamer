const station = {
  ip: "169.254.1.0",
  port: 5018,
};
const receiver = {
  ip: "mandor.pe",
  port: 5001,
};

const server = {
  port: 5002,
};

const restart = "sudo pm2 restart station reader";

exports.station = station;
exports.receiver = receiver;
exports.server = server;
exports.restart = restart;
