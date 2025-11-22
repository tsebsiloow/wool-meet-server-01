// src/sockets/presence.events.js
// presence with Redis: manage sockets per username to handle multiple tabs
const redisConfig = require('../config/redis');
const redisClient = redisConfig.getClient ? redisConfig.getClient() : null;

const SOCKETS_KEY = (username) => `sockets:${username}`; // set of socketIds
const ONLINE_SET = 'online_users'; // set of usernames online

exports.bind = (io, socket) => {
  const username = socket.user.username;
  const sid = socket.id;
  // add socket
  (async ()=>{
    const client = redisConfig.getClient();
    if(client){
      await client.sadd(SOCKETS_KEY(username), sid);
      await client.sadd(ONLINE_SET, username);
      // set a TTL on the set (optional)
      await client.expire(SOCKETS_KEY(username), 60*60);
      // broadcast online list
      const list = await client.smembers(ONLINE_SET);
      io.emit('users', list);
      io.emit('system', `${username} が参加しました`);
    } else {
      // fallback: simple in-memory (not implemented)
      io.emit('system', `${username} が参加しました`);
    }
  })();

  socket.on('disconnect', async () => {
    const client = redisConfig.getClient();
    if(client){
      await client.srem(SOCKETS_KEY(username), sid);
      const remain = await client.scard(SOCKETS_KEY(username));
      if(remain === 0){
        // remove username from online set
        await client.srem(ONLINE_SET, username);
      }
      const list = await client.smembers(ONLINE_SET);
      io.emit('users', list);
      io.emit('system', `${username} が退出しました`);
    } else {
      io.emit('system', `${username} が退出しました`);
    }
  });
};
