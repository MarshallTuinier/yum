const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  try {
    //Find the user with the provided email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(500).send({ error: "No user found by that email" });
    }

    //Validate the password to make sure it matches with the corresponding hash
    const validate = await user.isValidPassword(req.body.password);
    if (!validate) {
      res.status(500).send({ error: "Incorrect password" });
    }
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email
    };
    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 86400
      },
      (err, token) => {
        if (err) console.error("There is some error in the token", err);
        else {
          res.json({
            success: true,
            token: `Bearer ${token}`,
            name: user.name,
            email: user.email
          });
        }
      }
    );
  } catch (error) {
    res.send({ error });
  }
};

exports.checkToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token) {
    return res.json({
      success: false,
      message: "Auth token is not supplied"
    });
  }
  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        res.json({
          success: false,
          message: "Token is not valid"
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  }
};
