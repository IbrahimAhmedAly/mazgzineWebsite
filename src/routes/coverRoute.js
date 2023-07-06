const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const Cover = require("../models/covers");
const router = new express.Router();

const upload = require("../upload-images/multer");
const { uploadImageToCloudinary } = require("../upload-images/cloudinary");
const { destory } = require("../upload-images/cloudinary");

router.post("/covers", upload.single("upload"), async (req, res) => {
  const uploadedImage = await uploadImageToCloudinary(req.file.buffer);

  const cover = new Cover({
    image: uploadedImage,
  });

  try {
    await cover.save();
    res.status(201).send(cover);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/covers", async (req, res) => {
  const covers = await Cover.find({});

  try {
    res.send(covers);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/covers/:id", async (req, res) => {
  const query = { _id: { $ne: new ObjectId(req.params.id) } };

  const covers = await Cover.find(query);

  try {
    res.send(covers);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/cover/:id", async (req, res) => {
  try {
    const cover = await Cover.findById({ _id: req.params.id });

    if (!cover) {
      res.status(404).send();
    }

    destory(cover.image[0].id)
      .then((result) => {
        // console.log("Image deleted:", result);
      })
      .catch((error) => {
        console.log("Error deleting image:", error);
      });

    await Cover.findOneAndDelete({ _id: req.params.id });

    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
