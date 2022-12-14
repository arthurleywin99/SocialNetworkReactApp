const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const { isAuth } = require('../utils/utils.js');
const dotenv = require('dotenv');
const User = require('../models/UserModel.js');
const Post = require('../models/PostModel.js');

dotenv.config();

const adminSearchRouter = express.Router();

adminSearchRouter.get(
  '/user/:searchText',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { searchText } = req.params;

    if (searchText.length === 0) return;
    try {
      let getById;

      if (searchText.length === 24) {
        getById = await User.findById(searchText);
        return res.json(getById);
      }

      const users = await User.find({});

      const getByEmail = users.filter((user) => user.email.toLowerCase().includes(searchText.toLowerCase()));

      return res.json(getByEmail);
    } catch (error) {
      return res.status(404).send({ message: error.message });
    }
  })
);

adminSearchRouter.get(
  '/post/:searchText',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { searchText } = req.params;

    if (searchText.length === 0) return;
    try {
      let getById;

      if (searchText.length === 24) {
        getById = await Post.findById(searchText);
        return res.json(getById);
      }

      const posts = await Post.find({}).populate('user');

      const getByUserId = posts.filter((post) => post.user.username.toLowerCase().includes(searchText.toLowerCase().toString()));

      return res.json(getByUserId);
    } catch (error) {
      return res.status(404).send({ message: error.message });
    }
  })
);

module.exports = adminSearchRouter;
