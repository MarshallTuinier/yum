const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const validator = require("validator");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Invalid Email Address"],
    required: "Please enter an email"
  },
  name: {
    type: String,
    required: "Please enter a name",
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  hearts: [{ type: mongoose.Schema.ObjectId, ref: "Store" }],
  emailHash: {
    type: String,
    required: true
  }
});

userSchema.pre("save", async function(next) {
  // Hash the password
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

// This method will be used to verify credentials
userSchema.methods.isValidPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model("User", userSchema);
