const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const { isAuth } = require('../utils/utils.js');
const dotenv = require('dotenv');
const User = require('../models/UserModel.js');

dotenv.config();

const searchRouter = express.Router();

searchRouter.get(
  '/:searchText',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { searchText } = req.params;
    const userId = req.user._id;

    if (searchText.length === 0) return;
    try {
      let userPattern = new RegExp(`^${searchText}`);
      const temp = await User.find({
        name: { $regex: userPattern, $options: 'i' },
      });

      const results = temp.filter((res) => res._id.toString() !== userId);
      return res.json(results);
    } catch (error) {
      return res.status(404).send({ message: error.message });
    }
  })
);

module.exports = searchRouter;
