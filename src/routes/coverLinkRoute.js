const express = require("express");
const CoverLink = require("../models/coverLink");
const router = new express.Router();

router.post("/coverLink", async (req, res) => {
  const coverLink = new CoverLink(req.body);

  try {
    await coverLink.save();
    res.status(201).send(coverLink);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/coverLinks", async (req, res) => {
  const coverLinks = await CoverLink.find({});

  try {
    res.send(coverLinks);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/coverLink/:id", async (req, res) => {
  await CoverLink.findByIdAndDelete({ _id: req.params.id });

  try {
    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
