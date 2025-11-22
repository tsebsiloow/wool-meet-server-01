// src/config/mongo.js
const mongoose = require('mongoose');
const { MONGO_URI } = require('./index');

module.exports = {
  connect: async () => {
    if(!MONGO_URI) throw new Error('MONGO_URI not set');
    await mongoose.connect(MONGO_URI, { dbName: 'chatdb' });
  },
  mongoose
};
