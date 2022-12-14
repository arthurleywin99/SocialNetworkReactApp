const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const { isAuth } = require('../utils/utils.js');
const dotenv = require('dotenv');
const Chat = require('../models/ChatModel.js');
const User = require('../models/UserModel.js');

dotenv.config();

const chatRouter = express.Router();

chatRouter.get(
  '/getall',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await Chat.findOne({ user: userId }).populate('chats.messagesWith');
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    let chatSent = [];
    if (user.chats.length > 0) {
      chatSent = user.chats.map((chat) => ({
        messagesWith: chat.messagesWith._id,
        name: chat.messagesWith.name,
        profilePicUrl: chat.messagesWith.profilePicUrl,
        lastMessage: chat.messages[chat.messages.length - 1] ? chat.messages[chat.messages.length - 1].msg : '',
        date: chat.messages[chat.messages.length - 1].date,
      }));
    }

    return res.status(200).json(chatSent);
  })
);

chatRouter.get(
  '/check/:userToSendId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { userToSendId } = req.params;
    const chatList = await Chat.findOne({ user: userId });

    const userSent = chatList.chats.find((chat) => chat.messagesWith.toString() === userToSendId);

    const isSent = userSent.messages.length > 0;
    if (isSent) {
      return res.status(200).send({ message: 'Sent' });
    }
    return res.status(200).send({ message: 'Not sent yet' });
  })
);

chatRouter.get(
  '/delete/:messagesWith',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;
      const { messagesWith } = req.params;

      const user = await Chat.findOne({ user: userId });
      const chatToDelete = user.chats.find((chat) => chat.messagesWith.toString() === messagesWith);

      if (!chatToDelete) {
        return res.status(404).send({ message: 'Chat not found' });
      }

      const indexOf = user.chats.map((chat) => chat.messagesWith.toString()).indexOf(messagesWith);

      user.chats.splice(indexOf, 1);
      await user.save();

      return res.status(200).send({ message: 'Chat deleted' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

chatRouter.get(
  '/read',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      user.unreadMessage = false;
      await user.save();
      return res.status(200).send({ message: 'User read all messages' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

module.exports = chatRouter;
