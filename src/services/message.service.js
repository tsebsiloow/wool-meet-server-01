// src/services/message.service.js
const Message = require('../models/Message');

exports.save = async ({ from, text, userId }) => {
  const m = new Message({ from, text, userId });
  return m.save();
};

exports.getRecent = async (n=50) => {
  const msgs = await Message.find().sort({ createdAt: -1 }).limit(n).lean();
  return msgs.reverse();
};
