const mongoose = require("mongoose");

// import environmental variables from our variables.env file
require("dotenv").config({ path: ".env" });

// Connect to DB and handle some errors
mongoose.connect(
  process.env.DATABASE,
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise; // Tell mongoose to use promises
const db = mongoose.connection;
db.on("error", error => console.error(`There was an error: ${error.message}`));
db.once("open", () => {
  console.log("Connection to the database succeeded");
});

//Import our models
require("./models/Store");
require("./models/User");
require("./models/Review");

const app = require("./expressSetup");

// Start the Express server
app.set("port", process.env.PORT || 4003);
const server = app.listen(app.get("port"), () => {
  console.log(`Express server running on port ${server.address().port}`);
});
