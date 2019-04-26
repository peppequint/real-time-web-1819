const express = require("express");
const app = express();
const fetch = require("node-fetch");

const http = require("http").Server(app);
const axios = require("axios");

const path = require("path");

const io = require("socket.io")(http);

const port = process.env.PORT || 7888;

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public/views"));

app.get("/", async (req, res) => {
  try {
    const data = await dataAnwb().then(render => {
      res.render("pages/index", {
        anwb: render
      });
    });
  } catch (error) {
    console.log(error);
  }
});

function dataAnwb() {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await fetch("https://www.anwb.nl/feeds/gethf");
      let data = await results.json();
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

function filterAnwb(data) {
  return new Promise(async resolve => {
    let timestamp = data.dateTime.split(", ")[1];

    let dataAnwb = data.roadEntries.map(anwb => {
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

    let filteredData = dataAnwb.concat(timestamp);

    resolve(filteredData);
  });
}

io.on("connection", async function(socket) {
  async function request() {
    try {
      let data = await dataAnwb().then(data => filterAnwb(data));

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async function call() {
    console.log("New update");
    let results = await request();
    io.emit("total distance", {
      data: results
    });
    io.emit("timestamp", {
      data: results
    });
    io.emit("traffic", {
      data: results
    });
  }

  call();
  setInterval(call, 180000);
});

http.listen(port, () => {
  console.log(`App running on port ${port}!`);
});
