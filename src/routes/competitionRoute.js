const express = require("express");
const sharp = require("sharp");
const Competition = require("../models/competitions");
const router = new express.Router();

const upload = require("../upload-images/multer");
const { uploadImageToCloudinary } = require("../upload-images/cloudinary");
const { destory } = require("../upload-images/cloudinary");

router.post("/competition", upload.single("upload"), async (req, res) => {
  const { title, description, competitionLink } = req.body;
  const uploadedImage = await uploadImageToCloudinary(req.file.buffer);

  const competition = new Competition({
    title,
    description,
    competitionLink,
    image: uploadedImage,
  });

  try {
    await competition.save();
    res.send(competition);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/competitions", async (req, res) => {
  const competitions = await Competition.find({});

  try {
    res.send(competitions);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/competition/:id", async (req, res) => {
  const competition = await Competition.findById({ _id: req.params.id });

  try {
    res.send(competition);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/competition/:id", upload.single("upload"), async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "description", "competitionLink", "upload"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const competition = await Competition.findOne({ _id: req.params.id });

    if (!competition) {
      return res.status(404).send();
    }

    destory(competition.image[0].id)
      .then((result) => {
        // console.log("Image deleted:", result);
      })
      .catch((error) => {
        console.log("Error deleting image:", error);
      });

    updates.forEach((update) => (competition[update] = req.body[update]));

    const uploadedImage = await uploadImageToCloudinary(req.file.buffer);
    competition.image[0] = uploadedImage;

    await competition.save();
    res.send(competition);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/competition/:id", async (req, res) => {
  try {
    const competition = await Competition.findById({ _id: req.params.id });

    if (!competition) {
      res.status(404).send();
    }

    destory(competition.image[0].id)
      .then((result) => {
        // console.log("Image deleted:", result);
      })
      .catch((error) => {
        console.log("Error deleting image:", error);
      });

    await Competition.findByIdAndDelete({ _id: req.params.id });

    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
