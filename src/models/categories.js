const mongoose = require("mongoose");

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

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
