const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminAccountSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    username: { type: String, required: true, unique: true, trim: true },
    profilePicUrl: { type: String },
    resetToken: { type: String },
    expireToken: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AdminAccount', adminAccountSchema);
