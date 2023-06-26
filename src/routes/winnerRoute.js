const express = require("express");
const sharp = require("sharp");
const Winner = require("../models/winners");
const router = new express.Router();

const upload = require("../utils/multer");

router.post("/winners", upload.single("upload"), async (req, res) => {
  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  const winner = new Winner(req.body);

  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();

  if (req.file?.buffer) {
    winner.img = buffer;
  }

  try {
    await winner.save();
    res.status(201).send({
      _id: winner._id,
      title: winner.title,
      location: winner.location,
      img: `${fullUrl}/upload/${winner._id}`,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/winners", async (req, res) => {
  const fullUrl = `${req.protocol}:${req.get("host")}/api/winners/upload/`;
  const winners = await Winner.find({});

  const updateWinners = winners.map((winner) => {
    return {
      _id: winner._id,
      location: winner.location,
      title: winner.title,
      price: winner.price,
      img: winner.img ? fullUrl + winner._id : "",
    };
  });

  try {
    res.send(updateWinners);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/winners/:id", async (req, res) => {
  try {
    const winner = await Winner.findOneAndDelete({ _id: req.params.id });

    if (!winner) {
      res.status(404).send();
    }

    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/winners", async (req, res) => {
  try {
    await Winner.deleteMany();

    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/winners/upload/:id", async (req, res) => {
  try {
    const winner = await Winner.findById(req.params.id);

    if (!winner || !winner.img) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(winner.img);
  } catch (error) {
    res.status(404).send();
  }
});

router.delete("/winners/upload/:id", async (req, res) => {
  const _id = req.params.id;

  const winner = await Winner.findOne({ _id });
  winner.img = undefined;
  await winner.save();

  res.send();
});

module.exports = router;
