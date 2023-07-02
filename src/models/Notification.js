const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notificaiton = mongoose.model("Notificaiton", notificationSchema);
module.exports = Notificaiton;
