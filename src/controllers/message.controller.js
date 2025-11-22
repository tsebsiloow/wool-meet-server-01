// src/controllers/message.controller.js
const messageService = require('../services/message.service');

exports.recent = async (req,res) => {
  const n = Math.min(500, parseInt(req.query.n||'50',10));
  const msgs = await messageService.getRecent(n);
  res.json(msgs);
};
