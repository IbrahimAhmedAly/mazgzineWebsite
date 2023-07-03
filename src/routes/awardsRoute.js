const express = require("express");
const sharp = require("sharp");
const Awards = require("../models/awards");
const router = new express.Router();

const upload = require("../utils/multer");

router.post("/award", upload.single("upload"), async (req, res) => {
  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  const awards = new Awards(req.body);

  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();

  if (req.file?.buffer) {
    awards.img = buffer;
  }

  try {
    await awards.save();
    res.status(201).send({
      _id: awards._id,
      img: `${fullUrl}/upload/${awards._id}`,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/awards", async (req, res) => {
  const fullUrl = `${req.protocol}:${req.get("host")}/api/award/upload/`;
  const awards = await Awards.find({});

  const updateAwards = awards.map((cover) => {
    return {
      _id: cover._id,
      img: cover.img ? fullUrl + cover._id : "",
    };
  });

  try {
    res.send(updateAwards);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/award/upload/:id", async (req, res) => {
  try {
    const awards = await Awards.findById(req.params.id);

    if (!awards || !awards.img) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(awards.img);
  } catch (error) {
    res.status(404).send();
  }
});

router.delete("/award/upload/:id", async (req, res) => {
  const awards = await Awards.findOneAndDelete({ _id: req.params.id });

  if (!awards) {
    res.status(404).send();
  }

  res.send();
});

module.exports = router;
