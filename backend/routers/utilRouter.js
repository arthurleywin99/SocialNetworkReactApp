const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const Axios = require('axios');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'jpeg', 'png'],
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadCloud = multer({ storage });

const utilRouter = express.Router();

utilRouter.post(
  '/cloudinary-upload',
  uploadCloud.single('file'),
  expressAsyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(404).send('No file upload');
      return;
    }
    res.status(200).send({ message: req.file.path });
  })
);

utilRouter.get(
  '/cloudinary-delete/:imageId',
  expressAsyncHandler(async (req, res) => {
    const { imageId } = req.params;
    try {
      const response = await cloudinary.uploader.destroy(imageId);
      if (response.result === 'not found') {
        return res.status(404).send({ message: 'Not found' });
      }
      return res.status(200).send({ message: 'Deleted image successfully' });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  })
);

utilRouter.get(
  '/getlocation/:ip/:key',
  expressAsyncHandler(async (req, res) => {
    const { ip, key } = req.params;

    try {
      const response = await Axios.get(`https://api.ip2location.com/v2/?ip=${ip}&key=${key}&package=WS25`);
      return res.status(200).send(response.data);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  })
);

module.exports = utilRouter;
