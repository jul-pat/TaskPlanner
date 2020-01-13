const debug = require('debug')('app:startup');
const morgan = require('morgan');
const helmet = require('helmet');
const home = require('./routes/home');
const users = require('./routes/users');
const characters = require('./routes/characters');
const item = require('./routes/item');
const inventory = require('./routes/inventory');
const tasks = require('./routes/tasks');
const questbook = require('./routes/questbook');
const auth = require('./routes/auth');
const express = require('express');
const path = require('path');
const db = require('./db');

const main = async () => {
  const app = express();

  // Database configuration
  const connection = await db.connect();
  const models = db.load(connection);
  if (process.env.TEST_ENV || process.env.NODE_ENV) {
//     await connection.dropDatabase();
//     await db.initialize(models);
  }

  db.register(app, connection, models);

  //Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(helmet());
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  //Routes
  app.use('/', home);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/characters', characters);
  app.use('/api/item', item);
  app.use('/api/inventory', inventory);
  app.use('/api/tasks', tasks);
  app.use('/api/questbook', questbook);

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../frontend/build/index.html'));
  });

  //Listening
  // const host = process.env.HOST || '127.0.0.1';
  const port = process.env.PORT || 8080;
  app.listen(port, () => console.log(`Listening on port ${port}`));
};

main();
