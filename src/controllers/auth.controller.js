// src/controllers/auth.controller.js
const authService = require('../services/auth.service');

exports.register = async (req,res) => {
  try{
    const { username, password } = req.body;
    if(!username || !password) return res.status(400).json({ error: 'username/password required' });
    await authService.register(username, password);
    res.json({ ok: true });
  }catch(e){
    if(e.code === 11000) return res.status(409).json({ error: 'username taken' });
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
};

exports.login = async (req,res) => {
  try{
    const { username, password } = req.body;
    const r = await authService.login(username, password);
    if(!r) return res.status(401).json({ error: 'invalid credentials' });
    res.json(r);
  }catch(e){
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
};
