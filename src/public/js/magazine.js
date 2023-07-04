const socket = io();

socket.on("message", (message) => {
  console.log(message);
});

socket.on("newRecord", (newRecord) => {
  console.log(newRecord);
});
