const form = document.querySelector("form");
const input = document.querySelector("#m");

(function() {
  const socket = io();

  socket.on("timestamp", time => {
    console.log(time);
    const timestamp = document.createElement("h2");
    timestamp.setAttribute("class", "timestamp");
    timestamp.textContent = time;

    document.querySelector("header").append(timestamp);
  });

  socket.on("traffic distance", meters => {
    console.log(meters);
    const distance = document.createElement("h2");
    distance.setAttribute("class", "distance");
    distance.textContent = "Totaal aantal kilometers: " + meters / 1000;

    document.querySelector("header").append(distance);
  });

  socket.on("traffic jams", traffic => {
    console.log(traffic);
    const trafficJam = traffic.map(traffic => {
      console.log(traffic);
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
