const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slugs");

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Please enter a store name!"
    },
    slug: String,
    description: {
      type: String,
      trim: true
    },
    tags: [String],
    created: {
      type: Date,
      default: Date.now
    },
    location: {
      type: {
        type: String,
        default: "Point"
      },
      address: {
        type: String,
        required: "You must have an address!"
      },
      coordinates: [
        {
          type: Number,
          required: "You must have coordinates!"
        }
      ]
    },
    photo: String,
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: "You must suppy an author"
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//Define Indexes
storeSchema.index({
  name: "text",
  description: "text"
});

storeSchema.index({ location: "2dsphere" });

storeSchema.pre("save", async function(next) {
  if (!this.isModified("name")) {
    return next();
  }

  this.slug = slug(this.name);

  // Find any other stores that have the same slug
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, "i");
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx });

  // Generate a unique slug if there are any matches
  if (storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }
  next();
});

// Add some custom methods

// Aggregate all the tags on the stores, and collect them with a count
storeSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    // Sort descending
    { $sort: { count: -1 } }
  ]);
};

// Function to get the top 10 stores
storeSchema.statics.getTopStores = function() {
  return this.aggregate([
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "store",
        as: "reviews"
      }
    },
    // filter for only items that have 2 or more reviews
    { $match: { "reviews.1": { $exists: true } } },
    // Add a field for an average rating
    { $addFields: { averageRating: { $avg: "$reviews.rating" } } },
    // Sort descending
    { $sort: { averageRating: -1 } },
    // Limit to 10 stores
    { $limit: 10 }
  ]);
};

// find reviews where the stores _id property === reviews store field
storeSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "store"
});

function autopopulate(next) {
  this.populate("reviews");
  next();
}

storeSchema.pre("find", autopopulate);
storeSchema.pre("findOne", autopopulate);

module.exports = mongoose.model("Store", storeSchema);
