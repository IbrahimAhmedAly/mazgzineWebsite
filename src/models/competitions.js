const mongoose = require("mongoose");

const competitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
});

const Competition = mongoose.model("Competition", competitionSchema);

module.exports = Competition;
