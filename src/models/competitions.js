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
  competitionLink: {
    type: String,
  },
});

const Competition = mongoose.model("Competition", competitionSchema);

module.exports = Competition;
