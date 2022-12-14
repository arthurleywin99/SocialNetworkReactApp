const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const { isAuth } = require('../utils/utils.js');
const dotenv = require('dotenv');
const User = require('../models/UserModel.js');
const Post = require('../models/PostModel.js');
const Profile = require('../models/ProfileModel.js');
const Follower = require('../models/FollowerModel.js');
const Block = require('../models/BlockModel.js');
const Notification = require('../models/NotificationModel.js');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/utils.js');

dotenv.config();

const profileRouter = express.Router();

profileRouter.get(
  '/checkblocked/:username',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { username } = req.params;
    const userId = req.user._id;
    try {
      const userObj = await User.findOne({ username });
      if (!userObj) {
        return res.status(404).send({ message: 'User not found' });
      }
      const blockObj = await Block.findOne({ user: userObj._id });
      if (!blockObj) {
        return res.status(404).send({ message: 'Block list not found' });
      }
      const isExist = blockObj.blocks.find((block) => block.user.toString() === userId);
      if (isExist) {
        return res.status(200).send({ message: 'Blocked' });
      }
      return res.status(200).send({ message: 'Not blocked' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

profileRouter.get(
  '/:username',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { username } = req.params;
    try {
      const user = await User.findOne({ username: username.toLowerCase() });
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      const profile = await Profile.findOne({ user: user._id }).populate('user');

      return res.status(200).json({
        profile,
        token: generateToken(user),
      });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

profileRouter.get(
  '/posts/getall/:username',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { username } = req.params;
    try {
      const user = await User.findOne({ username: username.toLowerCase() });
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      const posts = await Post.find({ user: user._id }).sort({ createAt: -1 }).populate('user').populate('comments.user');

      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

profileRouter.get(
  '/followers/:userId',
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await Follower.findOne({ user: userId }).populate('followers.user');
      return res.status(200).json(user.followers);
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

profileRouter.get(
  '/following/:userId',
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await Follower.findOne({ user: userId }).populate('following.user');
      return res.status(200).json(user.following);
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

profileRouter.get(
  '/follow/:userToFollowId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { userToFollowId } = req.params;
    try {
      const user = await Follower.findOne({ user: userId });
      const userToFollow = await Follower.findOne({ user: userToFollowId });

      if (!user || !userToFollow) {
        return res.status(404).send({ message: 'User not found' });
      }
      const isFollowing =
        user.following.length > 0 && user.following.filter((following) => following.user.toString() === userToFollowId).length > 0;

      if (isFollowing) {
        return res.status(401).send({ message: 'User already followed' });
      }

      user.following.unshift({ user: userToFollowId });
      await user.save();

      userToFollow.followers.unshift({ user: userId });
      await userToFollow.save();

      const userToNotify = await Notification.findOne({ user: userToFollowId });
      const newNotification = {
        type: 'newFollower',
        user: userId,
        date: Date.now(),
      };

      userToNotify.notifications.unshift(newNotification);
      await userToNotify.save();

      const userUnread = await User.findById(userToFollowId);
      if (!userUnread.unreadNotification) {
        userUnread.unreadNotification = true;
        await userUnread.save();
      }

      return res.status(200).send({ message: 'Follow sucessfully' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

profileRouter.get(
  '/unfollow/:userToUnfollowId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { userToUnfollowId } = req.params;

    try {
      const user = await Follower.findOne({ user: userId });
      const userToUnfollow = await Follower.findOne({ user: userToUnfollowId });

      if (!user || !userToUnfollow) {
        return res.status(404).send({ message: 'User not found' });
      }

      const isFollowing =
        user.following.length > 0 && user.following.filter((following) => following.user.toString() === userToUnfollowId).length === 0;

      if (isFollowing) {
        return res.status(401).send({ message: 'User not followed previously' });
      }

      const removeFollowing = user.following.map((following) => following.user.toString()).indexOf(userToUnfollowId);

      user.following.splice(removeFollowing, 1);
      await user.save();

      const removeFollower = userToUnfollow.followers.map((follower) => follower.user.toString()).indexOf(userId);

      userToUnfollow.followers.splice(removeFollower, 1);
      await userToUnfollow.save();

      await Notification.findOneAndUpdate({
        user: userToUnfollowId,
        $pull: {
          notifications: {
            type: 'newFollower',
            user: userId,
          },
        },
      });

      return res.status(200).send({ message: 'Unfollow sucessfully' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

profileRouter.post(
  '/update',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;

      const profileFields = {
        user: userId,
        bio: req.body.bio,
        social: {
          facebook: req.body.facebook || '',
          twitter: req.body.twitter || '',
          youtube: req.body.youtube || '',
          instagram: req.body.instagram || '',
        },
      };

      await Profile.findOneAndUpdate({ user: userId }, { $set: profileFields }, { new: true });

      const imageProfile = { profilePicUrl: req.body.profilePicUrl };

      if (req.body.profilePicUrl) {
        await User.findOneAndUpdate({ _id: userId }, { $set: imageProfile }, { new: true });
      }

      return res.status(200).send({ message: 'Update successfully' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

profileRouter.post(
  '/settings/password',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;
      const { currentPassword, newPassword } = req.body;

      if (newPassword.length < 6) {
        return res.status(401).send({ message: 'Password must be at least 6 characters' });
      }
      const user = await User.findById(userId).select('+password');
      const isPassword = await bcrypt.compare(currentPassword, user.password);

      if (!isPassword) {
        return res.status(401).send({ message: 'Invalid password' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
      return res.status(200).send({ message: 'Update password successfully' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

profileRouter.post(
  '/settings/messagepopup',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;

      const user = await User.findById(userId);

      if (user && user.newMessagePopup) {
        user.newMessagePopup = false;
        await user.save();
      } else {
        user.newMessagePopup = true;
        await user.save();
      }
      return res.status(200).send({ message: 'Update message popup state successfully' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

profileRouter.get(
  '/getinfo/:userToFindId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { userToFindId } = req.params;
      const user = await User.findById(userToFindId);

      if (!user) {
        return res.status(404).send({ message: 'No User found' });
      }
      return res.status(200).send({ name: user.name, profilePicUrl: user.profilePicUrl });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

module.exports = profileRouter;
