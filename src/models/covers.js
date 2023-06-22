const mongoose = require("mongoose");

const coverSchema = new mongoose.Schema({
  img: {
    type: Buffer,
  },
});

const Cover = mongoose.model("Cover", coverSchema);

module.exports = Cover;
