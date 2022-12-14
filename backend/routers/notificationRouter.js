const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const { isAuth } = require("../utils/utils.js");
const Notification = require("../models/NotificationModel.js");
const User = require("../models/UserModel.js");

const notificationRouter = express.Router();

notificationRouter.get(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;

      const user = await Notification.findOne({ user: userId })
        .populate("notifications.user")
        .populate("notifications.post");

      return res.status(200).json(user.notifications);
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

notificationRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;

      const user = await User.findById(userId);

      if (user.unreadNotification) {
        user.unreadNotification = false;
        await user.save();
      }
      return res.status(200).send({ message: "Updated" });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

notificationRouter.get(
  "/read",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      user.unreadNotification = false;

      await user.save();
      return res
        .status(200)
        .send({ message: "Read all notification successfully" });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

module.exports = notificationRouter;
