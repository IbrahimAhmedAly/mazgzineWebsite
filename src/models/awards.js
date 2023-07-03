const mongoose = require("mongoose");

const awardsSchema = new mongoose.Schema({
  img: {
    type: Buffer,
  },
});

const Awards = mongoose.model("Awards", awardsSchema);

module.exports = Awards;
