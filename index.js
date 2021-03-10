const express = require('express');
const cors = require('cors');
const connection = require('./connection');
const { PORT } = require('./config');

const { json } = express;

const start = async () => {
  const app = express();
  const port = PORT || 5000;

  const corsOptions = { origin: '*', methods: 'GET,PUT,POST,DELETE' };
  app.use(cors(corsOptions));
  app.use(json({ extended: true }));
  app.use('/uploads', express.static(__dirname + '/uploads'));

  app.use('/api', require('./routes/route.auth'));
  app.use('/api', require('./routes/route.file'));

  app.listen(port, () => {
    console.log(`Сервер запущен. Порт: ${port}`);
  });
};

start();
