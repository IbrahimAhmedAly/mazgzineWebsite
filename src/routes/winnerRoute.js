const express = require("express");
const multer = require("multer");
const Winner = require("../models/winners");
const router = new express.Router();

router.post("/winners", async (req, res) => {
  const winner = new Winner(req.body);

  try {
    await winner.save();
    res.status(201).send(winner);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/winners", async (req, res) => {
  const winners = await Winner.find({});

  try {
    res.send(winners);
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

    res.send(winner);
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

const upload = multer({
  limits: {
    fileSize: 5000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("please upload an image"));
    }
    cb(undefined, true);
  },
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
