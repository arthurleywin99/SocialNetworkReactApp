const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Chat = require('../models/ChatModel.js');
const User = require('../models/UserModel.js');
const Post = require('../models/PostModel.js');
const Notification = require('../models/NotificationModel.js');

dotenv.config();

exports.regexUsername = (username) => {
  const regex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
  return regex.test(username);
};

exports.generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      profilePicUrl: user.profilePicUrl,
      newMessagePopup: user.newMessagePopup,
      unreadMessage: user.unreadMessage,
      unreadNotification: user.unreadNotification,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

exports.isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

exports.sendMsg = async ({ senderId, receiverId, message }) => {
  try {
    const user = await Chat.findOne({ user: senderId });
    const msgSendToUser = await Chat.findOne({ user: receiverId });

    const newMsg = {
      sender: senderId,
      receiver: receiverId,
      msg: message,
      date: Date.now(),
    };

    const previousChat = user.chats.find((chat) => chat.messagesWith.toString() === receiverId);

    if (previousChat) {
      previousChat.messages.push(newMsg);
      await user.save();
    } else {
      const newChat = { messagesWith: receiverId, messages: [newMsg] };
      user.chats.unshift(newChat);
      await user.save();
    }

    const previousChatForReceiver = msgSendToUser.chats.find((chat) => chat.messagesWith.toString() === senderId);

    if (previousChatForReceiver) {
      previousChatForReceiver.messages.push(newMsg);
      await msgSendToUser.save();
    } else {
      const newChat = { messagesWith: senderId, messages: [newMsg] };
      msgSendToUser.chats.unshift(newChat);
      await msgSendToUser.save();
    }

    return { newMsg };
  } catch (error) {
    return { error };
  }
};

exports.loadMessages = async (userId, messagesWith) => {
  try {
    const user = await Chat.findOne({ user: userId }).populate('chats.messagesWith');

    const chat = user.chats.find((chat) => chat.messagesWith._id.toString() === messagesWith);

    if (!chat) {
      return { error: 'No chat found' };
    }
    return { chat };
  } catch (error) {
    return { error };
  }
};

exports.setMsgToUnread = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { error: 'User not found' };
    }
    if (!user.unreadMessage) {
      user.unreadMessage = true;
      await user.save();
    }
    return;
  } catch (error) {
    return { error };
  }
};

exports.getUserInfo = async (userToFindId) => {
  try {
    const user = await User.findById(userToFindId);

    if (!user) {
      return { error: 'No User found' };
    }
    return { name: user.name, profilePicUrl: user.profilePicUrl };
  } catch (error) {
    return { error };
  }
};

exports.deleteMsg = async (senderId, receiverId, messageId) => {
  try {
    const user = await Chat.findOne({ user: senderId });

    const chat = user.chats.find((chat) => chat.messagesWith.toString() === receiverId);

    if (!chat) {
      return { success: false };
    }

    const messageToDelete = chat.messages.find((message) => message._id.toString() === messageId);

    if (!messageToDelete) {
      return { success: false };
    }

    if (messageToDelete.sender.toString() !== senderId) {
      return { success: false };
    }

    const indexOf = chat.messages.map((message) => message._id.toString()).indexOf(messageToDelete._id.toString());

    chat.messages.splice(indexOf, 1);

    await user.save();

    return { success: true };
  } catch (error) {
    console.log(error);
  }
};

exports.likePost = async (postId, userId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return { error: 'No post found' };
    }

    const isLiked = post.likes.filter((like) => like.user.toString() === userId).length > 0;

    if (isLiked) {
      return { error: 'Post already liked' };
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

    const user = await User.findById(userId);

    const { name, profilePicUrl, username } = user;

    return {
      success: true,
      name,
      profilePicUrl,
      username,
      postByUserId: post.user.toString(),
    };
  } catch (error) {
    return { error };
  }
};

exports.unLikePost = async (postId, userId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return { error: 'No post found' };
    }

    const isLiked = post.likes.filter((like) => like.user.toString() === userId).length === 0;

    if (isLiked) return { error: 'Post not liked before' };

    const indexOf = post.likes.map((like) => like.user.toString()).indexOf(userId);

    post.likes.splice(indexOf, 1);

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

    const user = await User.findById(userId);

    const { name, profilePicUrl, username } = user;

    return {
      success: true,
      name,
      profilePicUrl,
      username,
      postByUserId: post.user.toString(),
    };
  } catch (error) {
    return { error };
  }
};
