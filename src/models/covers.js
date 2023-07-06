const mongoose = require("mongoose");

const coverSchema = new mongoose.Schema(
  {
    image: [
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

const Cover = mongoose.model("Cover", coverSchema);

module.exports = Cover;
