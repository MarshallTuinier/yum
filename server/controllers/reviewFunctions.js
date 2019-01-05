const mongoose = require("mongoose");
const Review = mongoose.model("Review");

exports.addReview = async (req, res) => {
  try {
    req.body.author = req.decoded.id;
    req.body.store = req.params.id;
    const newReview = new Review(req.body);
    await newReview.save();
    res.json({ message: "Review Saved" });
  } catch (error) {
    res.json({ error: error });
  }
};
