const mongoose = require("mongoose");
const Store = mongoose.model("Store");
const multer = require("multer");
const uuid = require("uuid");
const sharp = require("sharp");
const cloudinary = require("cloudinary");
const fs = require("fs");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Options
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith("image/");
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: "That filetype isn't allowed" }, false);
    }
  }
};

exports.upload = multer(multerOptions).single("photo");

exports.resize = async (req, res, next) => {
  // Check if there is no new file to resize
  if (!req.file) {
    next(); // Skip this
  }

  // Create a unique filename for our photo
  fileName = `${uuid.v4()}`;

  // Resize our photo, and convert the buffer to the file format that was sent
  const photo = await sharp(req.file.buffer)
    .resize(800, null)
    .toFile(fileName);

  // Upload the file to Cloudinary, our image hosting service
  cloudinary.v2.uploader.upload(
    `./${fileName}`,
    {
      public_id: fileName,
      folder: "yum"
    },
    (err, result) => {
      if (err) {
        console.log(err);
      }
    }
  );

  // Delete the file we just created
  fs.unlink(`./${fileName}`, err => {
    if (err) throw err;
  });

  // Add the full filename to our request to save to the DB
  req.body.photo = `${fileName}.${photo.format}`;

  // Once the photo is written , pass the photo path
  next();
};

// Write a store to the DB
exports.createStore = async (req, res) => {
  req.body.author = req.decoded.id;
  try {
    const store = new Store(req.body);
    await store.save();
    res.send({
      message: "data saved",
      data: store
    });
  } catch (error) {
    res.send({ error: "There was an error" });
  }
};

exports.confirmOwner = async (req, res, next) => {
  try {
    const store = await Store.findOne({ _id: req.params.id });
    if (!store.author.equals(req.decoded.id)) {
      throw Error("You must own a store in order to edit");
    }
    next();
  } catch (error) {
    res.send({ error: error });
  }
};

// Edit an existing store
exports.editStore = async (req, res) => {
  try {
    // Find the Store and update it
    const store = await Store.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true, // return the new store instead of the old one
        runValidators: true // run the validators on edit
      }
    ).exec();
    res.send({
      message: "data updated",
      data: store
    });
  } catch (error) {
    res.send({ error: "There was an error" });
  }
};

// Upload photo
exports.addPhotoPathToDB = async (req, res) => {
  try {
    // Find the Store and update it
    const store = await Store.findOneAndUpdate(
      { _id: req.params.id },
      req.body
    ).exec();
    res.send({
      message: "data updated",
      data: store
    });
  } catch (error) {
    res.send({ error: "There was an error" });
  }
};

// Query DB to get a list of all stores
exports.findAllStores = async (req, res) => {
  try {
    const stores = await Store.find();
    res.send({
      data: stores
    });
  } catch (error) {
    res.send({ error: "There was an error" });
  }
};

// Find the store given the ID
exports.findStore = async (req, res) => {
  try {
    const store = await Store.findOne({ _id: req.params.id });
    res.send({ data: store });
  } catch (error) {
    res.send({ error: "There was an error" });
  }
};

exports.getStoreBySlug = async (req, res) => {
  try {
    const store = await Store.findOne({ slug: req.params.storeSlug }).populate(
      "reviews",
      "-password -email"
    );
    if (!store) {
      res.send({ error: `No store by that name` });
      next();
      return;
    }
    res.send({ data: store });
  } catch (error) {
    res.send({ error: `There was an error: ${error}` });
  }
};

exports.getStoresByTag = async (req, res) => {
  try {
    const tag = req.params.tag;
    let tagQuery = tag;
    if (tag === "undefined") {
      tagQuery = { $exists: true };
    }
    const tags = await Store.getTagsList();
    const result = { tags };
    res.send({ data: result });
  } catch (error) {
    res.send({ error: `There was an error: ${error}` });
  }
};

// Serach stores and order them by metadata text score based on the query pararm
exports.searchStores = async (req, res) => {
  try {
    const stores = await Store
      //First find the store based on the query
      .find(
        {
          $text: {
            $search: req.query.q
          }
        },
        {
          score: { $meta: "textScore" }
        }
      )
      //Sort the stores based on score
      .sort({
        score: { $meta: "textScore" }
      })
      //Limit our results to the top 5
      .limit(5);
    res.json(stores);
  } catch (error) {
    res.send({ error: error });
  }
};

exports.mapStores = async (req, res) => {
  const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
  const query = {
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates
        },
        $maxDistance: 10000 //10KM
      }
    }
  };

  const stores = await Store.find(query)
    .select("slug name description location")
    .limit(10);
  res.json(stores);
};

exports.getTopStores = async (req, res) => {
  const stores = await Store.getTopStores();
  res.json({ data: stores });
};
