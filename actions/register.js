const Future = require ('fluture');
const { Render } = require ('../lib/fluture-express');

module.exports = req =>
  Future.resolve (Render ('register') ({ title: 'Register', hideLogin: true }))
