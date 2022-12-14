const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const { isAuth } = require('../utils/utils.js');
const dotenv = require('dotenv');
const Post = require('../models/PostModel.js');
const User = require('../models/UserModel.js');
const Follower = require('../models/FollowerModel.js');
const Notification = require('../models/NotificationModel.js');
const { v4: uuid } = require('uuid');

dotenv.config();

const postRouter = express.Router();

postRouter.post(
  '/create',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { text, location, picUrl } = req.body;
    if (text.length < 1) {
      return res.status(401).send('Text must be at least 1 character');
    }
    try {
      const newPost = {
        user: req.user._id,
        text,
      };
      newPost.location = location && location;
      newPost.picUrl = picUrl && picUrl;

      const post = await new Post(newPost).save();
      const createdPost = await Post.findById(post._id).populate('user');
      return res.status(200).json(createdPost);
    } catch (error) {
      return res.status(500).send({ message: 'Server error' });
    }
  })
);

postRouter.get(
  '/getall',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { pageNumber } = req.query;
    const number = Number(pageNumber);
    const size = 8;
    try {
      let posts;
      if (number === 1) {
        posts = await Post.find().limit(size).sort({ createdAt: -1 }).populate('user').populate('comments.user');
      } else {
        const skips = size * (number - 1);
        posts = await Post.find().skip(skips).limit(size).sort({ createdAt: -1 }).populate('user').populate('comments.user');
      }

      const userId = req.user._id;
      const loggedUser = await Follower.findOne({ user: userId });

      if (posts.length === 0) {
        return res.status(200).json([]);
      }

      let postsSent = [];
      if (loggedUser.following.length === 0) {
        postsSent = posts.filter((post) => post.user._id.toString() === userId);
      } else {
        for (let i = 0; i < loggedUser.following.length; ++i) {
          const postsFromFollowing = posts.filter((post) => post.user._id.toString() === loggedUser.following[i].user.toString());
          if (postsFromFollowing.length > 0) {
            postsSent.push(...postsFromFollowing);
          }

          const myPosts = posts.filter((post) => post.user._id.toString() === userId);
          if (myPosts.length > 0) {
            postsSent.push(...myPosts);
          }
        }
      }
      postsSent = postsSent.filter((post) => post.status !== false);
      postsSent.length > 0 && postsSent.sort((a, b) => [new Date(b.createAt) - new Date(a.createAt)]);

      return res.status(200).json(postsSent);
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

postRouter.get(
  '/:postId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId).populate('user').populate('comments.user');
      if (!post) {
        return res.status(404).send({ message: 'Post not found' });
      }

      if (!post.status) {
        return res.status(401).send({ message: 'Post has been locked by admin' });
      }

      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

postRouter.delete(
  '/delete/:postId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;
      const { postId } = req.params;
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).send({ message: 'Post not found' });
      }

      const user = await User.findById(userId);
      if (post.user.toString() !== userId) {
        if (user.role === 'root') {
          await post.remove();
          return res.status(200).send({ message: 'Post deleted successfully' });
        }
        return res.status(404).send({ message: 'Unauthorized' });
      }

      await post.remove();
      return res.status(200).send({ message: 'Post deleted successfully' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

postRouter.get(
  '/like/:postId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;
      const { postId } = req.params;

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send({ message: 'Post not found' });
      }
      const isLiked = post.likes.filter((like) => like.user.toString() === userId).length > 0;

      if (isLiked) {
        return res.status(401).send({ message: 'Post already liked' });
      }
      post.likes.unshift({ user: userId });
      await post.save();

      if (post.user.toString() !== userId) {
        const userToNotify = await Notification.findOne({
          user: post.user.toString(),
        });

        const newNotification = {
          type: 'newLike',
          user: userId,
          post: postId,
          date: Date.now(),
        };

        userToNotify.notifications.unshift(newNotification);
        await userToNotify.save();

        const userUnread = await User.findById(post.user.toString());
        if (!userUnread.unreadNotification) {
          userUnread.unreadNotification = true;
          await userUnread.save();
        }
      }
      return res.status(200).send({ message: 'Post liked' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

postRouter.get(
  '/unlike/:postId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.user._id;

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send({ message: 'Post not found' });
      }
      const isLiked = post.likes.filter((like) => like.user.toString() === userId).length === 0;

      if (isLiked) {
        return res.status(401).send({ message: 'Post not liked before' });
      }

      const index = post.likes.map((like) => like.user).indexOf(userId);

      post.likes.splice(index, 1);
      await post.save();

      if (post.user.toString() !== userId) {
        await Notification.findOneAndUpdate(
          {
            user: post.user.toString(),
          },
          {
            $pull: {
              notifications: {
                type: 'newLike',
                user: userId,
                post: postId,
              },
            },
          }
        );
      }

      return res.status(200).send({ message: 'Post unliked' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

postRouter.get(
  '/likes/get/:postId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { postId } = req.params;
      const post = await Post.findById(postId).populate('likes.user');
      if (!post) {
        return res.status(404).send({ message: 'Post not found' });
      }

      return res.status(200).json(post.likes);
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

postRouter.post(
  '/comment/create/:postId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { postId } = req.params;
      const { text } = req.body;
      const userId = req.user._id;
      if (text.length < 1) {
        res.status(404).send({ message: 'Comment shoud be at least 1 character' });
      }
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).send({ message: 'Post not found' });
      }
      const newComment = {
        _id: uuid(),
        text,
        user: req.user._id,
        date: Date.now(),
      };

      post.comments.unshift(newComment);
      await post.save();

      if (post.user.toString() !== userId) {
        const userToNotify = await Notification.findOne({
          user: post.user.toString(),
        });

        const newNotification = {
          type: 'newComment',
          user: userId,
          post: postId,
          commentId: newComment._id,
          text,
          date: Date.now(),
        };

        userToNotify.notifications.unshift(newNotification);
        await userToNotify.save();

        const userUnread = await User.findById(post.user.toString());
        if (!userUnread.unreadNotification) {
          userUnread.unreadNotification = true;
          await userUnread.save();
        }
      }

      return res.status(200).json({ message: newComment._id });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

postRouter.get(
  '/comment/delete/:postId/:commentId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const userId = req.user._id;

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send({ message: 'Post not found' });
      }
      const comment = post.comments.find((comment) => comment._id === commentId);
      if (!comment) {
        return res.status(404).send({ message: 'No comment found' });
      }

      const deleteComment = async () => {
        const indexOf = post.comments.map((comment) => comment._id).indexOf(commentId);
        post.comments.splice(indexOf, 1);
        await post.save();

        if (post.user.toString() !== userId) {
          await Notification.findOneAndUpdate(
            {
              user: post.user.toString(),
            },
            {
              $pull: {
                notifications: {
                  type: 'newComment',
                  user: userId,
                  post: postId,
                  commentId: commentId,
                },
              },
            }
          );
        }

        return res.status(200).send({ message: 'Deleted successfully' });
      };

      const user = User.findById(userId);
      if (comment.user.toString() !== userId) {
        if (user.role === 'root') {
          await deleteComment();
        } else {
          return res.status(401).send({ message: 'Unauthorized' });
        }
      }
      await deleteComment();
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

module.exports = postRouter;
