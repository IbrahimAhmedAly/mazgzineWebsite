const express = require("express");
const CompetitionLink = require("../models/competetionLink");
const router = new express.Router();

router.post("/competitionLink", async (req, res) => {
  const competitionLink = new CompetitionLink(req.body);

  try {
    await competitionLink.save();
    res.status(201).send(competitionLink);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/competitionLinks", async (req, res) => {
  const competitionLinks = await CompetitionLink.find({});

  try {
    res.send(competitionLinks);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/competitionLink/:id", async (req, res) => {
  await CompetitionLink.findByIdAndDelete({ _id: req.params.id });

  try {
    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
