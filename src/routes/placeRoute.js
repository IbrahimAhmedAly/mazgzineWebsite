const express = require("express");
const Place = require("../models/places");
const router = new express.Router();

router.post("/place", async (req, res) => {
  const place = new Place(req.body);

  try {
    await place.save();
    res.status(201).send(place);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/places", async (req, res) => {
  const places = await Place.find({});

  try {
    res.send(places);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/place/:id", async (req, res) => {
  const place = await Place.findById({ _id: req.params.id });

  try {
    res.send(place);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/place/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "location", "phone", "categoryId"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const place = await Place.findOne({ _id: req.params.id });

    if (!place) {
      return res.status(404).send();
    }

    updates.forEach((update) => (place[update] = req.body[update]));
    await place.save();

    res.send(place);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/place/:id", async (req, res) => {
  try {
    const place = await Place.findOneAndDelete({ _id: req.params.id });

    if (!place) {
      res.status(404).send();
    }

    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
