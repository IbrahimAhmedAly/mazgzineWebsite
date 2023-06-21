const express = require("express");

const winnerRoute = require("./routes/winnerRoute");
const competitionRoute = require("./routes/competitionRoute");
const competitionLinkRoute = require("./routes/competitionLinkRoute");
const homeRoute = require("./routes/homeRoute");

const app = express();
const port = process.env.PORT || 3000;

const mongoose = require("mongoose");
const dotenv = require("dotenv");

//Routes

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Db Connection Successful!!"))
  .catch((err) => console.log(err));

app.get("/api/test", () => {
  console.log("testing successful");
});

app.use(express.json());
app.use("/api/", winnerRoute);
app.use("/api/", competitionRoute);
app.use("/api/", competitionLinkRoute);
app.use("/api/", homeRoute);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
