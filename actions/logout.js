const Future = require ('fluture');
const { Redirect } = require ('../lib/fluture-express');
const S = require ('../lib/sanctuary');

module.exports = req =>
  S.map (path => { req.session.user = null; return Redirect (302) (path) })
        (Future.resolve ('/login'));
