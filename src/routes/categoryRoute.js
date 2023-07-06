const express = require("express");
const Category = require("../models/categories");
const router = new express.Router();

const upload = require("../upload-images/multer");
const { uploadImageToCloudinary } = require("../upload-images/cloudinary");
const { destory } = require("../upload-images/cloudinary");

router.post("/category", upload.single("upload"), async (req, res) => {
  const { title } = req.body;
  const uploadedImage = await uploadImageToCloudinary(req.file.buffer);

  const category = new Category({
    title,
    image: uploadedImage,
  });
  try {
    await category.save();
    res.status(201).send(category);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/category", async (req, res) => {
  const categories = await Category.find({});

  try {
    res.send(categories);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/getCategory/:id", async (req, res) => {
  const category = await Category.findById({ _id: req.params.id });

  try {
    res.send(category);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/category/:id", async (req, res) => {
  const category = await Category.findById({ _id: req.params.id });

  if (!category) {
    return res.status(404).send();
  }

  await category.populate("places");
  res.send(category.places);
});

router.patch("/category/:id", upload.single("upload"), async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "upload"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const category = await Category.findOne({ _id: req.params.id });

    if (!category) {
      return res.status(404).send();
    }

    destory(category.image[0].id)
      .then((result) => {
        // console.log("Image deleted:", result);
      })
      .catch((error) => {
        console.log("Error deleting image:", error);
      });

    updates.forEach((update) => (category[update] = req.body[update]));

    const uploadedImage = await uploadImageToCloudinary(req.file.buffer);
    category.image[0] = uploadedImage;

    await category.save();
    res.send(category);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/category/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).send();
    }

    destory(category.image[0].id)
      .then((result) => {
        // console.log("Image deleted:", result);
      })
      .catch((error) => {
        console.log("Error deleting image:", error);
      });

    await Category.findByIdAndRemove(req.params.id);

    res.send();
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

module.exports = router;
