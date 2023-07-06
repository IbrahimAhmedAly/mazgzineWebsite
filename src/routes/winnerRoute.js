const express = require("express");
const Winner = require("../models/winners");
const router = new express.Router();

const upload = require("../upload-images/multer");
const { uploadImageToCloudinary } = require("../upload-images/cloudinary");
const { destory } = require("../upload-images/cloudinary");

router.post("/winners", upload.single("upload"), async (req, res) => {
  const { title, location } = req.body;
  const uploadedImage = await uploadImageToCloudinary(req.file.buffer);

  const winner = new Winner({
    title,
    location,
    image: uploadedImage,
  });

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
    const winner = await Winner.findById({ _id: req.params.id });

    if (!winner) {
      res.status(404).send();
    }

    destory(winner.image[0].id)
      .then((result) => {
        // console.log("Image deleted:", result);
      })
      .catch((error) => {
        console.log("Error deleting image:", error);
      });

    await Winner.findOneAndDelete({ _id: req.params.id });

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

module.exports = router;
