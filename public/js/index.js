const form = document.querySelector("form");
const input = document.querySelector("#m");

(function() {
  const socket = io();

  form.addEventListener("submit", e => {
    e.preventDefault();
    socket.emit("chat message", input.value);
    input.value = "";
    return false;
  });

  socket.on("username", msg => {
    const newLine = document.createElement("li");
    newLine.textContent = msg;
    newLine.setAttribute("class", "username");

    document.querySelector("#messages").append(newLine);
  });

  socket.on("chat message", msg => {
    const newLine = document.createElement("li");
    newLine.textContent = msg;
    newLine.setAttribute("class", "user-message");

    document.querySelector("#messages").append(newLine);
  });

  socket.on("bot message", msg => {
    msg.map(x => {
      const newLine = document.createElement("li");
      newLine.setAttribute("class", "bot-message");
      newLine.textContent = x;
      console.log(x);

      document.querySelector("#messages").append(newLine);
    });
  });
})();
