const form = document.querySelector("form");
const input = document.querySelector("#m");

(function() {
  const socket = io();

  socket.on("timestamp", time => {
    console.log(time);
    const timestamp = document.createElement("h2");
    timestamp.setAttribute("class", "timestamp");
    timestamp.textContent = "Today at " + time;

    document.querySelector("#list").append(timestamp);
  });

  socket.on("traffic distance", meters => {
    console.log(meters);
    const distance = document.createElement("h2");
    distance.setAttribute("class", "distance");
    distance.textContent = "Total distance is " + meters + " meters";

    document.querySelector("#list").append(distance);
  });

  socket.on("traffic jams", traffic => {
    const trafficJam = traffic.map(traffic => {
      console.log(traffic);
      if (traffic.events.traffic.delay !== null) {
        const jam = document.createElement("li");
        if (traffic.road.startsWith("A", 0)) {
          console.log("A-weg");
          jam.setAttribute("class", "road-information ");
          jam.innerHTML = `
            <span class='road road-red'>${traffic.road}</span>
            <p class='location'>Van ${traffic.events.traffic.from} naar ${
            traffic.events.traffic.to
          }</p>
            <div class='properties'>
            <p class='distance'><i class="material-icons md-dark">access_time</i>
            ${traffic.events.traffic.distance}</p>
            <p class='delay'><i class="material-icons md-dark">settings_ethernet</i>
            ${traffic.events.traffic.delay}</p>
            </div>
          `;
        } else if (traffic.road.startsWith("N", 0)) {
          console.log("A-weg");
          jam.setAttribute("class", "road-information ");
          jam.innerHTML = `
            <span class='road road-yellow'>${traffic.road}</span>
            <p class='location'>Van ${traffic.events.traffic.from} naar ${
            traffic.events.traffic.to
          }</p>
            <div class='properties'>
            <p class='distance'><i class="material-icons md-dark">access_time</i>
            ${traffic.events.traffic.distance}</p>
            <p class='delay'><i class="material-icons md-dark">settings_ethernet</i>
            ${traffic.events.traffic.delay}</p>
            </div>
          `;
        }
        document.querySelector("#list").append(jam);
      }
    });
  });
})();
