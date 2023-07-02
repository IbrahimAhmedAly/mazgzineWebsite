const mongoose = require("mongoose");

const goldsCoverSchema = new mongoose.Schema({
  img: {
    type: Buffer,
  },
});

const GoldsCover = mongoose.model("GoldsCover", goldsCoverSchema);

module.exports = GoldsCover;
