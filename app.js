const express = require('express');
const path = require ('path');
const logger = require('morgan');
const { dispatcher, errorMiddleware } = require ('./lib/fluture-express');
const errorHandler = require('./middleware/error-handler');

module.exports.create = config => mongo => {
  const dispatch = dispatcher (path.resolve (__dirname, 'actions')) ({ db: mongo.db('test-db') });
  const handleErrors = errorMiddleware (errorHandler);
  const app = express();

  app.use(logger(config.env));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.get('/', dispatch ('getallitems'));
  app.post('/', dispatch ('additem'));

  app.use(handleErrors);
    
  return app;
}
