const express = require("express");
const sharp = require("sharp");
const Home = require("../models/homes");
const router = new express.Router();

const upload = require("../upload-images/multer");
const { uploadImageToCloudinary } = require("../upload-images/cloudinary");
const { destory } = require("../upload-images/cloudinary");

router.post("/home", upload.array("upload", 10), async (req, res) => {
  const { title, location, price, addressLink, phone, ownerName } = req.body;
  const files = req.files;

  // Upload each file to Cloudinary
  const uploadedImages = await Promise.all(
    files.map((file) => uploadImageToCloudinary(file.buffer))
  );

  const home = new Home({
    title,
    location,
    price,
    addressLink,
    phone,
    ownerName,
    images: uploadedImages,
  });

  try {
    await home.save();
    res.status(201).send(home);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/home", async (req, res) => {
  const homes = await Home.find({});

  // Get query parameter
  const { title, price } = req.query;

  const filteredHomes = homes.filter((home) => {
    if (title && home.title.match(title)) {
      return true;
    }

    if (price && home.price.toString().match(price)) {
      return true;
    }
    return false;
  });

  const data = filteredHomes.length > 0 ? filteredHomes : homes;

  try {
    res.send(data);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/home/:id", async (req, res) => {
  const home = await Home.findById({ _id: req.params.id });

  try {
    res.send(home);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/home/:id", upload.array("upload"), async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "title",
    "location",
    "price",
    "addressLink",
    "phone",
    "ownerName",
    "upload",
  ];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const home = await Home.findOne({ _id: req.params.id });

    if (!home) {
      return res.status(404).send();
    }

    home.images.map((image) =>
      destory(image.id)
        .then((result) => {
          // console.log("Image deleted:", result);
        })
        .catch((error) => {
          console.log("Error deleting image:", error);
        })
    );

    updates.forEach((update) => (home[update] = req.body[update]));

    // Upload each file to Cloudinary
    const uploadedImages = await Promise.all(
      req.files.map((file) => uploadImageToCloudinary(file.buffer))
    );

    home.images = uploadedImages;

    await home.save();

    res.send(home);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/home/:id", async (req, res) => {
  try {
    const home = await Home.findById({ _id: req.params.id });

    if (!home) {
      res.status(404).send();
    }

    home.images.map((image) =>
      destory(image.id)
        .then((result) => {
          // console.log("Image deleted:", result);
        })
        .catch((error) => {
          console.log("Error deleting image:", error);
        })
    );

    await Home.findOneAndDelete({ _id: req.params.id });

    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
