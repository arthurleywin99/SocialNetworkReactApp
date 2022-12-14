const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const { isAuth } = require("../utils/utils.js");
const dotenv = require("dotenv");
const Follower = require("../models/FollowerModel.js");
const User = require("../models/UserModel.js");

dotenv.config();

const followerRouter = express.Router();

followerRouter.get(
  "/get/:userId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      const userFollowStats = await Follower.findOne({ user: user._id })
        .populate("followers.user")
        .populate("following.user");
      if (!userFollowStats) {
        return res.status(404).send({ message: "Not found" });
      }
      return res.status(200).json(userFollowStats);
    } catch (error) {
      return res.status(500).send({ message: `Server error ${error}` });
    }
  })
);

module.exports = followerRouter;
