const express = require("express");
const GoldsCover = require("../models/goldsGover");
const router = new express.Router();

router.post("/goldsCover", async (req, res) => {
  const goldsCover = new GoldsCover(req.body);

  try {
    await goldsCover.save();
    res.status(201).send(goldsCover);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/goldsCovers", async (req, res) => {
  const goldsCovers = await GoldsCover.find({});
  try {
    res.send(goldsCovers);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/goldsCover/:id", async (req, res) => {
  const cover = await GoldsCover.findOneAndDelete({ _id: req.params.id });

  if (!cover) {
    res.status(404).send();
  }

  res.send();
});

module.exports = router;
