const express = require('express');
const User = require('../models/UserModel.js');
const Profile = require('../models/ProfileModel.js');
const Follower = require('../models/FollowerModel.js');
const Notification = require('../models/NotificationModel.js');
const Chat = require('../models/ChatModel.js');
const Block = require('../models/BlockModel.js');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const expressAsyncHandler = require('express-async-handler');
const isEmail = require('validator/lib/isEmail.js');
const { generateToken, isAuth } = require('../utils/utils.js');

dotenv.config();

const userPng = '';
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
const userRouter = express.Router();

userRouter.get(
  '/:username',
  expressAsyncHandler(async (req, res) => {
    const { username } = req.params;
    try {
      if (username.length < 1) {
        return res.status(200).send('Invalid');
      }

      if (!regexUserName.test(username)) {
        return res.status(200).send('Invalid');
      }
      const user = await User.findOne({
        username: username.toLowerCase(),
      });

      if (user) return res.status(200).send('Username already taken');

      return res.status(200).send('Available');
    } catch (error) {
      return res.status(500).send(`Server error: + ${error.message}`);
    }
  })
);

userRouter.get(
  '/get/:userId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).send({ message: `Server error: + ${error}` });
    }
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const cryptedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      username: req.body.username.toLowerCase(),
      password: cryptedPassword,
      profilePicUrl: req.body.profilePicUrl || userPng,
    });

    if (!isEmail(user.email)) {
      return res.status(401).send({ message: 'Invalid email' });
    }

    if (user.password.length < 6) {
      return res.status(401).send({ message: 'Password must be at least 6 characters' });
    }

    try {
      const userTemp = await User.findOne({ email: user.email });
      if (userTemp) {
        return res.status(401).send({ message: 'User already exists' });
      }

      const userCreated = await user.save();

      const profileFields = new Profile({
        user: userCreated._id,
        bio: req.body.bio,
        social: {
          facebook: req.body.facebook,
          twitter: req.body.twitter,
          youtube: req.body.youtube,
          instagram: req.body.instagram,
        },
      });

      const follower = new Follower({
        user: userCreated._id,
        followers: [],
        followings: [],
      });

      const notification = new Notification({
        user: userCreated._id,
        notifications: [],
      });

      const chat = new Chat({
        user: userCreated._id,
        chats: [],
      });

      const block = new Block({
        user: userCreated._id,
        blocks: [],
      });

      const profileCreated = await profileFields.save();
      const followerCreated = await follower.save();
      const notificationCreated = await notification.save();
      const chatCreated = await chat.save();
      const blockCreated = await block.save();

      res.status(200).send({
        userCreated: {
          _id: userCreated._id,
          name: userCreated.name,
          email: userCreated.email,
          username: userCreated.username,
          profilePicUrl: userCreated.profilePicUrl,
          newMessagePopup: userCreated.newMessagePopup,
          unreadMessage: userCreated.unreadMessage,
          unreadNotification: userCreated.unreadNotification,
          role: userCreated.role,
          status: userCreated.status,
          token: generateToken(userCreated),
        },
        profileCreated,
        followerCreated,
        notificationCreated,
        chatCreated,
        blockCreated,
      });
    } catch (error) {
      return res.status(500).send({ message: 'Server error: ' + error.messsage });
    }
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!isEmail(email)) {
      return res.status(401).send({ message: 'Invalid email' });
    }

    if (password.length < 6) {
      return res.status(401).send({ message: 'Password must be at least 6 characters' });
    }

    try {
      const user = await User.findOne({
        email: email.toLowerCase(),
      }).select('+password');

      if (!user) {
        return res.status(401).send({
          message: 'The email address that you entered is not connected to any account!',
        });
      } else {
        const check = await bcrypt.compare(password, user.password);
        if (check) {
          const notification = await Notification.findOne({ user: user._id });
          if (!notification) {
            await new Notification({
              user: user._id,
              notifications: [],
            }).save();
          }

          const chat = await Chat.findOne({ user: user._id });
          if (!chat) {
            await new Chat({ user: user._id, chats: [] }).save();
          }
          return res.status(200).send({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            profilePicUrl: user.profilePicUrl,
            newMessagePopup: user.newMessagePopup,
            unreadMessage: user.unreadMessage,
            unreadNotification: user.unreadNotification,
            role: user.role,
            status: user.status,
            token: generateToken(user),
          });
        } else {
          return res.status(401).send({ message: 'Invalid email or password' });
        }
      }
    } catch (error) {
      return res.status(500).send({ message: `Server error:  ${error.messsage}` });
    }
  })
);

module.exports = userRouter;
