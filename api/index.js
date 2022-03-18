const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Server
const app = express();

// Routers por Models
const meals = require("./routes/meals.js");
const orders = require("./routes/orders.js");
const auth = require("./routes/auth.js");

// Conectar Base datos Mongo Atlas
const username = encodeURIComponent(process.env.MONGO_USER);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const cluster = process.env.MONGO_CLUSTER;
const folder = process.env.MONGO_FOLDER;
const uri = `mongodb+srv://${username}:${password}@${cluster}/${folder}`;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Midellware
app.use(bodyParser.json())
app.use(cors());

app.use("/api/auth", auth);
app.use("/api/meals", meals);
app.use("/api/orders", orders);

module.exports = app;

// app.get("*", (req, res) => {
//   res.send("holamundo");
// });
