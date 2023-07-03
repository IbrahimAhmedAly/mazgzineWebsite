const mongoose = require("mongoose");

const homesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    img: {
      type: Buffer,
    },
  },
  { timestamps: true }
);

const Home = mongoose.model("Home", homesSchema);
module.exports = Home;
