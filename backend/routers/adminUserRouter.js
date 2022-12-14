const express = require('express');
const dotenv = require('dotenv');
const expressAsyncHandler = require('express-async-handler');
const { isAuth } = require('../utils/utils.js');
const isEmail = require('validator/lib/isEmail.js');
const User = require('../models/UserModel.js');
const nodemailer = require('nodemailer');

dotenv.config();

const adminUserRouter = express.Router();

adminUserRouter.get(
  '/getall',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.find({});
      res.status(200).send(user);
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

adminUserRouter.post(
  '/sendmail',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { emailTo, subject, body } = req.body;

      if (!isEmail(emailTo)) {
        return res.status(401).send({ message: 'Invalid email' });
      }

      const user = await User.findOne({ email: emailTo.toLowerCase() });
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAILING_ADDRESS,
          pass: process.env.MAILING_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const mailOptions = {
        from: 'Admin',
        to: emailTo,
        subject: subject,
        html: `<p>${body}</p>`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
        }
      });

      return res.status(200).send({ message: 'Email sent successfully' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

adminUserRouter.get(
  '/lock/:userId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      await User.findOneAndUpdate({ _id: userId }, { $set: { status: false } });

      return res.status(200).send({ message: 'Locked' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

adminUserRouter.get(
  '/unlock/:userId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      await User.findOneAndUpdate({ _id: userId }, { $set: { status: true } });

      return res.status(200).send({ message: 'Unlocked' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

module.exports = adminUserRouter;
