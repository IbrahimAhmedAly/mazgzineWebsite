const express = require("express");
const sharp = require("sharp");
const Category = require("../models/categories");
const router = new express.Router();

const upload = require("../utils/multer");

router.post("/category", upload.single("upload"), async (req, res) => {
  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  const category = new Category(req.body);

  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();

  if (req.file?.buffer) {
    category.img = buffer;
  }

  try {
    await category.save();
    res.status(201).send({
      _id: category._id,
      title: category.title,
      img: `${fullUrl}/upload/${category._id}`,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/category", async (req, res) => {
  const fullUrl = `${req.protocol}:${req.get("host")}/api/category/upload/`;
  const categories = await Category.find({});

  const updateCategories = categories.map((category) => {
    return {
      _id: category._id,
      title: category.title,
      img: category.img ? fullUrl + category._id : "",
    };
  });

  try {
    res.send(updateCategories);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/getCategory/:id", async (req, res) => {
  const fullUrl = `${req.protocol}:${req.get("host")}/api/category/upload/${
    req.params.id
  }`;
  const category = await Category.findById({ _id: req.params.id });

  try {
    res.send({
      _id: category._id,
      title: category.title,
      img: fullUrl,
    });
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
  const fullUrl = `${req.protocol}:${req.get("host")}/api/category/upload/${
    req.params.id
  }`;
  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();

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

    if (req.file?.buffer) {
      category.img = buffer;
    }

    updates.forEach((update) => (category[update] = req.body[update]));
    await category.save();
    res.send({
      _id: category._id,
      title: category.title,
      img: fullUrl,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/category/:id", async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id });

    if (!category) {
      res.status(404).send();
    }

    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/category/upload/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category || !category.img) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(category.img);
  } catch (error) {
    res.status(404).send();
  }
});

router.delete("/category/upload/:id", async (req, res) => {
  const _id = req.params.id;

  const category = await Category.findOne({ _id });
  category.img = undefined;
  await category.save();

  res.send();
});

module.exports = router;
