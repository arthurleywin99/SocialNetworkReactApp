const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const { isAuth } = require('../utils/utils.js');
const dotenv = require('dotenv');
const User = require('../models/UserModel.js');
const Block = require('../models/BlockModel.js');
const Chat = require('../models/ChatModel.js');

dotenv.config();

const blockRouter = express.Router();

blockRouter.get(
  '/get/:userId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;

    const block = await Block.findOne({ user: userId }).populate('blocks.user');
    if (!block) {
      return res.status(404).send({ message: 'User not found' });
    }

    return res.status(200).json(block);
  })
);

blockRouter.get(
  '/add/:userToBlockId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;
      const { userToBlockId } = req.params;

      const user = await User.findById(userToBlockId);

      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      const block = await Block.findOne({ user: userId });

      const isBlocked = block.blocks.length > 0 && block.blocks.filter((item) => item.user.toString() === userToBlockId).length > 0;

      if (isBlocked) {
        return res.status(401).send({ message: 'User already blocked' });
      }

      block.blocks.push({ user: userToBlockId });
      await block.save();

      await Chat.findOneAndUpdate({ user: userId, 'chats.messagesWith': userToBlockId }, { $set: { 'chats.$.isBlocked': true } });
      await Chat.findOneAndUpdate({ user: userToBlockId, 'chats.messagesWith': userId }, { $set: { 'chats.$.isBlocked': true } });

      return res.status(200).send({ message: 'Blocked' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error.message}` });
    }
  })
);

blockRouter.get(
  '/remove/:userToUnblockId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;
      const { userToUnblockId } = req.params;

      const user = await User.findById(userToUnblockId);

      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      const block = await Block.findOne({ user: userId });

      const isBlocked = block.blocks.length > 0 && block.blocks.filter((item) => item.user.toString() === userToUnblockId).length > 0;

      if (!isBlocked) {
        return res.status(401).send({ message: 'User is unblocked before' });
      }

      const removeUser = block.blocks.map((user) => user.toString()).indexOf(userToUnblockId);

      block.blocks.splice(removeUser, 1);

      await block.save();

      await Chat.findOneAndUpdate({ user: userId, 'chats.messagesWith': userToUnblockId }, { $set: { 'chats.$.isBlocked': false } });
      await Chat.findOneAndUpdate({ user: userToUnblockId, 'chats.messagesWith': userId }, { $set: { 'chats.$.isBlocked': false } });

      return res.status(200).send({ message: 'Unblocked' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error.message}` });
    }
  })
);

module.exports = blockRouter;
