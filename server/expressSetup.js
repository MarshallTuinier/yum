const express = require("express");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const path = require("path");
const routes = require("./routes");

// Configure the express server middleware
const app = express();

// Static File Serving
app.use(express.static(path.join(__dirname, "public")));

// Take the raw requests and turn them into properties that are usable in req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Expose data validation methods
app.use(expressValidator());

app.use("/", routes);

module.exports = app;
