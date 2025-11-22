// src/services/auth.service.js
const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hash');
const { signToken } = require('../utils/jwt');

exports.register = async (username, password) => {
  const pwdHash = await hashPassword(password);
  const u = new User({ username, passwordHash: pwdHash });
  return u.save();
};

exports.login = async (username, password) => {
  const user = await User.findOne({ username }).lean();
  if(!user) return null;
  const ok = await comparePassword(password, user.passwordHash);
  if(!ok) return null;
  const token = signToken({ uid: user._id.toString(), username: user.username });
  return { token, username: user.username };
};
