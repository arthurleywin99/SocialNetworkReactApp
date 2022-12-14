const express = require('express');
const User = require('../models/UserModel.js');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const expressAsyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const { randomBytes } = require('node:crypto');
const isEmail = require('validator/lib/isEmail.js');

dotenv.config();

const options = {
  auth: {
    api_key: process.env.SENDGRID_API,
  },
};

const resetRouter = express.Router();

resetRouter.post(
  '/',
  expressAsyncHandler(async (req, res) => {
    try {
      const { email } = req.body;
      if (!isEmail(email)) {
        return res.status(401).send({ message: 'Invalid email' });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      const token = randomBytes(32).toString('hex');

      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;

      await user.save();

      const resetUrl = `${process.env.BASE_URL}/reset/${token}`;

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
        to: user.email,
        subject: 'Hi there! Password reset request',
        html: `<p>Hey ${[...user.name.split(' ')]
          .at(-1)
          .toString()}, there was a request for password reset. <a href=${resetUrl}>Click this link to reset password</a> </p>
        <p>This token is valid for only 1 hours</p>`,
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

resetRouter.post(
  '/token',
  expressAsyncHandler(async (req, res) => {
    try {
      const { password, token } = req.body;
      if (!token) {
        return res.status(401).send({ message: 'Unauthorized' });
      }
      if (password.length < 6) {
        return res.status(401).send({ message: 'Invalid password' });
      }

      const user = await User.findOne({ resetToken: token });

      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      if (Date.now() > user.expireToken) {
        return res.status(401).send({ message: 'Token is expired. Generate new one' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);

      user.resetToken = '';
      user.expireToken = undefined;

      return res.status(200).send({ message: 'Password updated' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

module.exports = resetRouter;
