require ('dotenv').config();
const express = require('express');
const path = require ('path');
const logger = require('morgan');
const { dispatcher, errorMiddleware } = require ('./lib/fluture-express');
const dispatch = dispatcher (path.resolve (__dirname, 'actions'));
const errorHandler = require('./middleware/error-handler');
const handleErrors = errorMiddleware (errorHandler);
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', dispatch ('index'));

app.use(handleErrors);

module.exports = app;
