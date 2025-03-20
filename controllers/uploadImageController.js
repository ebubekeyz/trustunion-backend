const path = require('path');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const { BadRequestError } = require('../errors');
const cloudinary = require('cloudinary').v2;

const upload = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,

    {
      use_filename: true,
      folder: 'trustunion',
    }
  );
  fs.unlinkSync(req.files.image.tempFilePath);
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

// const upload = async (req, res) => {
//   if (!req.files) {
//     throw new BadRequestError('No file uploaded');
//   }

//   const productImage = req.files.image;

//   if (!productImage.mimetype.startsWith('image')) {
//     throw new BadRequestError('Please upload image');
//   }
//   const imagePath = path.join(
//     __dirname,
//     '../public/uploads/' + `${productImage.name}`
//   );

//   await productImage.mv(imagePath);

//   res
//     .status(StatusCodes.OK)
//     .json({ image: { src: `/uploads/${productImage.name}` } });
// };

module.exports = upload;
