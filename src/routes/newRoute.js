const express = require("express");
const New = require("../models/news");
const router = new express.Router();

const upload = require("../upload-images/multer");
const { uploadImageToCloudinary } = require("../upload-images/cloudinary");
const { destory } = require("../upload-images/cloudinary");

router.post("/news", upload.single("upload"), async (req, res) => {
  const { title, description } = req.body;
  const uploadedImage = await uploadImageToCloudinary(req.file.buffer);

  const news = new New({
    title,
    description,
    image: uploadedImage,
  });

  try {
    await news.save();
    res.status(201).send(news);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/news", async (req, res) => {
  const news = await New.find({});

  // Get query parameter
  const { title } = req.query;

  const filterdNews = news.filter((news) => title && news.title.match(title));

  const data = filterdNews.length > 0 ? filterdNews : news;

  try {
    res.send(data);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/new/:id", async (req, res) => {
  const news = await New.findById({ _id: req.params.id });

  try {
    res.send(news);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/news/:id", async (req, res) => {
  try {
    const news = await New.findById({ _id: req.params.id });

    if (!news) {
      res.status(404).send();
    }

    destory(news.image[0].id)
      .then((result) => {
        // console.log("Image deleted:", result);
      })
      .catch((error) => {
        console.log("Error deleting image:", error);
      });

    await New.findOneAndDelete({ _id: req.params.id });

    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
