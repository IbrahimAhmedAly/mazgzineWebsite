const cloudinary = require("cloudinary").v2;

const cloudinaryDestory = require("cloudinary");

const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

const destory = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinaryDestory.uploader.destroy(publicId, (error, result) => {
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
  destory,
};
