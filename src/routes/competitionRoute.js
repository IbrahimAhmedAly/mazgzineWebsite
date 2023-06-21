const express = require("express");
const Competition = require("../models/competitions");
const router = new express.Router();

router.post("/competition", async (req, res) => {
  const competition = new Competition(req.body);

  try {
    await competition.save();
    res.status(201).send(competition);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/competitions", async (req, res) => {
  const competitions = await Competition.find({});

  try {
    res.send(competitions);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/competition/:id", async (req, res) => {
  const competition = await Competition.findById({ _id: req.params.id });

  try {
    res.send(competition);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/competition/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "description", "img"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const competition = await Competition.findOne({ _id: req.params.id });

    if (!competition) {
      return res.status(404).send();
    }

    updates.forEach((update) => (competition[update] = req.body[update]));
    await competition.save();
    res.send(competition);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/competition/:id", async (req, res) => {
  await Competition.findByIdAndDelete({ _id: req.params.id });

  try {
    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
