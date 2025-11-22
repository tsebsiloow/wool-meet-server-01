// src/sockets/chat.events.js
const messageService = require('../services/message.service');
const redis = require('../config/redis').getClient ? require('../config/redis').getClient() : null;

exports.bind = (io, socket) => {
  const username = socket.user.username;
  const userId = socket.user.uid;

  // optionally emit recent messages to this socket only
  socket.on('get_recent', async (n=50) => {
    const msgs = await messageService.getRecent(n);
    socket.emit('messages', msgs);
  });

  socket.on('message', async (text) => {
    if(typeof text !== 'string') return;
    const trimmed = text.trim();
    if(!trimmed) return;
    const saved = await messageService.save({ from: username, text: trimmed, userId });
    const payload = { from: username, text: saved.text, createdAt: saved.createdAt };
    io.emit('message', payload);
    // publish to Redis channel if desired
    try {
      const client = require('../config/redis').getClient();
      if(client) client.publish('chat_messages', JSON.stringify(payload)).catch(()=>{});
    } catch(e){}
  });
};
