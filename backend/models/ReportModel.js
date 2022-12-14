const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportModel = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    describe: { type: String, required: true },
    status: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Report', reportModel);
