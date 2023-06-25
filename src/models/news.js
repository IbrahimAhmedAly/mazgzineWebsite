const mongoose = require("mongoose");

const newSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    type: Buffer,
  },
});

const New = mongoose.model("New", newSchema);
module.exports = New;
