// src/utils/jwt.js
const jwt = require('jsonwebtoken');
const config = require('../config');

const SECRET = config.JWT_SECRET || 'changeme';

exports.signToken = (payload, opts={ expiresIn: '7d' }) => {
  return jwt.sign(payload, SECRET, opts);
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch(e){
    return null;
  }
};
