const form = document.querySelector("form");
const input = document.querySelector("#m");

(function() {
  const socket = io();

  socket.on("timestamp", (time, data) => {
    console.log(time);
    const timestamp = document.createElement("h2");
    timestamp.setAttribute("class", "timestamp");
    timestamp.textContent = time;

    document.querySelector("header").append(timestamp);
  });

  socket.on("traffic distance", data => {
    const distance = document.createElement("h2");

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
    let totalDistance = 0;

    dataAnwb.map(data => {
      let distance = data.events.traffic.distance;

      if (distance === null) {
        console.log("Geen file op de " + data.road);
      } else {
        totalDistance += distance;
      }
      return totalDistance;
    });

    distance.setAttribute("class", "total-distance");
    distance.innerHTML = " ";
    distance.innerHTML = "Totaal aantal kilometers: " + totalDistance / 1000;
    document.querySelector("header").append(distance);
  });

  socket.on("traffic jams", traffic => {
    const trafficJam = traffic.forEach(traffic => {
      if (traffic.events.traffic.delay !== null) {
        const jam = document.createElement("li");
        if (traffic.road.startsWith("A", 0)) {
          jam.setAttribute("class", "road-information ");
          jam.innerHTML = `
            <span class='road road-red'>${traffic.road}</span>
            <p class='location'>Van ${traffic.events.traffic.from} naar ${
            traffic.events.traffic.to
          }</p>
            <p class='distance'><i class="material-icons md-dark">settings_ethernet</i>
            ${traffic.events.traffic.distance / 1000} kilometer</p>
            <p class='delay'><i class="material-icons md-dark">access_time</i>
            ${traffic.events.traffic.delay / 60} minuten</p>
          `;
        } else if (traffic.road.startsWith("N", 0)) {
          jam.setAttribute("class", "road-information ");
          jam.innerHTML = `
            <span class='road road-yellow'>${traffic.road}</span>
            <p class='location'>Van ${traffic.events.traffic.from} naar ${
            traffic.events.traffic.to
          }</p>
            <p class='distance'><i class="material-icons md-dark">settings_ethernet</i>
            ${traffic.events.traffic.distance / 1000} kilometer</p>
            <p class='delay'><i class="material-icons md-dark">access_time</i>
            ${traffic.events.traffic.delay / 60} minuten</p>
          `;
        }
        document.querySelector("#list").append(jam);
      }
    });
  });
})();

function filterData(data) {
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

  return dataAnwb;
}
