const mongoose = require("mongoose");
const md5 = require("md5");
const User = mongoose.model("User");

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody("name");
  req.checkBody("name", "You must enter a name!").notEmpty();
  req.checkBody("email", "You must enter a valid email!").isEmail();
  req.sanitizeBody("email").normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody("password", "Password Cannt be Blank!").notEmpty();
  req
    .checkBody("passwordConfirm", "Confirmation Password cannt be blank")
    .notEmpty();
  req
    .checkBody("passwordConfirm", "Ooops! Passwords do not match")
    .equals(req.body.password);
  const errors = req.validationErrors();
  if (errors) {
    res.send({ error: errors });
    return;
  }
  next(); // There were no errors
};

exports.register = async (req, res, next) => {
  try {
    const hash = md5(req.body.email);
    const user = new User({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      emailHash: hash
    });
    const data = await user.save();
    const email = data.email;
    res.send({ message: "Successfully Registered", email });
  } catch (error) {
    console.log(error);
    res.send({ error: error });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.decoded.id });
    res.send({
      success: true,
      name: user.name,
      email: user.email,
      id: user._id,
      hearts: user.hearts,
      emailHash: user.emailHash
    });
  } catch (error) {
    res.send({ error: error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      email: req.body.email
    };

    const user = await User.findOneAndUpdate(
      { _id: req.decoded.id },
      { $set: updates },
      { new: true, runValidators: true, context: "query" }
    );

    res.send({
      success: true,
      userData: user
    });
  } catch (error) {
    res.send({ error: error });
  }
};

exports.heartStore = async (req, res) => {
  try {
    const user = await User.findById(req.decoded.id);
    const hearts = user.hearts.map(obj => obj.toString());
    const operator = hearts.includes(req.params.id) ? "$pull" : "$addToSet";
    const updatedUser = await User.findByIdAndUpdate(
      req.decoded.id,
      { [operator]: { hearts: req.params.id } },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.send({ error: error });
  }
};
