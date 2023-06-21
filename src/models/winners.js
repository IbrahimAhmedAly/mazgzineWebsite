const mongoose = require("mongoose");

const winnerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  img: {
    type: Buffer,
  },
});

const Winner = mongoose.model("Winner", winnerSchema);
module.exports = Winner;
