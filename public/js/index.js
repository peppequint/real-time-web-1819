const form = document.querySelector("form");
const input = document.querySelector("#m");

(function() {
  const socket = io();

  socket.on("total distance", data => {
    document.getElementById("total-distance").innerHTML = "";
    totalDistance(data);
  });

  socket.on("timestamp", data => {
    document.getElementById("timestamp").innerHTML = "";
    timeStamp(data);
  });

  socket.on("traffic", data => {
    document.getElementById("list").innerHTML = "";
    traffic(data);
  });
})();

function traffic(data) {
  data.data.pop();
  const trafficJam = data.data.forEach(traffic => {
    if (traffic.events.traffic.delay !== null) {
      const road = document.createElement("li");
      if (traffic.road.length > 4) {
        road.setAttribute("class", "road-information ");
        road.innerHTML = `
            <span class='road road-blue'>${traffic.road}</span>
            <p class='location'>Van ${traffic.events.traffic.from} naar ${
          traffic.events.traffic.to
        }</p>
            <p class='distance'><i class="material-icons md-dark">settings_ethernet</i>
            ${traffic.events.traffic.distance / 1000} kilometer</p>
            <p class='delay'><i class="material-icons md-dark">access_time</i>
            ${traffic.events.traffic.delay / 60} minuten</p>
          `;
      } else if (traffic.road.startsWith("N", 0)) {
        road.setAttribute("class", "road-information ");
        road.innerHTML = `
            <span class='road road-yellow'>${traffic.road}</span>
            <p class='location'>Van ${traffic.events.traffic.from} naar ${
          traffic.events.traffic.to
        }</p>
            <p class='distance'><i class="material-icons md-dark">settings_ethernet</i>
            ${traffic.events.traffic.distance / 1000} kilometer</p>
            <p class='delay'><i class="material-icons md-dark">access_time</i>
            ${traffic.events.traffic.delay / 60} minuten</p>
          `;
      } else if (traffic.road.startsWith("A", 0)) {
        road.setAttribute("class", "road-information ");
        road.innerHTML = `
            <span class='road road-red'>${traffic.road}</span>
            <p class='location'>Van ${traffic.events.traffic.from} naar ${
          traffic.events.traffic.to
        }</p>
            <p class='distance'><i class="material-icons md-dark">settings_ethernet</i>
            ${traffic.events.traffic.distance / 1000} kilometer</p>
            <p class='delay'><i class="material-icons md-dark">access_time</i>
            ${traffic.events.traffic.delay / 60} minuten</p>
          `;
      }
      document.getElementById("list").append(road);
    }
  });
}

function timeStamp(data) {
  const timestamp = data.data[data.data.length - 1];
  document.getElementById("timestamp").innerHTML = timestamp;
  return timestamp;
}

function totalDistance(data) {
  data.data.pop();
  let totalDistance = 0;

  data.data.map(data => {
    let distance = data.events.traffic.distance;

    if (distance === null) {
      // console.log("Geen file op de " + data.road);
    } else {
      // console.log("Er staat " + distance + " meter file op de " + data.road);
      totalDistance += distance;
    }
  });

  document.getElementById("total-distance").innerHTML =
    "Totaal aantal kilometers: " + totalDistance / 1000;
  return totalDistance;
}
