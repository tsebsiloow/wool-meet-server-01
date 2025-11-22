// src/config/redis.js
const Redis = require('ioredis');
const { REDIS_URL } = require('./index');

let client = null;

module.exports = {
  connect: async () => {
    if(!REDIS_URL) throw new Error('REDIS_URL not set');
    client = new Redis(REDIS_URL);
    await client.ping();
  },
  getClient: () => client,
  createClient: (opts)=> new Redis(REDIS_URL, opts)
};
