const Future = require ('fluture');
const { Render } = require ('../lib/fluture-express');

module.exports = req =>
  Future.resolve (Render ('index') ({ title: 'Functional Boilerplate' }))
