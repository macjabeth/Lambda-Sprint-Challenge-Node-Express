const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const server = express();

// middleware
server.use(express.json());
server.use(compression());
server.use(helmet());
server.use(cors());

if (server.get('env') === 'development') {
  server.use(morgan('tiny'));
}

// routers
server.use('/api/actions', require('./routes/actions'));
server.use('/api/projects', require('./routes/projects'));

// sanity check
server.get('/api', (req, res) => {
  res.status(200).json({ message: 'API Up & Running!' });
});

module.exports = server;
