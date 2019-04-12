const socket = io();
const form = document.querySelector("form");
const input = document.querySelector("#m");

(function() {
  var socket = io();

  form.addEventListener("submit", e => {
    e.preventDefault();
    socket.emit("chat message", input.value);
    input.value = "";
    return false;
  });

  socket.on("chat message", msg => {
    const newLine = document.createElement("li");
    newLine.textContent = msg;

    document.querySelector("#messages").append(newLine);
  });
})();
