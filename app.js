const express = require('express');
const path = require ('path');
const session = require ('express-session');
const logger = require('morgan');
const { dispatcher, errorMiddleware } = require ('./lib/fluture-express');
const errorHandler = require('./middleware/error-handler');

module.exports.create = config => mongo => {
  const dispatch = dispatcher (path.resolve (__dirname, 'actions')) ({ db: mongo.db('test-db') });
  const handleErrors = errorMiddleware (errorHandler);
  const app = express();

  // TODO: Add middleware to handle login sessions

  app.use (session({ secret: config.clientSecret, resave: false, saveUninitialized: true }));
  app.use(logger(config.env));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.get('/', dispatch ('getallitems'));
  app.post('/', dispatch ('additem'));
  app.post('/login', dispatch ('login'));
  app.post('/register-user', dispatch ('register-user'));

  app.use(handleErrors);
    
  return app;
}
