const express = require("express");
const sharp = require("sharp");
const GoldsCover = require("../models/goldsGover");
const router = new express.Router();

const upload = require("../utils/multer");

router.post("/goldsCover", upload.single("upload"), async (req, res) => {
  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  const goldsCover = new GoldsCover(req.body);

  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();

  if (req.file?.buffer) {
    goldsCover.img = buffer;
  }

  try {
    await goldsCover.save();
    res.status(201).send({
      _id: goldsCover._id,
      img: `${fullUrl}/upload/${goldsCover._id}`,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/goldsCovers", async (req, res) => {
  const fullUrl = `${req.protocol}:${req.get("host")}/api/covers/upload/`;
  const goldsCovers = await GoldsCover.find({});

  const updateGoldsCovers = goldsCovers.map((cover) => {
    return {
      _id: cover._id,
      img: cover.img ? fullUrl + cover._id : "",
    };
  });

  try {
    res.send(updateGoldsCovers);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/goldsCover/upload/:id", async (req, res) => {
  try {
    const goldsCover = await GoldsCover.findById(req.params.id);

    if (!goldsCover || !goldsCover.img) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(goldsCover.img);
  } catch (error) {
    res.status(404).send();
  }
});

router.delete("/goldsCover/upload/:id", async (req, res) => {
  const cover = await GoldsCover.findOneAndDelete({ _id: req.params.id });

  if (!cover) {
    res.status(404).send();
  }

  res.send();
});

module.exports = router;
