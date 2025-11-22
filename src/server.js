// src/server.js
const http = require('http');
const app = require('./app');
const { initSocket } = require('./sockets');
const config = require('./config');

const PORT = process.env.PORT || config.PORT || 3000;
const server = http.createServer(app);

initSocket(server).catch(err=>{
  console.error('Failed to init socket:', err);
  process.exit(1);
});

server.listen(PORT, ()=> {
  console.log(`Server listening on ${PORT}`);
});
