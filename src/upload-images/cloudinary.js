const cloudinary = require("cloudinary").v2;

const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// exports.uploads = (file, folder) => {
//   return new Promise((resolve) => {
//     cloudinary.uploader.upload(
//       file,
//       (result) => {
// resolve({
//   url: result.url,
//   id: result.public_id,
// });
//       },
//       {
//         resource_type: "auto",
//         folder: folder,
//       }
//     );
//   });
// };

// Function to upload an image buffer to Cloudinary
// const uploadImageToCloudinary = (buffer) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream((error, result) => {
//         if (error) reject(error);
//         else
//           resolve({
//             url: result.url,
//             id: result.public_id,
//           });
//       })
//       .end(buffer);
//   });
// };

const uploadImageToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream((error, result) => {
        if (error) reject(error);
        else
          resolve({
            url: result.url,
            id: result.public_id,
          });
      })
      .end(buffer);
  });
};

exports.destory = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  uploadImageToCloudinary,
};
