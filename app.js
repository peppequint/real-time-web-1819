const express = require("express");
const app = express();
const http = require("http").Server(app);
const axios = require("axios");

const path = require("path");

const io = require("socket.io")(http);

const port = process.env.PORT || 7888;

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public/views"));

app.get("/", (req, res) => {
  res.render("pages/index");
});

io.on("connection", socket => {
  let user = socket.id;
  let username;
  axios
    .post("https://api.codetunnel.net/random-nick", {
      dataType: "json"
    })
    .then(response => {
      console.log("test");
      username = response.data.nickname;
      io.emit(
        "bot message",
        response.data.nickname + " connected to the chat!"
      );
      console.log(response.data.nickname + " connected to the chat!");
    });

  socket.on("chat message", msg => {
    if (msg) {
      console.log("Message: " + msg);
      io.emit("username", username + " says..");
      io.emit("chat message", msg);
    }
  });
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

http.listen(port, () => {
  console.log(`App running on port ${port}!`);
});
