// src/config/index.js
require('dotenv').config();
module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  REDIS_URL: process.env.REDIS_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'changeme',
  PORT: parseInt(process.env.PORT || '3000',10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};
