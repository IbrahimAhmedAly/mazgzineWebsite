const express = require("express");
const Notificaiton = require("../models/Notification");
const router = new express.Router();

router.post("/notification", async (req, res) => {
  const notificaiton = new Notificaiton(req.body);

  try {
    await notificaiton.save();
    res.status(201).send(notificaiton);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/notifications", async (req, res) => {
  const notificaitons = await Notificaiton.find({});

  try {
    res.send(notificaitons);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/notification/:id", async (req, res) => {
  try {
    const notificaiton = await Notificaiton.findOneAndDelete({
      _id: req.params.id,
    });

    if (!notificaiton) {
      res.status(404).send();
    }

    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
