const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // cb(null, "./uploads/");
//     cb(null, process.env.TMPDIR);
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// // file validation

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     cb(null, true);
//   } else {
//     cb({ message: "Unsupported File Format" }, false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 },
//   fileFilter: fileFilter,
// });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;
