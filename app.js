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
  axios
    .post("https://www.anwb.nl/feeds/gethf", {
      dataType: "json"
    })
    .then(response => {
      let anwbData = response.data.roadEntries.map(x => {
        const data = {
          road: x.road,
          events: {
            traffic: {
              from:
                x.events.trafficJams &&
                x.events.trafficJams[0] &&
                x.events.trafficJams[0].from
                  ? x.events.trafficJams[0].from
                  : null,
              to:
                x.events.trafficJams &&
                x.events.trafficJams[0] &&
                x.events.trafficJams[0].to
                  ? x.events.trafficJams[0].to
                  : null,
              delay:
                x.events.trafficJams &&
                x.events.trafficJams[0] &&
                x.events.trafficJams[0].delay
                  ? x.events.trafficJams[0].delay
                  : null,
              distance:
                x.events.trafficJams &&
                x.events.trafficJams[0] &&
                x.events.trafficJams[0].distance
                  ? x.events.trafficJams[0].distance
                  : null
            },
            work: {
              from:
                x.events.roadWorks &&
                x.events.roadWorks[0] &&
                x.events.roadWorks[0].from
                  ? x.events.roadWorks[0].from
                  : null,
              to:
                x.events.roadWorks &&
                x.events.roadWorks[0] &&
                x.events.roadWorks[0].to
                  ? x.events.roadWorks[0].to
                  : null,
              reason:
                x.events.roadWorks &&
                x.events.roadWorks[0] &&
                x.events.roadWorks[0].reason
                  ? x.events.roadWorks[0].reason
                  : null
            },
            radar: {
              from:
                x.events.radars && x.events.radars[0] && x.events.radars[0].from
                  ? x.events.radars[0].from
                  : null,
              to:
                x.events.radars && x.events.radars[0] && x.events.radars[0].to
                  ? x.events.radars[0].to
                  : null,
              reason:
                x.events.radars &&
                x.events.radars[0] &&
                x.events.radars[0].reason
                  ? x.events.radars[0].reason
                  : null
            }
          }
        };
        return data;
      });

      io.emit(
        "bot message",

        anwbData.map(x => {
          return x.road;
        })

        // list of traffic jams
      );
    });
  //
  // socket.on("chat message", msg => {
  //   if (msg) {
  //     console.log("Message: " + msg);
  //     io.emit("username", username + " says..");
  //     io.emit("chat message", msg);
  //   }
  // });
  // console.log("A user connected");
  // socket.on("disconnect", () => {
  //   console.log("A user disconnected");
  // });
});

http.listen(port, () => {
  console.log(`App running on port ${port}!`);
});
