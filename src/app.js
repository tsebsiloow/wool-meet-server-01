// src/app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const mongo = require('./config/mongo');
const redis = require('./config/redis');

// initialize connections
mongo.connect().then(()=>console.log('Mongo OK')).catch(err=>{ console.error(err); process.exit(1); });
redis.connect().then(()=>console.log('Redis OK')).catch(err=>{ console.error(err); process.exit(1); });

const authRoutes = require('./routes/auth.routes');
const msgRoutes = require('./routes/message.routes');

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: config.CORS_ORIGIN === '*' ? '*' : config.CORS_ORIGIN.split(',') }));

app.use('/api', authRoutes);
app.use('/api', msgRoutes);

// optional health
app.get('/api/health', (req,res)=> res.json({ ok:true }));

// serve static client
app.use('/', express.static(__dirname + '/public'));

module.exports = app;
