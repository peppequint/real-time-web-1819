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
      let dataAnwb = response.data.roadEntries.map(anwb => {
        const data = {
          road: anwb.road,
          events: {
            traffic: {
              from:
                anwb.events.trafficJams &&
                anwb.events.trafficJams[0] &&
                anwb.events.trafficJams[0].from
                  ? anwb.events.trafficJams[0].from
                  : null,
              to:
                anwb.events.trafficJams &&
                anwb.events.trafficJams[0] &&
                anwb.events.trafficJams[0].to
                  ? anwb.events.trafficJams[0].to
                  : null,
              delay:
                anwb.events.trafficJams &&
                anwb.events.trafficJams[0] &&
                anwb.events.trafficJams[0].delay
                  ? anwb.events.trafficJams[0].delay
                  : null,
              distance:
                anwb.events.trafficJams &&
                anwb.events.trafficJams[0] &&
                anwb.events.trafficJams[0].distance
                  ? anwb.events.trafficJams[0].distance
                  : null
            },
            work: {
              from:
                anwb.events.roadWorks &&
                anwb.events.roadWorks[0] &&
                anwb.events.roadWorks[0].from
                  ? anwb.events.roadWorks[0].from
                  : null,
              to:
                anwb.events.roadWorks &&
                anwb.events.roadWorks[0] &&
                anwb.events.roadWorks[0].to
                  ? anwb.events.roadWorks[0].to
                  : null,
              reason:
                anwb.events.roadWorks &&
                anwb.events.roadWorks[0] &&
                anwb.events.roadWorks[0].reason
                  ? anwb.events.roadWorks[0].reason
                  : null
            },
            radar: {
              from:
                anwb.events.radars &&
                anwb.events.radars[0] &&
                anwb.events.radars[0].from
                  ? anwb.events.radars[0].from
                  : null,
              to:
                anwb.events.radars &&
                anwb.events.radars[0] &&
                anwb.events.radars[0].to
                  ? anwb.events.radars[0].to
                  : null,
              reason:
                anwb.events.radars &&
                anwb.events.radars[0] &&
                anwb.events.radars[0].reason
                  ? anwb.events.radars[0].reason
                  : null
            }
          }
        };
        return data;
      });

      let dataTime = response.data.dateTime.split(", ");
      io.emit("timestamp", dataTime[1]);

      let totalDistance = 0;
      dataAnwb.map(data => {
        let distance = data.events.traffic.distance;

        if (distance === null) {
          console.log("Geen file op de " + data.road);
        } else {
          console.log(
            "Er staat " + distance + " meter file op de " + data.road
          );
          totalDistance += distance;
        }
      });
      io.emit(
        "traffic distance",

        totalDistance,
        console.log("Totaal aantal meters file: " + totalDistance)
      );

      io.emit(
        "traffic jams",
        dataAnwb.map(data => {
          return {
            road: data.road,
            distance: data.events.traffic.distance
          };
        })
      );
    });
});

http.listen(port, () => {
  console.log(`App running on port ${port}!`);
});
