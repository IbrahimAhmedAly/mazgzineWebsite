const sharp = require("sharp");

async function resizeImage(buffer, width, height) {
  const resizedBuffer = await sharp(buffer)
    .resize({ width, height })
    .png()
    .toBuffer();

  return resizedBuffer;
}

// const buffer = await sharp(req.file.buffer)
//   .resize({ width: 250, height: 250 })
//   .png()
//   .toBuffer();

module.exports = resizeImage;
