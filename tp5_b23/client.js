var udp = require("dgram");
var buffer = require("buffer");
const config = require("./conf.json");
const readline = require("readline");
var today = new Date();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

var client = udp.createSocket("udp4");

rl.on("line", (input) => {
  let payload;
  let utf8Encode = new TextEncoder();
  let length;
  let type;
  let direction;
  let date;

  switch (input) {
    case "haut":
      length = input.length;
      type = 0;
      date = today.getTime();
      direction = "h";
      payload = utf8Encode.encode(length + type + date + direction);
      break;
    case "bas":
      length = input.length;
      type = 0;
      date = today.getTime();
      direction = "b";
      payload = utf8Encode.encode(length + type + date + direction);
      break;
    case "gauche":
      length = input.length;
      type = 0;
      date = today.getTime();
      direction = "g";
      payload = utf8Encode.encode(length + type + date + direction);
      break;
    case "droite":
      length = input.length;
      type = 0;
      date = today.getTime();
      direction = "d";
      payload = utf8Encode.encode(length + type + date + direction);
      break;
    default:
      payload = utf8Encode.encode("invalid input");
      console.log("invalid input");
      break;
  }

  client.send(payload, config.host.port, "localhost", function (error) {
    if (error) {
      client.close();
    } else {
      console.log("Data sent !!!");
    }
  });
});
