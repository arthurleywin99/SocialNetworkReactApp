const express = require('express');
const dotenv = require('dotenv');
const expressAsyncHandler = require('express-async-handler');
const isEmail = require('validator/lib/isEmail.js');
const { generateToken } = require('../utils/utils.js');
const AdminAccount = require('../models/AdminAccountModel.js');
const bcrypt = require('bcrypt');
const { isAuth } = require('../utils/utils.js');

dotenv.config();

const adminAccountRouter = express.Router();

adminAccountRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const cryptedPassword = await bcrypt.hash('Aa@123456', salt);

    try {
      const adminAccount = new AdminAccount({
        name: 'Admin',
        email: 'admin@gmail.com',
        phoneNumber: '0354321915',
        password: cryptedPassword,
        username: 'admin',
      });
      await adminAccount.save();

      return res.status(200).send({ message: 'Seed successfully' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error.message}` });
    }
  })
);

adminAccountRouter.post(
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
      const userAdmin = await AdminAccount.findOne({ email: email }).select('+password');

      if (!userAdmin) {
        return res.status(401).send({
          message: 'The email address that you entered is not connected to any account!',
        });
      } else {
        const check = await bcrypt.compare(password, userAdmin.password);

        if (check) {
          return res.status(200).send({
            _id: userAdmin._id,
            name: userAdmin.name,
            email: userAdmin.email,
            username: userAdmin.username,
            profilePicUrl: userAdmin.profilePicUrl,
            phoneNumber: userAdmin.phoneNumber,
            token: generateToken(userAdmin),
          });
        } else {
          return res.status(401).send({ message: 'Invalid email or password' });
        }
      }
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error.message}` });
    }
  })
);

adminAccountRouter.post(
  '/update',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { name, email, phoneNumber, profilePicUrl } = req.body;

      const admin = await AdminAccount.findOne({ email });

      if (!admin) {
        return res.status(404).send({ message: 'Admin account not found' });
      }

      if (profilePicUrl) {
        await AdminAccount.findOneAndUpdate(
          { email },
          {
            $set: {
              name,
              phoneNumber,
              profilePicUrl,
            },
          }
        );
      } else {
        await AdminAccount.findOneAndUpdate(
          { email },
          {
            $set: {
              name,
              phoneNumber,
            },
          }
        );
      }

      return res.status(200).send({ message: 'Updated successfully' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error.message}` });
    }
  })
);

module.exports = adminAccountRouter;
