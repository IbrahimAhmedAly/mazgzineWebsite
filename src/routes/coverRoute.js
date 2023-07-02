const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const sharp = require("sharp");
const Cover = require("../models/covers");
const router = new express.Router();

const upload = require("../utils/multer");

router.post("/covers", upload.single("upload"), async (req, res) => {
  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  const cover = new Cover(req.body);

  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();

  if (req.file?.buffer) {
    cover.img = buffer;
  }

  try {
    await cover.save();
    res.status(201).send({
      _id: cover._id,
      img: `${fullUrl}/upload/${cover._id}`,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/covers", async (req, res) => {
  const fullUrl = `${req.protocol}:${req.get("host")}/api/covers/upload/`;
  const covers = await Cover.find({});

  const updateCovers = covers.map((cover) => {
    return {
      _id: cover._id,
      img: cover.img ? fullUrl + cover._id : "",
    };
  });

  try {
    res.send(updateCovers);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/covers/:id", async (req, res) => {
  const fullUrl = `${req.protocol}:${req.get("host")}/api/covers/upload/`;

  const query = { _id: { $ne: new ObjectId(req.params.id) } };

  const covers = await Cover.find(query);

  const updateCovers = covers.map((cover) => {
    return {
      _id: cover._id,
      img: cover.img ? fullUrl + cover._id : "",
    };
  });

  try {
    res.send(updateCovers);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/covers/upload/:id", async (req, res) => {
  try {
    const cover = await Cover.findById(req.params.id);

    if (!cover || !cover.img) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(cover.img);
  } catch (error) {
    res.status(404).send();
  }
});

router.delete("/covers/upload/:id", async (req, res) => {
  const _id = req.params.id;

  const cover = await Cover.findOne({ _id });
  cover.img = undefined;
  await cover.save();

  res.send();
});

module.exports = router;
