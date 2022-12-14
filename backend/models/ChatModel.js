const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    chats: [
      {
        messagesWith: { type: Schema.Types.ObjectId, ref: 'User' },
        messages: [
          {
            msg: { type: String, required: true },
            sender: { type: Schema.Types.ObjectId, ref: 'User' },
            receiver: { type: Schema.Types.ObjectId, ref: 'User' },
            date: { type: Date },
          },
        ],
        isBlocked: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Chat', chatSchema);
