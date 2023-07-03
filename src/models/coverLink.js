const mongoose = require("mongoose");

const coverLinkSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
  },
});

const CoverLink = mongoose.model("CoverLink", coverLinkSchema);

module.exports = CoverLink;
