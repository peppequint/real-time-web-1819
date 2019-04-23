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

  socket.on("traffic distance", meters => {
    console.log(meters);
    const distance = document.createElement("h2");
    distance.setAttribute("class", "distance");
    distance.textContent = "Total distance is " + meters + " meters";

    document.querySelector("#messages").append(distance);
  });

  socket.on("timestamp", time => {
    console.log(time);
    const timestamp = document.createElement("h2");
    timestamp.setAttribute("class", "timestamp");
    timestamp.textContent = "Today at " + time;

    document.querySelector("#messages").append(timestamp);
  });

  socket.on("traffic jams", traffic => {
    console.log(traffic);
  });
})();
