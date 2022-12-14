const express = require('express');
const dotenv = require('dotenv');
const expressAsyncHandler = require('express-async-handler');
const { isAuth } = require('../utils/utils.js');
const Post = require('../models/PostModel.js');

dotenv.config();

const adminPostRouter = express.Router();

adminPostRouter.get(
  '/getall',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const posts = await Post.find().populate('user').populate('likes.user').populate('comments.user');

      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

adminPostRouter.get(
  '/lock/:postId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { postId } = req.params;
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).send({ message: 'Post not found' });
      }

      await Post.findOneAndUpdate({ _id: postId }, { $set: { status: false } });

      return res.status(200).send({ message: 'Locked' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

adminPostRouter.get(
  '/unlock/:postId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { postId } = req.params;
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).send({ message: 'Post not found' });
      }

      await Post.findOneAndUpdate({ _id: postId }, { $set: { status: true } });

      return res.status(200).send({ message: 'Unlocked' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

module.exports = adminPostRouter;
