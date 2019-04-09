const express = require("express");
const path = require("path");

const app = express();
const port = 7070;

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public/views"));

app.get("/", (req, res) => {
  res.render("pages/index");
});

app.listen(port, () => {
  console.log(`App running on port ${port}!`);
});