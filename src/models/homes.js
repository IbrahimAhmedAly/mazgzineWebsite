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
    addressLink: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    // images: [{ type: String }],
    images: [
      {
        url: {
          type: String,
        },
        id: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const Home = mongoose.model("Home", homesSchema);
module.exports = Home;
