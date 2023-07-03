const mongoose = require("mongoose");

const goldsCoverSchema = new mongoose.Schema({
  link: {
    type: String,
  },
});

const GoldsCover = mongoose.model("GoldsCover", goldsCoverSchema);

module.exports = GoldsCover;
