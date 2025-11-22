// src/sockets/index.js
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const redisConfig = require('../config/redis');
const { verifyToken } = require('../utils/jwt');
const chatEvents = require('./chat.events');
const presenceEvents = require('./presence.events');

let io = null;

async function initRedisAdapter(ioInstance){
  const pub = redisConfig.createClient();
  const sub = pub.duplicate();
  await pub.connect().catch(()=>{}); // ioredis automatically connects, but safe
  await sub.connect().catch(()=>{});
  ioInstance.adapter(createAdapter(pub, sub));
  return { pub, sub };
}

exports.initSocket = async (server) => {
  io = new Server(server, { cors: { origin: '*', methods: ['GET','POST'] } });

  // Redis adapter - use ioredis clients
  const redisClients = require('../config/redis');
  const pub = redisClients.createClient();
  const sub = pub.duplicate();

  // Note: ioredis instances connect automatically; adapter accepts them directly
  io.adapter(createAdapter(pub, sub));

  // auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if(!token) return next(new Error('auth required'));
    const payload = verifyToken(token);
    if(!payload) return next(new Error('invalid token'));
    socket.user = payload;
    next();
  });

  io.on('connection', (socket) => {
    // initialize per-socket handlers
    chatEvents.bind(io, socket);
    presenceEvents.bind(io, socket);
  });

  console.log('Socket.IO initialized');
  return io;
};
