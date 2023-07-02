const express = require("express");
const sharp = require("sharp");
const Competition = require("../models/competitions");
const router = new express.Router();

const upload = require("../utils/multer");

router.post("/competition", upload.single("upload"), async (req, res) => {
  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  const competition = new Competition(req.body);

  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();

  if (req.file?.buffer) {
    competition.img = buffer;
  }

  try {
    await competition.save();
    res.status(201).send({
      _id: competition._id,
      title: competition.title,
      description: competition.description,
      competitionLink: competition.competitionLink,
      img: `${fullUrl}/upload/${competition._id}`,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/competitions", async (req, res) => {
  const fullUrl = `${req.protocol}:${req.get("host")}/api/competition/upload/`;

  const competitions = await Competition.find({});

  const updateCompetitions = competitions.map((competition) => {
    return {
      _id: competition._id,
      title: competition.title,
      description: competition.description,
      competitionLink: competition.competitionLink,
      img: competition.img ? fullUrl + competition._id : "",
    };
  });

  try {
    res.send(updateCompetitions);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/competition/:id", async (req, res) => {
  const fullUrl = `${req.protocol}:${req.get("host")}/api/competition/upload/${
    req.params.id
  }`;
  const competition = await Competition.findById({ _id: req.params.id });

  try {
    res.send({
      _id: competition._id,
      title: competition.title,
      description: competition.description,
      competitionLink: competition.competitionLink,
      img: fullUrl,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/competition/:id", upload.single("upload"), async (req, res) => {
  const fullUrl = `${req.protocol}:${req.get("host")}/api/competition/upload/${
    req.params.id
  }`;
  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();

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

    if (req.file?.buffer) {
      competition.img = buffer;
    }

    updates.forEach((update) => (competition[update] = req.body[update]));
    await competition.save();
    res.send({
      _id: competition._id,
      title: competition.title,
      description: competition.description,
      competitionLink: competition.competitionLink,
      img: fullUrl,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/competition/:id", async (req, res) => {
  await Competition.findByIdAndDelete({ _id: req.params.id });

  try {
    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/competition/upload/:id", async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);

    if (!competition || !competition.img) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(competition.img);
  } catch (error) {
    res.status(404).send();
  }
});

router.delete("/competition/upload/:id", async (req, res) => {
  const _id = req.params.id;

  const competition = await Competition.findOne({ _id });
  competition.img = undefined;
  await competition.save();

  res.send();
});

module.exports = router;
