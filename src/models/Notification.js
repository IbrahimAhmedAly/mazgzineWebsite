const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
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
