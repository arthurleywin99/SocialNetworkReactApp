const express = require('express');
const dotenv = require('dotenv');
const { isAuth } = require('../utils/utils.js');
const expressAsyncHandler = require('express-async-handler');
const Post = require('../models/PostModel.js');
const User = require('../models/UserModel.js');
const Report = require('../models/ReportModel.js');

dotenv.config();

const reportRouter = express.Router();

reportRouter.post(
  '/send',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { postId, describe } = req.body;
      const userId = req.user._id;

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).send({ message: 'Post not found' });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      await new Report({
        user: userId,
        post: postId,
        describe,
        status: false,
      }).save();

      return res.status(200).send({ message: 'Report created successfully' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

module.exports = reportRouter;
