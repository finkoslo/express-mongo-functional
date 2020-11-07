const express = require('express');
const path = require ('path');
const logger = require('morgan');
const { dispatcher, middleware, errorMiddleware } = require ('./lib/fluture-express');
const errorHandler = require('./middleware/error-handler');
const authenticate = require ('./middleware/authenticate');

module.exports.create = config => mongo => {
  const dispatch = dispatcher (path.resolve (__dirname, 'actions')) ({ db: mongo.db('test-db'), config });
  const handleErrors = errorMiddleware (errorHandler);
  const auth = middleware (authenticate) ({ config });
  const app = express();

  app.use(logger(config.env));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.post('/login', dispatch ('login'));
  app.post('/register-user', dispatch ('register-user'));
  app.get('/items', auth, dispatch ('getallitems'));
  app.post('/item', auth, dispatch ('additem'));

  app.use(handleErrors);
    
  return app;
}
