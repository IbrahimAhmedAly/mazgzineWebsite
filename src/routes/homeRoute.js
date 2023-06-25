const express = require("express");
const sharp = require("sharp");
const Home = require("../models/homes");
const router = new express.Router();

const upload = require("../utils/multer");

router.post("/home", upload.single("upload"), async (req, res) => {
  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();

  const home = new Home(req.body);

  if (req.file?.buffer) {
    home.img = buffer;
  }

  try {
    await home.save();
    res.status(201).send({
      _id: home._id,
      title: home.title,
      location: home.location,
      price: home.price,
      img: `${fullUrl}upload/${home._id}`,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.get("/home", async (req, res) => {
  const fullUrl = `${req.protocol}:${req.get("host")}/api/home/upload/`;
  const homes = await Home.find({});

  // Get query parameter
  const { title, price } = req.query;

  const updatedHomes = homes.map((home) => {
    return {
      _id: home._id,
      location: home.location,
      title: home.title,
      price: home.price,
      img: home.img ? fullUrl + home._id : "",
    };
  });

  const filteredHomes = updatedHomes.filter((home) => {
    if (title && home.title.match(title)) {
      return true;
    }

    if (price && home.price.toString().match(price)) {
      return true;
    }
    return false;
  });

  const data = filteredHomes.length > 0 ? filteredHomes : updatedHomes;

  try {
    res.send(data);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/home/:id", async (req, res) => {
  const fullUrl = `${req.protocol}:${req.get("host")}/api/home/upload/${
    req.params.id
  }`;
  const home = await Home.findById({ _id: req.params.id });

  try {
    res.send({
      _id: home._id,
      title: home.title,
      location: home.location,
      price: home.price,
      img: fullUrl,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/home/:id", upload.single("upload"), async (req, res) => {
  const fullUrl = `${req.protocol}:${req.get("host")}/api/home/upload/${
    req.params.id
  }`;
  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();

  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "location", "price", "upload"];

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

    if (req.file?.buffer) {
      home.img = buffer;
    }

    updates.forEach((update) => (home[update] = req.body[update]));
    await home.save();

    res.send({
      _id: home._id,
      title: home.title,
      location: home.location,
      price: home.price,
      img: fullUrl,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/home/:id", async (req, res) => {
  try {
    const home = await Home.findOneAndDelete({ _id: req.params.id });

    if (!home) {
      res.status(404).send();
    }

    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/home/upload/:id", async (req, res) => {
  try {
    const home = await Home.findById(req.params.id);

    if (!home || !home.img) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(home.img);
  } catch (error) {
    res.status(404).send();
  }
});

router.delete("/home/upload/:id", async (req, res) => {
  const _id = req.params.id;

  const home = await Home.findOne({ _id });
  home.img = undefined;
  await home.save();

  res.send();
});

module.exports = router;
