const express = require('express');
const path = require ('path');
const session = require ('express-session');
const logger = require('morgan');
const { dispatcher, middleware, errorMiddleware } = require ('./lib/fluture-express');
const errorHandler = require('./middleware/error-handler');
const authenticateMiddleware = require ('./middleware/authenticate');
const userMiddleware = require ('./middleware/user');

module.exports.create = config => mongo => {
  const dispatch = dispatcher (path.resolve (__dirname, 'actions')) ({ db: mongo.db('test-db'), hideLogin: false });
  const handleErrors = errorMiddleware (errorHandler);
  const auth = middleware (authenticateMiddleware);
  const user = middleware (userMiddleware);
  const app = express();
  
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.use(express.static(path.join(__dirname, 'public')));
  app.use (session({ secret: config.clientSecret, resave: false, saveUninitialized: true }));
  app.use(logger(config.env));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(user);

  app.get('/', dispatch ('index'));
  app.get('/login', dispatch ('login'));
  app.post('/login', dispatch ('postlogin'));
  app.get('/logout', dispatch ('logout'));
  app.get('/register-user', dispatch ('register'))
  app.post('/register-user', dispatch ('register-user'));
  app.get('/items', dispatch ('items'));
  app.post('/item', dispatch ('additem'));

  app.use(handleErrors);
    
  return app;
}
