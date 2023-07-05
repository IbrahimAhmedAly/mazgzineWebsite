const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const upload = require("./upload-images/multer");
const cloudinary = require("./upload-images/cloudinary");
const fs = require("fs");

const Notificaiton = require("./models/Notification");

const winnerRoute = require("./routes/winnerRoute");
const competitionRoute = require("./routes/competitionRoute");
const coverLinkRoute = require("./routes/coverLinkRoute");
const homeRoute = require("./routes/homeRoute");
const coverRoute = require("./routes/coverRoute");
const categoryRoute = require("./routes/categoryRoute");
const placeRoute = require("./routes/placeRoute");
const newRoute = require("./routes/newRoute");
const notificationRoute = require("./routes/notificaitonRoute");
const goldsCoverRoute = require("./routes/goldsCoverRoute");
const awardsRoute = require("./routes/awardsRoute");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "./public");

app.use(express.static(publicDirectoryPath));

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// // POST_REQUEST
// app.use("/upload-images", upload.array("upload"), async (req, res) => {
//   const uploader = async (path) => await cloudinary.uploads(path, "Images");

//   if (req.method === "POST") {
//     const urls = [];

//     const files = req.files;

//     for (const file of files) {
//       const { path } = file;

//       const newPath = await uploader(path);
//       urls.push(newPath);

//       fs.unlinkSync(path);
//     }

//     res.status(200).json({
//       data: urls,
//     });
//   } else {
//     res.status(405).json({
//       err: "images not uploaded successuflly",
//     });
//   }
// });

//Routes
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Db Connection Successful!!"))
  .catch((err) => console.log(err));

app.use(express.json());
// middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

const allowedOrigins = [
  "http://localhost:3000",
  "https://admin-panel-l4je1hq2m-ibrahimahmedaly.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use("/api/", winnerRoute);
app.use("/api/", competitionRoute);
app.use("/api/", homeRoute);
app.use("/api/", coverRoute);
app.use("/api/", categoryRoute);
app.use("/api/", placeRoute);
app.use("/api/", newRoute);
app.use("/api/", notificationRoute);
app.use("/api/", coverLinkRoute);
app.use("/api/", goldsCoverRoute);
app.use("/api/", awardsRoute);

async function connectToMongoDB() {
  // MongoDB change stream setup
  const changeStream = Notificaiton.watch();
  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const newRecord = change.fullDocument;
      console.log(newRecord);
      io.emit("newRecord", newRecord);
    }
  });
}

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.emit("message", "Welcome!");
});

server.listen(port, () => {
  console.log("Server is up on port " + port);
  connectToMongoDB();
});
