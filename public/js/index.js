const socket = io();
const form = document.querySelector("form");
const input = document.querySelector("#m");

$(function() {
  var socket = io();
  $("form").submit(function(e) {
    e.preventDefault(); // prevents page reloading
    socket.emit("chat message", $("#m").val());
    $("#m").val("");
    return false;
  });
  socket.on("chat message", function(msg) {
    $("#messages").append($("<li>").text(msg));
  });
});
