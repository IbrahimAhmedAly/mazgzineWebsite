const mongoose = require("mongoose");

const competitionLinkSchema = new mongoose.Schema({
  competitionLink: {
    type: String,
    required: true,
  },
});

const CompetitionLink = mongoose.model(
  "CompetitionLink",
  competitionLinkSchema
);

module.exports = CompetitionLink;
