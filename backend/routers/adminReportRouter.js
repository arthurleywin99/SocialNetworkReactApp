const express = require('express');
const dotenv = require('dotenv');
const { isAuth } = require('../utils/utils.js');
const expressAsyncHandler = require('express-async-handler');
const Report = require('../models/ReportModel.js');

dotenv.config();

const adminReportRouter = express.Router();

adminReportRouter.get(
  '/getall',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const reports = await Report.find({}).populate('user').populate('post');

      let results = [];

      results = reports.sort((a, b) => [new Date(a.createdAt) - new Date(b.createdAt)]);

      return res.status(200).json(reports);
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

adminReportRouter.get(
  '/solved/:reportId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { reportId } = req.params;
      const report = await Report.findById(reportId);

      if (!report) {
        return res.status(404).send({ message: 'Report not found' });
      }

      await Report.findOneAndUpdate({ _id: reportId }, { $set: { status: true } });

      return res.status(200).send({ message: 'Solved' });
    } catch (error) {
      return res.status(500).send({ message: `Server error: ${error}` });
    }
  })
);

module.exports = adminReportRouter;
