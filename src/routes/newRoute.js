const express = require("express");
const sharp = require("sharp");
const New = require("../models/news");
const router = new express.Router();

const upload = require("../utils/multer");

router.post("/news", upload.single("upload"), async (req, res) => {
  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  const news = new New(req.body);

  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();

  if (req.file?.buffer) {
    news.img = buffer;
  }

  try {
    await news.save();
    res.status(201).send({
      _id: news._id,
      title: news.title,
      description: news.description,
      img: `${fullUrl}/upload/${news._id}`,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/news", async (req, res) => {
  const fullUrl = `${req.protocol}:${req.get("host")}/api/news/upload/`;
  const news = await New.find({});

  // Get query parameter
  const { title } = req.query;

  const updatedNews = news.map((news) => {
    return {
      _id: news._id,
      description: news.description,
      title: news.title,
      img: news.img ? fullUrl + news._id : "",
    };
  });

  const filterdNews = updatedNews.filter(
    (news) => title && news.title.match(title)
  );

  const data = filterdNews.length > 0 ? filterdNews : updatedNews;

  try {
    res.send(data);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/new/:id", async (req, res) => {
  const fullUrl = `${req.protocol}:${req.get("host")}/api/news/upload/${
    req.params.id
  }`;
  const news = await New.findById({ _id: req.params.id });

  try {
    res.send({
      _id: news._id,
      title: news.title,
      description: news.description,
      img: fullUrl,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/news/:id", async (req, res) => {
  try {
    const news = await New.findOneAndDelete({ _id: req.params.id });

    if (!news) {
      res.status(404).send();
    }

    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/news/upload/:id", async (req, res) => {
  try {
    const news = await New.findById(req.params.id);

    if (!news || !news.img) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(news.img);
  } catch (error) {
    res.status(404).send();
  }
});

router.delete("/news/upload/:id", async (req, res) => {
  const _id = req.params.id;

  const news = await New.findOne({ _id });
  news.img = undefined;
  await news.save();

  res.send();
});

module.exports = router;
