const mongoose = require("mongoose");
const Place = require("./places");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  img: {
    type: Buffer,
  },
});

categorySchema.virtual("places", {
  ref: "Place",
  localField: "_id",
  foreignField: "categoryId",
});

categorySchema.pre("remove", async function (next) {
  const category = this;
  await Place.deleteMany({ categoryId: category._id });
  next();
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
